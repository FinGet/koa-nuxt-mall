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
      "goodsColor":String,
      "goodsName":String,
      "salePrice":String,
      "goodsImage":String,
      "checked": { type: Boolean, default: false },
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
