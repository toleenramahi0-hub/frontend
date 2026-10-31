// Place categories (SRS 1.1). `icon` is the SVG body drawn inside the category hero ring.
export const CATEGORIES = [
  {
    id: 'restaurants',
    label: 'مطاعم',
    blurb: 'أكلات نابلسية وشعبية ومطاعم للعيلة.',
    icon: <path d="M6 3v7M4 3v5a2 2 0 0 0 4 0V3M6 10v11M17 3c-2 0-3 2-3 6v3h3v9" />,
  },
  {
    id: 'cafes',
    label: 'مقاهي',
    blurb: 'قهوة، جلسات هادية وأماكن للدراسة والسهر.',
    icon: (
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3" />
    ),
  },
  {
    id: 'sweets',
    label: 'حلويات',
    blurb: 'كنافة، معمول، قطايف وكل الحلو النابلسي.',
    icon: <path d="M5 10h14l-2 10H7zM8 10V8a4 4 0 0 1 8 0v2" />,
  },
  {
    id: 'hotels',
    label: 'فنادق',
    blurb: 'إقامة مريحة بقلب نابلس وعلى الجبال.',
    icon: (
      <>
        <path d="M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6" />
        <circle cx="7" cy="11" r="1.6" />
      </>
    ),
  },
  {
    id: 'fun',
    label: 'ملاهي',
    blurb: 'ألعاب وترفيه للأطفال والعيلة.',
    icon: <path d="M3 11a9 9 0 0 1 18 0zM12 11v10M9 21h6" />,
  },
  {
    id: 'toys',
    label: 'ألعاب',
    blurb: 'محلات ألعاب وهدايا للأطفال.',
    icon: <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" />,
  },
  {
    id: 'gifts',
    label: 'هدايا',
    blurb: 'صناديق هدايا، تطريز وصابون نابلسي.',
    icon: (
      <>
        <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
        <path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.5 7.5 7.2 8.2 8.5 12 8.5 12 8.5zM12 8.5c1.5-4.5 5.5-4 4.5-1.3-.7 1.3-4.5 1.3-4.5 1.3z" />
      </>
    ),
  },
  {
    id: 'pets',
    label: 'حيوانات أليفة',
    blurb: 'أكل، إكسسوارات وعناية لحيوانك.',
    icon: (
      <>
        <circle cx="7" cy="10" r="1.8" />
        <circle cx="10.5" cy="6.5" r="1.8" />
        <circle cx="14.5" cy="6.5" r="1.8" />
        <circle cx="18" cy="10" r="1.8" />
        <path d="M8 17.5c0-2.5 2-4.5 4-4.5s4 2 4 4.5c0 1.6-1.4 2.5-4 2.5s-4-.9-4-2.5z" />
      </>
    ),
  },
  {
    id: 'electronics',
    label: 'إلكترونيات',
    blurb: 'أجهزة، إكسسوارات وصيانة.',
    icon: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 17.5h2" />
      </>
    ),
  },
]

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id)
export const categoryLabel = (id) => categoryById(id)?.label ?? ''
