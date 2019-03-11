const router = require('koa-router')()
const indexApi = require('./index_api')
const blog = require('./blog')
const chatOnline = require('./chat_online')
const management = require('./management')

router.use('/index/api', indexApi.routes(), indexApi.allowedMethods())
router.use('/blog/api', blog.routes(), blog.allowedMethods())
router.use('/chat_online/api', chatOnline.routes(), chatOnline.allowedMethods())
router.use('/management/api', management.routes(), management.allowedMethods())

module.exports = router