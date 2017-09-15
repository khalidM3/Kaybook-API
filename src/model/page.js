import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

const pageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, required: true },
  profileID: {type: Schema.Types.ObjectId, required: true },
  admins: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  pageName: { type: String, required: true, unique: true },
  pageDesc: { type: String },
  greeting: {type: String},
  pageBannerURI: {type: String, default: 'http://placehold.it/1000x200'},
  posts: [{ type: Schema.Types.ObjectId, unique: true, ref: 'post' }],
  members: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  memberCount: {type: Number, default: 0},
  merch: [{ type: Schema.Types.ObjectId, unique: true, ref: 'merch'}],
  public: {type: Boolean, default: false},
  created: {type: Date, default: Date.now}
});


const Page = Mongoose.model('page', pageSchema);

Page.create = function(req) {
  return new Page({
    userID: req.user._id,
    profileID: req.user.profile,
    admins: [req.user.profile],
    pageName: req.body.pageName,
    pageDesc: req.body.pageDesc,
    public: req.body.public,
  })
  .save()
  .then( page => {
    return Profile.findById(req.user.profile)
    .then( profile => {
      profile.adminOf.push(page._id)
      return profile.save()
    })
    .then( () => page)
  })
}

Page.search = function(req) {
  return Page.find({pageName: new RegExp(req.params.name, 'g')})
              .limit(10)
}

Page.findPages = function(req) {
  return Page.find({ profileID: req.params.profileID })
}

Page.join = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    let isMember = profile.memberOf.some( PageID => PageID.toString() === req.params.pageID.toString());
    if(isMember) return next(createError(401, 'You are already a member'));
    profile.memberOf.push(req.params.pageID);
    ++profile.memberOfCount;
    return profile.save();
  })
  .then( profile => {
    return Page.findById(req.params.pageID)
    .then( page => {
      let hasMember = page.members.some(PID => PID.toString() === profile._id.toString());
      if(hasMember) return next(createError(401, 'You are already a member 2'));
      page.members.push(profile._id);
      ++page.membersCount;
      return page.save();
    })
  })
}

Page.leave = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    profile.memberOf.remove(req.params.pageID)
    --profile.memberOfCount
    return profile.save()
  })
  .then( profile => {
    Page.findById(req.params.pageID)
    .then( page => {
      page.members.remove(profile._id)
      --page.memberCount
      return page.save()
    })
  })
}

Page.update = function(req) {
  if (req._body !== true) return next(createError(400, 'nothing to update'));
  return Page.findOneAndUpdate({ _id: req.params.id, userID: req.user._id}, req.body, { new: true } )
}

export default Page