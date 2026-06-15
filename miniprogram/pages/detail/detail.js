// pages/detail/detail.js
const { drinks, toppings, sizes, defaultSweetness, defaultTemperature, defaultSize, defaultSizeExtraPrice, sweetnessOptions, temperatureOptions } = require('../../constants/index');

Page({
  data: {
    drink: null,
    sweetnessOptions: sweetnessOptions,
    temperatureOptions: temperatureOptions,
    sizes: sizes,
    toppings: toppings,
    selectedSweetness: defaultSweetness,
    selectedTemperature: defaultTemperature,
    selectedSize: defaultSize,
    selectedSizeExtraPrice: defaultSizeExtraPrice,
    selectedToppings: [],
    quantity: 1,
    basePrice: 0,
    totalPrice: 0,
    canAddToCart: false,
    showCartAnim: false
  },

  onLoad: function (options) {
    const drinkId = options.drinkId;
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) {
      wx.showToast({ title: '饮品不存在', icon: 'none' });
      wx.navigateBack();
      return;
    }

    this.setData({
      drink: drink,
      basePrice: drink.price,
      totalPrice: (drink.price + defaultSizeExtraPrice) * 1
    });
  },

  // 甜度选择
  onSweetnessTap: function (e) {
    this.setData({ selectedSweetness: e.currentTarget.dataset.value });
  },

  // 温度选择
  onTemperatureTap: function (e) {
    this.setData({ selectedTemperature: e.currentTarget.dataset.value });
  },

  // 容量选择
  onSizeTap: function (e) {
    const { index } = e.currentTarget.dataset;
    const size = this.data.sizes[index];
    this.setData({
      selectedSize: size.name,
      selectedSizeExtraPrice: size.extraPrice,
      totalPrice: this._calcTotalPrice(this.data.selectedToppings, size.extraPrice)
    });
  },

  // 加料选择
  onToppingTap: function (e) {
    const name = e.currentTarget.dataset.name;
    const selectedToppings = [...this.data.selectedToppings];
    const idx = selectedToppings.indexOf(name);
    if (idx > -1) {
      selectedToppings.splice(idx, 1);
    } else {
      selectedToppings.push(name);
    }
    this.setData({
      selectedToppings: selectedToppings,
      totalPrice: this._calcTotalPrice(selectedToppings, this.data.selectedSizeExtraPrice)
    });
  },

  // 数量增减
  onQuantityChange: function (e) {
    const delta = parseInt(e.currentTarget.dataset.delta);
    let qty = this.data.quantity + delta;
    if (qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    this.setData({
      quantity: qty,
      totalPrice: this._calcTotalPrice(this.data.selectedToppings, this.data.selectedSizeExtraPrice)
    });
  },

  _calcTotalPrice: function (selectedToppings, sizeExtra) {
    const drink = this.data.drink;
    let total = drink.price + sizeExtra;
    selectedToppings.forEach(t => {
      const topping = toppings.find(tp => tp.name === t);
      if (topping) total += topping.price;
    });
    return total * this.data.quantity;
  },

  // 加入购物车
  addToCart: function () {
    if (!this._checkSpecs()) return;

    const drink = this.data.drink;
    const app = getApp();

    const item = {
      id: drink.id,
      name: drink.name,
      image: drink.image,
      bgGradient: drink.bgGradient,
      sweetness: this.data.selectedSweetness,
      temperature: this.data.selectedTemperature,
      size: this.data.selectedSize,
      sizeExtraPrice: this.data.selectedSizeExtraPrice,
      toppings: this.data.selectedToppings,
      quantity: this.data.quantity,
      unitPrice: Math.round(this.data.totalPrice / this.data.quantity),
      totalPrice: Math.round(this.data.totalPrice)
    };

    app.addToCart(item);
    this._showCartAnim();

    wx.showToast({ title: '已加入', icon: 'success', duration: 1500 });

    // 3 秒后可从购物车跳转
    setTimeout(() => {
      wx.showToast({
        title: '点击右下角购物车查看',
        icon: 'none',
        duration: 2000
      });
    }, 1500);
  },

  // 立即购买
  buyNow: function () {
    if (!this._checkSpecs()) return;

    const drink = this.data.drink;
    const item = {
      id: drink.id,
      name: drink.name,
      image: drink.image,
      bgGradient: drink.bgGradient,
      sweetness: this.data.selectedSweetness,
      temperature: this.data.selectedTemperature,
      size: this.data.selectedSize,
      sizeExtraPrice: this.data.selectedSizeExtraPrice,
      toppings: this.data.selectedToppings,
      quantity: this.data.quantity,
      unitPrice: Math.round(this.data.totalPrice / this.data.quantity),
      totalPrice: Math.round(this.data.totalPrice)
    };

    wx.setStorageSync('orderItem', JSON.stringify(item));
    wx.navigateTo({
      url: '/pages/order/order'
    });
  },

  _checkSpecs: function () {
    const drink = this.data.drink;
    if (!drink) return true;

    if (drink.specs.sweetness && !this.data.selectedSweetness) {
      wx.showToast({ title: '请选择甜度', icon: 'none' });
      return false;
    }
    if (drink.specs.temperature && !this.data.selectedTemperature) {
      wx.showToast({ title: '请选择温度', icon: 'none' });
      return false;
    }
    return true;
  },

  _showCartAnim: function () {
    this.setData({ showCartAnim: true });
    setTimeout(() => {
      this.setData({ showCartAnim: false });
    }, 600);
  },

  onShareAppMessage: function () {
    return {
      title: this.data.drink ? this.data.drink.name : '奶茶小铺',
      path: `/pages/index/index`
    };
  }
});
