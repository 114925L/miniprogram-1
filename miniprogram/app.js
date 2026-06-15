// app.js
App({
  onLaunch: function () {
    // 初始化购物车
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloudbase-d7g83ke4n84c0550a',
        traceUser: true,
      });
    }

    this.globalData = {
      userInfo: null,
      cart: wx.getStorageSync('cart') || [],
      coupons: [],
      points: 1280,
      tabBarIndex: 0
    };
  },

  // 添加购物车
  addToCart(item) {
    let cart = wx.getStorageSync('cart') || [];
    const key = `${item.id}-${item.size}-${JSON.stringify(item.toppings || [])}`;
    const existIdx = cart.findIndex(i => i.key === key);
    if (existIdx > -1) {
      cart[existIdx].quantity += item.quantity;
    } else {
      cart.push({ ...item, key });
    }
    wx.setStorageSync('cart', cart);
    this.globalData.cart = cart;
  },

  // 更新购物车
  updateCart(key, quantity) {
    let cart = wx.getStorageSync('cart') || [];
    const idx = cart.findIndex(i => i.key === key);
    if (idx > -1) {
      if (quantity <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].quantity = quantity;
      }
    }
    wx.setStorageSync('cart', cart);
    this.globalData.cart = cart;
  },

  // 清空购物车
  clearCart() {
    wx.setStorageSync('cart', []);
    this.globalData.cart = [];
  },

  // 获取购物车总数
  getCartCount() {
    const cart = wx.getStorageSync('cart') || [];
    return cart.reduce((sum, i) => sum + i.quantity, 0);
  }
});
