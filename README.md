> 2017年跟着教程做了一个全栈的商场(vue + express + mongodb)，2019年，工作中一直做前端，之前学过的都忘了，所以准备用 Nuxt + koa2 + mongodb 重写一次。温故而知新，会增加一些功能，让这个项目更完善，适合初入全栈的前端工程师参考练手。小白看起来会比较吃力，这文档里就是点了几处需要注意的东西，具体实现看源码。

---

![](http://ww1.sinaimg.cn/large/006tNc79gy1g5pz45g5kyj31350q7tey.jpg)
![](http://ww3.sinaimg.cn/large/006tNc79gy1g5pz4a03x8j31360kvq5s.jpg)
![](http://ww1.sinaimg.cn/large/006tNc79gy1g5pz479ah2j31370mrtb9.jpg)

> 源码地址：[https://github.com/FinGet/koa-nuxt-mall](https://github.com/FinGet/koa-nuxt-mall)，还过得去的话，斗胆请各位看官赏个star。
文档地址：[https://finget.github.io/2019/08/06/nuxt-koa-mongodb/](https://finget.github.io/2019/08/06/nuxt-koa-mongodb/)


## 项目目录

先来看看整个项目的目录结构，不容易迷路。

<pre>
├── .nuxt     # nuxt 编译的文件
├── assets    # 静态资源
├── components # 组件
│   └── banner.vue        # 轮播图组件
│   └── footer.vue        # footer组件
│   └── goods.vue         # 首页商品组件
│   └── search.vue        # 搜索组件
│   └── topBar.vue        # topBar组件
│   └── user.vue          # 用户信息组件
├── layout
│   ├── default.vue       # 默认布局文件
├── middleware            # 中间件
│   ├── auth.js           # 用户是否登录
└── pages
│   └── detail            
│       └── _id.vue       # 商品详情页
│   └── cartLists.vue     # 购物车页
│   └── form_mixins.js    # 登录注册表单验证mixins
│   └── index.vue         # 首页
│   └── login.vue         # 登录页
│   └── register.vue      # 注册页
└── plugins
│   └── axios.js          # axios配置
│   └── element-ui.js     # elementui
│   └── filters.js        # 过滤器
└── store
│   └── index.js          # vuex状态管理
└── server                # koa服务端
│   └── dbs               # mongodb数据库配置
│       └── models        # models
│           └── banner.js # 轮播图model
│           └── goods.js  # 商品model
│           └── user.js   # 用户model
│       └── config.js     # 数据库配置连接
│   └── routers           # 服务端路由
│       └── banner.js     # 轮播图路由
│       └── goods.js      # 商品路由
│       └── users.js      # 用户路由
│   └── utils             # 工具函数
│       └── passport.js   # passport登录验证中间件
│   └── index.js          # 服务端入口
└── static  
└── nuxt.config.js        # nuxt配置文件
</pre>


## 安装运行项目

这个项目中要用到Mongodb，所以必须安装。

- Mac 安装mongodb

https://www.runoob.com/mongodb/mongodb-osx-install.html

- Windows 安装mongodb

https://www.runoob.com/mongodb/mongodb-window-install.html

- 克隆项目

https://github.com/FinGet/koa-nuxt-mall

>  install dependencies
   yarn install
   
> serve with hot reload at localhost:3000
yarn dev

> build for production and launch server
yarn build
yarn start

> generate static project
yarn generate


⚠️点这里：[Nuxt爬坑指南。](https://juejin.im/post/5cc81e1a6fb9a032414f695b#heading-34)

项目中还用到了Redis来存储session，也可以不用，直接存在内存中。

[Redis安装指南。](https://www.runoob.com/redis/redis-install.html)



## 从零开始手撸

### Init Project

```javascript
npx create-nuxt-app nuxt-koa-mall
// axios + koa + elementui + Eslint 就选这几样
```

- Install & SetUp Axios

```javascript
// Install
yarn add @nuxtjs/axios


// SetUp nuxt.config.js 
modules: [
  '@nuxtjs/axios'
],
plugin: [
  '~/plugins/axios'
]
// plugins/axios.js
export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })
  $axios.onResponse(response => {
    // console.log(response)
    if(response.status == 200) {
      return response.data;
    }
  })
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
```

- Install & SetUp Less

> 我不推荐用`sass`，反正我每次用`yarn` 装 `nodesass` 都会有问题，弃坑！

```javascript
// Install
yarn less less-loader @nuxtjs/style-resources

// SetUp nuxt.config.js 
modules: [
  '@nuxtjs/style-resources'
],
styleResources: {
  // 全局注入 less变量 这样在任何页面都可以使用 variate \ mixins
  less: ['./assets/css/variate.less','./assets/css/mixins.less']
},
```

> 官网说的:warning: You cannot use path aliases here (~ and @)，你需要使用相对或绝对路径


### Nuxt 开发页面

#### layouts 页面

默认情况下,`pages`的所有页面都会引入`/layouts/default.vue`,另外，`/layouts/error.vue`也会引入`default.vue`。可以定义一个空白layout：`black.vue`作为特殊页面的layout。

```javascript
// 在页面中设置layout
export default {
  layout: 'blank' //默认是default
}
```

```html
// 在layout中
<template>
  <div>
    <nuxt /> // 这个是必须定义的，就像是vue的router-view
  </div>
</template>
```

#### 全局过滤器

Nuxt的全局过滤器，定义在plugins下面，在`nuxt.config.js`中引入。

```javascript
// plugins/filters
import Vue from 'vue';

Vue.filter('moneyFormat', (value) => {
  return `${value}.00`
});

// nuxt.config.js
plugins: [
  '~/plugins/filters'
],
```

#### Nuxt路由

- 基础路由

在pages下面新建一个vue文件就会生成一个对应的路由，文件名就是路由名。

- 动态路由

在这个项目中，商品详情页就是动态路由。在 `Nuxt.js` 里面定义带参数的动态路由，需要创建对应的以下划线作为前缀的 Vue 文件 或 目录。

```
pages
--| detail/
-----| _id.vue
```

Nuxt.js 生成对应的路由配置表为:

```javascript
router: {
  routes: [
    {
      name: 'detail-id',
      path: '/detail/:id?',
      component: 'pages/detail/_id.vue'
    },
  ]
}
```

更多路由配置去[官网查看](https://zh.nuxtjs.org/guide/routing)

#### asyncData 和 fetch

- asyncData
此方法在加载（渲染）组件（页面组件，即pages文件夹下的文件，不包含components下的）之前在服务端或路由更新之前被调用，即可以进行异步获取数据并返回当前组件。

- fetch
该方法用于渲染页面（页面组件加载前被调用【服务端或切换至目标路由之前】）前填充应用的状态树（store）数据,与asyncData方法类似，不同的是它不会设置组件的数据。


> 如果组件不是和路由绑定的页面组件，原则上是不可以使用异步数据的。因为 Nuxt.js 仅仅扩展增强了页面组件的 data 方法，使得其可以支持异步数据处理。--简而言之就是`fetch` 和 `asyncData` 在组件上不能用。

#### Vuex

⚠️在nuxt中，vuex需要导出一个方法。

```javascript
let store = () => new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
```
---
> 剩下的就跟写vue页面没啥区别了。


### koa服务端

> koa这里面默认不支持 `import xxx from xxx`语法,我也没有去改配置，就默认用的`moudle.exports`和`require`。

用到的几个插件：

```javascript
yarn add koa-json koa-generic-session koa-bodyparser koa-redis koa-passport passport-local koa-router mongoose
```

#### koa-json

> JSON pretty-printed response middleware. Also converts node object streams to binary.

```javascript
var json = require('koa-json');
var Koa = require('koa');
var app = new Koa();
 
app.use(json());
 
app.use((ctx) => {
  ctx.body = { foo: 'bar' };
});
```

```javascript
$ GET /
 
{
  "foo": "bar"
}
```

#### koa-bodyparser

koa.js并没有内置Request Body的解析器，当我们需要解析请求体时需要加载额外的中间件，官方提供的koa-bodyparser是个很不错的选择，支持x-www-form-urlencoded, application/json等格式的请求体，但不支持form-data的请求体。

> 也就是说不用这个插件，就拿不到post请求传过来的body内容。

```javascript
var bodyParser = require('koa-bodyparser');
var Koa = require('koa');

var app = new Koa();
app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))
```

#### koa-generic-session

这就是koa的seesion中间件。`koa-passport`也需要用到它

```javascript
const session = require('koa-generic-session');
const Koa = require('koa');
app.keys = ['keys', 'keyskeys']
app.use(session({
  key: 'fin',
  prefix: 'fin:uid',
  maxAge: 1000, /** (number) maxAge in ms (default is 1 days)，cookie的过期时间 */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** cookie是否只有服务器端可以访问 (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  store: new Redis() // 将session存入redis 不传options 默认就是连接127.0.0.1:6379
}))
```


#### koa-passport

这是这个项目中很重要的一个中间件。大概逻辑就是，用户登录,它就帮忙把用户信息存在session里，在浏览器端也会生成对应的cookie,还提供了几个方法`ctx.isAuthenticated() 用户是否登录`,`ctx.login()用户登录`, `ctx.logout()用户退出`。

> `passport.js`是Nodejs中的一个做登录验证的中间件，极其灵活和模块化，并且可与Express、Sails等Web框架无缝集成。`Passport`功能单一，即只能做登录验证，但非常强大，支持本地账号验证和第三方账号登录验证（OAuth和OpenID等），支持大多数Web网站和服务。


```javascript
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

module.exports = passport
```

```javascript
const passport = require('./utils/passport');
const Koa = require('koa');

const app = new Koa();

app.use(passport.initialize())
app.use(passport.session())
```

- 报错Missing credentials

默认情况下passport使用username和password,也可以自由定义：

```javascript
passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  },
  function(username, password, done) {
  // ...
  }
));
```

- 报错 ctx.login is not a function

`app.use(passport.initialize())` `app.use(passport.session())`要在路由前使用。

点击这里：[passport学习资料。](https://www.kancloud.cn/digest/passport-js-note/64048)

#### mongodb

> MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

> MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![](https://www.runoob.com/wp-content/uploads/2013/10/crud-annotated-document.png)

[更多的mongodb学习资料。](https://www.runoob.com/mongodb/mongodb-tutorial.html)

- 安装mongodb可视化工具

[下载链接](https://robomongo.org/)

![](http://ww2.sinaimg.cn/large/006tNc79gy1g5ps3qezp3j31o30u0k0h.jpg)

> 安装过程就是选择对应的系统，下一步下一步...

![](http://ww3.sinaimg.cn/large/006tNc79gy1g5ps0e6fewj31f50u0wtm.jpg)

> 这个项目中没有涉及到关联collection，操作(CURD)起来就像是操作json数据。

- mongoose

> Mongoose：一款为异步工作环境设计的 MongoDB 对象建模工具。

[去官网看看](https://mongoosejs.com/docs/index.html)

mongoose里面有三个概念，schemal、model、entity:

`Schema` ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
`Model` ： 由Schema发布生成的模型，具有抽象属性和行为的数据库操作
`Entity` ： 由Model创建的实体，他的操作也会影响数据库

- 连接数据库

```javascript
const mongoose = require('mongoose')

const dburl = 'mongodb://127.0.0.1:27017/mall' // mall代表数据库名称

// 链接MongoDB数据库
const db = mongoose.connect(dburl)
// 链接成功
mongoose.connection.on("connected", function() {
    console.log("MongoDB connected success")
})
// 链接失败
mongoose.connection.on("error", function() {
    console.log("MongoDB connected error")
})
// 断开了
mongoose.connection.on("disconnected", function() {
    console.log("MongoDB connected disconnected")
})

module.exports = db;
```

- 定义和添加模型

就是mysql里的表结构。

模型使用 `Schema` 接口进行定义。 `Schema` 可以定义每个文档中存储的字段，及字段的验证要求和默认值。

`mongoose.model()` 方法将模式“编译”为模型。模型就可以用来查找、创建、更新和删除特定类型的对象。

> 注：MongoDB 数据库中，每个模型都映射至一组文档。这些文档包含 Schema 模型定义的字段名/模式类型。

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 定义模型
const produtSchema = new Schema({
  "type": String,
  "img_url": String,
  "price": Number,
  "title": String,
  "imgs": Array
})

// 使用模式“编译”模型
module.exports = mongoose.model('Goods', produtSchema)
```

- 常见字段类型和声明方式

```javascript
const schema = new Schema(
{
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String], // 其他类型也可使用数组
  nested: { stuff: { type: String, lowercase: true, trim: true } }
})
```

没有基础的一定得看看：[一篇文章带你入门Mongoose。](https://segmentfault.com/a/1190000012095054)

#### koa-router

服务端的路由，定义各个接口的请求方式以及返回的数据。


- 示例banner 轮播图

```javascript
const Router = require('koa-router')
const Banner = require('../dbs/models/banner.js')

const router = new Router({
  prefix: '/banner' // 路由前缀
})

// 获取商品列表 请求方式为get
router.get('/lists', async (ctx) => {
  const lists = await Banner.find() // 返回查到的所有数据

  ctx.body = {
    status: 200,
    data: lists
  }
})

module.exports = router;
```

#### 用户注册

```javascript
router.post('/signup', async (ctx) => {
  // ctx.request.body 获取post请求的参数
  let { userName, userPwd, email } = ctx.request.body
 
  // 查找数据库中是否存在该用户
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
```

#### 用户登录

```javascript
router.post('/signin', async (ctx, next) => {
  // Passport 本地登录 这是固定用法
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
```

#### 退出登录

```javascript
router.get('/exit', async (ctx) => {
// passport 自带logout方法，会清除session cookie
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
```


#### 分页模糊查询

- 第一种商品列表

分页查询主要涉及两个方法：`skip`和`limit`。

`skip`表示跳过多少个。举个例子，页码(`page`),每页条数(`pageSize`),如果`page=1,pageSize=10`，就是要取前10条数据，那`skip`就应该 等于0，表示跳过0条。第二页，`page=2`，再取10条，此时`skip`就该等于10,要跳过前10条，也就是第一页的10条。一次类推得出:`skip = (page - 1) * pageSize`。

`limit`就表示限制返回的条数。

```javascript
// 获取商品列表
router.get('/lists', async (ctx) => {
  let pageSize = ctx.request.query.pageSize?parseInt(ctx.request.query.pageSize) : 10
  let page = ctx.request.query.page?parseInt(ctx.request.query.page) : 1
  let title = ctx.request.query.keyword || ''
  let type = ctx.request.query.type || ''
    
 // 数据量不多，所以当搜索含有女的都返回所有女装
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

  // 在nodejs中，必须要使用RegExp，来构建正则表达式对象。模糊查询
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
  
  // 这params就是搜索条件，这里有个细节，如果要搜索所有类型，type不能传空，不要type就行了

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
    ...
  }
})
```

- 第二种购物车列表

通过`slice`方法，其实就是对数组的截取操作。

```javascript
router.get('/cartLists', async (ctx) => {
  let pageSize = 10
  let page = ctx.request.query.page?parseInt(ctx.request.query.page) : 1
  let skip = (page - 1) * pageSize
  let { _id } = ctx.session.passport.user
  
  if (ctx.isAuthenticated()) { 
    const {cartList} = await User.findOne({'_id': _id}, {"cartList": 1})
    
    // const lists = await User.find({'_id': _id}, {"cartList":{ "$slice":[skip,pageSize]}})

    const lists = cartList.slice(skip, pageSize)

    if (cartList) {
      let isMore = cartList.length - (((page-1) * pageSize) + lists.length)>0?true:false
      ctx.body = {
        status: 200,
        data: lists,
        isMore: isMore
      }
    } else {
        ....
    }
  } else {
    ...
  }
})
```

## 遗留的一些问题和扩展
1. Nuxt 的 middleware判断用户是否登录。由于components中没法使用fetch，页面刷新时，middleware已经执行了，此时vuex中是没有参数的，就判断为用户没有登录？
2. mongoose 获取内嵌数组的长度，有没有更好的办法，或者说是既能返回总数也能进行分页？
3. mongodb我也是现学现卖，查询语句写的可能不是最优的，仅作参考。
4. 订单是在数据中库存了的，没有展示，收货地址也只有增加。这两处都可以扩展增删改查的功能。

## 最后

项目中所有图片均来自网络，如果存在侵权情况，请第一时间告知。本项目仅做学习交流使用，请勿用于其他用途。

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！源码中没有放商品的数据库文件，加群可以获得一份，也可以自己根据数据结构去创建数据。

qq交流群：
![qq群](http://ww4.sinaimg.cn/large/006tNc79gy1g5pxz76gfaj30cy0d1jsq.jpg)


微信交流群：
![微信群](http://ww4.sinaimg.cn/large/006tNc79gy1g5py0n2a00j30lg0l4di9.jpg)