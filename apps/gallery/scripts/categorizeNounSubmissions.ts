#!/usr/bin/env tsx

import { MongoClient } from "mongodb";
import sharp from "sharp";
import { TraitSchema } from "../src/db/schema/TraitSchema";
import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)

// Environment variables for MongoDB connection
const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

if (!MONGODB_HOST || !MONGODB_USER || !MONGODB_PASSWORD) {
    console.error("Missing required environment variables:");
    console.error("MONGODB_HOST:", !!MONGODB_HOST);
    console.error("MONGODB_USER:", !!MONGODB_USER);
    console.error("MONGODB_PASSWORD:", !!MONGODB_PASSWORD);
    process.exit(1);
}

// Determine database name based on variant (avoiding asset imports)
function getDatabaseName(): string {
    const variant = process.env.NEXT_PUBLIC_APP_VARIANT || 'nouns';
    return variant === 'lil-nouns' ? 'lil-gallery' : 'gallery';
}

interface ConvertedTrait {
    _id: string;
    name: string;
    previousType: string;
}

async function hasTransparency(imageDataUri: string): Promise<boolean> {
    try {
        // Extract base64 data from data URI
        const base64Data = imageDataUri.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Get raw pixel data to check if any pixels are actually transparent
        const { data } = await sharp(imageBuffer)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Check if any pixel has alpha < 255 (transparent or semi-transparent)
        for (let i = 3; i < data.length; i += 4) { // Alpha channel is every 4th byte
            if (data[i] < 255) {
                return true; // Found transparent pixel
            }
        }

        return false; // All pixels are fully opaque
    } catch (error) {
        console.error("Error checking transparency:", error);
        return false; // Assume opaque on error
    }
}

async function main() {
    const isDryRun = !process.argv.includes('--write');

    console.log(`🚀 Starting categorization script (${isDryRun ? 'DRY RUN' : 'WRITE MODE'})`);

    // Connect to MongoDB - use non-null assertion since we validated above
    const client = new MongoClient(MONGODB_HOST!, {
        auth: {
            username: MONGODB_USER,
            password: MONGODB_PASSWORD,
        },
    });

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const databaseName = getDatabaseName();
        console.log(`📂 Using database: ${databaseName}`);

        const database = client.db(databaseName);
        const collection = database.collection<TraitSchema>("nfts");

        // Find all submissions that are NOT "nouns" type
        const submissions = await collection.find({
            type: { $ne: "nouns" }
        }).toArray();

        console.log(`📊 Found ${submissions.length} non-noun submissions to check`);

        const convertedTraits: ConvertedTrait[] = [];
        let processedCount = 0;

        for (const submission of submissions) {
            processedCount++;

            try {
                console.log(`\n[${processedCount}/${submissions.length}] Checking: ${submission.name} (${submission.type})`);

                // Check if the artwork has transparency
                const hasTransparentPixels = await hasTransparency(submission.trait);

                if (!hasTransparentPixels) {
                    console.log(`  🔄 Converting to "nouns" type (no transparency detected)`);

                    const convertedTrait: ConvertedTrait = {
                        _id: submission._id.toString(),
                        name: submission.name,
                        previousType: submission.type
                    };

                    convertedTraits.push(convertedTrait);

                    if (!isDryRun) {
                        // Update the submission type to "nouns"
                        const result = await collection.updateOne(
                            { _id: submission._id },
                            { $set: { type: "nouns" } }
                        );

                        if (result.modifiedCount === 1) {
                            console.log(`  ✅ Successfully updated in database`);
                        } else {
                            console.log(`  ⚠️  Update failed or no changes made`);
                        }
                    } else {
                        console.log(`  📝 Would update to "nouns" type (dry run)`);
                    }
                } else {
                    console.log(`  ✅ Keeping current type (transparency detected)`);
                }
            } catch (error) {
                console.error(`  ❌ Error processing ${submission.name}:`, error);
            }
        }

        if (convertedTraits.length > 0) {
            console.log(`\n🔄 Converted traits:`);
            convertedTraits.forEach(trait => {
                console.log(`  • ${trait.name} (${trait.previousType} → nouns)`);
            });
        }

        // Summary
        console.log(`\n📋 SUMMARY:`);
        console.log(`Total submissions checked: ${submissions.length}`);
        console.log(`Converted to "nouns" type: ${convertedTraits.length}`);

        if (isDryRun && convertedTraits.length > 0) {
            console.log(`\n💡 To apply these changes, run the script with --write flag:`);
            console.log(`   pnpx tsx scripts/categorizeNounSubmissions.ts --write`);
        }

    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 Database connection closed");
    }
}

// Check if this script is being run directly
if (require.main === module) {
    main().catch(console.error);
} 