// miniprogram/utils/db.js
const cloud = wx.cloud;

/**
 * 云数据库工具模块
 * 通过 cloud-business 云函数操作 5 个业务集合
 * 集合: cart, user_coupons, user_signin, orders, users
 */

// ============ cart ============

// 获取购物车
function getCart() {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'getCart' }
  });
}

// 更新购物车（全量覆盖）
function updateCart(items) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'updateCart', items: items }
  });
}

// ============ user_coupons ============

// 获取用户优惠券列表
function getUserCoupons() {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'getUserCoupons' }
  });
}

// 领取优惠券
function receiveCoupon(coupon) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'receiveCoupon', coupon: coupon }
  });
}

// 使用优惠券
function useCoupon(recordId) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'useCoupon', recordId: recordId }
  });
}

// ============ user_signin ============

// 获取签到信息
function getSignInInfo() {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'getSignInInfo' }
  });
}

// 签到
function signIn() {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'signIn' }
  });
}

// ============ orders ============

// 获取订单列表
function getOrders(status) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'getOrders', status: status }
  });
}

// 创建订单
function createOrder(orderData) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'createOrder', order: orderData }
  });
}

// 更新订单状态
function updateOrderStatus(orderIdOrNo, status) {
  return cloud.callFunction({
    name: 'cloud-business',
    data: {
      type: 'updateOrderStatus',
      orderId: orderIdOrNo,
      orderNo: orderIdOrNo,
      status: status
    }
  });
}

// ============ users ============

// 获取用户信息
function getUserInfo() {
  return cloud.callFunction({
    name: 'cloud-business',
    data: { type: 'getUserInfo' }
  });
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
