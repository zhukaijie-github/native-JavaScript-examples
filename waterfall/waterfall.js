(function (global, factory) {
  if (typeof exports === 'object' && module !== undefined) {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    global = global || self;
    global.Waterfall = factory()
  }
}(this, function () {
  'use strict'
  function Waterfall (options) {
    if (!(this instanceof Waterfall)
    ) {
      throw('Waterfall 是一个构造函数，必须使用new 关键字');
    }
    this._init(options);
  }

  init(Waterfall);

  function init (Waterfall) {
    Waterfall.prototype._init = function (options) {
      if (typeof options !== 'object') {
        throw('Options 必须是一个对象')
      }
      if (!options.boxSelector && !options.itemSelector) {
        throw('Options 参数有误')
      }
      this.boxSelector = options.boxSelector

      this.itemSelector = options.itemSelector

      this.column = options.column || 1

      this.scrollBottom = options.scrollBottom || function () { }
    
      this.setPosition()
      
      this.scroll()
    }

    // 设置布局
    Waterfall.prototype.setPosition = function () {
      this.boxEl = document.querySelector(this.boxSelector)

      this.itemEl = document.querySelectorAll(this.itemSelector)

      // 缓存每列的高度
      this.cacheHeightArr = []
      
      // 父元素宽度
      this.boxWidth = this.getWidth(this.boxEl)
      // 子元素宽度
      this.itemWidth = this.boxWidth / this.column

      this.boxEl.style.cssText = 'position: relative; margin: 0 auto;'
      // 遍历设置子元素
      for (let i = 0; i < this.itemEl.length; i++) {
        this.itemEl[i].style.cssText = 'position: absolute; width: ' + this.itemWidth + 'px; top: 0; left: 0; transition: all 1s;ease-in'
        // 获取高度
        let itemHeight = this.itemEl[i].offsetHeight
        if (i < this.column) {
          // 判断是否是第一排
          this.itemEl[i].style.top = '0px'
          this.itemEl[i].style.left = i * this.itemWidth + 'px'
          // 记录每一列的高度
          this.cacheHeightArr.push(itemHeight)
        } else {
          // 最小高度
          let minItemHeight = Math.min.apply(this, this.cacheHeightArr)
          // 最小高度列的位置
          let columnIndex = this.cacheHeightArr.indexOf(minItemHeight)

          this.itemEl[i].style.top = minItemHeight + 'px'
          this.itemEl[i].style.left = columnIndex * this.itemWidth + 'px'

          // 更新数组中的高度
          this.cacheHeightArr[columnIndex] = minItemHeight + itemHeight
        }
      }

      

      this.boxEl.style.height = Math.max.apply(this, this.cacheHeightArr) + 'px'

      
    }

    // 获取宽度
    Waterfall.prototype.getWidth = function (el) {
      return el.offsetWidth
    }

    // 监听滚动条
    Waterfall.prototype.scroll = function () {
      const self = this;
      document.addEventListener('scroll', function () {
        let wH = window.innerHeight
        let scrollTop = document.documentElement.scrollTop
        let lastHeight = Math.max.apply(self, self.cacheHeightArr)
        if (wH + scrollTop >= lastHeight) {
          self.scrollBottom && self.scrollBottom(self.setPosition.bind(self))
        }
      })
    }
  }
  
  
  

  return Waterfall
}))