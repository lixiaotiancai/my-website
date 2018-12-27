const router = require('koa-router')()

const articleModel = require('../pub/model/blog/article')

// this is a api for test
router.get('/test_api', async ctx => {
  ctx.body = {
    success: true,
    retcode: 0
  }
})

/**
 * 获取文章列表
 */
router.get('/get_articles', async (ctx) => {
  const start = +ctx.query.start || 0
  const count = +ctx.query.count || 0

  ctx.body = {
    success: true,
    articles: articleModel.getArticles(start, count)
  }
})

/**
 * 获取文章详情
 */
router.get('/get_article_detail', async (ctx) => {
  // 获取文章 id
  const id = +ctx.query.id
  ctx.body = {
    success: true,
    detail: articleModel.getArticleById(id)
  }
})

module.exports = router