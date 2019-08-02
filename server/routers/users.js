const Router = require('koa-router')
const User = require('../dbs/models/user.js')
const Passport = require('../utils/passport.js')
const router = new Router({
  prefix: '/users' // 路由前缀
})

router.get('/getUser', async (ctx) => {
  console.log(1)
  // 判断用户是否登录，Passport内置的
  if(ctx.isAuthenticated()) {
    const {userName, email} = ctx.session.passport.user
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
  let {userName, userPwd, email} = ctx.request.body

  let user = await User.find({userName})
  if(user.length) {
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
      data : {userName, email},
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
  return Passport.authenticate('local', function(err, user, info ,status) {
    if(err) {
      ctx.body = {
        status: -1,
        msg: err
      }
    } else {
      if(user) {
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
  if(!ctx.isAuthenticated()) {
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


module.exports = router;