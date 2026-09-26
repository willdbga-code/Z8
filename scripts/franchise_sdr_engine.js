import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_REGISTERED_USERS, DEFAULT_MASTER_ADMIN } from '../site-principal/data/cloud-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Critérios de Scoring Oficiais Z8 (2026)
// 1. Capital Estimado para Taxa (R$ 35k) + 1º Lote de 10 Motos (R$ 55k-75k) = Total >= R$ 90k-100k
// 2. Comarca Prioritária no Vale do Paraíba / Polo SP
// 3. Estrutura Comercial (50m² - 55m², 2 Elevadores)
function evaluateInvestorScore(lead) {
  let score = 50;
  let rationale = [];

  const cityLower = (lead.city || '').toLowerCase();
  const priorityCities = ['jacareí', 'jacarei', 'taubaté', 'taubate', 'guaratinguetá', 'guara', 'pindamonhangaba', 'pinda', 'são josé dos campos', 'sjc', 'caraguatatuba', 'litoral'];
  
  const isPriorityCity = priorityCities.some(c => cityLower.includes(c));
  if (isPriorityCity) {
    score += 25;
    rationale.push('Comarca prioritária no Cluster Vale do Paraíba (+25 pts)');
  } else {
    score += 10;
    rationale.push('Região de expansão estadual / nacional (+10 pts)');
  }

  if (lead.company && lead.company.trim().length > 2 && lead.company.toLowerCase() !== 'empresa') {
    score += 15;
    rationale.push('Possui razão social / CNPJ ativo registrado (+15 pts)');
  }

  if (lead.status === 'approved') {
    score += 10;
    rationale.push('Credenciamento pré-aprovado no portal (+10 pts)');
  } else if (lead.status === 'pending') {
    score += 5;
    rationale.push('Cadastro recente aguardando validação de comarca (+5 pts)');
  }

  let tier = 'CURIOSO / VAREJO';
  if (score >= 85) tier = 'INVESTIDOR VIP // ALTA PRIORIDADE';
  else if (score >= 65) tier = 'QUALIFICADO // EM MATURAÇÃO';

  return { score, tier, rationale };
}

// Gerador de Script WhatsApp PNL Personalizado
function generateWhatsAppScript(lead, evalData) {
  const firstName = (lead.name || 'Investidor').split(' ')[0];
  const city = lead.city || 'sua região';
  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const message = `Olá, ${firstName}! Aqui é o Christian Hideyuki, diretor de expansão da Z8 E-Motion.

Recebi o seu cadastro de credenciamento comercial para a praça de *${city}*.

Estamos estruturando as concessões do Vale do Paraíba e a nossa política é de *Monopólio Territorial*: abriremos apenas *1 concessionária oficial* por comarca, operando com o lote mínimo inicial de 10 motos elétricas e oficina padronizada com 2 elevadores.

Gostaria de entender se o seu plano é assumir a concessão exclusiva de ${city} neste trimestre.

Podemos conversar 10 minutos hoje para eu te apresentar as margens e a Circular de Oferta (COF)?`;

  const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return { message, waLink };
}

export function runFranchiseIntelligence() {
  console.log(`=== Z8 FRANCHISE SDR // MOTOR DE INTELIGÊNCIA COMERCIAL ===\n`);
  
  // Filtra administradores internos para focar em investidores / parceiros
  const externalLeads = SEED_REGISTERED_USERS.filter(u => u.email !== DEFAULT_MASTER_ADMIN.email && u.email !== 'christian.hide@hotmail.com');

  const dossierList = externalLeads.map(lead => {
    const evalData = evaluateInvestorScore(lead);
    const scriptData = generateWhatsAppScript(lead, evalData);

    return {
      lead,
      evaluation: evalData,
      script: scriptData
    };
  });

  // Ordena por maior score
  dossierList.sort((a, b) => b.evaluation.score - a.evaluation.score);

  return dossierList;
}

// Execução direta via Node
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = runFranchiseIntelligence();
  
  console.log(`Total de Investidores Processados: ${results.length}\n`);

  results.forEach((item, idx) => {
    console.log(`----------------------------------------------------------------`);
    console.log(`[#${idx + 1}] INVESTIDOR: ${item.lead.name.toUpperCase()}`);
    console.log(`Cidade / Praça: ${item.lead.city} | Telefone: ${item.lead.phone}`);
    console.log(`Classificação: ${item.evaluation.tier} (Score: ${item.evaluation.score}/100)`);
    console.log(`Justificativa: ${item.evaluation.rationale.join(' | ')}`);
    console.log(`\n--- SCRIPT WHATSAPP SUGERIDO (DISPARO INTERNO) ---`);
    console.log(item.script.message);
    console.log(`\nLink Direto Gerado: ${item.script.waLink}`);
    console.log(`----------------------------------------------------------------\n`);
  });
}
