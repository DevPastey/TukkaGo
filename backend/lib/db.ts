import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI ;


export const connectDB = async() => {

    if (!process.env.MONGO_URI) {
        throw new Error("❌ MONGO_URI not defined in environment variables");
    }
    
    try {
        const conn = await mongoose.connect(MONGO_URI as string);
        console.log(`mongo connected: ${conn.connection.host}`);
        
    } catch (error) {
       console.log('Error in connecting to MongoDB: ', error) ;
       process.exit(1) ;
    }
}