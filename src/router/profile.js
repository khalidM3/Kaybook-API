'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Profile from '../model/profile.js'
import createError from 'http-errors'
import {log} from '../lib'

export default new Router()
.post('/api/profile', bearerAuth, parserBody, (req, res, next) => {
  log('__POST__: /profiles')
  Profile.create(req)
  .then(res.json)
  .catch(next)
})
.get('/profiles', (req, res, next) => {
  Profile.fetch(req)
  .then(res.page)
  .catch(next)
})
.get('/profiles/me', bearerAuth, (req, res, next) => {
  Profile.findById(req.user.profile)
  .then( profile => {
    if(!profile) return createError(401, 'NOT FOUND ERROR: profile not found')
    res.json(profile)
  })
  .catch(next)
})
// .get('/api/profile/:id', (req, res, next) => {
//   Profile.fetchOne(req)
//   .then(res.json)
//   .catch(next)
// })
.get('/api/profile/:id', (req, res, next) => {
  Profile.findOne({ userID: req.params.id})
  .then(res.json)
  .catch(next)
})
.get('/api/profile2/:id', (req, res, next) => {
  Profile.fetchOne(req)
  .then(res.json)
  .catch(next)
})
.get('/api/profile/search/:name', (req, res, next) => {
  Profile.search(req)
  .then(res.json)
  .catch(next)
})
.get('/api/allprofiles', (req, res, next) => {
  Profile.find({})
  .then(res.json)
  .catch(next)
})
.get('/api/sendreq/:id', bearerAuth, (req, res, next) => {
  Profile.sendFriendReq(req)
  .then(res.json)
  .catch(next)
})
.get('/api/unsendreq/:id', bearerAuth, (req, res, next) => {
  Profile.unsendFriendReq(req)
  .then(res.json)
  .catch(next)
})
.get('/api/acceptreq/:id', bearerAuth, (req, res, next) => {
  Profile.acceptFriendReq(req)
  .then(res.json)
  .catch(next)
})
.get('/api/unfriend/:id', bearerAuth, (req, res, next) => {
  Profile.unfriend(req)
  .then(res.json)
  .catch(next)
})
.get('/api/getfriends/:id', (req, res, next) => {
  Profile.findById(req.params.id)
  .populate('friends')
  .then(res.json)
  .catch(next)
})
.get('/api/getmyfriends', bearerAuth, (req, res, next) => {
  Profile.findById(req.user.profile)
  .populate('friends')
  .then(res.json)
  .catch(next)
})
.get('/api/getfriendreq/:id', (req, res, next) => {
  Profile.findById(req.params.id)
  .populate('friendReq')
  .then(res.json)
  .catch(next)
})
.get('/api/getmyfriendreq', bearerAuth, (req, res, next) => {
  Profile.findById(req.params.id)
  .populate('friendReq')
  .then(res.json)
  .catch(next)
})
.get('/api/joinedpages', bearerAuth, (req, res, next) => {
  Profile.findById(req.user.profile)
  .populate('memberOf')
  .then(res.json)
  .catch(next)
})
.put('/api/profile', bearerAuth, parserBody, (req, res, next) => {
  Profile.update(req)
  .then(res.json)
  .catch(next)
})