import mongoose from "mongoose";
import {ENV} from '../utils/ENV.js'




export const connectDB =  ()=>{
    try {
        mongoose.connect(ENV.MONGO_URL).then((db)=>{
            console.log(`DATABASE CONNECTED ${db.connection.host}`)
        })   
    } catch (error) {
        console.log(error.message)
    }
}