'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Post from '../model/post.js'
import createError from 'http-errors'
import {log} from '../lib'

export default new Router()
.post('/api/posttopage/:postedID', bearerAuth, parserBody, (req, res, next) => {
  Post.createPost(req)
  .then(res.json)
  .catch(next)
})
.post('/api/posttofeed/:pageID', bearerAuth, parserBody, (req, res, next) => {
  Post.createFeed(req)
  .then(res.json)
  .catch(next)
})
.post('/api/posttoprofile', bearerAuth, parserBody, (req, res, next) => {
  Post.createTime(req)
  .then(res.json)
  .catch(next)
})
.post('/api/repost/:id', bearerAuth, parserBody, (req, res, next) => {
  Post.repost(req)
  .then(res.json)
  .catch(next)
})
.post('/api/post/report/:postID', bearerAuth, parserBody, (req, res, next) => {
  Post.report(req)
  .then(res.json)
  .catch(next)
})
.get('/api/post/:id', (req, res, next) => {
  Post.findById(req.params.id)
  .then(res.json)
  .catch(next)
})
.get('/api/post/comments/:id', (req, res, next) => {
  Post.fetch(req)
  .then(res.json)
  .catch(next)
})
.get('/api/pageposts/:pageID', (req, res, next) => {
  Post.fetchPosts(req)
  .then(res.json)
  .catch(next)
})
.get('/api/pagefeed/:pageID', (req, res, next) => {
  Post.fetchFeed(req)
  .then(res.json)
  .catch(next)
})
.get('/api/post/vote/:postID/:choiceID', bearerAuth, (req, res, next) => {
  Post.vote(req)
  .then(ress => {
    console.log('res is ',ress)
    res.json(ress)
  })
  .catch(next)
})
.get('/api/allposts', (req, res, next) => {
  Post.fetchRandom(req)
  .then(res.json)
  .catch(next)
})
.get('/api/friendsposts', bearerAuth, (req, res, next) => {
  Post.fetchFriends(req)
  .then(res.json)
  .catch(next)
})
.get('/api/timeline', bearerAuth, (req, res, next) => {
  Post.fetchTimeline(req)
  .then(res.json)
  .catch(next)
})
.get('/api/allmyposts', bearerAuth, (req, res, next) => {
  Post.me(req)
  .then(res.json)
  .catch(next)
})
.get('/api/joinedposts', bearerAuth,  (req, res, next) => {
  Post.joinedPosts(req)
  .then(res.json)
  .catch(next)
})
.get('/api/joinedfeed', bearerAuth, (req, res, next) => {
  Post.joinedFeed(req)
  .then(res.json)
  .catch(next)
})
.get('/api/mypageposts/:profileID', (req, res, next) => {
  Post.publicPosts(req)
  .then(res.json)
  .catch(next)
})
.get('/api/timelineposts/:profileID', (req, res, next) => {
  Post.publicTimeline(req)
  .then(res.json)
  .catch(next)
})
.get('/api/likepost/:postID', bearerAuth, (req, res, next) => {
  Post.like(req)
  .then(res.json)
  .catch(next)
})
.get('/api/dislikepost/:postID', bearerAuth, (req, res, next) => {
  Post.dislike(req)
  .then(res.json)
  .catch(next)
})
.get('/api/hash/:term', (req, res, next) => {
  Post.search(req)
  .then(res.json)
  .catch(next)
})
.put('/api/post/:postID', bearerAuth, parserBody, (req, res, next) => {
  Post.update(req)
  .then(res.json)
  .catch(next)
})
.delete('/api/post/:id', bearerAuth, (req, res, next) => {
  Post.delete(req)
  .then( () => res.sendStatus(204))
  .catch(next)
})