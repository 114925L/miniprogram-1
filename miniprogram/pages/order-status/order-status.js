// pages/order-status/order-status.js
const db = require('../../utils/db');

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

        // 更新订单状态到云数据库
        db.updateOrderStatus(self.data.orderNo, 2).catch(function(err) {
          console.error('更新订单状态失败:', err);
        });
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

  goHome: function () {
    wx.switchTab({ url: '/pages/index/index' });
  },

  continueShopping: function () {
    wx.switchTab({ url: '/pages/promotion/promotion' });
  }
});
