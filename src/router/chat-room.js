'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Room from '../model/chat-room'
import createError from 'http-errors'
import {log} from '../lib'

export default new Router()
.get('/api/room/newroom', bearerAuth, (req, res, next) => {
  Room.create(req)
  .then(res.json)
  .catch(next)
})
.get('/api/room/myrooms', bearerAuth, (req, res, next) => {
  Room.me(req)
  .then(res.json)
  .catch(next)
})
.get('/options/:id', bearerAuth, (req, res, next) => {
  Room.fetch(req)
  .then(res.json)
  .catch(next)
})
.put('/api/room/addmembers/:roomID', bearerAuth, parserBody, (req, res, next) => {
  Room.add(req)
  .then(res.json)
  .catch(next)
})
.put('/api/room/removemembers/:roomID', bearerAuth, parserBody, (req, res, next) => {
  Room.subtract(req)
  .then(res.json)
  .catch(next)
})
//  add delete
// .delete('/api/merch/deletemerch/:id', bearerAuth, (req, res, next) => {
//   Merch.delete(req)
//   .then( () => res.sendStatus(204))
//   .catch(next)
// })'