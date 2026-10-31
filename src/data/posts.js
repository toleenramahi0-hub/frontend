// Experience posts (UC-SR-01/02). Images are URL strings or { src, pos, scale } crops.

export const FEED = [
  { id: 'f1', user: "sara.y", time: "قبل ساعة", place: "فندق البستان", images: ["/img/ph/hotel_pool.jpg"], likes: "942", comments: "4", caption: "ويكند عالمسبح… راحة بال." },
  { id: 'f2', user: "hala.food", time: "قبل 3 ساعات", place: "حلويات الأفراح", images: ["/img/ph/sw_maamoul.jpg"], likes: "1,120", comments: "6", caption: "معمول العيد طازة من الفرن." },
  { id: 'f3', user: "mahmoud.jabr", time: "قبل 3 أيام", place: "محل الكنافة النابلسية", images: [{ src: "/assets/images/nablus-clock-tower.jpg", pos: "48% 16%", scale: 2.6 }, { src: "/assets/images/nablus-clock-tower.jpg", pos: "90% 78%", scale: 2.4 }, { src: "/assets/images/nablus-clock-tower.jpg", pos: "34% 42%", scale: 1.9 }], likes: "1,284", comments: "3", caption: "برج الساعة بساحة المنارة… أول محطة بكل زيارة للبلدة القديمة.", verified: true },
  { id: 'f4', user: "rania.h", time: "قبل 5 ساعات", place: "عالم المرح", images: ["/img/ph/play_balls.jpg"], likes: "611", comments: "3", caption: "الأولاد ما بدهم يروحوا 😄" },
  { id: 'f5', user: "nour.travels", time: "أمس", place: "فندق البستان", images: ["/img/ph/hotel_room2.jpg"], likes: "803", comments: "2", caption: "الغرفة أحلى من الصور." },
  { id: 'f6', user: "mahmoud.jabr", time: "قبل أسبوع", place: "مقهى الدراسة", images: ["/img/ph/cafe_croissant.jpg"], likes: "377", comments: "2", caption: "ركن هادي للقراءة بعيد عن زحمة البلد.", verified: true },
  { id: 'f7', user: "ahmad.kh", time: "أمس", place: "مخالب وشوارب", images: ["/img/ph/pets_dog.jpg"], likes: "356", comments: "2", caption: "كل اشي لكلبي من محل واحد." },
  { id: 'f8', user: "hala.food", time: "قبل يومين", place: "محل الكنافة النابلسية", images: ["/img/ph/sw_halawa.jpg"], likes: "1,402", comments: "5", caption: "حلاوة الجبن… لازم تجربوها." },
  { id: 'f9', user: "mahmoud.jabr", time: "قبل أسبوعين", place: "سوق خان التجار", images: [{ src: "/assets/images/tatreez-rug.jpg", pos: "20% 50%", scale: 1.3 }], likes: "488", comments: "3", caption: "الصابون النابلسي… ريحة البلد.", verified: true },
  { id: 'f10', user: "majd.walks", time: "قبل 3 أيام", place: "دكان الألعاب", images: ["/img/ph/toys_blocks.jpg"], likes: "289", comments: "1", caption: "هدية عيد ميلاد ابن أختي جاهزة." },
  { id: 'f11', user: "omar.hm", time: "قبل 4 أيام", place: "بكسل بوينت", images: ["/img/ph/electronics.jpg"], likes: "274", comments: "2", caption: "غيّرت كل أجهزتي من هون… أسعار حلوة." },
  { id: 'f12', user: "mahmoud.jabr", time: "قبل شهر", place: "قهوة السطح", images: [{ src: "/assets/images/nablus-garden.jpg", pos: "90% 22%", scale: 1.8 }], likes: "1,730", comments: "3", caption: "الغروب من فوق جرزيم.", verified: true },
  { id: 'f13', user: "tariq.photo", time: "قبل 5 أيام", place: "فندق البستان", images: ["/img/ph/hotel_room1.jpg"], likes: "517", comments: "3", caption: "تفاصيل الغرفة 📷" },
  { id: 'f14', user: "hala.food", time: "قبل أسبوع", place: "حلويات الأفراح", images: ["/img/ph/sw_qatayef.jpg"], likes: "760", comments: "2", caption: "قطايف بالفستق." },
  { id: 'f15', user: "mahmoud.jabr", time: "قبل شهرين", place: "قهوة السطح", images: [{ src: "/assets/images/nablus-clock-tower.jpg", pos: "34% 42%", scale: 1.9 }], likes: "562", comments: "2", caption: "الأقواس الحجرية… كل زاوية لوحة.", verified: true },
  { id: 'f16', user: "rania.h", time: "قبل أسبوع", place: "مطعم بيت العيلة", images: ["/img/ph/food_salad.jpg"], likes: "330", comments: "1", caption: "سلطة غدا خفيفة." },
  { id: 'f17', user: "ahmad.kh", time: "قبل أسبوعين", place: "مخالب وشوارب", images: ["/img/ph/pets_acc.jpg"], likes: "198", comments: "1", caption: "إكسسوارات جديدة وصلت." },
  { id: 'f18', user: "sara.y", time: "قبل 4 ساعات", place: "قهوة السطح", images: [{ src: "/assets/images/nablus-clock-tower.jpg", pos: "72% 26%", scale: 2.2 }], likes: "842", comments: "3", caption: "جلسة السطح وقت الغروب — بتستاهل.", avatar: { src: "/assets/images/nablus-clock-tower.jpg", pos: "72% 26%", scale: 2.2 }, verified: true },
  { id: 'f19', user: "sara.y", time: "قبل أسبوعين", place: "حلويات الأفراح", images: ["/img/ph/sw_awameh.jpg"], likes: "655", comments: "3", caption: "عوّامة سخنة 🤍" },
  { id: 'f20', user: "omar.hm", time: "قبل 3 أسابيع", place: "دكان الألعاب", images: ["/img/ph/toys_pile.jpg"], likes: "211", comments: "1", caption: "زاوية الألعاب التعليمية." },
  { id: 'f21', user: "majd.walks", time: "قبل 3 أسابيع", place: "عالم المرح", images: ["/img/ph/play_area.jpg"], likes: "402", comments: "2", caption: "أحلى مكان لعيد ميلاد." },
  { id: 'f22', user: "nour.travels", time: "قبل شهر", place: "مطعم الفلافل الشعبي", images: ["/img/ph/food_tacos.jpg"], likes: "588", comments: "2", caption: "غدا مع الشباب." },
  { id: 'f23', user: "hala.food", time: "قبل شهر", place: "حلويات الأفراح", images: ["/img/ph/sw_ghraybeh.jpg"], likes: "470", comments: "2", caption: "غريبة بالفستق لضيافة العيد." },
  { id: 'f24', user: "tariq.photo", time: "قبل شهر", place: "فندق البستان", images: ["/img/ph/hotel_room2.jpg"], likes: "301", comments: "1", caption: "ليلة بالفندق." },
]

// Stories row on the home feed. `ring: 'close'` marks a close-friends story.
export const STORIES = [
  { user: 'sara.y', img: '/img/ph/hotel_pool.jpg', ring: 'close' },
  { user: 'hala.food', img: '/img/ph/sw_kunafa.jpg' },
  { user: 'nour.travels', img: '/img/ph/hotel_aerial.jpg' },
  { user: 'ahmad.kh', img: '/img/ph/pets_yellow.jpg' },
  { user: 'majd.walks', img: '/img/ph/toys_pile.jpg' },
  { user: 'tariq.photo', img: '/img/ph/play_area.jpg' },
  { user: 'omar.hm', img: '/img/ph/electronics.jpg' },
  { user: 'rania.h', img: '/img/ph/sw_maamoul.jpg' },
]

export const postById = (id) => FEED.find((p) => p.id === id)

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })

// Sample comment thread shown on posts (UC-SR-03) until comments come from the API.
export const SAMPLE_COMMENTS = [
  { id: 'c1', user: 'sara.y', photo: clock('72% 26%', 2.2), text: 'صورة بتجنن! وين بالضبط هاد؟', ago: '2 س' },
  { id: 'c2', user: 'ahmad.kh', photo: clock('50% 20%', 1.6), text: 'أحلى مكان بالبلدة القديمة', ago: '5 س' },
  { id: 'c3', user: 'nour.travels', photo: { src: '/assets/images/nablus-garden.jpg', pos: '90% 22%', scale: 1.8 }, text: 'لازم نروح سوا الويكند الجاي', ago: '1 ي' },
]
