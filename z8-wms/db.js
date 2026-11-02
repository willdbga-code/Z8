/**
 * Z8 E-MOTION // WMS DATABASE ENGINE
 * High-performance local IndexedDB storage (via Dexie.js)
 * Synchronized with server.cjs /api/sync file storage
 */

import { officialCatalogModels, defaultSpareParts } from './models-data.js';

class Z8WmsDatabase {
  constructor() {
    this.dexie = new window.Dexie('Z8_WMS_DATABASE');

    // Define database schemas
    this.dexie.version(1).stores({
      vehicles: 'chassisVin, modelId, factoryCode, status, color, entryDate, exitDate, agingLevel',
      models: 'id, code, name, category, wholesalePrice',
      parts: 'partNumber, category, currentStock, minStock',
      repairs: 'osNumber, chassisVin, modelId, status, openedAt',
      movements: 'id, type, date, chassisVin, modelId, refDoc'
    });

    this.isInitialized = false;
  }

  /**
   * Initialize and seed database if empty
   */
  async init() {
    if (this.isInitialized) return;

    try {
      await this.dexie.open();

      // Check if models exist
      const modelsCount = await this.dexie.models.count();
      if (modelsCount === 0) {
        console.log('[Z8-WMS-DB] Seeding official catalog models...');
        await this.dexie.models.bulkAdd(officialCatalogModels);
      }

      // Check if spare parts exist
      const partsCount = await this.dexie.parts.count();
      if (partsCount === 0) {
        console.log('[Z8-WMS-DB] Seeding official spare parts & tires...');
        await this.dexie.parts.bulkAdd(defaultSpareParts);
      }

      // Check if vehicles exist, if not seed initial stock
      const vehiclesCount = await this.dexie.vehicles.count();
      if (vehiclesCount === 0) {
        console.log('[Z8-WMS-DB] Seeding sample inventory units...');
        await this.seedInitialInventory();
      }

      this.isInitialized = true;
      this.triggerServerSync();
    } catch (err) {
      console.error('[Z8-WMS-DB] Database initialization error:', err);
    }
  }

  /**
   * Seed realistic initial inventory across official models
   */
  async seedInitialInventory() {
    const sampleVehicles = [
      // Z8 Tank
      {
        chassisVin: 'Z8-DB018-2026-0001',
        modelId: 'z8-tank',
        modelName: 'Z8 Tank High-Speed',
        factoryCode: 'DB018',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'alta-velocidade',
        color: 'Desert Sand Fosco',
        colorHex: '#D2B48C',
        tireFront: '110/70-12',
        tireRear: '110/70-12',
        tireType: 'Pneu Neve / Hot Melt Texturizado Vácuo Aro 12',
        motor: '2000W High Torque (15G)',
        battery: 'Lítio 60V 20Ah / Suporta 72V 125Ah',
        wholesalePrice: 7500,
        retailPrice: 11500,
        status: 'in_stock',
        entryDate: '2026-10-15T09:00:00.000Z',
        containerLot: 'CN-40HQ-Z8-0104',
        clientOrFranchise: null,
        notes: 'Container 40HQ liberado em Santos. PDI inicial OK.',
        photos: ['/assets/models/z8_tank_studio.jpg'],
        repairsHistory: []
      },
      {
        chassisVin: 'Z8-DB018-2026-0002',
        modelId: 'z8-tank',
        modelName: 'Z8 Tank High-Speed',
        factoryCode: 'DB018',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'alta-velocidade',
        color: 'Preto Fosco Offroad',
        colorHex: '#1C1D21',
        tireFront: '110/70-12',
        tireRear: '110/70-12',
        tireType: 'Pneu Neve / Hot Melt Texturizado Vácuo Aro 12',
        motor: '2000W High Torque (15G)',
        battery: 'Lítio 60V 20Ah / Suporta 72V 125Ah',
        wholesalePrice: 7500,
        retailPrice: 11500,
        status: 'pdi_inspection',
        entryDate: '2026-10-20T11:30:00.000Z',
        containerLot: 'CN-40HQ-Z8-0104',
        clientOrFranchise: null,
        notes: 'Verificação de torque de eixo dianteiro e calibragem 28 PSI.',
        photos: ['/assets/models/z8_tank_black.jpg'],
        repairsHistory: []
      },
      // Z8 Tank 2 GPS
      {
        chassisVin: 'Z8-DB018-GPS-0010',
        modelId: 'z8-tank-2-gps',
        modelName: 'Z8 Tank 2 GPS Smart',
        factoryCode: 'DB018-GPS',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'alta-velocidade',
        color: 'Verde Militar Tático',
        colorHex: '#4B5320',
        tireFront: '110/70-12',
        tireRear: '110/70-12',
        tireType: 'Pneu Neve / Hot Melt Texturizado Vácuo Aro 12',
        motor: '2000W High Torque (15G Smart)',
        battery: 'Lítio 60V 20Ah / Suporta 72V 125Ah',
        wholesalePrice: 8500,
        retailPrice: 12500,
        status: 'ready_to_ship',
        entryDate: '2026-10-22T14:00:00.000Z',
        containerLot: 'CN-40HQ-Z8-0104',
        clientOrFranchise: 'Z8 Vale do Paraíba (SJC)',
        notes: 'Reservada para showroom franqueado. Módulo GPS 4G calibrado.',
        photos: ['/assets/models/z8_tank_hero_paulista.png'],
        repairsHistory: []
      },
      // Z8 FX-10 Sport
      {
        chassisVin: 'Z8-DB043-2026-0045',
        modelId: 'z8-fx10',
        modelName: 'Z8 FX-10 Sport',
        factoryCode: 'DB043',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'alta-velocidade',
        color: 'Azul Elétrico Ciano',
        colorHex: '#00F0FF',
        tireFront: '130/60-10',
        tireRear: '130/60-10',
        tireType: 'Pneu Largo 130/60-10 de Vácuo Esportivo',
        motor: '1500W Brushless (12G-38A)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 6200,
        retailPrice: 9000,
        status: 'in_stock',
        entryDate: '2026-10-01T08:00:00.000Z',
        containerLot: 'CN-40HQ-FOSHAN-088',
        clientOrFranchise: null,
        notes: 'Giro rápido. Em perfeito estado de conservação.',
        photos: ['/assets/models/z8_fx10_studio.jpg'],
        repairsHistory: []
      },
      {
        chassisVin: 'Z8-DB043-2026-0046',
        modelId: 'z8-fx10',
        modelName: 'Z8 FX-10 Sport',
        factoryCode: 'DB043',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'alta-velocidade',
        color: 'Vermelho Racing',
        colorHex: '#D32F2F',
        tireFront: '130/60-10',
        tireRear: '130/60-10',
        tireType: 'Pneu Largo 130/60-10 de Vácuo Esportivo',
        motor: '1500W Brushless (12G-38A)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 6200,
        retailPrice: 9000,
        status: 'in_service',
        entryDate: '2026-09-18T10:00:00.000Z',
        containerLot: 'CN-40HQ-FOSHAN-088',
        clientOrFranchise: null,
        notes: 'Ajuste do sensor hall no punho do acelerador.',
        photos: ['/assets/models/z8_fx10_sjc_wide.jpg'],
        repairsHistory: ['OS-2026-0012']
      },
      // Z8 Harley X12
      {
        chassisVin: 'Z8-XB024-2026-0101',
        modelId: 'z8-harley-x12',
        modelName: 'Z8 Harley X12 Custom',
        factoryCode: 'XB-024',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'custom',
        color: 'Preto Fosco Midnight',
        colorHex: '#121316',
        tireFront: '130/70-10',
        tireRear: '130/70-10',
        tireType: 'Pneus Alargados Custom Chopper 130/70-10',
        motor: '1200W 27H (30A)',
        battery: 'Lítio 60V 20Ah Removível',
        wholesalePrice: 6500,
        retailPrice: 10000,
        status: 'in_stock',
        entryDate: '2026-10-10T16:00:00.000Z',
        containerLot: 'CN-40HQ-HARLEY-003',
        clientOrFranchise: null,
        notes: 'Guidão alto americano alinhado. Som Bluetooth testado OK.',
        photos: ['/assets/models/z8_harley_studio.jpg'],
        repairsHistory: []
      },
      // Z8 U2 Delivery Cargo
      {
        chassisVin: 'Z8-XB010-2026-0205',
        modelId: 'z8-u2-delivery',
        modelName: 'Z8 U2 Delivery Cargo',
        factoryCode: 'XB-010',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'utilitaria',
        color: 'Creme Marfim / Laranja',
        colorHex: '#FDF5E6',
        tireFront: '90/90-12',
        tireRear: '90/90-12',
        tireType: 'Pneu Aro 12 de Vácuo Carga Pesada 90/90-12',
        motor: '2000W Brushless (12G Reforçado)',
        battery: 'Lítio 60V 20Ah / Suporta 72V 125Ah',
        wholesalePrice: 6000,
        retailPrice: 9500,
        status: 'in_stock',
        entryDate: '2026-10-12T13:00:00.000Z',
        containerLot: 'CN-40HQ-U2-LOG-01',
        clientOrFranchise: null,
        notes: 'Equipado com baú médio integrado.',
        photos: ['/assets/models/z8_u2_studio.jpg'],
        repairsHistory: []
      },
      // Z8 N95C Max Comfort
      {
        chassisVin: 'Z8-DB039-2026-0312',
        modelId: 'z8-n95c',
        modelName: 'Z8 N95C Max Comfort',
        factoryCode: 'DB039',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'urbana',
        color: 'Cinza Titânio Fosco',
        colorHex: '#5A6068',
        tireFront: '130/70-10',
        tireRear: '130/70-10',
        tireType: 'Pneus Alargados 130/70-10 sem Câmara',
        motor: '1200W 27H (30A FOC)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 6500,
        retailPrice: 10000,
        status: 'ready_to_ship',
        entryDate: '2026-10-18T10:00:00.000Z',
        containerLot: 'CN-40HQ-N95-02',
        clientOrFranchise: 'Del Barrio E-Motors (Pinda)',
        notes: 'PDI 100% aprovado. NF emitida.',
        photos: ['/assets/models/z8_n95c_studio.jpg'],
        repairsHistory: []
      },
      // Z8 H26 Standard
      {
        chassisVin: 'Z8-DB001-2026-0420',
        modelId: 'z8-h26',
        modelName: 'Z8 H26 Standard (N7)',
        factoryCode: 'DB001',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'urbana',
        color: 'Preto Ninja Metálico',
        colorHex: '#141416',
        tireFront: '3.00-10',
        tireRear: '3.00-10',
        tireType: '3.00-10 Pneu de Vácuo Urbano',
        motor: '1200W (12G-33A)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 5500,
        retailPrice: 9500,
        status: 'in_stock',
        entryDate: '2026-10-25T11:00:00.000Z',
        containerLot: 'CN-40HQ-H26-07',
        clientOrFranchise: null,
        notes: 'Mais vendido. Alarme remoto e duas chaves reservas.',
        photos: ['/assets/models/z8_n7_studio.jpg'],
        repairsHistory: []
      },
      // Z8 Q11 Compact Love
      {
        chassisVin: 'Z8-DB043-Q11-0511',
        modelId: 'z8-q11',
        modelName: 'Z8 Q11 Compact Retro Love',
        factoryCode: 'DB043-Q11',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'vintage',
        color: 'Rosa Pastel Candy',
        colorHex: '#F48FB1',
        tireFront: '3.00-10',
        tireRear: '3.00-10',
        tireType: '3.00-10 Pneu de Vácuo Suave Anti-Derrapante',
        motor: '1000W Sem Escova (9G)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 5200,
        retailPrice: 9300,
        status: 'in_stock',
        entryDate: '2026-10-28T09:30:00.000Z',
        containerLot: 'CN-40HQ-RETRO-01',
        clientOrFranchise: null,
        notes: 'Baú traseiro montado de fábrica.',
        photos: ['/assets/models/z8_q10_studio.jpg'],
        repairsHistory: []
      },
      // Z8 N710 Urban Plus
      {
        chassisVin: 'Z8-DB045-2026-0615',
        modelId: 'z8-n710',
        modelName: 'Z8 N710 Urban Plus',
        factoryCode: 'DB045-N710',
        factoryBase: 'Bases de Foshan & Huizhou',
        category: 'urbana',
        color: 'Cinza Mecha Fosco',
        colorHex: '#585E66',
        tireFront: '3.00-10',
        tireRear: '3.00-10',
        tireType: '3.00-10 Pneu de Vácuo Esportivo',
        motor: '1200W High Performance (12G)',
        battery: 'Lítio 60V 20Ah',
        wholesalePrice: 5300,
        retailPrice: 9500,
        status: 'in_stock',
        entryDate: '2026-10-27T15:00:00.000Z',
        containerLot: 'CN-40HQ-N710-03',
        clientOrFranchise: null,
        notes: 'Faróis LED mecha automáticos testados.',
        photos: ['/assets/models/z8_n710_studio.jpg'],
        repairsHistory: []
      },
      // Z8 GS-005 Golden Eagle
      {
        chassisVin: 'Z8-GS005-2026-0701',
        modelId: 'z8-gs005',
        modelName: 'Z8 GS-005 Golden Eagle',
        factoryCode: 'GS-005',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'utilitaria',
        color: 'Preto Trabalho Ônix',
        colorHex: '#1B1C1E',
        tireFront: '14x2.5',
        tireRear: '14x2.5',
        tireType: '14x2.5 inch Pneu de Vácuo City Utility',
        motor: '500W Cobre Puro (6G-NEW)',
        battery: 'Lítio 48V 20Ah',
        wholesalePrice: 3200,
        retailPrice: 6200,
        status: 'in_stock',
        entryDate: '2026-10-14T08:30:00.000Z',
        containerLot: 'CN-40HQ-EBIKE-09',
        clientOrFranchise: null,
        notes: 'Cesta frontal metálica montada e parafusada.',
        photos: ['/assets/models/z8_gs005_studio.jpg'],
        repairsHistory: []
      },
      // Z8 Diamond Luxe
      {
        chassisVin: 'Z8-GS052-2026-0810',
        modelId: 'z8-diamond',
        modelName: 'Z8 Diamond Luxe King Kong',
        factoryCode: 'GS-052',
        factoryBase: 'Base Norte (Northern Base)',
        category: 'vintage',
        color: 'Dourado Champagne Glamour',
        colorHex: '#D4AF37',
        tireFront: '16-3.0',
        tireRear: '16-3.0',
        tireType: '16-3.0 Pneu de Vácuo Alargado Tipo Balão',
        motor: '500W Cobre Puro Silencioso',
        battery: 'Lítio 48V 20Ah',
        wholesalePrice: 3400,
        retailPrice: 6800,
        status: 'in_stock',
        entryDate: '2026-10-19T10:30:00.000Z',
        containerLot: 'CN-40HQ-EBIKE-09',
        clientOrFranchise: null,
        notes: 'Pneus balão calibrados em 32 PSI.',
        photos: ['/assets/models/z8_diamond_studio.jpg'],
        repairsHistory: []
      }
    ];

    await this.dexie.vehicles.bulkAdd(sampleVehicles);

    // Seed Sample Service Orders (OS)
    const sampleRepairs = [
      {
        osNumber: 'OS-2026-0012',
        chassisVin: 'Z8-DB043-2026-0046',
        modelId: 'z8-fx10',
        modelName: 'Z8 FX-10 Sport',
        mechanicName: 'Roberto Mecânico Chefe (Z8 Matriz)',
        faultType: 'Ajuste de Sensor Hall & Troca de Manopla',
        faultDescription: 'Intermitência na resposta de aceleração em aclives fortes. Substituição preventiva.',
        status: 'in_progress',
        partsUsed: [
          { partNumber: 'THROTTLE-HALL-TWIST', namePt: 'Manopla de Aceleração com Sensor Hall', qty: 1 }
        ],
        notes: 'Chicote principal verificado sem oxidação. Peça substituída do estoque.',
        openedAt: '2026-10-31T09:15:00.000Z',
        completedAt: null
      },
      {
        osNumber: 'OS-2026-0010',
        chassisVin: 'Z8-DB018-GPS-0010',
        modelId: 'z8-tank-2-gps',
        modelName: 'Z8 Tank 2 GPS Smart',
        mechanicName: 'Carlos Silveira',
        faultType: 'Inspeção PDI Pré-Entrega & Ativação de GPS',
        faultDescription: 'PDI oficial para entrega a concessionária franqueada. Ativação do chip M2M 4G.',
        status: 'completed',
        partsUsed: [
          { partNumber: 'GPS-4G-TELEMETRY-MODULE', namePt: 'Módulo GPS 4G LTE Homologado ANATEL', qty: 1 }
        ],
        notes: 'Veículo 100% aprovado para entrega.',
        openedAt: '2026-10-22T14:30:00.000Z',
        completedAt: '2026-10-22T16:45:00.000Z'
      }
    ];

    await this.dexie.repairs.bulkAdd(sampleRepairs);

    // Seed Sample Movements
    const sampleMovements = [
      {
        id: 'MOV-2026-0001',
        type: 'inflow_container',
        date: '2026-10-15T09:00:00.000Z',
        chassisVin: 'Z8-DB018-2026-0001',
        modelId: 'z8-tank',
        refDoc: 'CN-40HQ-Z8-0104',
        originDest: 'Fábrica Base Norte -> Galpão Central SJC',
        user: 'Christian Hideyuki'
      },
      {
        id: 'MOV-2026-0002',
        type: 'outflow_franchise',
        date: '2026-10-29T11:00:00.000Z',
        chassisVin: 'Z8-DB039-2026-0312',
        modelId: 'z8-n95c',
        refDoc: 'NF-e 000412',
        originDest: 'Galpão Central -> Concessionária Del Barrio E-Motors',
        user: 'Christian Hideyuki'
      }
    ];

    await this.dexie.movements.bulkAdd(sampleMovements);
  }

  // ================= CRUD: VEHICLES =================
  async getAllVehicles() {
    return await this.dexie.vehicles.toArray();
  }

  async getVehicleByVin(vin) {
    return await this.dexie.vehicles.get(vin);
  }

  async addVehicle(vehicle) {
    await this.dexie.vehicles.put(vehicle);
    await this.logMovement({
      type: 'inflow_single',
      date: new Date().toISOString(),
      chassisVin: vehicle.chassisVin,
      modelId: vehicle.modelId,
      refDoc: vehicle.containerLot || 'AVULSO',
      originDest: 'Entrada Direta Pátio',
      user: 'Operador WMS'
    });
    this.triggerServerSync();
    return vehicle;
  }

  async updateVehicle(vin, updates) {
    await this.dexie.vehicles.update(vin, updates);
    this.triggerServerSync();
  }

  async deleteVehicle(vin) {
    await this.dexie.vehicles.delete(vin);
    this.triggerServerSync();
  }

  // ================= BATCH IMPORT (CONTAINER 40HQ) =================
  async importContainerBatch(batchData) {
    const {
      containerNumber,
      model,
      quantity,
      chassisPrefix,
      startSeq,
      colorsRatio,
      notes
    } = batchData;

    const vehiclesToAdd = [];
    const movementsToAdd = [];
    const nowIso = new Date().toISOString();

    const colorsList = colorsRatio && colorsRatio.length > 0
      ? colorsRatio
      : (model.colors || [{ namePt: 'Padrão Fábrica', nameCn: '出厂标准色', hex: '#333333' }]);

    for (let i = 0; i < quantity; i++) {
      const currentSeq = Number(startSeq) + i;
      const formattedSeq = String(currentSeq).padStart(4, '0');
      const chassisVin = `${chassisPrefix}${formattedSeq}`;

      // Distribute colors across the batch
      const colorObj = colorsList[i % colorsList.length];

      const vehicle = {
        chassisVin,
        modelId: model.id,
        modelName: model.name,
        factoryCode: model.code,
        factoryBase: model.factoryBase,
        category: model.category,
        color: colorObj.namePt || colorObj.name,
        colorHex: colorObj.hex || '#555555',
        tireFront: model.tireFront,
        tireRear: model.tireRear,
        tireType: model.tireType,
        motor: model.motor,
        battery: model.battery,
        wholesalePrice: model.wholesalePrice,
        retailPrice: model.retailPrice,
        status: 'in_stock',
        entryDate: nowIso,
        containerLot: containerNumber,
        clientOrFranchise: null,
        notes: notes || `Container 40HQ importado em lote (${quantity} pcs).`,
        photos: [model.image],
        repairsHistory: []
      };

      vehiclesToAdd.push(vehicle);

      movementsToAdd.push({
        id: `MOV-${Date.now()}-${i + 1}`,
        type: 'inflow_container',
        date: nowIso,
        chassisVin,
        modelId: model.id,
        refDoc: containerNumber,
        originDest: `${model.factoryBase} -> Galpão Central`,
        user: 'Christian Hideyuki (Diretoria)'
      });
    }

    await this.dexie.vehicles.bulkPut(vehiclesToAdd);
    await this.dexie.movements.bulkAdd(movementsToAdd);
    this.triggerServerSync();

    return vehiclesToAdd;
  }

  // ================= CRUD: REPAIRS (ORDENS DE SERVIÇO) =================
  async getAllRepairs() {
    return await this.dexie.repairs.toArray();
  }

  async createServiceOrder(orderData) {
    const osNumber = `OS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const repair = {
      osNumber,
      chassisVin: orderData.chassisVin,
      modelId: orderData.modelId,
      modelName: orderData.modelName,
      mechanicName: orderData.mechanicName,
      faultType: orderData.faultType,
      faultDescription: orderData.faultDescription,
      status: orderData.status || 'analyzing',
      partsUsed: orderData.partsUsed || [],
      notes: orderData.notes || '',
      openedAt: new Date().toISOString(),
      completedAt: null
    };

    await this.dexie.repairs.add(repair);

    // Update vehicle status to in_service
    await this.dexie.vehicles.update(orderData.chassisVin, {
      status: 'in_service'
    });

    // Deduct parts from stock automatically!
    if (orderData.partsUsed && orderData.partsUsed.length > 0) {
      for (const item of orderData.partsUsed) {
        await this.deductPartStock(item.partNumber, item.qty || 1);
      }
    }

    this.triggerServerSync();
    return repair;
  }

  async updateServiceOrderStatus(osNumber, newStatus, completionNotes = '') {
    const repair = await this.dexie.repairs.get(osNumber);
    if (!repair) return;

    const updates = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completedAt = new Date().toISOString();
      if (completionNotes) updates.notes = `${repair.notes} | Conclusão: ${completionNotes}`;

      // Free vehicle back to in_stock or ready_to_ship
      await this.dexie.vehicles.update(repair.chassisVin, {
        status: 'in_stock'
      });
    }

    await this.dexie.repairs.update(osNumber, updates);
    this.triggerServerSync();
  }

  // ================= CRUD: SPARE PARTS & TIRES =================
  async getAllParts() {
    return await this.dexie.parts.toArray();
  }

  async deductPartStock(partNumber, qty = 1) {
    const part = await this.dexie.parts.get(partNumber);
    if (part) {
      const newStock = Math.max(0, part.currentStock - qty);
      await this.dexie.parts.update(partNumber, { currentStock: newStock });
    }
  }

  async addPart(partData) {
    await this.dexie.parts.put(partData);
    this.triggerServerSync();
  }

  // ================= CRUD: MODELS =================
  async getAllModels() {
    return await this.dexie.models.toArray();
  }

  async addNewModel(modelData) {
    await this.dexie.models.put(modelData);
    this.triggerServerSync();
    return modelData;
  }

  // ================= MOVEMENTS & AUDIT =================
  async getAllMovements() {
    return await this.dexie.movements.orderBy('date').reverse().toArray();
  }

  async logMovement(movData) {
    const id = `MOV-${Date.now()}`;
    await this.dexie.movements.add({ id, ...movData });
  }

  // ================= EXPORT & SYNC =================
  async exportFullDatabaseJson() {
    const vehicles = await this.dexie.vehicles.toArray();
    const models = await this.dexie.models.toArray();
    const parts = await this.dexie.parts.toArray();
    const repairs = await this.dexie.repairs.toArray();
    const movements = await this.dexie.movements.toArray();

    return {
      appName: 'Z8 WMS',
      exportedAt: new Date().toISOString(),
      counts: {
        vehicles: vehicles.length,
        models: models.length,
        parts: parts.length,
        repairs: repairs.length,
        movements: movements.length
      },
      data: { vehicles, models, parts, repairs, movements }
    };
  }

  /**
   * Send database snapshot to local server disk storage
   */
  async triggerServerSync() {
    try {
      const fullDb = await this.exportFullDatabaseJson();
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullDb)
      }).catch(() => {
        // Silent catch if server is in offline standalone mode
      });
    } catch (e) {
      // Offline fallback
    }
  }
}

export const wmsDb = new Z8WmsDatabase();
