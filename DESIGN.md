# 奶茶小铺 — 设计开发文档

## 一、项目概述

**奶茶小铺** 是一个微信小程序奶茶饮品点单系统，支持商品浏览、规格定制、购物车管理、优惠券、签到积分、在线支付和订单跟踪等完整消费链路。

- 开发框架：微信小程序原生
- 数据层：微信云开发（CloudBase）— 云数据库 + 云函数
- 基础库版本：2.20.1+

---

## 二、项目结构

```
miniprogram/
  app.js                       # 全局入口：云初始化、全局数据、购物车方法
  app.json                     # 页面注册、tabBar 配置
  app.wxss                     # 全局样式
  envList.js                   # 云环境列表
  sitemap.json

  utils/
    db.js                      # 云数据库客户端封装（统一调用云函数）

  constants/
    index.js                   # 业务常量：商品、分类、规格、优惠券

  pages/
    index/                     # 饮品首页 — 分类筛选 + 搜索 + 悬浮购物车
    detail/                    # 商品详情 — 规格选择 + 加料 + 加购/立即购买
    cart/                      # 购物车 — 勾选 + 数量 + 删除 + 结算
    order/                     # 订单确认 — 商品清单 + 优惠券 + 支付方式
    payment/                   # 支付页 — 金额确认 + 确认/取消支付
    order-status/              # 订单状态 — 排队倒计时 + 进度展示
    promotion/                 # 活动页 — Banner + 新品/爆款推荐 + 领券
    usercenter/                # 我的 — 用户信息 + 签到 + 优惠券 + 订单列表

cloudfunctions/
  cloud-business/              # 业务云函数（统一处理 5 个集合的 CRUD）
    index.js
    package.json
```

---

## 三、页面导航与流程

### 3.1 页面路由

| 页面 | 路径 | 导航方式 | 说明 |
|------|------|----------|------|
| 饮品首页 | pages/index/index | tabBar | 左右分栏，展示 8 个分类 |
| 商品详情 | pages/detail/detail | navigateTo | 规格 / 加料 / 数量选择 |
| 购物车 | pages/cart/cart | navigateTo | 悬浮按钮 / 列表内跳转 |
| 活动页 | pages/promotion/promotion | tabBar | Banner + 商品推荐 + 优惠券 |
| 我的 | pages/usercenter/usercenter | tabBar | 用户信息 / 签到 / 订单 |
| 订单确认 | pages/order/order | navigateTo | 选商品 / 选优惠券 / 提交 |
| 支付 | pages/payment/payment | redirectTo | 确认 / 取消支付 |
| 订单状态 | pages/order-status/order-status | navigateTo | 倒计时 / 进度条 |

### 3.2 核心业务流程

```
首页浏览 → 商品详情 → 加入购物车
                                    ↘
                                      ＞ 购物车（勾选）→ 订单确认
                                    ↗                           ↓
首页悬浮购物车 ———————————————————                     选择优惠券 → 提交订单
                                                               ↓
                                                         支付页面
                                                        ↙        ↘
                                                  确认支付      取消支付
                                                     ↓            ↓
                                               订单状态页      返回上一页
                                               （倒计时制作中）
```

---

## 四、云数据库集合设计

全部数据通过云函数 `cloud-business` 读写，以用户 `openid` 作为 userId 关联。

### 4.1 `cart` — 购物车

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 openid |
| key | string | 去重键 `${id}_${size}_${sweetness}_${temperature}` |
| id | string | 饮品 ID |
| name | string | 饮品名称 |
| image | string | 饮品表情 |
| bgGradient | string | 背景渐变色 |
| sweetness | string | 糖度 |
| temperature | string | 温度 |
| size | string | 杯型 |
| sizeExtraPrice | number | 杯型加价 |
| toppings | string[] | 加料列表 |
| toppingTotal | number | 加料总价 |
| quantity | number | 数量 |
| unitPrice | number | 单价（不含加料） |
| totalPrice | number | 该行总价 |
| checked | bool | 购物车勾选状态 |
| createdAt | date | 创建时间 |
| updatedAt | date | 更新时间 |

操作方式：先删除用户全部记录，再批量写入（全量覆盖）。

### 4.2 `user_coupons` — 用户优惠券

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 openid |
| couponId | string | 优惠券 ID（关联 constants） |
| name | string | 满减名称 |
| threshold | number | 满减门槛 |
| reduce | number | 减免金额 |
| type | string | 类型（满减/新客） |
| status | string | unused / used |
| receivedAt | date | 领取时间 |
| usedAt | date | 使用时间（可为空） |

### 4.3 `user_signin` — 签到记录

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 openid |
| streak | number | 连续签到天数 |
| lastDate | string | 最后签到日期（DateString） |
| points | number | 累计签到积分 |
| history | string[] | 签到历史日期 |
| createdAt | date | |
| updatedAt | date | |

### 4.4 `orders` — 订单

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 openid |
| orderNo | string | 订单编号（NT+时间戳+随机） |
| items | array | 商品快照 [{id, name, image, sweetness, temperature, size, quantity, totalPrice}] |
| totalAmount | number | 原价合计 |
| finalAmount | number | 优惠后实付 |
| couponUsed | object | 使用的优惠券 {id, _id} |
| status | number | 0=待付款, 3=已取消, 4=已付款, 2=制作完成 |
| paymentMethod | string | 支付方式 |
| createTime | string | ISO 时间 |
| createdAt | date | |
| updatedAt | date | |

### 4.5 `users` — 用户信息

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 openid |
| nickname | string | 昵称（默认"奶茶爱好者"） |
| avatar | string | 头像 emoji |
| uid | string | 用户编号 |
| points | number | 总积分 |
| createdAt | date | |

---

## 五、云函数接口

云函数名：`cloud-business`

通过 `event.type` 分发：

| type | 参数 | 返回 | 说明 |
|------|------|------|------|
| getCart | — | {data: items} | 获取购物车 |
| updateCart | {items} | — | 全量更新购物车 |
| getUserCoupons | — | {data: coupons} | 获取用户优惠券 |
| receiveCoupon | {coupon} | — | 领取优惠券（去重） |
| useCoupon | {recordId} | — | 标记优惠券已使用 |
| getSignInInfo | — | {data: {streak, points, lastDate, canSignIn}} | 签到信息 |
| signIn | — | {data: signinRecord} | 签到（+10积分，连续+1天） |
| getOrders | {status?} | {data: orders} | 获取订单列表（可选按状态筛选） |
| createOrder | {order} | {orderId} | 创建订单 |
| updateOrderStatus | {orderId 或 orderNo, status} | — | 更新订单状态 |
| getUserInfo | — | {data: user} | 获取用户信息（不存在返回默认） |
| initUser | — | — | 首次初始化用户信息 |

所有接口统一返回格式：
```json
{
  "success": true/false,
  "data": ...,         // 查询类接口
  "errMsg": "..."      // 失败时
}
```

---

## 六、全局数据与状态管理

### app.globalData

| 字段 | 类型 | 说明 |
|------|------|------|
| userInfo | {nickname, avatar, uid} | 用户信息 |
| openid | string | 微信 openid |
| cart | array | 购物车本地副本（与云端双向同步） |
| points | number | 积分 |
| signInStreak | number | 签到连续天数 |
| canSignIn | bool | 今日是否可签到 |

### app.js 暴露方法

| 方法 | 说明 | 云同步 |
|------|------|--------|
| addToCart(item) | 添加商品（同规格合并数量） | 是 |
| updateCart(key, quantity) | 修改数量（<=0 删除） | 是 |
| clearCart() | 清空购物车 | 是 |
| getCartCount() | 计算购物车总件数 | 否 |

---

## 七、页面功能详解

### 7.1 首页 (index)
- 左侧分类侧边栏（8 个分类 + 全部）
- 右侧商品网格（每个分类独立分组，支持滚动锚点）
- 搜索框：按名称或描述模糊搜索
- 悬浮购物车按钮：右下角圆形按钮，实时角标数量

### 7.2 商品详情 (detail)
- 商品大图 + 基本信息
- 成分标签展示
- 糖度选择（4 档）/ 温度选择（4 档）/ 杯型选择（3 档）
- 加料选择（6 种，每项 +2~3 元）
- 数量增减
- 底部操作栏：加入购物车（调用 addToCart + 云同步）| 立即购买（跳转订单页）

### 7.3 购物车 (cart)
- 商品列表：勾选、商品图（可跳转详情）、名称、规格、数量、价格
- 单个勾选/全选：实时同步云端
- 数量增减：同步云端
- 删除商品（×）：同步云端
- 空购物车提示
- 底部结算栏：合计金额 + 去结算按钮（仅传勾选商品）

### 7.4 订单确认 (order)
- 商品清单（规格 + 数量 + 价格，可调整数量）
- 优惠券下拉选择（仅显示 unused 状态，校验门槛）
- 支付方式选择（微信支付）
- 提交订单 → 创建订单（status=0）→ 跳转支付页
- 使用优惠券时自动标记为 used

### 7.5 支付 (payment)
- 顶部摘要：订单号 + 应付金额
- 支付方式展示
- 底部按钮：
  - **确认支付** — 更新订单 status=4 → 跳转订单状态页
  - **取消** — 更新订单 status=0（恢复待付款）→ 返回上一页

### 7.6 订单状态 (order-status)
- 成功动画 + "订单提交成功" 状态提示
- 信息卡片：订单号、前方排队、预计取单、制作倒计时
- 三步骤进度条：已下单 → 制作中 → 可取货
- 倒计时归零后自动更新 status=2（制作完成）

### 7.7 活动页 (promotion)
- Banner 轮播（新品推荐 → 跳首页、满减活动、积分兑换 → 跳首页）
- 新品推荐横向滚动（3 款新品卡片，点击跳详情）
- 人气爆款横向滚动（4 款爆款卡片，点击跳详情）
- 优惠券列表（从云端加载已领取状态，支持领取/已领取切换）
- 新人专享卡片

### 7.8 我的 (usercenter)
- 用户头部：头像 + 昵称 + UID + 签到按钮
- 数据面板：积分、优惠券数、订单数、收藏数
- 我的优惠券列表（从云端加载）
- 我的订单（Tabs 筛选：全部/待付款/待取货/已完成），订单数据从云端加载并转换为展示格式
- 功能入口：收货地址、联系客服、意见反馈、关于我们

---

## 八、购物车同步机制

购物车数据同时保存在 `app.globalData.cart`（内存副本）和云数据库 `cart` 集合。
- 添加/修改/删除购物车 → 更新内存 → 全量覆盖云端
- 首页 onShow → 从云端拉取最新购物车数据
- 购物车页面 onShow → 从云端拉取全量数据
- 订单页提交 → 清空购物车（云端 + 内存）

---

## 九、样式与视觉

- 主题色：`#FF6B35`（橙色），辅色 `#FFB347`（浅橙）
- 商品图片：Emoji 图标 + CSS 渐变色背景
- 圆角风格：卡片 16rpx、按钮 40rpx+、标签 30rpx
- 底部操作栏统一固定定位 + safe-area-inset-bottom
- 动画：按钮点击缩放 0.97、加购悬浮动画、签到脉冲动画

---

## 十、部署与运维

1. 云函数部署：在微信开发者工具中右键 `cloud-business` → 上传并部署（云端安装依赖）
2. 云数据库：需在云控制台手动创建 5 个集合（cart, user_coupons, user_signin, orders, users）或等待首次调用时自动创建
3. 云环境 ID：`cloudbase-d7g83ke4n84c0550a`（配置在 app.js 的 `wx.cloud.init` 中）
4. 商品数据维护：修改 `constants/index.js` 中的 `drinks` 数组，重新编译即可生效
