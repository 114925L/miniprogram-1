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
    showStatus: false,
    orderNo: '',
    queueCount: 0,
    estimatedMinutes: 0
  },

  onLoad: function () {
    const itemStr = wx.getStorageSync('orderItem');
    if (itemStr) {
      const item = JSON.parse(itemStr);
      wx.removeStorageSync('orderItem');
      this.setData({ items: [item] });
    } else {
      const cart = wx.getStorageSync('cart') || [];
      if (cart.length === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      this.setData({ items: cart });
    }

    // 加载已领取的优惠券并筛选可用
    this._loadCoupons();
    this._calcTotal();
  },

  // 加载优惠券
  _loadCoupons: function () {
    const userCouponIds = wx.getStorageSync('userCoupons') || [];
    // 只保留已领取的
    const available = allCouponList.filter(c => userCouponIds.includes(c.id));
    this.setData({ coupons: available });
  },

  _calcTotal: function () {
    const total = this.data.items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    const coupon = this.data.selectedCoupon;
    let discount = 0;
    if (coupon && total >= coupon.threshold) {
      discount = coupon.reduce;
    }
    this.setData({
      totalAmount: total,
      finalAmount: Math.max(total - discount, 0)
    });
  },

  // 展开/收起优惠券列表
  toggleCoupon: function () {
    this.setData({ showCoupon: !this.data.showCoupon });
  },

  // 选择优惠券
  onCouponTap: function (e) {
    const id = e.currentTarget.dataset.id;
    const coupon = this.data.coupons.find(c => c.id === id);
    this.setData({
      couponId: id,
      selectedCoupon: coupon,
      showCoupon: false
    });
    this._calcTotal();
  },

  // 选择支付方式
  onPaymentTap: function (e) {
    this.setData({ paymentMethod: e.currentTarget.dataset.method });
  },

  // 提交订单
  submitOrder: function () {
    if (this.data.items.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }

    // 生成订单号
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const orderNo = `NT${y}${m}${d}${h}${min}${s}${rand}`;

    // 排队模拟
    const queueCount = Math.floor(Math.random() * 8) + 1;
    const estimatedMinutes = queueCount * 10 + Math.floor(Math.random() * 10);

    // 保存订单
    const order = {
      orderNo: orderNo,
      items: this.data.items,
      totalAmount: this.data.totalAmount,
      finalAmount: this.data.finalAmount,
      couponUsed: this.data.selectedCoupon,
      status: 'pending',
      paymentMethod: this.data.paymentMethod,
      createTime: new Date().toISOString()
    };

    let orders = wx.getStorageSync('orders') || [];
    orders.unshift(order);
    wx.setStorageSync('orders', orders);

    // 清空购物车
    wx.removeStorageSync('cart');

    // 跳转到订单状态页
    wx.navigateTo({
      url: `/pages/order-status/order-status?orderNo=${orderNo}&queueCount=${queueCount}&estimatedMinutes=${estimatedMinutes}`
    });
  },

  onShareAppMessage: function () {
    return {
      title: '奶茶小铺 - 在线点单',
      path: '/pages/index/index'
    };
  }
});
