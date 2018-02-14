// Importing needed modules
import mongoose from 'mongoose'

// Setting needed constants
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    content: String,
    date: Date,
    dateLastUpdate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emote: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    platform: String
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;