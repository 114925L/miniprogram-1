const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const type = event.type;

  // ============ cart ============

  if (type === 'getCart') {
    const res = await db.collection('cart').where({ userId: openid }).get();
    return { success: true, data: res.data };
  }

  if (type === 'updateCart') {
    // 先删后写
    await db.collection('cart').where({ userId: openid }).remove();
    const items = event.items || [];
    if (items.length > 0) {
      await db.collection('cart').add({
        data: items.map(item => ({
          userId: openid,
          ...item,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }))
      });
    }
    return { success: true };
  }

  // ============ user_coupons ============

  if (type === 'getUserCoupons') {
    const res = await db.collection('user_coupons').where({ userId: openid, status: 'unused' }).get();
    return { success: true, data: res.data };
  }

  if (type === 'receiveCoupon') {
    const coupon = event.coupon;
    const today = new Date().toDateString();
    // 检查今天是否已领取同一张券
    const exist = await db.collection('user_coupons').where({
      userId: openid,
      couponId: coupon.id,
      receivedDate: today
    }).get();
    if (exist.data.length > 0) {
      return { success: false, errMsg: 'already_received_today' };
    }
    await db.collection('user_coupons').add({
      data: {
        userId: openid,
        couponId: coupon.id,
        name: coupon.name,
        threshold: coupon.threshold,
        reduce: coupon.reduce,
        type: coupon.type,
        status: 'unused',
        receivedDate: today,
        receivedAt: db.serverDate(),
        usedAt: null
      }
    });
    return { success: true };
  }

  if (type === 'useCoupon') {
    await db.collection('user_coupons').doc(event.recordId).update({
      data: { status: 'used', usedAt: db.serverDate() }
    });
    return { success: true };
  }

  // ============ user_signin ============

  if (type === 'getSignInInfo') {
    const res = await db.collection('user_signin').where({ userId: openid }).get();
    if (res.data.length === 0) {
      return { success: true, data: { streak: 0, points: 0, lastDate: null, canSignIn: true } };
    }
    const record = res.data[0];
    const today = new Date().toDateString();
    return {
      success: true,
      data: {
        streak: record.streak || 0,
        points: record.points || 0,
        lastDate: record.lastDate || null,
        canSignIn: record.lastDate !== today
      }
    };
  }

  if (type === 'signIn') {
    const today = new Date().toDateString();
    const exist = await db.collection('user_signin').where({ userId: openid }).get();
    if (exist.data.length > 0) {
      const record = exist.data[0];
      if (record.lastDate === today) {
        return { success: false, errMsg: 'already_signed' };
      }
      await db.collection('user_signin').doc(record._id).update({
        data: {
          streak: _.inc(1),
          lastDate: today,
          points: _.inc(10),
          updatedAt: db.serverDate()
        }
      });
    } else {
      await db.collection('user_signin').add({
        data: {
          userId: openid,
          streak: 1,
          lastDate: today,
          points: 10,
          history: [today],
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      });
    }
    // 返回最新签到信息
    const res = await db.collection('user_signin').where({ userId: openid }).get();
    return { success: true, data: res.data[0] };
  }

  // ============ orders ============

  if (type === 'getOrders') {
    let query = db.collection('orders').where({ userId: openid });
    if (event.status !== null && event.status !== undefined) {
      query = query.where({ status: event.status });
    }
    const res = await query.get();
    return { success: true, data: res.data };
  }

  if (type === 'createOrder') {
    const order = event.order;
    const res = await db.collection('orders').add({ data: { userId: openid, ...order, createdAt: db.serverDate(), updatedAt: db.serverDate() } });
    return { success: true, orderId: res._id };
  }

  if (type === 'updateOrderStatus') {
    // 支持通过 orderId 或 orderNo 查找
    let orderDoc;
    if (event.orderId) {
      orderDoc = event.orderId;
    } else if (event.orderNo) {
      const res = await db.collection('orders').where({ userId: openid, orderNo: event.orderNo }).get();
      if (res.data.length === 0) return { success: false, errMsg: 'order_not_found' };
      orderDoc = res.data[0]._id;
    } else {
      return { success: false, errMsg: 'missing_orderId_or_orderNo' };
    }
    await db.collection('orders').doc(orderDoc).update({
      data: { status: event.status, updatedAt: db.serverDate() }
    });
    return { success: true };
  }

  // ============ users ============

  if (type === 'getUserInfo') {
    const res = await db.collection('users').where({ userId: openid }).get();
    if (res.data.length === 0) {
      return { success: true, data: { nickname: '奶茶爱好者', avatar: '😊', uid: '', points: 0 } };
    }
    return { success: true, data: res.data[0] };
  }

  if (type === 'initUser') {
    // 初始化用户信息（首次登录或签到时）
    const exist = await db.collection('users').where({ userId: openid }).get();
    if (exist.data.length === 0) {
      await db.collection('users').add({
        data: {
          userId: openid,
          nickname: '奶茶爱好者',
          avatar: '😊',
          uid: 'NT' + Date.now().toString().slice(-9),
          points: 0,
          createdAt: db.serverDate()
        }
      });
    }
    return { success: true };
  }

  return { success: false, errMsg: 'unknown type: ' + type };
};
