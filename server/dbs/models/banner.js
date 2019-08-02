const mongoose = require('mongoose')
const Schema = mongoose.Schema

const banner = new Schema({
  "img_url":String
})

module.exports = mongoose.model('Banner', banner)