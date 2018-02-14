// Importing  needed modules
import express from 'express'
import mongoose from 'mongoose'
import validate from 'express-validation'
import Joi from 'joi'
import slug from 'slug'
import markdown from 'marked'

// Importing needed helpers
import isAuth from '../helpers/auth'
import isBanned from '../helpers/ban'
import isKicked from '../helpers/kick'
import roomFixtures from '../fixtures/rooms'

// Importing needed models
const Room = mongoose.model('Room')
const Message = mongoose.model('Message')
const User = mongoose.model('User')

// Setting needed constants
const router = express.Router()

router.get('/:slug', isAuth, isBanned, validate(
  {
    params: {
      slug: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    }
  }), (req, res) => {
    Room.findOneAndUpdate({ slug: req.params.slug }, { $addToSet: { users: { _id: req.session.passport.user._id } }}, { new: true }).populate({ path: 'messages', populate: [{ path: 'user' }, { path: 'emote'}]}).populate({ path: 'users' }).exec(function(err, room) {
      if (err) {
        console.log(err)
      } else {
        Room.find().populate('creator').exec((err, rooms) => {
          rooms.forEach(room => {
            const numberOfUsers = room.users.length
            room.numberOfUsers = numberOfUsers
          });
          
          let i = 0
          let roomUsers = []
  
          room.users.forEach(user => {
            User.findOne({ _id: user._id }).exec().then(function(data) {
              roomUsers[i++] = data
            })
          });
  
          setTimeout(function() {
            console.log(roomUsers)
            res.render('room/show', { room, rooms, roomUsers, user: req.session.passport.user, md: markdown });
          }, 1000)
        })
      }
    });
});

router.post('/create', isAuth, isBanned, (req, res) => {
  console.log(req.session.passport)
  const room = new Room({
    name: req.body.name,
    slug: slug(req.body.name),
    numberOfUsers: 1,
    numberOfMessages: 0,
    dateCreation: new Date(),
    dateLastUpdate: new Date(),
    creator: req.session.passport.user._id,
    messages: [],
    users: [{ id: req.session.passport.user._id }]
  })

  room.save((err, item) => {
    if (err) console.log(err)
    res.redirect('back')
  })
})

router.get('/:id/delete', isAuth, isBanned, (req, res) => {
  Room.findByIdAndRemove(req.params.id, (err) => {
    if (err) console.log(err)
    req.app.get('socketio').emit('delete_room', req.body.id);
    res.redirect('back')
  })
})

module.exports = router;
