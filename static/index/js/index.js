(function() {
  function ajaxHotAritcleRequest() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var articles = JSON.parse(xhr.responseText).result.articles

        articles.sort(function(a, b) {
          return (b.visit || 0) - (a.visit || 0)
        })

        render(articles)
      }
    }

    xhr.open('GET', '/blog/api/get_articles?start=0')

    xhr.send(null)
  }

  function render(articles) {
    var blogHref = '/blog/detail.html?id='

    var blogContent = document.querySelector('.blog-content')

    var blogBox = document.createElement('div')
    blogBox.classList.add('blog-box')

    var blogHTML = ''

    blogHTML = '' +
      '<a class="content-img-wrapper" href="' + blogHref + articles[0].id + '">' +
      '<div class="content-img" style="background-image:url(' + decodeURIComponent(decodeURIComponent(articles[0].cover)) + ')"></div>' +
      '</a>' +
      '<div class="blog-item-wrapper">' +
      '<a class="blog-item blog-active" href="' + blogHref + articles[0].id + '">' +
      '<div class="blog-item-tt">' + articles[0].title + '</div>' +
      '<div class="blog-item-visit">' + articles[0].visit + '次浏览</div>' +
      '<div class="blog-item-content">' + articles[0].intro + '</div>' +
      '</a>' +
      '<a class="blog-item" href="' + blogHref + articles[1].id + '">' +
      '<div class="blog-item-tt">' + articles[1].title + '</div>' +
      '<div class="blog-item-visit">' + articles[1].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + blogHref + articles[2].id + '">' +
      '<div class="blog-item-tt">' + articles[2].title + '</div>' +
      '<div class="blog-item-visit">' + articles[2].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + blogHref + articles[3].id + '">' +
      '<div class="blog-item-tt">' + articles[3].title + '</div>' +
      '<div class="blog-item-visit">' + articles[3].visit + '次浏览</div>' +
      '</a>' +
      '<a class="blog-item" href="' + blogHref + articles[4].id + '">' +
      '<div class="blog-item-tt">' + articles[4].title + '</div>' +
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