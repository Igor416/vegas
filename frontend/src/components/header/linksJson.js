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
    'MATTRESSES': {
      'All Mattresses;Mattress/all': [],
      'Collections;Mattress/collection': [
        'Mattresses Modern',
        'Mattresses Exclusive',
        'Mattresses Comfort',
        'Mattresses Ecolatex',
        'Mattresses Active',
        'Mattresses Practic',
        'Mattresses Esleep',
        'Vegas Kids'
      ],
      'Springless;Mattress/springless': [
        'All springless Mattresses',
        'Mattresses with latex'
      ],
      'By springlocks;Mattress/springblock': [
        'Independent springs',
        '7-zonal block Medizone'
      ],
      'By age;Mattress/age': [
        'Mattresses for children',
        'Mattresses for teenagers',
        'Mattresses for adults'
      ],
      'By rigidity levels and materials;Mattress/rigidity': [
        'Hard mattresses',
        'Medium firm mattresses',
        'Soft mattresses',
        'Non-symmetrical Mattresses',
        'Mattresses with latex',
        'Mattresses with coconut coir',
        'Mattresses with memory effect'
      ],
      'Popular sizes;Mattress/sizes': [
        'Mattresses 80 x 190',
        'Mattresses 80 x 200',
        'Mattresses 90 x 190',
        'Mattresses 90 x 200',
        'Mattresses 140 x 200',
        'Mattresses 160 x 200',
        'Mattresses 180 x 200'
      ] //english x (eks)
    },
    'PILLOWS': {
      'All pillows;Pillow/all': [],
      'By types and forms;Pillow/types and forms': [
        'Classic form',
        'Ergonomic form with rollers',
        'Others',
        'Pillows for pregnants'
      ],
      'By materials;Pillow/materials': [
        'With latex',
        'Made from foam with memory effect Memory Foam',
        'Pillows with cooling gel'
      ],
      'By age;Pillow/age': [
        'Pillows for children',
        'Pillows for teenagers',
        'Pillows for adults'
      ],
      'Special pillows;Pillow/special': [
        'Pillow Beauty for beauty and youngness',
        'Pillow Baby Boom for pregnants and breastfeeding',
        'Pillow Travel for trips'
      ]
    },
    'ACCESSORIES': {
      'Mattress Pads;MattressPad': [
        'Transform',
        'Protect'
      ],
      'Blankets;Blankets': [
        'Blankets Bamboo',
        'Blankets SumWin',
        'Sheep\'s wool'
      ],
      'Bedsheets;BedSheets/all': [],
      'BedSpreads': []
    },
    'FOR KIDS': {
      'Mattresses;Mattress/children': [
        'All Mattresses for children',
        'With springs',
        'Springless'
      ],
      'Beds;Bed/children': [],
      'Mattress pads;MattressPad/children': [],
      'Pillows for children;Pillow/children': [],
      'Blankets for children;Blanket/children': [
        'All child Blankets',
        'Light blanket',
        'All season blanket',
        'Insulated blanket',
        'Blanket double (2 in 1)'
      ]
    },
    'FURNITURE': {
      'Beds;Beds': [
        'All beds',
        'Wooden beds',
        'Beds with soft upholstery',
        'Beds for children'
      ],
      'Stands for beds;Stand': [
        'Wooden stands',
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
      'Basis \'Lux\';Basis/Lux': [],
      'Basis \SuperLux\';Basis/SuperLux': [],
      'Basis \'Premium\';Basis/Premium': []
    },
    'SHOPS': Shops
  },
  ru: {
    'МАТРАСЫ': {
      'Все матрасы;Mattress/all': [],
      'Коллекции;Mattress/collection': [
        'Матрасы Modern',
        'Матрасы Exclusive',
        'Матрасы Comfort',
        'Матрасы Ecolatex',
        'Матрасы Active',
        'Матрасы Practic',
        'Матрасы Esleep',
        'Vegas Kids'
      ],
      'Беспружинные;Mattress/springless': [
        'Все беспружинные матрасы',
        'Латексные матрасы'
      ],
      'На основе пружинных блоков;Mattress/springblock': [
        'Независимые пружины',
        '7-зональный блок Medizone'
      ],
      'Возрастная категория;Mattress/age': [
        'Матрасы для детей',
        'Матрасы для подростков',
        'Матрасы для взрослых'
      ],
      'Степень жесткости и материалы;Mattress/rigidity': [
        'Жесткие матрасы',
        'Матрасы средней жесткости',
        'Мягкие матрасы',
        'Несимметричные матрасы',
        'Матрасы с латексом',
        'Матрасы с кокосовой койрой',
        'Матрасы с эффектом «памяти»'
      ],
      'Популярные размеры;Mattress/sizes': [
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
      'Все Подушки;Pillow/all': [],
      'По типам и форме;Pillow/types and forms': [
        'Классическая форма',
        'Эргономичная форма с валиками',
        'Прочие Подушки',
        'Подушка для беременных'
      ],
      'По материалам;Pillow/materials': [
        'Из латекса',
        'Из пены с эффектом «памяти» Memory Foam',
        'Подушки с охлаждающим гелем'
      ],
      'Возрастная категория;Pillow/age': [
        'Подушки для детей',
        'Подушки для подростков',
        'Подушки для взрослых'
      ],
      'Специальные Подушки;Pillow/special': [
        'Подушка Beauty для красоты и молодости',
        'Подушка Baby Boom для беременных и кормления',
        'Подушка Travel для путешествий'
      ]
    },
    'АКСЕССУАРЫ': {
      'Наматрассники;MattressPad': [
        'Transform',
        'Protect'
      ],
      'Одеяла;Blankets': [
        'Одеяла Bamboo',
        'Одеяла SumWin',
        'Овечья Шерсть',
        
      ],
      'Постельное белье;BedSheets/all': [],
      'Покрывала': []
    },
    'ДЕТЯМ': {
      'Матрасы;Mattress/children': [
        'Все матрасы для детей',
        'Пружинные',
        'Беспружинные'
      ],
      'Кровати;Bed/children': [],
      'Детские наматрасники;MattressPad/children': [],
      'Подушки для детей;Pillow/children': [],
      'Одеяла для детей;Blanket/children': [
        'Все детские одеяла',
        'Легкое одеяло',
        'Всесезонное одеяло',
        'Утепленное одеяло',
        'Одеяло двойное (2 в 1)'
      ]
    },
    'МЕБЕЛЬ': {
      'Кровати;Beds': [
        'Все кровати',
        'Деревянные кровати',
        'Кровати с мягкой обивкой',
        'Кровати для детей'
      ],
      'Тумбы прикроватные;Stand': [
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
      'Основание Люкс;Basis/Lux': [],
      'Основание СуперЛюкс;Basis/SuperLux': [],
      'Основание Премиум;Basis/Premium': []
    },
    'МАГАЗИНЫ': Shops
  },
  ro: {
    'SALTELE': {
      'Toate Saltele;Mattress/all': [],
      'Colecții;Mattress/collection': [
        'Saltele Modern',
        'Saltele Exclusive',
        'Saltele Comfort',
        'Saltele Ecolatex',
        'Saltele Active',
        'Saltele Practic',
        'Saltele Esleep',
        'Vegas Kids'
      ],
      'Fără arcuri;Mattress/springless': [
        'Toate saltele fără arcuri',
        'Saltele din latex'
      ],
      'Pe bază blocuri cu arc;Mattress/springblock': [
        'Arcuri independente',
        'Medizone bloc cu 7 zone'
      ],
      'Pe baza vârstei;Mattress/age': [
        'Saltele pentru copii',
        'Saltele pentru adolescenți',
        'Saltele pentru adulți'
      ],
      'Pe baza rigidității și materialelor;Mattress/rigidity': [
        'Saltele dure',
        'Saltele fermitate medie',
        'Saltele moi',
        'Saltele asimetrice',
        'Saltele cu latex',
        'Saltele cu nucă de cocos',
        'Saltele Memory'
      ],
      'Dimensiuni populare;Mattress/sizes': [
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
      'Toate pernele;Pillow/all': [],
      'După tipuri și formă;Pillow/types and forms': [
        'Forma classica',
        'Formă ergonomică cu suporturi',
        'Alte Perne',
        'Perne pentru femeile insarcinate'
      ],
      'Pe bază materialelor;Pillow/materials': [
        'Din latex',
        'Spumă cu memorie "Memory Foam"',
        'Perne cu gel răcoritor'
      ],
      'Pe baza vârstei;Pillow/age': [
        'Saltele pentru copii',
        'Saltele pentru adolescenți',
        'Saltele pentru adulți'
      ],
      'Perne speciale;Pillow/special': [
        'Perna Beauty pentru frumusețe si tinirețe',
        'Perna Baby Boom pentru femeile insarcinate si alăptare',
        'Perna Travel pentru călătorie'
      ]
    },
    'ACCESORII': {
      'Huse;MattressPad': [
        'Transform',
        'Protect'
      ],
      'Plapume;Blankets': [
        'Plapume Bamboo',
        'Plapume SumWin',
        'Lână de oaie'
      ],
      'Cearceafuri;BedSheets/all': [],
      'Cuverturi de pat': []
    },
    'PENTRU COPII': {
      'Saltele;Mattress/children': [
        'Toate saltelele pentru copii',
        'Cu arcuri',
        'Fără arcuri'
      ],
      'Paturi;Bed/children': [],
      'Huse pentru copii;MattressPad/children': [],
      'Perne pentru copii;Pillow/children': [],
      'Plapume pentru copii;Blanket/children': [
        'Toate plapume pentru copii',
        'Plapuma ușoara',
        'Plapuma pentru orice vreme',
        'Plapuma captușita',
        'plapuma dublu (2 in 1)'
      ]
    },
    'MOBILA': {
      'Paturi;Beds': [
        'Toate paturile',
        'Paturi de lemn',
        'Paturi tapițate',
        'Paturi pentru copii'
      ],
      'Noptiere de pat;Stand': [
        'Noptiere de lemn',
        'Noptiere tapițate'
      ],
      'Sifonierele': [],
      'Canapele': [],
      'Altele': [
        'Mese',
        'Scaune'
      ]
    },
    'SOMIERE': {
      'Somiera Lux;Basis/Lux': [],
      'Somiera SuperLux;Basis/SuperLux': [],
      'Somiera Premium;Basis/Premium': []
    },
    'MAGAZINE': Shops
  }
}

export default CATEGORIES;