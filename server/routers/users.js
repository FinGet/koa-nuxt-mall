const Router = require('koa-router')
const User = require('../dbs/models/user.js')

const router = new Router({
  prefix: '/users' // 路由前缀
})

// 注册
router.post('/signup', async (ctx) => {

})