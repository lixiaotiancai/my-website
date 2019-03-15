const config = require('../../db').chat_online
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

let User = mongoose.model('users', userSchema)

const Db = {
  connect: async () => {
    await mongoose.connect(`${config.host}:${config.port}/${config.db}`, {
      useNewUrlParser: true
    })
  },

  disconnect: async () => {
    mongoose.disconnect()
  },

  find: async (options, callback) => {
    let result = await User.find(options, callback)
    return result
  },

  create: async (options, callback) => {
    let result = await User.create(options, callback)
    return result
  }
}

module.exports = Db