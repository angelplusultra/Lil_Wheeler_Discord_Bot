import mongoose, { mongo } from "mongoose";
import chalk from "chalk";
import colors from 'colors'

const log = console.log

export default async function connectDB(){
    try {
        const conn = await mongoose.connect(process.env.MONGO_TOKEN, {dbName: 'bot'})
        
        switch(mongoose.connection.readyState){
            case 1: 
                log((`\n🍃 MongoDB Connected`.yellow));
                break;
            case 0:
                log((`\n💀 MongoDB Disconnected`.r));
                break;
            case 2:
                log((`\n🔌 MongoDB Connecting`.yellow));
                break;
            case 3:
                log((`\n MongoDB Disconnecting`.red.dim));
                break;
        }
    } catch (error) {
        console.log(error)
        
    }
}