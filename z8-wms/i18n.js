/**
 * Z8 E-MOTION // WMS BILINGUAL DICTIONARY
 * Full bilingual support: Português (Brasil) & 中文 (简体)
 */

export const i18n = {
  currentLang: 'pt-BR',

  translations: {
    'pt-BR': {
      // BRAND & HEADER
      appTitle: 'Z8 WMS // WAREHOUSE MANAGEMENT SYSTEM',
      appSubtitle: 'Sistema de Gestão de Estoque, Pátio, Chassi & Oficina Técnica',
      cockpitOperational: 'COCKPIT OPERACIONAL // PÁTIO INDUSTRIAL',
      storageStatus: 'BASE DE DADOS LOCAL OFFLINE // SINCRONIZADA',
      connectedMobileLabel: 'CONECTAR SCANNER MOBILE',
      btnLanguageToggle: '中文 (简体)',

      // NAVIGATION TABS
      tabDashboard: 'Painel & KPIs',
      tabVehicles: 'Pátio & Chassis VIN',
      tabMovements: 'Entradas & Saídas',
      tabWorkshop: 'Oficina & Ordens de Serviço',
      tabParts: 'Peças & Pneus',
      tabNewModel: 'Modelos & Lançamentos',

      // TOP BAR QUICK ACTIONS
      btnNewInflow: '+ Nova Entrada (Lote / Chassi)',
      btnNewOutflow: '- Nova Saída (Faturamento)',
      btnPrintLabel: 'Imprimir Etiqueta',
      btnQuickScan: 'Scanner Rápido',
      btnExportBackup: 'Exportar Backup JSON',

      // KPI CARDS
      kpiTotalVehicles: 'Motos em Pátio',
      kpiPdiQueue: 'Em Inspeção PDI',
      kpiInWorkshop: 'Em Reparo / OS',
      kpiReadyToShip: 'Prontas p/ Saída',
      kpiPartsAlert: 'Alertas de Ruptura',
      kpiTurnoverRate: 'Giro de Estoque',
      kpiAvgRetentionDays: 'Tempo Médio no Pátio (DMR)',
      kpiInventoryValue: 'Valor Patrimonial em Pátio',

      // VEHICLES / CHASSIS VIEW
      filterModel: 'Filtrar por Modelo',
      filterAllModels: 'Todos os Modelos',
      filterStatus: 'Filtrar por Status',
      filterAllStatus: 'Todos os Status',
      filterColor: 'Filtrar por Cor',
      filterAllColors: 'Todas as Cores',
      searchChassisPlaceholder: 'Buscar por Chassi VIN, Lote ou Motor...',
      btnAddNewVehicle: '+ Inserir Chassi Manual',
      btnImportContainer: 'Importar Container (Romaneio)',
      thChassis: 'Chassi / VIN',
      thModel: 'Modelo & Código Fábrica',
      thColor: 'Cor de Fábrica',
      thTires: 'Dimensões dos Pneus',
      thBatteryMotor: 'Motor / Bateria',
      thEntryDate: 'Data Entrada',
      thAging: 'Idade no Pátio',
      thStatus: 'Status Atual',
      thActions: 'Ações Rápidas',

      // STATUS LABELS
      statusInStock: 'Em Pátio (Livre)',
      statusPdiInspection: 'Inspeção PDI',
      statusInService: 'Oficina / Reparo',
      statusReadyToShip: 'Liberado / Faturado',
      statusDelivered: 'Expedido / Entregue',

      // ACTIONS
      btnViewDetails: 'Ficha Técnica',
      btnPrintSticker: 'Etiqueta Térmica',
      btnOpenOs: 'Abrir OS / Reparo',
      btnModifyTuning: 'Modificar / Tuning',
      btnTransferOut: 'Faturar Saída',

      // MOVEMENTS VIEW (ENTRADAS & SAÍDAS)
      movementsTitle: 'Livro Registro de Movimentações de Estoque',
      thMovementId: 'ID Movimento',
      thMovementType: 'Tipo Operação',
      thMovementDate: 'Data & Hora',
      thMovementChassis: 'Chassi VIN',
      thMovementModel: 'Modelo',
      thMovementDoc: 'Documento / Lote / Container',
      thMovementDest: 'Origem / Destino',
      thMovementUser: 'Responsável',
      typeInflowContainer: 'Entrada Container 40HQ',
      typeInflowSingle: 'Entrada Unidade Avulsa',
      typeOutflowFranchise: 'Saída Atacado Franquia',
      typeOutflowRetail: 'Saída Varejo Final',
      typeOsMovement: 'Movimento Oficina / Teste',

      // CONTAINER BATCH MODAL
      modalContainerTitle: 'Entrada em Lote de Container 40HQ (Importação Fábrica)',
      lblContainerNumber: 'Número do Container / BL:',
      lblSelectModel: 'Modelo do Container:',
      lblQuantity: 'Quantidade de Motos no Lote (ex: 85 pcs):',
      lblChassisPrefix: 'Prefixo Sequencial do Chassi (ex: Z8-DB018-2026-):',
      lblStartSequence: 'Número Inicial da Sequência:',
      lblColorDistribution: 'Distribuição de Cores:',
      lblTireSpecification: 'Especificação dos Pneus:',
      lblEntryNotes: 'Observações de Importação / Avaria de Transporte:',
      btnProcessContainerInflow: 'Confirmar Entrada no Pátio e Gerar Chassis',

      // WORKSHOP & SERVICE ORDERS (OFICINA & OS)
      workshopTitle: 'Centro Técnico & Gestão de Ordens de Serviço (OS)',
      workshopSubtitle: 'Controle de falhas elétricas, pneus, balanceamento e peças sobressalentes',
      btnCreateOs: '+ Nova Ordem de Serviço (OS)',
      thOsNumber: 'OS Nº',
      thOsChassis: 'Chassi / Modelo',
      thOsFaultType: 'Tipo de Ocorrência',
      thOsMechanic: 'Técnico Responsável',
      thOsPartsDeducted: 'Peças Deduzidas',
      thOsOpenedAt: 'Data de Abertura',
      thOsStatus: 'Status da OS',
      osStatusAnalyzing: 'Diagnóstico Inicial',
      osStatusInProgress: 'Em Manutenção',
      osStatusWaitingParts: 'Aguardando Peças',
      osStatusTestRide: 'Em Teste de Rodagem',
      osStatusCompleted: 'Concluído & Aprovado',

      // PARTS & TIRES (ALMOXARIFADO DE PEÇAS & PNEUS)
      partsTitle: 'Almoxarifado de Peças Sobressalentes & Pneus Oficiais',
      partsSubtitle: 'BOM oficial da fábrica com cálculo de ponto de reposição (EOQ) e estoque de segurança',
      btnAddNewPart: '+ Nova Peça / Pneu no Catálogo',
      thPartNumber: 'Código da Peça (PN)',
      thPartName: 'Descrição Técnica',
      thPartCategory: 'Categoria',
      thPartTireDim: 'Medida do Pneu / Aro',
      thPartCompatible: 'Modelos Compatíveis',
      thPartStock: 'Estoque Atual',
      thPartMinStock: 'Estoque Mínimo',
      thPartEoq: 'Lote Econômico (EOQ)',
      thPartCost: 'Custo Unitário',
      thPartStatus: 'Situação',
      stockSufficient: 'Estoque Normal',
      stockLow: 'Ponto de Reposição',
      stockCritical: 'CRÍTICO / RUPTURA',

      // NEW MODEL MANAGER
      newModelTitle: 'Gerenciador de Modelos Homologados Z8',
      newModelSubtitle: 'Cadastre novas motos, versões e variações técnicas que venham da China',
      btnSaveNewModel: 'Salvar Modelo no Catálogo Homologado',
      lblModelName: 'Nome Comercial do Modelo:',
      lblModelNameCn: 'Nome Chinês (中文):',
      lblFactoryCode: 'Código de Fábrica (ex: DB018, DB043):',
      lblFactoryBase: 'Polo Industrial (Base Norte / Foshan):',
      lblCategory: 'Categoria de Veículo:',
      lblMotorSpec: 'Especificações do Motor:',
      lblControllerSpec: 'Controlador FOC / Amperagem:',
      lblTireFront: 'Pneu Dianteiro (ex: 110/70-12):',
      lblTireRear: 'Pneu Traseiro (ex: 110/70-12):',
      lblTireType: 'Tipo de Pneu (Vácuo / Neve / Hot Melt):',
      lblBatterySpec: 'Bateria e Voltagem Suportada:',
      lblWholesalePrice: 'Preço de Atacado (R$):',
      lblRetailPrice: 'Preço de Varejo Sugerido (R$):',
      lblContainer40HQ: 'Capacidade no Container 40HQ (pcs):',
      lblAvailableColors: 'Cores Disponíveis (separadas por vírgula):',
      lblModelFeatures: 'Diferenciais Técnicos (1 por linha):',

      // THERMAL LABEL PRINTING
      labelTitle: 'Impressão de Etiqueta Térmica Industrial',
      labelSelectSize: 'Formato da Etiqueta:',
      labelSize100x50: 'Padrão Industrial 100 x 50 mm',
      labelSize80x40: 'Padrão Balcão 80 x 40 mm',
      btnPrintNow: 'Imprimir Etiqueta Térmica',
      labelContranBadge: 'HOMOLOGADO CONTRAN 996 // Z8 EMOTION LTDA',

      // MOBILE COMPANION
      mobileScannerTitle: 'Z8 Mobile Companion // Scanner & PDI',
      mobileScanPrompt: 'Aponte a câmera para o QR Code ou Código de Barras do Chassi:',
      mobileBtnStartCamera: 'Ativar Câmera Scanner',
      mobileBtnStopCamera: 'Parar Scanner',
      mobileBtnTakePhoto: 'Fotografar Veículo / PDI',
      mobileUploadSuccess: 'Foto de inspeção sincronizada com sucesso no servidor!',
      mobileChassisFound: 'Veículo Identificado com Sucesso:',

      // GENERAL BUTTONS & MESSAGES
      btnCancel: 'Cancelar',
      btnSave: 'Salvar Alterações',
      btnConfirm: 'Confirmar',
      btnClose: 'Fechar',
      savedSuccessfully: 'Registro atualizado e sincronizado com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este registro?',
      noDataFound: 'Nenhum registro encontrado para estes filtros.',

      // SINGLE VEHICLE INFLOW MODAL
      modalSingleVehicleTitle: 'Entrada de Veículo Individual / Protótipo',
      lblChassisVin: 'Número do Chassi (VIN):',
      btnGenerateVin: '⚡ Gerar VIN Automático',
      lblEngineSerial: 'Nº Série Motor:',
      lblBatterySerial: 'Nº Série Bateria:',
      lblOriginDoc: 'Documento / NF-e / BL:',
      lblYardBay: 'Posição / Baía no Pátio:',
      btnSubmitSingleVehicle: 'Confirmar Entrada do Veículo',

      // DISPATCH OUTFLOW MODAL
      modalDispatchTitle: 'Expedição & Faturamento de Veículo',
      lblDispatchType: 'Tipo de Saída:',
      lblDestination: 'Destino / Concessionária / Cliente:',
      lblInvoiceNumber: 'Nota Fiscal / Pedido Nº:',
      lblCarrier: 'Transportadora / Motorista:',
      lblTrackingCode: 'Código de Rastreio:',
      lblDispatchDate: 'Data de Saída:',
      lblDispatchNotes: 'Observações da Expedição:',
      btnSubmitDispatch: 'Confirmar Saída & Faturamento',

      // ADD PART MODAL
      modalAddPartTitle: 'Cadastro de Peça Sobressalente & Pneus',
      lblPartNumber: 'Código da Peça (PN):',
      lblPartNamePt: 'Descrição em Português:',
      lblPartNameCn: 'Descrição em Chinês (中文):',
      lblPartCategory: 'Categoria:',
      lblTireDim: 'Medida do Pneu / Aro (se aplicável):',
      lblCompatibleModels: 'Modelos Compatíveis:',
      lblCurrentStock: 'Estoque Inicial:',
      lblMinStock: 'Estoque Mínimo (Ponto de Reposição):',
      lblAnnualDemand: 'Demanda Anual Estimada (D):',
      lblUnitCost: 'Custo Unitário (R$):',
      btnSubmitAddPart: 'Salvar Peça no Almoxarifado',

      // PDI CHECKLIST MODAL
      modalPdiTitle: 'Protocolo de Entrega Técnica & PDI (24 Itens)',
      pdiSubtitle: 'Inspeção eletromecânica obrigatória antes da liberação do veículo',
      pdiCluster1: '1. BATERIA, BMS & SISTEMA ELÉTRICO',
      pdiCluster2: '2. CHASSI, SUSPENSÃO & PNEUS',
      pdiCluster3: '3. FREIOS HIDRÁULICOS & SEGURANÇA',
      pdiCluster4: '4. MOTOR BRUSHLESS & TRANSMISSÃO',
      pdiCheckAll: 'Marcar Todos como Conformes',
      lblPdiTech: 'Técnico Responsável pelo PDI:',
      lblPdiNotes: 'Laudo Técnico / Observações:',
      btnApprovePdi: 'Aprovar PDI & Liberar para Saída',
      btnFailPdi: 'Reprovar PDI & Abrir OS Corretiva',

      // YARD 2D MAP & BATCH ACTIONS
      btnViewTable: 'Exibição em Tabela',
      btnViewYard: 'Mapa Visual de Baías (2D)',
      yardAisleA: 'SETOR A // PRONTAS P/ SAÍDA & EXPEDIÇÃO',
      yardAisleB: 'SETOR B // ESTOQUE REGULAR EM PÁTIO',
      yardAisleC: 'SETOR C // TRIAGEM & INSPEÇÃO PDI',
      yardAisleD: 'SETOR D // OFICINA TÉCNICA & ELEVADORES',
      btnBatchPrint: 'Imprimir Etiquetas Térmicas (Lote)',
      btnExportCsv: 'Exportar Relatório CSV',
      btnActionPdi: '📋 PDI',
      btnActionDispatch: '🚚 Despachar',

      // ELEVATORS COCKPIT
      elevatorsTitle: 'Cockpit de Elevadores da Oficina (Padrão Franquia Z8 - 2 Elevadores)',
      elevatorsSubtitle: 'Monitoramento em tempo real dos elevadores hidráulicos/pneumáticos para motocicletas elétricas',
      elevatorBay1: 'Elevador 01 (Bay A - Primário)',
      elevatorBay2: 'Elevador 02 (Bay B - Secundário)',
      elevatorStatusOccupied: 'OCUPADO // EM SERVIÇO',
      elevatorStatusAvailable: 'DISPONÍVEL // LIVRE',
      elevatorDuration: 'Tempo em Elevação:',
      elevatorOperation: 'Serviço em Andamento:',
      elevatorMechanic: 'Técnico Responsável:',
      btnAllocateElevator: '+ Alocar Moto no Elevador',
      btnReleaseElevator: 'Descer & Liberar Elevador',
      modalAllocateElevatorTitle: 'Alocação de Motocicleta no Elevador da Oficina',
      lblSelectElevator: 'Selecionar Elevador:',
      lblSelectVehicleForElevator: 'Chassi do Veículo no Pátio:',
      lblElevatorOperationType: 'Tipo de Intervenção Técnica:',
      lblElevatorTechName: 'Mecânico Responsável:',
      btnConfirmElevatorAllocation: 'Subir no Elevador & Iniciar Serviço',

      // CUSTOMS CLEARANCE MANIFEST (ROMANEIO ADUANEIRO)
      btnOpenCustomsManifest: '📄 Romaneio de Desembaraço (BL)',
      modalCustomsTitle: 'Romaneio Oficial de Desembaraço Aduaneiro & Importação',
      customsSubtitle: 'Declaração de Importação, NCMs Homologadas e Certificação de Cargas Perigosas (UN 3171/3480)',
      lblCustomsContainerSelect: 'Selecione o Container 40HQ / BL:',
      customsImporterLabel: 'Importador / Razão Social:',
      customsCnpj: 'CNPJ:',
      customsExporterLabel: 'Fabricante / Exportador:',
      customsPol: 'Porto de Origem (POL):',
      customsPod: 'Porto de Destino (POD):',
      customsNcmTitle: 'Classificação Fiscal Aduaneira (NCM / TIPI):',
      customsDangerousGoodsTitle: 'Declaração de Transporte de Mercadorias Perigosas (ONU / OACI / IMO):',
      customsChassisTableTitle: 'Relação Oficial de Veículos & Conjunto Propulsor do Lote:',
      btnPrintCustomsSheet: '🖨️ Imprimir Manifesto Aduaneiro (A4)'
    },

    'zh-CN': {
      // BRAND & HEADER
      appTitle: 'Z8 智能仓储管理系统 // WMS',
      appSubtitle: '整车库存、车架号流水、库龄分析与售后维修工单中心',
      cockpitOperational: '工业仓储控制台 // 车辆作业区',
      storageStatus: '本地私有数据库 // 实时已同步',
      connectedMobileLabel: '连接手机端扫码器',
      btnLanguageToggle: 'Português (BR)',

      // NAVIGATION TABS
      tabDashboard: '控制面板与KPI',
      tabVehicles: '车辆与车架号库存',
      tabMovements: '出入库与集装箱清单',
      tabWorkshop: '售后维修与工单',
      tabParts: '备件与轮胎仓库',
      tabNewModel: '车型管理与新车发布',

      // TOP BAR QUICK ACTIONS
      btnNewInflow: '+ 批量/单车入库',
      btnNewOutflow: '- 车辆出库 (发货开单)',
      btnPrintLabel: '打印车架标签',
      btnQuickScan: '快速扫码核验',
      btnExportBackup: '导出 JSON 备份',

      // KPI CARDS
      kpiTotalVehicles: '在库整车总数',
      kpiPdiQueue: 'PDI待检车辆',
      kpiInWorkshop: '维修保养中',
      kpiReadyToShip: '待交付/待发运',
      kpiPartsAlert: '备件库存告警',
      kpiTurnoverRate: '库存周转率',
      kpiAvgRetentionDays: '平均在库天数 (DMR)',
      kpiInventoryValue: '在库车辆资产总值',

      // VEHICLES / CHASSIS VIEW
      filterModel: '按车型筛选',
      filterAllModels: '所有车型',
      filterStatus: '按状态筛选',
      filterAllStatus: '所有状态',
      filterColor: '按颜色筛选',
      filterAllColors: '所有颜色',
      searchChassisPlaceholder: '搜索车架号(VIN)、批次或电机编码...',
      btnAddNewVehicle: '+ 手动单车录入',
      btnImportContainer: '集装箱装箱单批量导入',
      thChassis: '车架号 / VIN',
      thModel: '车型与工厂编号',
      thColor: '车身颜色',
      thTires: '轮胎规格 (前/后)',
      thBatteryMotor: '电机 / 电池',
      thEntryDate: '入库日期',
      thAging: '在库库龄',
      thStatus: '当前状态',
      thActions: '快捷操作',

      // STATUS LABELS
      statusInStock: '在库 (正常)',
      statusPdiInspection: 'PDI检验中',
      statusInService: '工单维修中',
      statusReadyToShip: '已开单/待提车',
      statusDelivered: '已出库/已交付',

      // ACTIONS
      btnViewDetails: '技术档案',
      btnPrintSticker: '热敏标签',
      btnOpenOs: '开立工单',
      btnModifyTuning: '改装/升级',
      btnTransferOut: '办理出库',

      // MOVEMENTS VIEW (ENTRADAS & SAÍDAS)
      movementsTitle: '出入库流水台账与集装箱清关明细',
      thMovementId: '流水号',
      thMovementType: '操作类型',
      thMovementDate: '发生时间',
      thMovementChassis: '车架号 VIN',
      thMovementModel: '对应车型',
      thMovementDoc: '提单/集装箱/发票号',
      thMovementDest: '来源 / 交付去向',
      thMovementUser: '操作人',
      typeInflowContainer: '40HQ高柜整柜入库',
      typeInflowSingle: '散件单车入库',
      typeOutflowFranchise: '加盟商批发调拨出库',
      typeOutflowRetail: '终端零售出库',
      typeOsMovement: '售后返厂/测试借出',

      // CONTAINER BATCH MODAL
      modalContainerTitle: '40HQ集装箱整柜批量入库 (国内工厂直发)',
      lblContainerNumber: '集装箱号 / 提单号 (BL):',
      lblSelectModel: '入柜车型:',
      lblQuantity: '本柜到货数量 (例如 85台):',
      lblChassisPrefix: '车架号流水前缀 (例如 Z8-DB018-2026-):',
      lblStartSequence: '起始流水号编号:',
      lblColorDistribution: '到货颜色配比明细:',
      lblTireSpecification: '装车轮胎规格:',
      lblEntryNotes: '海运到货与验货备注:',
      btnProcessContainerInflow: '确认入库并批量生成车架号标签',

      // WORKSHOP & SERVICE ORDERS (OFICINA & OS)
      workshopTitle: '售后技术服务中心与维修工单系统',
      workshopSubtitle: '电路故障排查、轮胎更换、控制器调校及备件智能核销',
      btnCreateOs: '+ 新建维修工单 (OS)',
      thOsNumber: '工单编号',
      thOsChassis: '车架号 / 车型',
      thOsFaultType: '故障或保养类型',
      thOsMechanic: '责任维修技师',
      thOsPartsDeducted: '领用核销备件',
      thOsOpenedAt: '开单时间',
      thOsStatus: '工单状态',
      osStatusAnalyzing: '接车初检',
      osStatusInProgress: '正在施工',
      osStatusWaitingParts: '等待备件调拨',
      osStatusTestRide: '路测检验',
      osStatusCompleted: '完工出库',

      // PARTS & TIRES (ALMOXARIFADO DE PEÇAS & PNEUS)
      partsTitle: '工厂原厂备件与专业轮胎仓库',
      partsSubtitle: '原厂BOM清单、经济订货批量 (EOQ) 与安全库存预警',
      btnAddNewPart: '+ 新增备件/轮胎品类',
      thPartNumber: '零件号 (PN)',
      thPartName: '技术描述',
      thPartCategory: '零件分类',
      thPartTireDim: '轮胎尺寸 / 轮毂',
      thPartCompatible: '适配车型',
      thPartStock: '当前可用库存',
      thPartMinStock: '安全库存阈值',
      thPartEoq: '经济补货量 (EOQ)',
      thPartCost: '采购成本',
      thPartStatus: '库存健康状态',
      stockSufficient: '库存充足',
      stockLow: '触及补货点',
      stockCritical: '缺货预警 / 紧急采购',

      // NEW MODEL MANAGER
      newModelTitle: 'Z8 车型准入与新车发布中心',
      newModelSubtitle: '录入来自国内基地的新车型、电池规格及技术升级',
      btnSaveNewModel: '保存新车型至官方准入目录',
      lblModelName: '海外商业名称 (Name):',
      lblModelNameCn: '国内中文名称 (中文):',
      lblFactoryCode: '工厂内部代号 (如 DB018, DB043):',
      lblFactoryBase: '所属生产基地 (北方基地/佛山):',
      lblCategory: '车型定位分类:',
      lblMotorSpec: '电机功率与类型:',
      lblControllerSpec: '控制器管数及额定电流:',
      lblTireFront: '前轮规格 (如 110/70-12):',
      lblTireRear: '后轮规格 (如 110/70-12):',
      lblTireType: '轮胎类型 (真空胎/雪地胎/热熔胎):',
      lblBatterySpec: '支持电池电压与容量:',
      lblWholesalePrice: '批发供货价 (雷亚尔 R$):',
      lblRetailPrice: '建议零售价 (雷亚尔 R$):',
      lblContainer40HQ: '40HQ高柜装箱量 (台):',
      lblAvailableColors: '出厂可选颜色 (逗号隔开):',
      lblModelFeatures: '产品核心卖点 (每行一条):',

      // THERMAL LABEL PRINTING
      labelTitle: '工业热敏标签打印机输出',
      labelSelectSize: '标签纸张尺寸:',
      labelSize100x50: '标准工业规格 100 x 50 mm',
      labelSize80x40: '紧凑柜台规格 80 x 40 mm',
      btnPrintNow: '立即打印车架热敏标签',
      labelContranBadge: '巴西 CONTRAN 996 认证 // Z8 EMOTION LTDA',

      // MOBILE COMPANION
      mobileScannerTitle: 'Z8 移动车间助手 // 扫码与验车',
      mobileScanPrompt: '请将手机摄像头对准车架上的条形码或二维码：',
      mobileBtnStartCamera: '开启手机摄像头',
      mobileBtnStopCamera: '停止扫描',
      mobileBtnTakePhoto: '拍摄现场验车/PDI照片',
      mobileUploadSuccess: '验车照片已实时同步至桌面端数据库！',
      mobileChassisFound: '成功识别车辆档案：',

      // GENERAL BUTTONS & MESSAGES
      btnCancel: '取消',
      btnSave: '保存更改',
      btnConfirm: '确认执行',
      btnClose: '关闭窗口',
      savedSuccessfully: '数据已成功保存并同步至本地私有库！',
      confirmDelete: '确定要删除此条记录吗？此操作无法撤销。',
      noDataFound: '当前筛选条件下暂无数据。',

      // SINGLE VEHICLE INFLOW MODAL
      modalSingleVehicleTitle: '单车/样品车辆入库录入',
      lblChassisVin: '车架号 (VIN):',
      btnGenerateVin: '⚡ 自动生成车架流水号',
      lblEngineSerial: '电机序列号:',
      lblBatterySerial: '电池序列号:',
      lblOriginDoc: '入库凭证 / 发票 / 提单:',
      lblYardBay: '存放库位 / 车位:',
      btnSubmitSingleVehicle: '确认录入并入库',

      // DISPATCH OUTFLOW MODAL
      modalDispatchTitle: '车辆出库与加盟商发货开单',
      lblDispatchType: '出库业务类型:',
      lblDestination: '交付去向 / 加盟门店 / 客户:',
      lblInvoiceNumber: '销售发票 / 订单编号:',
      lblCarrier: '承运物流公司 / 司机:',
      lblTrackingCode: '物流追踪单号:',
      lblDispatchDate: '出库发运日期:',
      lblDispatchNotes: '发运与交付备注:',
      btnSubmitDispatch: '确认出库发货并核减库存',

      // ADD PART MODAL
      modalAddPartTitle: '新增原厂备件与专业轮胎',
      lblPartNumber: '零件代号 (PN):',
      lblPartNamePt: '葡萄牙语名称:',
      lblPartNameCn: '中文备件名称:',
      lblPartCategory: '备件类别:',
      lblTireDim: '轮胎尺寸/轮毂规格 (若适用):',
      lblCompatibleModels: '适配车型:',
      lblCurrentStock: '期初在库数量:',
      lblMinStock: '安全库存阈值 (补货点):',
      lblAnnualDemand: '年度消耗预估 (D):',
      lblUnitCost: '采购成本单价 (R$):',
      btnSubmitAddPart: '保存备件至仓库目录',

      // PDI CHECKLIST MODAL
      modalPdiTitle: '新车交付前PDI技术检验 (24项专业标准)',
      pdiSubtitle: '整车出库前强制执行的机电24项全流程质检',
      pdiCluster1: '1. 电池系统、BMS与电气控制',
      pdiCluster2: '2. 加重车架、减震与轮胎气压',
      pdiCluster3: '3. 双油压碟刹与断电制动',
      pdiCluster4: '4. 无刷电机动力与转把响应',
      pdiCheckAll: '一键全选合格',
      lblPdiTech: '质检责任技师:',
      lblPdiNotes: '质检报告与检测备注:',
      btnApprovePdi: '✓ PDI检验合格 // 准予交付',
      btnFailPdi: '⚠️ PDI不合格 // 立即立案维修',

      // YARD 2D MAP & BATCH ACTIONS
      btnViewTable: '列表清单模式',
      btnViewYard: '2D库位图模式',
      yardAisleA: 'A区 // 待交付出库区',
      yardAisleB: 'B区 // 常规整车库存区',
      yardAisleC: 'C区 // PDI质检待检区',
      yardAisleD: 'D区 // 维修工位与举升机',
      btnBatchPrint: '批量打印热敏标签',
      btnExportCsv: '导出 CSV 报表',
      btnActionPdi: '📋 PDI质检',
      btnActionDispatch: '🚚 出库发货',

      // ELEVATORS COCKPIT
      elevatorsTitle: '维修车间举升机控制台 (Z8加盟店标配 2台液压举升机)',
      elevatorsSubtitle: '实时监控电动摩托车专用举升机占用状态与工时统计',
      elevatorBay1: '1号举升机 (A工位 - 主升降机)',
      elevatorBay2: '2号举升机 (B工位 - 副升降机)',
      elevatorStatusOccupied: '占用中 // 正在维修/PDI',
      elevatorStatusAvailable: '空闲中 // 可立即工进',
      elevatorDuration: '举升作业用时:',
      elevatorOperation: '作业技术项目:',
      elevatorMechanic: '责任机电技师:',
      btnAllocateElevator: '+ 分配车辆上举升机',
      btnReleaseElevator: '完工降下 // 释放举升机',
      modalAllocateElevatorTitle: '分配电动摩托车至车间举升机',
      lblSelectElevator: '选择作业举升机:',
      lblSelectVehicleForElevator: '选择厂区待修/PDI车架号:',
      lblElevatorOperationType: '技术作业类型:',
      lblElevatorTechName: '责任技师姓名:',
      btnConfirmElevatorAllocation: '确认举升就位 // 开始维修',

      // CUSTOMS CLEARANCE MANIFEST (ROMANEIO ADUANEIRO)
      btnOpenCustomsManifest: '📄 进口报关清关单 (BL)',
      modalCustomsTitle: 'Z8 官方集装箱整车进口报关与清关随车清单',
      customsSubtitle: '进口报关核验、巴西税号NCM归类与国际危险品运输认证 (UN 3171/3480)',
      lblCustomsContainerSelect: '选择 40HQ 集装箱 / 海运提单 (BL):',
      customsImporterLabel: '进口商名称:',
      customsCnpj: '税号 (CNPJ):',
      customsExporterLabel: '生产商 / 出口商:',
      customsPol: '装运起运港 (POL):',
      customsPod: '进口目的港 (POD):',
      customsNcmTitle: '海关编码与关税归类 (NCM / TIPI):',
      customsDangerousGoodsTitle: '联合国危险品运输申报 (UN 3171 / UN 3480 第9类危险品):',
      customsChassisTableTitle: '集装箱全量车架号、电机号与电池明细清单:',
      btnPrintCustomsSheet: '🖨️ 打印正式报关清单 (A4)'
    }
  },

  /**
   * Get text by key in active language
   */
  t(key) {
    const lang = this.currentLang;
    if (this.translations[lang] && this.translations[lang][key]) {
      return this.translations[lang][key];
    }
    if (this.translations['pt-BR'] && this.translations['pt-BR'][key]) {
      return this.translations['pt-BR'][key];
    }
    return key;
  },

  /**
   * Toggle between pt-BR and zh-CN
   */
  toggleLanguage() {
    this.currentLang = this.currentLang === 'pt-BR' ? 'zh-CN' : 'pt-BR';
    localStorage.setItem('z8_wms_lang', this.currentLang);
    this.applyToDOM();
    return this.currentLang;
  },

  /**
   * Set specific language
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('z8_wms_lang', lang);
      this.applyToDOM();
    }
  },

  /**
   * Initialize language from localStorage or default
   */
  init() {
    const saved = localStorage.getItem('z8_wms_lang');
    if (saved && this.translations[saved]) {
      this.currentLang = saved;
    }
    this.applyToDOM();
  },

  /**
   * Update all DOM elements with data-i18n attribute
   */
  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', this.t(key));
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', this.t(key));
      }
    });

    const langToggleBtn = document.getElementById('btn-lang-toggle');
    if (langToggleBtn) {
      langToggleBtn.textContent = this.currentLang === 'pt-BR' ? '中文 (简体)' : 'Português (BR)';
    }

    // Emit event so dynamic views re-render
    window.dispatchEvent(new CustomEvent('z8-lang-changed', { detail: { lang: this.currentLang } }));
  }
};
