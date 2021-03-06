(function() {
  var T = {
    qS: function(selector) {
      return document.querySelector(selector)
    },
    cE: function(node) {
      return document.createElement(node)
    }
  }
  var blogContainer = T.qS('.blog-container')
  var fragment = document.createDocumentFragment()

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

  // xss 输出检查
  function render(article) {
    var id = article.id
    var title = XSS(article.title)
    var time = COMMON.formateDate('YYYY年MM月DD日 hh点mm分', article.date)
    var visit = article.visit
    var content = markdown2html(decodeURIComponent(article.content))

    var blogItem = T.cE('div')
    blogItem.classList.add('blog-item-wrapper')

    var blogHref = encodeURI('/blog/detail.html?id=' + article.id)

    var renderHTML = '' +
      '<div class="blog-item-header">' +
      '<div class="blog-item-tt-wrapper">' +
      '<a href="' + blogHref + '" class="blog-item-tt">' + title + '</a>' +
      '</div>' +
      '<div class="blog-item-info-wrapper">' +
      '<span class="blog-item-time">' + time + '</span>' +
      '<span class="blog-item-visit">' + visit + '次浏览' + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="blog-item-content-wrapper">' +
      '<div class="blog-item-content">' + content + '</div>' +
      '</div>' +
      '<div class="blog-item-footer">' +
      '<a href="' + blogHref + '" class="blog-item-more">[ 查看全文 ]</a>' +
      '</div>'

    blogItem.innerHTML = renderHTML

    if (COMMON.qS('.point-loading')) {
      COMMON.qS('.point-loading').style.display = 'none'
    }

    fragment.appendChild(blogItem)

    codeHighLight()
  }

  function blogAjaxRequest(start, count) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var articles = JSON.parse(xhr.responseText).result.articles || []
        var article_total = JSON.parse(xhr.responseText).result.total

        // 动态生成分页器
        var __BLOG_PAGINATION__ = new __PAGINATION__({
          id: 'blog_pagination',
          page_show_count: 3,
          page_total: Math.ceil(article_total / 4)
        })

        var len = articles.length

        for (var i = 0; i < len; i++) {
          if (articles[i]) {
            render(articles[i])
          }
        }

        blogContainer.innerHTML = ''
        blogContainer.appendChild(fragment)
      }
    }

    xhr.open('GET', '/blog/api/get_articles?' + 'start=' + start + '&count=' + count)

    xhr.send(null)
  }

  var page = +COMMON.getUrlParam('page') || 1
  var count = 4
  var start = (page - 1) * count

  blogAjaxRequest(start, count)
})()