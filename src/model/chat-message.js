// IMPORTS
import Mongoose, {Schema} from 'mongoose'

// SCHEMA
const messageSchema = new Schema({
  roomID: {type: Schema.Types.ObjectId},
  posterID:  {type: Schema.Types.ObjectId},
  profilePicURI: {type: String},
  name: {type: String},
  content: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

// MODEL
const Message = Mongoose.model('message', messageSchema);

// INTERFACE
export default Message