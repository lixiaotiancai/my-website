const router = require('koa-router')()
const userModel = require('../pub/model/management/user')
const articleModel = require('../pub/model/blog/article')
const db = require('../pub/model/blog/db')

const referer_reg = /^https?:\/\/localhost:3000/

// this is a api for test
router.get('/test_api', async ctx => {
  ctx.body = {
    success: true,
    retcode: 0
  }
})

router.post('/post_article', async ctx => {
  await db.connect()

  const postData = ctx.request.body
  const referer = ctx.request.header.referer
  let options = postData.options
  let token = postData.token

  // 添加referer验证
  if (!referer_reg.test(referer)) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'referer不正确'
    }

    return
  }

  // 添加token验证
  if (!userModel.getToken() === token) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'token不正确'
    }

    return
  }

  ctx.body = {
    success: true,
    retcode: 0
  }

  await articleModel.postArticle(options)
})


/**
 * 获取文章列表
 */
router.get('/get_articles', async (ctx) => {
  await db.connect()
  const start = +ctx.query.start || 0
  const count = +ctx.query.count || 0
  let result = {}

  while (!result.articles) {
    result = await articleModel.getArticles(start, count)
  }

  ctx.body = {
    success: true,
    result: result
  }
})

/**
 * 获取热门文章
 */
router.get('/get_hot_articles', async ctx => {
  await db.connect()

  const referer = ctx.request.header.referer
  const hotnum = +ctx.query.hotnum || 0
  let hot_articles = []

  // 添加referer验证
  if (!referer_reg.test(referer)) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'referer不正确'
    }

    return
  }

  while (!hot_articles.length) {
    hot_articles = await articleModel.getHotArticles(hotnum)
  }

  ctx.body = {
    success: true,
    hot_articles: hot_articles
  }
})


/**
 * 获取文章详情
 */
router.get('/get_article_detail', async (ctx) => {
  await db.connect()
  // 获取文章 id
  const id = ctx.query.id
  let detail

  while (!detail) {
    detail = await articleModel.getArticleById(id)
  }

  ctx.body = {
    success: true,
    detail: detail
  }
})

/**
 * 更新文章
 */
router.post('/update_article', async ctx => {
  await db.connect()

  const postData = ctx.request.body
  const referer = ctx.request.header.referer
  let options = postData.options
  let new_options = postData.new_options
  let token = postData.token

  // 添加referer验证
  if (!referer_reg.test(referer)) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'referer不正确'
    }

    return
  }

  // 添加token验证
  if (!userModel.getToken() === token) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'token不正确'
    }

    return
  }

  ctx.body = {
    success: true,
    retcode: 0
  }

  await articleModel.updateArticle(options, new_options)
})

/**
 * 删除文章
 */
router.post('/delete_article', async ctx => {
  await db.connect()

  const postData = ctx.request.body
  const referer = ctx.request.header.referer
  let options = postData.options
  let token = postData.token

  // 添加referer验证
  if (!referer_reg.test(referer)) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'referer不正确'
    }

    return
  }

  // 添加token验证
  if (!userModel.getToken() === token) {
    ctx.body = {
      success: false,
      retcode: -1,
      message: 'token不正确'
    }

    return
  }

  ctx.body = {
    success: true,
    retcode: 0
  }

  await articleModel.deleteArticle(options)
})

module.exports = router