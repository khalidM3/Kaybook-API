// IMPORTS
import createError from 'http-errors'
import Profile from './profile'
import Comment from './post-comment'
import Mongoose, {Schema} from 'mongoose'

// SCHEMA
const postSchema = new Schema({
  posterID: {type: Schema.Types.ObjectId, required: true, ref: 'profile'},
  postedID: {type: Schema.Types.ObjectId},
  feedID: {type: Schema.Types.ObjectId},
  pagePoster: {type: Schema.Types.ObjectId},
  type: {type: String},
  public: {type: Boolean},
  timeline: {type: Boolean},
  repost: {type: Schema.Types.ObjectId},
  
  title: {type: String},
  desc: {type: String},
  picURI: {type: String},
  picsURI: [{type: String}],
  likes: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  dislikes: [{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}],
  comments: [{ type: Schema.Types.ObjectId, ref: 'answer' }],

  friends: [{ type: Schema.Types.ObjectId }],
  timeFriends: [{ type: Schema.Types.ObjectId }],
  choice: [{type: Schema.Types.ObjectId, unique: true, ref: 'choice'}],

  choices: [{
    name: { type: String},
    picURI: {type: String},
    voters:[{ type: Schema.Types.ObjectId, unique: true, ref: 'profile'}]
  }],
  searchTerms: [{type: String}],
  reports: [{
    owner: {type: Schema.Types.ObjectId, unique: true, ref: 'profile'},
    message: {type: String},
    sexual: {type: Boolean},
    violent: {type: Boolean},
    abusive: {type: Boolean},
    promotion: {type: Boolean},
    spam: {type: Boolean},
    infringe: {type: Boolean},
    created: { type: Date, default: Date.now }
  }],
  edited: {type: Boolean, default: false},
  
  created: { type: Date, default: Date.now }
})

// MODEL
const Post = Mongoose.model('post', postSchema)


// STATIC METHODS
Post.createPost = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))
    
  return Profile.findById(req.user.profile)
  .then( profile => {
    req.body.posterID = profile._id
    req.body.timeline = false
    let isMember = profile.memberOf.some( pageID => pageID.toString() === req.params.postedID.toString())
    if(!isMember) return next(createError(401, 'Only members can post'))
    req.body.postedID = req.params.postedID
    req.body.friends = [...profile.friends, profile._id]
    return new Post(req.body).save()
  })
}

Post.createFeed = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))
  
  return Profile.findById(req.user.profile)
  .then( profile => {
    let admin = profile.adminOf.some( pageID => pageID.toString() === req.params.pageID)
    if(!admin) return next(createError(401, 'You are not the owner of this page'))
    req.body.posterID = profile._id
    req.body.feedID = req.params.pageID
    return new Post(req.body).save()
  })
}

Post.createTime = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))
  
  return Profile.findById(req.user.profile)
  .then( profile => {
    req.body.posterID = profile._id
    req.body.postedID = profile._id
    req.body.timeline = true
    
    req.body.timeFriends = [...profile.friends, profile._id]
    console.log(req.body)
    return new Post(req.body).save()
  })
}

Post.repost = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))
  
  return Profile.findById(req.user.profile)
  .then( profile => {
    req.body.posterID = profile._id
    req.body.postedID = profile._id
    req.body.timeline = false
    req.body.type = 'repost'

    return Post.findById(req.params.id)
    .then( post => {
      req.body.repost = post._id
      req.body.friends = [...req.body.friends, profile._id]
      return new Post(req.body).save()
    })
  })
}

Post.report = function(req) {
  return Post.findById(req.params.postID)
  .then( post => {
    req.body.owner = req.user.profile
    post.reports.push(req.body)
    return post.save()
  })
}

Post.fetch = function(req) {
  return Post.findById(req.params.id)
  .populate('posterID')
  .populate({
    path: 'comments',
    populate: {
      path: 'posterID'
    }
  })
}

Post.fetchPosts = function(req) {
  return Post.find({ postedID: req.params.pageID })
  .populate('posterID')
}

Post.fetchFeed = function(req) {
  return Post.find({ feedID: req.params.pageID })
  .populate('posterID')
}

Post.vote = function(req) {
  return Post.findById(req.params.postID)
  .then( post => {
    let id = req.user.profile
    post.choices.forEach( (choice, i )=> {
      let voted = choice.voters.some( PID => PID.toString() === id.toString())
      let match = choice._id.toString() === req.params.choiceID
      let end = i === post.choices.length - 1
      if(match) {
        if(voted) return choice.voters.remove(id)
        choice.voters.push(id)
      } else {
        choice.voters.remove(id)
      }
      
      if(end) return post.save().then( update => post = update)
    })
    return post
  })
}

Post.fetchRandom = function(req) {
  return Post.find({ timeline: false})
  .populate('posterID')
  .populate({
    path: 'repost',
    populate: {
      path: 'posterID',
    }
  })
}

Post.fetchFriends = function(req) {
  return Post.find({ friends: req.user.profile})
    .populate('posterID')
    .populate({
      path: 'repost',
      populate: {
        path: 'posterID',
      }
    })
}

Post.fetchTimeline = function(req) {
    return Post.find({ timeFriends: req.user.profile})
      .populate('posterID')
}

Post.me = function(req) {
  return Post.find({ posterID: req.user.profile})
  .populate('posterID')
}

Post.joinedPosts = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    return Post.find({ postedID: { $in: profile.memberOf } })
     .populate('posterID')
  })
}

Post.joinedFeed = function(req) {
  return Profile.findById(req.user.profile)
  .then( profile => {
    return Post.find({ feedID: { $in: profile.memberOf } })
                .populate('posterID')
  })
}

Post.publicPosts = function(req) {
  return Post.find({ posterID: req.params.profileID, timeline: false})
  .populate('posterID')
  .populate({
    path: 'repost',
    populate: {
      path: 'posterID',
    }
  })
}

Post.publicTimeline = function(req) {
  return Profile.findById(req.params.profileID)
  .then( profile => {
    if(profile.private) return next(createError(401, 'this profile is private'))
    return Post.find({ postedID: profile._id })
    .populate('posterID')
  })
}

Post.like = function(req) {
  let id = req.user.profile
  return Post.findById(req.params.postID)
  .then( post => {
    let liked = post.likes.some( PID => PID.toString() === id.toString())
    if(liked) post.likes.remove(id)
    post.dislikes.remove(id)
    if(!liked) post.likes.push(id)
    return post.save()
  })
}

Post.dislike = function(req) {
  let id = req.user.profile
  return Post.findById(req.params.postID)
  .then( post => {
    let disliked = post.dislikes.some(PID => PID.toString() === id.toString())
    if(disliked) post.dislikes.remove(id)
    post.likes.remove(id)
    if(!disliked) post.dislikes.push(id)
    return post.save()
  })
}

Post.search = function(req) {
  return Post.find({searchTerms: `#${req.params.term}` })
  .populate('posterID')
}


Post.update = function(req) {
  return Post.findById(req.params.postID)
  .then( post => {
    let poster = post.posterID.toString() == req.user.profile.toString()
    if(!poster) return next(createError(400, 'You are not the owner of this post!'))
    return Post.findByIdAndUpdate(post._id, req.body, { new: true })
  })
}

Post.delete = function(req) {
  return Post.findById(req.params.id)
  .then( post => {
    let owner = req.user.profile.toString() === post.posterID.toString()
    if(!owner) return next(createError(401, 'You are not the owner of the post'))
    Comment.remove({ postID: post._id}).exec()
    return Post.findByIdAndRemove(post._id)
  })
}

// INTERFACE
export default Post