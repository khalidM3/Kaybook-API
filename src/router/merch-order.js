'use strict'

import {Router} from 'express'
import {bearerAuth} from '../middleware/parser-auth.js'
import parserBody from '../middleware/parser-body'
import Order from '../model/merch-order'

export default new Router()
.post('/api/order/:id', bearerAuth, parserBody, (req, res, next) => {
  Order.create(req)
  .then(res.json)
  .catch(next)
})