'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Merch from '../model/merch'

export default new Router()
.post('/api/merch/merch/:pageID', bearerAuth, parserBody, (req, res, next) => {
  Merch.create(req)
  .then(res.json)
  .catch(next)
})
.get('/api/merch/pagemerch/:pageID', (req, res, next) => {
  Merch.fetch(req)
  .then(res.json)
  .catch(next)
})
.get('/api/merch/all', (req, res, next) => {
  Merch.fetchRandom(req)
  .then(res.json)
  .catch(next)
})
.get('/api/merch/merchoptions/:id', (req, res, next) => {
  Merch.findById(req.params.id)
  .populate('options')
  .then(res.json)
  .catch(next)
})
.delete('/api/merch/deletemerch/:id', bearerAuth, (req, res, next) => {
  Merch.delete(req)
  .then( () => res.sendStatus(204))
  .catch(next)
})