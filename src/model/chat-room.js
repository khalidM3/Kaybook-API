import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

const roomSchema = new Schema({
  maker: {type: Schema.Types.ObjectId},
  name: {type: String, default: 'new room'},
  members: [{ type: Schema.Types.ObjectId, unique: true}],
  messages: [{ type: Schema.Types.ObjectId, ref: 'message'}]
});

const Room = Mongoose.model('room', roomSchema);

Room.create = function(req) {
  return new Room({
    maker: req.user.profile,
    members: [req.user.profile],
  })
  .save()
}

Room.me = function(req) {
  return Room.find({ members: req.user.profile });
}

Room.fetch = function(req) {
  return Room.findOne({ 
    _id: req.params.roomID,
     members: profile._id 
    });
}

Room.add = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    // let friend = profile.friends.some( PID => PID.toString() === req.params.friendPID.toString());
    // if(!friend) return next(createError(401, 'They are not your friend'));
    return Room.findById(req.params.roomID)
    .then( room => {
      // room.members.remove(req.params.friendPID);
      req.body.members.forEach( member => {
        room.members.push(member);
      });
      return room.save();
    })
  })
}

Room.subtract = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    // let friend = profile.friends.some( PID => PID.toString() === req.params.friendPID.toString());
    // if(!friend) return next(createError(401, 'They are not your friend'));
    return Room.findById(req.params.roomID)
    .then( room => {
      // room.members.remove(req.params.friendPID);
      req.body.members.forEach( member => {
        room.members.remove(member)
      })
      return room.save()
    })
  })
}


export default Room