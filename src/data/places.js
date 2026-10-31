// Places shown across discovery pages; RANKING lists each category from most trending.
// Shape mirrors what the places API is expected to return (UC-PB-01, UC-PB-02).

export const PLACES = [
  { id: "falafel-shaabi", name: "مطعم الفلافل الشعبي", category: "restaurants", area: "شارع فيصل", price: "₪", rating: 4.4, reviews: 267, img: "/img/ph/food_tacos.jpg", tags: ["فطور", "سريع", "نباتي"], catTags: ["فطور", "سريع"] },
  { id: "beit-al-eileh", name: "مطعم بيت العيلة", category: "restaurants", area: "رفيديا", price: "₪₪₪", rating: 4.6, reviews: 230, img: "/img/ph/food_tacos2.jpg", tags: ["أكل بيتي", "عائلي"] },
  { id: "study-cafe", name: "مقهى الدراسة", category: "cafes", area: "رفيديا", price: "₪₪", rating: 4.6, reviews: 198, img: "/img/ph/cafe_croissant.jpg", tags: ["واي فاي", "مناسب للدراسة", "قهوة مختصة"], catTags: ["واي فاي", "هادئ"] },
  { id: "rooftop-coffee", name: "قهوة السطح", category: "cafes", area: "البلدة القديمة", price: "₪₪", rating: 4.7, reviews: 143, img: "/img/ph/cafe_terrace.jpg", tags: ["إطلالة", "سهرات"] },
  { id: "nablus-kunafa", name: "محل الكنافة النابلسية", category: "sweets", area: "البلدة القديمة", price: "₪", rating: 4.9, reviews: 412, img: "/img/ph/sw_kunafa.jpg", tags: ["كنافة خشنة", "جلسة شعبية", "تيك أواي"], catTags: ["كنافة خشنة", "تيك أواي"] },
  { id: "afrah-sweets", name: "حلويات الأفراح", category: "sweets", area: "رفيديا", price: "₪", rating: 4.7, reviews: 263, img: "/img/ph/sw_maamoul.jpg", tags: ["معمول", "غريبة", "ضيافة"], catTags: ["معمول", "ضيافة"] },
  { id: "bustan-hotel", name: "فندق البستان", category: "hotels", area: "رفيديا", price: "₪₪₪", rating: 4.7, reviews: 214, img: "/img/ph/hotel_aerial.jpg", tags: ["مسبح", "إطلالة", "فطور"], catTags: ["مسبح", "فطور"] },
  { id: "qasr-hotel", name: "فندق القصر", category: "hotels", area: "الجبل الشمالي", price: "₪₪₪", rating: 4.6, reviews: 187, img: "/img/ph/hotel_room2.jpg", tags: ["غرف عائلية", "إطلالة"] },
  { id: "sindbad-city", name: "مدينة السندباد", category: "fun", area: "شارع عمّان", price: "₪₪", rating: 4.5, reviews: 341, img: "/img/ph/play_balls.jpg", tags: ["للأطفال", "بركة كرات"], catTags: ["بركة كرات", "للأطفال"] },
  { id: "fun-world", name: "عالم المرح", category: "fun", area: "المخفية", price: "₪₪", rating: 4.6, reviews: 198, img: "/img/ph/play_area.jpg", tags: ["للأطفال", "داخلي", "حفلات"], catTags: ["داخلي", "حفلات"] },
  { id: "blocks-world", name: "عالم المكعبات", category: "toys", area: "رفيديا", price: "₪₪", rating: 4.6, reviews: 164, img: "/img/ph/toys_blocks.jpg", tags: ["مكعبات", "هدايا أطفال"] },
  { id: "toy-shop", name: "دكان الألعاب", category: "toys", area: "شارع فيصل", price: "₪₪", rating: 4.5, reviews: 121, img: "/img/ph/toys_pile.jpg", tags: ["ألعاب تعليمية", "هدايا"], catTags: ["ألعاب تعليمية"] },
  { id: "khan-al-tujjar", name: "سوق خان التجار", category: "gifts", area: "البلدة القديمة", price: "₪", rating: 4.5, reviews: 521, img: "/img/ph/gift_pink.jpg", tags: ["صابون نابلسي", "بهارات", "تطريز"], catTags: ["صابون نابلسي", "تطريز"] },
  { id: "tatreez-shop", name: "محل التطريز", category: "gifts", area: "البلدة القديمة", price: "₪₪₪", rating: 4.8, reviews: 88, img: "/img/ph/gift_box.jpg", tags: ["صناعة يدوية", "هدايا"], catTags: ["صناعة يدوية"] },
  { id: "pet-house", name: "بيت الأليف", category: "pets", area: "المخفية", price: "₪₪", rating: 4.5, reviews: 118, img: "/img/ph/pets_dog.jpg", tags: ["أكل", "عناية"] },
  { id: "claws-whiskers", name: "مخالب وشوارب", category: "pets", area: "شارع عمّان", price: "₪₪", rating: 4.8, reviews: 96, img: "/img/ph/pets_yellow.jpg", tags: ["أكل", "إكسسوارات"], catTags: ["إكسسوارات"] },
  { id: "smart-zone", name: "سمارت زون", category: "electronics", area: "شارع فيصل", price: "₪₪₪", rating: 4.4, reviews: 205, img: "/img/ph/electronics2.jpg", tags: ["سماعات", "ساعات ذكية"] },
  { id: "pixel-point", name: "بكسل بوينت", category: "electronics", area: "وسط البلد", price: "₪₪", rating: 4.3, reviews: 140, img: "/img/ph/electronics.jpg", tags: ["أجهزة", "صيانة"] },
  { id: "yasmin-cafe", name: "كافيه الياسمين", category: "cafes", area: "شارع عمّان", price: "₪₪", rating: 4.5, reviews: 121, img: "/img/ph/cafe_terrace.jpg", tags: ["جلسات خارجية"] },
  { id: "bun-w-hail", name: "بن وهيل", category: "cafes", area: "وسط البلد", price: "₪", rating: 4.4, reviews: 97, img: "/img/ph/cafe_croissant.jpg", tags: ["قهوة عربية"] },
  { id: "hara-cafe", name: "مقهى الحارة", category: "cafes", area: "البلدة القديمة", price: "₪", rating: 4.2, reviews: 76, img: "/img/ph/hero_arches.jpg", tags: ["تراثي"] },
  { id: "coffee-corner", name: "ركن القهوة", category: "cafes", area: "المخفية", price: "₪", rating: 4.0, reviews: 54, img: "/img/ph/hero_alley.jpg", tags: ["تيك أواي"] },
  { id: "tech-store", name: "تك ستور", category: "electronics", area: "رفيديا", price: "₪₪", rating: 4.2, reviews: 110, img: "/img/ph/electronics2.jpg", tags: ["إكسسوارات"] },
  { id: "mobile-center", name: "موبايل سنتر", category: "electronics", area: "الدوار", price: "₪₪", rating: 4.0, reviews: 84, img: "/img/ph/electronics.jpg", tags: ["موبايلات"] },
  { id: "rabee-park", name: "ملاهي الربيع", category: "fun", area: "الجبل الجنوبي", price: "₪₪", rating: 4.3, reviews: 130, img: "/img/ph/play_area.jpg", tags: ["ألعاب كهربائية"] },
  { id: "jump-club", name: "نادي القفز", category: "fun", area: "رفيديا", price: "₪₪", rating: 4.1, reviews: 92, img: "/img/ph/play_balls.jpg", tags: ["ترامبولين"] },
  { id: "ward-gifts", name: "هدايا ورد", category: "gifts", area: "رفيديا", price: "₪₪", rating: 4.4, reviews: 110, img: "/img/ph/gift_pink.jpg", tags: ["بوكسات", "ورد"] },
  { id: "joy-box", name: "صندوق الفرح", category: "gifts", area: "شارع عمّان", price: "₪₪", rating: 4.3, reviews: 75, img: "/img/ph/gift_box.jpg", tags: ["هدايا مخصّصة"] },
  { id: "yasmin-hotel", name: "فندق الياسمين", category: "hotels", area: "وسط البلد", price: "₪₪", rating: 4.5, reviews: 140, img: "/img/ph/hotel_room1.jpg", tags: ["قريب من السوق"] },
  { id: "palm-resort", name: "منتجع النخيل", category: "hotels", area: "شارع عمّان", price: "₪₪₪", rating: 4.4, reviews: 122, img: "/img/ph/hotel_pool.jpg", tags: ["مسبح", "منتجع"] },
  { id: "old-city-inn", name: "نزل البلدة القديمة", category: "hotels", area: "البلدة القديمة", price: "₪₪", rating: 4.2, reviews: 70, img: "/img/ph/hero_arches.jpg", tags: ["تراثي", "بيت ضيافة"] },
  { id: "animal-world", name: "عالم الحيوان", category: "pets", area: "وسط البلد", price: "₪₪", rating: 4.3, reviews: 72, img: "/img/ph/pets_acc.jpg", tags: ["إكسسوارات", "أكل"] },
  { id: "nablus-vet", name: "بيطري نابلس", category: "pets", area: "رفيديا", price: "₪₪₪", rating: 4.2, reviews: 55, img: "/img/ph/pets_dog.jpg", tags: ["عيادة"] },
  { id: "kaak-bakery", name: "فرن الكعك", category: "restaurants", area: "وسط البلد", price: "₪", rating: 4.5, reviews: 176, img: "/img/ph/food_salad.jpg", tags: ["فرن حطب", "فطور"] },
  { id: "sufra-restaurant", name: "مطعم السفرة", category: "restaurants", area: "المخفية", price: "₪₪", rating: 4.3, reviews: 154, img: "/img/ph/food_tacos2.jpg", tags: ["مشاوي", "توصيل"] },
  { id: "duwwar-shawarma", name: "شاورما الدوار", category: "restaurants", area: "الدوار", price: "₪", rating: 4.2, reviews: 132, img: "/img/ph/food_tacos.jpg", tags: ["سريع", "سهرات"] },
  { id: "garden-restaurant", name: "مطعم الحديقة", category: "restaurants", area: "الجبل الشمالي", price: "₪₪₪", rating: 4.0, reviews: 88, img: "/img/ph/food_salad.jpg", tags: ["جلسات خارجية", "إطلالة"] },
  { id: "aqsa-sweets", name: "حلويات الأقصى", category: "sweets", area: "وسط البلد", price: "₪", rating: 4.6, reviews: 221, img: "/img/ph/sw_halawa.jpg", tags: ["حلاوة جبن"] },
  { id: "abu-samir-qatayef", name: "قطايف أبو سمير", category: "sweets", area: "البلدة القديمة", price: "₪", rating: 4.5, reviews: 170, img: "/img/ph/sw_qatayef.jpg", tags: ["قطايف", "رمضان"] },
  { id: "sheikh-awameh", name: "عوامة الشيخ", category: "sweets", area: "شارع فيصل", price: "₪", rating: 4.3, reviews: 118, img: "/img/ph/sw_awameh.jpg", tags: ["عوامة"] },
  { id: "sitt-ghraybeh", name: "غريبة الست", category: "sweets", area: "المخفية", price: "₪", rating: 4.2, reviews: 80, img: "/img/ph/sw_ghraybeh.jpg", tags: ["غريبة", "بيتي"] },
  { id: "childhood-toys", name: "ألعاب الطفولة", category: "toys", area: "وسط البلد", price: "₪", rating: 4.3, reviews: 85, img: "/img/ph/toys_pile.jpg", tags: ["دمى", "ألغاز"] },
  { id: "doll-house", name: "بيت الدمى", category: "toys", area: "المخفية", price: "₪₪", rating: 4.1, reviews: 60, img: "/img/ph/toys_blocks.jpg", tags: ["دمى"] },
]

export const RANKING = {
  restaurants: ["falafel-shaabi", "beit-al-eileh", "kaak-bakery", "sufra-restaurant", "duwwar-shawarma", "garden-restaurant"],
  cafes: ["study-cafe", "rooftop-coffee", "yasmin-cafe", "bun-w-hail", "hara-cafe", "coffee-corner"],
  sweets: ["nablus-kunafa", "afrah-sweets", "aqsa-sweets", "abu-samir-qatayef", "sheikh-awameh", "sitt-ghraybeh"],
  hotels: ["bustan-hotel", "qasr-hotel", "yasmin-hotel", "palm-resort", "old-city-inn"],
  fun: ["sindbad-city", "fun-world", "rabee-park", "jump-club"],
  toys: ["blocks-world", "toy-shop", "childhood-toys", "doll-house"],
  gifts: ["khan-al-tujjar", "ward-gifts", "tatreez-shop", "joy-box"],
  pets: ["pet-house", "claws-whiskers", "animal-world", "nablus-vet"],
  electronics: ["smart-zone", "pixel-point", "tech-store", "mobile-center"],
}

export const placeById = (id) => PLACES.find((p) => p.id === id)
export const placeByName = (name) => PLACES.find((p) => p.name === name)

// "Best two of each category" shown on the Places page.
export const FEATURED = [
  'falafel-shaabi', 'beit-al-eileh', 'study-cafe', 'rooftop-coffee', 'nablus-kunafa', 'afrah-sweets',
  'bustan-hotel', 'qasr-hotel', 'sindbad-city', 'fun-world', 'blocks-world', 'toy-shop',
  'khan-al-tujjar', 'tatreez-shop', 'pet-house', 'claws-whiskers', 'smart-zone', 'pixel-point',
]

// Places strip on the home feed ("أبرز الأماكن").
export const HIGHLIGHTS = [
  'nablus-kunafa', 'study-cafe', 'khan-al-tujjar', 'falafel-shaabi', 'rooftop-coffee', 'beit-al-eileh',
  'bustan-hotel', 'afrah-sweets', 'fun-world', 'toy-shop', 'claws-whiskers', 'pixel-point',
]

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })

// Extra detail for place pages. Places without an entry show only what is known (UC-PB-01 A1).
export const PLACE_DETAILS = {
  'nablus-kunafa': {
    gallery: ['/img/ph/sw_kunafa.jpg', '/img/ph/sw_qatayef.jpg', '/img/ph/sw_kunafa.jpg'],
    description:
      'من أقدم محلات الكنافة بالبلدة القديمة. الكنافة الخشنة بتطلع سخنة من الصينية كل نص ساعة، وبيقدموها مع قطر خفيف.',
    open: true,
    hours: '8 ص – 11 م',
    map: { left: '62%', top: '60%' },
    reviews: [
      { user: 'sara.y', photo: clock('72% 26%', 2.2), stars: 5, text: 'من أحلى الأماكن اللي جربتها، بنصح فيه.', ago: '1 أسابيع' },
      { user: 'ahmad.kh', photo: clock('50% 20%', 1.6), stars: 4, text: 'حلو كثير بس زحمة الظهر.', ago: '2 أسابيع' },
      { user: 'rania.h', color: 'rgb(86, 101, 58)', stars: 5, text: 'مناسب للعيلة والأولاد.', ago: '3 أسابيع' },
    ],
  },
}

// Pin positions on the illustrated Nablus map (percent of the map box).
export const MAP_PINS = {
  'nablus-kunafa': { left: '62%', top: '60%' },
  'study-cafe': { left: '18%', top: '44%' },
  'khan-al-tujjar': { left: '56%', top: '54%' },
  'falafel-shaabi': { left: '40%', top: '70%' },
  'rooftop-coffee': { left: '66%', top: '50%' },
  'beit-al-eileh': { left: '24%', top: '52%' },
  'kaak-bakery': { left: '52%', top: '62%' },
  'tatreez-shop': { left: '60%', top: '56%' },
  'bustan-hotel': { left: '22%', top: '40%' },
  'afrah-sweets': { left: '30%', top: '52%' },
  'fun-world': { left: '40%', top: '28%' },
  'toy-shop': { left: '66%', top: '58%' },
  'claws-whiskers': { left: '78%', top: '40%' },
  'pixel-point': { left: '56%', top: '46%' },
}
