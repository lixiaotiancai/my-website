(function() {
  function ajaxHotAritcleRequest() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var articles = JSON.parse(xhr.responseText).hot_articles

        render(articles)
      }
    }

    xhr.open('GET', '/blog/api/get_hot_articles?hotnum=5')

    xhr.send(null)
  }

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

  // 添加xss 输出检查
  function render(articles) {
    var blogHref = '/blog/detail.html?id='

    var blogContent = document.querySelector('.blog-content')

    var blogBox = document.createElement('div')
    blogBox.classList.add('blog-box')

    var blogHTML = ''

    blogHTML = '' +
      '<a class="content-img-wrapper" href="' + encodeURI(blogHref + articles[0].id) + '">' +
      '<div class="content-img" style="background-image:url(' + encodeURI(decodeURIComponent(articles[0].cover)) + ')"></div>' +
      '</a>' +
      '<div class="blog-item-wrapper">' +
      '<a class="blog-item blog-active" href="' + encodeURI(blogHref + articles[0].id) + '">' +
      '<div class="blog-item-tt">' + XSS(articles[0].title) + '</div>' +
      '<div class="blog-item-visit">' + articles[0].visit + '次浏览</div>' +
      '<div class="blog-item-content">' + XSS(articles[0].intro) + '</div>' +
      '</a>' +
      '<a class="blog-item" href="' + encodeURI(blogHref + articles[1].id) + '">' +
      '<div class="blog-item-tt">' + XSS(articles[1].title) + '</div>' +
      '<div class="blog-item-visit">' + articles[1].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + encodeURI(blogHref + articles[2].id) + '">' +
      '<div class="blog-item-tt">' + XSS(articles[2].title) + '</div>' +
      '<div class="blog-item-visit">' + articles[2].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + encodeURI(blogHref + articles[3].id) + '">' +
      '<div class="blog-item-tt">' + XSS(articles[3].title) + '</div>' +
      '<div class="blog-item-visit">' + articles[3].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + encodeURI(blogHref + articles[4].id) + '">' +
      '<div class="blog-item-tt">' + XSS(articles[4].title) + '</div>' +
      '<div class="blog-item-visit">' + articles[4].visit + '次浏览</div>' +
      '</a>' +
      '</div>'

    blogBox.innerHTML = blogHTML
    blogContent.innerHTML = ''
    blogContent.appendChild(blogBox)

    if (document.querySelector('.point-loading')) {
      document.querySelector('.point-loading').style.display = 'none'
    }
  }

  ajaxHotAritcleRequest()
})()