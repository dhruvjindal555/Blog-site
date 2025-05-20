// Importing mongoose object from mongoose package
const { mongoose } = require("mongoose");

let alreadyConnect = false;

export default async function dbConnect() {
    try {
        // If already connected, skip reconnecting
        if (alreadyConnect) {
            console.log('Already Connected!');
            return
        }

        // Connect to MongoDB using connection string from environment variable
        const response = await mongoose.connect(process.env.MONGO_URI)
        // console.log(response.connections[0].readyState);

        // Update connection status
        alreadyConnect = response.connections[0].readyState

        console.log('Successfully connected!');
    } catch (error) {
        console.log(error);
        throw new Error('Error connecting Database')
    }
}
