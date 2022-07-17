const Shops = {
  'Call center': [
    '079407032'
  ],
  'CC Jumbo Showroom': [
    'Mun. Chișinău, bd. Decebal 23/1',
    '078 505 520'
  ],
  'Magazin Vegas': [
    'Mun. Chișinău, str. Kiev 16/1',
    '079 440 057'
  ],
  'Showroom Creangă': [
    'Mun Chișinău, str. Ion Crengă 5/3',
    '079 840 444'
  ],
  'Showroom Ciocana': [
    'Mun Chișinău, str. Zelinski 7',
    '079 407 022'
  ]
}

const CATEGORIES =  {
  en: {
    'MATTRASSES': {
      'All Mattrasses;Mattrass/all': [],
      'Collections;Mattrass/collection': [
        'Mattrasses Modern',
        'Mattrasses Exclusive',
        'Mattrasses Comfort',
        'Mattrasses Ecolatex',
        'Mattrasses Active',
        'Mattrasses Practic',
        'Mattrasses Esleep',
        'Vegas Kids'
      ],
      'Springless;Mattrass/springless': [
        'All springless Mattrasses',
        'Mattrasses with latex',
        'Mattrasses in roll packaging'
      ],
      'By springlocks;Mattrass/springblock': [
        'Independent springs',
        '7-zonal block Medizone'
      ],
      'By age;Mattrass/age': [
        'Mattrasses for children',
        'Mattrasses for teenagers',
        'Mattrasses for adults'
      ],
      'By rigidity levels and materials;Mattrass/rigidity': [
        'Hard Mattrasses',
        'Mattrasses semi-hard',
        'Soft Mattrasses',
        'Non-symmetrical Mattrasses',
        'Mattrasses with latex',
        'Mattrasses with coconut coir',
        'Mattrasses with memory effect'
      ],
      'Popular sizes;Mattrass/sizes': [
        'Mattrasses 80 x 190',
        'Mattrasses 80 x 200',
        'Mattrasses 90 x 190',
        'Mattrasses 90 x 200',
        'Mattrasses 140 x 200',
        'Mattrasses 160 x 200',
        'Mattrasses 180 x 200'
      ] //english x (eks)
    },
    'PILLOWS': {
      'All pillows': [],
      'By types and forms': [
        'Classic form',
        'Ergonomic form with rollers',
        'Others',
        'Pillows for pregnants'
      ],
      'By materials': [
        'With latex',
        'Made from foam with memory effect Memory Foam',
        'Pillows with cooling gel'
      ],
      'By age;Mattrass/age': [
        'Pillows for children',
        'Pillows for teenagers',
        'Pillows for adults'
      ],
      'Special pillows': [
        'Pillow Beauty for beauty and youngness',
        'Pillow Baby Boom for pregnants and breastfeeding',
        'Pillow Travel for trips'
      ]
    },
    'ACCESSORIES': {
      'Mattrass Pads': [
        'Transform',
        'Protect'
      ],
      'Blankets': [
        'Blankets Bamboo',
        'Blankets SumWin',
        'Sheep\'s wool'
      ],
      'Bedsheets': [],
      'Bedspreads': []
    },
    'FOR KIDS': {
      'Mattrasses': [
        'All Mattrasses for children',
        'With springs',
        'Springless'
      ],
      'Beds': [],
      'Child mattrass pads': [],
      'Pillows for children': [],
      'Blankets for children': [
        'All child Blankets',
        'Light blanket',
        'All season blanket',
        'Insulated blanket',
        'Blanket double (2 in 1)'
      ]
    },
    'FURNITURE': {
      'Beds': [
        'All beds',
        'Wooden beds',
        'Beds with soft upholstery',
        'Beds for children'
      ],
      'Stands for beds': [
        'Wooedn stands',
        'Stands with soft upholstery'
      ],
      'Dressers': [],
      'Sofas': [],
      'Others': [
        'Tables',
        'Chairs'
      ]
    },
    'BASISES': {
      'Basis \'Lux\'': [],
      'Basis \SuperLux\'': [],
      'Basis \'Premium\'': []
    },
    'SHOPS': Shops
  },
  ru: {
    'МАТРАСЫ': {
      'Все матрасы;Mattrass/all': [],
      'Коллекции;Mattrass/collection': [
        'Матрасы Modern',
        'Матрасы Exclusive',
        'Матрасы Comfort',
        'Матрасы Ecolatex',
        'Матрасы Active',
        'Матрасы Practic',
        'Матрасы Esleep',
        'Vegas Kids'
      ],
      'Беспружинные;Mattrass/springless': [
        'Все беспружинные матрасы',
        'Латексные матрасы',
        'Матрасы в рулонной упаковке'
      ],
      'На основе пружинных блоков;Mattrass/springblock': [
        'Независимые пружины',
        '7-зональный блок Medizone'
      ],
      'Возрастная категория;Mattrass/age': [
        'Матрасы для детей',
        'Матрасы для подростков',
        'Матрасы для взрослых'
      ],
      'Степень жесткости и материалы;Mattrass/rigidity': [
        'Жесткие матрасы',
        'Матрасы средней жесткости',
        'Мягкие матрасы',
        'Несимметричные матрасы',
        'Матрасы с латексом',
        'Матрасы с кокосовой койрой',
        'Матрасы с эффектом «памяти»'
      ],
      'Популярные размеры;Mattrass/sizes': [
        'Матрасы 80 x 190',
        'Матрасы 80 x 200',
        'Матрасы 90 x 190',
        'Матрасы 90 x 200',
        'Матрасы 140 x 200',
        'Матрасы 160 x 200',
        'Матрасы 180 x 200'
      ] //english x (eks)
    },
    'ПОДУШКИ': {
      'Все Подушки': [],
      'По типам и форме': [
        'Классическая форма',
        'Эргономичная форма с валиками',
        'Прочие Подушки',
        'Подушка для беременных'
      ],
      'По материалам': [
        'Из латекса',
        'Из пены с эффектом «памяти» Memory Foam',
        'Подушки с охлаждающим гелем'
      ],
      'Возрастная категория': [
        'Матрасы для детей',
        'Матрасы для подростков',
        'Матрасы для взрослых'
      ],
      'Специальные Подушки': [
        'Подушка Beauty для красоты и молодости',
        'Подушка Baby Boom для беременных и кормления',
        'Подушка Travel для путешествий'
      ]
    },
    'АКСЕССУАРЫ': {
      'Наматрассники': [
        'Transform',
        'Protect'
      ],
      'Одеяла': [
        'Одеяла Bamboo',
        'Одеяла SumWin',
        'Овечья Шерсть',
        
      ],
      'Постельное белье': [],
      'Покрывала': []
    },
    'ДЕТЯМ': {
      'Матрасы': [
        'Все матрасы для детей',
        'Пружинные',
        'Беспружинные'
      ],
      'Кровати': [],
      'Детские наматрасники': [],
      'Pillows для детей': [],
      'Одеяла для детей': [
        'Все детские одеяла',
        'Легкое одеяло',
        'Всесезонное одеяло',
        'Утепленное одеяло',
        'Одеяло двойное (2 в 1)'
      ]
    },
    'МЕБЕЛЬ': {
      'Кровати': [
        'Все кровати',
        'Деревянные кровати',
        'Кровати с мягкой обивкой',
        'Кровати для детей'
      ],
      'Тумбы прикроватные': [
        'Тумбы из дерева',
        'Тумбы с мягкой обивкой'
      ],
      'Комоды': [],
      'Диваны': [],
      'Другие предметы мебели': [
        'Столы',
        'Стулья'
      ]
    },
    'ОСНОВАНИЯ': {
      'Основание Люкс': [],
      'Основание СуперЛюкс': [],
      'Основание Премиум': []
    },
    'МАГАЗИНЫ': Shops
  },
  ro: {
    'SALTELE': {
      'Toate Saltele;Mattrass/all': [],
      'Colectii;Mattrass/collection': [
        'Saltele Modern',
        'Saltele Exclusive',
        'Saltele Comfort',
        'Saltele Ecolatex',
        'Saltele Active',
        'Saltele Practic',
        'Saltele Esleep',
        'Vegas Kids'
      ],
      'Fara arcuri;Mattrass/springless': [
        'Toate saltele fara arcuri',
        'Saltele din latex',
        'Saltele in ambalaj rulou'
      ],
      'Dupa blocuri de arcuri ;Mattrass/springblock': [
        'Arcuri independenti',
        'Bloc Medizone cu 7 zone'
      ],
      'Dupa varsta;Mattrass/age': [
        'Saltele pentru copii',
        'Saltele pentru adolescenti',
        'Saltele pentru adultii'
      ],
      'Dupa duritatea si materiale;Mattrass/rigidity': [
        'Saltele greu',
        'Saltele semi-greu',
        'Saltele moale',
        'Saltele asimetric',
        'Saltele cu latex',
        'Saltele cu nuca de cocos',
        'Saltele cu efect de memorie'
      ],
      'Dimensiuni populare;Mattrass/sizes': [
        'Saltele 80 x 190',
        'Saltele 80 x 200',
        'Saltele 90 x 190',
        'Saltele 90 x 200',
        'Saltele 140 x 200',
        'Saltele 160 x 200',
        'Saltele 180 x 200'
      ] //english x (eks)
    },
    'PERNE': {
      'Toate Perne': [],
      'Dupa tipuri si forme': [
        'Forma classica',
        'Forma ergonomica cu suporturi',
        'Alte Perne',
        'Perne pentru femeile insarcinate'
      ],
      'Dupa materiale': [
        'Din latex',
        'Dim spuma cu efect de memorie Memory Foam',
        'Perne cu gel de racire'
      ],
      'Dupa varsta': [
        'Saltele pentru copii',
        'Saltele pentru adolescenti',
        'Saltele pentru adultii'
      ],
      'Perne speciale': [
        'Perna Beauty pentru frumusete si tinirete',
        'Perna Baby Boom pentru femeile insarcinate si alaptare',
        'Perna Travel pentru calatorii'
      ]
    },
    'ACCESORII': {
      'Huse': [
        'Transform',
        'Protect'
      ],
      'Plapume': [
        'Plapume Bamboo',
        'Plapume SumWin',
        'Lana de oaie',
        
      ],
      'Lenjerie de pat': [],
      'Cuverturi de pat': []
    },
    'Pentru copii': {
      'Saltele': [
        'Toate Saltele pentru copii',
        'Cu arcuri',
        'Fara arcuri'
      ],
      'Paturi': [],
      'Huse pentru copii': [],
      'Perne pentru copii': [],
      'Plapume pentru copii': [
        'Toate plapume pentru copii',
        'Plapuma usoara',
        'Plapuma pentru to sezonul',
        'Plapuma captusita',
        'plapuma dublu (2 in 1)'
      ]
    },
    'MOBILA': {
      'Paturi': [
        'Toate Paturile',
        'Paturi de lemn',
        'Paturi cu tapiterie moale',
        'Paturi pentru copii'
      ],
      'Noptiere de pat': [
        'Noptiere de lemn',
        'Noptiere cu tapiterie moale'
      ],
      'Sifonierele': [],
      'Canapele': [],
      'Altele': [
        'Mese',
        'Scaune'
      ]
    },
    'SOMIERE': {
      'Somiera Lux': [],
      'Somiera SuperLux': [],
      'Somiera Premium': []
    },
    'MAGAZINE': Shops
  }
}

export default CATEGORIES;