import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

const messageSchema = new Schema({
  roomID: {type: Schema.Types.ObjectId},
  posterID:  {type: Schema.Types.ObjectId},
  profilePicURI: {type: String},
  name: {type: String},
  content: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

const Message = Mongoose.model('message', messageSchema);



export default Message