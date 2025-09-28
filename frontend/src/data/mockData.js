// Mock data for NEXX store - JCB tractor parts

export const categories = [
  {
    id: 1,
    name: "Система",
    slug: "sistema",
    image: "/images/categories/sistema.jpg",
    subcategories: [
      { id: 11, name: "Двигатель и компоненты", slug: "dvigatel-i-komponenty" },
      { id: 12, name: "Система охлаждения", slug: "sistema-okhlazhdeniya" },
      { id: 13, name: "Гидравлика", slug: "gidravlika" },
      { id: 14, name: "Трансмиссия и ходовая часть", slug: "transmissiya-i-khodovaya-chast" },
      { id: 15, name: "Тормозная система и рулевое управление", slug: "tormoznaya-sistema-i-rulevoe-upravlenie" },
      { id: 16, name: "Топливная система", slug: "toplivnaya-sistema" },
      { id: 17, name: "Электрика и освещение", slug: "elektrika-i-osveshchenie" }
    ]
  },
  {
    id: 2,
    name: "JCB",
    slug: "jcb",
    image: "/images/categories/jcb.jpg",
    subcategories: [
      { id: 21, name: "Запчасти для двигателя", slug: "zapchasti-dlya-dvigatelya" },
      { id: 22, name: "Ходовая часть", slug: "khodovaya-chast" },
      { id: 23, name: "Электрика и электроника", slug: "elektrika-i-elektronika" },
      { id: 24, name: "Гидравлика", slug: "gidravlika" },
      { id: 25, name: "Запчасти для трансмиссии", slug: "zapchasti-dlya-transmissii" }
    ]
  },
  {
    id: 3,
    name: "PERKINS",
    slug: "perkins",
    image: "/images/categories/perkins.jpg",
    subcategories: [
      { id: 31, name: "Болты", slug: "bolty" },
      { id: 32, name: "Вкладыши и втулки", slug: "vkladyshi-i-vtulki" },
      { id: 33, name: "Прокладки и сальники", slug: "prokladki-i-salniki" },
      { id: 34, name: "Поршня и шатуны", slug: "porshnya-i-shatuny" }
    ]
  },
  {
    id: 4,
    name: "CARRARO",
    slug: "carraro",
    image: "/images/categories/carraro.jpg",
    subcategories: [
      { id: 41, name: "Главные пары", slug: "glavnye-pary" },
      { id: 42, name: "Полуоси", slug: "poluosi" },
      { id: 43, name: "Тормозная система", slug: "tormoznaya-sistema" }
    ]
  }
];

export const products = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "ТНВД 320/06924 320/06738 320/06929 9323A261G ИНДИЯ JCB",
    slug: "tnvd-320-06924-jcb",
    sku: "320/06924",
    price: 185000,
    originalPrice: 210000,
    discount: 12,
    availability: "в наличии",
    stockLevel: "мало",
    rating: 4.8,
    reviewsCount: 24,
    categoryId: 2,
    subcategoryId: 21,
    brand: "JCB",
    country: "Индия",
    images: [
      "/images/products/tnvd-320-06924-1.jpg",
      "/images/products/tnvd-320-06924-2.jpg"
    ],
    description: "Топливный насос высокого давления для двигателей JCB. Оригинальная запчасть от производителя. Совместим с моделями 320/06738, 320/06929.",
    specifications: {
      "Артикул": "320/06924",
      "Совместимость": "JCB 3CX, 4CX",
      "Производитель": "JCB Original",
      "Страна производства": "Индия",
      "Гарантия": "12 месяцев"
    },
    tags: ["новинка", "популярное"]
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Коленвал 320/03336 320/03375 320/03196 JCB",
    slug: "kolenval-320-03336-jcb",
    sku: "320/03336",
    price: 95000,
    originalPrice: 115000,
    discount: 17,
    availability: "в наличии",
    stockLevel: "много",
    rating: 4.9,
    reviewsCount: 18,
    categoryId: 2,
    subcategoryId: 21,
    brand: "JCB",
    country: "Великобритания",
    images: [
      "/images/products/kolenval-320-03336-1.jpg"
    ],
    description: "Коленчатый вал для двигателей JCB. Высокое качество изготовления, точное соответствие оригинальным спецификациям.",
    specifications: {
      "Артикул": "320/03336",
      "Альтернативные артикулы": "320/03375, 320/03196",
      "Применимость": "Двигатели JCB 444",
      "Материал": "Высокопрочная сталь",
      "Гарантия": "18 месяцев"
    },
    tags: ["новинка", "хит"]
  },
  {
    id: 3,
    name: "Мотор печки с резистором 30/925975 30/925978 JCB",
    slug: "motor-pechki-30-925975-jcb",
    sku: "30/925975",
    price: 18500,
    originalPrice: 22000,
    discount: 16,
    availability: "в наличии",
    stockLevel: "много",
    rating: 4.6,
    reviewsCount: 12,
    categoryId: 2,
    subcategoryId: 23,
    brand: "JCB",
    country: "Великобритания",
    images: [
      "/images/products/motor-pechki-30-925975-1.jpg"
    ],
    description: "Электромотор отопителя кабины с встроенным резистором. Обеспечивает надежную работу системы обогрева.",
    specifications: {
      "Артикул": "30/925975",
      "Напряжение": "12V",
      "Мощность": "150W",
      "Совместимость": "JCB 3CX, 4CX, 5CX"
    },
    tags: ["новинка"]
  },
  {
    id: 4,
    name: "Подшипник ступичного вала 917/50200 NK45/30 TIMKEN",
    slug: "podshipnik-stupichnogo-vala-917-50200",
    sku: "917/50200",
    price: 12800,
    originalPrice: 15500,
    discount: 17,
    availability: "в наличии",
    stockLevel: "много",
    rating: 4.7,
    reviewsCount: 31,
    categoryId: 2,
    subcategoryId: 22,
    brand: "TIMKEN",
    country: "США",
    images: [
      "/images/products/podshipnik-917-50200-1.jpg"
    ],
    description: "Подшипник ступицы колеса от ведущего производителя TIMKEN. Высокая надежность и долговечность.",
    specifications: {
      "Артикул": "917/50200",
      "Размер": "NK45/30",
      "Производитель": "TIMKEN",
      "Тип": "Игольчатый подшипник"
    },
    tags: ["новинка", "рекомендуем"]
  },
  {
    id: 5,
    name: "Двигатель в сборе SD 68KW 444 TC 12V 320/41947 JCB АНГЛИЯ",
    slug: "dvigatel-v-sbore-sd-68kw-444-tc",
    sku: "320/41947",
    price: 580000,
    originalPrice: 650000,
    discount: 11,
    availability: "под заказ",
    stockLevel: "мало",
    rating: 4.9,
    reviewsCount: 8,
    categoryId: 2,
    subcategoryId: 21,
    brand: "JCB",
    country: "Великобритания",
    images: [
      "/images/products/dvigatel-320-41947-1.jpg",
      "/images/products/dvigatel-320-41947-2.jpg",
      "/images/products/dvigatel-320-41947-3.jpg"
    ],
    description: "Полностью собранный двигатель JCB 444 с турбонаддувом. Мощность 68 кВт, 12 вольт. Оригинальная английская сборка.",
    specifications: {
      "Артикул": "320/41947",
      "Мощность": "68 кВт (91 л.с.)",
      "Объем": "4.4 литра",
      "Цилиндры": "4",
      "Турбонаддув": "Есть",
      "Напряжение": "12V"
    },
    tags: ["хит", "премиум"]
  },
  {
    id: 6,
    name: "Фильтр масляный 02/100284 JCB",
    slug: "filtr-maslyanyj-02-100284-jcb",
    sku: "02/100284", 
    price: 1850,
    originalPrice: 2100,
    discount: 12,
    availability: "в наличии",
    stockLevel: "много",
    rating: 4.5,
    reviewsCount: 45,
    categoryId: 1,
    subcategoryId: 11,
    brand: "JCB",
    country: "Великобритания",
    images: [
      "/images/products/filtr-maslyanyj-02-100284-1.jpg"
    ],
    description: "Оригинальный масляный фильтр JCB для двигателей серии 444. Обеспечивает надежную фильтрацию моторного масла.",
    specifications: {
      "Артикул": "02/100284",
      "Тип": "Полнопоточный",
      "Совместимость": "JCB 3CX, 4CX",
      "Производитель": "JCB Original"
    },
    tags: ["расходники"]
  }
];

export const brands = [
  { id: 1, name: "JCB", logo: "/images/brands/jcb.png", slug: "jcb" },
  { id: 2, name: "PERKINS", logo: "/images/brands/perkins.png", slug: "perkins" },
  { id: 3, name: "CARRARO", logo: "/images/brands/carraro.png", slug: "carraro" },
  { id: 4, name: "HIDROMEK", logo: "/images/brands/hidromek.png", slug: "hidromek" },
  { id: 5, name: "TIMKEN", logo: "/images/brands/timken.png", slug: "timken" },
  { id: 6, name: "DONALDSON", logo: "/images/brands/donaldson.png", slug: "donaldson" },
  { id: 7, name: "FLEETGUARD", logo: "/images/brands/fleetguard.png", slug: "fleetguard" },
  { id: 8, name: "CATERPILLAR", logo: "/images/brands/caterpillar.png", slug: "caterpillar" }
];

export const featuredProducts = products.filter(p => p.tags.includes('хит') || p.tags.includes('новинка')).slice(0, 8);

export const banners = [
  {
    id: 1,
    title: "Оригинальные запчасти JCB",
    subtitle: "Прямые поставки от производителя",
    description: "Гарантия качества и надежности",
    image: "/images/banners/jcb-parts.jpg",
    link: "/catalog/jcb",
    buttonText: "Посмотреть каталог"
  },
  {
    id: 2,
    title: "Скидки до 30% на двигатели",
    subtitle: "Ограниченное предложение",
    description: "Только оригинальные запчасти",
    image: "/images/banners/engines-sale.jpg",
    link: "/catalog/sistema/dvigatel-i-komponenty",
    buttonText: "Купить со скидкой"
  }
];

export const reviews = [
  {
    id: 1,
    name: "Алексей М.",
    rating: 5,
    text: "Отличное качество запчастей, быстрая доставка. Заказываю здесь уже не первый раз.",
    date: "2024-12-20",
    productId: 1
  },
  {
    id: 2,
    name: "Владимир К.",
    rating: 5,
    text: "Профессиональный подход, помогли с подбором нужной детали. Рекомендую!",
    date: "2024-12-18",
    productId: 2
  },
  {
    id: 3,
    name: "Сергей Т.",
    rating: 4,
    text: "Хорошие цены, качественная упаковка. Доставка точно в срок.",
    date: "2024-12-15",
    productId: 1
  }
];

export const deliveryMethods = [
  {
    id: 1,
    name: "Курьерская доставка по Москве",
    price: 500,
    time: "1-2 дня",
    description: "Доставка курьером в пределах МКАД"
  },
  {
    id: 2,
    name: "Самовывоз",
    price: 0,
    time: "Сегодня",
    description: "Забрать со склада в Москве"
  },
  {
    id: 3,
    name: "Транспортная компания",
    price: 1200,
    time: "3-7 дней",
    description: "Доставка по всей России"
  }
];

export const paymentMethods = [
  {
    id: 1,
    name: "Банковская карта",
    description: "Visa, MasterCard, МИР",
    icon: "💳"
  },
  {
    id: 2,
    name: "Банковский перевод",
    description: "Для юридических лиц",
    icon: "🏦"
  },
  {
    id: 3,
    name: "Наличными при получении",
    description: "Оплата курьеру или в пункте выдачи",
    icon: "💵"
  }
];