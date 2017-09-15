'use strict'

import User from '../model/user.js'
import {Router} from 'express'
import parserBody from '../middleware/parser-body'
import {basicAuth} from '../middleware/parser-auth.js'
import {log, daysToMilliseconds} from '../lib'

export default new Router()
.post('/api/signup', parserBody, (req, res, next) => {
  log('__ROUTE__ POST /signup')

  new User.create(req.body)
  .then( user => user.tokenCreate())
  .then( token => {
    console.log('token is ', token)
    res.cookie('X-Kribe-Token', token, {maxAge: 9000000})
    res.send(token)
  })
  .catch(next)
})
.get('/usernames/:username', (req, res, next) => {
  User.findOne({ username: req.params.username})
  .then( user => {
    if(!user) return res.sendStatus(200)
    return res.sendStatus(409)
  })
  .catch(next)
})
.get('/api/login', basicAuth, (req, res, next) => {
  log('__ROUTE__ GET /login')
  req.user.tokenCreate()
  .then( token => {
    res.cookie('X-Kribe-Token', token, {maxAge: 9000000})
    res.send(token)
  })
  .catch(next)
})