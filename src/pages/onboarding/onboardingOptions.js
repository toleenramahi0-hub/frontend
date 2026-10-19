// Choices offered in the onboarding wizard. `id` is what gets saved and sent
// to the backend; `label` is display text only.

export const STEPS = ['الفئات المفضلة', 'الميزانية', 'المناطق في نابلس', 'تفاصيل إضافية']

export const CATEGORIES = [
  { id: 'restaurants', label: 'مطاعم', icon: 'M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9' },
  { id: 'cafes', label: 'مقاهي', icon: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3' },
  { id: 'hotels', label: 'فنادق', icon: 'M3 20V6M3 13h18v7M3 10h7a3 3 0 0 1 3 3M16 9a2 2 0 1 0 0 .01' },
  { id: 'parks', label: 'حدائق وترفيه', icon: 'M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v9M8 21h8' },
  { id: 'desserts', label: 'حلويات', icon: 'M6 10h12l-2 11H8zM7 10a5 5 0 0 1 10 0M12 5V3' },
  {
    id: 'electronics',
    label: 'إلكترونيات',
    icon: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  },
  {
    id: 'pets',
    label: 'حيوانات أليفة',
    icon: 'M12 14c-3 0-5 3-5 5a2 2 0 0 0 3 1.5 4 4 0 0 1 4 0A2 2 0 0 0 17 19c0-2-2-5-5-5zM6 10a1.5 2 0 1 0 0 .01M18 10a1.5 2 0 1 0 0 .01M9 6a1.5 2 0 1 0 0 .01M15 6a1.5 2 0 1 0 0 .01',
  },
  { id: 'toys', label: 'ألعاب', icon: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z' },
  { id: 'gifts', label: 'هدايا', icon: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1z' },
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
