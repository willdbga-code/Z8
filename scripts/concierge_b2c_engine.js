import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z8Models } from '../site-principal/data/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Rede de Lojas Físicas & Parceiros Credenciados no Vale do Paraíba
export const DEALERSHIP_NETWORK = {
  'SÃO JOSÉ DOS CAMPOS': {
    name: 'Z8 Matriz & Flagship São Dimas',
    address: 'Av. Dr. Adhemar de Barros, 566 - Jd. São Dimas, São José dos Campos - SP',
    contact: '(12) 99800-8818',
    testRideAvailable: true
  },
  'JACAREÍ': {
    name: 'Concessionária Autorizada Z8 Jacareí',
    address: 'Centro Comercial / Corredor Principal, Jacareí - SP',
    contact: '(12) 99800-8818',
    testRideAvailable: true
  },
  'TAUBATÉ': {
    name: 'Concessionária Autorizada Z8 Taubaté',
    address: 'Eixo Dutra / Av. Principal, Taubaté - SP',
    contact: '(12) 99800-8818',
    testRideAvailable: true
  },
  'PINDAMONHANGABA': {
    name: 'Ponto Autorizado Z8 Pinda',
    address: 'Região Central, Pindamonhangaba - SP',
    contact: '(12) 99800-8818',
    testRideAvailable: true
  },
  'GUARATINGUETÁ': {
    name: 'Concessionária Autorizada Z8 Guará',
    address: 'Vale Histórico, Guaratinguetá - SP',
    contact: '(12) 99800-8818',
    testRideAvailable: true
  }
};

// 1. Recomendador Inteligente de Modelo
export function recommendModel({ primaryUse, stylePreference }) {
  let matchedModel;

  if (primaryUse === 'DELIVERY' || primaryUse === 'TRABALHO') {
    matchedModel = z8Models.find(m => m.id === 'z8-u2') || z8Models.find(m => m.code === 'GS-005');
  } else if (stylePreference === 'RETRO_VINTAGE') {
    matchedModel = z8Models.find(m => m.id === 'z8-diamond') || z8Models.find(m => m.id === 'z8-q10');
  } else if (stylePreference === 'CUSTOM_CHOPPER') {
    matchedModel = z8Models.find(m => m.id === 'z8-harley-x21');
  } else if (stylePreference === 'ESPORTIVA_AGRESSIVA') {
    matchedModel = z8Models.find(m => m.id === 'z8-fx10');
  } else {
    // Padrão Urbana / Alta Velocidade Off-Road
    matchedModel = z8Models.find(m => m.id === 'z8-tank') || z8Models.find(m => m.id === 'z8-n95c');
  }

  return matchedModel;
}

// 2. Esclarecimento Regulatório CONTRAN 996
export function explainContranCompliance(model) {
  const isAutopropelled = model.speed && model.speed.includes('32 km/h');
  
  if (isAutopropelled) {
    return {
      category: 'Equipamento Autopropelido (Resolução CONTRAN 996/2023)',
      cnhRequirement: 'NÃO EXIGE CNH e nem habilitação ACC.',
      plateRequirement: 'NÃO EXIGE EMPLACAMENTO nem IPVA.',
      allowedCirculation: 'Ciclovias, ciclofaixas e vias urbanas com limite regulamentado de até 40 km/h.',
      safetyEquip: 'Capacete (ciclístico ou motociclístico), buzina, espelho retrovisor e sinalização noturna de fábrica.'
    };
  } else {
    return {
      category: 'Ciclomotor / Motocicleta Elétrica',
      cnhRequirement: 'Exige CNH Categoria A ou autorização ACC.',
      plateRequirement: 'Emplacamento padrão no Detran.',
      allowedCirculation: 'Vias urbanas, avenidas e trânsito pleno.',
      safetyEquip: 'Capacete motociclístico regulamentado pelo Inmetro.'
    };
  }
}

// 3. Calculadora de Economia de Combustível vs Energia
export function calculateChargingEconomics(dailyKm = 25, tariffKwh = 0.95) {
  const monthlyKm = dailyKm * 30; // 750 km/mês
  
  // Consumo Elétrico: Média de 0.04 kWh por km
  const monthlyKwh = monthlyKm * 0.04; // 30 kWh
  const electricMonthlyCost = Number((monthlyKwh * tariffKwh).toFixed(2));
  const costPerFullCharge = Number((1.8 * tariffKwh).toFixed(2)); // bateria 60V 20Ah / ~1.8 kWh

  // Comparativo com Moto a Gasolina (Média de 35 km por litro, gasolina a R$ 6,10/L)
  const litersGasolineNeeded = monthlyKm / 35;
  const gasolineMonthlyCost = Number((litersGasolineNeeded * 6.10).toFixed(2));

  const monthlySavings = Number((gasolineMonthlyCost - electricMonthlyCost).toFixed(2));
  const annualSavings = Number((monthlySavings * 12).toFixed(2));

  return {
    dailyKm,
    monthlyKm,
    costPerFullCharge: `R$ ${costPerFullCharge.toLocaleString('pt-BR')}`,
    costPerKmElectric: `R$ ${(electricMonthlyCost / monthlyKm).toFixed(3)}`,
    electricMonthlyCost: `R$ ${electricMonthlyCost.toLocaleString('pt-BR')}`,
    gasolineMonthlyCost: `R$ ${gasolineMonthlyCost.toLocaleString('pt-BR')}`,
    monthlySavings: `R$ ${monthlySavings.toLocaleString('pt-BR')}`,
    annualSavings: `R$ ${annualSavings.toLocaleString('pt-BR')}`
  };
}

// 4. Roteamento Geolocalizado de Loja
export function routeCustomerToStore(cityInput) {
  const cleanCity = (cityInput || '').toUpperCase();
  for (const [cityName, storeInfo] of Object.entries(DEALERSHIP_NETWORK)) {
    if (cleanCity.includes(cityName)) {
      return {
        matchedCity: cityName,
        hasStore: true,
        store: storeInfo,
        cta: `Sua cidade já possui concessionária oficial Z8! Agende o seu Test-Ride pelo telefone ${storeInfo.contact}.`
      };
    }
  }

  return {
    matchedCity: cityInput,
    hasStore: false,
    store: {
      name: 'Z8 Matriz - Central de Atendimento & Venda Direta',
      address: 'São José dos Campos - SP (Envio Nacional com Frete Técnico)',
      contact: '(12) 99800-8818'
    },
    cta: 'Sua região conta com atendimento direto da Matriz Z8 com entrega técnica em domicílio.'
  };
}

// Execução de Teste Direto via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`=== Z8 CONCIERGE B2C // SIMULAÇÃO DE ATENDIMENTO AO CONSUMIDOR ===\n`);

  // Caso 1: Cliente jovem buscando esportividade em São José dos Campos
  console.log(`[TESTE 1] CLIENTE BUSCA ESPORTIVIDADE URBANA EM SÃO JOSÉ DOS CAMPOS:`);
  const model1 = recommendModel({ primaryUse: 'LAZER_E_TRANSPORTE', stylePreference: 'ESPORTIVA_AGRESSIVA' });
  console.log(`Modelo Recomendado: ${model1.name} (${model1.code}) - R$ ${model1.retailPrice.toLocaleString('pt-BR')}`);
  console.log(`Motor & Bateria: ${model1.motor} | ${model1.battery}`);
  
  const contran1 = explainContranCompliance(model1);
  console.log(`Regra CONTRAN 996: ${contran1.category}`);
  console.log(`Exigência de CNH: ${contran1.cnhRequirement}`);
  console.log(`Emplacamento: ${contran1.plateRequirement}`);

  const store1 = routeCustomerToStore('São José dos Campos');
  console.log(`Direcionamento de Loja: ${store1.store.name} (${store1.store.address})`);
  console.log(`Ação: ${store1.cta}\n`);

  // Caso 2: Cliente buscando economia de combustível rodando 30 km/dia
  console.log(`[TESTE 2] CÁLCULO DE ECONOMIA NA CONTA DE LUZ (30 KM/DIA):`);
  const eco = calculateChargingEconomics(30);
  console.log(`Custo por Recarga Completa (Tomada Comum 110V/220V): ${eco.costPerFullCharge}`);
  console.log(`Custo por KM Rodado: ${eco.costPerKmElectric}`);
  console.log(`Gasto Mensal na Conta de Luz (900 km): ${eco.electricMonthlyCost}`);
  console.log(`Gasto Equivalente em Gasolina: ${eco.gasolineMonthlyCost}`);
  console.log(`ECONOMIA LÍQUIDA NO BOLSO: ${eco.monthlySavings} por mês (${eco.annualSavings} por ano!)`);

  console.log(`\n=== MOTOR DE CONCIERGE B2C OPERACIONAL COM SUCESSO! ===`);
}
