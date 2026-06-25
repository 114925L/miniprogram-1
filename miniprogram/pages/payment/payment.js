// pages/payment/payment.js
const db = require('../../utils/db');

Page({
  data: {
    orderNo: '',
    queueCount: 0,
    estimatedMinutes: 0,
    finalAmount: 0,
    paymentMethod: 'wechat'
  },

  onLoad: function (options) {
    this.setData({
      orderNo: decodeURIComponent(options.orderNo || ''),
      queueCount: parseInt(options.queueCount) || 0,
      estimatedMinutes: parseInt(options.estimatedMinutes) || 30,
      finalAmount: parseFloat(options.finalAmount) || 0
    });
  },

  onPaymentTap: function (e) {
    this.setData({ paymentMethod: e.currentTarget.dataset.method });
  },

  confirmPay: function () {
    var self = this;
    wx.showLoading({ title: '支付中...' });

    // 更新订单状态为已付款
    db.updateOrderStatus(this.data.orderNo, 4).then(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/order-status/order-status?orderNo=' + self.data.orderNo + '&queueCount=' + self.data.queueCount + '&estimatedMinutes=' + self.data.estimatedMinutes
      });
    }).catch(function (err) {
      wx.hideLoading();
      console.error('支付更新失败:', err);
      wx.showToast({ title: '支付失败，请重试', icon: 'none' });
    });
  },

  cancelPay: function () {
    // 取消支付：订单恢复为待付款
    var self = this;
    db.updateOrderStatus(this.data.orderNo, 0).then(function () {
      wx.navigateBack();
    }).catch(function (err) {
      console.error('取消订单失败:', err);
      wx.navigateBack();
    });
  }
});
