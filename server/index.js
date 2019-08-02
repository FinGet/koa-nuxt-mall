const Koa = require('koa')
const consola = require('consola')
const json = require('koa-json')
const { Nuxt, Builder } = require('nuxt')

const bannerRouter = require('./routers/banners')
const goodsRouter = require('./routers/goods')

const app = new Koa()
require('./dbs/config')

app.use(json())
app.use(bannerRouter.routes()).use(bannerRouter.allowedMethods())
app.use(goodsRouter.routes()).use(goodsRouter.allowedMethods())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
