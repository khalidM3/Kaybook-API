'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Comment from '../model/post-comment'

export default new Router()
.post('/api/answer/:postID', bearerAuth, parserBody, (req, res, next) => {
  Comment.create(req)
  .then(res.json)
  .catch(next)
})
.post('/api/replyanswer/:answerID', bearerAuth, parserBody, (req, res, next) => {
  Comment.reply(req)
  .then(res.json)
  .catch(next)
})
.post('/api/answer/report/:answerID', bearerAuth, parserBody, (req, res, next) => {
  Comment.report(req)
  .then(res.json)
  .catch(next)
})
.get('/api/answer/:id', (req, res, next) => {
  Comment.findById(req.params.id)
  .populate('posterID')
  .then(res.json)
  .catch(next)
})
.get('/api/answerreplies/:answerID', (req, res, next) => {
  Comment.fetch(req)
  .then(res.json)
  .catch(next)
})
.get('/api/myanswers', bearerAuth,  (req, res, next) => {
  Comment.me(req)
  .then(res.json)
  .catch(next)
})
.get('/api/upvote/:answerID', bearerAuth, (req, res, next) => {
  Comment.upvote(req)
  .then(res.json)
  .catch(next)
})
.get('/api/downvote/:answerID', bearerAuth, (req, res, next) => {
  Comment.downvote(req)
  .then(res.json)
  .catch(next)
})
.put('/api/page/:id', bearerAuth, parserBody, (req, res, next) => {
  Page.update(req)
  .then(res.json)
  .catch(next)
})
.delete('/api/answer/deleteanswer/:answerID', bearerAuth, (req, res, next) => {
  Comment.delete(req)
  .then( () => res.sendStatus(204))
  .catch(next)
})
.delete('/api/answer/deletereply/:answerID', bearerAuth, (req, res, next) => {
  Comment.deleteReply(req)
  .then( () => res.sendStatus(204))
  .catch(next)
})