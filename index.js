const Koa = require('koa')
const app = new Koa()
const logger = require('koa-logger')
const router = require('koa-router')()
const convert = require('koa-convert')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const passport = require('koa-passport')

app.keys = ['some secret hurr'];

app.use(convert(logger()))
app.use(convert(bodyParser()))
app.use(convert(session(app)))
app.use(convert(passport.initialize()))
app.use(convert(passport.session()))

app.use(router.routes())
app.use(router.allowedMethods());

require('./auth')

// Public paths
router.get('/auth/google',
  convert(passport.authenticate('google', { scope: ['profile'] }))
)

router.get('/auth/google/callback',
  convert(passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/'
  }))
)

router.get('/login', (ctx, next) => {
  ctx.body = '<a href="/auth/google">Login</a>'
})

router.get('/logout', (ctx, next) => {
  ctx.logout()
  ctx.redirect('/login')
})

router.use((ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/login')
  }
})

// Protected paths
router.get('/app', (ctx, next) => {
  ctx.body = '<h2>App</h2><a href="/test">test</a>'
})

router.get('/test', (ctx, next) => {
  ctx.body = '<h2>Test</h2><a href="/app">app</a>'
})

// start server
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server listening on', port))