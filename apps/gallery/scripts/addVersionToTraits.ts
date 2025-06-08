#!/usr/bin/env tsx

import { MongoClient, ObjectId } from "mongodb";
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

// Determine database name based on variant
function getDatabaseName(): string {
    const variant = process.env.NEXT_PUBLIC_APP_VARIANT || 'nouns';
    return variant === 'lil-nouns' ? 'lil-gallery' : 'gallery';
}

interface TraitWithVersion extends TraitSchema {
    newVersion: number;
}

async function getAllTraitsInRemixTree(
    collection: any,
    rootId: ObjectId
): Promise<TraitSchema[]> {
    const cursor = collection.aggregate([
        {
            $match: {
                _id: rootId,
            },
        },
        {
            $graphLookup: {
                from: "nfts",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "remixedFrom",
                as: "descendants",
            },
        },
        {
            $project: {
                allVersions: {
                    $concatArrays: [
                        ["$$ROOT"],
                        "$descendants",
                    ],
                },
            },
        },
        {
            $unwind: "$allVersions",
        },
        {
            $replaceRoot: {
                newRoot: "$allVersions",
            },
        },
        {
            $group: {
                _id: "$_id",
                doc: { $first: "$$ROOT" },
            },
        },
        {
            $replaceRoot: {
                newRoot: "$doc",
            },
        },
        {
            $sort: {
                creationDate: 1,
            },
        },
    ]);

    return await cursor.toArray();
}

async function main() {
    const isDryRun = !process.argv.includes('--write');

    console.log(`=> Starting version assignment script (${isDryRun ? 'DRY RUN' : 'WRITE MODE'})`);

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_HOST!, {
        auth: {
            username: MONGODB_USER,
            password: MONGODB_PASSWORD,
        },
    });

    try {
        await client.connect();
        console.log("- Connected to MongoDB");

        const databaseName = getDatabaseName();
        console.log(`=> Using database: ${databaseName}`);

        const database = client.db(databaseName);
        const collection = database.collection<TraitSchema>("nfts");

        // Remixing was added on 2025-06-06
        const remixFeatureDate = new Date('2025-06-06').getTime();

        // Find all traits that don't have a version field or have version = 0
        const traitsWithoutVersion = await collection.find({
            $or: [
                { version: { $exists: false } },
                { version: 0 }
            ]
        }).toArray();

        console.log(`=> Found ${traitsWithoutVersion.length} traits without version numbers`);

        if (traitsWithoutVersion.length === 0) {
            console.log("- All traits already have version numbers!");
            return;
        }

        // Step 1: Bulk update all traits created before remix feature to version 1
        const preRemixTraits = traitsWithoutVersion.filter(trait => trait.creationDate < remixFeatureDate);
        console.log(`=> Setting ${preRemixTraits.length} pre-remix traits to version 1`);

        if (!isDryRun && preRemixTraits.length > 0) {
            const bulkResult = await collection.updateMany(
                {
                    creationDate: { $lt: remixFeatureDate },
                    $or: [
                        { version: { $exists: false } },
                        { version: 0 }
                    ]
                },
                { $set: { version: 1 } }
            );
            console.log(`- Bulk updated ${bulkResult.modifiedCount} pre-remix traits`);
        }

        // Step 2: Process only traits created after remix feature
        const postRemixTraits = traitsWithoutVersion.filter(trait => trait.creationDate >= remixFeatureDate);
        console.log(`=> Processing ${postRemixTraits.length} post-remix traits`);

        if (postRemixTraits.length === 0) {
            console.log("- No post-remix traits to process!");
            return;
        }

        // Find root traits created after remix feature
        const postRemixRootTraits = await collection.find({
            remixedFrom: { $exists: false },
            creationDate: { $gte: remixFeatureDate },
            $or: [
                { version: { $exists: false } },
                { version: 0 }
            ]
        }).toArray();

        console.log(`<3 Found ${postRemixRootTraits.length} post-remix root traits to process`);

        const traitsToUpdate: TraitWithVersion[] = [];
        let processedTrees = 0;

        for (const rootTrait of postRemixRootTraits) {
            processedTrees++;
            console.log(`\n[${processedTrees}/${postRemixRootTraits.length}] Processing remix tree for: ${rootTrait.name}`);

            // Get all traits in this remix tree, sorted by creation date
            const allTraitsInTree = await getAllTraitsInRemixTree(collection, rootTrait._id);

            console.log(`  => Found ${allTraitsInTree.length} traits in this tree`);

            // Assign version numbers based on creation date order
            allTraitsInTree.forEach((trait, index) => {
                const newVersion = index + 1;
                const traitWithVersion: TraitWithVersion = {
                    ...trait,
                    newVersion
                };
                traitsToUpdate.push(traitWithVersion);

                console.log(`    ${index + 1}. ${trait.name} > version ${newVersion} (${new Date(trait.creationDate).toISOString()})`);
            });
        }

        // Handle post-remix traits that have remixedFrom but weren't processed in trees
        // These could be traits that remix from pre-remix roots (which already have version 1)
        const unprocessedPostRemixTraits = await collection.find({
            remixedFrom: { $exists: true },
            creationDate: { $gte: remixFeatureDate },
            _id: { $nin: traitsToUpdate.map(t => t._id) },
            $or: [
                { version: { $exists: false } },
                { version: 0 }
            ]
        }).toArray();

        if (unprocessedPostRemixTraits.length > 0) {
            console.log(`\n=> Found ${unprocessedPostRemixTraits.length} unprocessed post-remix traits`);

            // Process each unprocessed trait by building its complete remix tree
            for (const trait of unprocessedPostRemixTraits) {
                console.log(`  >  Processing remix chain for: ${trait.name}`);
                
                // Find the root of this trait's remix tree by traversing up
                let currentTrait = trait;
                while (currentTrait.remixedFrom) {
                    const parent = await collection.findOne({ _id: currentTrait.remixedFrom });
                    if (!parent) {
                        console.log(`    ! Parent not found for ${currentTrait.name}, treating as orphaned`);
                        break;
                    }
                    currentTrait = parent;
                }

                // Now get all traits in this tree starting from the root
                const allTraitsInTree = await getAllTraitsInRemixTree(collection, currentTrait._id);
                console.log(`    => Found ${allTraitsInTree.length} traits in this remix tree`);

                // Assign version numbers based on creation date order
                allTraitsInTree.forEach((treeTrait, index) => {
                    // Skip if already processed or has version
                    if (treeTrait.version && treeTrait.version > 0) {
                        return;
                    }

                    const newVersion = index + 1;
                    const traitWithVersion: TraitWithVersion = {
                        ...treeTrait,
                        newVersion
                    };
                    traitsToUpdate.push(traitWithVersion);

                    console.log(`      ${index + 1}. ${treeTrait.name} > version ${newVersion} (${new Date(treeTrait.creationDate).toISOString()})`);
                });
            }
        }

        // Handle truly orphaned traits (parent doesn't exist at all)
        const orphanedPostRemixTraits = await collection.find({
            remixedFrom: { $exists: true },
            creationDate: { $gte: remixFeatureDate },
            _id: { $nin: traitsToUpdate.map(t => t._id) },
            $or: [
                { version: { $exists: false } },
                { version: 0 }
            ]
        }).toArray();

        if (orphanedPostRemixTraits.length > 0) {
            console.log(`\n=> Found ${orphanedPostRemixTraits.length} orphaned post-remix traits`);

            for (const orphanedTrait of orphanedPostRemixTraits) {
                console.log(`  >  Orphaned: ${orphanedTrait.name} > assigning version 1`);
                const traitWithVersion: TraitWithVersion = {
                    ...orphanedTrait,
                    newVersion: 1
                };
                traitsToUpdate.push(traitWithVersion);
            }
        }

        console.log(`\n=> SUMMARY:`);
        console.log(`Pre-remix traits (set to v1): ${preRemixTraits.length}`);
        console.log(`Post-remix traits to update: ${traitsToUpdate.length}`);
        console.log(`Post-remix root trees processed: ${processedTrees}`);
        console.log(`Unprocessed post-remix traits: ${unprocessedPostRemixTraits.length}`);
        console.log(`Truly orphaned traits: ${orphanedPostRemixTraits.length}`);

        if (!isDryRun && traitsToUpdate.length > 0) {
            console.log(`\n=> Updating post-remix database...`);
            let updatedCount = 0;

            for (const trait of traitsToUpdate) {
                try {
                    const result = await collection.updateOne(
                        { _id: trait._id },
                        { $set: { version: trait.newVersion } }
                    );

                    if (result.modifiedCount === 1) {
                        updatedCount++;
                    } else {
                        console.log(`  >  Failed to update ${trait.name}`);
                    }
                } catch (error) {
                    console.error(`  L Error updating ${trait.name}:`, error);
                }
            }

            console.log(`- Successfully updated ${updatedCount} post-remix traits`);
        } else if (traitsToUpdate.length > 0) {
            console.log(`\n=> To apply these changes, run the script with --write flag:`);
            console.log(`   pnpx tsx scripts/addVersionToTraits.ts --write`);
        }

    } catch (error) {
        console.error("L Script failed:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("=> Database connection closed");
    }
}

// Check if this script is being run directly
if (require.main === module) {
    main().catch(console.error);
}