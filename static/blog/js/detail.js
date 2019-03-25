(function() {
  var articleContainer = document.querySelector('.article-container')

  var artileId = COMMON.getUrlParam('id') || ''

  // xss防范
  function XSS (content) {
    // xss config
    var myxss

    var XSS_CONFIG = {
      allowTag: ['p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'span', 'div', 'pre', 'figure', 'table', 'tbody', 'th', 'tr', 'td', 'br', 'b', 'code', 'hr', 'header', 'footer', 'section', 'main', 'aside', 'article'],
      allowAttr: ['src', 'href', 'alt', 'title', 'style', 'class'],
      options: {
        whiteList: {}
      }
    }

    XSS_CONFIG.allowTag.forEach(tag => {
        XSS_CONFIG.options.whiteList[tag] = XSS_CONFIG.allowAttr
      })

      myxss = new filterXSS.FilterXSS(XSS_CONFIG.options)

      return myxss.process(content)
  }

  // token校验
  function getToken () {
    return md5(COMMON.getCookieItem('masterKey'))
  }

  function markdown2html(content) {
    var converter = new showdown.Converter()
    var html = converter.makeHtml(content)

    return XSS(html)
  }

  function codeHighLight() {
    COMMON.qSA('pre').forEach(function(block) {
      hljs.highlightBlock(block)
    })
  }

  function addVisitCount(id, visit) {
    var options = {
      id: encodeURIComponent(id)
    }

    var new_options = {
      visit: visit + 1
    }

    var send_options = JSON.stringify(options)
    var send_new_options = JSON.stringify(new_options)

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {}
    xhr.open('POST', '/blog/api/update_article')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send('options=' + send_options + '&new_options=' + send_new_options + '&token=' + getToken())
  }

  // 输出检查
  function render(detail) {
    var id = detail[1].id || ''
    var title = XSS(decodeURIComponent(detail[1].title)) || ''
    var time = COMMON.formateDate('YYYY年MM月DD日 hh点mm分', detail[1].date)
    var visit = +detail[1].visit + 1
    var content = markdown2html(decodeURIComponent(detail[1].content)) || ''
    var pre_title = detail[0] ? detail[0].title : '没有了'
    var pre_href = detail[0] ? encodeURI('/blog/detail.html?id=' + detail[0].id) : 'javascript:void(0)'
    var next_title = detail[2] ? detail[2].title : '没有了'
    var next_href = detail[2] ? encodeURI('/blog/detail.html?id=' + detail[2].id) : 'javascript:void(0)'

    var articleBox = document.createElement('div')
    articleBox.classList.add('article-box')

    var articleHTML = '' +
      '<div class="article-header">' +
      '<div class="article-tt-wrapper">' +
      '<div class="article-tt">' + title + '</div>' +
      '</div>' +
      '<div class="article-info-wrapper">' +
      '<span class="article-time">' + time + '</span>' +
      '<span class="article-visit">' + visit + '次浏览' + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="article-main-wrapper">' +
      '<div class="article-main">' + content + '</div>' +
      '</div>' +
      '<div class="article-footer">' +
      '<a class="article-footer-pre" href="' + pre_href + '">上一篇：' + pre_title + '</a>' +
      '<a class="article-footer-next" href="' + next_href + '">下一篇：' + next_title + '</a>' +
      '</div>'

    articleBox.innerHTML = articleHTML

    if (COMMON.qS('.point-loading')) {
      COMMON.qS('.point-loading').style.display = 'none'
    }

    articleContainer.appendChild(articleBox)

    codeHighLight()
  }

  function ajaxArticleRequest(id) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var detail = JSON.parse(xhr.responseText).detail
        render(detail)
        addVisitCount(detail[1].id, detail[1].visit)
      }
    }

    xhr.open('GET', 'api/get_article_detail?id=' + id)

    xhr.send(null)
  }

  ajaxArticleRequest(artileId)
})()