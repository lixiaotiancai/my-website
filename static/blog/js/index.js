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

  function render(article) {
    var id = article.id
    var title = article.title
    var time = COMMON.formateDate('YYYY年MM月DD日', article.date)
    var visit = article.visit
    var content = article.content

    var blogItem = T.cE('div')
    blogItem.classList.add('blog-item-wrapper')

    var blogHref = '/blog/detail.html?id=' + article.id

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
      '<a href="' + blogHref + '" class="blog-item-more">查看全文</a>' +
      '</div>'

    blogItem.innerHTML = renderHTML

    fragment.appendChild(blogItem)
  }

  function blogAjaxRequest(start, count) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var articles = JSON.parse(xhr.responseText).articles || []
        var len = articles.length

        for (var i = 0; i < len; i++) {
          render(articles[i])
        }

        blogContainer.innerHTML = ''
        blogContainer.appendChild(fragment)
      }
    }

    xhr.open('GET', '/blog/api/get_articles?' + 'start=' + start + '&count=' + count)

    xhr.send(null)
  }

  var page = +COMMON.getUrlParam('page') || 1
  var count = 3
  var start = (page - 1) * count

  blogAjaxRequest(start, count)
})()