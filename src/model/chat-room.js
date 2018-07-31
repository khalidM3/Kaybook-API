// IMPORTS
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

// SCHEMA
const roomSchema = new Schema({
  maker: {type: Schema.Types.ObjectId},
  name: {type: String, default: 'new room'},
  members: [{ type: Schema.Types.ObjectId, unique: true}],
  messages: [{ type: Schema.Types.ObjectId, ref: 'message'}]
})

// MODEL
const Room = Mongoose.model('room', roomSchema)

// STATIC METHODS
Room.create = function(req) {
  return new Room({
    maker: req.user.profile,
    members: [req.user.profile],
  })
  .save()
}

Room.me = function(req) {
  return Room.find({ members: req.user.profile })
}

Room.fetch = function(req) {
  return Room.findOne({ 
    _id: req.params.roomID,
     members: profile._id 
    })
}

Room.add = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    return Room.findById(req.params.roomID)
    .then( room => {
      req.body.members.forEach( member => {
        room.members.push(member)
      })
      return room.save()
    })
  })
}

Room.subtract = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    return Room.findById(req.params.roomID)
    .then( room => {
      req.body.members.forEach( member => {
        room.members.remove(member)
      })
      return room.save()
    })
  })
}

// INTERFACE
export default Room