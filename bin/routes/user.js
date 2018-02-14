// Importing  needed modules
import express from 'express'
import mongoose from 'mongoose'

// Importing needed helpers
import isAuth from '../helpers/auth'

// Importing needed models
const User = mongoose.model('User')
const Room = mongoose.model('Room')

// Setting needed constants
const router = express.Router()
const ObjectId = mongoose.Types.ObjectId

router.get('/', isAuth, (req, res) => {
  User.find().sort({'date' : -1}).populate('message').exec((err, users) => {
    res.render('user/list', { users });
  });
});

router.get('/:id/kick/:room', isAuth, (req, res) => {
  Room.findOneAndUpdate({ _id: req.params.room }, { $pull: { 'users': new ObjectId(req.params.id) }}, { safe: true, multi: true }).exec(() => 
    res.redirect('back')
  )
})

module.exports = router;