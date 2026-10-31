// Seed data for the admin dashboard until the admin API exists.

export const KPIS = [
  { label: 'المستخدمون المسجّلون', value: '12,480', change: '▲ 8.2% هالشهر', up: true, spark: [40, 52, 48, 60, 58, 70, 82] },
  { label: 'الأماكن الموثّقة', value: '43', change: '▲ 6 أماكن جديدة', up: true, spark: [60, 62, 64, 70, 72, 80, 88] },
  { label: 'منشورات هالأسبوع', value: '1,926', change: '▲ 14%', up: true, spark: [30, 45, 50, 42, 66, 70, 92] },
  { label: 'زيارات موثّقة', value: '3,214', change: '▼ 2.1%', up: false, spark: [80, 76, 82, 74, 70, 72, 68] },
]

export const ACTIVITY = [
  {
    text: (
      <>
        <b>رامي</b> وافق على مكان <b>سمارت زون</b>
      </>
    ),
    when: 'قبل 5 د',
  },
  {
    text: (
      <>
        <b>منى</b> حذفت تعليق مسيء على منشور hala.food
      </>
    ),
    when: 'قبل 20 د',
  },
  {
    text: (
      <>
        تسجيل <b>148</b> مستخدم جديد اليوم
      </>
    ),
    when: 'قبل ساعة',
  },
  {
    text: (
      <>
        <b>رامي</b> وثّق صاحب <b>فندق القصر</b>
      </>
    ),
    when: 'قبل 3 س',
  },
  { text: 'نظام: نسخة احتياطية مكتملة', when: 'اليوم 03:00' },
]

// [place id, engagement %]
export const TRENDING = [
  ['nablus-kunafa', 96],
  ['khan-al-tujjar', 88],
  ['sindbad-city', 74],
  ['falafel-shaabi', 66],
  ['bustan-hotel', 58],
]

export const REPORTS = [
  { key: 'r1', img: '/img/ph/sw_kunafa.jpg', text: 'تعليق: "هاد المحل أسوأ مكان… لا تروحوا"', user: 'troll.99', reason: 'إساءة', count: 7 },
  { key: 'r2', img: '/img/ph/electronics.jpg', text: 'منشور: "خصم 90% على كل الأجهزة… اضغط الرابط"', user: 'spam.deals22', reason: 'رسائل مزعجة', count: 12 },
  { key: 'r3', img: '/img/ph/hotel_room2.jpg', text: 'صورة غير مرتبطة بالمكان', user: 'nour.travels', reason: 'محتوى مضلّل', count: 2 },
  { key: 'r4', img: '/img/ph/food_tacos.jpg', text: 'تقييم مكرر 5 مرات لنفس المطعم', user: 'fake.rev', reason: 'تقييمات مزيّفة', count: 4 },
]

export const PLACE_REQUESTS = [
  { key: 'p1', img: '/img/ph/cafe_croissant.jpg', name: 'كافيه الزيتونة', category: 'مقاهي', area: 'رفيديا', by: 'sara.y', when: 'قبل ساعتين', note: 'مقهى جديد فتح قرب الجامعة، فيه جلسات دراسة وواي فاي.' },
  { key: 'p2', img: '/img/ph/toys_blocks.jpg', name: 'ركن الطفل', category: 'ألعاب', area: 'شارع فيصل', by: 'rania.h', when: 'أمس', note: 'محل ألعاب تعليمية وهدايا أطفال.' },
  { key: 'p3', img: '/img/ph/hotel_pool.jpg', name: 'استراحة الجبل', category: 'فنادق', area: 'الجبل الجنوبي', by: 'omar.hm', when: 'قبل يومين', note: 'شاليهات مع مسبح وإطلالة على المدينة.' },
]

export const OWNER_REQUESTS = [
  { key: 'o1', name: 'خالد النابلسي', phone: '+970 59 123 4567', place: 'محل الكنافة النابلسية', proof: 'سجل تجاري' },
  { key: 'o2', name: 'ريم عودة', phone: '+970 56 765 4321', place: 'حلويات الأفراح', proof: 'رخصة بلدية' },
]

export const USERS = [
  { username: 'mahmoud.jabr', initial: 'م', color: '#7E1514', type: 'مستخدم موثّق', posts: 214 },
  { username: 'sara.y', img: '/img/ph/cafe_terrace.jpg', color: '#56653A', type: 'مستخدم', posts: 188 },
  { username: 'hala.food', img: '/img/ph/sw_kunafa.jpg', color: '#C8461A', type: 'صانعة محتوى', posts: 342 },
  { username: 'ahmad.kh', img: '/img/ph/pets_dog.jpg', color: '#9A2E22', type: 'مستخدم', posts: 96 },
  { username: 'nour.travels', img: '/img/ph/hotel_aerial.jpg', color: '#173022', type: 'مستخدم', posts: 131 },
  { username: 'spam.deals22', initial: 'ع', color: '#6A5C51', type: 'مستخدم', posts: 3, suspended: true },
  { username: 'lina.m', initial: 'ل', color: '#7A5310', type: 'حساب خاص', posts: 41 },
]

export const CATEGORY_STATS = {
  restaurants: { places: 6, visits: '1,820', popularity: 82 },
  cafes: { places: 6, visits: '1,460', popularity: 66 },
  sweets: { places: 6, visits: '2,210', popularity: 100 },
  hotels: { places: 5, visits: '740', popularity: 33 },
  fun: { places: 4, visits: '690', popularity: 31 },
  toys: { places: 4, visits: '320', popularity: 14 },
  gifts: { places: 4, visits: '880', popularity: 40 },
  pets: { places: 4, visits: '410', popularity: 19 },
  electronics: { places: 4, visits: '530', popularity: 24 },
}

export const TICKETS = [
  { id: 1042, title: 'ما بقدر أغيّر صورة البروفايل', user: 'majd.walks', when: 'قبل 30 د', body: 'كل ما أرفع صورة بطلعلي خطأ.' },
  { id: 1041, title: 'النقاط ما انضافت بعد الزيارة', user: 'sara.y', when: 'قبل 3 س', body: 'سجلت زيارة بقهوة السطح وما انضافت النقاط.' },
  { id: 1039, title: 'بدي أحذف حسابي', user: 'old.user', when: 'أمس', body: 'لو سمحتوا ساعدوني بحذف الحساب نهائياً.' },
]
