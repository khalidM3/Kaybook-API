import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

const merchSchema = new Schema({ 
  posterID: {type: Schema.Types.ObjectId},
  postedID: {type: Schema.Types.ObjectId},
  name: {type: String},
  desc: {type: String},
  picURI: [{type: String}],
  options:[{type: Schema.Types.ObjectId, ref: 'option'}]
});

const Merch = Mongoose.model('merch', merchSchema);

Merch.create = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'));

  return Profile.findById(req.user.profile)
  .then( profile => {
    let admin = profile.adminOf.some( pageID => pageID.toString() === req.params.pageID.toString());
    // let member = profile.memberOf.some( pageID => pageID.toString() === req.params.pageID.toString());
    if(!admin) return next(createError(401, 'You are not the admin of this page'));
    if( admin) {
      req.body.posterID = profile._id;
      req.body.postedID = req.params.pageID;
    }
    return new Merch(req.body).save()
    .then( merch => {
      profile.merch.push(merch._id);
      return profile.save()
      .then( () => merch)
    })
  })
}

Merch.fetch = function(req) {
  return Merch.find({ postedID: req.params.pageID})
  .populate('options')
}

Merch.fetchRandom = function(req) {
  return Merch.find({ })
  .populate('options')
}

Merch.delete = function(req) {
  return Merch.findOneAndRemove({ _id: req.params.id, posterID: req.user.profile})
  .then( () => {
    return Option.remove({ posterID: req.user.profile, postedID: req.params.id })
  })
}





export default Merch