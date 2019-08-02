const Router = require('koa-router')
const Goods = require('../dbs/models/goods.js')

const router = new Router({
  prefix: '/goods' // 路由前缀
})

// 获取商品列表
router.get('/lists', async (ctx) => {
  let pageSize = ctx.request.query.pageSize?parseInt(ctx.request.query.pageSize) : 10
  let page = ctx.request.query.page?parseInt(ctx.request.query.page) : 1
  let title = ctx.request.query.keyword || ''
  let type = ctx.request.query.type || ''

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

  // 总数
  const total = await Goods.find(params).count()
  // 数据
  const lists = await Goods.find(params).skip(skip).limit(pageSize)

  if (lists) {
    let isMore = total - (((page-1) * pageSize) + lists.length)>0?true:false
    ctx.body = {
      status: 200,
      data: lists,
      isMore: isMore
    }
  } else {
    ctx.body = {
      status: 0,
      data: '获取数据失败'
    }
  }
  
})

// 获取商品详情
router.get('/detail', async (ctx) => {
  const id = ctx.request.query.id
  if(!id) {
    ctx.body = {
      status: 0,
      msg: '请传入商品id'
    }
  } else {
    const result = await Goods.findOne({_id: id})

    if (result) {
      ctx.body = {
        status: 200,
        data: result
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '获取数据失败'
      }
    }
  }
})


module.exports = router;