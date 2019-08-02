const mongoose = require('mongoose')
const Schema = mongoose.Schema

const produtSchema = new Schema({
  "type": String,
  "img_url": String,
  "price": Number,
  "title": String,
  "imgs": Array
})

module.exports = mongoose.model('Goods', produtSchema)