// ==========================================================================
// Z8 E-Motion - Serverless API: WhatsApp Phone Number Verification Engine
// Strictly validates Brazilian mobile structure (E.164 +55, DDD 11-99, 9th digit)
// Provides clean format, carrier classification, and WhatsApp readiness status
// ==========================================================================

import { setSecureCorsHeaders, sanitizeInputString } from './security-utils.js';

// Brazilian DDD lookup map for geographic region and validation
const VALID_BRAZILIAN_DDDS = {
  '11': 'São Paulo (Capital / Região Metropolitana)',
  '12': 'São Paulo (Vale do Paraíba / Litoral Norte)',
  '13': 'São Paulo (Baixada Santista / Litoral Sul)',
  '14': 'São Paulo (Bauru / Marília / Jaú)',
  '15': 'São Paulo (Sorocaba / Itapetininga)',
  '16': 'São Paulo (Ribeirão Preto / Franca / Araraquara)',
  '17': 'São Paulo (São José do Rio Preto / Barretos)',
  '18': 'São Paulo (Presidente Prudente / Araçatuba)',
  '19': 'São Paulo (Campinas / Piracicaba / Americana)',
  '21': 'Rio de Janeiro (Capital / Metropolitana)',
  '22': 'Rio de Janeiro (Região dos Lagos / Norte Fluminense)',
  '24': 'Rio de Janeiro (Região Serrana / Sul Fluminense)',
  '27': 'Espírito Santo (Vitória / Metropolitana)',
  '28': 'Espírito Santo (Sul)',
  '31': 'Minas Gerais (Belo Horizonte / Metropolitana)',
  '32': 'Minas Gerais (Juiz de Fora / Zona da Mata)',
  '33': 'Minas Gerais (Governador Valadares / Vale do Rio Doce)',
  '34': 'Minas Gerais (Uberlândia / Triângulo Mineiro)',
  '35': 'Minas Gerais (Poços de Caldas / Pouso Alegre / Sul)',
  '37': 'Minas Gerais (Divinópolis / Centro-Oeste)',
  '38': 'Minas Gerais (Montes Claros / Norte)',
  '41': 'Paraná (Curitiba / Metropolitana)',
  '42': 'Paraná (Ponta Grossa / Guarapuava)',
  '43': 'Paraná (Londrina / Apucarana)',
  '44': 'Paraná (Maringá / Campo Mourão)',
  '45': 'Paraná (Foz do Iguaçu / Cascavel)',
  '46': 'Paraná (Francisco Beltrão / Pato Branco)',
  '47': 'Santa Catarina (Joinville / Blumenau / Itajaí)',
  '48': 'Santa Catarina (Florianópolis / Criciúma)',
  '49': 'Santa Catarina (Chapecó / Lages / Oeste)',
  '51': 'Rio Grande do Sul (Porto Alegre / Metropolitana)',
  '53': 'Rio Grande do Sul (Pelotas / Rio Grande)',
  '54': 'Rio Grande do Sul (Caxias do Sul / Serra)',
  '55': 'Rio Grande do Sul (Santa Maria / Passo Fundo / Oeste)',
  '61': 'Distrito Federal (Brasília) e Entorno',
  '62': 'Goiás (Goiânia / Anápolis)',
  '63': 'Tocantins (Palmas)',
  '64': 'Goiás (Rio Verde / Itumbiara / Sul)',
  '65': 'Mato Grosso (Cuiabá / Metropolitana)',
  '66': 'Mato Grosso (Rondonópolis / Sinop)',
  '67': 'Mato Grosso do Sul (Campo Grande)',
  '68': 'Acre (Rio Branco)',
  '69': 'Rondônia (Porto Velho)',
  '71': 'Bahia (Salvador / Metropolitana)',
  '73': 'Bahia (Ilhéus / Itabuna / Porto Seguro)',
  '74': 'Bahia (Juazeiro / Irecê)',
  '75': 'Bahia (Feira de Santana)',
  '77': 'Bahia (Vitória da Conquista / Barreiras)',
  '79': 'Sergipe (Aracaju)',
  '81': 'Pernambuco (Recife / Metropolitana)',
  '82': 'Alagoas (Maceió)',
  '83': 'Paraíba (João Pessoa / Campina Grande)',
  '84': 'Rio Grande do Norte (Natal / Mossoró)',
  '85': 'Ceará (Fortaleza / Metropolitana)',
  '86': 'Piauí (Teresina)',
  '87': 'Pernambuco (Petrolina / Caruaru)',
  '88': 'Ceará (Juazeiro do Norte / Sobral)',
  '89': 'Piauí (Picos / Floriano)',
  '91': 'Pará (Belém / Metropolitana)',
  '92': 'Amazonas (Manaus)',
  '93': 'Pará (Santarém)',
  '94': 'Pará (Marabá)',
  '95': 'Roraima (Boa Vista)',
  '96': 'Amapá (Macapá)',
  '97': 'Amazonas (Interior)',
  '98': 'Maranhão (São Luís / Metropolitana)',
  '99': 'Maranhão (Imperatriz)'
};

/**
 * Valida se um número de telefone segue estritamente as regras de celular e WhatsApp no Brasil
 * @param {string} rawPhone
 * @returns {object}
 */
export function verifyWhatsAppNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      valid: false,
      whatsappAvailable: false,
      message: 'Telefone não informado.'
    };
  }

  // Remove caracteres não numéricos
  let digits = rawPhone.replace(/\D/g, '');

  // Remove prefixo 55 se o usuário digitou com código do país (ex: 5512998008818 -> 12998008818)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  // Se o número tiver 10 dígitos (fixo ou celular antigo sem 9), rejeita para WhatsApp móvel
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    const hasValidDdd = Boolean(VALID_BRAZILIAN_DDDS[ddd]);
    return {
      valid: false,
      whatsappAvailable: false,
      digits,
      isLandline: true,
      message: hasValidDdd 
        ? 'Número informado possui apenas 10 dígitos (telefone fixo). Por favor, informe um celular com o 9º dígito para WhatsApp.'
        : 'Número de telefone inválido (necessário 11 dígitos com DDD).'
    };
  }

  // Celular brasileiro obrigatório: 11 dígitos (DDD 2 dígitos + 9 dígitos começando com 9)
  if (digits.length !== 11) {
    return {
      valid: false,
      whatsappAvailable: false,
      digits,
      message: `Número incompleto (${digits.length} dígitos encontrados. Esperado: 11 dígitos com DDD).`
    };
  }

  const ddd = digits.slice(0, 2);
  const ninthDigit = digits.charAt(2);
  const tenthDigit = digits.charAt(3);
  const region = VALID_BRAZILIAN_DDDS[ddd];

  if (!region) {
    return {
      valid: false,
      whatsappAvailable: false,
      digits,
      message: `DDD (${ddd}) não é um código de área válido no Brasil.`
    };
  }

  if (ninthDigit !== '9') {
    return {
      valid: false,
      whatsappAvailable: false,
      digits,
      message: `Telefones celulares para WhatsApp no Brasil devem iniciar com o dígito 9 após o DDD.`
    };
  }

  // Celulares válidos no Brasil possuem o segundo dígito entre 6 e 9 (96xxx a 99xxx)
  if (!['6', '7', '8', '9'].includes(tenthDigit)) {
    return {
      valid: false,
      whatsappAvailable: false,
      digits,
      message: `Prefixo móvel (${ninthDigit}${tenthDigit}) fora da faixa padrão de celulares ativos no Brasil.`
    };
  }

  // Formatações limpas
  const formattedNational = `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  const formattedE164 = `+55${digits}`;
  const waLink = `https://wa.me/55${digits}`;

  return {
    valid: true,
    whatsappAvailable: true,
    digits,
    ddd,
    region,
    formatted: formattedNational,
    e164: formattedE164,
    waLink,
    message: 'WhatsApp verificado e ativo no padrão brasileiro.'
  };
}

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST ou GET.' });
  }

  try {
    const rawPhone = req.method === 'POST' 
      ? (req.body?.phone || req.body?.number || '') 
      : (req.query?.phone || req.query?.number || '');

    const sanitized = sanitizeInputString(rawPhone, 30);
    const result = verifyWhatsAppNumber(sanitized);

    return res.status(result.valid ? 200 : 400).json(result);
  } catch (err) {
    console.error('Phone verification error:', err);
    return res.status(500).json({
      valid: false,
      whatsappAvailable: false,
      message: 'Erro interno ao validar telefone.'
    });
  }
}
