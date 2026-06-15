// 饮品分类
export const categories = [
  { id: 'all', name: '全部', icon: '🧋' },
  { id: 'new', name: '新品', icon: '✨' },
  { id: 'hot', name: '热门', icon: '🔥' },
  { id: 'coffee', name: '咖啡', icon: '☕' },
  { id: 'tea', name: '茶饮', icon: '🍵' },
  { id: 'fruit', name: '果茶', icon: '🍊' },
  { id: 'yogurt', name: '酸奶', icon: '🥛' },
  { id: 'dessert', name: '甜品', icon: '🍮' }
];

// 甜度选项
export const sweetnessOptions = ['无糖', '三分糖', '半糖', '全糖'];

// 温度选项
export const temperatureOptions = ['去冰', '冰', '温热', '热'];

// 默认选择
export const defaultSweetness = '半糖';
export const defaultTemperature = '去冰';

// 加料
export const toppings = [
  { name: '珍珠', price: 2 },
  { name: '椰果', price: 2 },
  { name: '布丁', price: 3 },
  { name: '芋圆', price: 2 },
  { name: '波霸', price: 2 },
  { name: '仙草', price: 2 }
];

// 容量
export const sizes = [
  { name: '中杯', extraPrice: 0 },
  { name: '大杯', extraPrice: 3 },
  { name: '超大杯', extraPrice: 5 }
];

// 默认容量
export const defaultSize = '大杯';
export const defaultSizeExtraPrice = 3;

// 饮品数据
export const drinks = [
  // 新品
  {
    id: 'd001', name: '生椰拿铁', category: 'new', price: 18,
    image: '🥥', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '新鲜椰奶 × 浓缩咖啡',
    ingredients: ['椰奶', '浓缩咖啡', '冰块'],
    sales: 520, favorites: 180, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd002', name: '杨枝甘露', category: 'new', price: 20,
    image: '🥭', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '芒果 × 西柚 × 椰浆',
    ingredients: ['芒果', '西柚', '椰浆', '西米'],
    sales: 380, favorites: 150, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: false }
  },
  {
    id: 'd003', name: '抹茶拿铁', category: 'new', price: 19,
    image: '🍵', bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: '宇治抹茶 × 鲜牛奶',
    ingredients: ['宇治抹茶', '鲜牛奶', '冰块'],
    sales: 210, favorites: 95, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: true }
  },
  // 热门
  {
    id: 'd004', name: '多肉葡萄', category: 'hot', price: 16,
    image: '🍇', bgGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    description: '新鲜葡萄果肉 × 绿茶底',
    ingredients: ['葡萄', '绿茶', '椰果', '薄荷'],
    sales: 1250, favorites: 380, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd005', name: '芝芝莓莓', category: 'hot', price: 18,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    description: '草莓 × 芝士奶盖',
    ingredients: ['草莓', '芝士', '酸奶', '冰块'],
    sales: 980, favorites: 320, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd006', name: '黑糖波波牛奶', category: 'hot', price: 15,
    image: '🧋', bgGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    description: '黑糖糖浆 × 鲜奶 × 手工波波',
    ingredients: ['鲜奶', '黑糖', '木薯珍珠'],
    sales: 1560, favorites: 450, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd007', name: '柠檬百香果', category: 'hot', price: 12,
    image: '🍋', bgGradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    description: '新鲜柠檬 × 百香果 × 黄桃',
    ingredients: ['柠檬', '百香果', '黄桃', '蜂蜜'],
    sales: 870, favorites: 260, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 咖啡
  {
    id: 'd008', name: '美式咖啡', category: 'coffee', price: 14,
    image: '☕', bgGradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    description: '精选阿拉比卡豆 × 纯水萃取',
    ingredients: ['阿拉比卡咖啡豆', '纯水'],
    sales: 2100, favorites: 520, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd009', name: '拿铁咖啡', category: 'coffee', price: 18,
    image: '🥛', bgGradient: 'linear-gradient(135deg, #c7c994 0%, #dbd5b1 100%)',
    description: '浓缩咖啡 × 丝滑鲜奶',
    ingredients: ['浓缩咖啡', '鲜牛奶', '奶泡'],
    sales: 1800, favorites: 480, isHot: true, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  {
    id: 'd010', name: '焦糖玛奇朵', category: 'coffee', price: 20,
    image: '🍯', bgGradient: 'linear-gradient(135deg, #e6dada 0%, #f9d4c3 100%)',
    description: '香草糖浆 × 浓缩咖啡 × 焦糖',
    ingredients: ['浓缩咖啡', '鲜牛奶', '香草糖浆', '焦糖酱'],
    sales: 960, favorites: 310, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd011', name: '燕麦拿铁', category: 'coffee', price: 20,
    image: '🌾', bgGradient: 'linear-gradient(135deg, #e8cbc0 0%, #f3e7e9 100%)',
    description: '浓缩咖啡 × 燕麦奶',
    ingredients: ['浓缩咖啡', '燕麦奶'],
    sales: 650, favorites: 200, isHot: false, isNew: false,
    specs: { sweetness: false, temperature: true }
  },
  // 茶饮
  {
    id: 'd012', name: '经典珍珠奶茶', category: 'tea', price: 12,
    image: '🧋', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '红茶底 × 鲜奶 × 手工珍珠',
    ingredients: ['红茶', '鲜奶', '木薯珍珠', '砂糖'],
    sales: 3200, favorites: 680, isHot: true, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd013', name: '抹茶奶茶', category: 'tea', price: 15,
    image: '🍃', bgGradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
    description: '抹茶 × 鲜奶 × 珍珠',
    ingredients: ['抹茶粉', '鲜奶', '木薯珍珠'],
    sales: 780, favorites: 230, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd014', name: '乌龙奶茶', category: 'tea', price: 14,
    image: '🫖', bgGradient: 'linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)',
    description: '炭焙乌龙 × 鲜奶',
    ingredients: ['炭焙乌龙茶', '鲜奶'],
    sales: 920, favorites: 290, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd015', name: '红茶玛奇朵', category: 'tea', price: 16,
    image: '🤎', bgGradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    description: '锡兰红茶 × 奶盖',
    ingredients: ['锡兰红茶', '鲜奶', '奶盖'],
    sales: 650, favorites: 210, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 果茶
  {
    id: 'd016', name: '芒果益菌多', category: 'fruit', price: 14,
    image: '🥭', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '鲜芒果 × 益生菌酸奶',
    ingredients: ['芒果', '益生菌酸奶', '冰块'],
    sales: 1100, favorites: 350, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd017', name: '百香果双重奏', category: 'fruit', price: 13,
    image: '🟡', bgGradient: 'linear-gradient(135deg, #fsvdcd 0%, #fcd5ce 100%)',
    description: '百香果 × 西柚',
    ingredients: ['百香果', '西柚', '蜂蜜', '冰块'],
    sales: 890, favorites: 270, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd018', name: '桃桃乌龙', category: 'fruit', price: 15,
    image: '🍑', bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '水蜜桃 × 乌龙茶底',
    ingredients: ['水蜜桃', '乌龙茶', '芦荟'],
    sales: 750, favorites: 220, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  // 酸奶
  {
    id: 'd019', name: '蓝莓酸奶', category: 'yogurt', price: 14,
    image: '🫐', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '新鲜蓝莓 × 醇厚酸奶',
    ingredients: ['蓝莓', '酸奶', '蜂蜜'],
    sales: 680, favorites: 200, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: false }
  },
  {
    id: 'd020', name: '草莓酸奶', category: 'yogurt', price: 14,
    image: '🍓', bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    description: '新鲜草莓 × 希腊酸奶',
    ingredients: ['草莓', '希腊酸奶', '燕麦'],
    sales: 720, favorites: 215, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: false }
  },
  // 甜品
  {
    id: 'd021', name: '黑糖芋圆', category: 'dessert', price: 13,
    image: '🟣', bgGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    description: '手工芋圆 × 黑糖糖浆',
    ingredients: ['芋头', '木薯粉', '黑糖糖浆'],
    sales: 560, favorites: 170, isHot: false, isNew: false,
    specs: { sweetness: true, temperature: true }
  },
  {
    id: 'd022', name: '杨枝甘露椰子冻', category: 'dessert', price: 16,
    image: '🥥', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '芒果 × 椰子冻 × 西柚',
    ingredients: ['芒果', '椰子冻', '西柚', '椰浆'],
    sales: 430, favorites: 140, isHot: false, isNew: true,
    specs: { sweetness: true, temperature: false }
  }
];

// 活动数据
export const banners = [
  { id: 'b1', title: '新品上市', image: '🥥', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'b2', title: '满减活动', image: '🎉', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'b3', title: '积分兑换', image: '⭐', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
];

export const couponList = [
  { id: 'c1', name: '满 20 减 5', threshold: 20, reduce: 5, type: '满减' },
  { id: 'c2', name: '满 30 减 8', threshold: 30, reduce: 8, type: '满减' },
  { id: 'c3', name: '满 50 减 15', threshold: 50, reduce: 15, type: '满减' },
  { id: 'c4', name: '首单立减 5', threshold: 10, reduce: 5, type: '新人' }
];

export const secretKillItems = [
  { id: 'sk1', name: '美式咖啡', price: 8, originalPrice: 14, image: '☕', gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
  { id: 'sk2', name: '经典珍珠奶茶', price: 8, originalPrice: 12, image: '🧋', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'sk3', name: '多肉葡萄', price: 12, originalPrice: 16, image: '🍇', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { id: 'sk4', name: '拿铁咖啡', price: 13, originalPrice: 18, image: '🥛', gradient: 'linear-gradient(135deg, #c7c994 0%, #dbd5b1 100%)' }
];
