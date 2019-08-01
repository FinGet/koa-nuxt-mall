const mongoose = require('mongoose')

const dburl = 'mongodb://127.0.0.1:27017/mall'

// 链接MongoDB数据库
const db = mongoose.connect(dburl)
// 链接成功
db.connection.on("connected", function() {
    console.log("MongoDB connected success")
})
// 链接失败
db.connection.on("error", function() {
    console.log("MongoDB connected error")
})
// 断开了
db.connection.on("disconnected", function() {
    console.log("MongoDB connected disconnected")
})

module.exports = db;