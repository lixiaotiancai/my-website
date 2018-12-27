const router = require('koa-router')()

// this is a api for test
router.get('/test_api', async ctx => {
    ctx.body = {
        success: true,
        retcode: 0
    }
})

module.exports = router