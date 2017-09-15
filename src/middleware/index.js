'use strict'

import cors from 'cors'
import morgan from 'morgan'
import {Router} from 'express'
import cookieParser from 'cookie-parser'
import bind_response from './bind-response.js'
import router_auth from '../router/auth.js'
import router_profile from '../router/profile.js'
import router_page from '../router/page.js'
import router_post from '../router/post.js'
import router_comment from '../router/post-comment.js'
import router_merch from '../router/merch.js'
import router_merch_option from '../router/merch-option.js'
import router_merch_order from '../router/merch-order.js'

import handle404 from './handle-404.js'
import handleError from './handle-error.js'

export default new Router()
.use([
  cors({
    origin: process.env.CORS_ORIGINS.split(' '),
    credentials: true,
  }),
  morgan('dev'),
  cookieParser(),
  bind_response,

  router_auth,
  router_profile,
  router_page,
  router_post,
  router_comment,
  router_merch,
  router_merch_option,
  router_merch_order,

  handle404,
  handleError,
])


