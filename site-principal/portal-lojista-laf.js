/**
 * Z8 E-MOTION // PORTAL DO LOJISTA & MESA DE PEDIDOS — LAF EDITION 2026
 * Arquitetura 100% baseada no Design da Página Conceito (Mona Sans Variable + Brier + Contornos Topográficos + Animações Cinéticas)
 * Integrada ao Dossiê Industrial de 26 Páginas (CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.pdf)
 */

import {
  getCurrentCatalogUser,
  isCatalogApproved,
  isUserAdmin,
  logoutCatalogUser
} from './catalog-auth.js';
import { doc, setDoc } from 'firebase/firestore';
import { initFirebase } from './services/firebase-service.js';

export const LAF_PAGES_INDEX = [
  { page: 1, title: '01 // Capa Oficial — Catálogo de Produtos & Atacado 2026', group: 'institucional' },
  { page: 2, title: '02 // A Força por Trás da Marca & Matriz SJC', group: 'institucional' },
  { page: 3, title: '03 // Números que Movem o Futuro (KPIs B2B)', group: 'institucional' },
  { page: 4, title: '04 // Polos Industriais: Foshan & Huizhou + Base Norte', group: 'institucional' },
  { page: 5, title: '05 // Matriz Comparativa: Baterias de Lítio 48V/60V/72V 125Ah', group: 'institucional' },
  { page: 6, title: '06 // Suporte Pós-Venda, Portal OS & Oficina 2 Elevadores', group: 'institucional' },
  { page: 7, title: '07 // Manifesto: Power, Design and Freedom', group: 'institucional' },
  { page: 8, title: '08 // A Escolha Inteligente (5 Pilares B2B & Varejo)', group: 'institucional' },
  { page: 9, title: '09 // Ficha LAF 40/60 — Z8 Tank High-Speed 2000W (DB018)', group: 'performance' },
  { page: 10, title: '10 // Ficha LAF 40/60 — Z8 FX-10 Sport 1500W (DB043)', group: 'performance' },
  { page: 11, title: '11 // Ficha LAF 40/60 — Z8 FX-12 Sport 2000W (DB043-FX12)', group: 'performance' },
  { page: 12, title: '12 // Ficha LAF 40/60 — Z8 Tank 2 Expedition 2000W (DB018-T2)', group: 'performance' },
  { page: 13, title: '13 // Divisor 02 — Linha Urbana (1200W Executivo)', group: 'urbana' },
  { page: 14, title: '14 // Ficha LAF 40/60 — Z8 N710 Urban Plus 1200W (DB045)', group: 'urbana' },
  { page: 15, title: '15 // Divisor 03 — Linha Retrô & Custom (Candy & Chopper)', group: 'retro' },
  { page: 16, title: '16 // Ficha LAF 40/60 — Z8 Q11 Love Retrô 1000W (DB043-Q11)', group: 'retro' },
  { page: 17, title: '17 // Ficha LAF 40/60 — Z8 Q10 Xiao Q Vintage 1200W (DB038)', group: 'retro' },
  { page: 18, title: '18 // Ficha LAF 40/60 — Z8 Harley X12 Custom 1200W (XB-024)', group: 'retro' },
  { page: 19, title: '19 // Divisor 04 — Linha Cargo & E-Bikes (2000W & 500W)', group: 'cargo' },
  { page: 20, title: '20 // Ficha LAF 40/60 — Z8 U2 Delivery Cargo 2000W (XB-010)', group: 'cargo' },
  { page: 21, title: '21 // Ficha LAF 40/60 — Z8 GS-005 Golden Eagle 500W (GS-005)', group: 'cargo' },
  { page: 22, title: '22 // Ficha LAF 40/60 — Z8 Diamond King Kong 500W (GS-052)', group: 'cargo' },
  { page: 23, title: '23 // Tabela Oficial de Atacado, Margens & Contêiner 40HQ', group: 'atacado' },
  { page: 24, title: '24 // Por Que Escolher a Z8 E-Motion?', group: 'institucional' },
  { page: 25, title: '25 // Contracapa Institucional & Contato Diretoria SJC', group: 'institucional' },
  { page: 26, title: '26 // Ficha LAF 40/60 — Z8 N95C Max Comfort 1200W (DB039)', group: 'urbana' },
  { page: 27, title: '27 // Ficha LAF 40/60 — Z8 H26 Standard / N7 1200W (DB001)', group: 'urbana' }
];

// ==========================================================================
// CANONICAL MODEL IDENTIFIERS & CROSS-AREA ALIAS MAPPING
// ==========================================================================
export const CANONICAL_MODEL_ALIASES = {
  'z8-harley': 'z8-harley-x12',
  'z8-harley-x12': 'z8-harley-x12',
  'z8-u2': 'z8-u2-delivery',
  'z8-u2-delivery': 'z8-u2-delivery',
  'z8-n7': 'z8-h26',
  'z8-h26': 'z8-h26',
  'z8-tank': 'z8-tank',
  'z8-tank-2': 'z8-tank-2',
  'z8-fx10': 'z8-fx10',
  'z8-fx12': 'z8-fx12',
  'z8-n95c': 'z8-n95c',
  'z8-n710': 'z8-n710',
  'z8-q11': 'z8-q11',
  'z8-q10': 'z8-q10',
  'z8-gs005': 'z8-gs005',
  'z8-diamond': 'z8-diamond'
};

export function normalizeModelId(id) {
  if (!id) return '';
  const s = String(id).toLowerCase().trim();
  return CANONICAL_MODEL_ALIASES[s] || s;
}

export const LAF_MODELS = [
  {
    id: 'z8-tank',
    page: 10,
    categoryKey: 'performance',
    categoryLabel: '01 // LINHA PERFORMANCE',
    badgeShort: 'PERFORM.',
    pn: 'DB018',
    base: 'BASE NORTE (NORTHERN BASE)',
    shortTitle: 'Z8 TANK',
    fullName: 'Z8 TANK HIGH-SPEED 2000W TRAIL',
    wholesale: 7500,
    lote10: 75000,
    retail: 11500,
    profit: 4000,
    markupPct: '53,3%',
    marginPct: '34,8%',
    container40HQ: '85 pcs / 40HQ',
    containerQtyNum: 85,
    packSize: '179 × 57 × 83 cm',
    voltage: '60V / 72V (Suporta até 125Ah / 240 km)',
    leftHero: '/assets/models/z8_tank_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image19.png',
    lineupImg: '/assets/models/z8_tank_todas_as_cores_catalogo_clean.jpg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_10.jpg',
    colors: [
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank_amber.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank_black.jpg' },
      { name: 'Titanium Matte', hex: '#7C8288', img: '/assets/models/z8_tank_titanium.jpg' },
      { name: 'Studio Cutout', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image19.png' }
    ],
    callouts: [
      { num: '01', title: 'FARÓIS DUPLOS LED HALO', desc: 'Iluminação off-road de longo alcance com grade frontal.', img: '/assets/models/z8_tank_paulista_headlight.jpg' },
      { num: '02', title: 'MOTOR 2000W + 15G', desc: 'Torque extremo para subidas íngremes e velocidade até 80km/h.', img: '/assets/models/z8_tank_paulista_bodywork.jpg' },
      { num: '03', title: 'PNEUS NEVE 110/70-12', desc: 'Pneus Hot Melt texturizados para asfalto e terra.', img: '/assets/models/z8_tank_minas_headlight.jpg' },
      { num: '04', title: 'SISTEMA NFC + ALARME', desc: 'Partida sem chave por cartão NFC e antifurto remoto.', img: '/assets/models/z8_tank_amber.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '2000 W', v2: 'High Torque Sem Escova' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Máx: 60V-125Ah (240km)' },
      { k: 'CONTROLADOR', v1: '15G Módulo', v2: 'Alta Corrente Reforçado' },
      { k: 'FREIO', v1: 'Duplo Disco', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '110/70-12', v2: 'Textura Mista Hot Melt' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 80 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 70 / 240 km', v2: 'Conforme Pack Lítio' },
      { k: 'AMORTECEDOR', v1: 'Hidr. Grosso D.', v2: 'Mola Damping Traseira' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Tubular Duplo (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '179×57×83 cm', v2: '85 pcs / 40HQ SKD' },
      { k: 'PESO s/ BAT.', v1: '80 kg (Líq.)', v2: '90 kg (Bruto) Trail' },
      { k: 'INTELIGÊNCIA', v1: 'NFC + Alarme', v2: 'Controle + Painel LCD' }
    ]
  },
  {
    id: 'z8-tank-2',
    page: 12,
    categoryKey: 'performance',
    categoryLabel: '01 // LINHA PERFORMANCE',
    badgeShort: 'PERFORM.',
    pn: 'DB018-T2',
    base: 'BASE NORTE (NORTHERN BASE)',
    shortTitle: 'Z8 TANK 2',
    fullName: 'Z8 TANK 2 HIGH-SPEED 2000W TRAIL',
    wholesale: 8500,
    lote10: 85000,
    retail: 12500,
    profit: 4000,
    markupPct: '47,1%',
    marginPct: '32,0%',
    container40HQ: '85 pcs / 40HQ',
    containerQtyNum: 85,
    packSize: '179 × 57 × 83 cm',
    voltage: '60V / 72V (Suporta até 125Ah / 240 km)',
    leftHero: '/assets/models/z8_tank2_studio.jpg',
    rightMain: '/assets/models/laf_pdf_extracted/tank2_white_clean.jpg',
    lineupImg: '/assets/models/laf_pdf_extracted/tank2_lineup_catalogo.jpg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_12.jpg',
    colors: [
      { name: 'Pearl White Trail', hex: '#F1F5F9', img: '/assets/models/laf_pdf_extracted/tank2_white_clean.jpg' },
      { name: 'White Studio', hex: '#E2E8F0', img: '/assets/models/z8_tank2_studio.jpg' },
      { name: 'Midnight Black', hex: '#181A1D', img: '/assets/models/z8_tank2_black.jpg' },
      { name: 'Desert Amber', hex: '#C6892B', img: '/assets/models/z8_tank2_amber.jpg' },
      { name: 'Variações Fábrica', hex: '#00F0FF', img: '/assets/models/laf_pdf_extracted/tank2_lineup_catalogo.jpg' }
    ],
    callouts: [
      { num: '01', title: 'FARÓIS DUPLOS LED HALO', desc: 'Iluminação off-road de longo alcance com grade frontal.', img: '/assets/models/laf_pdf_extracted/tank2_callout_01.jpg' },
      { num: '02', title: 'MOTOR 2000W + 15G + BAÚ', desc: 'Torque extremo para subidas íngremes, 80km/h e baú traseiro.', img: '/assets/models/laf_pdf_extracted/tank2_callout_02.jpg' },
      { num: '03', title: 'PNEUS NEVE 110/70-12', desc: 'Pneus Hot Melt texturizados para asfalto e terra.', img: '/assets/models/laf_pdf_extracted/tank2_callout_03.jpg' },
      { num: '04', title: 'SISTEMA GPS + NFC + BLUETOOTH', desc: 'Sistema de GPS integrado, partida sem chave NFC e antifurto remoto.', img: '/assets/models/laf_pdf_extracted/tank2_callout_04.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '2000 W', v2: 'High Torque Sem Escova' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Máx: 60V-125Ah (240km)' },
      { k: 'CONTROLADOR', v1: '15G Módulo', v2: 'Alta Corrente Reforçado' },
      { k: 'FREIO', v1: 'Duplo Disco', v2: 'Hidráulico a Óleo D/T' },
      { k: 'PNEU', v1: '110/70-12', v2: 'Textura Mista Hot Melt' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 80 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 70 / 240 km', v2: 'Com Pack 60V-125Ah' },
      { k: 'AMORTECEDOR', v1: 'Hidr. Grosso D.', v2: 'Mola Damping Traseira' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Tubular Duplo (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '179×57×83 cm', v2: '85 pcs / 40HQ SKD' },
      { k: 'PESO s/ BAT.', v1: '80 kg (Líq.)', v2: '90 kg (Bruto) Chassi Trail' },
      { k: 'INTELIGÊNCIA', v1: 'NFC + SMART', v2: 'GPS, Bluetooth, Painel Smart' }
    ]
  },
  {
    id: 'z8-fx10',
    page: 11,
    categoryKey: 'performance',
    categoryLabel: '01 // LINHA PERFORMANCE',
    badgeShort: 'PERFORM.',
    pn: 'DB043',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'FX-10 SPORT',
    fullName: 'Z8 FX-10 SPORT 1500W BRUSHLESS',
    wholesale: 6700,
    wholesaleCardRef: null,
    lote10: 67000,
    retail: 9000,
    profit: 2300,
    markupPct: '34,3%',
    marginPct: '25,6%',
    container40HQ: '90 pcs / 40HQ',
    containerQtyNum: 90,
    packSize: '162 × 50 × 85 cm',
    voltage: '60V 125Ah Lítio de Série (Recarga 4-8h)',
    leftHero: '/assets/models/z8_fx10_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image15.png',
    lineupImg: '/assets/models/pptx_extracted/image16.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_11.jpg',
    colors: [
      { name: 'Cyber Silver', hex: '#8A929A', img: '/assets/models/z8_fx10_studio.jpg' },
      { name: 'Stealth Black', hex: '#15171A', img: '/assets/models/z8_fx10_black.jpg' },
      { name: 'Glacier White', hex: '#F0F2F5', img: '/assets/models/z8_fx10_white.jpg' },
      { name: 'Lineup 6 Cores', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image16.png' }
    ],
    callouts: [
      { num: '01', title: 'CARENAGEM SPORT FX', desc: 'Design aerodinâmico agressivo em 6 cores metálicas.', img: '/assets/models/z8_fx10_sjc_headlight.jpg' },
      { num: '02', title: 'MOTOR 1500W + 12G-38A', desc: 'Aceleração progressiva até 68 km/h em pista.', img: '/assets/models/z8_fx10_sjc_bodywork.jpg' },
      { num: '03', title: 'DUPLO DISCO 180mm', desc: 'Freios a disco hidráulicos dianteiro e traseiro 180mm.', img: '/assets/models/z8_fx10_capivari_headlight.jpg' },
      { num: '04', title: 'PNEU LARGO 130/60-10', desc: 'Pneu de vácuo esportivo de maior aderência em curvas.', img: '/assets/models/z8_fx10_capivari_bodywork.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1500 W', v2: 'Sem Escova High Speed' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Alta Descarga Removível' },
      { k: 'CONTROLADOR', v1: '12G-38A', v2: 'Módulo Sport 38 Amperes' },
      { k: 'FREIO', v1: 'Disco 180mm', v2: 'Hidráulico Óleo D/T' },
      { k: 'PNEU', v1: '130/60-10', v2: 'Pneu Vácuo Perfil Largo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 68 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Recarga 4-8h Bivolt' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Traseira' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Alta Resistência (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '162×50×85 cm', v2: '90 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '70 kg (Bruto)' },
      { k: 'RECURSOS', v1: 'Alarme + USB', v2: 'Painel LED + Encosto' }
    ]
  },
  {
    id: 'z8-fx12',
    page: 11,
    categoryKey: 'performance',
    categoryLabel: '01 // LINHA PERFORMANCE',
    badgeShort: 'PERFORM.',
    pn: 'DB043-FX12',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'FX-12 SPORT',
    fullName: 'Z8 FX-12 SPORT 2000W BRUSHLESS',
    wholesale: 7800,
    lote10: 78000,
    retail: 10600,
    profit: 2800,
    markupPct: '35,9%',
    marginPct: '26,4%',
    container40HQ: '90 pcs / 40HQ',
    containerQtyNum: 90,
    packSize: '162 × 50 × 85 cm',
    voltage: '60V 125Ah Lítio de Série (Recarga 4-8h)',
    leftHero: '/assets/models/z8_fx12_studio.jpg',
    rightMain: '/assets/models/laf_pdf_extracted/fx12_white_clean_silver.jpg',
    lineupImg: '/assets/models/laf_pdf_extracted/fx12_white_clean_orange.jpg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_11.jpg',
    colors: [
      { name: 'Titanium Silver', hex: '#94A3B8', img: '/assets/models/laf_pdf_extracted/fx12_white_clean_silver.jpg' },
      { name: 'Sunset Copper', hex: '#C2410C', img: '/assets/models/laf_pdf_extracted/fx12_white_clean_orange.jpg' },
      { name: 'Silver Studio', hex: '#64748B', img: '/assets/models/z8_fx12_studio.jpg' },
      { name: 'Copper Studio', hex: '#EA580C', img: '/assets/models/z8_fx12_orange.jpg' },
      { name: 'Obsidian Black', hex: '#181A1D', img: '/assets/models/z8_fx12_black.jpg' }
    ],
    callouts: [
      { num: '01', title: 'CARENAGEM SPORT + GAIOLA', desc: 'Design aerodinâmico agressivo com gaiola de proteção e baú traseiro.', img: '/assets/models/laf_pdf_extracted/fx12_callout_01.jpg' },
      { num: '02', title: 'MOTOR 2000W + 12G-38A', desc: 'Aceleração progressiva até 78 km/h em pista.', img: '/assets/models/laf_pdf_extracted/fx12_callout_02.jpg' },
      { num: '03', title: 'DUPLO DISCO 180mm', desc: 'Freios a disco hidráulicos dianteiro e traseiro 180mm.', img: '/assets/models/laf_pdf_extracted/fx12_callout_03.jpg' },
      { num: '04', title: 'PNEU LARGO 130/60-10', desc: 'Pneu de vácuo esportivo de maior aderência em curvas.', img: '/assets/models/laf_pdf_extracted/fx12_callout_04.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '2000 W', v2: 'Sem Escova High Speed' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Alta Descarga Removível' },
      { k: 'CONTROLADOR', v1: '12G-38A', v2: 'Módulo Sport 38 Amperes' },
      { k: 'FREIO', v1: 'Disco 180mm', v2: 'Hidráulico Óleo D/T' },
      { k: 'PNEU', v1: '130/60-10', v2: 'Pneu Vácuo Perfil Largo' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 78 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Recarga 4-8h Bivolt' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Duplo Curso' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Alta Resistência (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '162×50×85 cm', v2: '90 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '70 kg (Bruto) Equilibrado' },
      { k: 'INTELIGÊNCIA', v1: 'NFC + SMART', v2: 'GPS, Bluetooth, Painel Smart' }
    ]
  },
  {
    id: 'z8-n95c',
    page: 13,
    categoryKey: 'urbana',
    categoryLabel: '02 // LINHA URBANA EXECUTIVA',
    badgeShort: 'URBANA',
    pn: 'DB039',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'N95C MAX',
    fullName: 'Z8 N95C MAX COMFORT 1200W EXECUTIVA',
    wholesale: 6500,
    lote10: 65000,
    retail: 10000,
    profit: 3500,
    markupPct: '53,8%',
    marginPct: '35,0%',
    container40HQ: '112 pcs / 40HQ',
    containerQtyNum: 112,
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 125Ah Lítio de Série',
    leftHero: '/assets/models/z8_n95c_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image9.png',
    lineupImg: '/assets/models/pptx_extracted/image10.jpeg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_13.jpg',
    colors: [
      { name: 'Graphite Orange', hex: '#484C52', img: '/assets/models/z8_n95c_studio.jpg' },
      { name: 'Obsidian Black', hex: '#141518', img: '/assets/models/z8_n95c_black.jpg' },
      { name: 'Pearl White', hex: '#EAECEF', img: '/assets/models/z8_n95c_white.jpg' },
      { name: 'Cores de Fábrica', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image10.jpeg' }
    ],
    callouts: [
      { num: '01', title: 'BARRA LED DRL FRONTAL', desc: 'Assinatura luminosa executiva de ponta a ponta em LED.', img: '/assets/models/pptx_extracted/image11.jpeg' },
      { num: '02', title: 'MOTOR 1200W 27H + 30A', desc: 'Motor magnético 27H silencioso com controlador de 30A.', img: '/assets/models/pptx_extracted/image10.jpeg' },
      { num: '03', title: 'PNEUS LARGOS 130/70-10', desc: 'Estabilidade superior e conforto em pisos irregulares.', img: '/assets/models/z8_n95c_white.jpg' },
      { num: '04', title: 'BANCO DUPLO VIP', desc: 'Assento anatômico costurado com bagageiro/encosto.', img: '/assets/models/z8_n95c_black.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1200 W (27H)', v2: 'Alto Rendimento Brushless' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Recarga 4-8h Removível' },
      { k: 'CONTROLADOR', v1: '30A Módulo', v2: 'Entrega Suave Inteligente' },
      { k: 'FREIO', v1: 'Disco Diant.', v2: 'Tambor Traseiro Preciso' },
      { k: 'PNEU', v1: '130/70-10', v2: 'Pneus Alargados Sem Câmara' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Uso Urbano Econômico' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Max Comfort' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Proteção Lateral (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '112 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '65 kg (Bruto)' },
      { k: 'DESTAQUE', v1: 'LED Perimetral', v2: 'Painel Digital + Keyless' }
    ]
  },
  {
    id: 'z8-h26',
    alias: 'z8-n7',
    page: 14,
    categoryKey: 'urbana',
    categoryLabel: '02 // LINHA URBANA EXECUTIVA',
    badgeShort: 'URBANA',
    pn: 'DB001',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'H26 (N7)',
    fullName: 'Z8 H26 STANDARD (N7) 1200W',
    wholesale: 5500,
    lote10: 55000,
    retail: 9500,
    profit: 4000,
    markupPct: '72,7%',
    marginPct: '42,1%',
    container40HQ: '109 a 130 pcs / 40HQ',
    containerQtyNum: 120,
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 125Ah Lítio / Chumbo',
    leftHero: '/assets/models/z8_n7_studio.jpg',
    rightMain: '/assets/models/laf_pdf_extracted/p14_img3_xref66.png',
    lineupImg: '/assets/models/laf_pdf_extracted/p14_img2_xref65.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_14.jpg',
    colors: [
      { name: 'Emerald Coastal (LAF)', hex: '#059669', img: '/assets/models/laf_pdf_extracted/p14_img3_xref66.png' },
      { name: 'Pearl Beach (LAF)', hex: '#E2E8F0', img: '/assets/models/laf_pdf_extracted/p14_img2_xref65.png' },
      { name: 'Emerald Studio', hex: '#1B4D3E', img: '/assets/models/z8_n7_studio.jpg' },
      { name: 'Piano Black', hex: '#141619', img: '/assets/models/z8_n7_black.jpg' },
      { name: 'Titanium Silver', hex: '#94A3B8', img: '/assets/models/z8_n7_silver.jpg' },
      { name: 'Catálogo 3 Cores', hex: '#00F0FF', img: '/assets/models/z8_h26_todas_as_cores_catalogo_clean.jpg' }
    ],
    callouts: [
      { num: '01', title: 'CAMPEÃ DE GIRO COMERCIAL', desc: 'O modelo mais vendido com 72,7% de markup para a loja.', img: '/assets/models/laf_pdf_extracted/p14_img3_xref66.png' },
      { num: '02', title: 'DUPLO DISCO HIDR. 180mm', desc: 'Frenagem hidráulica a óleo nas duas rodas de série.', img: '/assets/models/laf_pdf_extracted/p14_img2_xref65.png' },
      { num: '03', title: 'MOTOR 1200W + 12G-33A', desc: 'Controlador modular de 33A com resposta imediata.', img: '/assets/models/z8_n7_black.jpg' },
      { num: '04', title: 'SISTEMA ANTIFURTO', desc: 'Controle remoto inteligente com trava elétrica de roda.', img: '/assets/models/z8_n7_silver.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Sem Escova Brushless' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Autonomia 50km Removível' },
      { k: 'CONTROLADOR', v1: '12G-33A', v2: 'Módulo 33A Alta Eficiência' },
      { k: 'FREIO', v1: 'Duplo Disco', v2: '180mm Hidráulico D/T' },
      { k: 'PNEU', v1: '3.00-10', v2: 'Pneu de Vácuo Aro 10' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Custo Médio R$ 1,80/carga' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Urbano' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Piso Plano (Carga: 200 kg)' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '109 a 130 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '70 kg (Bruto)' },
      { k: 'FUNÇÃO SMART', v1: 'Alarme Remoto', v2: 'Keyless Start + Encosto' }
    ]
  },
  {
    id: 'z8-n710',
    page: 15,
    categoryKey: 'urbana',
    categoryLabel: '02 // LINHA URBANA EXECUTIVA',
    badgeShort: 'URBANA',
    pn: 'DB045-N710',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'N710 PLUS',
    fullName: 'Z8 N710 URBAN PLUS 1200W MECHA',
    wholesale: 5300,
    lote10: 53000,
    retail: 9500,
    profit: 4200,
    markupPct: '79,2%',
    marginPct: '44,2%',
    container40HQ: '115 pcs / 40HQ',
    containerQtyNum: 115,
    packSize: '158 × 45 × 85 cm',
    voltage: '60V 125Ah Lítio de Série',
    leftHero: '/assets/models/z8_n710_studio.jpg',
    rightMain: '/assets/models/cutouts/z8_n710_cutout.png',
    lineupImg: '/assets/models/pptx_extracted/image6.jpeg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_15.jpg',
    colors: [
      { name: 'Pearl White / Yellow', hex: '#F2F4F7', img: '/assets/models/pptx_extracted/image4.jpeg' },
      { name: 'Obsidian Black / Yellow', hex: '#141619', img: '/assets/models/pptx_extracted/image5.jpeg' },
      { name: 'Racing Red / Yellow', hex: '#DC2626', img: '/assets/models/pptx_extracted/image6.jpeg' },
      { name: 'Electric Blue / Yellow', hex: '#2563EB', img: '/assets/models/pptx_extracted/image7.jpeg' },
      { name: 'Titanium Grey / Yellow', hex: '#64748B', img: '/assets/models/pptx_extracted/image8.jpeg' }
    ],
    callouts: [
      { num: '01', title: 'MAIOR LUCRO BRUTO (R$ 4.200)', desc: 'Excelente posicionamento de preço de compra vs venda.', img: '/assets/models/pptx_extracted/image4.jpeg' },
      { num: '02', title: 'FAROL LED MECHA', desc: 'Design frontal cyber-mecha com projetor de alta nitidez.', img: '/assets/models/pptx_extracted/image5.jpeg' },
      { num: '03', title: 'DUPLO DISCO 180mm', desc: 'Freios hidráulicos dianteiro e traseiro de série.', img: '/assets/models/pptx_extracted/image6.jpeg' },
      { num: '04', title: 'PORTA-OBJETOS E USB', desc: 'Espaço funcional para celular e itens do dia a dia.', img: '/assets/models/pptx_extracted/image7.jpeg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Sem Escova High Perf.' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Ciclo Profundo Removível' },
      { k: 'CONTROLADOR', v1: '12G Módulo', v2: 'Sinusoidal Silencioso' },
      { k: 'FREIO', v1: 'Duplo Disco', v2: '180mm Hidráulico D/T' },
      { k: 'PNEU', v1: '3.00-10', v2: 'Pneu de Vácuo Urbano' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Recarga 4-6h Bivolt' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Conforto' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Urban Reforçado (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '115 pcs / 40HQ Foshan' },
      { k: 'PESO s/ BAT.', v1: '58 kg (Líq.)', v2: '68 kg (Bruto)' },
      { k: 'FUNÇÃO SMART', v1: 'Alarme + NFC', v2: 'Painel Digital + Mecha' }
    ]
  },
  {
    id: 'z8-q11',
    page: 17,
    categoryKey: 'retro',
    categoryLabel: '03 // LINHA RETRÔ & CUSTOM',
    badgeShort: 'RETRÔ',
    pn: 'DB043-Q11',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'Q11 LOVE',
    fullName: 'Z8 Q11 COMPACT RETRÔ CANDY STYLE 1000W',
    wholesale: 5200,
    lote10: 52000,
    retail: 9300,
    profit: 4100,
    markupPct: '78,8%',
    marginPct: '44,1%',
    container40HQ: '109 pcs / 40HQ',
    containerQtyNum: 109,
    packSize: '158 × 45 × 85 cm',
    voltage: '48V - 60V (Lítio 60V 125Ah de Série)',
    leftHero: '/assets/models/z8_q10_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image1.jpeg',
    lineupImg: '/assets/models/pptx_extracted/image2.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_17.jpg',
    colors: [
      { name: 'Candy Pink Love', hex: '#F472B6', img: '/assets/models/z8_q10_studio.jpg' },
      { name: 'Pink Studio Cutout', hex: '#FB7185', img: '/assets/models/pptx_extracted/image1.jpeg' },
      { name: '6 Cores Candy', hex: '#38BDF8', img: '/assets/models/pptx_extracted/image2.png' }
    ],
    callouts: [
      { num: '01', title: 'BAÚ TRASEIRO DE SÉRIE', desc: 'Acompanha baú exclusivo na mesma cor pastel da carenagem.', img: '/assets/models/pptx_extracted/image1.jpeg' },
      { num: '02', title: 'AMORTECEDOR 27 NÚCLEOS', desc: 'Suspensão dianteira hidráulica 27 núcleos ultra macia.', img: '/assets/models/pptx_extracted/image2.png' },
      { num: '03', title: 'DISCO 180mm FRONTAL', desc: 'Freio a disco dianteiro 180mm e tambor traseiro seguro.', img: '/assets/models/z8_q10_studio.jpg' },
      { num: '04', title: '6 CORES CANDY PASTEL', desc: 'Rosa, Azul Bebê, Verde Menta, Creme, Branco e Cinza.', img: '/assets/models/cutouts/z8_q10_cutout.png' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1000 W', v2: 'Alta Eficiência Brushless' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Suporta 48V-60V' },
      { k: 'CONTROLADOR', v1: '9G Controlador', v2: 'Suave e Linear' },
      { k: 'FREIO', v1: 'Disco 180mm D.', v2: 'Tambor Traseiro Progressivo' },
      { k: 'PNEU', v1: '3.00-10', v2: 'Pneu de Vácuo Aro 10' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 45 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 40-50 km', v2: 'Uso Diário Econômico' },
      { k: 'AMORTECEDOR', v1: '27 Núcleos Hidr.', v2: 'Traseiro Duplo Macio' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Estilo Italiano (180 kg)' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '109 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '70 kg (Bruto)' },
      { k: 'ACESSÓRIO', v1: 'Baú Integrado', v2: 'Painel Digital + Halo LED' }
    ]
  },
  {
    id: 'z8-q10',
    page: 18,
    categoryKey: 'retro',
    categoryLabel: '03 // LINHA RETRÔ & CUSTOM',
    badgeShort: 'RETRÔ',
    pn: 'DB038 (Q520S1)',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'Q10 XIAO Q',
    fullName: 'Z8 Q10 VINTAGE (XIAO Q / Q520S1) 1200W',
    wholesale: 5800,
    lote10: 58000,
    retail: 9800,
    profit: 4000,
    markupPct: '69,0%',
    marginPct: '40,8%',
    container40HQ: '109 a 130 pcs / 40HQ',
    containerQtyNum: 120,
    packSize: '158 × 45 × 85 cm',
    voltage: '48-60V (Suporta Lítio até 60V 120Ah / 240 km!)',
    leftHero: '/assets/models/z8_q11_studio.jpg',
    rightMain: '/assets/models/cutouts/z8_q11_cutout.png',
    lineupImg: '/assets/models/pptx_extracted/image3.jpg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_18.jpg',
    colors: [
      { name: 'Pastel Yellow (LAF)', hex: '#EAB308', img: '/assets/models/z8_q11_studio.jpg' },
      { name: 'Sage Olive', hex: '#769482', img: '/assets/models/z8_q10_green.jpg' },
      { name: 'Onyx Black', hex: '#1A1C1E', img: '/assets/models/z8_q10_black.jpg' },
      { name: 'Lineup Vintage', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image3.jpg' }
    ],
    callouts: [
      { num: '01', title: 'ATÉ 60V 120Ah / 125Ah', desc: 'Cofre projetado para suportar bateria de longa duração.', img: '/assets/models/z8_q10_madalena_headlight.jpg' },
      { num: '02', title: 'FAROL HALO RGB GUIDÃO', desc: 'Farol circular retrô cromado com anel angel-eye colorido.', img: '/assets/models/z8_q10_madalena_bodywork.jpg' },
      { num: '03', title: 'MOTOR 1200W + 30A', desc: 'Mais forte da categoria retrô com controlador de 30 Amperes.', img: '/assets/models/z8_q10_green.jpg' },
      { num: '04', title: 'BANCO COURO CARAMELO', desc: 'Acabamento boutique europeu em cores vibrantes e pastel.', img: '/assets/models/z8_q10_black.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1200 W', v2: 'Alto Torque Brushless' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Máx: 60V 120Ah / 125Ah' },
      { k: 'CONTROLADOR', v1: '30A Módulo', v2: '30 Amperes Forte Subida' },
      { k: 'FREIO', v1: 'Disco Diant.', v2: 'Tambor Traseiro Seguro' },
      { k: 'PNEU', v1: '3.00-10', v2: 'Pneu de Vácuo Aro 10' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 45 km/h' },
      { k: 'AUTONOMIA', v1: '40 a 240 km', v2: 'Recarga 4-6h Bivolt' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Damping Macia' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Chassi Xiao Q (180 kg)' },
      { k: 'PACOTE 40HQ', v1: '158×45×85 cm', v2: '109 a 130 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '55 kg (Líq.)', v2: '60 kg (Bruto) Mais Leve' },
      { k: 'ILUMINAÇÃO', v1: 'Halo LED RGB', v2: 'Setas Neon + Painel Retrô' }
    ]
  },
  {
    id: 'z8-harley-x12',
    alias: 'z8-harley',
    page: 19,
    categoryKey: 'retro',
    categoryLabel: '03 // LINHA RETRÔ & CUSTOM',
    badgeShort: 'CUSTOM',
    pn: 'DB039 / XB-024',
    base: 'BASE NORTE (NORTHERN BASE)',
    shortTitle: 'HARLEY X12',
    fullName: 'Z8 HARLEY X12 CUSTOM CHOPPER 1200W',
    wholesale: 6500,
    lote10: 65000,
    retail: 10000,
    profit: 3500,
    markupPct: '53,8%',
    marginPct: '35,0%',
    container40HQ: '216 pcs / 40HQ',
    containerQtyNum: 216,
    packSize: '130 × 37 × 65 cm',
    voltage: '60V 125Ah Lítio Removível',
    leftHero: '/assets/models/z8_harley_crimson.jpg',
    rightMain: '/assets/models/pptx_extracted/image12.png',
    lineupImg: '/assets/models/pptx_extracted/image13.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_19.jpg',
    colors: [
      { name: 'Crimson Red', hex: '#A6192E', img: '/assets/models/z8_harley_crimson.jpg' },
      { name: 'Brushed Silver', hex: '#B4B9BE', img: '/assets/models/z8_harley_silver.jpg' },
      { name: 'Chopper Lineup', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image13.png' }
    ],
    callouts: [
      { num: '01', title: 'ESTILO CHOPPER AMERICANO', desc: 'Guidão alto custom, garfo longo e postura estradeira única.', img: '/assets/models/z8_harley_carvalho_headlight.jpg' },
      { num: '02', title: 'PNEUS LARGOS 130/70-10', desc: 'Visual musculoso com alta estabilidade em retas e curvas.', img: '/assets/models/z8_harley_carvalho_bodywork.jpg' },
      { num: '03', title: 'SOM BLUETOOTH + NFC', desc: 'Caixa de som integrada para música e partida sem chave.', img: '/assets/models/pptx_extracted/image13.png' },
      { num: '04', title: 'ALTA DENSIDADE 40HQ', desc: 'Embalagem inteligente que comporta 216 motos por 40HQ.', img: '/assets/models/pptx_extracted/image14.png' }
    ],
    specs: [
      { k: 'MOTOR', v1: '1200 W (27H)', v2: 'Alto Torque Cubo Traseiro' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Removível (Recarga 4-8h)' },
      { k: 'CONTROLADOR', v1: '30A Módulo', v2: '30 Amperes Custom Tuned' },
      { k: 'FREIO', v1: 'Disco Diant.', v2: 'Tambor Traseiro Hidr.' },
      { k: 'PNEU', v1: '130/70-10', v2: 'Pneu Alargado Chopper' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 50 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 45-50 km', v2: 'Passeio Urbano Cruiser' },
      { k: 'AMORTECEDOR', v1: 'Garfo Hidr. D.', v2: 'Duplo Mola Traseira' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'Berço Duplo (200 kg)' },
      { k: 'PACOTE 40HQ', v1: '130×37×65 cm', v2: '216 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '60 kg (Líq.)', v2: '65 kg (Bruto) Centro Baixo' },
      { k: 'EXCLUSIVO', v1: 'Som Bluetooth', v2: 'Banco VIP Duplo + Keyless' }
    ]
  },
  {
    id: 'z8-u2-delivery',
    alias: 'z8-u2',
    page: 21,
    categoryKey: 'cargo',
    categoryLabel: '04 // LINHA CARGO & E-BIKES',
    badgeShort: 'CARGO',
    pn: 'XB-010',
    base: 'BASES DE FOSHAN & HUIZHOU',
    shortTitle: 'U2 CARGO',
    fullName: 'Z8 U2 DELIVERY CARGO 2000W ARO 12',
    wholesale: 6000,
    lote10: 60000,
    retail: 9500,
    profit: 3500,
    markupPct: '58,3%',
    marginPct: '36,8%',
    container40HQ: '168 a 216 pcs / 40HQ',
    containerQtyNum: 192,
    packSize: '148 × 37 × 75 cm',
    voltage: '48V - 60V - 72V (Lítio 60V 125Ah)',
    leftHero: '/assets/models/z8_u2_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image17.jpeg',
    lineupImg: '/assets/models/pptx_extracted/image18.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_21.jpg',
    colors: [
      { name: 'Cargo Black', hex: '#1A1C1E', img: '/assets/models/z8_u2_black.jpg' },
      { name: 'Fleet White', hex: '#F3F5F7', img: '/assets/models/z8_u2_white.jpg' },
      { name: '4 Cores Frota', hex: '#F97316', img: '/assets/models/pptx_extracted/image18.png' }
    ],
    callouts: [
      { num: '01', title: 'MOTOR 2000W + MÓDULO 12G', desc: 'Força industrial para entregas pesadas e uso profissional.', img: '/assets/models/z8_u2_warehouse_headlight.jpg' },
      { num: '02', title: 'CAIXA CENTRAL + SELIM LONGO', desc: 'Compartimento de bateria grande e novo baú central integrado.', img: '/assets/models/z8_u2_warehouse_bodywork.jpg' },
      { num: '03', title: 'RODAS LIGA ARO 12 + 220mm', desc: 'Rodas de alumínio aro 12 com duplo disco hidráulico 220mm.', img: '/assets/models/z8_u2_black.jpg' },
      { num: '04', title: '4 CORES CORPORATIVAS', desc: 'Creme/Laranja, Preto/Laranja, Branco/Laranja e Verde Militar.', img: '/assets/models/z8_u2_white.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '2000 W', v2: 'Sem Escova Heavy-Duty' },
      { k: 'BATERIA', v1: 'Lítio 60V 125Ah', v2: 'Cofre Ampliado (48-72V)' },
      { k: 'CONTROLADOR', v1: '12G Reforçado', v2: 'Módulo Cargo Dissipação' },
      { k: 'FREIO', v1: 'Duplo Disco', v2: '220mm Hidráulico D/T' },
      { k: 'PNEU', v1: '90/90-12', v2: 'Vácuo Aro 12 + Alumínio' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx Pista: 70 km/h' },
      { k: 'AUTONOMIA', v1: 'Até 50-60 km', v2: 'Expansível Uso Comercial' },
      { k: 'AMORTECEDOR', v1: 'Hidráulico D.', v2: 'Mola Carga Reforçada' },
      { k: 'CONFIGURAÇÃO', v1: 'Novo Baú Médio', v2: 'Selim Longo + Grade' },
      { k: 'PACOTE 40HQ', v1: '148×31.5×75 cm', v2: '168 / 192 / 216 pcs' },
      { k: 'PESO s/ BAT.', v1: '55 kg (Líq.)', v2: '65 kg (Bruto) Aço Carbono' },
      { k: 'PAINEL', v1: 'Tela Blade LED', v2: 'Alarme Remoto + Halo' }
    ]
  },
  {
    id: 'z8-gs005',
    page: 22,
    categoryKey: 'cargo',
    categoryLabel: '04 // LINHA CARGO & E-BIKES',
    badgeShort: 'E-BIKE',
    pn: 'GS-005',
    base: 'BASE NORTE (NORTHERN BASE)',
    shortTitle: 'GS-005',
    fullName: 'Z8 GS-005 GOLDEN EAGLE 500W PEDELEC',
    wholesale: 3200,
    lote10: 32000,
    retail: 6200,
    profit: 3000,
    markupPct: '93,8%',
    marginPct: '48,4%',
    container40HQ: '288 a 294 pcs / 40HQ',
    containerQtyNum: 290,
    packSize: '129 × 31.5 × 62 cm',
    voltage: '48V 125Ah / 60V 125Ah Lítio (50 km)',
    leftHero: '/assets/models/z8_gs005_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image20.jpeg',
    lineupImg: '/assets/models/pptx_extracted/image21.jpeg',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_22.jpg',
    colors: [
      { name: 'Matte Graphite', hex: '#344054', img: '/assets/models/z8_gs005_studio.jpg' },
      { name: 'Golden Eagle Mix', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image21.jpeg' }
    ],
    callouts: [
      { num: '01', title: '93,7% MARKUP P/ LOJISTA', desc: 'Menor ticket de entrada B2B (R$ 3.200) e giro imediato.', img: '/assets/models/pptx_extracted/image20.jpeg' },
      { num: '02', title: 'MOTOR 500W COBRE PURO', desc: 'Bobinamento em cobre puro de alta eficiência e durabilidade.', img: '/assets/models/pptx_extracted/image21.jpeg' },
      { num: '03', title: 'CAPÔ MECHA LED + SETAS', desc: 'Farol frontal estilo mecha com indicadores de direção.', img: '/assets/models/pptx_extracted/image22.jpeg' },
      { num: '04', title: 'CESTA + ASSENTO DUPLO', desc: 'Pronta para compras, entregas leves e transporte diário.', img: '/assets/models/pptx_extracted/image23.jpeg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '500 W', v2: 'Cobre Puro Brushless' },
      { k: 'BATERIA', v1: 'Lítio 48V/60V', v2: '125Ah (Autonomia 50km)' },
      { k: 'CONTROLADOR', v1: '6G-NEW Módulo', v2: 'Nova Geração Suave' },
      { k: 'FREIO', v1: 'Tambor D/T', v2: 'Expansão Traseira' },
      { k: 'PNEU', v1: '14 × 2.5 pol.', v2: 'Pneu de Vácuo' },
      { k: 'VELOCIDADE', v1: '28-32 km/h', v2: 'Autopropelido CONTRAN' },
      { k: 'CARREGADOR', v1: 'Bivolt 110-220V', v2: 'Recarga Econômica' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Pedal + Acelerador' },
      { k: 'QUADRO / CARGA', v1: 'Aço Alto Carbono', v2: 'Capacidade: 150 kg' },
      { k: 'PACOTE 40HQ', v1: '129×31.5×62 cm', v2: '288 a 294 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '30 kg (Líq.)', v2: '35 kg (Bruto)' },
      { k: 'DESTAQUE', v1: 'Capô LED Mecha', v2: 'Setas + Cesta Frontal' }
    ]
  },
  {
    id: 'z8-diamond',
    page: 23,
    categoryKey: 'cargo',
    categoryLabel: '04 // LINHA CARGO & E-BIKES',
    badgeShort: 'E-BIKE',
    pn: 'GS-052',
    base: 'BASE NORTE (NORTHERN BASE)',
    shortTitle: 'DIAMOND',
    fullName: 'Z8 DIAMOND LUXE (LITTLE KING KONG) 500W',
    wholesale: 3400,
    lote10: 34000,
    retail: 6800,
    profit: 3400,
    markupPct: '100,0%',
    marginPct: '50,0%',
    container40HQ: '288 a 294 pcs / 40HQ',
    containerQtyNum: 290,
    packSize: '129 × 31 × 62 cm',
    voltage: '48V 125Ah / 60V 125Ah Lítio (50 km)',
    leftHero: '/assets/models/z8_diamond_studio.jpg',
    rightMain: '/assets/models/pptx_extracted/image24.png',
    lineupImg: '/assets/models/pptx_extracted/image25.png',
    slideImg: '/assets/catalogo_laf_z8/laf_slide_23.jpg',
    colors: [
      { name: 'Diamond Silver', hex: '#D0D5DD', img: '/assets/models/z8_diamond_studio.jpg' },
      { name: '6 Cores Vivas', hex: '#00F0FF', img: '/assets/models/pptx_extracted/image25.png' }
    ],
    callouts: [
      { num: '01', title: '100% MARKUP (DOBRO DO CAPITAL)', desc: 'Compra por R$ 3.400 no atacado e venda sugerida a R$ 6.800!', img: '/assets/models/pptx_extracted/image24.png' },
      { num: '02', title: 'PNEUS LARGOS ARO 16×3.0', desc: 'Rodas maiores de 16 polegadas com pneus balão 3.0 de vácuo.', img: '/assets/models/pptx_extracted/image25.png' },
      { num: '03', title: 'CHASSI LITTLE KING KONG', desc: 'Estrutura super reforçada com opção de cadeirinha infantil.', img: '/assets/models/pptx_extracted/image26.png' },
      { num: '04', title: 'ALARME ANTIFURTO REMOTO', desc: 'Segurança completa com trava remota e farol circular LED.', img: '/assets/models/z8_diamond_studio.jpg' }
    ],
    specs: [
      { k: 'MOTOR', v1: '500 W', v2: 'Cobre Puro Alto Torque' },
      { k: 'BATERIA', v1: 'Lítio 48V/60V', v2: '125Ah (50 km) Removível' },
      { k: 'CONTROLADOR', v1: '500W Módulo', v2: 'Estável + Proteção BMS' },
      { k: 'FREIO', v1: 'Tambor D/T', v2: 'Reforçado e Seguro' },
      { k: 'PNEU', v1: '16 - 3.0 pol.', v2: 'Vácuo Alargado Aro 16' },
      { k: 'VELOCIDADE', v1: '32 km/h (Legal)', v2: 'Máx: 35-40km/h CONTRAN' },
      { k: 'AUTONOMIA', v1: 'Até 50 km', v2: 'Por Recarga Bivolt' },
      { k: 'AMORTECEDOR', v1: 'Molas Damping', v2: 'Diant. e Tras. Reforçado' },
      { k: 'QUADRO', v1: 'Aço Carbono', v2: 'King Kong Frame (160 kg)' },
      { k: 'PACOTE 40HQ', v1: '129×31×62 cm', v2: '288 a 294 pcs / 40HQ' },
      { k: 'PESO s/ BAT.', v1: '37 kg (Líq.)', v2: '43 kg (Bruto) Robusta' },
      { k: 'FUNÇÃO SMART', v1: 'Alarme Remoto', v2: 'Cesta Metálica + 6 Cores' }
    ]
  }
];

const fmtBRL = (val) =>
  Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const fmtBRLCents = (val) =>
  Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });

// High-Tech Audio Synthesizer (Lando Norris / Conceito Tactile Feedback)
function playLafTick(type = 'up') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = type === 'up' ? 960 : 680;
    const endFreq = type === 'up' ? 1480 : 340;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (_) {}
}

// ==========================================================================
// UNIFIED WHOLESALE ORDER STORE & REACTIVE ENGINE
// Single Source of Truth shared across all pages, tables, HUDs and steppers
// ==========================================================================
const rawWholesaleQuantities = {
  'z8-tank': 1,
  'z8-tank-2': 1,
  'z8-fx10': 1,
  'z8-fx12': 1,
  'z8-n95c': 2,
  'z8-h26': 0,
  'z8-n710': 2,
  'z8-q11': 0,
  'z8-q10': 0,
  'z8-harley-x12': 0,
  'z8-u2-delivery': 0,
  'z8-gs005': 0,
  'z8-diamond': 2
};

const quantitiesProxy = new Proxy(rawWholesaleQuantities, {
  get(target, prop) {
    if (typeof prop === 'string') {
      const canonical = normalizeModelId(prop);
      return target[canonical] ?? 0;
    }
    return target[prop];
  },
  set(target, prop, value) {
    if (typeof prop === 'string') {
      const canonical = normalizeModelId(prop);
      target[canonical] = Math.max(0, parseInt(value, 10) || 0);
      return true;
    }
    target[prop] = value;
    return true;
  }
});

export const wholesaleOrderStore = {
  mode: 'lote10', // 'lote10' | 'container40hq'
  activeModule: 'all',
  activeCategory: 'all',
  currentSlide: 1,
  quantities: quantitiesProxy,
  rawQuantities: rawWholesaleQuantities,
  getAllQuantities() {
    return { ...this.rawQuantities };
  },
  colorNotes: {},

  getQty(modelId) {
    return this.quantities[normalizeModelId(modelId)] || 0;
  },

  setQty(modelId, val) {
    const canonical = normalizeModelId(modelId);
    const num = Math.max(0, Math.min(500, parseInt(val, 10) || 0));
    this.quantities[canonical] = num;
    this.syncAllUI();
    this.notifyUpdate();
    return num;
  },

  adjustQty(modelId, delta) {
    const canonical = normalizeModelId(modelId);
    const curr = this.getQty(canonical);
    const next = Math.max(0, Math.min(500, curr + delta));
    this.quantities[canonical] = next;
    this.syncAllUI();
    this.notifyUpdate();
    return next;
  },

  applyPreset(presetKey) {
    Object.keys(this.rawQuantities).forEach((k) => {
      this.rawQuantities[k] = 0;
    });

    if (presetKey === 'balanced') {
      this.mode = 'lote10';
      this.quantities['z8-tank'] = 2;
      this.quantities['z8-fx10'] = 2;
      this.quantities['z8-n95c'] = 2;
      this.quantities['z8-n710'] = 2;
      this.quantities['z8-diamond'] = 2;
    } else if (presetKey === 'performance') {
      this.mode = 'lote10';
      this.quantities['z8-tank'] = 3;
      this.quantities['z8-fx10'] = 3;
      this.quantities['z8-n95c'] = 2;
      this.quantities['z8-harley-x12'] = 2;
    } else if (presetKey === 'volume') {
      this.mode = 'lote10';
      this.quantities['z8-h26'] = 3;
      this.quantities['z8-n710'] = 3;
      this.quantities['z8-q11'] = 3;
      this.quantities['z8-gs005'] = 3;
      this.quantities['z8-diamond'] = 3;
    } else if (presetKey === 'container40hq') {
      this.mode = 'container40hq';
      this.quantities['z8-n95c'] = 28;
      this.quantities['z8-h26'] = 28;
      this.quantities['z8-n710'] = 28;
      this.quantities['z8-q11'] = 28;
    } else if (presetKey === 'clear') {
      this.mode = 'lote10';
      // all already 0
    }

    document.getElementById('btn-mode-lote10')?.classList.toggle('is-active', this.mode === 'lote10');
    document.getElementById('btn-mode-40hq')?.classList.toggle('is-active', this.mode === 'container40hq');

    this.syncAllUI();
    this.notifyUpdate();
  },

  getTotals() {
    let totalBikes = 0;
    let totalWholesale = 0;
    let totalRetail = 0;
    let totalProfit = 0;
    let containerFraction = 0;

    LAF_MODELS.forEach((m) => {
      const canonical = normalizeModelId(m.id);
      const qty = this.quantities[canonical] || 0;
      totalBikes += qty;
      totalWholesale += m.wholesale * qty;
      totalRetail += m.retail * qty;
      totalProfit += m.profit * qty;
      containerFraction += qty / (m.containerQtyNum || 110);
    });

    const avgMarkup = totalWholesale > 0 ? (((totalRetail - totalWholesale) / totalWholesale) * 100).toFixed(1) : '0.0';
    const containerPct = Math.min(100, (containerFraction * 100)).toFixed(1);
    const isValidMOQ = this.mode === 'container40hq' ? containerFraction >= 0.85 : totalBikes >= 10;

    return {
      totalBikes,
      totalWholesale,
      totalRetail,
      totalProfit,
      containerFraction,
      containerPct,
      avgMarkup,
      isValidMOQ
    };
  },

  getAllItems() {
    const items = [];
    LAF_MODELS.forEach((m) => {
      const canonical = normalizeModelId(m.id);
      const qty = this.quantities[canonical] || 0;
      if (qty > 0) {
        items.push({
          id: canonical,
          pn: m.pn,
          name: m.shortTitle,
          fullName: m.fullName,
          qty,
          wholesale: m.wholesale,
          retail: m.retail,
          profit: m.profit,
          subtotalWholesale: m.wholesale * qty,
          subtotalRetail: m.retail * qty,
          subtotalProfit: m.profit * qty,
          colorNote: this.colorNotes[m.id] || this.colorNotes[canonical] || 'Mix Padrão de Fábrica'
        });
      }
    });
    return items;
  },

  notifyUpdate() {
    try {
      window.dispatchEvent(new CustomEvent('z8-wholesale-order-updated', {
        detail: {
          quantities: { ...this.rawQuantities },
          totals: this.getTotals(),
          items: this.getAllItems()
        }
      }));
    } catch (_) {}
  },

  syncAllUI() {
    const totals = this.getTotals();

    // 1. Update each model's steppers, inputs and subtotals across all views
    LAF_MODELS.forEach((m) => {
      const canonical = normalizeModelId(m.id);
      const qty = this.quantities[canonical] || 0;
      const subW = m.wholesale * qty;
      const subP = m.profit * qty;

      // LAF card stepper input (both canonical and alias IDs)
      const inputIds = [`laf-card-qty-${canonical}`, `laf-card-qty-${m.id}`];
      if (m.alias) inputIds.push(`laf-card-qty-${m.alias}`);
      inputIds.forEach((iid) => {
        const inp = document.getElementById(iid);
        if (inp && Number(inp.value) !== qty) inp.value = qty;
      });

      // LAF card subtotal
      const subIds = [`laf-card-subtotal-${canonical}`, `laf-card-subtotal-${m.id}`];
      if (m.alias) subIds.push(`laf-card-subtotal-${m.alias}`);
      subIds.forEach((sid) => {
        const sub = document.getElementById(sid);
        if (sub) {
          sub.innerHTML = `
            <span>SUBTOTAL NO PEDIDO (${qty} UN.)</span>
            <strong>${fmtBRL(subW)} <small>(Lucro: +${fmtBRL(subP)})</small></strong>
          `;
        }
      });

      // Presentation vehicle card stepper (conceito / conceito-2)
      const pQty = document.getElementById(`card-qty-${canonical}`) || (m.alias ? document.getElementById(`card-qty-${m.alias}`) : null);
      if (pQty) pQty.textContent = qty;

      // Order Desk Table row input
      const tableInput = document.getElementById(`order-qty-${canonical}`) || (m.alias ? document.getElementById(`order-qty-${m.alias}`) : null);
      if (tableInput && Number(tableInput.value) !== qty) tableInput.value = qty;

      // Order Desk Table row subtotal
      const tableSub = document.getElementById(`order-subtotal-${canonical}`) || (m.alias ? document.getElementById(`order-subtotal-${m.alias}`) : null);
      if (tableSub) tableSub.textContent = fmtBRL(subW);
    });

    // 2. Render Top Selected Items Grid in LAF
    renderSelectedOrderItems();

    // 3. LAF Summary HUD
    const topCount = document.getElementById('laf-top-cart-count');
    if (topCount) topCount.textContent = totals.totalBikes;

    const sumBikes = document.getElementById('laf-sum-bikes');
    if (sumBikes) sumBikes.textContent = `${totals.totalBikes} Motos`;

    const moqStatus = document.getElementById('laf-sum-moq-status');
    if (moqStatus) {
      if (this.mode === 'container40hq') {
        moqStatus.textContent = totals.containerFraction >= 0.85
          ? 'Capacidade de Contêiner 40HQ Atingida'
          : `Adicione mais motos para fechar 1× 40HQ (${totals.containerPct}%)`;
      } else {
        moqStatus.textContent = totals.totalBikes >= 10
          ? 'Lote Mínimo Nacional Atingido (≥ 10 un.)'
          : `Faltam ${Math.max(0, 10 - totals.totalBikes)} motos para o Lote Mínimo (10 un.)`;
      }
      moqStatus.className = totals.isValidMOQ ? 'is-valid' : 'is-warning';
    }

    const contPctEl = document.getElementById('laf-sum-container-pct');
    if (contPctEl) contPctEl.textContent = `${totals.containerPct}% de 1× 40HQ`;

    const contBarEl = document.getElementById('laf-sum-container-bar');
    if (contBarEl) contBarEl.style.width = `${totals.containerPct}%`;

    const sumW = document.getElementById('laf-sum-wholesale');
    if (sumW) sumW.textContent = fmtBRLCents(totals.totalWholesale);

    const sumR = document.getElementById('laf-sum-retail');
    if (sumR) sumR.textContent = fmtBRLCents(totals.totalRetail);

    const sumP = document.getElementById('laf-sum-profit');
    if (sumP) sumP.textContent = `+${fmtBRLCents(totals.totalProfit)}`;

    const sumMarkup = document.getElementById('laf-sum-markup-avg');
    if (sumMarkup) sumMarkup.textContent = `Markup Médio da Operação: +${totals.avgMarkup}%`;

    // 4. Order Desk Table (Mesa de Atacado) totals
    const badgeEl = document.getElementById('orderdesk-total-bikes-badge');
    const wholesaleEl = document.getElementById('orderdesk-res-total-wholesale');
    const profitEl = document.getElementById('orderdesk-res-total-profit');
    const submitBtn = document.getElementById('btn-submit-orderdesk');
    const alertEl = document.getElementById('orderdesk-moq-alert');

    if (badgeEl) {
      badgeEl.textContent = `${totals.totalBikes} / 10 Motos`;
      if (totals.isValidMOQ) {
        badgeEl.style.background = 'rgba(16, 185, 129, 0.2)';
        badgeEl.style.color = '#10B981';
        badgeEl.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      } else {
        badgeEl.style.background = 'rgba(245, 158, 11, 0.15)';
        badgeEl.style.color = '#F59E0B';
        badgeEl.style.borderColor = 'rgba(245, 158, 11, 0.5)';
      }
    }

    if (wholesaleEl) wholesaleEl.textContent = fmtBRL(totals.totalWholesale);
    if (profitEl) profitEl.textContent = `+ ${fmtBRL(totals.totalProfit)}`;

    if (submitBtn) {
      submitBtn.style.opacity = totals.isValidMOQ ? '1' : '0.45';
      submitBtn.style.cursor = totals.isValidMOQ ? 'pointer' : 'not-allowed';
    }
    if (alertEl) {
      alertEl.style.display = totals.isValidMOQ ? 'none' : 'block';
    }

    // 5. Persistent Bottom HUD Bar
    const stickyLot = document.getElementById('sticky-lot-badge');
    const stickyWholesale = document.getElementById('sticky-wholesale-total');
    const stickyProfit = document.getElementById('sticky-profit-total');
    const stickyCta = document.getElementById('sticky-cta-btn');

    if (stickyLot) {
      stickyLot.textContent = `${totals.totalBikes} / 10 Motos`;
      stickyLot.className = `z8-sticky-value ${totals.isValidMOQ ? 'is-lime' : 'is-amber'}`;
    }
    if (stickyWholesale) stickyWholesale.textContent = fmtBRL(totals.totalWholesale);
    if (stickyProfit) stickyProfit.textContent = `+ ${fmtBRL(totals.totalProfit)}`;
    if (stickyCta) {
      stickyCta.style.background = totals.isValidMOQ ? '#10B981' : '#00F0FF';
    }
  }
};

window.Z8_WHOLESALE_ORDER_STORE = wholesaleOrderStore;
export const lafOrderState = wholesaleOrderStore;

LAF_MODELS.forEach((m) => {
  wholesaleOrderStore.colorNotes[m.id] = 'Mix Padrão de Fábrica';
  if (m.alias) wholesaleOrderStore.colorNotes[m.alias] = 'Mix Padrão de Fábrica';
});

const STEPPED_LINE_SVG = `
  <svg width="100%" height="22" viewBox="0 0 412 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="z8-laf-stepped-svg">
    <path d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412" stroke="currentColor" stroke-width="3.2"/>
  </svg>
`;

function getSavedWholesaleOrders() {
  try {
    const raw = localStorage.getItem('z8_laf_wholesale_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveWholesaleOrderLocal(order) {
  try {
    const list = getSavedWholesaleOrders();
    list.unshift(order);
    localStorage.setItem('z8_laf_wholesale_orders', JSON.stringify(list.slice(0, 30)));
  } catch (_) {}
}

/**
 * Generates the HTML for a single LAF 40/60 Split Product Sheet
 */
function renderLafModelSheet(m) {
  const qty = lafOrderState.quantities[m.id] || 0;
  const subtotal = m.wholesale * qty;
  const profitTotal = m.profit * qty;

  const swatchesHtml = m.colors
    .map(
      (c, idx) => `
      <button type="button" class="z8-laf-color-chip ${idx === 0 ? 'is-active' : ''}" onclick="window.selectLafModelPreview('${m.id}', '${c.img}', '${c.name}', this)">
        <span class="swatch-dot" style="background:${c.hex};"></span>
        <span>${c.name}</span>
      </button>
    `
    )
    .join('');

  const calloutsHtml = m.callouts
    .map(
      (c) => `
      <div class="z8-laf-callout-item" role="button" tabindex="0" onclick="window.selectLafCalloutPreview('${m.id}', '${c.img}', '${c.num} // ${c.title.replace(/'/g, "\\'")}', this)" title="Toque para ampliar este detalhe">
        <div class="z8-laf-callout-thumb-wrap">
          <img src="${c.img}" alt="${c.title}" loading="lazy" class="z8-laf-callout-thumb"/>
          <span class="z8-laf-callout-num">${c.num}</span>
        </div>
        <div class="z8-laf-callout-text">
          <strong>${c.title}</strong>
          <span>${c.desc}</span>
        </div>
      </div>
    `
    )
    .join('');

  const specsHtml = m.specs
    .map(
      (s) => `
      <div class="z8-laf-spec-cell">
        <span class="z8-laf-spec-k">${s.k}</span>
        <strong class="z8-laf-spec-v1">${s.v1}</strong>
        <span class="z8-laf-spec-v2">${s.v2}</span>
      </div>
    `
    )
    .join('');

  return `
    <article class="z8-laf-sheet-card" id="laf-sheet-${m.id}" data-laf-category="${m.categoryKey}">
      <!-- LEFT COLUMN (40% — EDITORIAL, FOTO HERO, QUADRO DE ATACADO & PEDIDO RÁPIDO) -->
      <div class="z8-laf-col-40">
        <div class="z8-laf-sheet-top-bar">
          <span class="z8-laf-cat-pill">${m.badgeShort}</span>
          <span class="z8-laf-pn-code">PN: ${m.pn} // ${m.base}</span>
          <span class="z8-laf-page-tag">LAF ${m.page} / 27</span>
        </div>

        <div class="z8-laf-title-block">
          <h3 class="z8-laf-model-short">${m.shortTitle}</h3>
          <p class="z8-laf-model-full">${m.fullName}</p>
        </div>

        <div class="z8-laf-hero-img-box">
          <img src="${m.leftHero}" alt="${m.fullName}" loading="lazy" class="z8-laf-hero-img"/>
          <div class="z8-laf-hero-overlay-bar">
            <span>Z8EMOTION.COM // CONTRAN 996</span>
            <button type="button" class="z8-laf-inspect-slide-btn" onclick="window.openLafSlideModal(${m.page})">
              VER PRANCHA LAF PÁG. ${m.page} ↗
            </button>
          </div>
        </div>

        <!-- QUADRO OFICIAL DE ATACADO B2B & CONTÊINER 40HQ -->
        <div class="z8-laf-wholesale-panel">
          <div class="z8-laf-wholesale-header">
            <span>GARANTIA NACIONAL Z8 // FATURAMENTO DIRETO CNPJ</span>
            <strong class="z8-laf-markup-tag">+${m.markupPct} MARKUP</strong>
          </div>

          <div class="z8-laf-price-main-row">
            <div class="z8-laf-price-main-left">
              <span class="z8-laf-price-label">VALOR DE ATACADO UNITÁRIO (B2B)</span>
              <strong class="z8-laf-price-value">${fmtBRLCents(m.wholesale)}</strong>
              ${m.wholesaleCardRef ? `<small class="z8-laf-price-note">Tab. Contêiner Pág. 24: R$ 6.200,00 | Ficha Avulsa Pág. 11: R$ 6.700,00</small>` : ''}
            </div>
            <div class="z8-laf-price-lote-box">
              <span>LOTE MÍNIMO (10 UN.)</span>
              <strong>${fmtBRLCents(m.lote10)}</strong>
            </div>
          </div>

          <div class="z8-laf-price-sub-grid">
            <div class="z8-laf-sub-kpi">
              <span>VAREJO SUGERIDO</span>
              <strong>${fmtBRLCents(m.retail)}</strong>
            </div>
            <div class="z8-laf-sub-kpi is-profit">
              <span>LUCRO LOJISTA / UN.</span>
              <strong>+${fmtBRLCents(m.profit)} (${m.marginPct})</strong>
            </div>
            <div class="z8-laf-sub-kpi">
              <span>CONTÊINER 40HQ</span>
              <strong>${m.container40HQ}</strong>
            </div>
            <div class="z8-laf-sub-kpi">
              <span>PACOTE SKD</span>
              <strong>${m.packSize}</strong>
            </div>
          </div>

          <div class="z8-laf-voltage-bar">
            <span><i class="fa-solid fa-bolt" style="color:#00F0FF; margin-right:4px;"></i> VOLTAGEM &amp; BATERIA DE SÉRIE:</span>
            <strong>${m.voltage}</strong>
          </div>

          <!-- CONTROLE INTERATIVO DE PEDIDO DIRETO NA FICHA LAF -->
          <div class="z8-laf-card-order-box">
            <div class="z8-laf-card-order-top">
              <span class="z8-laf-order-box-title">ADICIONAR AO PEDIDO DE ATACADO:</span>
              <div class="z8-laf-quick-qty-btns">
                <button type="button" onclick="window.adjustLafQty('${m.id}', 1)">+1 un</button>
                <button type="button" onclick="window.adjustLafQty('${m.id}', 5)">+5 un</button>
                <button type="button" onclick="window.setLafQty('${m.id}', 10)">Lote 10</button>
              </div>
            </div>
            <div class="z8-laf-card-order-controls">
              <div class="z8-laf-stepper">
                <button type="button" class="z8-laf-step-btn" onclick="window.adjustLafQty('${m.id}', -1)" aria-label="Diminuir">−</button>
                <input type="number" min="0" max="500" value="${qty}" id="laf-card-qty-${m.id}" onchange="window.setLafQty('${m.id}', this.value)" class="z8-laf-step-input" aria-label="Quantidade ${m.shortTitle}"/>
                <button type="button" class="z8-laf-step-btn" onclick="window.adjustLafQty('${m.id}', 1)" aria-label="Aumentar">+</button>
              </div>
              <div class="z8-laf-card-subtotal" id="laf-card-subtotal-${m.id}">
                <span>SUBTOTAL NO PEDIDO</span>
                <strong>${fmtBRL(subtotal)} <small>(Lucro: +${fmtBRL(profitTotal)})</small></strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (60% — CORES DE FÁBRICA, 4 ZOOMS NUMERADOS 01-04 & TELEMETRIA 12 CÉLULAS) -->
      <div class="z8-laf-col-60">
        <div class="z8-laf-col60-header">
          <span>ESPECIFICAÇÕES OFICIAIS DE FÁBRICA // MODELO ${m.pn} // ${m.shortTitle}</span>
          <div class="z8-laf-col60-actions">
            <button type="button" class="z8-laf-jump-order-btn" onclick="window.scrollToLafSection('laf-block-pedidos')">
              IR PARA FECHAMENTO DO PEDIDO ↱
            </button>
          </div>
        </div>

        <div class="z8-laf-visual-showcase-grid">
          <div class="z8-laf-main-cutout-box">
            <img src="${m.rightMain}" alt="${m.fullName}" id="laf-main-img-${m.id}" loading="lazy" class="z8-laf-main-cutout-img"/>
            <div class="z8-laf-color-swatches-bar">
              ${swatchesHtml}
            </div>
          </div>

          <div class="z8-laf-lineup-box">
            <span class="z8-laf-lineup-label">VARIAÇÕES E CORES DE FÁBRICA (FÁBRICA Z8):</span>
            <div class="z8-laf-lineup-img-wrap" onclick="window.openLafSlideModal(${m.page})" title="Clique para ampliar prancha LAF">
              <img src="${m.lineupImg}" alt="Cores de Fábrica ${m.shortTitle}" loading="lazy" class="z8-laf-lineup-img"/>
            </div>
            <span class="z8-laf-lineup-hint">Clique nas cores ao lado ou na prancha para inspecionar</span>
          </div>
        </div>

        <!-- 4 CIRCULAR NUMBERED TECHNICAL CALLOUTS (01 A 04 DA LAF) -->
        <div class="z8-laf-callouts-grid">
          ${calloutsHtml}
        </div>

        <!-- 12-ITEM (6x2) TECHNICAL TELEMETRY MATRIX -->
        <div class="z8-laf-specs-grid">
          ${specsHtml}
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders the complete Portal do Lojista HTML into #portal-lojista
 */
export function renderPortalLojistaLAF() {
  const container = document.getElementById('portal-lojista');
  if (!container) return;

  const user = getCurrentCatalogUser();
  const isAdmin = isUserAdmin(user);

  const slideOptionsHtml = LAF_PAGES_INDEX.map(
    (s) => `<option value="${s.page}">${s.title}</option>`
  ).join('');

  const slideThumbsHtml = LAF_PAGES_INDEX.map(
    (s) => `
      <button type="button" class="z8-laf-thumb-btn ${s.page === 1 ? 'is-active' : ''}" data-slide="${s.page}" onclick="window.goToLafSlide(${s.page})">
        <img src="/assets/catalogo_laf_z8/laf_slide_${String(s.page).padStart(2, '0')}.jpg" alt="${s.title}" loading="lazy"/>
        <span>PÁG. ${String(s.page).padStart(2, '0')}</span>
      </button>
    `
  ).join('');

  container.innerHTML = `
    <div class="z8-laf-portal-wrapper">
      <!-- TOPOGRAPHIC BACKGROUND CONTOURS (1:1 CONCEITO AESTHETIC) -->
      <div class="z8-laf-topo-bg" aria-hidden="true">
        <img src="https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67dbeba158707fa1cd5e5e45_blobs_footer_1.svg" alt="" loading="lazy"/>
      </div>

      <div class="c z8-laf-container">
        <!-- ==================== TOP COCKPIT PARTNER BAR ==================== -->
        <div class="z8-laf-partner-topbar">
          <div class="z8-laf-partner-status">
            <span class="z8-laf-live-dot"></span>
            <span class="z8-laf-status-code">PORTAL DO LOJISTA // DISTRIBUIÇÃO DIRECT-FACTORY LAF 2026</span>
            <span class="z8-laf-partner-identity" id="laf-partner-identity-label">
              ${
                user
                  ? `CONECTADO: <strong>${(user.company || user.name || 'PARCEIRO Z8').toUpperCase()}</strong> (${user.city || 'SJC'}/${user.state || 'SP'})`
                  : `TABELA OFICIAL DE ATACADO B2B ABERTA // LOTE MÍNIMO 10 MOTOS (MIX LIVRE)`
              }
            </span>
          </div>

          <div class="z8-laf-topbar-actions">
            <a href="/docs/CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.pdf" download="CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.pdf" class="z8-laf-top-btn is-cyan">
              <span><i class="fa-solid fa-download" style="margin-right:6px;"></i>BAIXAR CATÁLOGO LAF (PDF 27 PÁGS)</span>
            </a>
            <button type="button" class="z8-laf-top-btn" onclick="window.scrollToLafSection('laf-block-pedidos')">
              <span><i class="fa-solid fa-cart-shopping" style="margin-right:6px;"></i>MESA DE PEDIDOS (<strong id="laf-top-cart-count">10</strong> MOTOS)</span>
            </button>
            ${
              isAdmin
                ? `<button type="button" class="z8-laf-top-btn is-amber" onclick="window.openAdminModal && window.openAdminModal()">
                     <span><i class="fa-solid fa-crown" style="margin-right:6px;"></i>PAINEL ADMIN MASTER</span>
                   </button>`
                : ''
            }
            <button type="button" class="z8-laf-top-btn" onclick="window.handlePortalAuthAction()">
              <span id="laf-auth-action-label">${user ? '<i class="fa-solid fa-user-check" style="margin-right:6px;"></i>CONTA PARCEIRO / SAIR' : '<i class="fa-solid fa-key" style="margin-right:6px;"></i>LOGIN CREDENCIADO'}</span>
            </button>
          </div>
        </div>

        <!-- ==================== MONUMENTAL HERO: PORTAL LOJISTA ==================== -->
        <div class="z8-laf-hero-header">
          <div class="eyebrow-w">
            <div class="text-eyebrow large" style="color:#00F0FF;">Z8 E-MOTION VEÍCULOS ELÉTRICOS // EDIÇÃO OFICIAL B2B &amp; ATACADO 2026</div>
          </div>

          <div class="z8-laf-monumental-title-row">
            <div>
              <h2 class="text-impact-lg-mona z8-laf-main-heading">
                PORTAL LOJISTA <span class="span-font-brier z8-laf-brier-sub">LAF Edition</span>
              </h2>
              <div class="z8-laf-stepped-wrap">${STEPPED_LINE_SVG}</div>
            </div>
            <div class="z8-laf-hero-desc-box">
              <p class="text-body-reg-mona">
                Bem-vindo à central executiva de faturamento direto da <strong>Z8 E-Motion</strong>. Consulte a apresentação industrial completa, inspecione as fichas técnicas <strong>Split 40/60</strong> com valores de atacado unitário, lote de 10 motos e capacidade de contêiner <strong>40HQ</strong>, e transmita seu pedido diretamente para nossa Matriz em São José dos Campos — SP.
              </p>
            </div>
          </div>

          <!-- 4 HERO KPI CARDS (CAPA & PÁG 03 LAF) -->
          <div class="z8-laf-hero-kpis">
            <div class="z8-laf-kpi-card">
              <span class="z8-laf-kpi-idx">01 // PORTFÓLIO</span>
              <strong>13 MODELOS</strong>
              <small>Do Urbano 500W ao High-Speed 2000W — 100% Homologados CONTRAN 996</small>
            </div>
            <div class="z8-laf-kpi-card is-highlight">
              <span class="z8-laf-kpi-idx">02 // RENTABILIDADE B2B</span>
              <strong>ATÉ 100% MARKUP</strong>
              <small>Margem bruta de +R$ 2.800 a +R$ 4.200 por motocicleta vendida na loja</small>
            </div>
            <div class="z8-laf-kpi-card">
              <span class="z8-laf-kpi-idx">03 // ALTA DENSIDADE</span>
              <strong>LÍTIO 60V 125Ah</strong>
              <small>Baterias 48V/60V/72V 125Ah com BMS ativo e expansão até 240 km</small>
            </div>
            <div class="z8-laf-kpi-card">
              <span class="z8-laf-kpi-idx">04 // LOGÍSTICA GLOBAL</span>
              <strong>10 UN. OU 40HQ</strong>
              <small>Lote mínimo nacional de 10 motos (Mix Livre) ou Contêiner 40HQ (85 a 294 pcs)</small>
            </div>
          </div>

          <!-- KINETIC NAVIGATION COMMAND BAR (MODULOS DO PORTAL LOJISTA) -->
          <div class="z8-laf-module-nav" role="tablist" aria-label="Módulos do Portal do Lojista">
            <button type="button" class="z8-laf-mod-tab is-active" data-mod="all" onclick="window.switchLafPortalModule('all')">
              <span class="mod-idx">00</span>
              <span>VISÃO COMPLETA LAF</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="institucional" onclick="window.switchLafPortalModule('institucional')">
              <span class="mod-idx">01</span>
              <span>APRESENTAÇÃO &amp; FÁBRICAS (PÁGS 01-08)</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="fichas" onclick="window.switchLafPortalModule('fichas')">
              <span class="mod-idx">02</span>
              <span>VALORES DAS 11 MOTOS &amp; FICHAS 40/60</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="pedidos" onclick="window.switchLafPortalModule('pedidos')">
              <span class="mod-idx">03</span>
              <span>FECHAMENTO DO PEDIDO (LOTE &amp; 40HQ)</span>
            </button>
            <button type="button" class="z8-laf-mod-tab" data-mod="os" onclick="window.scrollToOSFooter && window.scrollToOSFooter()">
              <span class="mod-idx">04</span>
              <span>CENTRAL DE OS &amp; PÓS-VENDA ↱</span>
            </button>
          </div>
        </div>

        <!-- =====================================================================
             BLOCO 01: APRESENTAÇÃO INDUSTRIAL, POLOS ASIÁTICOS & BATERIAS 125Ah (PÁGS. 02–08)
             ===================================================================== -->
        <div id="laf-block-institucional" class="z8-laf-module-block">
          <div class="z8-laf-section-header">
            <div>
              <span class="z8-laf-eyebrow">MÓDULO 01 // ENGENHARIA, POLOS INDUSTRIAIS &amp; PÓS-VENDA (LAF PÁGS. 02 A 08)</span>
              <h3 class="text-title-lg-mona z8-laf-sec-title">
                A FORÇA POR TRÁS DA <span class="span-font-brier">Z8 E-Motion</span>
              </h3>
            </div>
            <button type="button" class="z8-laf-sec-action-btn" onclick="window.openLafSlideModal(2)">
              INSPECIONAR PRANCHAS INSTITUCIONAIS ↗
            </button>
          </div>

          <!-- 5 PILARES DA MATRIZ SJC (PÁG. 02 LAF) -->
          <div class="z8-laf-pillars-row">
            <div class="z8-laf-pillar-card">
              <div class="z8-laf-circle-badge">01</div>
              <strong>ESTRUTURA PRÓPRIA SJC</strong>
              <span>Matriz Corporativa em São José dos Campos — SP (Av. Dr. Adhemar de Barros, 566) preparada para atender todo o Brasil.</span>
            </div>
            <div class="z8-laf-pillar-card">
              <div class="z8-laf-circle-badge">02</div>
              <strong>CONTROLE TÉCNICO PDI</strong>
              <span>Inspeção técnica rigorosa de Pré-Entrega (PDI) em cada lote de 10 motocicletas antes do embarque.</span>
            </div>
            <div class="z8-laf-pillar-card">
              <div class="z8-laf-circle-badge">03</div>
              <strong>ESTOQUE NACIONAL</strong>
              <span>Veículos, controladores 12G/15G, baterias Lítio 125Ah, painéis LCD e carenagens para reposição rápida.</span>
            </div>
            <div class="z8-laf-pillar-card">
              <div class="z8-laf-circle-badge">04</div>
              <strong>PÓS-VENDA 2 ELEVADORES</strong>
              <span>Padrão de oficina com 2 elevadores obrigatórios e Portal Digital de Garantia e Ordens de Serviço (OS).</span>
            </div>
            <div class="z8-laf-pillar-card">
              <div class="z8-laf-circle-badge">05</div>
              <strong>PARCERIA COM LOJISTAS</strong>
              <span>Exclusividade territorial de até 50 km em contrato executivo (Art. 784, III CPC) e materiais de venda.</span>
            </div>
          </div>

          <!-- OS 2 POLOS INDUSTRIAIS GLOBAIS (PÁG. 04 LAF) + MATRIZ DE BATERIAS 125Ah (PÁG. 05 LAF) -->
          <div class="z8-laf-industrial-grid">
            <!-- Left: Polos Industriais Foshan/Huizhou & Base Norte -->
            <div class="z8-laf-industrial-card">
              <div class="z8-laf-card-kicker">LAF PÁG. 04 // ALIANÇA DIRETA COM MONTADORAS DA ÁSIA</div>
              <h4 class="z8-laf-card-heading">DOIS POLOS INDUSTRIAIS DE ALTA PRECISÃO</h4>
              <p class="z8-laf-card-text">
                Cada veículo Z8 é produzido em linhas automatizadas com chassi de aço de alto carbono, pintura eletrostática UV e motores Brushless de cobre puro.
              </p>

              <div class="z8-laf-hubs-stack">
                <div class="z8-laf-hub-box">
                  <div class="z8-laf-hub-top">
                    <span class="z8-laf-hub-tag">POLO 01 // BASES DE FOSHAN &amp; HUIZHOU</span>
                    <strong>90 a 216 pcs / 40HQ</strong>
                  </div>
                  <p>Especializado em scooters inteligentes, linha executiva N-Series, esportivas FX e retrô Q-Series com controladores 9G a 12G-38A.</p>
                  <div class="z8-laf-hub-chips">
                    <span>DB043 FX-10</span>
                    <span>DB039 N95C</span>
                    <span>DB001 H26</span>
                    <span>DB045 N710</span>
                    <span>DB043-Q11</span>
                    <span>DB038 Q10</span>
                    <span>XB-010 U2 Cargo</span>
                  </div>
                </div>

                <div class="z8-laf-hub-box">
                  <div class="z8-laf-hub-top">
                    <span class="z8-laf-hub-tag is-cyan">POLO 02 // BASE NORTE (NORTHERN BASE)</span>
                    <strong>85 a 294 pcs / 40HQ</strong>
                  </div>
                  <p>Focado em motocicletas High-Speed de quadro tubular duplo, Custom Choppers de pneu alargado e E-Bikes urbanas de alto giro.</p>
                  <div class="z8-laf-hub-chips">
                    <span>DB018 Z8 Tank 2000W</span>
                    <span>XB-024 Harley X12</span>
                    <span>GS-005 Golden Eagle</span>
                    <span>GS-052 Diamond King Kong</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Tecnologia Energética de Série Lítio 48V/60V/72V 125Ah (Pág. 05 LAF) -->
            <div class="z8-laf-industrial-card">
              <div class="z8-laf-card-kicker">LAF PÁG. 05 // TECNOLOGIA ENERGÉTICA DE SÉRIE</div>
              <h4 class="z8-laf-card-heading">BATERIAS DE LÍTIO Z8 (48V / 60V / 72V 125Ah) HIGH-DENSITY</h4>
              <p class="z8-laf-card-text">
                Células automotivas de alta densidade com gerenciamento eletrônico ativo (BMS) e recarga rápida em tomada residencial 110V/220V por apenas R$ 1,80 a R$ 2,50.
              </p>

              <div class="z8-laf-hubs-stack">
                <div class="z8-laf-hub-box">
                  <div class="z8-laf-hub-top">
                    <span class="z8-laf-hub-tag is-cyan">DURABILIDADE // 1.500 A 3.000+ CICLOS</span>
                    <strong>5 a 8 Anos de Vida Útil</strong>
                  </div>
                  <p>Até 6 vezes mais durável que baterias comuns, mantendo estabilidade térmica e entrega constante de potência até o fim da carga.</p>
                  <div class="z8-laf-hub-chips">
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>BMS Inteligente Anti-Curto</span>
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Pack Removível Leve (7 a 9 kg)</span>
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Recarga 4 a 6h Bivolt</span>
                  </div>
                </div>

                <div class="z8-laf-hub-box">
                  <div class="z8-laf-hub-top">
                    <span class="z8-laf-hub-tag">AUTONOMIA // EXPANSÃO ATÉ 125Ah</span>
                    <strong>Até 240 km Reais</strong>
                  </div>
                  <p>Os modelos <strong>Z8 Tank (DB018)</strong> e <strong>Z8 Q10 Xiao Q (DB038)</strong> contam com cofre dimensionado para packs modulares de Lítio de até 125Ah.</p>
                  <div class="z8-laf-hub-chips">
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>48V / 60V / 72V</span>
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Zero Efeito Memória</span>
                    <span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Garantia Nacional por Chassi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================================
             BLOCO 02: SHOWROOM DE ATACADO & FICHAS TÉCNICAS LAF SPLIT 40/60 (PÁGS. 09–23)
             ===================================================================== -->
        <div id="laf-block-fichas" class="z8-laf-module-block">
          <div class="z8-laf-section-header">
            <div>
              <span class="z8-laf-eyebrow">MÓDULO 02 // CATÁLOGO OFICIAL DE ATACADO &amp; ENGENHARIA (LAF PÁGS. 09 A 23)</span>
              <h3 class="text-title-lg-mona z8-laf-sec-title">
                VALORES DE ATACADO &amp; FICHAS <span class="span-font-brier">Split 40/60</span>
              </h3>
            </div>

            <!-- FILTRO POR LINHA DE PRODUTO (DIVISORES LAF PÁGS 09, 12, 16, 20) -->
            <div class="z8-laf-cat-filters" role="group" aria-label="Filtrar por Linha de Produto">
              <button type="button" class="z8-laf-filter-btn is-active" data-cat="all" onclick="window.filterLafModels('all')">
                TODOS OS 13 MODELOS
              </button>
              <button type="button" class="z8-laf-filter-btn" data-cat="performance" onclick="window.filterLafModels('performance')">
                01 PERFORMANCE (4)
              </button>
              <button type="button" class="z8-laf-filter-btn" data-cat="urbana" onclick="window.filterLafModels('urbana')">
                02 URBANA (3)
              </button>
              <button type="button" class="z8-laf-filter-btn" data-cat="retro" onclick="window.filterLafModels('retro')">
                03 RETRÔ &amp; CUSTOM (3)
              </button>
              <button type="button" class="z8-laf-filter-btn" data-cat="cargo" onclick="window.filterLafModels('cargo')">
                04 CARGO &amp; E-BIKES (3)
              </button>
            </div>
          </div>

          <!-- STACK DE TODAS AS 11 FICHAS LAF SPLIT 40/60 -->
          <div class="z8-laf-sheets-stack" id="laf-sheets-container">
            ${LAF_MODELS.map((m) => renderLafModelSheet(m)).join('')}
          </div>
        </div>

        <!-- =====================================================================
             BLOCO 03: FECHAMENTO DO PEDIDO DO LOJISTA & CONTÊINER 40HQ (LAF PÁG. 24)
             ===================================================================== -->
        <div id="laf-block-pedidos" class="z8-laf-module-block">
          <div class="z8-laf-section-header">
            <div>
              <span class="z8-laf-eyebrow">MÓDULO 03 // RESUMO DO LOTE SELECIONADO &amp; TRANSMISSÃO DIRETA (LAF PÁG. 24)</span>
              <h3 class="text-title-lg-mona z8-laf-sec-title">
                FECHAMENTO DO <span class="span-font-brier">Pedido</span>
              </h3>
            </div>
            <div class="z8-laf-order-mode-switch">
              <button type="button" class="z8-laf-mode-btn is-active" id="btn-mode-lote10" onclick="window.setLafOrderMode('lote10')">
                <i class="fa-solid fa-warehouse" style="margin-right:6px;"></i>LOTE MÍNIMO NACIONAL (MÍN. 10 MOTOS — SJC)
              </button>
              <button type="button" class="z8-laf-mode-btn" id="btn-mode-40hq" onclick="window.setLafOrderMode('container40hq')">
                <i class="fa-solid fa-ship" style="margin-right:6px;"></i>IMPORTAÇÃO CONTÊINER FECHADO 40HQ (85 A 294 UN.)
              </button>
            </div>
          </div>

          <!-- BARRA DE MIXES PRONTOS (PRESETS DE FÁBRICA) -->
          <div class="z8-laf-presets-bar">
            <span class="z8-laf-presets-label">SUGESTÕES RÁPIDAS DE LOTE:</span>
            <button type="button" class="z8-laf-preset-chip" onclick="window.applyLafOrderPreset('balanced')">
              <i class="fa-solid fa-bolt" style="color:#00F0FF; margin-right:6px;"></i>Mix Campeão de Giro (10 Motos — R$ 58.600)
            </button>
            <button type="button" class="z8-laf-preset-chip" onclick="window.applyLafOrderPreset('performance')">
              <i class="fa-solid fa-fire" style="color:#EA580C; margin-right:6px;"></i>Mix Performance &amp; Executiva (10 Motos — R$ 65.400)
            </button>
            <button type="button" class="z8-laf-preset-chip" onclick="window.applyLafOrderPreset('volume')">
              <i class="fa-solid fa-gem" style="color:#00F0FF; margin-right:6px;"></i>Mix Alto Giro Urbano &amp; E-Bikes (15 Motos — R$ 71.100)
            </button>
            <button type="button" class="z8-laf-preset-chip" onclick="window.applyLafOrderPreset('container40hq')">
              <i class="fa-solid fa-boxes-stacked" style="color:#10B981; margin-right:6px;"></i>Contêiner 40HQ Mix Foshan (112 Motos)
            </button>
            <button type="button" class="z8-laf-preset-chip is-clear" onclick="window.applyLafOrderPreset('clear')">
              <i class="fa-solid fa-trash-can" style="margin-right:6px;"></i>Zerar Quantidades
            </button>
          </div>

          <div class="z8-laf-master-table-card">
            <!-- ITENS SELECIONADOS NO LOTE (SEM TABELA REDUNDANTE) -->
            <div id="laf-selected-items-grid" class="z8-laf-selected-items-grid"></div>

            <!-- ==================== SELEÇÃO DE MODELOS & QUANTIDADES (MESA DE ATACADO MATRIZ SJC) ==================== -->
            <div class="z8-laf-orderdesk-block" style="margin: 1.5rem 0; border-top: 1px solid rgba(0, 240, 255, 0.18); padding-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <span style="font-size: 0.72rem; color: #00F0FF; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">MONTAGEM DE PEDIDO DE LOTE // MATRIZ SÃO JOSÉ DOS CAMPOS</span>
                  <h4 style="font-size: 1.25rem; font-weight: 900; color: #F4F5F7; margin: 0.2rem 0 0 0; text-transform: uppercase;">SELEÇÃO DE MODELOS &amp; QUANTIDADES</h4>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 0.82rem; color: rgba(244,244,237,0.7);">Lote Mínimo: <strong>10 motos</strong></span>
                  <span id="orderdesk-total-bikes-badge" style="background: rgba(0, 240, 255, 0.15); color: #00F0FF; border: 1px solid rgba(0, 240, 255, 0.5); padding: 0.35rem 0.75rem; border-radius: 4px; font-weight: 800; font-size: 0.82rem;">0 / 10 Motos</span>
                </div>
              </div>

              <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table class="z8-orderdesk-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
                  <thead>
                    <tr style="background: rgba(0, 240, 255, 0.08); border-bottom: 1px solid rgba(0, 240, 255, 0.25);">
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">MODELO</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">PREÇO ATACADO</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">VAREJO SUG.</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800;">LUCRO / UN</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800; text-align: center;">QUANTIDADE</th>
                      <th style="padding: 0.75rem 1rem; color: #00F0FF; font-weight: 800; text-align: right;">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody id="orderdesk-table-body">
                    ${LAF_MODELS.map((m) => {
                      const canonical = normalizeModelId(m.id);
                      const qty = lafOrderState.quantities[canonical] || 0;
                      const subtotal = m.wholesale * qty;
                      return `
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                          <td style="padding: 0.85rem 1rem;">
                            <strong style="color: #F4F5F7; display: block;">${m.fullName}</strong>
                            <span style="font-size: 0.72rem; color: rgba(244,244,237,0.6);">${m.categoryLabel || m.categoryKey || 'OFICIAL'} // ${m.pn}</span>
                          </td>
                          <td style="padding: 0.85rem 1rem; color: #00F0FF; font-weight: 700;">${fmtBRL(m.wholesale)}</td>
                          <td style="padding: 0.85rem 1rem; color: rgba(244,244,237,0.8);">${fmtBRL(m.retail)}</td>
                          <td style="padding: 0.85rem 1rem; color: #10B981; font-weight: 700;">+${fmtBRL(m.profit)}</td>
                          <td style="padding: 0.85rem 1rem; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #06080D; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 2px;">
                              <button type="button" onclick="window.adjustLafQty('${canonical}', -1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;" aria-label="Diminuir ${m.shortTitle}">-</button>
                              <input type="number" min="0" max="500" value="${qty}" id="order-qty-${canonical}" onchange="window.setLafQty('${canonical}', this.value)" style="width: 44px; text-align: center; background: none; border: none; color: #FFF; font-weight: 800; font-size: 0.85rem;" aria-label="Quantidade ${m.shortTitle}"/>
                              <button type="button" onclick="window.adjustLafQty('${canonical}', 1)" style="background: none; border: none; color: #00F0FF; width: 26px; height: 26px; font-weight: 900; font-size: 0.9rem; cursor: pointer;" aria-label="Aumentar ${m.shortTitle}">+</button>
                            </div>
                          </td>
                          <td id="order-subtotal-${canonical}" style="padding: 0.85rem 1rem; text-align: right; color: #F4F5F7; font-weight: 800;">${fmtBRL(subtotal)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- RESUMO FINANCEIRO & OCUPAÇÃO DE CONTÊINER 40HQ -->
            <div class="z8-laf-order-summary-hud">
              <div class="z8-laf-summary-kpi">
                <span>VOLUME SELECIONADO</span>
                <strong id="laf-sum-bikes">10 Motos</strong>
                <small id="laf-sum-moq-status" class="is-valid"><i class="fa-solid fa-circle-check" style="color:#10B981; margin-right:4px;"></i>Lote Mínimo Atingido (≥ 10 un.)</small>
              </div>
              <div class="z8-laf-summary-kpi">
                <span>OCUPAÇÃO CONTÊINER 40HQ</span>
                <strong id="laf-sum-container-pct">9,2% de 1× 40HQ</strong>
                <div class="z8-laf-progress-track">
                  <div class="z8-laf-progress-fill" id="laf-sum-container-bar" style="width: 9.2%;"></div>
                </div>
              </div>
              <div class="z8-laf-summary-kpi is-cyan">
                <span>INVESTIMENTO TOTAL ATACADO (B2B)</span>
                <strong id="laf-sum-wholesale">R$ 58.600,00</strong>
                <small>Faturamento Direto CNPJ // Sem Royalties</small>
              </div>
              <div class="z8-laf-summary-kpi">
                <span>FATURAMENTO VAREJO ESTIMADO</span>
                <strong id="laf-sum-retail">R$ 95.600,00</strong>
                <small>Preço Sugerido Tabela Oficial 2026</small>
              </div>
              <div class="z8-laf-summary-kpi is-emerald">
                <span>LUCRO BRUTO PROJETADO LOJISTA</span>
                <strong id="laf-sum-profit">+R$ 37.000,00</strong>
                <small id="laf-sum-markup-avg">Markup Médio da Operação: +63,1%</small>
              </div>
            </div>

            <!-- FORMULÁRIO DE FECHAMENTO E TRANSMISSÃO DO PEDIDO -->
            <form id="laf-order-checkout-form" class="z8-laf-checkout-grid">
              <div class="z8-laf-checkout-col">
                <h4 class="z8-laf-checkout-title">01 // IDENTIFICAÇÃO DA CONCESSIONÁRIA / LOJISTA</h4>
                <div class="z8-laf-form-row">
                  <div class="z8-laf-field">
                    <label for="laf-order-name">NOME DO RESPONSÁVEL / COMPRADOR *</label>
                    <input type="text" id="laf-order-name" required placeholder="Ex: Carlos Silveira" value="${user?.name || ''}"/>
                  </div>
                  <div class="z8-laf-field">
                    <label for="laf-order-company">RAZÃO SOCIAL / CNPJ DA LOJA *</label>
                    <input type="text" id="laf-order-company" required placeholder="Ex: Mega Motos Elétricas Ltda" value="${user?.company || ''}"/>
                  </div>
                </div>
                <div class="z8-laf-form-row">
                  <div class="z8-laf-field">
                    <label for="laf-order-city">CIDADE E UF DE DESTINO (RAIO 50 KM) *</label>
                    <input type="text" id="laf-order-city" required placeholder="Ex: Campinas - SP" value="${user?.city ? `${user.city} - ${user.state || 'SP'}` : ''}"/>
                  </div>
                  <div class="z8-laf-field">
                    <label for="laf-order-phone">WHATSAPP CORPORATIVO *</label>
                    <input type="tel" id="laf-order-phone" required placeholder="(11) 99999-9999" value="${user?.phone || ''}"/>
                  </div>
                </div>
              </div>

              <div class="z8-laf-checkout-col">
                <h4 class="z8-laf-checkout-title">02 // MODALIDADE DE FATURAMENTO &amp; EXPEDIÇÃO</h4>
                <div class="z8-laf-form-row">
                  <div class="z8-laf-field">
                    <label for="laf-order-payment">CONDIÇÃO COMERCIAL PREFERENCIAL *</label>
                    <select id="laf-order-payment">
                      <option value="Faturamento Direto Matriz SJC (PIX / TED Corporativo)">Faturamento Direto Matriz SJC (PIX / TED Corporativo)</option>
                      <option value="Implantação Nova Franquia (Taxa R$ 35k + 1º Lote 10 Motos)">Implantação Nova Franquia (Taxa R$ 35k + 1º Lote 10 Motos)</option>
                      <option value="Importação Direta Contêiner 40HQ (FOB / CIF)">Importação Direta Contêiner 40HQ (FOB / CIF)</option>
                      <option value="Financiamento B2B / Cartão BNDES / Parcelamento">Financiamento B2B / Cartão BNDES / Parcelamento</option>
                    </select>
                  </div>
                  <div class="z8-laf-field">
                    <label for="laf-order-notes">OBSERVAÇÕES DE CORES E LOGÍSTICA</label>
                    <input type="text" id="laf-order-notes" placeholder="Ex: Priorizar cores Preto Matte, Branco Pérola e Verde Esmeralda"/>
                  </div>
                </div>

                <div class="z8-laf-checkout-actions">
                  <button type="submit" class="z8-laf-submit-order-btn" id="btn-laf-submit-order">
                    <span>TRANSMITIR PEDIDO OFICIAL P/ DIRETORIA (WHATSAPP + CLOUD) ↱</span>
                  </button>
                  <button type="button" class="z8-laf-print-order-btn" onclick="window.printLafOrderQuote()">
                    <span><i class="fa-solid fa-print" style="margin-right:6px;"></i>GERAR ESPELHO DE PEDIDO (PDF / IMPRESSÃO)</span>
                  </button>
                </div>
              </div>
            </form>

            <!-- HISTÓRICO DE PEDIDOS DO LOJISTA -->
            <div id="laf-orders-history-box" class="z8-laf-history-box" style="display:none;">
              <div class="z8-laf-history-header">
                <span><i class="fa-solid fa-clock-rotate-left" style="margin-right:6px;"></i>HISTÓRICO DE PEDIDOS REGISTRADOS NESTA SESSÃO / CONTA</span>
                <span id="laf-orders-history-count">0 Pedidos</span>
              </div>
              <div id="laf-orders-history-list" class="z8-laf-history-list"></div>
            </div>
          </div>
        </div>

</div>
    </div>

    <!-- MODAL LIGHTBOX PARA INSPEÇÃO DE PRANCHA LAF EM TELA CHEIA -->
    <div id="z8-laf-slide-modal" class="z8-laf-lightbox" aria-hidden="true">
      <div class="z8-laf-lightbox-inner">
        <div class="z8-laf-lightbox-top">
          <span id="z8-laf-lightbox-title">PRANCHA OFICIAL LAF EDITION // Z8 E-MOTION</span>
          <div class="z8-laf-lightbox-btns">
            <button type="button" onclick="window.stepLafLightbox(-1)"><i class="fa-solid fa-chevron-left" style="margin-right:4px;"></i> ANTERIOR</button>
            <button type="button" onclick="window.stepLafLightbox(1)">PRÓXIMA <i class="fa-solid fa-chevron-right" style="margin-left:4px;"></i></button>
            <button type="button" class="is-close" onclick="window.closeLafSlideModal()">FECHAR [ESC] <i class="fa-solid fa-xmark" style="margin-left:4px;"></i></button>
          </div>
        </div>
        <div class="z8-laf-lightbox-body">
          <img id="z8-laf-lightbox-img" src="/assets/catalogo_laf_z8/laf_slide_01.jpg" alt="Prancha LAF Ampliada"/>
        </div>
      </div>
    </div>
  `;

  renderSelectedOrderItems();
  recalculateLafOrderTotals();
  renderSavedOrdersHistory();
  bindCheckoutForm();

  // Make page visible immediately if starting at Portal do Lojista
  const pageW = document.querySelector('.page-w');
  if (pageW && document.body.classList.contains('is-portal-only')) {
    pageW.removeAttribute('data-start');
    pageW.style.opacity = '1';
    pageW.style.visibility = 'visible';
    const transW = document.querySelector('.transition-w');
    if (transW) transW.style.display = 'none';
  }

  // Auto-jump to Portal do Lojista when accessed via #portal-lojista or ?portal=1
  const checkPortalDeepLink = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    if (
      hash === '#portal-lojista' ||
      hash === '#laf-block-pedidos' ||
      hash === '#laf-block-fichas' ||
      hash === '#laf-block-catalogo' ||
      params.get('portal') === '1'
    ) {
      const pW = document.querySelector('.page-w');
      if (pW) {
        pW.removeAttribute('data-start');
        pW.style.opacity = '1';
        pW.style.visibility = 'visible';
      }
      const transW = document.querySelector('.transition-w');
      if (transW) {
        transW.style.display = 'none';
      }
      const targetId = hash && hash.startsWith('#laf-') ? hash.slice(1) : 'portal-lojista';
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  };
  checkPortalDeepLink();
  window.addEventListener('hashchange', checkPortalDeepLink);
}

/**
 * Renders compact interactive cards for ONLY the models currently selected in the order
 */
function renderSelectedOrderItems() {
  const grid = document.getElementById('laf-selected-items-grid');
  if (!grid) return;

  const selectedModels = LAF_MODELS.filter((m) => (lafOrderState.quantities[m.id] || 0) > 0);

  if (selectedModels.length === 0) {
    grid.innerHTML = `
      <div class="z8-laf-empty-cart">
        <strong>NENHUMA MOTOCICLETA SELECIONADA NO MOMENTO</strong>
        <span>Adicione unidades diretamente nas fichas Split 40/60 acima ou escolha uma sugestão rápida de lote.</span>
        <button type="button" class="z8-laf-filter-btn is-active" onclick="window.scrollToLafSection('laf-block-fichas')">
          IR PARA AS FICHAS DAS MOTOS ↑
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = selectedModels
    .map((m) => {
      const qty = lafOrderState.quantities[m.id] || 0;
      const subW = m.wholesale * qty;
      const subP = m.profit * qty;
      return `
        <div class="z8-laf-selected-chip-card">
          <img src="${m.rightMain}" alt="${m.shortTitle}" loading="lazy" class="z8-laf-selected-chip-img"/>
          <div class="z8-laf-selected-chip-info">
            <span class="z8-laf-selected-chip-pn">${m.pn} // ${m.shortTitle}</span>
            <strong>${fmtBRLCents(subW)}</strong>
            <small>Unit: ${fmtBRLCents(m.wholesale)} | Lucro: +${fmtBRL(subP)}</small>
          </div>
          <div class="z8-laf-stepper is-compact">
            <button type="button" class="z8-laf-step-btn" onclick="window.adjustLafQty('${m.id}', -1)" aria-label="Diminuir ${m.shortTitle}">−</button>
            <input type="number" min="0" max="500" value="${qty}" onchange="window.setLafQty('${m.id}', this.value)" class="z8-laf-step-input" aria-label="Quantidade ${m.shortTitle}"/>
            <button type="button" class="z8-laf-step-btn" onclick="window.adjustLafQty('${m.id}', 1)" aria-label="Aumentar ${m.shortTitle}">+</button>
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Recalculates all totals across cards and checkout summary HUD
 */
export function recalculateLafOrderTotals() {
  wholesaleOrderStore.syncAllUI();
}
window.recalculateLafOrderTotals = recalculateLafOrderTotals;

// ==========================================================================
// GLOBAL INTERACTIVE HANDLERS FOR PORTAL DO LOJISTA
// ==========================================================================
window.adjustLafQty = function (modelId, delta) {
  playLafTick(delta > 0 ? 'up' : 'down');
  wholesaleOrderStore.adjustQty(modelId, delta);
};

window.setLafQty = function (modelId, val) {
  playLafTick('up');
  wholesaleOrderStore.setQty(modelId, val);
};

window.updateLafColorNote = function (modelId, val) {
  lafOrderState.colorNotes[modelId] = val;
};

window.selectLafModelPreview = function (modelId, imgSrc, colorName, btnEl) {
  const imgEl = document.getElementById(`laf-main-img-${modelId}`);
  if (imgEl && imgSrc) imgEl.src = imgSrc;
  const cardEl = document.getElementById(`laf-sheet-${modelId}`);
  if (cardEl) {
    cardEl.querySelectorAll('.z8-laf-callout-item').forEach((c) => c.classList.remove('is-active'));
  }
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.z8-laf-color-chip').forEach((b) => b.classList.remove('is-active'));
    btnEl.classList.add('is-active');
  }
  lafOrderState.colorNotes[modelId] = colorName;
  playLafTick('up');
};

window.selectLafCalloutPreview = function (modelId, imgSrc, calloutTitle, calloutEl) {
  const imgEl = document.getElementById(`laf-main-img-${modelId}`);
  if (imgEl && imgSrc) imgEl.src = imgSrc;
  const cardEl = document.getElementById(`laf-sheet-${modelId}`);
  if (cardEl) {
    cardEl.querySelectorAll('.z8-laf-callout-item').forEach((c) => c.classList.remove('is-active'));
    cardEl.querySelectorAll('.z8-laf-color-chip').forEach((b) => b.classList.remove('is-active'));
  }
  if (calloutEl) {
    calloutEl.classList.add('is-active');
  }
  playLafTick('up');
};

window.filterLafModels = function (catKey) {
  lafOrderState.activeCategory = catKey;
  document.querySelectorAll('.z8-laf-filter-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.cat === catKey);
  });
  document.querySelectorAll('.z8-laf-sheet-card').forEach((card) => {
    const match = catKey === 'all' || card.dataset.lafCategory === catKey;
    card.style.display = match ? 'grid' : 'none';
  });
  playLafTick('up');
};

window.switchLafPortalModule = function (modName) {
  lafOrderState.activeModule = modName;
  document.querySelectorAll('.z8-laf-mod-tab').forEach((t) => {
    t.classList.toggle('is-active', t.dataset.mod === modName);
  });

  const blocks = {
    institucional: document.getElementById('laf-block-institucional'),
    fichas: document.getElementById('laf-block-fichas'),
    pedidos: document.getElementById('laf-block-pedidos'),
    catalogo: document.getElementById('laf-block-catalogo')
  };

  Object.entries(blocks).forEach(([key, el]) => {
    if (!el) return;
    el.style.display = modName === 'all' || modName === key ? 'block' : 'none';
  });

  playLafTick('up');

  if (modName !== 'all' && blocks[modName]) {
    blocks[modName].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.scrollToLafSection = function (elementId) {
  // Ensure all blocks are visible before scrolling
  if (lafOrderState.activeModule !== 'all') {
    window.switchLafPortalModule('all');
  }
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.setLafOrderMode = function (mode) {
  lafOrderState.mode = mode;
  document.getElementById('btn-mode-lote10')?.classList.toggle('is-active', mode === 'lote10');
  document.getElementById('btn-mode-40hq')?.classList.toggle('is-active', mode === 'container40hq');
  const paySelect = document.getElementById('laf-order-payment');
  if (paySelect && mode === 'container40hq') {
    paySelect.value = 'Importação Direta Contêiner 40HQ (FOB / CIF)';
  }
  playLafTick('up');
  recalculateLafOrderTotals();
};

window.applyLafOrderPreset = function (preset) {
  playLafTick('up');
  wholesaleOrderStore.applyPreset(preset);
};

// Slide Deck / Flipbook Controls
window.getCurrentLafSlide = () => lafOrderState.currentSlide;

window.goToLafSlide = function (pageNum) {
  const num = Math.max(1, Math.min(26, parseInt(pageNum, 10) || 1));
  lafOrderState.currentSlide = num;
  const imgSrc = `/assets/catalogo_laf_z8/laf_slide_${String(num).padStart(2, '0')}.jpg`;
  const pageObj = LAF_PAGES_INDEX.find((p) => p.page === num) || LAF_PAGES_INDEX[0];

  const mainImg = document.getElementById('laf-deck-active-img');
  if (mainImg) mainImg.src = imgSrc;

  const indicator = document.getElementById('laf-deck-page-indicator');
  if (indicator) indicator.textContent = pageObj.title.toUpperCase();

  const selectEl = document.getElementById('laf-slide-select');
  if (selectEl) selectEl.value = String(num);

  document.querySelectorAll('.z8-laf-thumb-btn').forEach((btn) => {
    const active = Number(btn.dataset.slide) === num;
    btn.classList.toggle('is-active', active);
  });

  const lightboxImg = document.getElementById('z8-laf-lightbox-img');
  if (lightboxImg) lightboxImg.src = imgSrc;
  const lightboxTitle = document.getElementById('z8-laf-lightbox-title');
  if (lightboxTitle) lightboxTitle.textContent = pageObj.title.toUpperCase();

  playLafTick('up');
};

window.stepLafSlide = function (delta) {
  const next = ((lafOrderState.currentSlide - 1 + delta + 26) % 26) + 1;
  window.goToLafSlide(next);
};

window.openLafSlideModal = function (pageNum) {
  window.goToLafSlide(pageNum || lafOrderState.currentSlide);
  const modal = document.getElementById('z8-laf-slide-modal');
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (window.lenis?.stop) window.lenis.stop();
};

window.closeLafSlideModal = function () {
  const modal = document.getElementById('z8-laf-slide-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (window.lenis?.start) window.lenis.start();
};

window.stepLafLightbox = function (delta) {
  window.stepLafSlide(delta);
};

window.openPortalLojista = function (targetModule = 'all') {
  const portalEl = document.getElementById('portal-lojista');
  if (!portalEl) return;
  if (targetModule) {
    window.switchLafPortalModule(targetModule);
  }
  portalEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.handlePortalAuthAction = function () {
  const user = getCurrentCatalogUser();
  if (user) {
    if (confirm(`Conectado no Portal Lojista como ${user.name || user.email} (${user.company || 'Parceiro Z8'}).\n\nDeseja desconectar sua conta ou trocar de usuário?`)) {
      logoutCatalogUser();
      syncPortalLojistaUser();
      window.openZ8AuthModal && window.openZ8AuthModal('login');
    }
  } else {
    window.openZ8AuthModal && window.openZ8AuthModal('login');
  }
};

export function syncPortalLojistaUser() {
  const user = getCurrentCatalogUser();
  const idLabel = document.getElementById('laf-partner-identity-label');
  const authBtnLabel = document.getElementById('laf-auth-action-label');

  if (idLabel) {
    idLabel.innerHTML = user
      ? `CONECTADO: <strong>${(user.company || user.name || 'PARCEIRO Z8').toUpperCase()}</strong> (${user.city || 'SJC'}/${user.state || 'SP'})`
      : `TABELA OFICIAL DE ATACADO B2B ABERTA // LOTE MÍNIMO 10 MOTOS (MIX LIVRE)`;
  }
  if (authBtnLabel) {
    authBtnLabel.innerHTML = user ? '<i class="fa-solid fa-user-check" style="margin-right:6px;"></i>CONTA PARCEIRO / SAIR' : '<i class="fa-solid fa-key" style="margin-right:6px;"></i>LOGIN CREDENCIADO';
  }

  if (user) {
    const fName = document.getElementById('laf-order-name');
    const fComp = document.getElementById('laf-order-company');
    const fCity = document.getElementById('laf-order-city');
    const fPhone = document.getElementById('laf-order-phone');
    if (fName && !fName.value) fName.value = user.name || '';
    if (fComp && !fComp.value) fComp.value = user.company || '';
    if (fCity && !fCity.value) fCity.value = user.city ? `${user.city} - ${user.state || 'SP'}` : '';
    if (fPhone && !fPhone.value) fPhone.value = user.phone || '';
  }
}

function renderSavedOrdersHistory() {
  const box = document.getElementById('laf-orders-history-box');
  const listEl = document.getElementById('laf-orders-history-list');
  const countEl = document.getElementById('laf-orders-history-count');
  if (!box || !listEl) return;

  const orders = getSavedWholesaleOrders();
  if (orders.length === 0) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  if (countEl) countEl.textContent = `${orders.length} Pedido(s)`;

  listEl.innerHTML = orders
    .slice(0, 5)
    .map(
      (o) => `
      <div class="z8-laf-history-item">
        <div>
          <strong style="color:#00F0FF;">${o.id}</strong>
          <span>${o.company} (${o.city}) — ${o.totalBikes} Motos</span>
        </div>
        <div class="z8-laf-history-right">
          <strong>${fmtBRLCents(o.totalWholesale)}</strong>
          <span class="z8-laf-history-badge">ENVIADO À MATRIZ SJC</span>
        </div>
      </div>
    `
    )
    .join('');
}

function bindCheckoutForm() {
  const form = document.getElementById('laf-order-checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let totalBikes = 0;
    let totalWholesale = 0;
    let totalRetail = 0;
    let totalProfit = 0;
    const items = [];

    LAF_MODELS.forEach((m) => {
      const qty = lafOrderState.quantities[m.id] || 0;
      if (qty > 0) {
        const subW = m.wholesale * qty;
        const subR = m.retail * qty;
        const subP = m.profit * qty;
        totalBikes += qty;
        totalWholesale += subW;
        totalRetail += subR;
        totalProfit += subP;
        const colorNote = lafOrderState.colorNotes[m.id] || 'Mix Padrão';
        items.push({
          pn: m.pn,
          name: m.shortTitle,
          fullName: m.fullName,
          qty,
          unitWholesale: m.wholesale,
          subtotalWholesale: subW,
          unitRetail: m.retail,
          profit: subP,
          colorNote
        });
      }
    });

    if (totalBikes < 10) {
      alert(`O pedido mínimo de atacado da Z8 E-Motion é de 10 motocicletas (Mix Livre).\nQuantidade atual selecionada: ${totalBikes} unidade(s).`);
      return;
    }

    const name = document.getElementById('laf-order-name')?.value?.trim() || 'Parceiro Z8';
    const company = document.getElementById('laf-order-company')?.value?.trim() || 'Concessionária Z8';
    const city = document.getElementById('laf-order-city')?.value?.trim() || 'São José dos Campos - SP';
    const phone = document.getElementById('laf-order-phone')?.value?.trim() || '';
    const payment = document.getElementById('laf-order-payment')?.value || 'Faturamento Direto Matriz SJC';
    const notes = document.getElementById('laf-order-notes')?.value?.trim() || 'Sem observações adicionais';

    const orderId = `PED-LAF-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const orderPayload = {
      id: orderId,
      name,
      company,
      city,
      phone,
      payment,
      notes,
      mode: lafOrderState.mode,
      totalBikes,
      totalWholesale,
      totalRetail,
      totalProfit,
      items,
      createdAt: new Date().toISOString()
    };

    const submitBtn = document.getElementById('btn-laf-submit-order');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>REGISTRANDO PEDIDO NA MATRIZ Z8...</span>';
    }

    saveWholesaleOrderLocal(orderPayload);
    renderSavedOrdersHistory();

    try {
      const { db } = initFirebase();
      if (db) {
        await Promise.race([
          setDoc(doc(db, 'wholesale_orders', orderId), orderPayload),
          new Promise((r) => setTimeout(r, 2200))
        ]);
      }
    } catch (_) {}

    const itemLines = items
      .map(
        (it) =>
          `• *${it.qty}x ${it.name} (${it.pn})* — Unit: ${fmtBRLCents(it.unitWholesale)} | Sub: *${fmtBRLCents(it.subtotalWholesale)}* [${it.colorNote}]`
      )
      .join('\n');

    const waText = encodeURIComponent(
      `*PEDIDO OFICIAL DE ATACADO B2B // PORTAL LOJISTA LAF 2026*\n` +
        `========================================\n` +
        `*Protocolo:* ${orderId}\n` +
        `*Responsável:* ${name}\n` +
        `*Razão Social / CNPJ:* ${company}\n` +
        `*Cidade / Praça:* ${city}\n` +
        `*WhatsApp:* ${phone}\n` +
        `*Modalidade:* ${payment}\n` +
        `========================================\n\n` +
        `*ITENS DO LOTE (${totalBikes} MOTOCICLETAS):*\n` +
        `${itemLines}\n\n` +
        `----------------------------------------\n` +
        `*TOTAL INVESTIMENTO ATACADO:* ${fmtBRLCents(totalWholesale)}\n` +
        `*FATURAMENTO VAREJO ESTIMADO:* ${fmtBRLCents(totalRetail)}\n` +
        `*LUCRO BRUTO PROJETADO LOJISTA:* +${fmtBRLCents(totalProfit)}\n` +
        `*OBSERVAÇÕES:* ${notes}\n` +
        `----------------------------------------\n\n` +
        `Olá, Christian! Acabei de montar este pedido no Portal do Lojista Z8 (Edição LAF 2026). Solicito a emissão do espelho de faturamento e reserva de lote.`
    );

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span><i class="fa-solid fa-check" style="margin-right:6px;"></i>PEDIDO REGISTRADO! ENVIAR NOVO PEDIDO ↱</span>';
    }

    playLafTick('up');
    window.open(`https://wa.me/5512998008818?text=${waText}`, '_blank');
  });
}

/**
 * Generates a Printable / PDF Official Wholesale Purchase Order Sheet
 */
window.printLafOrderQuote = function () {
  let totalBikes = 0;
  let totalWholesale = 0;
  let totalRetail = 0;
  let totalProfit = 0;
  const rowsHtml = [];

  LAF_MODELS.forEach((m) => {
    const qty = lafOrderState.quantities[m.id] || 0;
    if (qty > 0) {
      const subW = m.wholesale * qty;
      const subR = m.retail * qty;
      const subP = m.profit * qty;
      totalBikes += qty;
      totalWholesale += subW;
      totalRetail += subR;
      totalProfit += subP;
      rowsHtml.push(`
        <tr>
          <td><strong>${m.pn}</strong></td>
          <td><strong>${m.fullName}</strong><br/><small>${m.base} | ${lafOrderState.colorNotes[m.id] || 'Mix Padrão'}</small></td>
          <td>${m.specs[0].v1} / ${m.specs[1].v1}</td>
          <td style="text-align:center;"><strong>${qty}</strong></td>
          <td style="text-align:right;">${fmtBRLCents(m.wholesale)}</td>
          <td style="text-align:right;"><strong>${fmtBRLCents(subW)}</strong></td>
          <td style="text-align:right; color:#059669;">+${fmtBRLCents(subP)}</td>
        </tr>
      `);
    }
  });

  if (totalBikes === 0) {
    alert('Selecione ao menos 1 modelo na tabela para gerar o Espelho de Pedido.');
    return;
  }

  const name = document.getElementById('laf-order-name')?.value?.trim() || 'Parceiro Comercial Z8';
  const company = document.getElementById('laf-order-company')?.value?.trim() || 'Concessionária / Lojista';
  const city = document.getElementById('laf-order-city')?.value?.trim() || 'Brasil';
  const payment = document.getElementById('laf-order-payment')?.value || 'Faturamento Direto CNPJ';
  const protocol = `PED-LAF-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

  const printWin = window.open('', '_blank', 'width=1020,height=800');
  if (!printWin) return;

  printWin.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8"/>
      <title>Espelho de Pedido B2B — ${protocol} — Z8 E-Motion</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #0F172A; margin: 28px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0A1628; padding-bottom: 16px; margin-bottom: 20px; }
        .brand h1 { margin: 0; font-size: 24px; letter-spacing: -0.5px; color: #0A1628; }
        .brand p { margin: 4px 0 0; font-size: 12px; color: #475569; }
        .meta { text-align: right; font-size: 12px; }
        .meta strong { font-size: 15px; color: #0284C7; display: block; }
        .dealer-box { background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; }
        th { background: #0A1628; color: #FFF; text-align: left; padding: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
        .totals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .tot-card { border: 1px solid #CBD5E1; border-radius: 4px; padding: 12px; background: #F8FAFC; }
        .tot-card span { display: block; font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: 700; }
        .tot-card strong { display: block; font-size: 18px; margin-top: 4px; color: #0A1628; }
        .footer { margin-top: 36px; font-size: 11px; color: #64748B; border-top: 1px solid #CBD5E1; padding-top: 12px; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <h1>Z8 E-MOTION VEÍCULOS ELÉTRICOS // ESPELHO DE PEDIDO B2B</h1>
          <p>Z8 EMOTION LTDA. | CNPJ: 68.774.164/0001-00 | Av. Dr. Adhemar de Barros, 566 — São José dos Campos/SP</p>
        </div>
        <div class="meta">
          <strong>${protocol}</strong>
          <span>Data: ${new Date().toLocaleDateString('pt-BR')}</span><br/>
          <span>Catálogo Oficial LAF Edition 2026</span>
        </div>
      </div>
      <div class="dealer-box">
        <div><strong>Responsável / Lojista:</strong> ${name}</div>
        <div><strong>Razão Social / CNPJ:</strong> ${company}</div>
        <div><strong>Praça / Destino:</strong> ${city}</div>
        <div><strong>Modalidade:</strong> ${payment}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>PN CÓD.</th>
            <th>MODELO Z8 &amp; ESPECIFICAÇÃO</th>
            <th>MOTOR / BATERIA</th>
            <th style="text-align:center;">QTD</th>
            <th style="text-align:right;">ATACADO UN.</th>
            <th style="text-align:right;">SUBTOTAL ATACADO</th>
            <th style="text-align:right;">LUCRO VAREJO</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>
      <div class="totals">
        <div class="tot-card"><span>Total de Motocicletas</span><strong>${totalBikes} Unidades</strong></div>
        <div class="tot-card"><span>Investimento Total Atacado</span><strong>${fmtBRLCents(totalWholesale)}</strong></div>
        <div class="tot-card"><span>Faturamento Varejo Sug.</span><strong>${fmtBRLCents(totalRetail)}</strong></div>
        <div class="tot-card"><span>Lucro Bruto Lojista</span><strong style="color:#059669;">+${fmtBRLCents(totalProfit)}</strong></div>
      </div>
      <div class="footer">
        <span>Documento gerado pelo Portal do Lojista Z8 E-Motion (z8emotion.com) — Homologação CONTRAN 996</span>
        <span>Central Atacado SJC: (12) 99800-8818 (Christian Hideyuki)</span>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 350);</script>
    </body>
    </html>
  `);
  printWin.document.close();
};

function initStickyBarScrollObserver() {
  const portalEl = document.getElementById('portal-lojista');
  const stickyBar = document.getElementById('z8-laf-sticky-order-bar');
  if (!portalEl || !stickyBar) return;

  const checkVisibility = () => {
    const rect = portalEl.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const isInsidePortal = rect.top < vh * 0.65 && rect.bottom > vh * 0.25;
    stickyBar.classList.toggle('is-visible', isInsidePortal);
  };

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
}
