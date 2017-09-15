import createError from 'http-errors'
import * as util from '../lib'
import Mongoose, {Schema} from 'mongoose'

const profileSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String },
  bio: {type: String},
  profilePicURI: {type: String, default: 'http://placehold.it/50x50'},
  profileBannerURI: {type: String, default: 'http://placehold.it/1000x200'},
  postedPosts: [{ type: Schema.Types.ObjectId, unique: true, ref: 'post' }],
  comments: [{ type: Schema.Types.ObjectId, unique: true, ref: 'comment' }],

  sentReq: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  friendReq: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  friends: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  friendsCount: {type: Number, default: 0},
  memberOf: [{ type: Schema.Types.ObjectId, unique: true, ref: 'page'}],
  memberOfCount: {type: Number, default: 0},
  adminOf: [{ type: Schema.Types.ObjectId, unique: true, ref: 'page' }],
  private: {type: Boolean, default: true},

  merch: [{ type: Schema.Types.ObjectId, unique: true, ref: 'merch' }],
  Bmerch: [{ type: Schema.Types.ObjectId, unique: true, ref: 'merch' }],
  Mcart: [{ type: Schema.Types.ObjectId, unique: true, ref: 'option' }],
  notifs: [{ type: Schema.Types.ObjectId, unique: true, ref: 'merch' }],
  
  created: {type: Date, default: Date.now}
})

const Profile = Mongoose.model('profile', profileSchema)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      CREATE
Profile.validateReqFile = function (req) {
  if(req.files.length > 1){
    return util.removeMulterFiles(req.files)
    .then(() => {
      throw createError(400, 'VALIDATION ERROR: only one file permited')
    })
  }

  let [file] = req.files
  if(file)
    if(file.fieldname !== 'avatar')
    return util.removeMulterFiles(req.files)
    .then(() => {
      throw createError(400, 'VALIDATION ERROR: file must be for avatar')
    })

  return Promise.resolve(file)
}

Profile.createProfileWithPhoto = function(req){
  return Profile.validateReqFile(req)
  .then((file) => {
    return util.s3UploadMulterFileAndClean(file)
    .then((s3Data) => {
      return new Profile({
        owner: req.user._id,
        username: req.user.username, 
        email: req.user.email,
        bio: req.body.bio,
        avatar: s3Data.Location,
      }).save()
    })
  })
}

Profile.create = function(req){
  // if(req.files){
  //   return Profile.createProfileWithPhoto(req)
  //   .then(profile => {
  //     req.user.profile = profile._id
  //     return req.user.save()
  //     .then(() => profile)
  //   })
  // }
  return new Profile({
    userID: req.user._id,
    name: req.user.username,
  })
  .save()
  .then(profile => {
    req.user.profile = profile._id
    return req.user.save()
    .then(() => profile)
  })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      READ

Profile.fetch = util.pagerCreate(Profile)

Profile.fetchOne = function(req){
  return Profile.findById(req.params.id)
  .then(profile => {
    if(!profile)
      throw createError(404, 'NOT FOUND ERROR: profile not found') 
    return profile
  })
}

Profile.search = function(req) {
  return Profile.find({ name: new RegExp(req.params.name, 'g')})
                .limit(20)
}

Profile.sendFriendReq = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    let friends = profile.friends
    let receivedReq = profile.friendReq
    let sentReq = profile.sentReq
    
    let isMe = profile._id.toString() == req.params.id
    if(isMe) return next(createError(401, 'You cannot send yourself a friend request'))

    let isFriend = friends.some( id => id.toString() === req.params.id.toString())
    if(isFriend) return next(createError(401, 'You are already friends!'))
    
    let received = receivedReq.some( id => id.toString() === req.params.id.toString())
    if(received) return next(createError(401, 'They sent you a friend request'))
    
    let sent = sentReq.some( id => id.toString() === req.params.id.toString())
    if(sent) return next(createError(401, 'You already sent a friend request'))
    // profile.sentReq.remove(req.params.id)
    profile.sentReq.push(req.params.id)
    return profile.save()
    .then( () => {
      return Profile.findById(req.params.id)
    })
    .then( their_profile => {
      let result = their_profile.friendReq.some( id => id.toString() === profile._id.toString());
      if(result) return next(createError(401, 'You already sent a friend request'));
      their_profile.friendReq.push(profile._id);
      return their_profile.save();
    })
  })
}


Profile.unsendFriendReq = function(req) {
  return Profile.findById(req.user.profile)
  .then( my_profile => {
    my_profile.sentReq.remove(req.params.id)
    return Profile.findById(req.params.id)
    .then( their_profile => {
      their_profile.friendReq.remove(my_profile._id);
      return their_profile.save();
    })
    .then( () => my_profile.save())
  })
}

Profile.acceptFriendReq = function(req) {
  return Profile.findById(req.user.profile)
  .then( my_profile => {
    let sentReq = my_profile.friendReq.some( pID => pID.toString() === req.params.id.toString());
    if(!sentReq) return next(createError(401, 'They have not sent you a friend request'));

    let isMe = my_profile._id.toString() == req.params.id;
    if(isMe) return next(createError(401, 'You cannot send yourself a friend request'));
    
    my_profile.friendReq.remove(req.params.id);
    my_profile.friends.push(req.params.id);
    return Profile.findById(req.params.id)
    .then( their_profile => {
      their_profile.sentReq.remove(my_profile._id);
      their_profile.friends.push(my_profile._id);
      return their_profile.save();
    })
    .then( () => my_profile.save())
  })
}

Profile.unfriend = function(req) {
  return Profile.findById(req.user.profile)
  .then( my_profile => {
    my_profile.friends.remove(req.params.id);
    return Profile.findById(req.params.id)
    .then( their_profile => {
      their_profile.friends.remove(my_profile._id);
      return their_profile.save();
    })
    .then( () => my_profile.save())
  })
}




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      UPDATE
Profile.updateProfileWithPhoto = function(req) {
  return Profile.validateReqFile(req)
  .then(file => {
    return util.s3UploadMulterFileAndClean(file)
    .then((s3Data) => {
      req.body.avatar = s3Data.Location
      return Profile.findByIdAndUpdate(req.params.id, req.body , {new: true, runValidators: true})
    })
  })
}

Profile.update = function(req){
  if(req.files && req.files[0])
    return Profile.updateProfileWithPhoto(req)
  let options = {new: true, runValidators: true}
  return Profile.findByIdAndUpdate(req.user.profile, req.body , options)
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      DELETE

Profile.delete = function(req){
  return Profile.findOneAndRemove({_id: req.params.id, owner: req.user._id})
  .then(profile => {
    if(!profile)
      throw createError(404, 'NOT FOUND ERROR: profile not found')
  })
}

export default Profile
