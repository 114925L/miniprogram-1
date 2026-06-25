// pages/order/order.js
const { couponList: allCouponList } = require('../../constants/index');
const db = require('../../utils/db');

Page({
  data: {
    items: [],
    totalAmount: 0,
    finalAmount: 0,
    couponId: '',
    selectedCoupon: null,
    coupons: [],
    paymentMethod: 'wechat',
    showCoupon: false,
    showStatus: false,
    orderNo: '',
    queueCount: 0,
    estimatedMinutes: 0
  },

  onLoad: function () {
    var itemStr = wx.getStorageSync('orderItem');
    if (itemStr) {
      var item = JSON.parse(itemStr);
      wx.removeStorageSync('orderItem');
      this.setData({ items: [item] });
    } else {
      var app = getApp();
      this.setData({ items: app.globalData.cart || [] });
    }

    this._loadCoupons();
    this._calcTotal();
  },

  _loadCoupons: function () {
    var self = this;
    db.getUserCoupons().then(function(res) {
      var available = [];
      var data = res.data || [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].status === 'unused') {
          available.push({
            id: data[i].couponId,
            name: data[i].name,
            threshold: data[i].threshold,
            reduce: data[i].reduce,
            type: data[i].type,
            _id: data[i]._id
          });
        }
      }
      self.setData({ coupons: available });
    }).catch(function(err) {
      console.error('加载优惠券失败:', err);
    });
  },

  _calcTotal: function () {
    var items = this.data.items;
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += (items[i].totalPrice || 0);
    }
    var coupon = this.data.selectedCoupon;
    var discount = 0;
    if (coupon && total >= coupon.threshold) {
      discount = coupon.reduce;
    }
    this.setData({
      totalAmount: total,
      finalAmount: Math.max(total - discount, 0)
    });
  },

  onQuantityChange: function (e) {
    var itemId = e.currentTarget.dataset.itemId;
    var delta = parseInt(e.currentTarget.dataset.delta) || 0;
    var items = this.data.items.slice();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        var qty = parseInt(items[i].quantity) + delta;
        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;
        var baseUnitPrice = parseFloat(items[i].unitPrice) || 0;
        var toppingPerUnit = parseFloat(items[i].toppingTotal) || 0;
        var itemTotal = Math.round((baseUnitPrice + toppingPerUnit) * qty * 100) / 100;
        items[i] = {
          id: items[i].id,
          name: items[i].name,
          image: items[i].image,
          bgGradient: items[i].bgGradient,
          sweetness: items[i].sweetness,
          temperature: items[i].temperature,
          size: items[i].size,
          sizeExtraPrice: items[i].sizeExtraPrice,
          toppings: items[i].toppings,
          toppingTotal: toppingPerUnit,
          quantity: qty,
          unitPrice: baseUnitPrice,
          totalPrice: itemTotal
        };
        break;
      }
    }
    this.setData({ items: items });
    this._calcTotal();
  },

  toggleCoupon: function () {
    this.setData({ showCoupon: !this.data.showCoupon });
  },

  onCouponTap: function (e) {
    var id = e.currentTarget.dataset.id;
    var coupons = this.data.coupons;
    var coupon = null;
    for (var i = 0; i < coupons.length; i++) {
      if (coupons[i].id === id) { coupon = coupons[i]; break; }
    }
    this.setData({
      couponId: id,
      selectedCoupon: coupon,
      showCoupon: false
    });
    this._calcTotal();
  },

  onPaymentTap: function (e) {
    this.setData({ paymentMethod: e.currentTarget.dataset.method });
  },

  submitOrder: function () {
    if (this.data.items.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }

    var self = this;
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var h = String(now.getHours()).padStart(2, '0');
    var min = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    var orderNo = 'NT' + y + m + d + h + min + s + rand;

    var queueCount = Math.floor(Math.random() * 8) + 1;
    var estimatedMinutes = queueCount * 10 + Math.floor(Math.random() * 10);

    // 构建订单数据
    var orderItems = this.data.items.map(function(item) {
      return {
        id: item.id,
        name: item.name,
        image: item.image,
        sweetness: item.sweetness,
        temperature: item.temperature,
        size: item.size,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      };
    });

    var orderData = {
      orderNo: orderNo,
      items: orderItems,
      totalAmount: this.data.totalAmount,
      finalAmount: this.data.finalAmount,
      couponUsed: this.data.selectedCoupon ? {
        id: this.data.selectedCoupon.id,
        _id: this.data.selectedCoupon._id
      } : null,
      status: 0,
      paymentMethod: this.data.paymentMethod,
      createTime: new Date().toISOString()
    };

    // 提交到云数据库
    db.createOrder(orderData).then(function(res) {
      // 如果使用了优惠券，标记为已使用
      if (orderData.couponUsed && orderData.couponUsed._id) {
        db.useCoupon(orderData.couponUsed._id).catch(function(err) {
          console.error('优惠券使用标记失败:', err);
        });
      }

      // 清空购物车
      var app = getApp();
      app.clearCart();

      wx.navigateTo({
        url: '/pages/order-status/order-status?orderNo=' + orderNo + '&queueCount=' + queueCount + '&estimatedMinutes=' + estimatedMinutes
      });
    }).catch(function(err) {
      console.error('下单失败:', err);
      wx.showToast({ title: '下单失败，请重试', icon: 'none' });
    });
  },

  onShareAppMessage: function () {
    return {
      title: '奶茶商城 - 邀你一起喝奶茶',
      path: '/pages/index/index'
    };
  }
});
