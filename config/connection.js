import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const url=process.env.DB_URL;
export const connectDB=async()=>{
try {
    await mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log('db connected via mongoose');
} catch (error) {
    console.log(error);
    throw new Error("Something went wrong in database");
}
}
