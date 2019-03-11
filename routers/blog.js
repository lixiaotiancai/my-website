const router = require('koa-router')()

const articleModel = require('../pub/model/blog/article')
const db = require('../pub/model/blog/db')

// this is a api for test
router.get('/test_api', async ctx => {
  ctx.body = {
    success: true,
    retcode: 0
  }
})

/**
 * blog test api
 */
router.get('/test_get_article', async ctx => {
  await db.connect()

  let articles = await articleModel.testGetArticle()

  ctx.body = {
    success: true,
    retcode: 0,
    articles: articles
  }
})

router.post('/test_post_article', async ctx => {
  await db.connect()

  const postData = ctx.request.body
  let options = postData.options

  ctx.body = {
    success: true,
    retcode: 0
  }

  await articleModel.testPostArticle(options)
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
  let options = postData.options
  let new_options = postData.new_options

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
  let options = postData.options

  ctx.body = {
    success: true,
    retcode: 0
  }

  await articleModel.deleteArticle(options)
})

module.exports = router