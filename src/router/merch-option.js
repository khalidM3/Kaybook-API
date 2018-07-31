'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Option from '../model/merch-option'

export default new Router()
.post('/api/option/newoption/:merchID', bearerAuth, parserBody, (req, res, next) => {
  Option.create(req)
  .then(res.json)
  .catch(next)
})
.get('/options/:id', (req, res, next) => {
  Option.findById(req.params.id)
  .then(res.json)
  .catch(next)
})
.put('/api/option/editoption/:id', bearerAuth, parserBody, (req, res, next) => {
  Option.update(req)
  .then(res.json)
  .catch(next)
})
.delete('/api/merch/deletemerch/:id', bearerAuth, (req, res, next) => {
  Merch.delete(req)
  .then( () => res.sendStatus(204))
  .catch(next)
})