(function() {
  function Tab(option) {
    var util = this.util = {
      qS: function(cls) {
        return document.querySelector(cls)
      },
      qSA: function(cls) {
        return document.querySelectorAll(cls)
      },
      byId: function(id) {
        return document.getElementById(id)
      },
      toArray: function(arr) {
        return [].slice.call(arr)
      }
    }

    this.header = util.qSA('.tab-header-item')
    this.body = util.qSA('.tab-body-container')
    this.tabHeader = util.qS('.management-main-sidebar')

    this.hiddenBody()
    this.active(1)
    this.bindEvent()
  }

  Tab.prototype.hiddenBody = function() {
    this.util.toArray(this.body).forEach(function(item) {
      item.classList.add('hidden')
    })
  }

  Tab.prototype.active = function(active) {
    var cur = this.curItem

    if (cur === active) return

    if (cur !== undefined) {
      this.header[cur].classList.remove('tab-header-item--active')
      this.body[cur].classList.add('hidden')
    }

    this.header[active].classList.add('tab-header-item--active')
    this.body[active].classList.remove('hidden')

    this.curItem = active
  }

  Tab.prototype.bindEvent = function() {
    var self = this
    self.tabHeader.addEventListener('click', function(e) {
      var target = e.target

      if (target && target.classList.contains('tab-header-item')) {
        e.stopPropagation()
        self.active(self.util.toArray(self.header).indexOf(target))
      }
    })
  }

  window.__MANAGEMENT_TAB__ = Tab
})()