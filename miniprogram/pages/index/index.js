// pages/index/index.js
const { categories, drinks } = require('../../constants/index');

Page({
  data: {
    categories: categories,
    activeCategory: 'all',
    drinksList: drinks,
    drinkGroups: {},
    searchKeyword: '',
    showSearch: false
  },

  onLoad: function () {
    this.groupDrinksByCategory();
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
