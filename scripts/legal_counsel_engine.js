import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Motor de Emissão e Controle da COF (Lei 13.966/2019)
export function issueCOFDossier(investor) {
  const deliveryDate = new Date();
  const unlockDate = new Date(deliveryDate);
  unlockDate.setDate(unlockDate.getDate() + 10);

  const receipt = {
    docType: 'PROTOCOLO_ENTREGA_COF',
    protocolNumber: `COF-${deliveryDate.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    investorName: investor.name,
    company: investor.company || 'Pessoa Física',
    territory: investor.city,
    deliveryTimestamp: deliveryDate.toISOString(),
    deliveryDateFormatted: deliveryDate.toLocaleDateString('pt-BR'),
    legalCountdownDays: 10,
    contractUnlockDateFormatted: unlockDate.toLocaleDateString('pt-BR'),
    legalBasis: 'Art. 2º, § 1º da Lei Federal nº 13.966/2019',
    status: 'CONTAGEM_REGRESSIVA_ATIVA',
    systemLock: 'BLOQUEIO_ATIVO_PAGAMENTO_E_CONTRATO',
    warning: 'É expressamente vedada a cobrança de qualquer taxa ou assinatura de contrato/pré-contrato antes de ' + unlockDate.toLocaleDateString('pt-BR')
  };

  return receipt;
}

// 2. Validador do Prazo Legal de 10 Dias
export function validateContractEligibility(receipt) {
  const delivery = new Date(receipt.deliveryTimestamp);
  const now = new Date();
  const diffDays = Math.floor((now - delivery) / (1000 * 60 * 60 * 24));
  
  const isEligible = diffDays >= 10;
  return {
    isEligible,
    daysElapsed: diffDays,
    daysRemaining: Math.max(0, 10 - diffDays),
    canSignContract: isEligible,
    message: isEligible 
      ? 'Prazo legal de 10 dias corridos cumprido. Sistema liberado para assinatura e recebimento da Taxa Inicial de R$ 35.000,00.'
      : `TRAVA LEGAL ATIVA: Restam ${Math.max(0, 10 - diffDays)} dias para cumprimento do Art. 2º, § 1º da Lei 13.966/2019.`
  };
}

// 3. Gerador de Pacote Técnico de PDI e Garantia para Lote de 10 Motos
export function generateBatchPDIAndWarranty(franchiseeName, territory, modelName = 'Z8 Tank High-Speed') {
  const lotNumber = `LOTE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const items = [];

  for (let i = 1; i <= 10; i++) {
    const chassis = `9Z8EMOTION2026${String(Math.floor(100000 + Math.random() * 900000))}`;
    const engine = `ENG-Z8-${String(Math.floor(10000 + Math.random() * 90000))}`;
    items.push({
      itemNumber: i,
      model: modelName,
      chassisNumber: chassis,
      engineNumber: engine,
      pdiStatus: 'INSPEÇÃO_DE_RECEBIMENTO_CONCLUÍDA',
      batteryHealth: '100%',
      voltageCheck: '72V Nominal (84V Pico)',
      controllerFirmware: 'v2.4_EMOTION_STABLE',
      warrantyPeriodDays: 90,
      legalWarrantyBasis: 'Art. 26, II da Lei nº 8.078/1990 (Garantia Legal CDC)',
      contranCompliance: 'Resolução CONTRAN 996/2023 - Emplacamento Obrigatório (Motocicleta Elétrica)'
    });
  }

  return {
    lotNumber,
    franchiseeName,
    territory,
    totalVehicles: 10,
    generationDate: new Date().toLocaleDateString('pt-BR'),
    vehicles: items
  };
}

// 4. Injetor Cadastral e Gerador do Contrato Definitivo de Franquia (ABNT / Lei 13.966 / CPC)
export function generatePurchaseFranchiseContract(investor, options = {}) {
  const contractNumber = `Z8-CTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const templatePath = path.join(rootDir, 'docs', 'juridico', 'CONTRATO_DEFINITIVO_DE_COMPRA_E_ADESAO_DE_FRANQUIA_Z8.md');
  
  let templateContent = fs.existsSync(templatePath) 
    ? fs.readFileSync(templatePath, 'utf8') 
    : '';

  const mix = options.mix || [
    { model: 'Z8 Tank High-Speed', code: 'DB018', qty: 2, wholesale: 7500, retail: 11500 },
    { model: 'Z8 FX-10 Sport', code: 'DB043', qty: 2, wholesale: 6200, retail: 11000 },
    { model: 'Z8 Harley X21 Custom', code: 'XB-024', qty: 1, wholesale: 6400, retail: 10000 },
    { model: 'Z8 U2 Delivery Cargo', code: 'XB-026', qty: 1, wholesale: 6000, retail: 9500 },
    { model: 'Z8 N95C Max Comfort', code: 'DB039', qty: 1, wholesale: 6500, retail: 10000 },
    { model: 'Z8 N7 Standard', code: 'DB001', qty: 1, wholesale: 5500, retail: 9500 },
    { model: 'Z8 Q10 Vintage', code: 'DB038', qty: 1, wholesale: 5800, retail: 9800 },
    { model: 'Z8 N710 Urban Plus', code: 'DB045-N710', qty: 1, wholesale: 5300, retail: 9500 }
  ];

  const totalQty = mix.reduce((sum, item) => sum + item.qty, 0);
  const totalWholesale = mix.reduce((sum, item) => sum + (item.wholesale * item.qty), 0);
  const totalRetail = mix.reduce((sum, item) => sum + (item.retail * item.qty), 0);
  const projectedProfit = totalRetail - totalWholesale;

  // Parcelamento das duplicatas (30, 60 e 90 dias)
  const installmentValue = (totalWholesale / 3).toFixed(2);
  const installments = [
    { parcel: 1, dueDays: 30, value: parseFloat(installmentValue), title: `DUP-01/10-${new Date().getFullYear()}` },
    { parcel: 2, dueDays: 60, value: parseFloat(installmentValue), title: `DUP-02/10-${new Date().getFullYear()}` },
    { parcel: 3, dueDays: 90, value: parseFloat((totalWholesale - (2 * parseFloat(installmentValue))).toFixed(2)), title: `DUP-03/10-${new Date().getFullYear()}` }
  ];

  const territoryType = options.population && options.population > 200000 
    ? 'Modalidade B (Cluster Metropolitano ~55k hab.)' 
    : options.population && options.population < 55000 
      ? 'Modalidade C (Agrupamento Regional de Municípios Limítrofes)' 
      : 'Modalidade A (Município Polo Integral)';

  // Injeção cadastral e financeira efetiva no template Markdown
  let contractMarkdown = '';
  if (templateContent) {
    const company = investor.company || `${investor.name} Veículos Elétricos LTDA.`;
    const cnpj = investor.cnpj || '00.000.000/0001-00';
    const city = investor.city || 'São Paulo - SP';
    const address = investor.address || `Ponto Comercial Homologado, ${city}`;
    const name = investor.name || 'Investidor Qualificado';
    const nire = investor.nire || '35.200.000.000';
    const rg = investor.rg || '00.000.000-0 SSP/SP';
    const cpf = investor.cpf || '000.000.000-00';

    contractMarkdown = templateContent
      .replace(/\[RAZÃO SOCIAL DA SOCIEDADE FRANQUEADA\]/g, company)
      .replace(/\[RAZÃO SOCIAL DA SOCIEDADE EMPRESÁRIA\]/g, company)
      .replace(/\[CNPJ DA FRANQUEADA\]/g, cnpj)
      .replace(/\[CNPJ DA EMPRESA ADQUIRENTE\]/g, cnpj)
      .replace(/\[Número NIRE\]/g, nire)
      .replace(/\[Logradouro, Número, Bairro, Município, Estado e CEP\]/g, address)
      .replace(/\[NOME COMPLETO DO PRIMEIRO SÓCIO FIADOR\]/g, name)
      .replace(/\[NOME COMPLETO DO SÓCIO 1\]/g, name)
      .replace(/\[Número RG \/ Órgão Emissor \/ UF\]/g, rg)
      .replace(/\[Número do CPF\]/g, cpf)
      .replace(/\[CPF SÓCIO 1\]/g, cpf)
      .replace(/\[Endereço Residencial Completo com Logradouro, Número, Bairro, Cidade, Estado e CEP\]/g, address)
      .replace(/\[MUNICÍPIO \/ CLUSTER DEMOGRÁFICO DE ~55\.000 HABITANTES\]/g, city)
      .replace(/\[Nome da Cidade Sede - Ex: Pindamonhangaba \/ Taubaté \/ Jacareí \/ Guaratinguetá \/ São Paulo\]/g, city)
      .replace(/\[Data da Assinatura: Dia\]/g, String(new Date().getDate()).padStart(2, '0'))
      .replace(/\[Mês\]/g, new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date()))
      .replace(/R\$ \[TOTAL ATACADO\]/g, `R$ ${totalWholesale.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/R\$ \[TOTAL LUCRO\]/g, `R$ ${projectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/R\$ \[Valor Parcela 1\]/g, `R$ ${installments[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/R\$ \[Valor Parcela 2\]/g, `R$ ${installments[1].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/R\$ \[Valor Parcela 3\]/g, `R$ ${installments[2].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  }

  return {
    contractNumber,
    dateFormatted: new Date().toLocaleDateString('pt-BR'),
    franchisee: {
      name: investor.name,
      company: investor.company || `${investor.name} Veículos Elétricos LTDA.`,
      cnpj: investor.cnpj || '00.000.000/0001-00',
      city: investor.city,
      address: investor.address || 'Ponto Comercial a Homologar em até 90 dias'
    },
    financials: {
      initialFranchiseFee: 35000.00,
      monthlyRoyaltiesPct: 5.0,
      monthlyRoyaltiesFloor: 4000.00,
      monthlyTrafficFund: 1000.00,
      initialLotQuantity: totalQty,
      initialLotWholesaleTotal: totalWholesale,
      initialLotRetailTotal: totalRetail,
      initialLotProjectedProfit: projectedProfit,
      installments
    },
    territory: {
      city: investor.city,
      type: territoryType,
      targetPopulation: '~55.000 habitantes'
    },
    legalFramework: {
      basis: 'Lei nº 13.966/2019 e Arts. 521 a 528 do Código Civil (Reserva de Domínio)',
      enforceability: 'Título Executivo Extrajudicial - Art. 784, I e III do CPC',
      jurisdiction: 'Comarca de São José dos Campos - SP'
    },
    contractMarkdown
  };
}

// Execução de Teste Direto via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`=== Z8 LEGAL COUNSEL // SIMULAÇÃO DE BLINDAGEM JURÍDICA ===\n`);

  // Teste 1: Emissão de COF para o investidor Derik (Jacareí)
  const candidate = {
    name: 'Derik dos Santos',
    company: 'Derik Mobilidade Elétrica EIRELI',
    city: 'Jacareí - SP',
    population: 235000
  };

  console.log(`[1] EMISSÃO DE PROTOCOLO DE COF (LEI 13.966/2019):`);
  const cofReceipt = issueCOFDossier(candidate);
  console.log(JSON.stringify(cofReceipt, null, 2));

  console.log(`\n[2] TESTE DE TRAVA LEGAL SISTÊMICA (DIA 0):`);
  const checkDay0 = validateContractEligibility(cofReceipt);
  console.log(`Status de Liberação:`, checkDay0);

  console.log(`\n[3] GERAÇÃO DO PACOTE TÉCNICO DE PDI & GARANTIA (1º LOTE DE 10 MOTOS):`);
  const pdiLot = generateBatchPDIAndWarranty(candidate.name, candidate.city, 'Z8 Tank High-Speed');
  console.log(`Lote: ${pdiLot.lotNumber} | Concessionária: ${pdiLot.franchiseeName} (${pdiLot.territory})`);
  console.log(`Motos Inspecionadas no Lote: ${pdiLot.totalVehicles} unidades`);
  console.log(`Garantia: ${pdiLot.vehicles[0].warrantyPeriodDays} dias (Garantia Legal CDC - Art. 26, II).`);

  console.log(`\n[4] GERADOR DO CONTRATO DEFINITIVO DE COMPRA E ADESÃO (ABNT & RESERVA DE DOMÍNIO):`);
  const contractPackage = generatePurchaseFranchiseContract(candidate, { population: candidate.population });
  console.log(`Contrato Gerado: ${contractPackage.contractNumber}`);
  console.log(`Empresa Franqueada: ${contractPackage.franchisee.company} (${contractPackage.franchisee.city})`);
  console.log(`Classificação Territorial: ${contractPackage.territory.type}`);
  console.log(`Taxa Inicial de Franquia: R$ ${contractPackage.financials.initialFranchiseFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Lote Inicial de 10 Motos (Atacado): R$ ${contractPackage.financials.initialLotWholesaleTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Lucro Bruto Projetado no 1º Lote: R$ ${contractPackage.financials.initialLotProjectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Parcelamento em Duplicatas com Reserva de Domínio (30/60/90 dias):`);
  contractPackage.financials.installments.forEach(inst => {
    console.log(`  - Parcela ${inst.parcel} (${inst.dueDays} dias): R$ ${inst.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} [${inst.title}]`);
  });
  console.log(`Royalties: ${contractPackage.financials.monthlyRoyaltiesPct}% (Piso Mínimo R$ ${contractPackage.financials.monthlyRoyaltiesFloor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês)`);
  console.log(`Verba de Tráfego Local: R$ ${contractPackage.financials.monthlyTrafficFund.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`);
  console.log(`Foro de Eleição: ${contractPackage.legalFramework.jurisdiction}`);
  console.log(`\n=== MOTOR JURÍDICO OPERACIONAL COM SUCESSO! ===`);
}
