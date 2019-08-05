const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  "userName":String,
  "userPwd":String,
  "email": String,
  "orderList":Array,
  "cartList":[
    {
      "goodsId": String,
      "goodsColor":Array,
      "goodsName":String,
      "salePrice":String,
      "goodsImage":String,
      "checked":Boolean,
      "goodsNum":Number
    }
  ],
  "addressList":[
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    }
  ]
})

module.exports = mongoose.model("User", userSchema)
