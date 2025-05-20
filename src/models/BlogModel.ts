// Importing mongoose and required types for defining schema and models
import mongoose, { models, Schema } from "mongoose";

// Defining the schema for Blog documents
const blogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    tags: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published']
    }
}, { timestamps: true })  // Adds createdAt and updatedAt fields

// Using existing Blog model if it exists, else creating a new one
const Blog = models.Blog || mongoose.model('Blog', blogSchema)

export default Blog
