// app.js
const db = require('./utils/db');

App({
  globalData: {
    userInfo: null,
    openid: '',
    cart: [],
    points: 0,
    signInStreak: 0,
    canSignIn: true,
    tabBarIndex: 0
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请升级到2.2.3以上基础库');
      return;
    }

    wx.cloud.init({
      env: 'cloudbase-d7g83ke4n84c0550a',
      traceUser: true,
    });

    // 1. 获取 openid（通过云函数）
    wx.cloud.callFunction({
      name: 'cloud-business',
      data: { type: 'getUserInfo' }
    }).then(res => {
      // openid 由云函数内部获取，客户端拿不到
      // 后续所有云函数自动携带 openid，无需客户端传递
      this.globalData.openid = '';

      // 2. 并行加载用户信息 + 购物车 + 签到
      return Promise.all([
        this._loadUserInfo(),
        this._loadCart(),
        this._loadSignIn()
      ]);
    }).then(() => {
      console.log('云数据加载完成');
    }).catch(err => {
      console.error('初始化失败:', err);
    });
  },

  // ============ 云数据加载 ============

  _loadUserInfo: function () {
    var self = this;
    return db.getUserInfo().then(res => {
      var u = res.data || {};
      self.globalData.points = u.points || 0;
      self.globalData.userInfo = {
        nickname: u.nickname || '奶茶爱好者',
        avatar: u.avatar || '😊',
        uid: u.uid || ''
      };
    });
  },

  _loadCart: function () {
    var self = this;
    return db.getCart().then(res => {
      self.globalData.cart = (res.data && res.data.items) || [];
    });
  },

  _loadSignIn: function () {
    var self = this;
    return db.getSignInInfo().then(res => {
      var info = res.data || {};
      self.globalData.signInStreak = info.streak || 0;
      self.globalData.canSignIn = info.canSignIn !== false;
    });
  },

  // ============ 购物车（云数据库版本） ============

  addToCart: function (item) {
    var cart = this.globalData.cart.slice();
    var key = item.key || (item.id + '_' + item.size + '_' + item.sweetness + '_' + item.temperature);
    var existIdx = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].key === key) { existIdx = i; break; }
    }
    if (existIdx > -1) {
      cart[existIdx].quantity += item.quantity;
      cart[existIdx].checked = true;
    } else {
      cart.push({ key: key });
      var c = cart[cart.length - 1];
      c.id = item.id;
      c.name = item.name;
      c.image = item.image;
      c.bgGradient = item.bgGradient;
      c.sweetness = item.sweetness;
      c.temperature = item.temperature;
      c.size = item.size;
      c.sizeExtraPrice = item.sizeExtraPrice;
      c.toppings = item.toppings;
      c.toppingTotal = item.toppingTotal;
      c.quantity = item.quantity;
      c.unitPrice = item.unitPrice;
      c.totalPrice = item.totalPrice;
      c.checked = true;
    }
    this.globalData.cart = cart;
    // 同步到云数据库
    return db.updateCart(cart);
  },

  updateCart: function (key, quantity) {
    var cart = this.globalData.cart.slice();
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
    this.globalData.cart = cart;
    return db.updateCart(cart);
  },

  clearCart: function () {
    this.globalData.cart = [];
    return db.updateCart([]);
  },

  getCartCount: function () {
    var cart = this.globalData.cart;
    var sum = 0;
    for (var i = 0; i < cart.length; i++) { sum += cart[i].quantity; }
    return sum;
  }
});
