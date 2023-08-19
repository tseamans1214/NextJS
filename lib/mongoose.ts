import mongoose from 'mongoose';

let isConnected = false; // variable to check if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); // Prevent unknown queries

    if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
    // If the connection is already established, return without creating a new connection.
    if (isConnected) {
        console.log("MongoDB connection already established");
        return;
    }

    // Try to connect to the MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }

};