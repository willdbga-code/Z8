// ==========================================================================
// Z8 E-Motion - Intelligent City Exclusivity & Neighbor Clustering Engine
// Gerenciamento de Cidades Reservadas, Detecção de Duplicações e Recomendações
// ==========================================================================

import { getLocalLeads } from './firebase-config.js';

// Base de clusters e vizinhança geográfica de cidades brasileiras (50km de raio)
export const CITY_CLUSTERS = {
  // --- VALE DO PARAÍBA & LITORAL NORTE (SP) ---
  'pindamonhangaba': {
    name: 'Pindamonhangaba',
    uf: 'SP',
    neighbors: ['Taubaté', 'Tremembé', 'Moreira César', 'Roseira', 'Aparecida', 'Guaratinguetá', 'Caçapava', 'Campos do Jordão', 'São José dos Campos']
  },
  'taubate': {
    name: 'Taubaté',
    uf: 'SP',
    neighbors: ['Tremembé', 'Pindamonhangaba', 'Caçapava', 'São José dos Campos', 'Redenção da Serra', 'São Luís do Paraitinga']
  },
  'tremembe': {
    name: 'Tremembé',
    uf: 'SP',
    neighbors: ['Taubaté', 'Pindamonhangaba', 'Santo Antônio do Pinhal', 'Caçapava']
  },
  'sao jose dos campos': {
    name: 'São José dos Campos',
    uf: 'SP',
    neighbors: ['Jacareí', 'Caçapava', 'Taubaté', 'Santa Branca', 'Monteiro Lobato', 'Igaratá', 'Paraibuna']
  },
  'cacapava': {
    name: 'Caçapava',
    uf: 'SP',
    neighbors: ['São José dos Campos', 'Taubaté', 'Tremembé', 'Pindamonhangaba', 'Jambeiro']
  },
  'guaratingueta': {
    name: 'Guaratinguetá',
    uf: 'SP',
    neighbors: ['Aparecida', 'Potim', 'Lorena', 'Canas', 'Cachoeira Paulista', 'Pindamonhangaba']
  },
  'aparecida': {
    name: 'Aparecida',
    uf: 'SP',
    neighbors: ['Guaratinguetá', 'Potim', 'Roseira', 'Pindamonhangaba', 'Lorena']
  },
  'jacarei': {
    name: 'Jacareí',
    uf: 'SP',
    neighbors: ['São José dos Campos', 'Santa Branca', 'Guararema', 'Igaratá', 'Santa Isabel']
  },
  'caraguatatuba': {
    name: 'Caraguatatuba',
    uf: 'SP',
    neighbors: ['São Sebastião', 'Ubatuba', 'Ilhabela', 'Natividade da Serra']
  },
  'ubatuba': {
    name: 'Ubatuba',
    uf: 'SP',
    neighbors: ['Caraguatatuba', 'Paraty', 'São Luís do Paraitinga']
  },

  // --- REGIÃO DE CAMPINAS & CIRCUITO DAS ÁGUAS (SP) ---
  'campinas': {
    name: 'Campinas',
    uf: 'SP',
    neighbors: ['Valinhos', 'Vinhedo', 'Paulínia', 'Sumaré', 'Hortolândia', 'Indaiatuba', 'Jaguariúna', 'Americana', 'Cosmópolis', 'Monte Mor']
  },
  'valinhos': {
    name: 'Valinhos',
    uf: 'SP',
    neighbors: ['Vinhedo', 'Campinas', 'Itatiba', 'Louveira']
  },
  'vinhedo': {
    name: 'Vinhedo',
    uf: 'SP',
    neighbors: ['Valinhos', 'Louveira', 'Jundiaí', 'Itatiba', 'Campinas']
  },
  'indaiatuba': {
    name: 'Indaiatuba',
    uf: 'SP',
    neighbors: ['Salto', 'Itu', 'Campinas', 'Monte Mor', 'Elias Fausto']
  },
  'americana': {
    name: 'Americana',
    uf: 'SP',
    neighbors: ['Santa Bárbara d\'Oeste', 'Nova Odessa', 'Sumaré', 'Limeira', 'Paulínia']
  },
  'piracicaba': {
    name: 'Piracicaba',
    uf: 'SP',
    neighbors: ['Rio das Pedras', 'Saltinho', 'Santa Bárbara d\'Oeste', 'Limeira', 'Capivari', 'Charqueada']
  },
  'jundiai': {
    name: 'Jundiaí',
    uf: 'SP',
    neighbors: ['Várzea Paulista', 'Campo Limpo Paulista', 'Itupeva', 'Louveira', 'Cabreúva', 'Jarinu']
  },

  // --- REGIÃO METROPOLITANA DE SÃO PAULO & ABC ---
  'sao paulo': {
    name: 'São Paulo',
    uf: 'SP',
    neighbors: ['Guarulhos', 'Osasco', 'Santo André', 'São Bernardo do Campo', 'São Caetano do Sul', 'Diadema', 'Mauá', 'Barueri', 'Cotia', 'Taboão da Serra']
  },
  'santo andre': {
    name: 'Santo André',
    uf: 'SP',
    neighbors: ['São Bernardo do Campo', 'São Caetano do Sul', 'Mauá', 'Diadema', 'Ribeirão Pires']
  },
  'sao bernardo do campo': {
    name: 'São Bernardo do Campo',
    uf: 'SP',
    neighbors: ['Santo André', 'Diadema', 'São Caetano do Sul', 'São Paulo']
  },
  'osasco': {
    name: 'Osasco',
    uf: 'SP',
    neighbors: ['Barueri', 'Carapicuíba', 'Cotia', 'Santana de Parnaíba', 'Jandira', 'São Paulo']
  },
  'barueri': {
    name: 'Barueri',
    uf: 'SP',
    neighbors: ['Santana de Parnaíba', 'Osasco', 'Carapicuíba', 'Jandira', 'Itapevi', 'Cotia']
  },
  'guarulhos': {
    name: 'Guarulhos',
    uf: 'SP',
    neighbors: ['Arujá', 'Mairiporã', 'Itaquaquecetuba', 'São Paulo', 'Santa Isabel']
  },

  // --- BAIXADA SANTISTA (SP) ---
  'santos': {
    name: 'Santos',
    uf: 'SP',
    neighbors: ['São Vicente', 'Praia Grande', 'Guarujá', 'Cubatão', 'Bertioga', 'Mongaguá', 'Itanhaém']
  },
  'praia grande': {
    name: 'Praia Grande',
    uf: 'SP',
    neighbors: ['São Vicente', 'Santos', 'Mongaguá', 'Itanhaém', 'Cubatão']
  },

  // --- RIBEIRÃO PRETO & FRANCA (SP) ---
  'ribeirao preto': {
    name: 'Ribeirão Preto',
    uf: 'SP',
    neighbors: ['Sertãozinho', 'Cravinhos', 'Jardinópolis', 'Serrana', 'Dumont', 'Brodowski', 'Pontal', 'Batatais']
  },
  'franca': {
    name: 'Franca',
    uf: 'SP',
    neighbors: ['Cristais Paulista', 'Patrocínio Paulista', 'Restinga', 'Batatais', 'Pedregulho']
  },
  'sao jose do rio preto': {
    name: 'São José do Rio Preto',
    uf: 'SP',
    neighbors: ['Mirassol', 'Bady Bassitt', 'Cedral', 'Guapiaçu', 'Tanabi', 'Olímpia', 'Catanduva']
  },
  'sorocaba': {
    name: 'Sorocaba',
    uf: 'SP',
    neighbors: ['Votorantim', 'Itu', 'Salto', 'Porto Feliz', 'Araçoiaba da Serra', 'Mairinque', 'São Roque']
  },

  // --- MINAS GERAIS ---
  'belo horizonte': {
    name: 'Belo Horizonte',
    uf: 'MG',
    neighbors: ['Contagem', 'Betim', 'Nova Lima', 'Santa Luzia', 'Sabará', 'Ibirité', 'Vespasiano']
  },
  'uberlandia': {
    name: 'Uberlândia',
    uf: 'MG',
    neighbors: ['Araguari', 'Uberaba', 'Monte Alegre de Minas', 'Tupaciguara']
  },
  'pouso alegre': {
    name: 'Pouso Alegre',
    uf: 'MG',
    neighbors: ['Santa Rita do Sapucaí', 'Itajubá', 'Cambuí', 'Congonhal', 'Borda da Mata']
  },

  // --- PARANÁ & SUL ---
  'curitiba': {
    name: 'Curitiba',
    uf: 'PR',
    neighbors: ['São José dos Pinhais', 'Colombo', 'Pinhais', 'Araucária', 'Fazenda Rio Grande', 'Campo Largo']
  },
  'londrina': {
    name: 'Londrina',
    uf: 'PR',
    neighbors: ['Cambé', 'Ibiporã', 'Rolândia', 'Arapongas', 'Apucarana']
  },
  'maringa': {
    name: 'Maringá',
    uf: 'PR',
    neighbors: ['Sarandi', 'Paiçandu', 'Marialva', 'Mandaguari']
  },
  'joinville': {
    name: 'Joinville',
    uf: 'SC',
    neighbors: ['Jaraguá do Sul', 'Guaramirim', 'Araquari', 'São Francisco do Sul']
  },
  'florianopolis': {
    name: 'Florianópolis',
    uf: 'SC',
    neighbors: ['São José', 'Palhoça', 'Biguaçu', 'Santo Amaro da Imperatriz']
  },
  'porto alegre': {
    name: 'Porto Alegre',
    uf: 'RS',
    neighbors: ['Canoas', 'Gravataí', 'Viamão', 'Alvorada', 'Cachoeirinha', 'Novo Hamburgo']
  },

  // --- CENTRO-OESTE & NORDESTE ---
  'goiania': {
    name: 'Goiânia',
    uf: 'GO',
    neighbors: ['Aparecida de Goiânia', 'Senador Canedo', 'Trindade', 'Goianira', 'Anápolis']
  },
  'brasilia': {
    name: 'Brasília',
    uf: 'DF',
    neighbors: ['Taguatinga', 'Ceilândia', 'Águas Claras', 'Samambaia', 'Gama', 'Valparaíso de Goiás']
  },
  'salvador': {
    name: 'Salvador',
    uf: 'BA',
    neighbors: ['Lauro de Freitas', 'Camaçari', 'Simões Filho', 'Candeias', 'Dias d\'Ávila']
  }
};

/**
 * Normaliza strings de nomes de cidades (remove acentos, espaços extras, etc.)
 */
export function normalizeCityName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*-\s*[a-z]{2}$/i, '') // Remove terminação "- SP", "- RJ" etc
    .replace(/[^a-z0-9\s]/gi, '')
    .trim();
}

/**
 * Retorna todas as cidades que já estão ocupadas/registradas nos leads do banco de dados
 */
export function getReservedCitiesList() {
  const leads = getLocalLeads();
  const reservedMap = new Map();

  leads.forEach(lead => {
    if (lead.city) {
      const norm = normalizeCityName(lead.city);
      if (norm) {
        reservedMap.set(norm, {
          rawCity: lead.city,
          company: lead.company || 'Revendedor Autorizado',
          state: lead.state || 'SP',
          registeredAt: lead.createdAt
        });
      }
    }
  });

  return reservedMap;
}

/**
 * Verifica se a cidade digitada pelo usuário já possui exclusividade/reserva
 */
export function checkCityAvailability(cityName) {
  const normalized = normalizeCityName(cityName);
  if (!normalized || normalized.length < 3) {
    return { status: 'typing', message: '' };
  }

  const reservedMap = getReservedCitiesList();

  // Verifica se a cidade exata está reservada
  if (reservedMap.has(normalized)) {
    const info = reservedMap.get(normalized);
    const neighbors = getAvailableNeighbors(normalized, reservedMap);

    return {
      status: 'occupied',
      city: info.rawCity,
      company: info.company,
      message: `🔴 A região de ${info.rawCity} já possui revendedor exclusivo cadastrado.`,
      neighbors: neighbors
    };
  }

  // Se não estiver ocupada, verifica se há cidades vizinhas cadastradas
  const clusterData = CITY_CLUSTERS[normalized];
  const formattedName = clusterData ? clusterData.name : cityName.trim();

  return {
    status: 'available',
    city: formattedName,
    message: `🟢 ${formattedName} está DISPONÍVEL para exclusividade territorial (raio de 50km)!`
  };
}

/**
 * Retorna as cidades vizinhas disponíveis caso a cidade esteja ocupada
 */
function getAvailableNeighbors(normalizedCity, reservedMap) {
  const cluster = CITY_CLUSTERS[normalizedCity];
  if (!cluster || !cluster.neighbors) {
    // Fallback inteligente para cidades menores ou não catalogadas
    return ['Região Metropolitana', 'Polo Industrial Regional', 'Cidades Vizinhas do Raio de 50km'];
  }

  // Filtra apenas as vizinhas que NÃO estão no reservedMap
  const available = cluster.neighbors.filter(neighborName => {
    const normNeighbor = normalizeCityName(neighborName);
    return !reservedMap.has(normNeighbor);
  });

  return available.length > 0 ? available : cluster.neighbors.slice(0, 4);
}
