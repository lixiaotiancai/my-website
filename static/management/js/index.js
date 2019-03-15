(function() {
  function getMode() {
    var mode = COMMON.getUrlParam('mode')

    return mode === 'edit' // false为新建模式 true为编辑模式
  }

  function prepareModeEnvironment() {
    if (getMode()) {
      if (management_tab) {
        management_tab.active(0)
      }

      COMMON.qS('.tab-header-item').innerText = '编辑文档'
      COMMON.qS('.newblog-submit-btn').style.display = 'none'

      var id = COMMON.getUrlParam('id')
      editBlog(id)
    } else {
      COMMON.qS('.blog-edit-btn').style.display = 'none'
      COMMON.qS('.blog-cancel-edit').style.display = 'none'
    }
  }

  function editBlog(id) {
    var xhr = new XMLHttpRequest

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var detail = JSON.parse(xhr.responseText).detail[1]
        var title = detail.title
        var id = detail.id
        var visit = detail.visit
        var date = detail.date
        var category = detail.category
        var cover = decodeURIComponent(detail.cover)
        var intro = detail.intro
        var content = decodeURIComponent(detail.content)
        window.__DATA_BASE_ID__ = detail._id

        COMMON.qS('.newblog-tt-input').value = title
        COMMON.qS('.newblog-id-input').value = id
        COMMON.qS('.newblog-category-input').value = category
        COMMON.qS('.newblog-cover-input').value = cover
        COMMON.qS('.newblog-intro-input').value = intro
        COMMON.qS('.newblog-content-input').innerText = content

        markdown2html()
        COMMON.qSA('pre').forEach(function(block) {
          hljs.highlightBlock(block)
        })
      }
    }

    xhr.open('GET', '/blog/api/get_article_detail?id=' + id)

    xhr.send(null)
  }

  function postBlog() {
    var options = {
      id: COMMON.qS('.newblog-id-input').value || 'undefined',
      visit: 0,
      date: +new Date(),
      title: COMMON.qS('.newblog-tt-input').value || 'undefined',
      category: COMMON.qS('.newblog-category-input').value,
      cover: encodeURIComponent(encodeURIComponent(COMMON.qS('.newblog-cover-input').value)) || '',
      intro: COMMON.qS('.newblog-intro-input').value || '',
      content: encodeURIComponent(encodeURIComponent(COMMON.qS('.newblog-content-input').innerText))
    }

    var send_options = JSON.stringify(options)

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        window.alert('新建成功！' + xhr.responseText)
        window.location.reload()
      }
    }

    xhr.open('POST', '/blog/api/post_article')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('options=' + send_options)
  }

  function updateBlog() {
    var options = {
      _id: window.__DATA_BASE_ID__
    }

    var new_options = {
      id: COMMON.qS('.newblog-id-input').value,
      title: COMMON.qS('.newblog-tt-input').value,
      category: COMMON.qS('.newblog-category-input').value,
      cover: encodeURIComponent(encodeURIComponent(COMMON.qS('.newblog-cover-input').value)),
      intro: COMMON.qS('.newblog-intro-input').value,
      content: encodeURIComponent(encodeURIComponent(COMMON.qS('.newblog-content-input').innerText))
    }

    var send_options = JSON.stringify(options)
    var send_new_options = JSON.stringify(new_options)

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        window.alert('更新成功！' + xhr.responseText)
        window.location.href = "/management/index.html"
      }
    }

    xhr.open('POST', '/blog/api/update_article')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('options=' + send_options + '&new_options=' + send_new_options)

    window.__DATA_BASE_ID__ = null
  }

  function deleteBlog(id) {
    var options = {
      id: id
    }

    var send_options = JSON.stringify(options)

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        window.alert('删除成功！' + xhr.responseText)
        window.location.reload()
      }
    }

    xhr.open('POST', '/blog/api/delete_article')

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.send('options=' + send_options)
  }

  function getBlog() {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var res = JSON.parse(xhr.responseText).result
        var articles = res.articles
        var total = res.total

        renderManagementTable(articles, total)
      }
    }

    xhr.open('GET', '/blog/api/get_articles?start=0')

    xhr.send(null)
  }

  function renderManagementTable(articles, total) {
    // var title = articles.title
    // var date = COMMON.formateDate('YYYY/MM/DD', articles.date)
    // var visit = articles.visit
    // var category = articles.category

    var table = COMMON.qS('.management-table')

    for (var i = 0; i < total; i++) {
      var id = articles[i].id
      var title = articles[i].title
      var date = COMMON.formateDate('YYYY/MM/DD', articles[i].date)
      var visit = articles[i].visit
      var category = articles[i].category

      var tr = document.createElement('tr')
      tr.classList.add('management-blog')

      var trHTML = '' +
        '<td class="table-blog-item">' + title + '</td>' +
        '<td class="table-blog-item">' + date + '</td>' +
        '<td class="table-blog-item">' + visit + '</td>' +
        '<td class="table-blog-item">' + category + '</td>' +
        '<td class="table-blog-item">' +
        '<a class="blog-option-check" href="/blog/detail.html?id=' + id + '" target="_blank">查看 </a>' +
        '<a class="blog-option-edit" href="/management/index.html?mode=edit&id=' + id + '">编辑 </a>' +
        '<a class="blog-option-delete" href="javascript:void(0)" data-id=' + id + '>删除 </a>' +
        '</td>'

      tr.innerHTML = trHTML

      if (COMMON.qS('.loading')) {
        COMMON.qS('.loading').style.display = 'none'
      }

      table.appendChild(tr)
    }
  }

  function markdown2html() {
    var markdown = COMMON.qS('.newblog-content-input').innerText
    var converter = new showdown.Converter()
    var html = converter.makeHtml(markdown)

    COMMON.qS('.newblog-preview').innerHTML = html
  }

  function bindEvent() {
    COMMON.qS('.newblog-submit-btn').addEventListener('click', function(e) {
      postBlog()
    })

    COMMON.qS('.blog-edit-btn').addEventListener('click', function() {
      updateBlog()
    })

    COMMON.qS('.management-table').addEventListener('click', function(e) {
      var target = e.target

      if (target && target.classList.contains('blog-option-delete') && target.getAttribute('data-id')) {
        var id = target.getAttribute('data-id')
        deleteBlog(id)
      }
    })

    COMMON.qS('.newblog-content-input').addEventListener('keyup', function(e) {
      markdown2html()
      COMMON.qSA('pre').forEach(function(block) {
        hljs.highlightBlock(block)
      })
    })

    getBlog()

    prepareModeEnvironment()
  }

  function init() {
    bindEvent()
  }

  init()
})()