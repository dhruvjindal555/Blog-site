// Importing mongoose and necessary types for schema and models
import mongoose, { models, Schema } from "mongoose";

// Defining schema for User documents
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true  // Ensures no duplicate emails
    },
    password: {
        type: String
    },
    blogs: [{  // References to Blog documents authored by the user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}, { timestamps: true })  // Adds createdAt and updatedAt fields automatically

// Use existing User model if it exists, otherwise create a new one
const User = models.User || mongoose.model('User', UserSchema)

export default User
