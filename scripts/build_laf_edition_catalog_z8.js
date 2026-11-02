import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getBrowserPath() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'msedge';
}

const edgePath = getBrowserPath();
const pagesDir = path.resolve(rootDir, 'scratch', 'laf_z8_html_pages');
const outputImgDir = path.resolve(rootDir, 'public', 'assets', 'catalogo_laf_z8');

fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(outputImgDir, { recursive: true });

function toFileUrl(relPath) {
  const absPath = path.resolve(rootDir, relPath).replace(/\\/g, '/');
  return `file:///${absPath}`;
}

const logoMin = toFileUrl('public/assets/logos/logo minimalista.png');
const logoMain = toFileUrl('public/assets/logos/z8logo.png');

const models = [
  {
    page: 10,
    catShort: 'PERFORMANCE',
    catColor: '#F97316',
    pn: 'DB018',
    base: 'BASE NORTE (NORTHERN BASE)',
    chineseRef: '坦克高速电摩 // TANK HIGH-SPEED 2000W',
    shortTitle: 'Z8 TANK',
    fullName: 'Z8 TANK HIGH-SPEED 2000W TRAIL',
    leftHero: toFileUrl('public/assets/models/z8_tank_paulista_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image19.png'),
    lineupImg: toFileUrl('public/assets/models/z8_tank_minas_bodywork.jpg'),
    zoom1: toFileUrl('public/assets/models/z8_tank_paulista_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_tank_paulista_bodywork.jpg'),
    zoom3: toFileUrl('public/assets/models/z8_tank_minas_headlight.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_tank_amber.jpg'),
    wholesale: 'R$ 7.500,00',
    lote10: 'R$ 75.000,00',
    retail: 'R$ 11.500,00',
    profit: '+R$ 4.000,00 / un.',
    container40HQ: '85 pcs / 40HQ',
    packSize: '179 × 57 × 83 cm',
    voltage: '60V / 72V (Suporta Lítio até 60V 125Ah / 240 km)',
    row1: [
      { k: 'MOTOR', v1: '2000 W', v2: 'High Torque Sem Escova' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Suporta até 60V 125Ah' },
      { k: 'CONTROLADOR', v1: '15G Módulo', v2: '15 Tubos Alta Corrente' },
      { k: 'FREIO', v1: 'Duplo Disco Hidr.', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '110/70-12', v2: 'Textura Neve / Hot Melt' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 80 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: 'Bivolt 110-220V', v2: 'Homologado Inmetro' },
      { k: 'AUTONOMIA', v1: 'Até 70 km', v2: 'Até 240 km (c/ 125Ah)' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '179×57×83 cm', v2: '85 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Hidr. Reforçado D.', v2: 'Mola Damping Traseira' },
      { k: 'PESO s/ BAT.', v1: '80 kg (Líquido)', v2: '90 kg (Bruto)' },
      { k: 'NFC E ALARME', v1: 'Keyless NFC', v2: 'Controle Anti-Furto' }
    ]
  },
  {
    page: 11,
    catShort: 'PERFORMANCE',
    catColor: '#F97316',
    pn: 'DB043',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'FX 10寸 // FX-10 SPORT EDITION',
    shortTitle: 'FX-10 SPORT',
    fullName: 'Z8 FX-10 SPORT 1500W BRUSHLESS',
    leftHero: toFileUrl('public/assets/models/z8_fx10_sjc_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image15.png'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image16.png'),
    zoom1: toFileUrl('public/assets/models/z8_fx10_sjc_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_fx10_sjc_bodywork.jpg'),
    zoom3: toFileUrl('public/assets/models/z8_fx10_capivari_headlight.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_fx10_capivari_bodywork.jpg'),
    wholesale: 'R$ 6.700,00',
    lote10: 'R$ 67.000,00',
    retail: 'R$ 9.000,00',
    profit: '+R$ 2.300,00 / un.',
    container40HQ: '90 pcs / 40HQ',
    packSize: '162 × 50 × 85 cm',
    voltage: '60V 20Ah Lítio de Série (Recarga 4-8h)',
    row1: [
      { k: 'MOTOR', v1: '1500 W', v2: 'Brushless Sem Escova' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Alta Descarga' },
      { k: 'CONTROLADOR', v1: '12G-38A Módulo', v2: '38 Amperes Sport' },
      { k: 'FREIO', v1: 'Duplo Disco 180mm', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '130/60-10', v2: 'Pneu Vácuo Alargado' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 68 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: 'Recarga 4-8h', v2: 'Bivolt 110V-220V' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Uso Urbano Sport' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '162×50×85 cm', v2: '90 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Damping Traseira' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líquido)', v2: '70 kg (Bruto)' },
      { k: 'NFC E ALARME', v1: 'Alarme Remoto', v2: 'Painel Digital + USB' }
    ]
  },
  {
    page: 13,
    catShort: 'URBANA',
    catColor: '#00E5FF',
    pn: 'DB039',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'N95C // MAX COMFORT EXECUTIVE',
    shortTitle: 'N95C MAX',
    fullName: 'Z8 N95C MAX COMFORT 1200W EXECUTIVA',
    leftHero: toFileUrl('public/assets/models/z8_n95c_studio.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image9.png'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image10.jpeg'),
    zoom1: toFileUrl('public/assets/models/pptx_extracted/image11.jpeg'),
    zoom2: toFileUrl('public/assets/models/pptx_extracted/image10.jpeg'),
    zoom3: toFileUrl('public/assets/models/z8_n95c_white.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_n95c_black.jpg'),
    wholesale: 'R$ 6.500,00',
    lote10: 'R$ 65.000,00',
    retail: 'R$ 10.000,00',
    profit: '+R$ 3.500,00 / un.',
    container40HQ: '112 pcs / 40HQ',
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 20Ah Lítio de Série (Recarga 4-8h)',
    row1: [
      { k: 'MOTOR', v1: '1200 W (27H)', v2: 'Alto Torque Silencioso' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Removível Ciclo Profundo' },
      { k: 'CONTROLADOR', v1: '30A Controlador', v2: '30 Amperes Suave' },
      { k: 'FREIO', v1: 'Disco Dianteiro', v2: 'Tambor Traseiro' },
      { k: 'PNEU', v1: '130/70-10', v2: 'Pneus Alargados VIP' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: 'Recarga 4-8h', v2: 'Bivolt Automático' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'R$ 1,80 por Carga' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '112 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Amortecedora Tras.' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líquido)', v2: '65 kg (Bruto)' },
      { k: 'ILUMINAÇÃO', v1: 'Barra DRL LED', v2: 'Alarme + Keyless' }
    ]
  },
  {
    page: 14,
    catShort: 'URBANA',
    catColor: '#00E5FF',
    pn: 'DB001',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'N7 10寸标准版 // H26 STANDARD',
    shortTitle: 'N7 / H26',
    fullName: 'Z8 H26 STANDARD (N7) 1200W',
    leftHero: toFileUrl('public/assets/models/z8_n7_studio.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image4.jpeg'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image6.jpeg'),
    zoom1: toFileUrl('public/assets/models/pptx_extracted/image5.jpeg'),
    zoom2: toFileUrl('public/assets/models/pptx_extracted/image6.jpeg'),
    zoom3: toFileUrl('public/assets/models/pptx_extracted/image7.jpeg'),
    zoom4: toFileUrl('public/assets/models/pptx_extracted/image8.jpeg'),
    wholesale: 'R$ 5.500,00',
    lote10: 'R$ 55.000,00',
    retail: 'R$ 9.500,00',
    profit: '+R$ 4.000,00 / un.',
    container40HQ: '109 a 130 pcs / 40HQ',
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 20Ah Lítio / Chumbo (50 km)',
    row1: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Sem Escova Brushless' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Autonomia 50 km' },
      { k: 'CONTROLADOR', v1: '12G-33A Módulo', v2: 'Controlador 33A' },
      { k: 'FREIO', v1: 'Duplo Disco 180mm', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '300-10 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: '3A 110V-220V', v2: 'Padrão Inmetro' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Giro Rápido Urbano' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 (109p)', v2: '158×45×75 (130p)' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Amortecedora Tras.' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líquido)', v2: '70 kg (Bruto)' },
      { k: 'FUNÇÃO SMART', v1: 'Controle Remoto', v2: 'Sistema Anti-Furto' }
    ]
  },
  {
    page: 15,
    catShort: 'URBANA',
    catColor: '#00E5FF',
    pn: 'DB045-N710',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'N710 // URBAN PLUS MECHA EDITION',
    shortTitle: 'N710 PLUS',
    fullName: 'Z8 N710 URBAN PLUS 1200W MECHA',
    leftHero: toFileUrl('public/assets/models/z8_n710_farialima_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/cutouts/z8_n710_cutout.png'),
    lineupImg: toFileUrl('public/assets/models/z8_n710_farialima_headlight.jpg'),
    zoom1: toFileUrl('public/assets/models/z8_n710_farialima_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_n710_black.jpg'),
    zoom3: toFileUrl('public/assets/models/z8_n710_green.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_n710_white.jpg'),
    wholesale: 'R$ 5.300,00',
    lote10: 'R$ 53.000,00',
    retail: 'R$ 9.500,00',
    profit: '+R$ 4.200,00 / un.',
    container40HQ: '115 pcs / 40HQ',
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 20Ah Lítio de Série',
    row1: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Brushless High Perf.' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Ciclo Profundo' },
      { k: 'CONTROLADOR', v1: '12G Módulo', v2: 'Sinusoidal Silencioso' },
      { k: 'FREIO', v1: 'Duplo Disco 180mm', v2: 'Hidráulico D/T' },
      { k: 'PNEU', v1: '300-10 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: '3A 110V-220V', v2: 'Recarga 4-6h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Maior Margem B2B' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '115 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Damping Traseira' },
      { k: 'PESO s/ BAT.', v1: '58 kg (Líquido)', v2: '68 kg (Bruto)' },
      { k: 'FUNÇÃO SMART', v1: 'Farol LED Mecha', v2: 'Alarme + Keyless' }
    ]
  },
  {
    page: 17,
    catShort: 'RETRÔ',
    catColor: '#F59E0B',
    pn: 'DB043-Q11',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'Q11 // CANDY PASTEL SPORT LOVE',
    shortTitle: 'Q11 LOVE',
    fullName: 'Z8 Q11 COMPACT RETRÔ CANDY STYLE',
    leftHero: toFileUrl('public/assets/models/z8_q10_studio.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image1.jpeg'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image2.png'),
    zoom1: toFileUrl('public/assets/models/pptx_extracted/image1.jpeg'),
    zoom2: toFileUrl('public/assets/models/pptx_extracted/image2.png'),
    zoom3: toFileUrl('public/assets/models/z8_q10_green.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_q10_black.jpg'),
    wholesale: 'R$ 5.200,00',
    lote10: 'R$ 52.000,00',
    retail: 'R$ 9.300,00',
    profit: '+R$ 4.100,00 / un.',
    container40HQ: '109 pcs / 40HQ',
    packSize: '158 × 45 × 85 cm',
    voltage: '48V - 60V (Bateria 60V 20Ah Lítio de Série)',
    row1: [
      { k: 'MOTOR', v1: '1000 W', v2: 'Alta Eficiência' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: '50 km / Suporta 48-60V' },
      { k: 'CONTROLADOR', v1: '9G Controlador', v2: 'Entrega Linear Suave' },
      { k: 'FREIO', v1: 'Disco 180mm Diant.', v2: 'Tambor Traseiro' },
      { k: 'PNEU', v1: '300-10 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 45 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: '3A 110V-220V', v2: 'Padrão Inmetro' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Baú Traseiro Incluso' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 180 kg' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '109 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: '27 Núcleos Hidr. D.', v2: 'Duplo Shuang Yangni T.' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líquido)', v2: '70 kg (Bruto)' },
      { k: 'DIFERENCIAL', v1: 'Baú na Cor da Moto', v2: '6 Cores Candy Pastel' }
    ]
  },
  {
    page: 18,
    catShort: 'RETRÔ',
    catColor: '#F59E0B',
    pn: 'DB038 (Q520S1)',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: '小Q 10寸标准版 // Q520S1 VINTAGE',
    shortTitle: 'Q10 XIAO Q',
    fullName: 'Z8 Q10 VINTAGE (XIAO Q / Q520S1) 1200W',
    leftHero: toFileUrl('public/assets/models/z8_q10_madalena_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/cutouts/z8_q10_cutout.png'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image3.jpg'),
    zoom1: toFileUrl('public/assets/models/z8_q10_madalena_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_q10_madalena_bodywork.jpg'),
    zoom3: toFileUrl('public/assets/models/pptx_extracted/image3.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_q11_studio.jpg'),
    wholesale: 'R$ 5.800,00',
    lote10: 'R$ 58.000,00',
    retail: 'R$ 9.800,00',
    profit: '+R$ 4.000,00 / un.',
    container40HQ: '109 a 130 pcs / 40HQ',
    packSize: '158 × 45 × 85 cm',
    voltage: '48-60V (Suporta Lítio até 60V 120Ah / 240 km!)',
    row1: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Potência Retrô Líder' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Suporta 60V 120Ah!' },
      { k: 'CONTROLADOR', v1: '30A Controlador', v2: '30 Amperes Forte' },
      { k: 'FREIO', v1: 'Disco Dianteiro', v2: 'Tambor Traseiro' },
      { k: 'PNEU', v1: '300-10 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 45 km/h' }
    ],
    row2: [
      { k: 'TEMPO RECARGA', v1: '4 a 6 Horas', v2: 'Bivolt 110V-220V' },
      { k: 'AUTONOMIA', v1: '50 km (20Ah)', v2: 'Até 240 km (c/ 120Ah)' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 180 kg' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 (109p)', v2: '158×45×75 (130p)' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Amortecedora Tras.' },
      { k: 'PESO s/ BAT.', v1: '55 kg (Líquido)', v2: '60 kg (Bruto)' },
      { k: 'ESTILO', v1: 'Farol Halo RGB', v2: 'Banco Couro Caramelo' }
    ]
  },
  {
    page: 19,
    catShort: 'CUSTOM',
    catColor: '#F59E0B',
    pn: 'DB039 / XB-024',
    base: 'BASE NORTE (NORTHERN BASE)',
    chineseRef: 'X12 // CHOPPER CUSTOM CRUISER',
    shortTitle: 'HARLEY X12',
    fullName: 'Z8 HARLEY X12 CUSTOM CHOPPER 1200W',
    leftHero: toFileUrl('public/assets/models/z8_harley_carvalho_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image12.png'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image13.png'),
    zoom1: toFileUrl('public/assets/models/z8_harley_carvalho_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_harley_carvalho_bodywork.jpg'),
    zoom3: toFileUrl('public/assets/models/pptx_extracted/image13.png'),
    zoom4: toFileUrl('public/assets/models/pptx_extracted/image14.png'),
    wholesale: 'R$ 6.500,00',
    lote10: 'R$ 65.000,00',
    retail: 'R$ 10.000,00',
    profit: '+R$ 3.500,00 / un.',
    container40HQ: '216 pcs / 40HQ',
    packSize: '130 × 37 × 65 cm',
    voltage: '60V 20Ah Lítio Removível (Recarga 4-8h)',
    row1: [
      { k: 'MOTOR', v1: '1200 W (27H)', v2: 'Cubo Traseiro Custom' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Removível sob Piso' },
      { k: 'CONTROLADOR', v1: '30A Controlador', v2: '30 Amperes Alto Torque' },
      { k: 'FREIO', v1: 'Disco Dianteiro', v2: 'Tambor Traseiro' },
      { k: 'PNEU', v1: '130/70-10', v2: 'Pneus Alargados Chopper' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' }
    ],
    row2: [
      { k: 'TEMPO RECARGA', v1: '4 a 8 Horas', v2: 'Bivolt Automático' },
      { k: 'AUTONOMIA', v1: 'Até 45-50 km', v2: 'Cruiser Urbano' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 200 kg' },
      { k: 'PACOTE 40HQ', v1: '130×37×65 cm', v2: '216 unidades / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Duplo Mola Traseira' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líquido)', v2: '65 kg (Bruto)' },
      { k: 'EXCLUSIVO', v1: 'Som Bluetooth', v2: 'Guidão Alto + Encosto' }
    ]
  },
  {
    page: 21,
    catShort: 'CARGO',
    catColor: '#22C55E',
    pn: 'XB-010',
    base: 'BASES DE FOSHAN & HUIZHOU',
    chineseRef: 'U2 12寸高配版 // U2 HEAVY-DUTY CARGO',
    shortTitle: 'U2 CARGO',
    fullName: 'Z8 U2 DELIVERY CARGO 2000W ARO 12',
    leftHero: toFileUrl('public/assets/models/z8_u2_warehouse_wide.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image17.jpeg'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image18.png'),
    zoom1: toFileUrl('public/assets/models/z8_u2_warehouse_headlight.jpg'),
    zoom2: toFileUrl('public/assets/models/z8_u2_warehouse_bodywork.jpg'),
    zoom3: toFileUrl('public/assets/models/z8_u2_black.jpg'),
    zoom4: toFileUrl('public/assets/models/z8_u2_white.jpg'),
    wholesale: 'R$ 6.000,00',
    lote10: 'R$ 60.000,00',
    retail: 'R$ 9.500,00',
    profit: '+R$ 3.500,00 / un.',
    container40HQ: '168 a 216 pcs / 40HQ',
    packSize: '148 × 37 × 75 cm',
    voltage: '48V - 60V - 72V (Sistema Multivoltagem)',
    row1: [
      { k: 'MOTOR', v1: '2000 W', v2: 'Sem Escova Heavy-Duty' },
      { k: 'BATERIA', v1: 'Lítio 60V 20Ah', v2: 'Cofre Grande (48-72V)' },
      { k: 'CONTROLADOR', v1: '12G Reforçado', v2: 'Módulo de Carga' },
      { k: 'FREIO', v1: 'Duplo Disco 220mm', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '90/90-12 pol.', v2: 'Vácuo + Roda Alumínio' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 70 km/h' }
    ],
    row2: [
      { k: 'CONFIGURAÇÃO', v1: 'Novo Baú Médio', v2: 'Selim Longo Integrado' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Especial Frotas/Delivery' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Carga Pesada: 220 kg' },
      { k: 'PACOTE 40HQ', v1: '148×31.5×75 (216p)', v2: '148×37×75 (168p)' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico Diant.', v2: 'Mola Carga Traseira' },
      { k: 'PESO s/ BAT.', v1: '55 kg (Líquido)', v2: '65 kg (Bruto)' },
      { k: 'DESTAQUE', v1: 'Tela Blade LED', v2: 'Grade Frontal Off-Road' }
    ]
  },
  {
    page: 22,
    catShort: 'E-BIKE',
    catColor: '#22C55E',
    pn: 'GS-005',
    base: 'BASE NORTE (NORTHERN BASE)',
    chineseRef: '金鹰 高配 // GOLDEN EAGLE E-BIKE',
    shortTitle: 'GS-005',
    fullName: 'Z8 GS-005 GOLDEN EAGLE 500W PEDELEC',
    leftHero: toFileUrl('public/assets/models/z8_gs005_studio.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image20.jpeg'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image21.jpeg'),
    zoom1: toFileUrl('public/assets/models/pptx_extracted/image20.jpeg'),
    zoom2: toFileUrl('public/assets/models/pptx_extracted/image21.jpeg'),
    zoom3: toFileUrl('public/assets/models/pptx_extracted/image22.jpeg'),
    zoom4: toFileUrl('public/assets/models/pptx_extracted/image23.jpeg'),
    wholesale: 'R$ 3.200,00',
    lote10: 'R$ 32.000,00',
    retail: 'R$ 6.200,00',
    profit: '+R$ 3.000,00 / un.',
    container40HQ: '288 a 294 pcs / 40HQ',
    packSize: '129 × 31.5 × 62 cm',
    voltage: '48V 20Ah / 60V 20Ah Lítio (50 km)',
    row1: [
      { k: 'MOTOR', v1: '500 W', v2: 'Motor Cobre Puro' },
      { k: 'BATERIA', v1: 'Lítio 48V/60V', v2: '20Ah (Autonomia 50km)' },
      { k: 'CONTROLADOR', v1: '6G-NEW Módulo', v2: 'Nova Geração Suave' },
      { k: 'FREIO', v1: 'Tambor D/T', v2: 'Expansão Traseira' },
      { k: 'PNEU', v1: '14 × 2.5 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '28-32 km/h', v2: 'Autopropelido CONTRAN' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: 'Bivolt 110-220V', v2: 'Recarga Econômica' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Pedal + Acelerador' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 150 kg' },
      { k: 'PACOTE 40HQ', v1: '129×31.5×62 cm', v2: '288 a 294 pcs / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Molas Damping', v2: 'Dianteira e Traseira' },
      { k: 'PESO s/ BAT.', v1: '30 kg (Líquido)', v2: '35 kg (Bruto)' },
      { k: 'DESTAQUE', v1: 'Capô LED Mecha', v2: 'Setas + Cesta Frontal' }
    ]
  },
  {
    page: 23,
    catShort: 'E-BIKE',
    catColor: '#22C55E',
    pn: 'GS-052',
    base: 'BASE NORTE (NORTHERN BASE)',
    chineseRef: '小金刚 // LITTLE KING KONG LUXE',
    shortTitle: 'DIAMOND',
    fullName: 'Z8 DIAMOND LUXE (LITTLE KING KONG) 500W',
    leftHero: toFileUrl('public/assets/models/z8_diamond_studio.jpg'),
    rightMain: toFileUrl('public/assets/models/pptx_extracted/image24.png'),
    lineupImg: toFileUrl('public/assets/models/pptx_extracted/image25.png'),
    zoom1: toFileUrl('public/assets/models/pptx_extracted/image24.png'),
    zoom2: toFileUrl('public/assets/models/pptx_extracted/image25.png'),
    zoom3: toFileUrl('public/assets/models/pptx_extracted/image26.png'),
    zoom4: toFileUrl('public/assets/models/z8_diamond_studio.jpg'),
    wholesale: 'R$ 3.400,00',
    lote10: 'R$ 34.000,00',
    retail: 'R$ 6.800,00',
    profit: '+R$ 3.400,00 / un.',
    container40HQ: '288 a 294 pcs / 40HQ',
    packSize: '129 × 31 × 62 cm',
    voltage: '48V 20Ah / 60V 20Ah Lítio (50 km)',
    row1: [
      { k: 'MOTOR', v1: '500 W', v2: 'Motor Cobre Puro' },
      { k: 'BATERIA', v1: 'Lítio 48V/60V', v2: '20Ah (Autonomia 50km)' },
      { k: 'CONTROLADOR', v1: '500W Controlador', v2: 'Estável e Silencioso' },
      { k: 'FREIO', v1: 'Tambor D/T', v2: 'Expansão Traseira' },
      { k: 'PNEU', v1: '16 - 3.0 pol.', v2: 'Pneu Vácuo Alargado' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx: 35-40 km/h' }
    ],
    row2: [
      { k: 'CARREGADOR', v1: 'Bivolt 110-220V', v2: 'Padrão Residencial' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: '100% Markup Lojista!' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 160 kg' },
      { k: 'PACOTE 40HQ', v1: '129×31×62 cm', v2: '288 a 294 pcs / 40HQ' },
      { k: 'AMORTECEDOR', v1: 'Molas Damping', v2: 'Dianteira e Traseira' },
      { k: 'PESO s/ BAT.', v1: '37 kg (Líquido)', v2: '43 kg (Bruto)' },
      { k: 'FUNÇÃO SMART', v1: 'Alarme Remoto', v2: 'Anti-Furto + Cesta' }
    ]
  }
];

function buildProductSheetHTML(m, totalPages = 26) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px;
    height: 1131px;
    font-family: 'Inter', sans-serif;
    background: #0A0B0E;
    overflow: hidden;
    display: flex;
  }
  /* Left 40% Panel (640px) */
  .left-panel {
    width: 640px;
    height: 1131px;
    background: #0B0D12;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 36px 28px 36px;
    border-right: 3px solid ${m.catColor};
    overflow: hidden;
  }
  .left-bg-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.34;
    filter: contrast(1.12) saturate(1.1);
    z-index: 0;
  }
  .left-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(10,11,14,0.88) 0%, rgba(10,11,14,0.45) 45%, rgba(10,11,14,0.95) 85%);
    z-index: 1;
  }
  .left-top {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: flex-start;
    gap: 18px;
  }
  .vertical-pill {
    background: ${m.catColor};
    color: #0A0B0E;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 18px;
    letter-spacing: 4px;
    padding: 18px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .title-block {
    flex: 1;
  }
  .pn-badge {
    display: inline-block;
    background: rgba(0, 229, 255, 0.14);
    border: 1px solid #00E5FF;
    color: #00E5FF;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
    padding: 5px 12px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .giant-model-name {
    font-family: 'Barlow Condensed', 'Bahnschrift', 'Arial Narrow', sans-serif;
    font-weight: 900;
    font-size: 72px;
    line-height: 0.92;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .full-sub-name {
    font-size: 16px;
    font-weight: 700;
    color: #C2C6CA;
    letter-spacing: 1.5px;
    margin-top: 8px;
    padding-bottom: 12px;
    border-bottom: 3px solid ${m.catColor};
  }
  .left-center-hero {
    position: relative;
    z-index: 2;
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-center-hero img {
    max-width: 100%;
    max-height: 350px;
    object-fit: contain;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 20px 45px rgba(0,0,0,0.75);
  }
  .wholesale-card {
    position: relative;
    z-index: 2;
    background: rgba(15, 23, 42, 0.95);
    border: 2px solid ${m.catColor};
    border-top: 6px solid ${m.catColor};
    border-radius: 6px;
    padding: 20px 24px;
  }
  .wholesale-kicker {
    font-size: 13px;
    font-weight: 800;
    color: #00E5FF;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .wholesale-price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 6px 0 12px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }
  .wholesale-price {
    font-family: 'Barlow Condensed', 'Bahnschrift', 'Arial Narrow', sans-serif;
    font-size: 46px;
    font-weight: 900;
    color: #FFFFFF;
    line-height: 1;
    white-space: nowrap;
  }
  .lote-pill {
    background: rgba(34, 197, 94, 0.16);
    border: 1px solid #22C55E;
    color: #22C55E;
    font-size: 14px;
    font-weight: 800;
    padding: 6px 12px;
    border-radius: 4px;
  }
  .wholesale-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
    font-size: 13px;
    color: #E2E8F0;
  }
  .wholesale-meta-grid strong {
    color: #FFFFFF;
  }
  .left-footer {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: #94A3B8;
    letter-spacing: 1.5px;
  }

  /* Right 60% Panel (960px) */
  .right-panel {
    width: 960px;
    height: 1131px;
    background: #FFFFFF;
    color: #0A0B0E;
    padding: 32px 40px 28px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px solid #E2E8F0;
  }
  .factory-ref {
    font-size: 13px;
    font-weight: 800;
    color: #475569;
    letter-spacing: 1.5px;
  }
  .page-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0A0B0E;
    background: #F1F5F9;
    padding: 4px 14px;
    border-radius: 4px;
  }
  /* Studio & Callouts Zone */
  .studio-zone {
    display: grid;
    grid-template-columns: 540px 1fr;
    gap: 24px;
    height: 560px;
    align-items: center;
    padding: 12px 0;
  }
  .main-studio-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .studio-hero-box {
    height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
  }
  .studio-hero-box img {
    max-width: 100%;
    max-height: 370px;
    object-fit: contain;
  }
  .lineup-strip-box {
    height: 145px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 8px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .lineup-label {
    font-size: 11px;
    font-weight: 800;
    color: #0082A0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .lineup-strip-box img {
    width: 100%;
    height: 105px;
    object-fit: contain;
  }
  /* 4 Circular Zoom Badges (LAF Style!) */
  .zoom-badges-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .zoom-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .zoom-circle {
    width: 148px;
    height: 148px;
    border-radius: 50%;
    border: 4px solid ${m.catColor};
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    background: #0A0B0E;
    margin-bottom: 8px;
  }
  .zoom-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .zoom-caption {
    font-size: 11px;
    font-weight: 800;
    color: #1E293B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* 2-Row Telemetry Grid (13 Items - LAF Standard) */
  .telemetry-container {
    background: #F4F6F9;
    border: 1.5px solid #DCE2EA;
    border-radius: 6px;
    padding: 18px 20px;
  }
  .telemetry-row-1 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #DCE2EA;
  }
  .telemetry-row-2 {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    padding-top: 16px;
  }
  .t-cell {
    display: flex;
    flex-direction: column;
    border-left: 3px solid ${m.catColor};
    padding-left: 10px;
  }
  .telemetry-row-2 .t-cell {
    border-left-color: #0F172A;
  }
  .t-key {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 900;
    color: #0A0B0E;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .t-val1 {
    font-size: 13px;
    font-weight: 800;
    color: #0082A0;
    margin-top: 4px;
  }
  .t-val2 {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    margin-top: 2px;
  }
  .right-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #64748B;
  }
  .right-footer strong {
    color: #0A0B0E;
  }
</style>
</head>
<body>
  <div class="left-panel">
    <img src="${m.leftHero}" class="left-bg-photo" />
    <div class="left-overlay"></div>

    <div class="left-top">
      <div class="vertical-pill">${m.catShort}</div>
      <div class="title-block">
        <div class="pn-badge">PN: ${m.pn} // ${m.base}</div>
        <div class="giant-model-name">${m.shortTitle}</div>
        <div class="full-sub-name">${m.fullName}</div>
      </div>
    </div>

    <div class="left-center-hero">
      <img src="${m.leftHero}" alt="${m.shortTitle}" />
    </div>

    <div class="wholesale-card">
      <div class="wholesale-kicker">VALOR DE ATACADO UNITÁRIO (EXCLUSIVO B2B)</div>
      <div class="wholesale-price-row">
        <div class="wholesale-price">${m.wholesale}</div>
        <div class="lote-pill">LOTE 10 UN.: ${m.lote10}</div>
      </div>
      <div class="wholesale-meta-grid">
        <div>Varejo Sugerido: <strong>${m.retail}</strong></div>
        <div>Lucro Lojista: <strong style="color:#22C55E">${m.profit}</strong></div>
        <div>Container 40HQ: <strong>${m.container40HQ}</strong></div>
        <div>Pacote SKD: <strong>${m.packSize}</strong></div>
        <div style="grid-column: span 2; color:#F59E0B;">⚡ ${m.voltage}</div>
      </div>
    </div>

    <div class="left-footer">
      <span>Z8 E-MOTION // CONTRAN 996</span>
      <span>Z8EMOTION.COM</span>
    </div>
  </div>

  <div class="right-panel">
    <div class="right-header">
      <div class="factory-ref">FICHA TÉCNICA DE MONTADORA // ${m.chineseRef}</div>
      <div class="page-num">PÁG. ${m.page} / ${totalPages}</div>
    </div>

    <div class="studio-zone">
      <div class="main-studio-col">
        <div class="studio-hero-box">
          <img src="${m.rightMain}" alt="${m.shortTitle}" />
        </div>
        <div class="lineup-strip-box">
          <div class="lineup-label">PALETA DE CORES & VARIAÇÕES DE SÉRIE (FÁBRICA):</div>
          <img src="${m.lineupImg}" alt="Cores" />
        </div>
      </div>

      <div class="zoom-badges-col">
        <div class="zoom-card">
          <div class="zoom-circle"><img src="${m.zoom1}" /></div>
          <div class="zoom-caption">01 // ÓPTICA FULL LED</div>
        </div>
        <div class="zoom-card">
          <div class="zoom-circle"><img src="${m.zoom2}" /></div>
          <div class="zoom-caption">02 // ACABAMENTO & CHASSI</div>
        </div>
        <div class="zoom-card">
          <div class="zoom-circle"><img src="${m.zoom3}" /></div>
          <div class="zoom-caption">03 // CICLÍSTICA & FREIOS</div>
        </div>
        <div class="zoom-card">
          <div class="zoom-circle"><img src="${m.zoom4}" /></div>
          <div class="zoom-caption">04 // MOTOR & SUSPENSÃO</div>
        </div>
      </div>
    </div>

    <div class="telemetry-container">
      <div class="telemetry-row-1">
        ${m.row1.map(c => `
          <div class="t-cell">
            <span class="t-key">${c.k}</span>
            <span class="t-val1">${c.v1}</span>
            <span class="t-val2">${c.v2}</span>
          </div>
        `).join('')}
      </div>
      <div class="telemetry-row-2">
        ${m.row2.map(c => `
          <div class="t-cell">
            <span class="t-key">${c.k}</span>
            <span class="t-val1">${c.v1}</span>
            <span class="t-val2">${c.v2}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="right-footer">
      <span>Consulte as cores disponíveis com nossa equipe comercial | Faturamento Direto CNPJ</span>
      <strong>MATRIZ SÃO JOSÉ DOS CAMPOS - SP // GARANTIA NACIONAL Z8</strong>
    </div>
  </div>
</body>
</html>`;
}

// Build Institutional, Divider, Master Table, and Closing Pages (Pages 1-9, 12, 16, 20, 24-26)
function buildCommonWrapper(bodyContent) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px;
    height: 1131px;
    font-family: 'Inter', sans-serif;
    background: #0A0B0E;
    color: #FFFFFF;
    overflow: hidden;
    position: relative;
  }
</style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

function getInstitutionalPages() {
  const pages = [];

  // PAGE 01: CAPA LAF EDITION
  pages.push({
    page: 1,
    slug: 'capa_laf_edition',
    html: buildCommonWrapper(`
      <img src="${toFileUrl('public/assets/models/z8_tank_paulista_wide.jpg')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.32;filter:contrast(1.15);" />
      <div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(10,11,14,0.96) 0%, rgba(10,11,14,0.82) 55%, rgba(10,11,14,0.45) 100%);"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:16px;background:#00E5FF;"></div>
      <div style="position:relative;z-index:2;height:100%;padding:64px 80px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:20px;">
            <img src="${logoMin}" style="height:64px;object-fit:contain;" />
            <div>
              <div style="background:rgba(0,229,255,0.14);border:1.5px solid #00E5FF;color:#00E5FF;font-size:13px;font-weight:800;letter-spacing:3px;padding:6px 16px;border-radius:4px;display:inline-block;">Z8 E-MOTION BRASIL // CATÁLOGO OFICIAL 2026 (LAF EDITION)</div>
              <div style="color:#94A3B8;font-size:13px;font-weight:600;margin-top:6px;letter-spacing:1.5px;">DOSSIÊ INDUSTRIAL DE MONTADORA, FICHAS TÉCNICAS 40HQ & TABELA DE ATACADO B2B</div>
            </div>
          </div>
          <div style="text-align:right;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#00E5FF;letter-spacing:2px;">CONTRAN Nº 996/2023 // 100% HOMOLOGADO</div>
        </div>

        <div style="display:grid;grid-template-columns: 1.18fr 0.82fr;gap:44px;align-items:center;">
          <div>
            <div style="font-family:'Barlow Condensed','Bahnschrift','Arial Narrow',sans-serif;font-weight:900;font-size:82px;line-height:0.95;text-transform:uppercase;letter-spacing:0.5px;">
              MOBILIDADE ELÉTRICA<br/><span style="color:#00E5FF;">DE ALTA ENGENHARIA.</span>
            </div>
            <p style="font-size:18px;color:#CBD5E1;line-height:1.55;margin-top:20px;max-width:780px;">
              Arquitetura industrial inspirada no padrão internacional de montadoras globais, unindo as <strong>Bases Produtivas de Foshan, Huizhou e Base Norte</strong> à engenharia nacional, garantia de fábrica e rentabilidade real para concessionários e revendedores Z8.
            </p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px;">
              <div style="background:rgba(15,23,42,0.92);border:1.5px solid #00E5FF;border-top:5px solid #00E5FF;padding:14px;border-radius:6px;">
                <div style="font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:1px;">PORTFÓLIO OFICIAL</div>
                <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:28px;font-weight:900;color:#FFF;margin-top:6px;white-space:nowrap;">11 MODELOS</div>
                <div style="font-size:12px;color:#00E5FF;font-weight:700;margin-top:4px;">4 Linhas Comerciais</div>
              </div>
              <div style="background:rgba(15,23,42,0.92);border:1.5px solid #22C55E;border-top:5px solid #22C55E;padding:14px;border-radius:6px;">
                <div style="font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:1px;">ATACADO INICIAL</div>
                <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:28px;font-weight:900;color:#22C55E;margin-top:6px;white-space:nowrap;">R$ 3.200</div>
                <div style="font-size:12px;color:#E2E8F0;font-weight:700;margin-top:4px;">Lucro até R$ 4.200/un.</div>
              </div>
              <div style="background:rgba(15,23,42,0.92);border:1.5px solid #F59E0B;border-top:5px solid #F59E0B;padding:14px;border-radius:6px;">
                <div style="font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:1px;">BATERIAS DE LÍTIO</div>
                <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:28px;font-weight:900;color:#F59E0B;margin-top:6px;white-space:nowrap;">ATÉ 240 KM</div>
                <div style="font-size:12px;color:#E2E8F0;font-weight:700;margin-top:4px;">Suporte até 60V 125Ah</div>
              </div>
              <div style="background:rgba(15,23,42,0.92);border:1.5px solid #F97316;border-top:5px solid #F97316;padding:14px;border-radius:6px;">
                <div style="font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:1px;">CONTAINER 40HQ</div>
                <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:28px;font-weight:900;color:#F97316;margin-top:6px;white-space:nowrap;">85 A 294 UN.</div>
                <div style="font-size:12px;color:#E2E8F0;font-weight:700;margin-top:4px;">Padrão SKD 40HQ</div>
              </div>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.97);border-radius:6px;padding:24px;border:3px solid #00E5FF;box-shadow:0 25px 60px rgba(0,0,0,0.8);">
            <div style="font-size:12px;font-weight:800;color:#0F172A;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase;">DESTAQUE DE LINHA // SHOWROOM OFICIAL Z8</div>
            <img src="${toFileUrl('public/assets/models/pptx_extracted/image2.png')}" style="width:100%;height:240px;object-fit:contain;margin-bottom:14px;" />
            <img src="${toFileUrl('public/assets/models/pptx_extracted/image16.png')}" style="width:100%;height:190px;object-fit:contain;" />
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.15);padding-top:20px;font-size:13px;color:#94A3B8;font-weight:700;">
          <span>Z8 EMOTION LTDA. // CNPJ: 68.774.164/0001-00 // MATRIZ SÃO JOSÉ DOS CAMPOS - SP</span>
          <span style="color:#00E5FF;">MESA DE EXPANSÃO & ATACADO: (12) 99800-8818 // Z8EMOTION.COM</span>
          <span>PÁG. 01 / 26</span>
        </div>
      </div>
    `)
  });

  // PAGE 04: BASES INDUSTRIAIS (FOSHAN, HUIZHOU & BASE NORTE)
  pages.push({
    page: 4,
    slug: 'bases_industriais_foshan_huizhou_norte',
    html: buildCommonWrapper(`
      <div style="height:100%;display:grid;grid-template-columns:600px 1fr;">
        <div style="background:#0B0D12;padding:48px;border-right:3px solid #00E5FF;display:flex;flex-direction:column;justify-content:space-between;position:relative;">
          <div>
            <div style="background:rgba(0,229,255,0.14);border:1px solid #00E5FF;color:#00E5FF;font-size:12px;font-weight:800;letter-spacing:2px;padding:6px 12px;border-radius:4px;display:inline-block;margin-bottom:16px;">ENGENHARIA & ORIGEM INDUSTRIAL</div>
            <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:52px;font-weight:900;line-height:0.95;text-transform:uppercase;">3 POLOS GLOBAIS<br/><span style="color:#00E5FF;">DE MANUFATURA.</span></div>
            <p style="font-size:15px;color:#CBD5E1;line-height:1.6;margin-top:20px;">
              Cada veículo Z8 E-Motion é produzido em plantas industriais dedicadas por especialidade mecânica, garantindo soldagem robótica de aço de alto carbono, pintura automotiva tripla camada UV e chicotes elétricos selados IP65.
            </p>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <img src="${toFileUrl('public/assets/models/pptx_extracted/image10.jpeg')}" style="width:100%;height:210px;object-fit:cover;border-radius:6px;border:1.5px solid rgba(255,255,255,0.15);" />
            <img src="${toFileUrl('public/assets/models/pptx_extracted/image6.jpeg')}" style="width:100%;height:210px;object-fit:cover;border-radius:6px;border:1.5px solid rgba(255,255,255,0.15);" />
          </div>
          <div style="font-size:12px;font-weight:700;color:#94A3B8;letter-spacing:1.5px;">Z8 E-MOTION // CADEIA PRODUTIVA INTERNACIONAL</div>
        </div>
        <div style="background:#FFFFFF;color:#0A0B0E;padding:48px 56px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #E2E8F0;padding-bottom:16px;">
            <span style="font-size:14px;font-weight:800;color:#475569;letter-spacing:1.5px;">MAPA DE PLANTAS PRODUTIVAS & CAPACIDADE SKD 40HQ</span>
            <span style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:900;background:#F1F5F9;padding:4px 14px;border-radius:4px;">PÁG. 04 / 26</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr;gap:22px;">
            <div style="background:#F8FAFC;border:1.5px solid #DCE2EA;border-left:8px solid #00E5FF;border-radius:6px;padding:24px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#0A0B0E;">01 // BASES DE FOSHAN & HUIZHOU (GUANGDONG HUB)</div>
                <span style="background:#00E5FF;color:#0A0B0E;font-size:12px;font-weight:800;padding:5px 12px;border-radius:4px;">SCOOTERS PREMIUM & RETRÔ</span>
              </div>
              <p style="font-size:14px;color:#334155;line-height:1.55;margin-top:10px;">
                Centro tecnológico responsável pelos modelos <strong>FX-10 Sport (DB043), N95C Max Comfort (DB039), H26 Standard / N7 (DB001), N710 Urban Plus, Q11 Compact (DB043-Q11), Q10 Vintage Xiao Q (DB038) e U2 Cargo (XB-010)</strong>. Destaca-se pelos amortecedores hidráulicos de 27 núcleos, módulos controladores 9G a 12G-38A e pintura Candy Pastel e Automotiva.
              </p>
              <div style="display:flex;gap:24px;margin-top:14px;font-size:13px;font-weight:800;color:#0082A0;">
                <span>• Cubagem: 90 a 216 unidades / 40HQ</span>
                <span>• Motores: 1000W, 1200W (27H), 1500W e 2000W</span>
                <span>• Baterias: Até 60V 120Ah (240 km)</span>
              </div>
            </div>

            <div style="background:#F8FAFC;border:1.5px solid #DCE2EA;border-left:8px solid #F97316;border-radius:6px;padding:24px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:#0A0B0E;">02 // BASE NORTE (NORTHERN INDUSTRIAL BASE)</div>
                <span style="background:#F97316;color:#FFFFFF;font-size:12px;font-weight:800;padding:5px 12px;border-radius:4px;">TRAIL 2000W, CUSTOM & E-BIKES</span>
              </div>
              <p style="font-size:14px;color:#334155;line-height:1.55;margin-top:10px;">
                Planta especializada em quadros tubulares de alta rigidez e ciclística pesada para os modelos <strong>Z8 Tank High-Speed (DB018), Harley X12 Custom (DB039/XB-024), GS-005 Golden Eagle e GS-052 Diamond Luxe (Little King Kong)</strong>. Equipada com controladores de 15G, pneus Hot-Melt / Textura de Neve 110/70-12 e motores de cobre puro.
              </p>
              <div style="display:flex;gap:24px;margin-top:14px;font-size:13px;font-weight:800;color:#C2410C;">
                <span>• Cubagem: 85 pcs (Tank) a 294 pcs (E-Bikes) / 40HQ</span>
                <span>• Velocidade Pista: Até 80 km/h (Tank)</span>
                <span>• Baterias: Suporte até 60V 125Ah</span>
              </div>
            </div>

            <div style="background:#0F172A;color:#FFFFFF;border-radius:6px;padding:24px;border-left:8px solid #22C55E;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;color:#FFFFFF;">03 // HUB NACIONAL SÃO JOSÉ DOS CAMPOS - SP (PDI & DISTRIBUIÇÃO)</div>
                <span style="background:#22C55E;color:#0A0B0E;font-size:12px;font-weight:800;padding:5px 12px;border-radius:4px;">PRONTA ENTREGA & GARANTIA</span>
              </div>
              <p style="font-size:14px;color:#CBD5E1;line-height:1.55;margin-top:10px;">
                Sede corporativa e centro de engenharia da <strong>Z8 EMOTION LTDA.</strong> em São José dos Campos - SP. Realiza inspeção pré-entrega (PDI), aferição de baterias e BMS, estoque estratégico de peças de reposição e expedição de lotes mínimos de 10 motocicletas para franqueados e lojistas de todo o Brasil.
              </p>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#64748B;border-top:1px solid #E2E8F0;padding-top:14px;">
            <span>PADRÃO DE EMBALAGEM SKD COM ARMAÇÃO METÁLICA + CARTÃO DE ALTA DENSIDADE</span>
            <strong style="color:#0A0B0E;">Z8 EMOTION LTDA. // SÃO JOSÉ DOS CAMPOS - SP</strong>
          </div>
        </div>
      </div>
    `)
  });

  // PAGE 05: COMPARATIVO DE BATERIAS (LAF STYLE BATTERY COMPARISON + Z8 HIGH CAPACITY)
  pages.push({
    page: 5,
    slug: 'comparativo_baterias_litio_lifepo4',
    html: buildCommonWrapper(`
      <div style="height:100%;background:#FFFFFF;color:#0A0B0E;padding:44px 56px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0A0B0E;padding-bottom:18px;">
          <div>
            <div style="background:#0A0B0E;color:#00E5FF;font-size:12px;font-weight:800;letter-spacing:2px;padding:5px 14px;border-radius:4px;display:inline-block;margin-bottom:8px;">TECNOLOGIA ENERGÉTICA Z8 // PADRÃO LAF EDITION</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:58px;font-weight:900;line-height:0.95;color:#0A0B0E;">MATRIZ COMPARATIVA DE BATERIAS & AUTONOMIA</div>
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;background:#F1F5F9;padding:6px 16px;border-radius:4px;">PÁG. 05 / 26</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
          <div style="background:#0F172A;color:#FFF;border-radius:6px;padding:24px;border-top:8px solid #00E5FF;">
            <div style="font-size:12px;font-weight:800;color:#00E5FF;letter-spacing:1.5px;">01 // PADRÃO DE SÉRIE Z8</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;margin:6px 0;">LÍTIO 60V 20Ah</div>
            <div style="font-size:13px;color:#CBD5E1;line-height:1.55;margin-bottom:16px;">Células automotivas de alta densidade com gerenciamento eletrônico BMS inteligente contra sobrecarga e temperatura.</div>
            <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;font-size:13px;display:flex;flex-direction:column;gap:8px;">
              <div><strong>Ciclos de Vida:</strong> 1.200 a 1.500 ciclos</div>
              <div><strong>Autonomia Real:</strong> 50 a 65 km</div>
              <div><strong>Peso da Maleta:</strong> ~7,5 kg (Removível)</div>
              <div><strong>Tempo de Carga:</strong> 4 a 6 horas (Bivolt)</div>
            </div>
          </div>

          <div style="background:#0F172A;color:#FFF;border-radius:6px;padding:24px;border-top:8px solid #22C55E;">
            <div style="font-size:12px;font-weight:800;color:#22C55E;letter-spacing:1.5px;">02 // ALTA SEGURANÇA TÉRMICA</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;margin:6px 0;">LÍTIO LiFePO4</div>
            <div style="font-size:13px;color:#CBD5E1;line-height:1.55;margin-bottom:16px;">Fosfato de Ferro-Lítio de ultra estabilidade química. Não inflama, suporta descarga contínua severa e uso comercial intenso.</div>
            <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;font-size:13px;display:flex;flex-direction:column;gap:8px;">
              <div><strong>Ciclos de Vida:</strong> 2.000 a 2.500 ciclos</div>
              <div><strong>Autonomia Real:</strong> 60 a 90 km</div>
              <div><strong>Estabilidade:</strong> Grau Militar Anti-Chama</div>
              <div><strong>Aplicação:</strong> Frotas, Delivery & Locação</div>
            </div>
          </div>

          <div style="background:#0F172A;color:#FFF;border-radius:6px;padding:24px;border-top:8px solid #F97316;">
            <div style="font-size:12px;font-weight:800;color:#F97316;letter-spacing:1.5px;">03 // ULTRA CAPACIDADE (FACTORY SPEC)</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;margin:6px 0;">60V 120Ah / 125Ah</div>
            <div style="font-size:13px;color:#CBD5E1;line-height:1.55;margin-bottom:16px;">Cofres dimensionados de fábrica nos modelos <strong>Z8 Tank (DB018) e Q10 Xiao Q (DB038)</strong> para packs de longa distância.</div>
            <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;font-size:13px;display:flex;flex-direction:column;gap:8px;">
              <div><strong>Capacidade:</strong> Até 60V 125Ah</div>
              <div><strong>Autonomia Máxima:</strong> <span style="color:#F97316;font-weight:800;">ATÉ 240 KM!</span></div>
              <div><strong>Modelos Compatíveis:</strong> Tank, Q10 e U2 Cargo</div>
              <div><strong>Custo por Km:</strong> Menos de R$ 0,03 / km</div>
            </div>
          </div>

          <div style="background:#F8FAFC;color:#0A0B0E;border:2px solid #CBD5E1;border-radius:6px;padding:24px;border-top:8px solid #64748B;">
            <div style="font-size:12px;font-weight:800;color:#475569;letter-spacing:1.5px;">04 // ENTRADA ECONÔMICA</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;margin:6px 0;">CHUMBO / GRAFENO</div>
            <div style="font-size:13px;color:#334155;line-height:1.55;margin-bottom:16px;">Opção sob encomenda para projetos de entrada em container fechado (48V20Ah / 60V20Ah) com menor custo inicial de aquisição.</div>
            <div style="border-top:1px solid #CBD5E1;padding-top:12px;font-size:13px;display:flex;flex-direction:column;gap:8px;">
              <div><strong>Ciclos de Vida:</strong> 350 a 500 ciclos</div>
              <div><strong>Autonomia Real:</strong> 40 a 50 km</div>
              <div><strong>Peso do Conjunto:</strong> 22 a 28 kg (Fixo)</div>
              <div><strong>Tempo de Carga:</strong> 6 a 8 horas</div>
            </div>
          </div>
        </div>

        <div style="background:#F1F5F9;border:1.5px solid #CBD5E1;border-radius:6px;padding:22px 28px;display:grid;grid-template-columns:1.2fr 1fr;gap:32px;align-items:center;">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:#0A0B0E;">ARGUMENTO DE OURO PARA O LOJISTA (ECONOMIA NA TOMADA)</div>
            <p style="font-size:14px;color:#334155;line-height:1.55;margin-top:6px;">
              Uma recarga completa na tomada residencial comum (110V/220V) consome apenas <strong>1,2 kWh a 1,5 kWh</strong>, custando entre <strong>R$ 1,80 e R$ 2,50</strong>. O cliente final economiza mais de <strong>R$ 450,00 por mês</strong> em gasolina e óleo — o que paga a própria parcela da motocicleta elétrica Z8.
            </p>
          </div>
          <div style="background:#0A0B0E;color:#FFF;padding:18px 24px;border-radius:6px;border-left:6px solid #22C55E;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:11px;font-weight:800;color:#22C55E;letter-spacing:1.5px;">CUSTO POR CARGA COMPLETA</div>
              <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:36px;font-weight:900;white-space:nowrap;">R$ 1,80 A R$ 2,50</div>
            </div>
            <div style="text-align:right;font-size:13px;color:#CBD5E1;">
              <div>Tomada Padrão 10A</div>
              <div style="color:#00E5FF;font-weight:800;">Zero Manutenção de Motor</div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#64748B;">
          <span>TODAS AS BATERIAS PASSAM POR AUDITORIA DE TENSÃO E BMS NO PDI ANTES DO ENVIO</span>
          <strong style="color:#0A0B0E;">GARANTIA NACIONAL Z8 E-MOTION // SÃO JOSÉ DOS CAMPOS - SP</strong>
        </div>
      </div>
    `)
  });

  // PAGE 24: TABELA MASTER DE ATACADO, LUCRO E CONTAINER 40HQ
  const tableRows = models.map((m, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#111622' : '#0D111A'};border-bottom:1px solid rgba(255,255,255,0.08);">
      <td style="padding:8px 8px;font-weight:800;color:#00E5FF;white-space:nowrap;">${m.pn}</td>
      <td style="padding:8px 8px;font-weight:800;color:#FFFFFF;">${m.fullName}</td>
      <td style="padding:8px 8px;color:#CBD5E1;font-size:11px;white-space:nowrap;">${m.base.replace('BASES DE ', '').replace(' (NORTHERN BASE)', '')}</td>
      <td style="padding:8px 8px;font-weight:700;color:#F8FAFC;font-size:11.5px;">${m.row1[0].v1} / ${m.row1[2].v1}</td>
      <td style="padding:8px 8px;color:#F59E0B;font-weight:700;font-size:11.5px;white-space:nowrap;">${m.row1[1].v1}</td>
      <td style="padding:8px 8px;color:#CBD5E1;font-size:11.5px;white-space:nowrap;">${m.packSize}</td>
      <td style="padding:8px 8px;font-weight:800;color:#38BDF8;white-space:nowrap;">${m.container40HQ}</td>
      <td style="padding:8px 8px;font-weight:900;color:#00E5FF;font-size:13.5px;background:rgba(0,229,255,0.08);white-space:nowrap;">${m.wholesale}</td>
      <td style="padding:8px 8px;font-weight:800;color:#E2E8F0;white-space:nowrap;">${m.lote10}</td>
      <td style="padding:8px 8px;font-weight:700;color:#94A3B8;white-space:nowrap;">${m.retail}</td>
      <td style="padding:8px 8px;font-weight:900;color:#22C55E;font-size:13px;white-space:nowrap;">${m.profit}</td>
    </tr>
  `).join('');

  pages.push({
    page: 24,
    slug: 'tabela_master_atacado_40hq',
    html: buildCommonWrapper(`
      <div style="height:100%;padding:32px 44px;display:flex;flex-direction:column;justify-content:space-between;background:#0A0B0E;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #00E5FF;padding-bottom:12px;">
          <div>
            <div style="background:rgba(0,229,255,0.14);border:1px solid #00E5FF;color:#00E5FF;font-size:11px;font-weight:800;letter-spacing:2px;padding:4px 12px;border-radius:4px;display:inline-block;margin-bottom:6px;">TABELA OFICIAL DE FÁBRICA // ATACADO B2B & IMPORTAÇÃO 40HQ</div>
            <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:38px;font-weight:900;line-height:1;">MATRIZ DE PREÇOS DE ATACADO, LUCRO LOJISTA & CUBAGEM 40HQ</div>
          </div>
          <div style="font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:18px;font-weight:900;background:#1E293B;color:#00E5FF;padding:6px 16px;border-radius:4px;white-space:nowrap;">PÁG. 24 / 26</div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;border:1.5px solid rgba(255,255,255,0.15);">
          <thead>
            <tr style="background:#00E5FF;color:#0A0B0E;font-family:'Barlow Condensed','Bahnschrift',sans-serif;font-size:13px;font-weight:900;letter-spacing:0.5px;text-transform:uppercase;">
              <th style="padding:10px;">PART NUMBER</th>
              <th style="padding:10px;">MODELO OFICIAL Z8</th>
              <th style="padding:10px;">PLANTA / BASE</th>
              <th style="padding:10px;">MOTOR / MÓDULO</th>
              <th style="padding:10px;">BATERIA SÉRIE</th>
              <th style="padding:10px;">PACOTE SKD</th>
              <th style="padding:10px;">QTD / 40HQ</th>
              <th style="padding:10px;">ATACADO UNIT.</th>
              <th style="padding:10px;">LOTE 10 UNID.</th>
              <th style="padding:10px;">VAREJO SUG.</th>
              <th style="padding:10px;">LUCRO / UN.</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
          <div style="background:#111622;border:1.5px solid #00E5FF;border-radius:6px;padding:16px 20px;">
            <div style="font-size:11px;font-weight:800;color:#00E5FF;letter-spacing:1.5px;">CONDIÇÃO COMERCIAL ATACADO NACIONAL</div>
            <div style="font-size:14px;font-weight:700;color:#FFF;margin-top:4px;">Pedido Mínimo: 10 Motocicletas (Mix Livre de Modelos e Cores)</div>
            <div style="font-size:12px;color:#94A3B8;margin-top:2px;">Faturamento direto via CNPJ com Nota Fiscal, PDI e Garantia Nacional.</div>
          </div>
          <div style="background:#111622;border:1.5px solid #22C55E;border-radius:6px;padding:16px 20px;">
            <div style="font-size:11px;font-weight:800;color:#22C55E;letter-spacing:1.5px;">RETORNO MÉDIO DO LOTE DE 10 MOTOS</div>
            <div style="font-size:14px;font-weight:700;color:#FFF;margin-top:4px;">Investimento Médio: R$ 58.000 → Faturamento Varejo: R$ 95.000</div>
            <div style="font-size:12px;color:#22C55E;font-weight:700;margin-top:2px;">Lucro Bruto Médio por Lote: +R$ 35.000 a +R$ 42.000</div>
          </div>
          <div style="background:#111622;border:1.5px solid #F59E0B;border-radius:6px;padding:16px 20px;">
            <div style="font-size:11px;font-weight:800;color:#F59E0B;letter-spacing:1.5px;">CONTAINER FECHADO 40HQ (FACTORY DIRECT)</div>
            <div style="font-size:14px;font-weight:700;color:#FFF;margin-top:4px;">Embarque Direto Foshan / Huizhou / Base Norte</div>
            <div style="font-size:12px;color:#94A3B8;margin-top:2px;">Customização de cores, baterias até 125Ah e acompanhamento técnico Z8.</div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#94A3B8;">
          <span>Z8 EMOTION LTDA. // CNPJ 68.774.164/0001-00 // AV. DR. ADHEMAR DE BARROS, 566, SÃO JOSÉ DOS CAMPOS - SP</span>
          <strong style="color:#00E5FF;">MESA DE ATACADO & EXPANSÃO: (12) 99800-8818 // CHRISTIAN HIDEYUKI</strong>
        </div>
      </div>
    `)
  });

  return pages;
}

// Render key preview pages using Edge Headless
const instPages = getInstitutionalPages();
for (const p of instPages) {
  const htmlPath = path.join(pagesDir, `page_${String(p.page).padStart(2, '0')}_${p.slug}.html`);
  const pngPath = path.join(outputImgDir, `ficha_laf_z8_p${String(p.page).padStart(2, '0')}_${p.slug}.png`);
  fs.writeFileSync(htmlPath, p.html, 'utf-8');
  try {
    execSync(`"${edgePath}" --headless --disable-gpu --window-size=1600,1131 --screenshot="${pngPath}" "${toFileUrl(path.relative(rootDir, htmlPath))}"`, { stdio: 'pipe' });
    console.log('Rendered Institutional:', pngPath);
  } catch (e) {
    console.error('Error rendering', pngPath, e.message);
  }
}

for (const m of models) {
  const htmlPath = path.join(pagesDir, `page_${String(m.page).padStart(2, '0')}_${m.pn.replace(/[^a-zA-Z0-9]/g, '')}.html`);
  const pngPath = path.join(outputImgDir, `ficha_laf_z8_p${String(m.page).padStart(2, '0')}_${m.pn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.png`);
  fs.writeFileSync(htmlPath, buildProductSheetHTML(m), 'utf-8');
  try {
    execSync(`"${edgePath}" --headless --disable-gpu --window-size=1600,1131 --screenshot="${pngPath}" "${toFileUrl(path.relative(rootDir, htmlPath))}"`, { stdio: 'pipe' });
    console.log('Rendered Model:', pngPath);
  } catch (e) {
    console.error('Error rendering', pngPath, e.message);
  }
}
