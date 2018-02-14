// Importing  needed modules
import express from 'express'
import mongoose from 'mongoose'

// Importing needed helpers
import isAuth from '../helpers/auth'
import whichPlatform from '../helpers/videos'

// Importing needed models
const Message = mongoose.model('Message')
const Room = mongoose.model('Room')

// Setting needed constants
const router = express.Router()

router.post('/send', isAuth, (req, res) => {
  const message = new Message({
    content: req.body.content,
    date: new Date(),
    dateLastUpdate: new Date(),
    user: req.session.passport.user._id,
  })

  const embedCode = whichPlatform(message.content)

  message.content = embedCode.length > 10 ? embedCode : message.content

  message.save((err, item) => {
    Room.update(
      { "name": req.body.room }, 
      { "$push": { "messages":  message._id } },
      function (err, raw) {
        if (err) console.log(err);
        console.log('The raw response from Mongo was ', raw);
      }
    )
    req.app.get('socketio').emit('new_message', message);
    res.redirect('back');
  });
});

router.post('/:id/update', isAuth, (req, res) => {
  Message.findById(req.params.id, (err, message) => {
    if (message.creator.username == req.user.username) {
      message.content = req.body.content;
    }
  })
})

router.get('/:id/delete', isAuth, (req, res) => {
    Message.findByIdAndRemove(req.params.id, (err) => {
      if (err) console.log(err)
      req.app.get('socketio').emit('delete_message', req.body.id);
      res.redirect('back')
    })
})

module.exports = router;