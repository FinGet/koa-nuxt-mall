const Router = require('koa-router')
const Banner = require('../dbs/models/banner.js')

const router = new Router({
  prefix: '/banner' // 路由前缀
})

// 获取商品列表
router.get('/lists', async (ctx) => {
  const lists = await Banner.find()

  ctx.body = {
    status: 200,
    data: lists
  }
})

module.exports = router;