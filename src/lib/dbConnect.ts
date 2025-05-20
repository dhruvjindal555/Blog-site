// Importing mongoose object from mongoose package
import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


export default async function dbConnect() {
    try {
        // If already connected, skip reconnecting
        if (connection.isConnected) {
            console.log("Already Connnected!")
            return;
        }

        // Connect to MongoDB using connection string from environment variable
       const res = await mongoose.connect(process.env.MONGO_URI || '')
        // console.log(res.connections[0].readyState);        
        connection.isConnected = res.connections[0].readyState
        console.log("Successfully connected to database.");        
    } catch (error) {
        console.log(error);
        throw new Error('Error connecting Database')
    }
}
