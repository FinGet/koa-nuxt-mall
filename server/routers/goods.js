const Router = require('koa-router')
const Good = require('../dbs/models/good.js')

const router = new Router({
  prefix: '/goods' // 路由前缀
})

// 获取商品列表
router.get('/lists', async (ctx) => {

})