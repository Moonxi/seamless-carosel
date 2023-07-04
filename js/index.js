var moveTo = (function () {
  // 从服务器获取的轮播图数据
  var carouselData = ['./img/Wallpaper1.jpg', './img/Wallpaper2.jpg', './img/Wallpaper3.jpg', './img/Wallpaper4.jpg', './img/Wallpaper5.jpg']
  // 当前位置
  var curIndex = 0
  // 获取需要操作的DOM元素
  var carouselContainer = document.querySelector('.carousel-container')
  var carouselItemsContainer = document.querySelector('.carousel-items-container')
  var carouselPrevArrow = document.querySelector('.carousel-prev-arrow')
  var carouselNextArrow = document.querySelector('.carousel-next-arrow')
  var carouselIndicatorsContainer = document.querySelector('.carousel-indicators-container')

  var init = function () {
    // 初始化轮播图及其尺寸和指示器
    carouselItemsContainer.innerHTML = ''
    carouselIndicatorsContainer.innerHTML = ''
    carouselItemsContainer.style.width = carouselContainer.clientWidth * (carouselData.length + 1) + 'px'
    for (var i = 0; i <= carouselData.length; i++) {
      // 轮播图
      var carouselItem = document.createElement('img')
      carouselItem.style.width = carouselContainer.clientWidth
      carouselItem.style.height = carouselContainer.clientHeight
      carouselItem.className = 'carousel-item fl'
      carouselItem.src = i === carouselData.length ? carouselData[0] : carouselData[i]
      carouselItemsContainer.appendChild(carouselItem)
      // 指示器
      if (i < carouselData.length) {
        var carouselIndicator = document.createElement('a')
        carouselIndicator.style.cursor = 'pointer'
        carouselIndicator.className = i === curIndex ? 'carousel-indicator active' : 'carousel-indicator'
        carouselIndicatorsContainer.appendChild(carouselIndicator)
      }
    }
    // 初始化事件
    initEvents()
    // 开启定时器自动轮播
    start()
  }
  // 事件处理函数
  var eventHandlers = {
    /**
     * 指示器点击事件处理
     * @param {Event} e
     * @this {HTMLElement}
     */
    clickIndicator(e) {
      var index = Array.prototype.slice.call(this.children).indexOf(e.target)
      if (index === -1) {
        return
      }
      moveTo(index)
    },
    /**
     * 左箭头向前翻页事件处理
     * @param {Event} e
     * @this {HTMLElement}
     */
    prev(e) {
      moveTo(curIndex - 1)
    },
    /**
     * 右箭头向后翻页事件处理
     * @param {Event} e
     * @this {HTMLElement}
     */
    next(e) {
      moveTo(curIndex + 1)
    }
  }
  // 初始化事件函数
  function initEvents() {
    carouselPrevArrow.addEventListener('click', eventHandlers.prev)
    carouselNextArrow.addEventListener('click', eventHandlers.next)
    carouselIndicatorsContainer.addEventListener('click', eventHandlers.clickIndicator)
    carouselContainer.addEventListener('mouseenter', stop)
    carouselContainer.addEventListener('mouseleave', start)
  }
  // 轮播图切换功能函数
  var duration = 300
  function moveTo(index) {
    if (index === curIndex || carouselItemsContainer.getAttribute('status') === 'loading') {
      return
    }
    if (index === -1) {
      curIndex = carouselData.length
      index = curIndex - 1
    }
    var from = curIndex * carouselContainer.clientWidth
    var to = index * carouselContainer.clientWidth
    createAnimation({
      from,
      to,
      duration,
      frame(n) {
        carouselItemsContainer.setAttribute('status', 'loading')
        carouselItemsContainer.style.marginLeft = -n + 'px'
      },
      end() {
        carouselItemsContainer.setAttribute('status', 'free')
        if (index === carouselData.length) {
          index = 0
        }
        curIndex = index
        // 在动画结束后设置指示器active
        setIndicatorActive()
      }
    })
  }
  // 设置指示器active函数
  function setIndicatorActive() {
    for (var i = 0; i < carouselIndicatorsContainer.children.length; i++) {
      carouselIndicatorsContainer.children[i].classList.remove('active')
    }
    carouselIndicatorsContainer.children[curIndex].classList.add('active')
  }
  // 定时器自动轮播函数
  var timer
  function start() {
    if (timer) {
      return
    }
    timer = setInterval(eventHandlers.next, 2000)
  }
  function stop() {
    clearInterval(timer)
    timer = null
  }
  init()
  return moveTo
})()
