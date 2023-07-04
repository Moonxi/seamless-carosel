var createAnimation = (function () {
  function createAnimation({ from = 0, to = 1, duration = 1000, frame, end = function () {}, frameRate = 60 }) {
    var curthis = this
    // 总共需要变化次数
    var n = Math.floor((duration / 1000) * frameRate)
    var dis = (to - from) / n
    // 当前变化次数
    var curN = 0
    var timer = setInterval(function () {
      curN++
      from += dis
      if (curN >= n) {
        from = to
        frame && frame.call(curthis, from)
        clearInterval(timer)
        end.call(curthis)
        return
      }
      frame && frame.call(curthis, from)
    }, 1000 / frameRate)
  }
  return createAnimation
})()
