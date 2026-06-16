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
    var drinkId = options.drinkId;
    var drink = drinks.find(function(d) { return d.id === drinkId; });
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

  onSweetnessTap: function (e) {
    this.setData({ selectedSweetness: e.currentTarget.dataset.value });
  },

  onTemperatureTap: function (e) {
    this.setData({ selectedTemperature: e.currentTarget.dataset.value });
  },

  onSizeTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var size = this.data.sizes[index];
    var selectedToppings = this.data.selectedToppings;
    var newTotalPrice = this._calcTotalPriceWithQty(this.data.quantity, selectedToppings, size.extraPrice);
    this.setData({
      selectedSize: size.name,
      selectedSizeExtraPrice: size.extraPrice,
      totalPrice: newTotalPrice
    });
  },

  onToppingTap: function (e) {
    var name = e.currentTarget.dataset.name;
    var selectedToppings = this.data.selectedToppings.slice();
    var idx = selectedToppings.indexOf(name);
    if (idx > -1) {
      selectedToppings.splice(idx, 1);
    } else {
      selectedToppings.push(name);
    }
    var newTotalPrice = this._calcTotalPriceWithQty(this.data.quantity, selectedToppings, this.data.selectedSizeExtraPrice);
    this.setData({
      selectedToppings: selectedToppings,
      totalPrice: newTotalPrice
    });
  },

  onQuantityChange: function (e) {
    var delta = parseInt(e.currentTarget.dataset.delta);
    var qty = this.data.quantity + delta;
    if (qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    var newTotalPrice = this._calcTotalPriceWithQty(qty, this.data.selectedToppings, this.data.selectedSizeExtraPrice);
    this.setData({
      quantity: qty,
      totalPrice: newTotalPrice
    });
  },

  _calcTotalPriceWithQty: function (qty, selectedToppings, sizeExtra) {
    var drink = this.data.drink;
    var unitPrice = drink.price + sizeExtra;
    selectedToppings.forEach(function(t) {
      var topping = toppings.find(function(tp) { return tp.name === t; });
      if (topping) unitPrice += topping.price;
    });
    return Math.round(unitPrice * qty * 100) / 100;
  },

  _calcToppingTotal: function (selectedToppings) {
    var total = 0;
    selectedToppings.forEach(function(t) {
      var topping = toppings.find(function(tp) { return tp.name === t; });
      if (topping) total += topping.price;
    });
    return total;
  },

  _calcTotalPrice: function (selectedToppings, sizeExtra) {
    var drink = this.data.drink;
    var unitPrice = drink.price + sizeExtra;
    selectedToppings.forEach(function(t) {
      var topping = toppings.find(function(tp) { return tp.name === t; });
      if (topping) unitPrice += topping.price;
    });
    return Math.round(unitPrice * this.data.quantity * 100) / 100;
  },

  _calcUnitPrice: function (selectedToppings, sizeExtra) {
    var drink = this.data.drink;
    return Math.round((drink.price + sizeExtra) * 100) / 100;
  },

  addToCart: function () {
    if (!this._checkSpecs()) return;

    var drink = this.data.drink;
    var app = getApp();

    var toppingTotal = this._calcToppingTotal(this.data.selectedToppings);
    var item = {
      id: drink.id,
      name: drink.name,
      image: drink.image,
      bgGradient: drink.bgGradient,
      sweetness: this.data.selectedSweetness,
      temperature: this.data.selectedTemperature,
      size: this.data.selectedSize,
      sizeExtraPrice: this.data.selectedSizeExtraPrice,
      toppings: this.data.selectedToppings,
      toppingTotal: toppingTotal,
      quantity: this.data.quantity,
      unitPrice: this._calcUnitPrice(this.data.selectedToppings, this.data.selectedSizeExtraPrice),
      totalPrice: this._calcTotalPriceWithQty(this.data.quantity, this.data.selectedToppings, this.data.selectedSizeExtraPrice)
    };

    app.addToCart(item);
    this._showCartAnim();

    wx.showToast({ title: '加入购物车', icon: 'success', duration: 1500 });

    setTimeout(function() {
      wx.showToast({
        title: '跳转到购物车查看当前商品',
        icon: 'none',
        duration: 2000
      });
    }, 1500);
  },

  buyNow: function () {
    if (!this._checkSpecs()) return;

    var drink = this.data.drink;

    var toppingTotal = this._calcToppingTotal(this.data.selectedToppings);
    var item = {
      id: drink.id,
      name: drink.name,
      image: drink.image,
      bgGradient: drink.bgGradient,
      sweetness: this.data.selectedSweetness,
      temperature: this.data.selectedTemperature,
      size: this.data.selectedSize,
      sizeExtraPrice: this.data.selectedSizeExtraPrice,
      toppings: this.data.selectedToppings,
      toppingTotal: toppingTotal,
      quantity: this.data.quantity,
      unitPrice: this._calcUnitPrice(this.data.selectedToppings, this.data.selectedSizeExtraPrice),
      totalPrice: this._calcTotalPriceWithQty(this.data.quantity, this.data.selectedToppings, this.data.selectedSizeExtraPrice)
    };

    wx.setStorageSync('orderItem', JSON.stringify(item));
    wx.navigateTo({
      url: '/pages/order/order'
    });
  },

  _checkSpecs: function () {
    var drink = this.data.drink;
    if (!drink) return true;

    if (drink.specs.sweetness && !this.data.selectedSweetness) {
      wx.showToast({ title: '请选择糖度', icon: 'none' });
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
    setTimeout(function() {
      this.setData({ showCartAnim: false });
    }.bind(this), 600);
  },

  onShareAppMessage: function () {
    return {
      title: this.data.drink ? this.data.drink.name : '奶茶商城',
      path: '/pages/index/index'
    };
  }
});
