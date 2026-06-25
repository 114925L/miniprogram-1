// pages/index/index.js
const { categories, drinks } = require('../../constants/index');

Page({
  data: {
    categories: categories,
    activeCategory: 'all',
    drinksList: drinks,
    drinkGroups: {},
    searchKeyword: '',
    showSearch: false,
    cartCount: 0
  },

  onLoad: function () {
    this.groupDrinksByCategory();
    this._updateCartCount();
  },

  onShow: function () {
    this._updateCartCount();
  },

  _updateCartCount: function () {
    var self = this;
    var app = getApp();
    // 先读本地缓存
    var cart = app.globalData.cart || [];
    var count = 0;
    for (var i = 0; i < cart.length; i++) { count += cart[i].quantity || 0; }
    self.setData({ cartCount: count });

    // 同时从云端拉取
    var db = require('../../utils/db');
    db.getCart().then(function(res) {
      var items = res.data || [];
      var c = 0;
      for (var j = 0; j < items.length; j++) { c += items[j].quantity || 0; }
      self.setData({ cartCount: c });
    });
  },

  groupDrinksByCategory: function () {
    const groups = {};
    const cats = this.data.categories;

    groups['all'] = { category: { id: 'all', name: '全部', icon: '🧋' }, drinks: drinks };

    cats.forEach(cat => {
      const items = drinks.filter(d => d.category === cat.id);
      if (items.length > 0) {
        groups[cat.id] = { category: cat, drinks: items };
      }
    });

    this.setData({ drinkGroups: groups });
  },

  onCategoryTap: function (e) {
    const { catId } = e.currentTarget.dataset;
    this.setData({ activeCategory: catId });
  },

  onSearchInput: function (e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ searchKeyword: keyword });

    if (!keyword) {
      this.setData({ activeCategory: 'all' });
      this.groupDrinksByCategory();
      return;
    }

    const filtered = drinks.filter(d =>
      d.name.toLowerCase().includes(keyword) ||
      d.description.toLowerCase().includes(keyword)
    );
    this.setData({
      activeCategory: '_search',
      drinkGroups: {
        _search: { category: { id: '_search', name: '搜索结果' }, drinks: filtered }
      }
    });
  },

  onSearchClear: function () {
    this.setData({ searchKeyword: '', activeCategory: 'all' });
    this.groupDrinksByCategory();
  },

  goDetail: function (e) {
    const { drinkId } = e.currentTarget.dataset;
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) return;
    wx.navigateTo({
      url: `/pages/detail/detail?drinkId=${drinkId}`
    });
  },

  onShareAppMessage: function () {
    return {
      title: '奶茶小铺 - 好喝不贵',
      path: '/pages/index/index'
    };
  }
});
