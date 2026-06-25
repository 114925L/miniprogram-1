// pages/promotion/promotion.js
const { banners, couponList: allCouponList, drinks } = require('../../constants/index');
const db = require('../../utils/db');

Page({
  data: {
    banners: banners,
    currentBanner: 0,
    couponList: allCouponList,
    userCoupons: [],
    // 新品推荐饮品
    newDrinks: [],
    // 积分兑换饮品（爆款类别作为推荐）
    hotDrinks: []
  },

  onLoad: function () {
    this._loadNewDrinks();
    this._loadHotDrinks();
  },

  onShow: function () {
    this._loadUserCoupons();
  },

  _loadNewDrinks: function () {
    var newItems = drinks.filter(function(d) { return d.category === 'new'; });
    this.setData({ newDrinks: newItems });
  },

  _loadHotDrinks: function () {
    var hotItems = drinks.filter(function(d) { return d.category === 'hot'; });
    this.setData({ hotDrinks: hotItems });
  },

  _loadUserCoupons: function () {
    var self = this;
    db.getUserCoupons().then(function(res) {
      var coupons = [];
      var receivedIds = [];
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
          receivedIds.push(item.couponId);
        });
      }
      self.setData({ userCoupons: coupons, receivedIds: receivedIds });
    }).catch(function(err) {
      console.error('加载优惠券失败:', err);
    });
  },

  onBannerChange: function (e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onBannerTap: function (e) {
    var idx = e.currentTarget.dataset.index;
    // 0=新品推荐 -> 饮品页全部分类, 1=满减活动-> 活动页不跳转, 2=积分兑换 -> 饮品页全部分类
    if (idx === 0) {
      wx.switchTab({ url: '/pages/index/index' });
    } else if (idx === 2) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  onReceiveCoupon: function (e) {
    var couponId = e.currentTarget.dataset.id;
    var coupon = allCouponList.find(function(c) { return c.id === couponId; });
    if (!coupon) return;

    var self = this;
    db.getUserCoupons().then(function(res) {
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

      db.receiveCoupon(coupon).then(function() {
        wx.showToast({ title: '领取成功', icon: 'success' });
        self._loadUserCoupons();
      }).catch(function(err) {
        if (err.data && err.data.errMsg && err.data.errMsg.indexOf('already_received') !== -1) {
          wx.showToast({ title: '已经领取过了', icon: 'none' });
        } else {
          console.error('领取失败:', err);
          wx.showToast({ title: '领取失败，请重试', icon: 'none' });
        }
      });
    });
  },

  // 新品推荐卡片点击 -> 跳转饮品页
  onNewDrinkTap: function (e) {
    var drinkId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?drinkId=' + drinkId });
  },

  // 积分兑换推荐卡片点击 -> 跳转饮品页
  onHotDrinkTap: function (e) {
    var drinkId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?drinkId=' + drinkId });
  },

  onNewUserTap: function () {
    wx.showToast({ title: '新人专享', icon: 'none' });
  }
});
