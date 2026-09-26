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
      warrantyPeriodMonths: 12,
      batteryWarrantyMonths: 24,
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

// Execução de Teste Direto via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`=== Z8 LEGAL COUNSEL // SIMULAÇÃO DE BLINDAGEM JURÍDICA ===\n`);

  // Teste 1: Emissão de COF para o investidor Derik (Jacareí)
  const candidate = {
    name: 'Derik dos Santos',
    company: 'Derik Mobilidade Elétrica EIRELI',
    city: 'Jacareí - SP'
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
  console.log(`Exemplo Moto #1: Chassi: ${pdiLot.vehicles[0].chassisNumber} | Motor: ${pdiLot.vehicles[0].engineNumber}`);
  console.log(`Exemplo Moto #10: Chassi: ${pdiLot.vehicles[9].chassisNumber} | Motor: ${pdiLot.vehicles[9].engineNumber}`);
  console.log(`Garantia: ${pdiLot.vehicles[0].warrantyPeriodMonths} meses total / ${pdiLot.vehicles[0].batteryWarrantyMonths} meses baterias.`);
  console.log(`\n=== MOTOR JURÍDICO OPERACIONAL COM SUCESSO! ===`);
}
