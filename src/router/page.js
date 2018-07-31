'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Page from '../model/page.js'
import {log} from '../lib'

export default new Router()
.post('/api/page', bearerAuth, parserBody, (req, res, next) => {
  log('__POST__: /page')
  Page.create(req)
  .then(res.json)
  .catch(next)
})
.get('/api/page/:id', (req, res, next) => {
  Page.findById(req.params.id)
  .then(res.json)
  .catch(next)
})
.get('/api/page/search/:name', (req, res, next) => {
  Page.search(req)
  .then(res.json)
  .catch(next)
})
.get('/api/pagebypid/:profileID', (req, res, next) => {
  Page.findPages(req)
  .then(res.json)
  .catch(next)
})
.get('/api/joinpage/:pageID', bearerAuth, (req, res, next) => {
  Page.join(req)
  .then(res.json)
  .catch(next)
})
.get('/api/leavepage/:pageID', bearerAuth, (req, res, next) => {
  Page.leave(req)
  .then(res.json)
  .catch(next)
})
.put('/api/page/:id', bearerAuth, parserBody, (req, res, next) => {
  Page.update(req)
  .then(res.json)
  .catch(next)
})