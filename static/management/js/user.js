(function() {
  function ajaxLogin(password) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)
        if (data.success) {
          window.location.href = '/management/index.html'
        } else {
          window.alert('密码错误' + JSON.stringify(data))
        }
      }
    }

    xhr.open('POST', '/management/api/login')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('password=' + password)
  }

  function ajaxLogout() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText)
        if (data.success) {
          window.location.href = '/management/pwd.html'
        } else {
          console.log(data.message)
        }
      }
    }

    xhr.open('POST', '/management/api/logout')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send(null)
  }

  function bindEvents() {
    if (COMMON.qS('.management-logout')) {
      COMMON.qS('.management-logout').addEventListener('click', function(e) {
        ajaxLogout()
      })
    }

    if (COMMON.qS('.login-submit-btn') && COMMON.qS('.login-submit-btn')) {
      COMMON.qS('.login-submit-btn').addEventListener('click', function(e) {
        var password = COMMON.qS('.login-input-password').value
        ajaxLogin(password)
      })

      COMMON.qS('.login-input-password').addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
          var password = COMMON.qS('.login-input-password').value
          ajaxLogin(password)
        }
      })
    }
  }

  function init() {
    bindEvents()
  }

  init()
})()