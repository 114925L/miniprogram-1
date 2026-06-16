// pages/order/order.js
const { couponList: allCouponList } = require('../../constants/index');

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
      var cart = wx.getStorageSync('cart') || [];
      if (cart.length === 0) {
        wx.showToast({ title: '购物车是空的', icon: 'none' });
        setTimeout(function() { wx.navigateBack(); }, 1500);
        return;
      }
      this.setData({ items: cart });
    }

    this._loadCoupons();
    this._calcTotal();
  },

  _loadCoupons: function () {
    var userCouponIds = wx.getStorageSync('userReceivedCoupons') || [];
    var available = [];
    for (var i = 0; i < allCouponList.length; i++) {
      var c = allCouponList[i];
      for (var j = 0; j < userCouponIds.length; j++) {
        if (userCouponIds[j] === c.id) {
          available.push(c);
          break;
        }
      }
    }
    this.setData({ coupons: available });
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
        var toppingTotal = parseFloat(items[i].toppingTotal) || 0;
        var itemTotal = Math.round((baseUnitPrice * qty + toppingTotal) * 100) / 100;
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
          toppingTotal: toppingTotal,
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

    var order = {
      orderNo: orderNo,
      items: this.data.items,
      totalAmount: this.data.totalAmount,
      finalAmount: this.data.finalAmount,
      couponUsed: this.data.selectedCoupon,
      status: 'pending',
      paymentMethod: this.data.paymentMethod,
      createTime: new Date().toISOString()
    };

    var orders = wx.getStorageSync('orders') || [];
    orders.unshift(order);
    wx.setStorageSync('orders', orders);

    wx.removeStorageSync('cart');

    wx.navigateTo({
      url: '/pages/order-status/order-status?orderNo=' + orderNo + '&queueCount=' + queueCount + '&estimatedMinutes=' + estimatedMinutes
    });
  },

  onShareAppMessage: function () {
    return {
      title: '奶茶商城 - 邀你一起喝奶茶',
      path: '/pages/index/index'
    };
  }
});
