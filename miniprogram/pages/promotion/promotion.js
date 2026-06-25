// pages/promotion/promotion.js
const { banners, couponList: allCouponList } = require('../../constants/index');
const db = require('../../utils/db');

Page({
  data: {
    banners: banners,
    currentBanner: 0,
    couponList: allCouponList,
    secretKillItems: [],
    countdown: { hours: '00', minutes: '00', seconds: '00' },
    userCoupons: []
  },

  onLoad: function () {
    this._startCountdown();
  },

  onShow: function () {
    this._loadUserCoupons();
  },

  _loadUserCoupons: function () {
    var self = this;
    db.getUserCoupons().then(res => {
      var coupons = [];
      if (res.data && res.data.length > 0) {
        res.data.forEach(function(item) {
          coupons.push({
            id: item.couponId,
            name: item.name,
            threshold: item.threshold,
            reduce: item.reduce,
            type: item.type,
            status: item.status,
            _id: item._id
          });
        });
      }
      self.setData({ userCoupons: coupons });
    }).catch(err => {
      console.error('加载优惠券失败:', err);
    });
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
    var coupon = allCouponList.find(function(c) { return c.id === couponId; });
    if (!coupon) return;

    // 检查是否已领取（云数据库）
    var self = this;
    db.getUserCoupons().then(res => {
      var exists = false;
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].couponId === couponId) { exists = true; break; }
        }
      }
      if (exists) {
        wx.showToast({ title: '已经领取过了', icon: 'none' });
        return;
      }

      // 领取到云数据库
      db.receiveCoupon(coupon).then(() => {
        wx.showToast({ title: '领取成功', icon: 'success' });
        self._loadUserCoupons();
      }).catch(err => {
        if (err.data && err.data.errMsg && err.data.errMsg.indexOf('already_received') !== -1) {
          wx.showToast({ title: '已经领取过了', icon: 'none' });
        } else {
          console.error('领取失败:', err);
          wx.showToast({ title: '领取失败，请重试', icon: 'none' });
        }
      });
    });
  }
});
