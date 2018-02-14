// Importing  needed modules
import express from 'express'
import mongoose from 'mongoose'

// Importing needed helpers
import isAuth from '../helpers/auth'

// Importing needed models
const Message = mongoose.model('Message')
const Emote = mongoose.model('Emote')

// Setting needed constants
const router = express.Router()

router.get('/send/:message_id', isAuth, (req, res) => {
  const emote = new Emote({
    type: 'happy',
    number: 1,
    message: req.params.message_id
  })

  Emote.findOneAndUpdate({
    type: 'happy',
    message: req.params.message_id,
  },{ 
    $inc : { number : 1 }
  },{
    upsert: true,
    setDefaultsOnInsert: true
  })

  Message.findOneAndUpdate({
    _id: req.params.message_id
  },
  {
    $push: { emote: emote._id }
  }).exec(function(err, room) {
    if (err) {
      console.log(err)
    }
  });
  
  req.app.get('socketio').emit('new_emote', emote)
  res.redirect('back')
});

module.exports = router;