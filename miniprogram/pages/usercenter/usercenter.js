// pages/usercenter/usercenter.js
const { couponList: allCouponList } = require('../../constants/index');
const db = require('../../utils/db');

Page({
  data: {
    userInfo: {
      nickname: '奶茶爱好者',
      avatar: '😊',
      uid: ''
    },
    points: 0,
    couponCount: 0,
    couponList: [],
    orderCount: 0,
    favoriteCount: 0,
    signInStreak: 0,
    canSignIn: true,
    activeOrderTab: 0,
    filteredOrders: [],
    orders: [],
    orderTabs: ['全部', '待付款', '待取货', '已完成'],
    features: [
      { icon: '📍', name: '收货地址' },
      { icon: '📞', name: '联系客服' },
      { icon: '💬', name: '意见反馈' },
      { icon: 'ℹ️', name: '关于我们' }
    ]
  },

  onLoad: function () {
    this._loadAllData();
  },

  onShow: function () {
    this._loadAllData();
  },

  _loadAllData: function () {
    var self = this;
    var app = getApp();

    // 并行加载: 用户信息 + 优惠券 + 签到 + 订单
    Promise.all([
      db.getUserInfo(),
      db.getUserCoupons(),
      db.getSignInInfo(),
      db.getOrders()
    ]).then(function(results) {
      // 用户信息（getUserInfo 直接返回 data 对象）
      var userInfo = results[0].data || {};
      var points = userInfo.points || app.globalData.points || 0;
      var nickname = userInfo.nickname || '奶茶爱好者';
      var avatar = userInfo.avatar || '😊';
      var uid = userInfo.uid || '';

      // 优惠券
      var couponData = results[1].data || [];
      var couponList = [];
      for (var i = 0; i < couponData.length; i++) {
        couponList.push({
          id: couponData[i].couponId,
          name: couponData[i].name,
          threshold: couponData[i].threshold,
          reduce: couponData[i].reduce,
          type: couponData[i].type,
          status: couponData[i].status,
          _id: couponData[i]._id
        });
      }

      // 签到（getSignInInfo 直接返回 data 对象）
      var signIn = results[2].data || {};
      var streak = signIn.streak || 0;
      var canSignIn = signIn.canSignIn !== false;

      // 订单 — 转换为模板需要的格式
      var rawOrders = results[3].data || [];
      var statusMap = { 0: '待付款', 1: '待制作', 2: '制作中', 3: '已取消', 4: '已付款' };
      var orders = rawOrders.map(function(o) {
        // 提取 emoji 和名称
        var itemsArr = o.items || [];
        var emojis = itemsArr.map(function(it) { return it.image || '🧋'; });
        var names = itemsArr.map(function(it) { return it.name || ''; });
        // 格式化时间
        var timeStr = '';
        if (o.createTime) {
          var dt = new Date(o.createTime);
          timeStr = dt.getFullYear() + '-' +
            String(dt.getMonth() + 1).padStart(2, '0') + '-' +
            String(dt.getDate()).padStart(2, '0') + ' ' +
            String(dt.getHours()).padStart(2, '0') + ':' +
            String(dt.getMinutes()).padStart(2, '0');
        }
        var st = o.status !== undefined ? o.status : 0;
        return {
          id: o.orderNo || o._id,
          items: emojis,
          names: names,
          amount: o.totalAmount || 0,
          status: st,
          statusText: statusMap[st] || '待付款',
          time: timeStr
        };
      });

      self.setData({
        userInfo: { nickname: nickname, avatar: avatar, uid: uid },
        points: points,
        couponCount: couponList.length,
        couponList: couponList,
        orderCount: orders.length,
        signInStreak: streak,
        canSignIn: canSignIn,
        orders: orders
      });

      self._filterOrders();
    }).catch(function(err) {
      console.error('加载用户数据失败:', err);
      // 降级: 使用 app.globalData
      self.setData({
        points: app.globalData.points || 0,
        userInfo: app.globalData.userInfo || self.data.userInfo,
        signInStreak: app.globalData.signInStreak || 0,
        canSignIn: app.globalData.canSignIn !== false
      });
      self._loadCouponsFromCache();
      self._filterOrders();
    });
  },

  _loadCouponsFromCache: function () {
    var self = this;
    var userCouponIds = wx.getStorageSync('userReceivedCoupons') || [];
    var list = [];
    for (var i = 0; i < allCouponList.length; i++) {
      var c = allCouponList[i];
      var isReceived = false;
      for (var j = 0; j < userCouponIds.length; j++) {
        if (userCouponIds[j] === c.id) { isReceived = true; break; }
      }
      if (isReceived) {
        list.push({
          id: c.id,
          name: c.name,
          threshold: c.threshold,
          reduce: c.reduce,
          type: c.type
        });
      }
    }
    self.setData({ couponList: list, couponCount: list.length });
  },

  _filterOrders: function () {
    var tab = this.data.activeOrderTab;
    var allOrders = this.data.orders;
    var filtered = allOrders;
    if (tab > 0 && tab < 3) {
      var result = [];
      for (var i = 0; i < allOrders.length; i++) {
        if (allOrders[i].status === tab) { result.push(allOrders[i]); }
      }
      filtered = result;
    } else if (tab === 3) {
      var result2 = [];
      for (var j = 0; j < allOrders.length; j++) {
        if (allOrders[j].status === 2) { result2.push(allOrders[j]); }
      }
      filtered = result2;
    }
    this.setData({ filteredOrders: filtered });
  },

  onSignIn: function () {
    var self = this;
    if (!this.data.canSignIn) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }

    db.signIn().then(function(res) {
      var data = res.data;
      var newPoints = (self.data.points || 0) + 10;
      var newStreak = (data && data.streak) || (self.data.signInStreak + 1);

      self.setData({
        points: newPoints,
        signInStreak: newStreak,
        canSignIn: false
      });

      wx.showToast({ title: '签到成功 +10积分', icon: 'success' });
    }).catch(function(err) {
      console.error('签到失败:', err);
      wx.showToast({ title: '签到失败，请重试', icon: 'none' });
    });
  },

  onOrderTabTap: function (e) {
    this.setData({ activeOrderTab: e.currentTarget.dataset.index });
    this._filterOrders();
  },

  onFeatureTap: function (e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({ title: name, icon: 'none' });
  },

  onOrderTap: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({ title: '订单 ' + orderId, icon: 'none' });
  }
});
