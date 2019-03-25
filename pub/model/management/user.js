const router = require('koa-router')()
const md5 = require('blueimp-md5')

let masterSession = {}

const master_password = '000'

const UserModel = {
  isMaster: password => {
    return password === master_password
  },

  setMasterCookie: ctx => {
    const masterKey = Math.random() * 1000

    ctx.cookies.set('masterKey', masterKey, {
      httpOnly: false
    })

    masterSession['master'] = masterKey
  },

  clearMasterCookie: ctx => {
    masterSession['master'] = null

    ctx.cookies.set('masterKey', '', {
      expires: new Date(0)
    })
  },

  checkMasterCookie: ctx => {
    const masterKey = ctx.cookies.get('masterKey')

    return (masterSession['master'] != undefined) && (masterSession['master'] == masterKey)
  },

  // 添加toker验证
  getToken: ctx => {
    return md5(masterSession['master'])
  }
}

module.exports = UserModel