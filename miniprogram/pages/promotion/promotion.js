// pages/promotion/promotion.js
const { banners, couponList, secretKillItems } = require('../../constants/index');

Page({
  data: {
    banners: banners,
    currentBanner: 0,
    couponList: couponList,
    secretKillItems: secretKillItems,
    countdown: { hours: 0, minutes: 0, seconds: 0 },
    userCoupons: []
  },

  onLoad: function () {
    this._startCountdown();
  },

  onShow: function () {
    this.setData({ userCoupons: wx.getStorageSync('userReceivedCoupons') || [] });
  },

  onBannerChange: function (e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onBannerTap: function (e) {
    var idx = e.currentTarget.dataset.index;
    var titles = ['新品推荐', '满减活动', '积分兑换'];
    wx.showToast({ title: titles[idx], icon: 'none' });
  },

  _startCountdown: function () {
    var totalSeconds = 7200;
    var timer = setInterval(function() {
      if (totalSeconds <= 0) {
        clearInterval(timer);
        return;
      }
      totalSeconds--;
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = totalSeconds % 60;
      this.setData({
        countdown: {
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        }
      });
    }.bind(this), 1000);
  },

  onReceiveCoupon: function (e) {
    var couponId = e.currentTarget.dataset.id;
    var coupon = this.data.couponList.find(function(c) { return c.id === couponId; });
    if (!coupon) return;

    var userCoupons = wx.getStorageSync('userReceivedCoupons') || [];
    if (userCoupons.indexOf(couponId) !== -1) {
      wx.showToast({ title: '已经领取过了', icon: 'none' });
      return;
    }

    userCoupons.push(couponId);
    wx.setStorageSync('userReceivedCoupons', userCoupons);
    this.setData({ userCoupons: userCoupons });

    wx.showToast({ title: '领取成功', icon: 'success' });
  }
});
