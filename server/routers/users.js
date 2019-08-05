const Router = require('koa-router')
const User = require('../dbs/models/user.js')
const Goods = require('../dbs/models/goods.js')
const Passport = require('../utils/passport.js')
const router = new Router({
  prefix: '/users' // 路由前缀
})

// 获取用户信息
router.get('/getUser', async (ctx) => {
  // 判断用户是否登录，Passport内置的
  if (ctx.isAuthenticated()) {
    const { userName, email } = ctx.session.passport.user
    ctx.body = {
      userName,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})
// 注册
router.post('/signup', async (ctx) => {
  let { userName, userPwd, email } = ctx.request.body

  let user = await User.find({ userName })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '该用户，已被注册'
    }
    return
  }
  // 创建新用户
  let nuser = await User.create({
    userName, userPwd, email
  })

  if (nuser) {
    ctx.body = {
      status: 200,
      data: { userName, email },
      msg: '注册成功'
    }
  } else {
    ctx.body = {
      status: 0,
      msg: '注册失败'
    }
  }

})
// 登录
router.post('/signin', async (ctx, next) => {
  // 本地登录
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        status: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          status: 200,
          msg: '登录成功',
          user: {
            userName: user.userName,
            email: user.userPwd
          }
        }
        // Passport中间件带的ctx.login
        return ctx.login(user)
      } else {
        ctx.body = {
          status: 0,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 退出登录
router.get('/exit', async (ctx) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      status: 200,
      msg: '退出登录'
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 加入购物车
router.post('/addCart', async (ctx) => {
  let goodsId = ctx.request.body.goodsId
  let num = ctx.request.body.num
  let color = ctx.request.body.color
  let { _id } = ctx.session.passport.user

  let goods = await Goods.findOne({'_id': goodsId})

  if (ctx.isAuthenticated()) {

    let params = {
      goodsId: goodsId,
      goodsColor: color,
      goodsName: goods.title,
      salePrice: goods.price,
      goodsImage: goods.img_url,
      checked: false,
      goodsNum: 1
    }

    // let res = await User.findOneAndUpdate({'_id': _id}, {$push: {"cartList": params}})

    let userDoc = await User.findOne({'_id':_id})

    if(userDoc) {
      // console.log(userDoc)
      let goodsItem = '' // 定义一个变量
      // 遍历请求到的data里有没有当前这个商品，如果有的话，则数量+1
      userDoc.cartList.forEach(function (item) {
        if (item.goodsId == goodsId & item.goodsColor == color) {
          goodsItem = item;
          item.goodsNum += num;
        }
      })
      if (goodsItem) {
        let res = await userDoc.save();
        saveDoc(ctx, res, '更新购物车成功', '更新购物车失败');
        
      }else {
        userDoc.cartList.push(params);
        let res = await  userDoc.save();
        saveDoc(ctx, res, '新增购物车成功', '新增购物车失败')
      }
    }

  } else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

// 获取购物车列表
router.get('/cartLists', async (ctx) => {
  let pageSize = 10
  let page = ctx.request.query.page?parseInt(ctx.request.query.page) : 1
  let skip = (page - 1) * pageSize
  let { _id } = ctx.session.passport.user
  ctx.body = {
    status: 0,
    msg: '没有该用户'
  }
  if (ctx.isAuthenticated()) { 
    const {cartList} = await User.findOne({'_id': _id}, {"cartList": 1})

    // const lists = await User.find({'_id': _id}, {"cartList":{ "$slice":[skip,pageSize]}})
    // const total = await User.find({'_id': _id}).count()

    const lists = cartList.slice(skip, pageSize)

    if (cartList) {
      let isMore = cartList.length - (((page-1) * pageSize) + lists.length)>0?true:false
      ctx.body = {
        status: 200,
        data: lists,
        isMore: isMore
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '没有该用户'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

// 删除购物车商品
router.delete('/deletePro', async (ctx) => {
  let id = ctx.request.query.id
  let { _id } = ctx.session.passport.user

  if(id) {
    if (ctx.isAuthenticated()) { 
      let res = await User.update({_id: _id},{$pull:{"cartList":{_id: id}}})
      // console.log(res)
      if(res) { 
        ctx.body = {
          status: 200,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          status: 0,
          msg: '删除失败'
        }
      }
    } else {
      ctx.body = {
        status: -1,
        msg: '用户没有登录'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      msg: 'id is required'
    }
  }
  
})

// 更新购物车
router.post('/updatePro', async (ctx) => {
  let id = ctx.request.body.id
  let num = ctx.request.body.num
  let { _id } = ctx.session.passport.user

  if (ctx.isAuthenticated()) {
    let userDoc = await User.findOne({'_id':_id})
    if(userDoc) {
      userDoc.cartList.forEach(function (item) {
        if (item.goodsId == id) {
          item.goodsNum = num;
        }
      })

      let res = await userDoc.save();
      saveDoc(ctx, res, '更新购物车成功', '更新购物车失败');
    } else {
      ctx.body = {
        status: 0,
        msg: '没有找到该用户'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

// 获取地址列表
router.get('/addressLists', async (ctx) => {
  let { _id } = ctx.session.passport.user

  if (ctx.isAuthenticated()) { 
    const {addressList}= await User.findOne({'_id': _id}, {"addressList": 1})
    
    if (addressList) {
      ctx.body = {
        status: 200,
        data: addressList
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '没有该用户'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})
// 新增收货地址
router.post('/addAddress', async (ctx) => {
  let { _id } = ctx.session.passport.user
  let {tel, userName, streetName, postCode} = ctx.request.body

  let addressId = 'address' + new Date().getTime()
  let params = {
    addressId,
    userName,
    streetName,
    postCode,
    tel,
    isDefault: false
  }

  if (ctx.isAuthenticated()) { 
    // const {addressList}= await User.findOne({'_id': _id}, {"addressList": 1})
    let res = await User.findOneAndUpdate({'_id': _id}, {$push: {"addressList": params}})
    let {addressList}= await User.findOne({'_id': _id}, {"addressList": 1})
    if (res) {
      ctx.body = {
        status: 200,
        msg: '新增成功',
        data: addressList
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '新增失败'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

// 修改默认收货地址
router.post('/defaultAddress', async (ctx) => {
  let addressId = ctx.request.body.addressId;
  let { _id } = ctx.session.passport.user;
  let userDoc = await User.findOne({_id: _id});

  if (ctx.isAuthenticated()) {
    if(userDoc) {
      let addressList = userDoc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      let res = await userDoc.save();
      saveDoc(ctx, res, '更新默认收货地址成功', '更新默认收货地址成功');
    } else {
      ctx.body = {
        status: -1,
        msg: '用户不存在'
      }
    }
  }else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

// 新建订单
router.post('/addOrder', async (ctx) => {
  let params = ctx.request.body.params;
  let { _id } = ctx.session.passport.user;

  let orderId = 'order' + new Date().getTime();
  params.orderId = orderId;

  if (ctx.isAuthenticated()) {
    let res = await User.findOneAndUpdate({'_id': _id}, {$push: {"orderList": params}});
    if (res) {
      ctx.body = {
        status: 200,
        msg: '新增成功'
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '新增失败'
      }
    }
  }else {
    ctx.body = {
      status: -1,
      msg: '用户没有登录'
    }
  }
})

function saveDoc(ctx, res, sucMsg, errMsg) {
  if(res) {
    ctx.body = {
      status: 200,
      msg: sucMsg
    }
  } else {
    ctx.body = {
      status: 0,
      msg: errMsg
    }
  }
}

module.exports = router;