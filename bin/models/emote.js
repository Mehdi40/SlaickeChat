// Importing needed modules
import mongoose from 'mongoose'

// Setting needed constants
const Schema = mongoose.Schema

const EmoteSchema = new Schema({
    type: {
      type: String,
      enum: ['happy', 'sad', 'plusone', 'minusone', 'lol'],
      default: 'happy'
    },
    number: {
      type: Number,
      default: 0
    },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: false }
});

const Emote = mongoose.model('Emote', EmoteSchema);

module.exports = Emote;