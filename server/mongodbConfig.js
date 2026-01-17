import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

const uri = "mongodb+srv://jrymnd:itslorcan18@cluster0.zegt9qg.mongodb.net/TodoAppDB?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        // Mongoose connects once and stays connected for the life of the server
        await mongoose.connect(uri);
        console.log("✅ Successfully connected to MongoDB via Mongoose!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        // Exit process with failure if we can't connect to the database
        process.exit(1);
    }
};

export default connectDB;