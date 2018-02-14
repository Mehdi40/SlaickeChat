import mongoose from 'mongoose'

const Room = mongoose.model('Room')

function isKicked(room) {
  return function(req, res, next) {
    Room.findById({room}, (err, room) => {
      if (room.users.includes(req.session.passport.user._id)) next();
      else res.redirect('/')
    })
  }
}

module.exports = isKicked()