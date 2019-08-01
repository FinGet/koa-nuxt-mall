const mongoose = require('mongoose')
const Schema = mongoose.Schema

const produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
})

module.exports = mongoose.model('Good', produtSchema)