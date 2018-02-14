// Importing  needed modules
import express from 'express'
import mongoose from 'mongoose'
import { setTimeout } from 'timers';

// Importing needed models
const Room = mongoose.model('Room')

// Setting needed constants
const router = express.Router()

router.get('/', (req, res) => {
  if (req.session.passport != null && req.session.passport.user != null) {
    if (!req.session.passport.user._id) {
      req.app.get('socketio').emit('user_created', true);
      res.redirect('/auth/logout')
    }
    Room.find().populate('creator').exec((err, rooms) => {
      rooms.forEach(room => {
        const numberOfUsers = room.users.length
        room.numberOfUsers = numberOfUsers
      });

      res.render('room/list', { rooms, user: req.session.passport.user })
    })
  } else {
    res.render('index/index')
  }
})


module.exports = router