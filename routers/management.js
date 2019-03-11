const router = require('koa-router')()
const userModel = require('../pub/model/management/user')

router.post('/login', async ctx => {
  const postData = ctx.request.body
  let password = postData.password

  if (userModel.isMaster(password)) {
    userModel.setMasterCookie(ctx)

    ctx.body = {
      success: true,
      retcode: 0,
      message: 'welcome my master'
    }
  } else {
    ctx.body = {
      success: false,
      message: 'you are not master!!!'
    }
  }
})

router.post('/logout', async ctx => {
  const user = userModel.checkMasterCookie(ctx)

  if (user) {
    userModel.clearMasterCookie(ctx)

    ctx.body = {
      success: true,
      retcode: 0,
      message: 'goodbye my master'
    }
  } else {
    ctx.body = {
      success: false,
      message: 'you are not login'
    }
  }
})

router.get('/get_masterinfo', async ctx => {
  const user = userModel.checkMasterCookie(ctx)

  if (user) {
    ctx.body = {
      is_login: true
    }
  } else {
    ctx.body = {
      is_login: false
    }
  }
})

router.get('/test_api', async ctx => {
  ctx.body = {
    success: true,
    retcode: 0
  }
})

module.exports = router