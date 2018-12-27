(function() {
  var articleContainer = document.querySelector('.article-container')

  var artileId = COMMON.getUrlParam('id') || ''

  function render(detail) {
    var id = detail.id || ''
    var title = detail.title || ''
    var time = COMMON.formateDate('YYYY年MM月DD日', detail.date)
    var visit = detail.visit
    var content = detail.content || ''

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
      '<div class="article-footer-text">article footer is building...</div>' +
      '</div>'

    articleBox.innerHTML = articleHTML
    articleContainer.appendChild(articleBox)
  }

  function ajaxArticleRequest(id) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var detail = JSON.parse(xhr.responseText).detail
        render(detail)
      }
    }

    xhr.open('GET', 'api/get_article_detail?' + 'id=' + id)

    xhr.send(null)
  }

  ajaxArticleRequest(artileId)
})()