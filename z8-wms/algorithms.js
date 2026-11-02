/**
 * Z8 E-MOTION // WMS MATHEMATICAL & INVENTORY ALGORITHMS
 * Industrial supply chain algorithms:
 * 1. EOQ (Economic Order Quantity / 经济订购批量)
 * 2. Safety Stock (Estoque de Segurança / 安全库存)
 * 3. DMR (Dias Médios de Retenção / Pátio Aging / 库龄分析)
 * 4. Inventory Turnover Rate (Giro de Estoque / 库存周转率)
 * 5. ABC Inventory Classification (Curva ABC / ABC分类法)
 */

export const WmsAlgorithms = {
  /**
   * 1. ECONOMIC ORDER QUANTITY (EOQ)
   * Formula: EOQ = sqrt((2 * D * S) / H)
   * @param {number} annualDemand (D) - Demanda anual estimada (ex: 120 motos ou 200 pneus)
   * @param {number} orderCost (S) - Custo fixo por pedido de importação / container
   * @param {number} holdingCost (H) - Custo anual unitário de armazenagem
   * @returns {number} Optimal batch size
   */
  calculateEOQ(annualDemand, orderCost = 1500, holdingCost = 180) {
    if (!annualDemand || annualDemand <= 0) return 10;
    const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
    return Math.round(eoq);
  },

  /**
   * 2. SAFETY STOCK (Estoque de Segurança)
   * Formula: SS = Z * sigma_L * sqrt(LeadTime)
   * Lead Time médio da China (FOB Santos/Paranaguá) = 45 dias
   * @param {number} dailyStdDev - Desvio padrão da demanda diária
   * @param {number} leadTimeDays - Lead time médio em dias (padrão 45 dias China-Brasil)
   * @param {number} serviceLevelZ - Fator Z para 95% nível de serviço (1.65)
   * @returns {number} Safety stock quantity
   */
  calculateSafetyStock(dailyStdDev = 1.2, leadTimeDays = 45, serviceLevelZ = 1.65) {
    const ss = serviceLevelZ * dailyStdDev * Math.sqrt(leadTimeDays);
    return Math.ceil(ss);
  },

  /**
   * 3. PATIO AGING & DMR (Dias Médios de Retenção)
   * Calculates the aging semaphore for each motorcycle unit
   * @param {string|Date} entryDateStr - ISO date string of entry
   * @returns {Object} { daysInPatio, level: 'green'|'amber'|'red', labelPt, labelCn }
   */
  calculatePatioAging(entryDateStr) {
    if (!entryDateStr) {
      return { daysInPatio: 0, level: 'green', labelPt: 'Recém Chegado (0d)', labelCn: '新到库 (0天)' };
    }
    const entryDate = new Date(entryDateStr);
    const now = new Date();
    const diffMs = now - entryDate;
    const daysInPatio = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (daysInPatio <= 30) {
      return {
        daysInPatio,
        level: 'green',
        labelPt: `Giro Rápido (${daysInPatio}d)`,
        labelCn: `快速周转 (${daysInPatio}天)`
      };
    } else if (daysInPatio <= 60) {
      return {
        daysInPatio,
        level: 'amber',
        labelPt: `Atenção Pátio (${daysInPatio}d)`,
        labelCn: `库龄预警 (${daysInPatio}天)`
      };
    } else {
      return {
        daysInPatio,
        level: 'red',
        labelPt: `Retenção Crítica (${daysInPatio}d)`,
        labelCn: `超期滞销 (${daysInPatio}天)`
      };
    }
  },

  /**
   * 4. INVENTORY TURNOVER RATE (Giro de Estoque)
   * Turnover = Outbound Units in Period / Average Inventory in Period
   * @param {number} totalOutflowPeriod - Total de saídas no período
   * @param {number} currentInventory - Estoque atual
   * @returns {number} Ratio formatted to 1 decimal place
   */
  calculateTurnoverRate(totalOutflowPeriod, currentInventory) {
    if (!currentInventory || currentInventory <= 0) return totalOutflowPeriod > 0 ? 10.0 : 0.0;
    const avgInv = Math.max(1, currentInventory);
    const rate = (totalOutflowPeriod / avgInv) * 12; // Anualizado
    return Number(rate.toFixed(1));
  },

  /**
   * 5. CURVA ABC (ABC Inventory Classification)
   * Classifies stock into:
   * Class A: 70-80% do valor econômico (geralmente Tank, FX-10, Harley)
   * Class B: 15-20% do valor econômico (N95C, H26, U2)
   * Class C: 5-10% do valor econômico (E-Bikes, peças avulsas)
   * @param {Array} items - List of inventory items with quantity and wholesalePrice
   */
  calculateAbcClassification(items) {
    if (!items || items.length === 0) return [];

    const enriched = items.map(item => {
      const val = (item.quantity || 1) * (item.wholesalePrice || item.unitCost || 0);
      return { ...item, totalValue: val };
    });

    enriched.sort((a, b) => b.totalValue - a.totalValue);
    const grandTotal = enriched.reduce((acc, curr) => acc + curr.totalValue, 0) || 1;

    let cumulative = 0;
    return enriched.map(item => {
      cumulative += item.totalValue;
      const percentage = (cumulative / grandTotal) * 100;
      let abcClass = 'C';
      if (percentage <= 75) abcClass = 'A';
      else if (percentage <= 92) abcClass = 'B';
      return {
        ...item,
        abcClass,
        cumPct: Number(percentage.toFixed(1))
      };
    });
  }
};
