#!/usr/bin/env tsx

import { MongoClient } from 'mongodb';
import { requiredIndexes } from '../src/utils/database/indexes';

async function pushIndexes() {
  // Get database name based on environment variable instead of importing config
  const variant = process.env.NEXT_PUBLIC_APP_VARIANT || 'nouns';
  const databaseName = variant === 'lil-nouns' ? 'lil-gallery' : 'gallery';
  
  console.log(`🔗 Connecting to MongoDB for ${variant} variant...`);
  console.log(`📊 Database: ${databaseName}`);
  
  const client = new MongoClient(process.env.MONGODB_HOST!, {
    auth: {
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
    },
  });

  try {
    await client.connect();
    const db = client.db(databaseName);
    
    // Group indexes by collection
    const indexesByCollection = requiredIndexes.reduce((acc, indexDef) => {
      if (!acc[indexDef.collection]) {
        acc[indexDef.collection] = [];
      }
      acc[indexDef.collection].push(indexDef);
      return acc;
    }, {} as Record<string, typeof requiredIndexes>);

    for (const [collectionName, indexes] of Object.entries(indexesByCollection)) {
      const collection = db.collection(collectionName);
      
      console.log(`\n📁 Processing collection: ${collectionName}`);
      
      // Get existing indexes
      const existingIndexes = await collection.listIndexes().toArray();
      console.log(`   Found ${existingIndexes.length} existing indexes`);
      
      // Drop all indexes except _id
      for (const existingIndex of existingIndexes) {
        if (existingIndex.name !== '_id_') {
          try {
            await collection.dropIndex(existingIndex.name);
            console.log(`   🗑️  Dropped index: ${existingIndex.name}`);
          } catch (error) {
            console.warn(`   ⚠️  Could not drop index ${existingIndex.name}:`, (error as Error).message);
          }
        }
      }

      // Create new indexes
      for (const indexDef of indexes) {
        try {
          await collection.createIndex(indexDef.index, { 
            name: indexDef.name,
            background: true 
          });
          console.log(`   ✅ Created index: ${indexDef.name}`);
        } catch (error) {
          console.error(`   ❌ Failed to create index ${indexDef.name}:`, (error as Error).message);
          throw error;
        }
      }
    }

    console.log(`\n🎉 Successfully pushed ${requiredIndexes.length} indexes to ${databaseName} database!`);
    
  } catch (error) {
    console.error('❌ Error pushing indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

pushIndexes().catch(console.error);