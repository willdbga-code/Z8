import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z8Models } from '../site-principal/data/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Parâmetros Financeiros Oficiais Z8 (2026)
export const FINANCIAL_PARAMETERS = {
  TAXA_INICIAL_FRANQUIA: 35000,
  ROYALTIES_MENSAIS: 6800,
  TRAFEGO_PAGO_MENSAL: 1000,
  ADEQUACAO_LOJA_ESTIMADA: 18000, // Pintura Platina, ACM escovado, 2 elevadores, piso epóxi
  ALUGUEL_PADRAO_50M2: 3800,
  FOLHA_PAGAMENTO_2_FUNCIONARIOS: 6000, // 1 Vendedor + 1 Mecânico + encargos
  DESPESAS_OPERACIONAIS: 1200 // Água, Luz, Internet, Sistema
};

// Calcula a média ponderada do mix de modelos Z8
export function getCatalogAverages() {
  const count = z8Models.length;
  const sumWholesale = z8Models.reduce((acc, m) => acc + m.wholesalePrice, 0);
  const sumRetail = z8Models.reduce((acc, m) => acc + m.retailPrice, 0);
  const sumProfit = z8Models.reduce((acc, m) => acc + (m.profit ?? (m.retailPrice - m.wholesalePrice)), 0);

  const avgWholesale = Math.round(sumWholesale / count);
  const avgRetail = Math.round(sumRetail / count);
  const avgProfit = Math.round(sumProfit / count);
  const avgMarginPct = Number(((avgProfit / avgRetail) * 100).toFixed(1));

  return { avgWholesale, avgRetail, avgProfit, avgMarginPct };
}

// Simulador de DRE Trifásico
export function generateFranchiseDRE(customParams = {}) {
  const params = { ...FINANCIAL_PARAMETERS, ...customParams };
  const { avgWholesale, avgRetail, avgProfit, avgMarginPct } = getCatalogAverages();

  const totalFixedCosts = 
    params.ROYALTIES_MENSAIS +
    params.TRAFEGO_PAGO_MENSAL +
    params.ALUGUEL_PADRAO_50M2 +
    params.FOLHA_PAGAMENTO_2_FUNCIONARIOS +
    params.DESPESAS_OPERACIONAIS;

  const scenarios = [
    {
      name: 'Conservador (1 Lote Contratual)',
      units: 10,
      workshopRevenue: 4500
    },
    {
      name: 'Moderado (1,5 Lotes)',
      units: 15,
      workshopRevenue: 6500
    },
    {
      name: 'Acelerado (2 Lotes)',
      units: 20,
      workshopRevenue: 8500
    }
  ];

  const initialWorkingCapital = 10 * avgWholesale; // 1º lote de 10 motos
  const totalInitialInvestment = params.TAXA_INICIAL_FRANQUIA + params.ADEQUACAO_LOJA_ESTIMADA + initialWorkingCapital;

  const scenarioResults = scenarios.map(sc => {
    const grossBikeRevenue = sc.units * avgRetail;
    const cogsBike = sc.units * avgWholesale;
    const grossBikeProfit = sc.units * avgProfit;

    const totalGrossRevenue = grossBikeRevenue + sc.workshopRevenue;
    const totalGrossProfit = grossBikeProfit + sc.workshopRevenue; // Oficina com margem direta de serviço/peças

    const netProfit = totalGrossProfit - totalFixedCosts;
    const netMarginPct = Number(((netProfit / totalGrossRevenue) * 100).toFixed(1));
    const paybackMonths = Number((totalInitialInvestment / netProfit).toFixed(1));

    return {
      scenarioName: sc.name,
      unitsSold: sc.units,
      grossBikeRevenue,
      cogsBike,
      grossBikeProfit,
      workshopRevenue: sc.workshopRevenue,
      totalGrossRevenue,
      totalFixedCosts,
      netProfit,
      netMarginPct,
      paybackMonths
    };
  });

  // Cálculo de Ponto de Equilíbrio (Break-even de Motos)
  // Sem oficina:
  const breakEvenPure = Math.ceil(totalFixedCosts / avgProfit);
  // Com oficina conservadora (R$ 4.500 amortizando custos):
  const breakEvenWithWorkshop = Math.ceil((totalFixedCosts - 4500) / avgProfit);

  return {
    catalogAverages: { avgWholesale, avgRetail, avgProfit, avgMarginPct },
    totalInitialInvestment,
    initialInvestmentBreakdown: {
      franchiseFee: params.TAXA_INICIAL_FRANQUIA,
      initial10BikeStock: initialWorkingCapital,
      storeAndLiftsFitout: params.ADEQUACAO_LOJA_ESTIMADA
    },
    monthlyFixedCosts: totalFixedCosts,
    fixedCostsBreakdown: {
      royaltiesZ8: params.ROYALTIES_MENSAIS,
      localTrafficFund: params.TRAFEGO_PAGO_MENSAL,
      rentAndIptu: params.ALUGUEL_PADRAO_50M2,
      payroll2Staff: params.FOLHA_PAGAMENTO_2_FUNCIONARIOS,
      operationalExpenses: params.DESPESAS_OPERACIONAIS
    },
    breakEven: {
      pureBikesNeeded: breakEvenPure,
      bikesNeededWithWorkshop: breakEvenWithWorkshop
    },
    scenarios: scenarioResults
  };
}

// Execução de Teste Direto via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`=== Z8 FINANCE INTEL // MODELAGEM FINANCEIRA DE FRANQUIA ===\n`);

  const dre = generateFranchiseDRE();

  console.log(`1. MÉTRICAS MÉDIAS DO CATÁLOGO (11 MODELOS):`);
  console.log(`   Preço Médio Atacado: R$ ${dre.catalogAverages.avgWholesale.toLocaleString('pt-BR')}`);
  console.log(`   Preço Médio Varejo:  R$ ${dre.catalogAverages.avgRetail.toLocaleString('pt-BR')}`);
  console.log(`   Lucro Bruto Médio:   R$ ${dre.catalogAverages.avgProfit.toLocaleString('pt-BR')} (Margem: ${dre.catalogAverages.avgMarginPct}%)\n`);

  console.log(`2. INVESTIMENTO INICIAL TOTAL ESTIMADO: R$ ${dre.totalInitialInvestment.toLocaleString('pt-BR')}`);
  console.log(`   - Taxa de Franquia: R$ ${dre.initialInvestmentBreakdown.franchiseFee.toLocaleString('pt-BR')}`);
  console.log(`   - 1º Lote de 10 Motos (Estoque Atacado): R$ ${dre.initialInvestmentBreakdown.initial10BikeStock.toLocaleString('pt-BR')}`);
  console.log(`   - Adequação Loja (Epóxi, ACM, 2 Elevadores): R$ ${dre.initialInvestmentBreakdown.storeAndLiftsFitout.toLocaleString('pt-BR')}\n`);

  console.log(`3. CUSTOS FIXOS MENSAIS OPERACIONAIS: R$ ${dre.monthlyFixedCosts.toLocaleString('pt-BR')} / mês`);
  console.log(`   - Royalties Z8: R$ ${dre.fixedCostsBreakdown.royaltiesZ8.toLocaleString('pt-BR')}`);
  console.log(`   - Tráfego Pago Centralizado: R$ ${dre.fixedCostsBreakdown.localTrafficFund.toLocaleString('pt-BR')}`);
  console.log(`   - Aluguel Comercial (50m²): R$ ${dre.fixedCostsBreakdown.rentAndIptu.toLocaleString('pt-BR')}`);
  console.log(`   - Folha de Pagamento (Vendedor + Mecânico): R$ ${dre.fixedCostsBreakdown.payroll2Staff.toLocaleString('pt-BR')}`);
  console.log(`   - Contas & Sistemas: R$ ${dre.fixedCostsBreakdown.operationalExpenses.toLocaleString('pt-BR')}\n`);

  console.log(`4. PONTO DE EQUILÍBRIO (BREAK-EVEN):`);
  console.log(`   - Com oficina (2 elevadores amortizando R$ 4.500): APENAS ${dre.breakEven.bikesNeededWithWorkshop} MOTOS / mês`);
  console.log(`   - Sem considerar oficina: ${dre.breakEven.pureBikesNeeded} motos / mês\n`);

  console.log(`5. DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO (DRE) - 3 CENÁRIOS:`);
  console.log(`-----------------------------------------------------------------------------------------------------`);
  console.log(`Indicador                     | Conservador (10 Motos) | Moderado (15 Motos)    | Acelerado (20 Motos)`);
  console.log(`-----------------------------------------------------------------------------------------------------`);
  console.log(`Receita Venda de Motos        | R$ ${dre.scenarios[0].grossBikeRevenue.toLocaleString('pt-BR')}             | R$ ${dre.scenarios[1].grossBikeRevenue.toLocaleString('pt-BR')}            | R$ ${dre.scenarios[2].grossBikeRevenue.toLocaleString('pt-BR')}`);
  console.log(`Receita Oficina (2 Elevadores)| R$ ${dre.scenarios[0].workshopRevenue.toLocaleString('pt-BR')}              | R$ ${dre.scenarios[1].workshopRevenue.toLocaleString('pt-BR')}             | R$ ${dre.scenarios[2].workshopRevenue.toLocaleString('pt-BR')}`);
  console.log(`Faturamento Bruto Total       | R$ ${dre.scenarios[0].totalGrossRevenue.toLocaleString('pt-BR')}            | R$ ${dre.scenarios[1].totalGrossRevenue.toLocaleString('pt-BR')}           | R$ ${dre.scenarios[2].totalGrossRevenue.toLocaleString('pt-BR')}`);
  console.log(`(-) Custo das Motos (Atacado) | R$ ${dre.scenarios[0].cogsBike.toLocaleString('pt-BR')}             | R$ ${dre.scenarios[1].cogsBike.toLocaleString('pt-BR')}            | R$ ${dre.scenarios[2].cogsBike.toLocaleString('pt-BR')}`);
  console.log(`(-) Custos Fixos & Royalties  | R$ ${dre.scenarios[0].totalFixedCosts.toLocaleString('pt-BR')}             | R$ ${dre.scenarios[1].totalFixedCosts.toLocaleString('pt-BR')}            | R$ ${dre.scenarios[2].totalFixedCosts.toLocaleString('pt-BR')}`);
  console.log(`-----------------------------------------------------------------------------------------------------`);
  console.log(`LUCRO LÍQUIDO MENSAL          | R$ ${dre.scenarios[0].netProfit.toLocaleString('pt-BR')}             | R$ ${dre.scenarios[1].netProfit.toLocaleString('pt-BR')}            | R$ ${dre.scenarios[2].netProfit.toLocaleString('pt-BR')}`);
  console.log(`Margem Líquida                | ${dre.scenarios[0].netMarginPct}%                   | ${dre.scenarios[1].netMarginPct}%                  | ${dre.scenarios[2].netMarginPct}%`);
  console.log(`Payback do Investimento       | ${dre.scenarios[0].paybackMonths} meses               | ${dre.scenarios[1].paybackMonths} meses              | ${dre.scenarios[2].paybackMonths} meses`);
  console.log(`-----------------------------------------------------------------------------------------------------\n`);
}
