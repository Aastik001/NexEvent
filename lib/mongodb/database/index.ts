import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    console.log('Attempting to connect to MongoDB...');
    console.log('Environment variables:', {
        MONGODB_URI: MONGODB_URI ? '*****' : 'undefined'
    });

    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!MONGODB_URI) {
        const error = new Error('MONGODB_URI is missing from environment variables');
        console.error('Connection error:', error.message);
        throw error;
    }

    try {
        console.log('Creating new MongoDB connection');
        cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
            dbName: 'NexEvent',
            bufferCommands: false,
        });

        cached.conn = await cached.promise;
        console.log('Successfully connected to MongoDB');
        return cached.conn;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}
