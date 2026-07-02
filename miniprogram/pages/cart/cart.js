// pages/cart/cart.js
const db = require('../../utils/db');

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
    allChecked: true,
    empty: true
  },

  onShow: function () {
    this._loadCart();
  },

  _loadCart: function () {
    var self = this;
    db.getCart().then(function(res) {
      var items = res.data || [];
      if (Object.keys(items).length > 0 && !Array.isArray(items)) items = [];
      items = items.filter(function(it) { return (it.quantity || 0) > 0; });
      self._calcTotals(items);
    }).catch(function(err) {
      console.error('加载购物车失败:', err);
      // 降级
      var app = getApp();
      var items = (app.globalData.cart || []).filter(function(it) { return (it.quantity || 0) > 0; });
      self._calcTotals(items);
    });
  },

  _calcTotals: function (items) {
    var total = 0;
    var totalQty = 0;
    var allChecked = true;
    for (var i = 0; i < items.length; i++) {
      var checked = items[i].checked !== false;
      if (!checked) allChecked = false;
      total += (items[i].totalPrice || 0);
      totalQty += (items[i].quantity || 0);
    }
    this.setData({
      cartItems: items,
      totalPrice: Math.round(total * 100) / 100,
      totalQuantity: totalQty,
      allChecked: items.length === 0 ? false : allChecked,
      empty: items.length === 0
    });
  },

  onItemCheck: function (e) {
    var key = e.currentTarget.dataset.key;
    var items = this.data.cartItems.slice();
    for (var i = 0; i < items.length; i++) {
      if (items[i].key === key) {
        items[i].checked = !items[i].checked;
        items[i].totalPrice = this._calcItemPrice(items[i]);
        break;
      }
    }
    this.setData({ cartItems: items });
    this._recalcFromData();
    // 同步到云端
    db.updateCart(items).catch(function(err) {
      console.error('同步勾选状态失败:', err);
    });
  },

  onAllCheck: function () {
    var checked = !this.data.allChecked;
    var items = this.data.cartItems.slice();
    for (var i = 0; i < items.length; i++) {
      items[i].checked = checked;
      items[i].totalPrice = this._calcItemPrice(items[i]);
    }
    this.setData({ cartItems: items, allChecked: checked });
    this._recalcFromData();
    db.updateCart(items).catch(function(err) {
      console.error('同步全选状态失败:', err);
    });
  },

  _calcItemPrice: function (item) {
    var base = parseFloat(item.unitPrice) || 0;
    var topping = parseFloat(item.toppingTotal) || 0;
    var qty = parseInt(item.quantity) || 1;
    return Math.round((base + topping) * qty * 100) / 100;
  },

  onQuantityChange: function (e) {
    var key = e.currentTarget.dataset.key;
    var delta = parseInt(e.currentTarget.dataset.delta) || 0;
    var items = this.data.cartItems.slice();
    for (var i = 0; i < items.length; i++) {
      if (items[i].key === key) {
        var qty = parseInt(items[i].quantity) + delta;
        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;
        items[i].quantity = qty;
        items[i].totalPrice = this._calcItemPrice(items[i]);
        break;
      }
    }
    this.setData({ cartItems: items });
    this._recalcFromData();
    db.updateCart(items).catch(function(err) {
      console.error('同步数量失败:', err);
    });
  },

  _recalcFromData: function () {
    var items = this.data.cartItems;
    var total = 0;
    var totalQty = 0;
    var allChecked = true;
    for (var i = 0; i < items.length; i++) {
      if (items[i].checked !== false) {
        total += items[i].totalPrice || 0;
      }
      totalQty += items[i].quantity || 0;
    }
    if (items.length > 0) {
      for (var j = 0; j < items.length; j++) {
        if (items[j].checked === false) { allChecked = false; break; }
      }
    }
    this.setData({
      totalPrice: Math.round(total * 100) / 100,
      totalQuantity: totalQty,
      allChecked: allChecked
    });
  },

  goToOrder: function () {
    // 只传递选中的商品
    var selected = this.data.cartItems.filter(function(it) { return it.checked !== false; });
    if (selected.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/order/order?cart=1' });
  },

  onDelete: function (e) {
    var key = e.currentTarget.dataset.key;
    var items = this.data.cartItems.filter(function(it) { return it.key !== key; });
    this.setData({ cartItems: items });
    this._recalcFromData();
    // 同步到云端
    db.updateCart(items).catch(function(err) {
      console.error('删除失败:', err);
    });
  },

  onCartTap: function (e) {
    var drinkId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?drinkId=' + drinkId });
  }
});
