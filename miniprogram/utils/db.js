// miniprogram/utils/db.js
const cloud = wx.cloud;

/**
 * 云数据库工具模块
 * 通过 cloud-business 云函数操作 5 个业务集合
 * 集合: cart, user_coupons, user_signin, orders, users
 */

function _call(type, data) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: Object.assign({ type: type }, data || {})
  }).then(function(res) {
    return res.result;
  });
}

// ============ cart ============

function getCart() {
  return _call('getCart');
}

function updateCart(items) {
  return _call('updateCart', { items: items });
}

// ============ user_coupons ============

function getUserCoupons() {
  return _call('getUserCoupons');
}

function receiveCoupon(coupon) {
  return _call('receiveCoupon', { coupon: coupon });
}

function useCoupon(recordId) {
  return _call('useCoupon', { recordId: recordId });
}

// ============ user_signin ============

function getSignInInfo() {
  return _call('getSignInInfo');
}

function signIn() {
  return _call('signIn');
}

// ============ orders ============

function getOrders(status) {
  return _call('getOrders', { status: status });
}

function createOrder(orderData) {
  return _call('createOrder', { order: orderData });
}

function updateOrderStatus(orderIdOrNo, status) {
  return _call('updateOrderStatus', {
    orderId: orderIdOrNo,
    orderNo: orderIdOrNo,
    status: status
  });
}

// ============ users ============

function getUserInfo() {
  return _call('getUserInfo');
}

module.exports = {
  getCart,
  updateCart,
  getUserCoupons,
  receiveCoupon,
  useCoupon,
  getSignInInfo,
  signIn,
  getOrders,
  createOrder,
  updateOrderStatus,
  getUserInfo
};
