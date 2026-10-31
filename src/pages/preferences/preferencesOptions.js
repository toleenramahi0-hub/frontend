// Choices offered in the preferences wizard. `id` is what gets saved and sent
// to the backend; `label` is display text only.

export const STEPS = ['الفئات المفضلة', 'الميزانية', 'المناطق في نابلس', 'تفاصيل إضافية']

// Icons follow the preferences design; ids match data/categories.
export const CATEGORIES = [
  { id: 'restaurants', label: 'مطاعم', icon: 'M6 3v7M4 3v5a2 2 0 0 0 4 0V3M6 10v11M17 3c-2 0-3 2-3 6v3h3v9' },
  {
    id: 'cafes',
    label: 'مقاهي',
    icon: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3',
  },
  { id: 'sweets', label: 'حلويات', icon: 'M5 10h14l-2 10H7zM8 10V8a4 4 0 0 1 8 0v2' },
  {
    id: 'hotels',
    label: 'فنادق',
    icon: 'M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6M5.4 11a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0',
  },
  { id: 'fun', label: 'ملاهي', icon: 'M3 11a9 9 0 0 1 18 0zM12 11v10M9 21h6' },
  { id: 'toys', label: 'ألعاب', icon: 'M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z' },
  {
    id: 'gifts',
    label: 'هدايا',
    icon: 'M4.5 8.5h15q1 0 1 1v2q0 1 -1 1h-15q-1 0 -1 -1v-2q0 -1 1 -1zM5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.5 7.5 7.2 8.2 8.5 12 8.5 12 8.5zM12 8.5c1.5-4.5 5.5-4 4.5-1.3-.7 1.3-4.5 1.3-4.5 1.3z',
  },
  {
    id: 'pets',
    label: 'حيوانات أليفة',
    icon: 'M5.2 10a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0M8.7 6.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0M12.7 6.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0M16.2 10a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0M8 17.5c0-2.5 2-4.5 4-4.5s4 2 4 4.5c0 1.6-1.4 2.5-4 2.5s-4-.9-4-2.5z',
  },
  { id: 'electronics', label: 'إلكترونيات', icon: 'M9 3h6q2 0 2 2v14q0 2 -2 2h-6q-2 0 -2 -2v-14q0 -2 2 -2zM11 17.5h2' },
]

export const PRICE_LEVELS = [
  { id: 'low', label: 'اقتصادي', desc: 'أقل من ₪30 للشخص' },
  { id: 'medium', label: 'متوسط', desc: '₪30 – ₪80 للشخص' },
  { id: 'high', label: 'مميز', desc: 'أكثر من ₪80 للشخص' },
]

export const SPEND = { min: 20, max: 400, step: 10, initial: 80 }

export const AREAS = [
  { id: 'old_city', label: 'البلدة القديمة' },
  { id: 'downtown', label: 'وسط البلد' },
  { id: 'rafidia', label: 'رفيديا' },
  { id: 'makhfiya', label: 'المخفية' },
  { id: 'faisal_st', label: 'شارع فيصل' },
  { id: 'amman_st', label: 'شارع عمّان' },
  { id: 'new_campus', label: 'الجامعة الجديدة' },
  { id: 'north_mountain', label: 'الجبل الشمالي' },
  { id: 'south_mountain', label: 'الجبل الجنوبي' },
  { id: 'dahiya', label: 'الضاحية' },
  { id: 'beit_wazan', label: 'بيت وزن' },
]

export const DISTANCES = [
  { id: 1, label: '1 كم' },
  { id: 3, label: '3 كم' },
  { id: 5, label: '5 كم' },
  { id: null, label: 'كل نابلس' },
]

export const DETAIL_GROUPS = [
  {
    key: 'company',
    label: 'مع مين بتطلع عادةً؟',
    options: [
      { id: 'alone', label: 'لحالي' },
      { id: 'friends', label: 'الأصدقاء' },
      { id: 'family', label: 'العائلة' },
      { id: 'partner', label: 'مع الشريك' },
      { id: 'kids', label: 'مع الأطفال' },
    ],
  },
  {
    key: 'times',
    label: 'إمتى بتطلع أكثر شي؟',
    options: [
      { id: 'morning', label: 'الصبح' },
      { id: 'noon', label: 'الظهر' },
      { id: 'evening', label: 'المساء' },
      { id: 'late_night', label: 'آخر الليل' },
      { id: 'weekend', label: 'الويكند' },
    ],
  },
  {
    key: 'vibes',
    label: 'شو الأجواء اللي بتحبها؟',
    options: [
      { id: 'quiet', label: 'هادئ' },
      { id: 'lively', label: 'حيوي' },
      { id: 'traditional', label: 'تراثي' },
      { id: 'modern', label: 'عصري' },
      { id: 'outdoor', label: 'جلسات خارجية' },
      { id: 'view', label: 'إطلالة' },
    ],
  },
  {
    key: 'needs',
    label: 'أشياء مهمة إلك',
    options: [
      { id: 'wifi', label: 'واي فاي' },
      { id: 'parking', label: 'موقف سيارات' },
      { id: 'study', label: 'مناسب للدراسة' },
      { id: 'accessible', label: 'مناسب لذوي الإعاقة' },
      { id: 'vegetarian', label: 'خيارات نباتية' },
      { id: 'delivery', label: 'توصيل' },
    ],
  },
]

// Nothing is pre-selected: preferences must reflect what the user actually chose.
export const EMPTY_PREFERENCES = {
  categories: [],
  price_level: null,
  max_spend: SPEND.initial,
  deals_first: false,
  use_location: false,
  areas: [],
  max_distance_km: null,
  company: [],
  times: [],
  vibes: [],
  needs: [],
}
