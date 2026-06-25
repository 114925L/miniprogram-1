// 商品分类
const categories = [
  { id: 'all', name: '全部', icon: '🍵' },
  { id: 'new', name: '新品', icon: '✨' },
  { id: 'hot', name: '爆款', icon: '🔥' },
  { id: 'coffee', name: '咖啡', icon: '☕' },
  { id: 'tea', name: '茶饮', icon: '🍃' },
  { id: 'fruit', name: '水果', icon: '🍊' },
  { id: 'yogurt', name: '酸奶', icon: '🥛' },
  { id: 'dessert', name: '甜品', icon: '🍮' }
];

// 糖度选项
const sweetnessOptions = ['微糖', '半糖', '三分糖', '无糖'];

// 温度选项
const temperatureOptions = ['热', '温', '冰', '去冰'];

// 默认糖度
const defaultSweetness = '三分糖';
const defaultTemperature = '热';

// 小料
const toppings = [
  { name: '珍珠', price: 2 },
  { name: '椰果', price: 2 },
  { name: '红豆', price: 3 },
  { name: '芋圆', price: 2 },
  { name: '布丁', price: 2 },
  { name: '仙草', price: 2 }
];

// 杯型
const sizes = [
  { name: '中杯', extraPrice: 0 },
  { name: '大杯', extraPrice: 3 },
  { name: '超大杯', extraPrice: 5 }
];

// 默认杯型
const defaultSize = '大杯';
const defaultSizeExtraPrice = 3;

// 饮品列表
const drinks = [
  // 新品
  {
    id: 'd001', name: '葡萄波波奶绿', category: 'new', price: 18,
    image: '🍇', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '阳光玫瑰葡萄 + 厚乳奶茶',
    ingredients: ['阳光玫瑰葡萄', '厚乳奶茶', '波波'],
    sales: 520, favorites: 180, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd002', name: '草莓厚乳拿铁', category: 'new', price: 20,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '草莓 + 燕麦奶 + 椰果',
    ingredients: ['草莓', '燕麦奶', '椰果', '拿铁液'],
    sales: 380, favorites: 150, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: false }
  },
  {
    id: 'd003', name: '芒果奶绿', category: 'new', price: 19,
    image: '🥭', bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: '鲜切芒果 + 厚乳奶茶',
    ingredients: ['鲜切芒果', '厚乳奶茶', '波波'],
    sales: 210, favorites: 95, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: true }
  },
  // 爆款
  {
    id: 'd004', name: '葡萄芋圆冻冻', category: 'hot', price: 16,
    image: '🍇', bgGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    description: '阳光玫瑰葡萄 + 手捣芋泥',
    ingredients: ['葡萄', '手捣芋泥', '椰果', '冻冻'],
    sales: 1250, favorites: 380, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd005', name: '蜜桃乌龙茶', category: 'hot', price: 18,
    image: '🍑', bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    description: '水蜜桃 + 蜜桃乌龙茶底',
    ingredients: ['水蜜桃', '蜜桃乌龙', '酸奶', '波波'],
    sales: 980, favorites: 320, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd006', name: '杨枝甘露奶茶', category: 'hot', price: 15,
    image: '🥭', bgGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    description: '杨枝甘露 + 厚乳奶茶 + 西米露',
    ingredients: ['厚乳奶茶', '杨枝甘露', '西米露'],
    sales: 1560, favorites: 450, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd007', name: '芋泥波波奶茶', category: 'hot', price: 12,
    image: '🧋', bgGradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    description: '手捣芋泥 + 波波奶茶',
    ingredients: ['芋泥', '波波', '厚乳奶茶', '椰果'],
    sales: 870, favorites: 260, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 咖啡
  {
    id: 'd008', name: '拿铁咖啡', category: 'coffee', price: 14,
    image: '☕', bgGradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    description: '意式浓缩 + 鲜牛奶',
    ingredients: ['意式浓缩咖啡', '鲜牛奶'],
    sales: 2100, favorites: 520, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd009', name: '摩卡咖啡', category: 'coffee', price: 18,
    image: '☕', bgGradient: 'linear-gradient(135deg, #c7c994 0%, #dbd5b1 100%)',
    description: '厚乳奶茶 + 巧克力酱',
    ingredients: ['厚乳奶茶', '巧克力酱', '可可粉'],
    sales: 1800, favorites: 480, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd010', name: '焦糖玛奇朵', category: 'coffee', price: 20,
    image: '🥛', bgGradient: 'linear-gradient(135deg, #e6dada 0%, #f9d4c3 100%)',
    description: '意式浓缩 + 厚乳奶茶 + 焦糖',
    ingredients: ['厚乳奶茶', '巧克力酱', '焦糖', '奶油'],
    sales: 960, favorites: 310, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd011', name: '香草拿铁', category: 'coffee', price: 20,
    image: '🍦', bgGradient: 'linear-gradient(135deg, #e8cbc0 0%, #f3e7e9 100%)',
    description: '厚乳奶茶 + 香草糖浆',
    ingredients: ['厚乳奶茶', '香草糖浆'],
    sales: 650, favorites: 200, isHot: false, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  // 茶饮
  {
    id: 'd012', name: '四季春珍珠奶茶', category: 'tea', price: 12,
    image: '🍵', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '四季春茶底 + 厚乳奶茶 + 珍珠',
    ingredients: ['四季春茶', '厚乳奶茶', '西米露', '椰果'],
    sales: 3200, favorites: 680, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd013', name: '茉莉奶茶', category: 'tea', price: 15,
    image: '🍵', bgGradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
    description: '茉莉花茶 + 厚乳奶茶 + 珍珠',
    ingredients: ['茉莉花茶', '厚乳奶茶', '西米露'],
    sales: 780, favorites: 230, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd014', name: '抹茶奶茶', category: 'tea', price: 14,
    image: '🍵', bgGradient: 'linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)',
    description: '抹茶 + 厚乳奶茶',
    ingredients: ['抹茶粉', '厚乳奶茶'],
    sales: 920, favorites: 290, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd015', name: '四季春玛奇朵', category: 'tea', price: 16,
    image: '🍵', bgGradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    description: '四季春 + 奶盖',
    ingredients: ['四季春茶', '厚乳奶茶', '奶盖'],
    sales: 650, favorites: 210, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 水果
  {
    id: 'd016', name: '草莓芒果冰', category: 'fruit', price: 14,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '鲜果冰沙 + 芒果粒',
    ingredients: ['草莓', '芒果粒', '波波'],
    sales: 1100, favorites: 350, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd017', name: '芋泥波波果茶', category: 'fruit', price: 13,
    image: '🧋', bgGradient: 'linear-gradient(135deg, #f9a8d4 0%, #fcd5ce 100%)',
    description: '芋泥 + 波波',
    ingredients: ['芋泥', '燕麦奶', '椰果', '波波'],
    sales: 890, favorites: 270, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd018', name: '杨枝甘露', category: 'fruit', price: 15,
    image: '🥭', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '杨枝甘露 + 珍珠',
    ingredients: ['杨枝甘露', '珍珠', '椰果'],
    sales: 750, favorites: 220, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 酸奶
  {
    id: 'd019', name: '草莓酸奶', category: 'yogurt', price: 14,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '新鲜草莓 + 希腊酸奶',
    ingredients: ['草莓', '酸奶', '椰果'],
    sales: 680, favorites: 200, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: false }
  },
  {
    id: 'd020', name: '蜜桃酸奶', category: 'yogurt', price: 14,
    image: '🍑', bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    description: '水蜜桃 + 芒果酸奶',
    ingredients: ['水蜜桃', '芒果酸奶', '香草糖浆'],
    sales: 720, favorites: 215, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: false }
  },
  // 甜品
  {
    id: 'd021', name: '杨枝甘露', category: 'dessert', price: 13,
    image: '🍮', bgGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    description: '西米露 + 杨枝甘露',
    ingredients: ['西米露', '西米露', '杨枝甘露'],
    sales: 560, favorites: 170, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd022', name: '草莓厚乳波波奶茶', category: 'dessert', price: 16,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '草莓 + 厚乳奶茶 + 波波',
    ingredients: ['草莓', '厚乳奶茶', '燕麦奶', '椰果'],
    sales: 430, favorites: 140, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: false }
  }
];

// 促销数据
const banners = [
  { id: 'b1', title: '新品推荐', image: '🍇', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'b2', title: '满减活动', image: '🔥', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'b3', title: '积分兑换', image: '🎁', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
];

const couponList = [
  { id: 'c1', name: '满20减5', threshold: 20, reduce: 5, type: '满减' },
  { id: 'c2', name: '满30减8', threshold: 30, reduce: 8, type: '满减' },
  { id: 'c3', name: '满50减15', threshold: 50, reduce: 15, type: '满减' },
  { id: 'c4', name: '首单立减5', threshold: 10, reduce: 5, type: '新客' }
];

module.exports = {
  categories,
  sweetnessOptions,
  temperatureOptions,
  defaultSweetness,
  defaultTemperature,
  toppings,
  sizes,
  defaultSize,
  defaultSizeExtraPrice,
  drinks,
  banners,
  couponList
};
