import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Post from './post'
import Mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema({
    posterID: {type: Schema.Types.ObjectId, ref:'profile'},
    postedID: {type: Schema.Types.ObjectId, required: true},
    postID: {type: Schema.Types.ObjectId},
    parents: [{type: Schema.Types.ObjectId}],
    answer: {type: String, required: true},
    answerImgURI: {type: String},
    picURIs: [{ type: String}],
    replies: [{ type: Schema.Types.ObjectId, ref: 'answer' }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'profile' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'profile' }],
    level: {type: Number, default: 0},
    reports: [{
      owner: {type: Schema.Types.ObjectId, ref: 'profile'},
      message: {type: String},
      sexual: {type: Boolean},
      violent: {type: Boolean},
      abusive: {type: Boolean},
      promotion: {type: Boolean},
      spam: {type: Boolean},
      infringe: {type: Boolean},
      created: { type: Date, default: Date.now }
    }],
    created: {type: Date, default: Date.now}
  });

const Comment = Mongoose.model('answer', commentSchema);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      CREATE


Comment.create = function(req) {
  if(!req._body) return next(createError(401, 'request body expected')); 
  return Post.findById(req.params.postID)
  .then( post => {
    req.body.posterID = req.user.profile
    req.body.postedID = post._id
    req.body.postID = post._id
    return new Comment(req.body).save()
    .then( comment => {
      post.comments.push(comment)
      return post.save()
    })
  })
}

Comment.reply = function(req) {
  if(!req._body) return next(createError(401, 'request body expected'));
  return Comment.findById( req.params.answerID)
  .then( comment => {
    req.body.posterID = req.user.profile
    req.body.postedID = comment._id
    req.body.postID = comment.postID
    req.body.parents = [...comment.parents, comment._id]
    return new Comment(req.body).save()
    .then( replycomment => {
      comment.replies.push(replycomment)
      return comment.save()
    })
  })
}

Comment.report = function(req) {
  return Comment.findById(req.params.answerID)
  .then( comment => {
    req.body.owner = req.user.profile
    comment.reports.push(req.body)
    return comment.save()
  })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      READ

Comment.fetch = function(req) {
  return Comment.findById(req.params.answerID)
  .populate({
    path: 'replies',
    populate: {
      path: 'posterID'
    }
  })
}

Comment.me = function(req){
  return Comment.find({ posterID: req.user.profile})
  .populate('posterID');
}

Comment.upvote = function(req) {
  return Comment.findById(req.params.answerID)
  .then( comment => {
    let upvoted = comment.upvotes.some( PID => PID.toString() === req.user.profile.toString());
    if(upvoted) {
      comment.upvotes.remove(req.user.profile);
      return comment.save();
    }
    comment.downvotes.remove(req.user.profile);
    comment.upvotes.push(req.user.profile);
    return comment.save();
  })
}

Comment.downvote = function(req) {
  return Comment.findById(req.params.answerID)
  .then( comment => {
    let downvoted = comment.downvotes.some( PID => PID.toString() === req.user.profile.toString());
    if(downvoted) {
      comment.downvotes.remove(req.user.profile);
      return comment.save();
    }
    comment.upvotes.remove(req.user.profile);
    comment.downvotes.push(req.user.profile);
    return comment.save();
  })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      UPDATE


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                      DELETE

Comment.delete = function(req) {
  return Comment.findById(req.params.answerID)
  .then( comment => {
    let poster = comment.posterID.toString() === req.user.profile.toString();
    if(!poster) return next(createError(401, 'You are not the owner of this comment'));
    Comment.remove({ parents: comment._id}).exec();
    Comment.findByIdAndRemove(comment._id).exec();
    return Post.findById(comment.postedID)
      .then( post => {
      post.comments.remove(comment._id);
      return post.save();
    }) 
  })
}

Comment.deleteReply = function(req) {
  return Comment.findById(req.params.answerID)
  .then( comment => {
    let poster = comment.posterID.toString() === req.user.profile.toString();
    if(!poster) return next(createError(401, 'You are not the owner of this comment'));
    Comment.remove({ parents: comment._id}).exec();
    Comment.findByIdAndRemove(comment._id).exec();
    return Comment.findById(comment.postedID)
      .then( reply => {
      reply.replies.remove(comment._id);
      return reply.save();
    })
  })
}


export default Comment
