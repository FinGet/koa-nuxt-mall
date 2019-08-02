## nuxt-koa-mall

> 2017年跟着教程做了一个全栈的商场(vue + express + mongodb)，2019年，工作中一直做前端，之前学过的都忘了，所以准备用 Nuxt + koa2 + mongodb 重写一次。温故而知新，会增加一些功能，让这个项目更完善，适合初入全栈的前端工程师学习参考。

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Notes

### Init Project

```javascript
npx create-nuxt-app nuxt-koa-mall
// axios + koa + elementui + Eslint
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





