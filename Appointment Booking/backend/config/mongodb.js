import mongoose from "mongoose";

let isConnectionListenerAttached = false;
let cachedConnectionPromise = null;

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    if (!isConnectionListenerAttached) {
        mongoose.connection.on("connected", () => console.log("Database Connected"));
        isConnectionListenerAttached = true;
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!cachedConnectionPromise) {
        cachedConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        await cachedConnectionPromise;
        return mongoose.connection;
    } catch (error) {
        cachedConnectionPromise = null;
        throw error;
    }
};

export default connectDB;
