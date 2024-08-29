// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URL as string;

if (!MONGO_URI) {
    throw new Error('Missing MONGO_URI environment variable');
}

let cachedClient: mongoose.Mongoose | null = null;
let cachedDb: mongoose.Connection | null = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!cachedClient) {
        cachedClient = await mongoose.connect(MONGO_URI);
    }

    cachedDb = cachedClient.connection;
    return cachedDb;
}

export default connectToDatabase;
