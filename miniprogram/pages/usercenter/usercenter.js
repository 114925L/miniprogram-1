// pages/usercenter/usercenter.js
const { couponList: allCouponList } = require('../../constants/index');

Page({
  data: {
    userInfo: {
      nickname: '奶茶爱好者',
      avatar: '😊',
      uid: 'NT20250612001'
    },
    points: 1280,
    couponCount: 0,
    couponList: [],
    orderCount: 12,
    favoriteCount: 8,
    signInStreak: 5,
    canSignIn: true,
    activeOrderTab: 0,
    filteredOrders: [],
    orderTabs: ['全部', '待付款', '待取货', '已完成'],
    orders: [
      {
        id: 'NT202506121030450001',
        items: ['🧋', '☕'],
        names: ['经典珍珠奶茶', '拿铁咖啡'],
        amount: 30,
        status: 0,
        statusText: '待付款',
        time: '2025-06-12 10:30'
      },
      {
        id: 'NT202506111500220003',
        items: ['🍇', '🍓'],
        names: ['多肉葡萄', '芝芝莓莓'],
        amount: 36,
        status: 1,
        statusText: '待取货',
        time: '2025-06-11 15:00'
      },
      {
        id: 'NT202506100900110002',
        items: ['🧋'],
        names: ['黑糖波波牛奶'],
        amount: 15,
        status: 2,
        statusText: '已完成',
        time: '2025-06-10 09:00'
      },
      {
        id: 'NT202506081400550004',
        items: ['☕'],
        names: ['美式咖啡'],
        amount: 14,
        status: 3,
        statusText: '已取消',
        time: '2025-06-08 14:00'
      }
    ],
    features: [
      { icon: '📍', name: '收货地址' },
      { icon: '📞', name: '联系客服' },
      { icon: '💬', name: '意见反馈' },
      { icon: 'ℹ️', name: '关于我们' }
    ]
  },

  onLoad: function () {
    this._loadCoupons();
    this._filterOrders();
  },

  onShow: function () {
    this._loadCoupons();
  },

  // 加载优惠券
  _loadCoupons: function () {
    var userCouponIds = wx.getStorageSync('userReceivedCoupons') || [];
    var list = [];
    for (var i = 0; i < allCouponList.length; i++) {
      var c = allCouponList[i];
      var isReceived = false;
      for (var j = 0; j < userCouponIds.length; j++) {
        if (userCouponIds[j] === c.id) { isReceived = true; break; }
      }
      list.push({
        id: c.id,
        name: c.name,
        threshold: c.threshold,
        reduce: c.reduce,
        type: c.type,
        isReceived: isReceived
      });
    }
    this.setData({
      couponCount: userCouponIds.length,
      couponList: list
    });
  },

  // 计算过滤后的订单
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

  // 签到
  onSignIn: function () {
    if (!this.data.canSignIn) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }

    let points = this.data.points + 10;
    let streak = this.data.signInStreak + 1;

    wx.setStorageSync('signInStreak', streak);
    wx.setStorageSync('lastSignIn', new Date().toDateString());

    this.setData({
      points: points,
      signInStreak: streak,
      canSignIn: false
    });

    wx.showToast({ title: '签到成功 +10积分', icon: 'success' });
  },

  // 订单 Tab 切换
  onOrderTabTap: function (e) {
    this.setData({ activeOrderTab: e.currentTarget.dataset.index });
    this._filterOrders();
  },

  // 功能点击
  onFeatureTap: function (e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({ title: name, icon: 'none' });
  },

  // 订单点击
  onOrderTap: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({ title: '订单 ' + orderId, icon: 'none' });
  }
});
