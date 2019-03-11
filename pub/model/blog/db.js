const config = require('../../db').blog
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  id: String,
  visit: Number,
  date: Number,
  title: String,
  category: String,
  cover: String,
  intro: String,
  content: String
})

let Blog = mongoose.model('blog', blogSchema)

const Db = {
  connect: async () => {
    mongoose.connect(`${config.host}:${config.port}/${config.db}`, {
      useNewUrlParser: true
    })
  },

  disconnect: async () => {
    mongoose.disconnect()
  },

  find: async (options, callback) => {
    return Blog.find(options, callback)
  },

  create: async (options, callback) => {
    return Blog.create(options, callback)
  },

  update: async (options, new_options, callback) => {
    return Blog.updateOne(options, {
      $set: new_options
    })
  },

  delete: async (options, callback) => {
    return Blog.deleteOne(options, callback)
  }
}

module.exports = Db