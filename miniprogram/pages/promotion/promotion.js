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
    this.setData({ userCoupons: wx.getStorageSync('userCoupons') || [] });
  },

  // Banner 切换
  onBannerChange: function (e) {
    this.setData({ currentBanner: e.detail.current });
  },

  // Banner 点击
  onBannerTap: function (e) {
    const idx = e.currentTarget.dataset.index;
    const titles = ['新品上市', '满减活动', '积分兑换'];
    wx.showToast({ title: titles[idx], icon: 'none' });
  },

  // 秒杀倒计时
  _startCountdown: function () {
    let totalSeconds = 7200; // 2 小时

    const timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timer);
        return;
      }
      totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      this.setData({
        countdown: {
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        }
      });
    }, 1000);
  },

  // 领取优惠券
  onReceiveCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const coupon = this.data.couponList.find(c => c.id === couponId);
    if (!coupon) return;

    let userCoupons = wx.getStorageSync('userCoupons') || [];
    if (userCoupons.includes(couponId)) {
      wx.showToast({ title: '已领取过', icon: 'none' });
      return;
    }

    userCoupons.push(couponId);
    wx.setStorageSync('userCoupons', userCoupons);
    this.setData({ userCoupons });

    wx.showToast({ title: '领取成功', icon: 'success' });
  }
});
