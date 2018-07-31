// IMPORTS
import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'

// SCHEMA
const optionSchema = new Schema({
  posterID: {type: Schema.Types.ObjectId},
  postedID: {type: Schema.Types.ObjectId},
  merch: {type: Schema.Types.ObjectId},
  name: {type: String},
  name1: {type: String},
  val1: {type: String},
  name2: {type: String},
  val2: {type: String},
  name3: {type: String},
  val3: {type: String},
  picURI: {type: String ,default:'http://placehold.it/150x150'},
  merchPicURI: [{type: String ,default:'http://placehold.it/150x150'}],
  price: {type: Number},
  qtty: {type: Number},
  buyers: [{type: Schema.Types.ObjectId}],
  created: {type: Date, default: Date.now}
})

// MODEL
const Option = Mongoose.model('option', optionSchema)

// STATIC METHODS
Option.create = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))

  return Merch.findById(req.params.merchID)
  .then( merch => {
    let admin = merch.posterID.toString() === req.user.profile.toString()
    if(!admin) return next(createError(401, 'You are not the admin of this page'))
    let total = req.body.options.length
    req.body.options.forEach(option => {
      option.posterID = req.user.profile
      option.postedID = req.params.pageID
      option.name = merch.name
      option.merch = merch._id

      new Option(option).save()
      .then( option => {
        merch.options.push(option._id)
        merch.picURI.push(option.picURI)

        if(!--total) {
          merch.save()
          .then( merch => res.json(merch))
        }
      })
    })
  })
}

Option.update = function(req) {
  return Option.findOneAndUpdate(
    { _id: req.params._id, 
     posterID: req.user.profile },
      req.body, {new: true}
    )
}

// INTERFACE
export default Option