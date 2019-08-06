const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const User = require('../dbs/models/user')

// 提交数据(策略)
passport.use(new LocalStrategy({
  usernameField: 'userName',
  passwordField: 'userPwd'
},async function(username,password,done){
  let where = {
    userName: username
  };
  let result = await User.findOne(where)
  if(result!=null){
    if(result.userPwd===password){
      return done(null,result)
    }else{
      return done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户不存在')
  }
}))
// 序列化ctx.login()触发
passport.serializeUser(function(user,done){
  // 用户登录成功之后，会把用户数据存到session当中
  done(null,user)
})

// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(function(user,done){
  return done(null,user)
})

// 这里序列化指的是把用户对象存到session里，反序列化就是反过来，从session里取用户数据成对象，
// session 可能是存数据库的或者写文件里的，像php默认是写文件的，koa-session 的好像是基于内存的。

module.exports = passport
