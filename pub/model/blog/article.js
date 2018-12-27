const router = require('koa-router')()

let articles = require('../../mocks/blog_mocks')

const ArticleModel = {
  getArticles: (start = 0, count) => {
    let len = articles.length
    let result = []

    if (!count) {
      for (let i = start; i < len; i++) {
        result.push(articles[i])
      }

      return result
    }

    for (let i = start; i < start + count; i++) {
      result.push(articles[i])
    }

    return result
  },

  getArticleById: (id) => {
    let len = articles.length
    for (let i = 0; i < len; i++) {
      if (articles[i].id === id) return articles[i]
    }
  }
}

module.exports = ArticleModel