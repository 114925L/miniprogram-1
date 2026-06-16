// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请升级到2.2.3以上基础库');
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

  // 添加商品到购物车
  addToCart: function (item) {
    var cart = wx.getStorageSync('cart') || [];
    var key = item.key || (item.id + '_' + item.size + '_' + item.sweetness + '_' + item.temperature);
    var existIdx = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].key === key) { existIdx = i; break; }
    }
    if (existIdx > -1) {
      cart[existIdx].quantity += item.quantity;
    } else {
      cart.push({ key: key });
      cart[cart.length - 1].id = item.id;
      cart[cart.length - 1].name = item.name;
      cart[cart.length - 1].image = item.image;
      cart[cart.length - 1].bgGradient = item.bgGradient;
      cart[cart.length - 1].sweetness = item.sweetness;
      cart[cart.length - 1].temperature = item.temperature;
      cart[cart.length - 1].size = item.size;
      cart[cart.length - 1].sizeExtraPrice = item.sizeExtraPrice;
      cart[cart.length - 1].toppings = item.toppings;
      cart[cart.length - 1].toppingTotal = item.toppingTotal;
      cart[cart.length - 1].quantity = item.quantity;
      cart[cart.length - 1].unitPrice = item.unitPrice;
      cart[cart.length - 1].totalPrice = item.totalPrice;
    }
    wx.setStorageSync('cart', cart);
    this.globalData.cart = cart;
  },

  updateCart: function (key, quantity) {
    var cart = wx.getStorageSync('cart') || [];
    var idx = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].key === key) { idx = i; break; }
    }
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

  clearCart: function () {
    wx.setStorageSync('cart', []);
    this.globalData.cart = [];
  },

  getCartCount: function () {
    var cart = wx.getStorageSync('cart') || [];
    var sum = 0;
    for (var i = 0; i < cart.length; i++) { sum += cart[i].quantity; }
    return sum;
  }
});
