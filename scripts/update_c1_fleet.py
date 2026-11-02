import sys

NEW_FLEET_CODE = """const Z8_FLEET = [
  {
    id: 'z8-tank',
    name: 'Z8 Tank High-Speed',
    code: 'DB018',
    tag: '+53,3%',
    marginPct: '34,8%',
    wholesale: 7500,
    retail: 11500,
    profit: 4000,
    power: '2000W High Torque (Controlador 15G)',
    range: 'Até 60-70 km (Suporta até 60V 125Ah / 240 km)',
    cnh: 'CNH A // Emplacável',
    baseImg: '/assets/models/z8_tank_studio.jpg',
    colors: [
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank_amber.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank_black.jpg' },
      { name: 'Titanium Matte', hex: '#7C8288', img: '/assets/models/z8_tank_titanium.jpg' }
    ]
  },
  {
    id: 'z8-tank-2',
    name: 'Z8 Tank 2 Expedition',
    code: 'DB018-T2',
    tag: '+47,1%',
    marginPct: '32,0%',
    wholesale: 8500,
    retail: 12500,
    profit: 4000,
    power: '2000W High Torque Sem Escova (Controlador 15G)',
    range: 'Até 70 km (Suporta até 60V 125Ah / 240 km)',
    cnh: 'CNH A // Trail Expedition',
    baseImg: '/assets/models/z8_tank2_studio.jpg',
    colors: [
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank2_amber.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank2_black.jpg' },
      { name: 'Glacier White', hex: '#F0F2F5', img: '/assets/models/z8_tank2_white.jpg' }
    ]
  },
  {
    id: 'z8-fx10',
    name: 'Z8 FX-10 Sport',
    code: 'DB043',
    tag: '+34,3%',
    marginPct: '25,6%',
    wholesale: 6700,
    retail: 9000,
    profit: 2300,
    power: '1500W Brushless High Speed (Módulo 12G-38A)',
    range: 'Até 40-50 km (Bateria 60V 20Ah)',
    cnh: 'Autopropelido // Urbano',
    baseImg: '/assets/models/z8_fx10_studio.jpg',
    colors: [
      { name: 'Cyber Silver', hex: '#8A929A', img: '/assets/models/z8_fx10_studio.jpg' },
      { name: 'Stealth Black', hex: '#15171A', img: '/assets/models/z8_fx10_black.jpg' },
      { name: 'Glacier White', hex: '#F0F2F5', img: '/assets/models/z8_fx10_white.jpg' }
    ]
  },
  {
    id: 'z8-fx12',
    name: 'Z8 FX-12 Sport',
    code: 'DB043-FX12',
    tag: '+35,9%',
    marginPct: '26,4%',
    wholesale: 7800,
    retail: 10600,
    profit: 2800,
    power: '2000W Brushless High Speed (Módulo 12G-38A)',
    range: 'Até 50-60 km (Bateria Lítio 60V 125Ah)',
    cnh: 'CNH A // Sport Touring',
    baseImg: '/assets/models/z8_fx12_studio.jpg',
    colors: [
      { name: 'Lava Orange', hex: '#E65100', img: '/assets/models/z8_fx12_orange.jpg' },
      { name: 'Cyber Silver', hex: '#8A929A', img: '/assets/models/z8_fx12_silver.jpg' },
      { name: 'Stealth Black', hex: '#15171A', img: '/assets/models/z8_fx12_black.jpg' }
    ]
  },
  {
    id: 'z8-harley',
    name: 'Z8 Harley X12 Custom',
    code: 'XB-024',
    tag: '+53,8%',
    marginPct: '35,0%',
    wholesale: 6500,
    retail: 10000,
    profit: 3500,
    power: '1200W 27H (Controlador 30A)',
    range: 'Até 40 km (Lítio 60V 20Ah Removível)',
    cnh: 'Isento CNH // CONTRAN 996',
    baseImg: '/assets/models/z8_harley_studio.jpg',
    colors: [
      { name: 'Crimson Red', hex: '#A6192E', img: '/assets/models/z8_harley_crimson.jpg' },
      { name: 'Brushed Silver', hex: '#B4B9BE', img: '/assets/models/z8_harley_silver.jpg' }
    ]
  },
  {
    id: 'z8-u2',
    name: 'Z8 U2 Delivery Cargo',
    code: 'XB-010',
    tag: '+58,3%',
    marginPct: '36,8%',
    wholesale: 6000,
    retail: 9500,
    profit: 3500,
    power: '2000W Brushless Heavy-Duty (Módulo 12G)',
    range: 'Até 40-50 km (Suporta 48V-60V-72V)',
    cnh: 'Frota Logística // B2B',
    baseImg: '/assets/models/z8_u2_studio.jpg',
    colors: [
      { name: 'Cargo Black', hex: '#1A1C1E', img: '/assets/models/z8_u2_black.jpg' },
      { name: 'Fleet White', hex: '#F3F5F7', img: '/assets/models/z8_u2_white.jpg' }
    ]
  },
  {
    id: 'z8-n95c',
    name: 'Z8 N95C Max Comfort',
    code: 'DB039',
    tag: '+53,8%',
    marginPct: '35,0%',
    wholesale: 6500,
    retail: 10000,
    profit: 3500,
    power: '1200W 27H (Controlador 30A)',
    range: 'Até 40-50 km (Bateria 60V 20Ah)',
    cnh: 'CONTRAN 996 // Executiva',
    baseImg: '/assets/models/z8_n95c_studio.jpg',
    colors: [
      { name: 'Obsidian Black', hex: '#141518', img: '/assets/models/z8_n95c_black.jpg' },
      { name: 'Pearl White', hex: '#EAECEF', img: '/assets/models/z8_n95c_white.jpg' }
    ]
  },
  {
    id: 'z8-n7',
    name: 'Z8 H26 Standard',
    code: 'DB001',
    tag: '+72,7%',
    marginPct: '42,1%',
    wholesale: 5500,
    retail: 9500,
    profit: 4000,
    power: '1200W sem escova (Controlador 12G-33A)',
    range: 'Até 40-50 km (Bateria 60V 20Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_n7_studio.jpg',
    colors: [
      { name: 'Onyx Black', hex: '#181A1D', img: '/assets/models/z8_n7_black.jpg' },
      { name: 'Silver Mist', hex: '#8A929A', img: '/assets/models/z8_n7_silver.jpg' }
    ]
  },
  {
    id: 'z8-q11',
    name: 'Z8 Q11 Compact',
    code: 'DB043-Q11',
    tag: '+78,8%',
    marginPct: '44,1%',
    wholesale: 5200,
    retail: 9300,
    profit: 4100,
    power: '1000W (Controlador 9G)',
    range: 'Até 40-50 km (Bateria 60V 20Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_q10_studio.jpg',
    colors: [
      { name: 'Pastel Sage', hex: '#769482', img: '/assets/models/z8_q10_green.jpg' },
      { name: 'Onyx Black', hex: '#1A1C1E', img: '/assets/models/z8_q10_black.jpg' }
    ]
  },
  {
    id: 'z8-n710',
    name: 'Z8 N710 Urban Plus',
    code: 'DB045-N710',
    tag: '+79,2%',
    marginPct: '44,2%',
    wholesale: 5300,
    retail: 9500,
    profit: 4200,
    power: '1200W sem escova High Performance',
    range: 'Até 40-50 km (Bateria 60V 20Ah)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_n710_studio.jpg',
    colors: [
      { name: 'British Emerald', hex: '#1E4D3B', img: '/assets/models/z8_n710_green.jpg' },
      { name: 'Piano Black', hex: '#141619', img: '/assets/models/z8_n710_black.jpg' },
      { name: 'Pearl White', hex: '#F2F4F7', img: '/assets/models/z8_n710_white.jpg' }
    ]
  },
  {
    id: 'z8-q10',
    name: 'Z8 Q10 Vintage',
    code: 'DB038',
    tag: '+69,0%',
    marginPct: '40,8%',
    wholesale: 5800,
    retail: 9800,
    profit: 4000,
    power: '1200W (Controlador 30A)',
    range: 'Até 40-50 km (Suporta até 60V 120Ah / 240 km)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_q11_studio.jpg',
    colors: [{ name: 'Pastel Cream', hex: '#E5DEC9', img: '/assets/models/z8_q11_studio.jpg' }]
  },
  {
    id: 'z8-gs005',
    name: 'Z8 GS-005 Base Norte',
    code: 'GS-005',
    tag: '+93,8%',
    marginPct: '48,4%',
    wholesale: 3200,
    retail: 6200,
    profit: 3000,
    power: '500W Cobre Puro (Controlador 6G-NEW)',
    range: 'Até 40-50 km (Bateria 48V 20Ah / Suporta 60V)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_gs005_studio.jpg',
    colors: [{ name: 'Matte Graphite', hex: '#344054', img: '/assets/models/z8_gs005_studio.jpg' }]
  },
  {
    id: 'z8-diamond',
    name: 'Z8 Diamond Luxe',
    code: 'GS-052',
    tag: '+100,0%',
    marginPct: '50,0%',
    wholesale: 3400,
    retail: 6800,
    profit: 3400,
    power: '500W Cobre Puro (Controlador 500W)',
    range: 'Até 40-50 km (Bateria 48V 20Ah / Suporta 60V)',
    cnh: '100% Isento CNH // 996',
    baseImg: '/assets/models/z8_diamond_studio.jpg',
    colors: [{ name: 'Diamond Silver', hex: '#D0D5DD', img: '/assets/models/z8_diamond_studio.jpg' }]
  }
];"""

with open('conceito/app.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx_start = c.find('const Z8_FLEET = [')
idx_end = c.find('];', idx_start) + 2

if idx_start != -1 and idx_end != -1:
    c = c[:idx_start] + NEW_FLEET_CODE + c[idx_end:]
    with open('conceito/app.js', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated Z8_FLEET in conceito/app.js with all 13 models")
else:
    print("Could not find Z8_FLEET in conceito/app.js")
