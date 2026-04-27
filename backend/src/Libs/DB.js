import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_STR);
        console.log("Connect to DB success")
    }catch(err){
        console.log("Error when connect to DB", err);
        process.exit(1);
    }
}