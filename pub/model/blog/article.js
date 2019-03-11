const router = require('koa-router')()

let articles = require('../../mocks/blog_mocks')

let Db = require('./db')

const ArticleModel = {
  // getArticles: (start = 0, count) => {
  //   let len = articles.length
  //   let result = []

  //   if (!count) {
  //     for (let i = start; i < len; i++) {
  //       result.push(articles[i])
  //     }

  //     return result
  //   }

  //   for (let i = start; i < start + count; i++) {
  //     result.push(articles[i])
  //   }

  //   return result
  // },

  // getArticleById: (id) => {
  //   let len = articles.length

  //   for (let i = 0; i < len; i++) {
  //     if (articles[i].id === id) return articles[i]
  //   }
  // },

  getArticles: async (start = 0, count) => {
    let result = []
    let ret = {}

    await Db.find({}, function(err, docs) {
      let articles = [].reverse.call(docs)
      let len = articles.length

      if (!count) {
        for (let i = start; i < len; i++) {
          result.push(articles[i])
          ret.articles = result
          ret.total = len
        }

        return result
      }

      for (let i = start; i < start + count; i++) {
        result.push(articles[i])
        ret.articles = result
        ret.total = len
      }
    })


    return ret
  },

  getArticleById: async (id) => {
    let result

    await Db.find({}, function(err, docs) {
      let articles = [].reverse.call(docs)
      let len = articles.length

      for (let i = 0; i < len; i++) {
        if (articles[i].id === id) {
          result = [articles[i - 1], articles[i], articles[i + 1]]
        }
      }
    })

    return result
  },
  // test
  testGetArticle: async () => {
    let article

    await Db.find({}, function(err, docs) {
      article = docs
    })

    return article
  },

  testPostArticle: async opts => {
    let opt = JSON.parse(opts)
    let options = {
      id: 0,
      visit: 0,
      date: +new Date(),
      title: '???',
      category: '???',
      cover: '???',
      intro: '???',
      content: '???',
      ...opt
    }

    await Db.create(options)
  },

  updateArticle: async (opts, newopts) => {
    let opt = JSON.parse(opts)
    let new_opts = JSON.parse(newopts)
    let new_options = {
      ...new_opts
    }

    await Db.update(opt, new_options)
  },

  deleteArticle: async opts => {
    let opt = JSON.parse(opts)

    await Db.delete(opt)
  }
}

module.exports = ArticleModel