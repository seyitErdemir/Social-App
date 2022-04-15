const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

const PostSchema = new Schema({
     
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    like: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

 
const Post = mongoose.model('Post', PostSchema)

module.exports = Post