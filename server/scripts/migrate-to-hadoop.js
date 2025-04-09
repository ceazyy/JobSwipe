const { MongoClient } = require('mongodb');
const hadoop = require('../src/config/hadoop');
require('dotenv').config();

async function migrateData() {
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await mongoClient.connect();
        const db = mongoClient.db();
        
        // Initialize Hadoop directories
        await hadoop.initialize();
        
        // Migrate users
        const users = await db.collection('users').find({}).toArray();
        for (const user of users) {
            await hadoop.writeData('users', user._id.toString(), user);
        }
        console.log(`Migrated ${users.length} users`);
        
        // Migrate jobs
        const jobs = await db.collection('jobs').find({}).toArray();
        for (const job of jobs) {
            await hadoop.writeData('jobs', job._id.toString(), job);
        }
        console.log(`Migrated ${jobs.length} jobs`);
        
        // Migrate matches
        const matches = await db.collection('matches').find({}).toArray();
        for (const match of matches) {
            await hadoop.writeData('matches', match._id.toString(), match);
        }
        console.log(`Migrated ${matches.length} matches`);
        
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoClient.close();
    }
}

migrateData(); 