import mongoose from "mongoose";
import chalk from "chalk";

const log = console.log

export default async function connectDB(){
    try {
        const conn = await mongoose.connect(process.env.MONGO_TOKEN, {dbName: 'bot'})
        log((`\n🍃 MongoDB Connected 🍃`.yellow))
    } catch (error) {
        console.log(error)
        
    }
}