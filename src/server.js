'use strict'

import express from 'express'
import middleware from './middleware'
import mongoose from 'mongoose'

mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})

const 
  app = express().use(middleware),
  PORT =  8000

console.log('PORT IS ', process.env.PORT)
app.listen(PORT, () => console.log('_SERVER_UP_ at port ', PORT))