const Router = require('koa-router')
const Goods = require('../dbs/models/goods.js')

const router = new Router({
  prefix: '/goods' // 路由前缀
})

// 获取商品列表
router.get('/lists', async (ctx) => {
  let pageSize = parseInt(ctx.request.query.pageSize) || 10
  let page = parseInt(ctx.request.query.page) || 0
  let title = ctx.request.query.keyword
  let type = ctx.request.query.type

  if (title.indexOf('女') > -1) {
    title = '';
    type = 'dress'
  } else if (title.indexOf('鞋') > -1) {
    title = '';
    type = 'shoes'
  } else if (title.indexOf('男') > -1) {
    title = '';
    type = 'manwear'
  }
  // 跳多少条数据
  let skip = (page - 1) * pageSize

  // 在nodejs中，必须要使用RegExp，来构建正则表达式对象。
  let reg = new RegExp(title, 'i')

  let params = {}
  if (type !== 'all' && type !== '') {
    params = {
      type: type,
      $or: [{ title: { $regex: reg } }]
    }
  } else {
    params = { $or: [{ title: { $regex: reg } }] }
  }


  const total = await Goods.find(params).count()

  const lists = await Goods.find(params).skip(skip).limit(pageSize)
  
  let isMore = total - (((page-1) * pageSize) + lists.length)>0?true:false

  ctx.body = {
    status: 200,
    data: lists,
    isMore: isMore
  }
})

module.exports = router;