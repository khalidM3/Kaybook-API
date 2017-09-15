import createError from 'http-errors'
import * as util from '../lib'
import Profile from './profile'
import Mongoose, {Schema} from 'mongoose'


const orderSchema = new Schema({
  buyer: {type: Schema.Types.ObjectId},
  seller: {type: Schema.Types.ObjectId},
  merch: {type: Schema.Types.ObjectId},
  info: {
    email: {type: String},
    fname: {type: String},
    lname: {type: String},
    address: {type: String},
    apt: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: String},
    country: {type: String},
    phone: {type: String},
  },
  orders: [
    {
      option: {type: Schema.Types.ObjectId, ref: 'option'},
      amount: {type: Number},
      price: {type: Number}
    }
  ],
  fulfilled: {type: Boolean, default: false},
  created: {type: Date, default: Date.now}
});

const Order = Mongoose.model('order', orderSchema);

Order.create = function(req) {
  if (!req._body) return next(createError(400, 'request body expected'))
  req.body.buyer = req.user.profile
  req.body.seller = req.params.id
  return new Order(req.body).save()
  .then( order => {
    order.orders.forEach( (optionOrder, i) => {
      Option.findById(optionOrder.option)
      .then( option => {
        option.qtty  = option.qtty - optionOrder.amount
        option.buyers.push(profile._id)
        return option.save().exec()
      })
      if(i === order.orders.length - 1) res.json(order)
    });
  });
}


export default Order