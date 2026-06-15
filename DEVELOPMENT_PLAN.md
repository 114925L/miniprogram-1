# 线上点奶茶小程序 - 开发文档

## 一、项目概述

### 1.1 项目名称
奶茶小程序（MilkTea）

### 1.2 项目定位
一款微信小程序，提供线上点奶茶服务。用户可浏览饮品分类、查看商品详情、自定义口味/温度/容量/数量并下单。

### 1.3 技术栈
- **框架**: 微信小程序原生开发
- **云开发**: 微信云开发（数据库 + 云函数 + 文件存储）
- **样式**: WXSS + Rpx 响应式布局
- **状态管理**: 全局 App 实例 + 本地 Storage

---

## 二、页面架构设计

```
App
├── TabBar: 饮品 (首页)
│   └── pages/index/index
│       ├── 顶部搜索栏
│       ├── 左侧分类导航 (新品/热门/咖啡/茶饮/果茶/甜品)
│       ├── 右侧商品列表 (瀑布流网格)
│       └── 底部悬浮购物车按钮
│
├── TabBar: 活动页
│   └── pages/promotion/promotion
│       ├── 轮播 Banner
│       ├── 优惠券列表
│       ├── 限时秒杀
│       └── 满减活动
│
├── 饮品详情页 (非 TabBar 页面)
│   └── pages/detail/detail
│       ├── 饮品大图
│       ├── 名称 & 价格
│       ├── 主要成分说明
│       ├── 口味选择 (甜度: 无糖/三分/半糖/全糖)
│       ├── 温度选择 (冰/去冰/温热/热)
│       ├── 容量选择 (中杯/大杯/超大杯)
│       ├── 数量选择 (+/-)
│       └── 加入购物车 / 立即购买按钮
│
├── TabBar: 用户中心
│   └── pages/usercenter/usercenter
│       ├── 用户头像 & 昵称
│       ├── 积分 & 优惠券
│       ├── 我的订单
│       ├── 收货地址
│       └── 设置 & 客服
│
└── 订单确认页 (非 TabBar 页面)
    └── pages/order/order
        ├── 商品信息摘要
        ├── 规格汇总
        ├── 价格明细
        ├── 支付方式选择
        └── 提交订单按钮
```

---

## 三、页面详细设计

### 3.1 首页 - 饮品列表 (`pages/index/index`)

#### 布局结构
- **顶部**: 搜索栏 + 定位图标
- **主体**: 左右分栏
  - **左侧** (25% 宽度): 固定滚动分类列表
    - 分类项: 图标 + 文字标签
    - 选中态高亮 (橙色背景 + 文字)
    - 分类: 全部、新品、热门、咖啡、茶饮、果茶、酸奶、甜品
  - **右侧** (75% 宽度): 商品网格列表
    - 双列瀑布流布局
    - 每个商品卡片: 图片 + 名称 + 价格 + 月售数量
    - 点击卡片 → 跳转详情页

#### 交互
- 左侧分类点击 → 右侧滚动到对应分组锚点
- 右侧滚动 → 自动高亮当前分类
- 长按购物车按钮 → 弹出购物车弹窗

### 3.2 饮品详情页 (`pages/detail/detail`)

#### 布局结构 (从上到下)
1. **商品大图区**: 全屏宽度图片，左上方返回按钮
2. **基本信息区**:
   - 价格 (大号橙色字体)
   - 饮品名称 + 简介
   - 月售数量 & 收藏数
3. **成分说明区**: 标签形式展示主要成分 (如: 牛奶、红茶、珍珠、椰果...)
4. **规格选择区** (可折叠):
   - **甜度**: 无糖 / 三分糖 / 半糖 / 全糖 (单选，默认半糖)
   - **温度**: 去冰 / 冰 / 温热 / 热 (单选，默认去冰)
   - **容量**: 中杯 ¥12 / 大杯 ¥15 / 超大杯 ¥18 (单选，默认大杯)
   - **加料**: 珍珠 +¥2 / 椰果 +¥2 / 布丁 +¥3 / 芋圆 +¥2 (多选)
5. **数量选择区**: - 1 +
6. **底部操作栏** (固定):
   - 加入购物车 (左侧按钮)
   - 立即购买 (右侧橙色按钮)

#### 交互
- 规格未选完时点击按钮 → Toast 提示 "请选择完整规格"
- 加入购物车 → 角标数字 +1，抖动动画
- 返回 → 保留已选规格状态

### 3.3 活动页 (`pages/promotion/promotion`)

#### 布局结构
1. **轮播 Banner**: 3-4 张活动图，自动轮播 (5s 间隔)
2. **限时秒杀区**:
   - 倒计时 (时:分:秒)
   - 秒杀商品横向滚动列表
   - 秒杀价 + 原价对比
3. **优惠券区**:
   - 满减券卡片 (满 20 减 5、满 30 减 8...)
   - 领取按钮
4. **积分商城入口**: 横幅广告
5. **新人专享区**: 首单立减 5 元提示

#### 交互
- Banner 点击 → 跳转对应活动页
- 优惠券领取 → 按钮变灰 + Toast "领取成功"
- 秒杀倒计时 → 实时刷新

### 3.4 用户中心 (`pages/usercenter/usercenter`)

#### 布局结构
1. **头部**: 渐变背景
   - 头像 (圆形)
   - 昵称 & UID
   - 签到按钮
2. **数据概览** (一行四列):
   - 积分: 1280
   - 优惠券: 5 张
   - 订单: 12 笔
   - 收藏: 8 款
3. **我的订单**:
   - 待付款 / 待取货 / 已完成 / 已取消 (Tab 切换)
   - 订单卡片: 商品缩略图 + 名称 + 金额 + 状态
4. **常用功能** (网格布局):
   - 收货地址
   - 联系客服
   - 意见反馈
   - 关于我们
5. **退出登录** (底部按钮)

#### 交互
- 点击订单 Tab → 切换筛选
- 点击收货地址 → 跳转地址管理页
- 签到 → 积分 +10，按钮变灰

---

## 四、数据模型设计

### 4.1 饮品分类集合 (`categories`)

```json
{
  "_id": "cat_001",
  "name": "新品",
  "icon": "/images/icons/new.png",
  "sort": 1,
  "isActive": true
}
```

### 4.2 饮品类集合 (`drinks`)

```json
{
  "_id": "drink_001",
  "name": "多肉葡萄",
  "category": "果茶",
  "price": 16,
  "image": "cloud://xxx/grape.png",
  "description": "新鲜葡萄果肉 + 绿茶底",
  "ingredients": ["葡萄", "绿茶", "椰果", "薄荷"],
  "sales": 1250,
  "favorites": 380,
  "isHot": true,
  "isNew": true,
  "specs": {
    "sweetness": ["无糖", "三分糖", "半糖", "全糖"],
    "temperature": ["去冰", "冰", "温热", "热"],
    "size": [
      { "name": "中杯", "extraPrice": 0 },
      { "name": "大杯", "extraPrice": 3 },
      { "name": "超大杯", "extraPrice": 5 }
    ]
  },
  "toppings": [
    { "name": "珍珠", "price": 2 },
    { "name": "椰果", "price": 2 },
    { "name": "布丁", "price": 3 },
    { "name": "芋圆", "price": 2 }
  ],
  "createTime": "2025-01-15T08:00:00Z"
}
```

### 4.3 订单集合 (`orders`)

```json
{
  "_id": "order_001",
  "userId": "user_xxx",
  "items": [
    {
      "drinkId": "drink_001",
      "name": "多肉葡萄",
      "image": "...",
      "sweetness": "半糖",
      "temperature": "去冰",
      "size": "大杯",
      "toppings": ["珍珠", "椰果"],
      "quantity": 2,
      "unitPrice": 18,
      "totalPrice": 36
    }
  ],
  "totalAmount": 36,
  "status": "pending",
  "paymentMethod": "wechat",
  "createTime": "2025-06-12T10:30:00Z",
  "pickupTime": "2025-06-12T11:00:00Z"
}
```

### 4.4 用户集合 (`users`)

```json
{
  "_id": "user_xxx",
  "nickname": "小明",
  "avatar": "cloud://xxx/avatar.png",
  "points": 1280,
  "coupons": [...],
  "signInStreak": 5,
  "lastSignIn": "2025-06-12"
}
```

### 4.5 优惠券集合 (`coupons`)

```json
{
  "_id": "coupon_001",
  "name": "满 20 减 5",
  "type": "discount",
  "threshold": 20,
  "reduce": 5,
  "isActive": true,
  "expireTime": "2025-12-31T23:59:59Z"
}
```

---

## 五、颜色与样式规范

### 5.1 主色调
| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 (品牌橙) | `#FF6B35` | 按钮、价格、选中态 |
| 辅助色 (暖黄) | `#FFB347` | 渐变、装饰 |
| 背景色 | `#F5F5F5` | 页面背景 |
| 卡片白 | `#FFFFFF` | 卡片背景 |
| 文字主 | `#333333` | 标题、正文 |
| 文字次 | `#999999` | 描述、次要信息 |
| 边框 | `#EEEEEE` | 分隔线 |
| 成功绿 | `#52C41A` | 完成状态 |

### 5.2 字号规范
| 元素 | 字号 | 字重 |
|------|------|------|
| 页面标题 | 36rpx | bold |
| 饮品名称 | 28rpx | regular |
| 价格 | 34rpx | bold |
| 正文 | 26rpx | regular |
| 辅助文字 | 24rpx | light |
| 小字标注 | 22rpx | light |

### 5.3 圆角规范
- 卡片: `16rpx`
- 按钮: `40rpx` (胶囊形)
- 标签: `8rpx`
- 头像: `50%` (圆形)

---

## 六、全局状态管理

```javascript
// app.js
App({
  globalData: {
    userInfo: null,       // 当前用户信息
    cart: [],             // 购物车 [{drinkId, specs, quantity}]
    coupons: [],          // 可用优惠券
    points: 0,            // 积分
    tabBarIndex: 0       // 当前 TabBar 索引
  },

  // 添加购物车
  addToCart(drink, specs, quantity) { ... },

  // 清空购物车
  clearCart() { ... },

  // 获取购物车总数
  getCartCount() { ... }
})
```

---

## 七、页面跳转关系

```
首页 (饮品) ──点击商品──→ 详情页
    │                           │
    │                    点击"加入购物车"
    │                           │
    │                    返回首页角标 +1
    │
    └─点击底部"活动页"──→ 活动页

活动页 ──点击底部"用户中心"──→ 用户中心

用户中心 ──点击订单──→ 订单列表 (用户中心内)

详情页 ──点击"立即购买"──→ 订单确认页 ──提交──→ 支付成功
```

---

## 八、文件目录结构

```
miniprogram/
├── app.js                          # 入口文件
├── app.json                        # 全局配置 (TabBar 等)
├── app.wxss                        # 全局样式
├── sitemap.json
├── images/                         # 静态资源
│   ├── icons/                      # TabBar 图标
│   ├── drinks/                     # 饮品图片
│   └── banners/                    # 活动 Banner
├── pages/
│   ├── index/                      # 首页 - 饮品列表
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── detail/                     # 饮品详情页
│   │   ├── detail.js
│   │   ├── detail.json
│   │   ├── detail.wxml
│   │   └── detail.wxss
│   ├── promotion/                  # 活动页
│   │   ├── promotion.js
│   │   ├── promotion.json
│   │   ├── promotion.wxml
│   │   └── promotion.wxss
│   └── usercenter/                 # 用户中心
│       ├── usercenter.js
│       ├── usercenter.json
│       ├── usercenter.wxml
│       └── usercenter.wxss
├── order/                          # 订单确认页
│   ├── order.js
│   ├── order.json
│   ├── order.wxml
│   └── order.wxss
├── components/
│   ├── drink-card/                 # 商品卡片组件
│   │   ├── drink-card.js
│   │   ├── drink-card.json
│   │   ├── drink-card.wxml
│   │   └── drink-card.wxss
│   ├── spec-selector/              # 规格选择器组件
│   │   ├── spec-selector.js
│   │   ├── spec-selector.json
│   │   ├── spec-selector.wxml
│   │   └── spec-selector.wxss
│   └── cart-badge/                 # 购物车角标组件
│       ├── cart-badge.js
│       ├── cart-badge.json
│       ├── cart-badge.wxml
│       └── cart-badge.wxss
├── utils/
│   └── db.js                       # 云数据库封装
└── constants/
    └── index.js                    # 常量 (价格、规格选项等)
```

---

## 九、开发实施步骤

### Phase 1: 基础架构 (第 1 步)
- [x] 配置 `app.json` (页面路由、TabBar、窗口样式)
- [x] 创建全局样式 `app.wxss` (颜色变量、通用布局)
- [x] 创建常量文件 `constants/index.js`
- [x] 创建页面目录结构

### Phase 2: 首页开发 (第 2 步)
- [ ] 实现左侧分类导航
- [ ] 实现右侧商品网格列表
- [ ] 实现分类联动滚动
- [ ] 实现商品卡片组件

### Phase 3: 详情页开发 (第 3 步)
- [ ] 实现商品大图与信息展示
- [ ] 实现成分标签展示
- [ ] 实现规格选择器 (甜度/温度/容量/加料)
- [ ] 实现数量选择器
- [ ] 实现加入购物车逻辑

### Phase 4: 活动页开发 (第 4 步)
- [ ] 实现轮播 Banner
- [ ] 实现限时秒杀模块
- [ ] 实现优惠券领取

### Phase 5: 用户中心开发 (第 5 步)
- [ ] 实现用户信息头部
- [ ] 实现数据统计面板
- [ ] 实现订单列表
- [ ] 实现常用功能区

### Phase 6: 订单流程 (第 6 步)
- [ ] 实现订单确认页
- [ ] 实现价格计算
- [ ] 实现提交订单

### Phase 7: 完善与优化 (第 7 步)
- [ ] 搜索功能
- [ ] 购物车弹窗
- [ ] 动画效果优化
- [ ] 空状态处理

---

## 十、关键交互伪代码

### 分类联动
```javascript
// pages/index/index.js
onCategoryTap(e) {
  const { categoryId } = e.currentTarget.dataset
  this.setData({ activeCategory: categoryId })
  // 滚动右侧到对应锚点
  wx.pageScrollTo({ scrollTop: 0, duration: 300 })
}
```

### 加入购物车
```javascript
// pages/detail/detail.js
addToCart() {
  // 校验必填规格
  if (!this.selectedSpecs.sweetness || !this.selectedSpecs.temperature) {
    wx.showToast({ title: '请选择完整规格', icon: 'none' })
    return
  }

  const cart = getApp().globalData.cart
  const item = {
    drinkId: this.data.drink._id,
    name: this.data.drink.name,
    image: this.data.drink.image,
    ...this.selectedSpecs,
    quantity: this.data.quantity,
    totalPrice: this.calculatePrice()
  }

  // 合并或新增
  const existIdx = cart.findIndex(i => i.drinkId === item.drinkId && JSON.stringify(i) === JSON.stringify(item))
  if (existIdx > -1) {
    cart[existIdx].quantity += item.quantity
  } else {
    cart.push(item)
  }

  wx.setStorageSync('cart', cart)
  wx.showToast({ title: '已加入', icon: 'success' })
}
```

### 价格计算
```javascript
calculatePrice() {
  const base = this.data.drink.price
  const sizeExtra = this.selectedSpecs.sizeExtra || 0
  const toppingTotal = (this.selectedSpecs.toppings || []).reduce((sum, t) => {
    const topping = this.data.drink.toppings.find(tp => tp.name === t)
    return sum + (topping ? topping.price : 0)
  }, 0)
  return (base + sizeExtra + toppingTotal) * this.data.quantity
}
```

---

## 十一、云开发集成

### 11.1 数据库操作
```javascript
// utils/db.js
const db = wx.cloud.database()

// 获取所有饮品
exports.getDrinks = async (category) => {
  let query = db.collection('drinks').orderBy('sort', 'asc')
  if (category) {
    query = query.where({ category })
  }
  return await query.get()
}

// 创建订单
exports.createOrder = async (orderData) => {
  return await db.collection('orders').add({ data: orderData })
}
```

### 11.2 云函数 (可选)
- `submitOrder`: 处理订单提交 (防篡改价格)
- `signIn`: 处理签到逻辑
- `getUserInfo`: 获取/创建用户信息

---

## 十二、注意事项

1. **图片资源**: 开发阶段使用占位图，上线前替换为真实饮品图片
2. **价格安全**: 最终价格应在云函数中校验，防止前端篡改
3. **库存管理**: 后续可扩展库存字段，售罄时置灰商品卡片
4. **性能优化**: 商品列表使用分页加载，首屏只加载 20 条
5. **无障碍**: 按钮添加 `aria-label` 或 `hover-class` 反馈
6. **兼容性**: 最低支持基础库版本 2.20.1
