// Demo users. An image is either a URL string or { src, pos, scale } for a cropped/zoomed photo.
const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })
const garden = (pos, scale) => ({ src: '/assets/images/nablus-garden.jpg', pos, scale })

export const ME = 'mahmoud.jabr'

export const USERS = {
  'mahmoud.jabr': {
    username: 'mahmoud.jabr',
    name: 'محمود جبر',
    initial: 'م',
    color: 'rgb(126, 21, 20)',
    verified: true,
    role: 'مستكشف محلي · نابلس',
    bio: 'بلف نابلس حارة حارة وبشارك أحلى الأماكن اللي بلاقيها\nكنافة · قهوة · مشاوير البلدة القديمة',
    link: 'goexplore.app/mahmoud',
    note: 'مين بيعرف أحلى قهوة برفيديا؟',
    stats: { posts: 48, followers: '2,431', following: 320 },
    highlights: [
      { label: 'البلدة القديمة', img: clock('48% 16%', 2.6) },
      { label: 'حلويات', img: '/img/ph/sw_kunafa.jpg' },
      { label: 'قهوة', img: '/img/ph/cafe_croissant.jpg' },
      { label: 'طبيعة', img: garden('90% 22%', 1.8) },
      { label: 'أسواق', img: clock('90% 78%', 2.4) },
    ],
    grid: [
      { caption: 'برج الساعة بساحة المنارة… أول محطة بكل زيارة للبلدة القديمة.', img: clock('48% 16%', 2.6), multi: true, likes: '1,284', comments: 3 },
      { caption: 'دليلي للكنافة بالبلدة القديمة — احفظه لزيارتك الجاية.', img: '/img/ph/sw_kunafa.jpg', multi: true, likes: '2,310', comments: 3 },
      { caption: 'ركن هادي للقراءة بعيد عن زحمة البلد.', img: '/img/ph/cafe_croissant.jpg', likes: '377', comments: 2 },
      { caption: 'مشوار المسا بين الحارات.', img: clock('90% 78%', 2.4), likes: '642', comments: 3 },
      { caption: 'الصابون النابلسي… ريحة البلد.', img: { src: '/assets/images/tatreez-rug.jpg', pos: '20% 50%', scale: 1.3 }, multi: true, likes: '488', comments: 3 },
      { caption: 'غدا خفيف وصحي.', img: '/img/ph/food_salad.jpg', multi: true, likes: '905', comments: 2 },
      { caption: 'الغروب من فوق جرزيم.', img: garden('90% 22%', 1.8), likes: '1,730', comments: 3 },
      { caption: 'غرزة الفلاحي — نفس نقشة ثوب ستي.', img: { src: '/assets/images/tatreez-corner.png', pos: '40% 22%', scale: 1.8 }, likes: '1,046', comments: 3 },
      { caption: 'الأقواس الحجرية… كل زاوية لوحة.', img: clock('34% 42%', 1.9), likes: '562', comments: 2 },
    ],
    reviews: [
      { place: 'محل الكنافة النابلسية', img: '/img/ph/sw_kunafa.jpg', stars: 5, text: 'أحلى كنافة خشنة بالبلد، سخنة من الصينية والجبنة بتمط.', category: 'حلويات', date: '20 تشرين الأول' },
      { place: 'فندق البستان', img: '/img/ph/hotel_aerial.jpg', stars: 5, text: 'إطلالة رائعة ومسبح نظيف، الفطور كان ممتاز.', category: 'فنادق', date: '14 تشرين الأول' },
      { place: 'مطعم بيت العيلة', img: '/img/ph/food_spread.jpg', stars: 5, text: 'أكل بيتي وكميات كبيرة، مناسب للعيلة.', category: 'مطاعم', date: '9 تشرين الأول' },
      { place: 'مقهى الدراسة', img: '/img/ph/cafe_croissant.jpg', stars: 4, text: 'هادي ومناسب للدراسة، الكرواسون طازة.', category: 'مقاهي', date: '2 تشرين الأول' },
      { place: 'سوق خان التجار', img: '/img/ph/gift_pink.jpg', stars: 4, text: 'تشكيلة هدايا حلوة وأسعار معقولة.', category: 'هدايا', date: '28 أيلول' },
      { place: 'عالم المرح', img: '/img/ph/play_area.jpg', stars: 4, text: 'الأولاد انبسطوا كثير، بس زحمة بالويكند.', category: 'ملاهي', date: '21 أيلول' },
    ],
  },
  'sara.y': {
    username: 'sara.y',
    name: 'سارة يوسف',
    initial: 'س',
    color: '#56653A',
    photo: clock('72% 26%', 2.2),
    verified: true,
    followsYou: true,
    following: true,
    role: 'مدوّنة أكل',
    bio: 'بجرب كل مطعم بنابلس عشان ما تضطر إنت\nتقييمات صادقة فقط',
    link: 'goexplore.app/sara',
    note: 'قهوة المسا ☕',
    mutuals: 'يتابعه hala.food وآخرين',
    stats: { posts: 6, followers: '8,921', following: 512 },
    highlights: [
      { label: 'مطاعم', img: '/img/ph/food_tacos2.jpg' },
      { label: 'قهوة', img: clock('72% 26%', 2.2) },
      { label: 'حلو', img: '/img/ph/sw_kunafa.jpg' },
    ],
    grid: [
      { caption: 'جلسة السطح وقت الغروب — بتستاهل.', img: clock('72% 26%', 2.2), multi: true, likes: '842', comments: 3 },
      { caption: 'أطيب تاكو جربته هالسنة.', img: '/img/ph/food_tacos2.jpg', likes: '1,503', comments: 3 },
      { caption: 'كنافة خشنة سخنة من الصينية.', img: '/img/ph/sw_kunafa.jpg', likes: '2,004', comments: 2 },
      { caption: 'فطور مناقيش زعتر.', img: clock('22% 78%', 2.6), likes: '611', comments: 3 },
      { caption: 'قهوة مختصة برفيديا.', img: '/img/ph/cafe_croissant.jpg', likes: '455', comments: 3 },
      { caption: 'غدا العيلة.', img: '/img/ph/food_spread.jpg', likes: '390', comments: 2 },
    ],
    reviews: [
      { place: 'قهوة السطح', img: '/img/ph/cafe_terrace.jpg', stars: 5, text: 'جلسة الغروب على السطح بتستاهل كل شيكل.', category: 'مقاهي', date: '18 تشرين الأول' },
      { place: 'حلويات الأفراح', img: '/img/ph/sw_maamoul.jpg', stars: 5, text: 'معمول طازة ومش حلو زيادة، أخذت علبة للعيد.', category: 'حلويات', date: '11 تشرين الأول' },
      { place: 'مخالب وشوارب', img: '/img/ph/pets_yellow.jpg', stars: 5, text: 'لقيت كل اشي لقطتي، والموظفين بيفهموا.', category: 'حيوانات أليفة', date: '6 تشرين الأول' },
      { place: 'مطعم الفلافل الشعبي', img: '/img/ph/food_tacos.jpg', stars: 4, text: 'سريع وطيب، بس المكان صغير.', category: 'مطاعم', date: '30 أيلول' },
      { place: 'فندق القصر', img: '/img/ph/hotel_room2.jpg', stars: 4, text: 'غرف واسعة ونظيفة، الخدمة بدها تحسين بسيط.', category: 'فنادق', date: '19 أيلول' },
    ],
  },
  'lina.m': {
    username: 'lina.m',
    name: 'لينا منصور',
    firstName: 'لينا',
    initial: 'ل',
    color: 'rgb(122, 83, 16)',
    private: true,
    role: 'طالبة',
    bio: 'مقاهي للدراسة',
    mutuals: 'يتابعه sara.y وhala.food وآخرين',
    stats: { posts: 1, followers: 640, following: 402 },
  },
  'hala.food': { username: 'hala.food', name: 'هالة', initial: 'ه', color: '#C8461A' },
  'nour.travels': { username: 'nour.travels', name: 'نور', initial: 'ن', color: '#173022' },
  'ahmad.kh': { username: 'ahmad.kh', name: 'أحمد خليل', initial: 'أ', color: '#9A2E22' },
  'majd.walks': { username: 'majd.walks', name: 'مجد', initial: 'م', color: '#56653A' },
  'tariq.photo': { username: 'tariq.photo', name: 'طارق', initial: 'ط', color: '#173022' },
  'omar.hm': { username: 'omar.hm', name: 'عمر', initial: 'ع', color: '#3E5A6B' },
  'rania.h': { username: 'rania.h', name: 'رانيا', initial: 'ر', color: '#7E1514' },
}

export const userByName = (username) => USERS[username]

// "Suggested for you" (home sidebar + mobile strip).
export const SUGGESTIONS = [
  { username: 'ahmad.kh', reason: 'مصوّر', photo: clock('50% 20%', 1.6), card: '/img/ph/pets_dog.jpg' },
  { username: 'nour.travels', reason: 'يتابعه sara.y', photo: garden('90% 22%', 1.8), card: '/img/ph/hotel_aerial.jpg' },
  { username: 'majd.walks', reason: 'مسارات مشي', photo: clock('10% 55%', 2.1), card: '/img/ph/hero_valley.jpg' },
  { username: 'tariq.photo', reason: 'يتابعه sara.y', photo: garden('55% 36%', 3), card: '/img/ph/hero_clock.jpg' },
  { username: 'lina.m', reason: 'طالبة', request: true },
]
