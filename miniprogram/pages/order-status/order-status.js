// pages/order-status/order-status.js
Page({
  data: {
    orderNo: '',
    queueCount: 0,
    estimatedMinutes: 0,
    orderStatus: 'pending',
    countdown: 0,
    countdownText: ''
  },

  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo || '',
      queueCount: parseInt(options.queueCount) || 0,
      estimatedMinutes: parseInt(options.estimatedMinutes) || 30
    });

    // 倒计时
    this._startOrderCountdown();
  },

  _startOrderCountdown: function () {
    var self = this;
    var remaining = this.data.estimatedMinutes * 60;

    var timer = setInterval(function() {
      remaining--;
      if (remaining <= 0) {
        clearInterval(timer);
        self.setData({ orderStatus: 'ready', countdown: 0, countdownText: '可取货' });
        return;
      }
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      self.setData({
        countdown: m * 60 + s,
        countdownText: m + '分' + s + '秒'
      });
    }, 1000);

    var initM = Math.floor(remaining / 60);
    var initS = remaining % 60;
    this.setData({ countdown: remaining, countdownText: initM + '分' + initS + '秒' });
  },

  // 返回首页
  goHome: function () {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // 继续逛逛
  continueShopping: function () {
    wx.switchTab({ url: '/pages/promotion/promotion' });
  }
});
