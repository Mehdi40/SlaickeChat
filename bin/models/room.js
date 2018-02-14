// Importing needed modules
import mongoose from 'mongoose'

// Setting needed constants
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    name: String,
    slug: String,
    dateCreation: Date,
    dateLastUpdate: Date,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    messages:
    [
      {
        type: mongoose.Schema.Types.ObjectId, ref: "Message"
      }
    ],
    users:
    [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        authorization:{
          type: String,
          enum: ['ok', 'kick', 'ban', 'muted'],
          default: 'ok'
        },
      }
    ]
});

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room