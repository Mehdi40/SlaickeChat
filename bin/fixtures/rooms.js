import mongoose from 'mongoose'

const Room = mongoose.model('Room')

const room1 = {
  name: 'Accueil',
  slug: 'accueil',
  numberOfUsers: 10,
  numberOfMessages: 135,
  dateCreation: new Date(),
  dateLastUpdate: new Date(),
  
  creator: ""
}

const room2 = {
  name: 'Room LOL',
  slug: 'room_lol',
  numberOfUsers: 16,
  numberOfMessages: 2342,
  dateCreation: new Date(),
  dateLastUpdate: new Date(),
  
  creator: ""
}

const createRooms = () => {
  Room.save(room1);
  Room.save(room2);
}

module.exports = createRooms;