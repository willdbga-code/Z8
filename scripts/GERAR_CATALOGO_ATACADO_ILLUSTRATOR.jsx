#target illustrator

/**
 * ========================================================================
 * Z8 E-MOTION // CATÁLOGO OFICIAL DE ATACADO 2026 (ADOBE ILLUSTRATOR)
 * DOCUMENTO NATIVO (.AI) & EXPORTAÇÃO VETORIAL (.PDF) EM 14 PRANCHETAS
 * ========================================================================
 * Foco Exclusivo: VALOR DE ATACADO (B2B // Lojistas e Concessionárias)
 * Tipografia Oficial: Montserrat Bold (Títulos) & Adobe Clean (Textos/Fichas)
 * Calibração Visual: Espaçamento Fluido, Sem Sobreposição, Alta Legibilidade
 * ========================================================================
 */

function main() {
    var projectRoot = "C:/Users/LENOVO/Desktop/Z8";

    // Dimensões A4 Paisagem (841.89 pt x 595.28 pt)
    var abWidth = 841.89;
    var abHeight = 595.28;
    var abMarginX = 60.0;
    var abMarginY = 60.0;
    var cols = 7;
    var totalPages = 14;

    // Fechar documentos abertos anteriores sem salvar rascunhos
    while (app.documents.length > 0) {
        app.documents[0].close(SaveOptions.DONOTSAVECHANGES);
    }

    // Criar Novo Documento
    var docPreset = new DocumentPreset();
    docPreset.width = abWidth;
    docPreset.height = abHeight;
    docPreset.units = RulerUnits.Millimeters;
    docPreset.colorMode = DocumentColorSpace.RGB;
    docPreset.title = "CATALOGO_ATACADO_Z8_2026";

    var doc = app.documents.addDocument(DocumentColorSpace.RGB, docPreset);

    // Paleta de Cores Z8
    function makeRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    var cWhite = makeRGB(255, 255, 255);
    var cDark = makeRGB(10, 11, 14);          // #0A0B0E Black Piano
    var cCyan = makeRGB(0, 229, 255);         // #00E5FF Electric Cyan
    var cDarkCyan = makeRGB(0, 140, 168);     // #008CA8 Dark Cyan
    var cLime = makeRGB(34, 197, 94);         // #22C55E Lime Accent
    var cSlate = makeRGB(100, 116, 139);      // #64748B Slate Grey
    var cCardBg = makeRGB(248, 250, 252);     // #F8FAFC Light Card
    var cBorder = makeRGB(226, 232, 240);     // #E2E8F0 Subtle Border
    var cWholesaleBg = makeRGB(15, 23, 42);   // #0F172A Midnight Blue Atacado

    // Gestão de Fontes Oficiais
    var fontTitle = null;
    var fontBody = null;
    var fontBold = null;

    try {
        fontTitle = app.textFonts.getByName("Montserrat-Bold");
    } catch(e1) {
        try { fontTitle = app.textFonts.getByName("AdobeClean-Bold"); } catch(e2) {}
    }

    try {
        fontBody = app.textFonts.getByName("AdobeClean-Regular");
    } catch(e3) {
        try { fontBody = app.textFonts.getByName("MyriadPro-Regular"); } catch(e4) {}
    }

    try {
        fontBold = app.textFonts.getByName("AdobeClean-Bold");
    } catch(e5) {
        try { fontBold = app.textFonts.getByName("MyriadPro-Bold"); } catch(e6) {}
    }

    function applyTitleFont(tf) {
        if (fontTitle) {
            try { tf.textRange.characterAttributes.textFont = fontTitle; } catch(e) {}
        }
    }

    function applyBodyFont(tf) {
        if (fontBody) {
            try { tf.textRange.characterAttributes.textFont = fontBody; } catch(e) {}
        }
    }

    function applyBoldFont(tf) {
        if (fontBold) {
            try { tf.textRange.characterAttributes.textFont = fontBold; } catch(e) {}
        }
    }

    // Camadas Profissionais
    var layerBg = doc.layers[0]; layerBg.name = "01_Fundo_e_Molduras";
    var layerBoxes = doc.layers.add(); layerBoxes.name = "02_Cards_e_Modulos";
    var layerPhotos = doc.layers.add(); layerPhotos.name = "03_Fotos_dos_Modelos";
    var layerText = doc.layers.add(); layerText.name = "04_Tipografia_Montserrat_Adobe";
    var layerCTA = doc.layers.add(); layerCTA.name = "05_Valor_de_Atacado_Destaque";

    // Criar as 14 Pranchetas em Grid 7x2
    for (var i = 1; i < totalPages; i++) {
        var colIdx = i % cols;
        var rowIdx = Math.floor(i / cols);
        var left = colIdx * (abWidth + abMarginX);
        var top = -rowIdx * (abHeight + abMarginY);
        var right = left + abWidth;
        var bottom = top - abHeight;
        doc.artboards.add([left, top, right, bottom]);
    }

    function getAbBounds(index) {
        return doc.artboards[index].artboardRect;
    }

    // Estrutura Base de cada Prancheta
    for (var p = 0; p < totalPages; p++) {
        var rectBounds = getAbBounds(p);
        var pLeft = rectBounds[0];
        var pTop = rectBounds[1];

        // Fundo Branco
        var bgRect = layerBg.pathItems.rectangle(pTop, pLeft, abWidth, abHeight);
        bgRect.fillColor = cWhite;
        bgRect.stroked = false;

        // Borda Fina Arquitetônica
        var frameRect = layerBg.pathItems.rectangle(pTop - 12, pLeft + 12, abWidth - 24, abHeight - 24);
        frameRect.fillColor = new NoColor();
        frameRect.stroked = true;
        frameRect.strokeColor = cBorder;
        frameRect.strokeWidth = 0.5;

        // Topo: Indicador de Prancheta
        var pageNumText = layerText.textFrames.pointText([pLeft + abWidth - 75, pTop - 32]);
        pageNumText.contents = (p < 9 ? "0" : "") + (p + 1) + " / 14";
        pageNumText.textRange.characterAttributes.size = 9;
        pageNumText.textRange.characterAttributes.fillColor = cSlate;
        pageNumText.textRange.characterAttributes.tracking = 200;
        applyBoldFont(pageNumText);

        // Topo: Header Tag Exclusiva B2B
        var headerTag = layerText.textFrames.pointText([pLeft + 45, pTop - 32]);
        if (p === 0) {
            headerTag.contents = "Z8 E-MOTION // TABELA OFICIAL DE ATACADO // EDICAO 2026";
        } else if (p === 1) {
            headerTag.contents = "Z8 E-MOTION // POLITICA COMERCIAL B2B & PADRAO DE OFICINA";
        } else if (p === 13) {
            headerTag.contents = "Z8 E-MOTION // RESUMO GERAL DE ATACADO & MATRIZ CORPORATIVA";
        } else {
            headerTag.contents = "Z8 E-MOTION // TABELA DE ATACADO // FATURAMENTO DE MONTADORA";
        }
        headerTag.textRange.characterAttributes.size = 8.5;
        headerTag.textRange.characterAttributes.fillColor = cDarkCyan;
        headerTag.textRange.characterAttributes.tracking = 240;
        applyBoldFont(headerTag);

        // Rodapé
        var footTag = layerText.textFrames.pointText([pLeft + 45, pTop - abHeight + 25]);
        footTag.contents = "CONDICAO EXCLUSIVA PARA LOJISTAS E CONCESSIONARIAS - LOTE MINIMO: 10 MOTOS - CONTRAN 996";
        footTag.textRange.characterAttributes.size = 7.5;
        footTag.textRange.characterAttributes.fillColor = cSlate;
        footTag.textRange.characterAttributes.tracking = 140;
        applyBodyFont(footTag);

        var footUrl = layerText.textFrames.pointText([pLeft + abWidth - 110, pTop - abHeight + 25]);
        footUrl.contents = "Z8EMOTION.COM";
        footUrl.textRange.characterAttributes.size = 8;
        footUrl.textRange.characterAttributes.fillColor = cDark;
        footUrl.textRange.characterAttributes.tracking = 200;
        applyBoldFont(footUrl);
    }

    // ========================================================================
    // 1. PRANCHETA 01: CAPA OFICIAL DE ATACADO (Artboard 0)
    // ========================================================================
    (function renderCover() {
        var abB = getAbBounds(0);
        var pLeft = abB[0];
        var pTop = abB[1];

        // Pill Kicker
        var kickerBox = layerBoxes.pathItems.rectangle(pTop - 65, pLeft + 45, 275, 24);
        kickerBox.fillColor = cDark;
        kickerBox.stroked = false;

        var kickerTxt = layerText.textFrames.pointText([pLeft + 55, pTop - 80]);
        kickerTxt.contents = "DISTRIBUICAO DIRETA DE FABRICA // B2B";
        kickerTxt.textRange.characterAttributes.size = 8.5;
        kickerTxt.textRange.characterAttributes.fillColor = cCyan;
        kickerTxt.textRange.characterAttributes.tracking = 220;
        applyBoldFont(kickerTxt);

        // Título Monumental em Montserrat Bold
        var titleTxt = layerText.textFrames.pointText([pLeft + 45, pTop - 112]);
        titleTxt.contents = "CATALOGO DE ATACADO 2026";
        titleTxt.textRange.characterAttributes.size = 32;
        titleTxt.textRange.characterAttributes.fillColor = cDark;
        titleTxt.textRange.characterAttributes.tracking = 60;
        applyTitleFont(titleTxt);

        // Subtítulo em Adobe Clean com espaçamento fluido
        var subTxt = layerText.textFrames.pointText([pLeft + 45, pTop - 142]);
        subTxt.contents = "Tabela executiva de precos de atacado e especificacoes tecnicas de montadora para concessionarias credenciadas.\rVeiculos 100% eletricos homologados pela Resolucao CONTRAN 996, com faturamento direto e garantia nacional.";
        subTxt.textRange.characterAttributes.size = 10;
        subTxt.textRange.characterAttributes.leading = 15;
        subTxt.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(subTxt);

        // 3 Cards de Destaque com Valores de Atacado
        var coverCards = [
            { tag: "TRAIL // PERFORMANCE MAXIMA", name: "Z8 TANK HIGH-SPEED", file: "z8_tank_studio.jpg", spec: "Motor 2000W - Chassi Tubular - NFC", precoAtacado: "R$ 7.500,00" },
            { tag: "SPORT // LANCAMENTO ESPORTIVO", name: "Z8 FX-10 SPORT", file: "z8_fx10_studio.jpg", spec: "Motor 1500W - 130mm - Duplo Disco", precoAtacado: "R$ 6.200,00" },
            { tag: "CUSTOM // CHOPPER EXCLUSIVA", name: "Z8 HARLEY X12", file: "z8_harley_studio.jpg", spec: "Motor 1200W - Som Bluetooth - Confort", precoAtacado: "R$ 6.500,00" }
        ];

        var cardW = 236;
        var cardGap = 21;
        var cardH = 340;
        var cardTop = pTop - 180;

        for (var c = 0; c < coverCards.length; c++) {
            var item = coverCards[c];
            var cardLeft = pLeft + 45 + c * (cardW + cardGap);

            var sBox = layerBoxes.pathItems.rectangle(cardTop, cardLeft, cardW, cardH);
            sBox.fillColor = cCardBg;
            sBox.stroked = true;
            sBox.strokeColor = cBorder;
            sBox.strokeWidth = 1;

            var tagT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 22]);
            tagT.contents = item.tag;
            tagT.textRange.characterAttributes.size = 7.5;
            tagT.textRange.characterAttributes.fillColor = cDarkCyan;
            tagT.textRange.characterAttributes.tracking = 180;
            applyBoldFont(tagT);

            var nameT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 42]);
            nameT.contents = item.name;
            nameT.textRange.characterAttributes.size = 13.5;
            nameT.textRange.characterAttributes.fillColor = cDark;
            nameT.textRange.characterAttributes.tracking = 50;
            applyTitleFont(nameT);

            var cImgFile = new File(projectRoot + "/public/assets/models/" + item.file);
            if (cImgFile.exists) {
                try {
                    var placedC = layerPhotos.placedItems.add();
                    placedC.file = cImgFile;
                    placedC.position = [cardLeft + 12, cardTop - 56];
                    placedC.width = 212;
                    placedC.height = 190;
                } catch (eImg) {}
            }

            var divL = layerBoxes.pathItems.rectangle(cardTop - 256, cardLeft + 16, cardW - 32, 1);
            divL.fillColor = cBorder;
            divL.stroked = false;

            var specT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 274]);
            specT.contents = item.spec;
            specT.textRange.characterAttributes.size = 8.5;
            specT.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(specT);

            var priceBg = layerBoxes.pathItems.rectangle(cardTop - 288, cardLeft + 12, cardW - 24, 42);
            priceBg.fillColor = cWholesaleBg;
            priceBg.stroked = false;

            var pLblT = layerText.textFrames.pointText([cardLeft + 20, cardTop - 299]);
            pLblT.contents = "VALOR DE ATACADO (UNITARIO)";
            pLblT.textRange.characterAttributes.size = 6.5;
            pLblT.textRange.characterAttributes.fillColor = cCyan;
            pLblT.textRange.characterAttributes.tracking = 160;
            applyBoldFont(pLblT);

            var priceT = layerCTA.textFrames.pointText([cardLeft + 20, cardTop - 318]);
            priceT.contents = item.precoAtacado;
            priceT.textRange.characterAttributes.size = 16.5;
            priceT.textRange.characterAttributes.fillColor = cWhite;
            priceT.textRange.characterAttributes.tracking = 40;
            applyTitleFont(priceT);
        }
    })();

    // ========================================================================
    // 2. PRANCHETA 02: DIRETRIZES COMERCIAIS B2B & OFICINA PADRÃO (Artboard 1)
    // ========================================================================
    (function renderBusinessRules() {
        var abB = getAbBounds(1);
        var pLeft = abB[0];
        var pTop = abB[1];
        var colLeft = pLeft + 45;

        // Kicker
        var kickerTxt = layerText.textFrames.pointText([colLeft, pTop - 68]);
        kickerTxt.contents = "MODELO DE NEGOCIO B2B // REDE HOMOLOGADA";
        kickerTxt.textRange.characterAttributes.size = 8.5;
        kickerTxt.textRange.characterAttributes.fillColor = cDarkCyan;
        kickerTxt.textRange.characterAttributes.tracking = 240;
        applyBoldFont(kickerTxt);

        // Título em Montserrat Bold (Quebrado em 2 linhas para nunca sobrepor)
        var titleTxt = layerText.textFrames.pointText([colLeft, pTop - 95]);
        titleTxt.contents = "FATURAMENTO DIRETO\rE PADRAO TECNICO.";
        titleTxt.textRange.characterAttributes.size = 22;
        titleTxt.textRange.characterAttributes.leading = 26;
        titleTxt.textRange.characterAttributes.fillColor = cDark;
        titleTxt.textRange.characterAttributes.tracking = 40;
        applyTitleFont(titleTxt);

        // Divisória
        var divLine = layerBoxes.pathItems.rectangle(pTop - 156, colLeft, 340, 1);
        divLine.fillColor = cBorder;
        divLine.stroked = false;

        // Textos em Adobe Clean
        var p1Txt = layerText.textFrames.pointText([colLeft, pTop - 176]);
        p1Txt.contents = "O faturamento de atacado da Z8 E-Motion e formatado exclusivamente\rpara lojistas, revendedores e concessionarias devidamente constituidas com\rCNPJ ativo no setor automotivo ou de duas rodas.";
        p1Txt.textRange.characterAttributes.size = 9;
        p1Txt.textRange.characterAttributes.leading = 14.5;
        p1Txt.textRange.characterAttributes.fillColor = cDark;
        applyBodyFont(p1Txt);

        var p2Txt = layerText.textFrames.pointText([colLeft, pTop - 238]);
        p2Txt.contents = "Nossa politica comercial garante margens operacionais solidas aos parceiros,\rcom veiculos faturados diretamente da montadora com Nota Fiscal de fabrica,\rtermo de garantia nacional e suporte tecnico dedicado permanente.";
        p2Txt.textRange.characterAttributes.size = 9;
        p2Txt.textRange.characterAttributes.leading = 14.5;
        p2Txt.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(p2Txt);

        // 3 Cards de Métricas Operacionais
        var kpis = [
            { val: "10 MOTOS", lbl: "LOTE MINIMO DE COMPRA", col: cDark },
            { val: "2 ELEVADORES", lbl: "OFICINA TECNICA PADRAO", col: cDarkCyan },
            { val: "50 a 60 m2", lbl: "AREA COMERCIAL MINIMA", col: cLime }
        ];

        var kpiW = 106;
        var kpiGap = 11;
        var kpiH = 62;
        var kpiTop = pTop - 325;

        for (var k = 0; k < kpis.length; k++) {
            var kLeft = colLeft + k * (kpiW + kpiGap);
            var kBox = layerBoxes.pathItems.rectangle(kpiTop, kLeft, kpiW, kpiH);
            kBox.fillColor = cCardBg;
            kBox.stroked = true;
            kBox.strokeColor = cBorder;
            kBox.strokeWidth = 0.5;

            var kValT = layerText.textFrames.pointText([kLeft + 10, kpiTop - 22]);
            kValT.contents = kpis[k].val;
            kValT.textRange.characterAttributes.size = 12.5;
            kValT.textRange.characterAttributes.fillColor = kpis[k].col;
            applyTitleFont(kValT);

            var kLblT = layerText.textFrames.pointText([kLeft + 10, kpiTop - 46]);
            kLblT.contents = kpis[k].lbl;
            kLblT.textRange.characterAttributes.size = 6.5;
            kLblT.textRange.characterAttributes.fillColor = cSlate;
            kLblT.textRange.characterAttributes.tracking = 120;
            applyBoldFont(kLblT);
        }

        // Coluna Direita: Pilares do Faturamento de Atacado
        var rColLeft = pLeft + 420;
        var rColW = 375;
        var rCardH = 88;
        var rTopStart = pTop - 65;
        var rStep = 102;

        var rules = [
            {
                accent: cCyan,
                title: "LOTE MINIMO & FATURAMENTO DIRETO",
                desc: "Pedido inicial e reordens estruturadas em lotes minimos de 10 motos\r(podendo mesclar modelos urbanos, esportivos e utilitarios). Faturamento\rdireto da montadora com emissao de NF-e para revenda autorizada."
            },
            {
                accent: cLime,
                title: "OFICINA OBRIGATORIA COM 2 ELEVADORES",
                desc: "Exigencia operacional mandatoria para garantir o padrao Z8 de pos-venda.\rCada loja deve dispor de oficina equipada com 2 elevadores dedicados\rpara inspecao de entrega (PDI), revisoes periodicas e manutencoes rapidas."
            },
            {
                accent: cDark,
                title: "CONFORMIDADE CONTRAN 996 & REGISTRO BIN",
                desc: "Todos os modelos acompanham parecer regulatorio emitido por especialista.\rModelos autopropelidos e ciclomotores com enquadramento legal seguro,\risentos de tributacao pesada e prontos para circulacao urbana imediata."
            },
            {
                accent: cDarkCyan,
                title: "ESTOQUE CENTRALIZADO DE PECAS & GARANTIA",
                desc: "Garantia nacional respaldada pela matriz Z8 Emotion Ltda. Pecas originais\r(modulos controladores, aceleradores, baterias e freios) com expedicao rapida\rpara qualquer cidade do territorio nacional em ate 48 horas uteis."
            }
        ];

        for (var rl = 0; rl < rules.length; rl++) {
            var plTop = rTopStart - (rl * rStep);
            var itemR = rules[rl];

            var plBox = layerBoxes.pathItems.rectangle(plTop, rColLeft, rColW, rCardH);
            plBox.fillColor = cCardBg;
            plBox.stroked = true;
            plBox.strokeColor = cBorder;
            plBox.strokeWidth = 0.5;

            var plAccent = layerBoxes.pathItems.rectangle(plTop, rColLeft, 4, rCardH);
            plAccent.fillColor = itemR.accent;
            plAccent.stroked = false;

            var plTitleT = layerText.textFrames.pointText([rColLeft + 18, plTop - 20]);
            plTitleT.contents = itemR.title;
            plTitleT.textRange.characterAttributes.size = 9.5;
            plTitleT.textRange.characterAttributes.fillColor = cDark;
            plTitleT.textRange.characterAttributes.tracking = 100;
            applyTitleFont(plTitleT);

            var plDescT = layerText.textFrames.pointText([rColLeft + 18, plTop - 38]);
            plDescT.contents = itemR.desc;
            plDescT.textRange.characterAttributes.size = 7.5;
            plDescT.textRange.characterAttributes.leading = 11.5;
            plDescT.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(plDescT);
        }
    })();

    // ========================================================================
    // 3. PRANCHETAS 03 A 13: OS 11 MODELOS COM VALOR DE ATACADO
    // ========================================================================
    var wholesaleModels = [
        {
            id: "z8-tank",
            name: "Z8 TANK HIGH-SPEED",
            code: "DB018",
            tag: "TRAIL // PERFORMANCE MAXIMA",
            origin: "BASE NORTE",
            file: "z8_tank_studio.jpg",
            motor: "2000W High Torque",
            bateria: "Litio 60V 20Ah (ate 125Ah)",
            velocidade: "32 km/h (Max: 80 km/h)",
            autonomia: "Ate 60-70 km (ate 240km)",
            freios: "Duplo Disco Hidraulico",
            chassi: "Aco Tubular Duplo",
            cores: "Desert Sand, Cyber Black, Pearl White",
            destaques: "NFC Keyless - Farois Halo Duplos - Painel LCD Digital",
            precoAtacado: "R$ 7.500,00",
            lote10: "R$ 75.000,00"
        },
        {
            id: "z8-fx10",
            name: "Z8 FX-10 SPORT",
            code: "DB043",
            tag: "URBAN SPORT // AERODINAMICA",
            origin: "BASE FOSHAN",
            file: "z8_fx10_studio.jpg",
            motor: "1500W Brushless (12G-38A)",
            bateria: "Litio 60V 20Ah",
            velocidade: "32 km/h (Max: 68 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "180mm Duplo Disco Hidr.",
            chassi: "Aco Carbono Esportivo",
            cores: "Prata Metalico, Laranja Lava, Verde Militar, Branco, Cinza",
            destaques: "Carenagem FX - Duplo Disco 180mm - USB Fast Charge",
            precoAtacado: "R$ 6.200,00",
            lote10: "R$ 62.000,00"
        },
        {
            id: "z8-harley-x12",
            name: "Z8 HARLEY X12 CUSTOM",
            code: "XB-024",
            tag: "CUSTOM CHOPPER // AMERICANO",
            origin: "BASE NORTE",
            file: "z8_harley_studio.jpg",
            motor: "1200W 27H (Controlador 30A)",
            bateria: "Litio 60V 20Ah Removivel",
            velocidade: "32 km/h (Max: 50 km/h)",
            autonomia: "Ate 40 km",
            freios: "Disco Diant. / Tambor",
            chassi: "Aco Custom Chopper",
            cores: "Preto Brilho com Frisos Cromados, Vermelho, Amarelo",
            destaques: "Guidao Alto Chopper - Banco Duplo VIP - Som Bluetooth",
            precoAtacado: "R$ 6.500,00",
            lote10: "R$ 65.000,00"
        },
        {
            id: "z8-u2-delivery",
            name: "Z8 U2 DELIVERY CARGO",
            code: "XB-010",
            tag: "CARGA PESADA // FROTAS",
            origin: "BASE FOSHAN",
            file: "z8_u2_studio.jpg",
            motor: "2000W Heavy-Duty (12G)",
            bateria: "Litio 60V 20Ah (48-72V)",
            velocidade: "32 km/h (Max: 70 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "220mm Duplo Disco Hidr.",
            chassi: "Aco com Caixa p/ Bau",
            cores: "Verde Oliva/Laranja, Preto/Laranja, Branco/Laranja, Creme",
            destaques: "Rodas de Liga Aro 12 - Duplo Disco 220mm - Grade Protetora",
            precoAtacado: "R$ 6.000,00",
            lote10: "R$ 60.000,00"
        },
        {
            id: "z8-n95c",
            name: "Z8 N95C MAX COMFORT",
            code: "DB039",
            tag: "SCOOTER EXECUTIVA // CONFORTO",
            origin: "BASE FOSHAN",
            file: "z8_n95c_studio.jpg",
            motor: "1200W 27H (Controlador 30A)",
            bateria: "Litio 60V 20Ah",
            velocidade: "32 km/h (Max: 50 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "Disco Diant. / Tambor",
            chassi: "Aco com Protecao Lateral",
            cores: "Grafite Fosco, Branco Perola, Azul Noturno, Prata",
            destaques: "Barra DRL LED Continua - Assento Duplo Macio VIP - Estribos",
            precoAtacado: "R$ 6.500,00",
            lote10: "R$ 65.000,00"
        },
        {
            id: "z8-h26",
            name: "Z8 H26 STANDARD (N7)",
            code: "DB001",
            tag: "MAIOR GIRO // LINHA URBANA",
            origin: "BASE FOSHAN",
            file: "z8_n7_studio.jpg",
            motor: "1200W sem escova (12G-33A)",
            bateria: "Litio 60V 20Ah",
            velocidade: "32 km/h (Max: 50 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "180mm Duplo Disco Hidr.",
            chassi: "Aco Carbono Leve e Agil",
            cores: "Branco Perola, Preto Fosco, Azul Metalico, Vermelho, Cinza",
            destaques: "Alarme Keyless Anti-Furto - Duplo Disco 180mm - Farol DRL",
            precoAtacado: "R$ 5.500,00",
            lote10: "R$ 55.000,00"
        },
        {
            id: "z8-q11",
            name: "Z8 Q11 COMPACT RETRO",
            code: "DB043-Q11",
            tag: "CANDY STYLE // BAU DE SERIE",
            origin: "BASE FOSHAN",
            file: "z8_q10_studio.jpg",
            motor: "1000W (Controlador 9G)",
            bateria: "Litio 60V 20Ah",
            velocidade: "32 km/h (Max: 45 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "180mm Disco / Tambor",
            chassi: "Aco Estilo Italiano",
            cores: "Rosa Pastel, Verde Menta, Azul Bebe, Creme Baunilha, Branco",
            destaques: "Bau Traseiro na Cor da Moto - Amortecedor 27 Nucleos - Candy",
            precoAtacado: "R$ 5.200,00",
            lote10: "R$ 52.000,00"
        },
        {
            id: "z8-n710",
            name: "Z8 N710 URBAN PLUS",
            code: "DB045-N710",
            tag: "LANCAMENTO 2026 // MECHA",
            origin: "BASE FOSHAN",
            file: "z8_n710_studio.jpg",
            motor: "1200W sem escova High Speed",
            bateria: "Litio 60V 20Ah",
            velocidade: "32 km/h (Max: 50 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "180mm Duplo Disco Hidr.",
            chassi: "Aco Urban Plus Reforcado",
            cores: "Preto Fosco com Grafismo Mecha, Branco Polar, Prata Titanio",
            destaques: "Farois Mecha Automaticos - Suspensao Damping - Duplo Disco",
            precoAtacado: "R$ 5.300,00",
            lote10: "R$ 53.000,00"
        },
        {
            id: "z8-q10",
            name: "Z8 Q10 VINTAGE (XIAO Q)",
            code: "DB038",
            tag: "RETRO ITALIANO // ALTA AUTONOMIA",
            origin: "BASE FOSHAN",
            file: "z8_q11_studio.jpg",
            motor: "1200W (Controlador 30A)",
            bateria: "Litio 60V 20Ah (ate 120Ah)",
            velocidade: "32 km/h (Max: 45 km/h)",
            autonomia: "Ate 40-50 km (ate 240km)",
            freios: "Disco Diant. / Tambor",
            chassi: "Aco Compacto Xiao Q",
            cores: "Amarelo Vintage, Rosa Suave, Bege Classico, Roxo, Branco",
            destaques: "Farol Halo Redondo no Guidao - Banco Couro Caramelo - Vintage",
            precoAtacado: "R$ 5.800,00",
            lote10: "R$ 58.000,00"
        },
        {
            id: "z8-gs005",
            name: "Z8 GS-005 BASE NORTE",
            code: "GS-005",
            tag: "UTILITARIA PEDELEC // GOLDEN EAGLE",
            origin: "BASE NORTE",
            file: "z8_gs005_studio.jpg",
            motor: "500W Cobre Puro (6G-NEW)",
            bateria: "Litio 48V 20Ah (ou 60V)",
            velocidade: "28-32 km/h (CONTRAN)",
            autonomia: "Ate 40-50 km",
            freios: "Tambor Diant. e Tras.",
            chassi: "Aco Carbono Utilitario",
            cores: "Azul Eletrico, Vermelho Fogo, Branco Polar, Preto Solido",
            destaques: "Cesta Frontal Reforcada - Farol Mecha com Setas - Pedelec",
            precoAtacado: "R$ 3.200,00",
            lote10: "R$ 32.000,00"
        },
        {
            id: "z8-diamond",
            name: "Z8 DIAMOND LUXE",
            code: "GS-052",
            tag: "LITTLE KING KONG // DESIGN",
            origin: "BASE NORTE",
            file: "z8_diamond_studio.jpg",
            motor: "500W Cobre Puro (500W)",
            bateria: "Litio 48V 20Ah (ou 60V)",
            velocidade: "32 km/h (Max: 40 km/h)",
            autonomia: "Ate 40-50 km",
            freios: "Tambor Diant. e Tras.",
            chassi: "Aco Little King Kong",
            cores: "Azul Bebe, Amarelo Citrico, Branco Neve, Rosa, Laranja, Preto",
            destaques: "Pneus Aro 16x3.0 Largos - Cesta Metalica Elegante - Alarme Remoto",
            precoAtacado: "R$ 3.400,00",
            lote10: "R$ 34.000,00"
        }
    ];

    for (var m = 0; m < wholesaleModels.length; m++) {
        var pageIndex = m + 2; // Artboards 2..12
        var mData = wholesaleModels[m];
        var abB = getAbBounds(pageIndex);
        var abL = abB[0];
        var abT = abB[1];

        // 1. Coluna Esquerda: Card Fotográfico do Modelo
        var cardW = 460;
        var cardH = 430;
        var cardL = abL + 45;
        var cardT = abT - 60;

        var imgCard = layerBoxes.pathItems.rectangle(cardT, cardL, cardW, cardH);
        imgCard.fillColor = cCardBg;
        imgCard.stroked = true;
        imgCard.strokeColor = cBorder;
        imgCard.strokeWidth = 1;

        // Imagem Fotográfica
        var imgPath = projectRoot + "/public/assets/models/" + mData.file;
        var imgFile = new File(imgPath);
        if (imgFile.exists) {
            try {
                var placedImg = layerPhotos.placedItems.add();
                placedImg.file = imgFile;
                placedImg.position = [cardL + 15, cardT - 35];
                placedImg.width = 430;
                placedImg.height = 240;
            } catch (err) {}
        }

        // Tag sobre a Imagem com Código de Fábrica
        var tagBox = layerBoxes.pathItems.rectangle(cardT - 290, cardL + 20, 420, 26);
        tagBox.fillColor = cDark;
        tagBox.stroked = false;

        var tagTxt = layerText.textFrames.pointText([cardL + 30, cardT - 307]);
        tagTxt.contents = "// CODIGO DE FABRICA: " + mData.code + " // " + mData.origin;
        tagTxt.textRange.characterAttributes.size = 8;
        tagTxt.textRange.characterAttributes.fillColor = cCyan;
        tagTxt.textRange.characterAttributes.tracking = 160;
        applyBoldFont(tagTxt);

        // Barra de Cores Oficiais
        var colorBox = layerBoxes.pathItems.rectangle(cardT - 325, cardL + 20, 420, 45);
        colorBox.fillColor = cWhite;
        colorBox.stroked = true;
        colorBox.strokeColor = cBorder;
        colorBox.strokeWidth = 0.5;

        var colorLbl = layerText.textFrames.pointText([cardL + 30, cardT - 339]);
        colorLbl.contents = "PALETA DE CORES DE SERIE:";
        colorLbl.textRange.characterAttributes.size = 7;
        colorLbl.textRange.characterAttributes.fillColor = cDarkCyan;
        colorLbl.textRange.characterAttributes.tracking = 150;
        applyBoldFont(colorLbl);

        var colorVal = layerText.textFrames.pointText([cardL + 30, cardT - 354]);
        colorVal.contents = mData.cores;
        colorVal.textRange.characterAttributes.size = 8.5;
        colorVal.textRange.characterAttributes.fillColor = cDark;
        applyBodyFont(colorVal);

        // Barra de Destaques
        var featBox = layerBoxes.pathItems.rectangle(cardT - 378, cardL + 20, 420, 40);
        featBox.fillColor = cCardBg;
        featBox.stroked = true;
        featBox.strokeColor = cBorder;
        featBox.strokeWidth = 0.5;

        var featVal = layerText.textFrames.pointText([cardL + 30, cardT - 402]);
        featVal.contents = "• " + mData.destaques;
        featVal.textRange.characterAttributes.size = 8;
        featVal.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(featVal);

        // 2. Coluna Direita: Ficha Técnica em Adobe Clean & VALOR DE ATACADO
        var rightL = abL + 530;
        var rightT = abT - 60;

        // Kicker da Categoria
        var catTxt = layerText.textFrames.pointText([rightL, rightT]);
        catTxt.contents = "DISTRIBUICAO DIRETA // " + mData.tag;
        catTxt.textRange.characterAttributes.size = 7.5;
        catTxt.textRange.characterAttributes.fillColor = cDarkCyan;
        catTxt.textRange.characterAttributes.tracking = 180;
        applyBoldFont(catTxt);

        // Nome do Modelo em Montserrat Bold
        var nameTxt = layerText.textFrames.pointText([rightL, rightT - 22]);
        nameTxt.contents = mData.name;
        nameTxt.textRange.characterAttributes.size = 22;
        nameTxt.textRange.characterAttributes.fillColor = cDark;
        nameTxt.textRange.characterAttributes.tracking = 40;
        applyTitleFont(nameTxt);

        // Linha Divisória
        var divLine = layerBoxes.pathItems.rectangle(rightT - 52, rightL, 275, 1);
        divLine.fillColor = cBorder;
        divLine.stroked = false;

        // Grid Técnico em 6 Caixas (2 colunas x 3 linhas)
        var specs = [
            { l: "MOTORIZACAO", v: mData.motor },
            { l: "BATERIA LITIO", v: mData.bateria },
            { l: "VELOCIDADE", v: mData.velocidade },
            { l: "AUTONOMIA", v: mData.autonomia },
            { l: "SISTEMA DE FREIOS", v: mData.freios },
            { l: "CHASSI ESTRUTURAL", v: mData.chassi }
        ];

        for (var s = 0; s < specs.length; s++) {
            var sCol = s % 2;
            var sRow = Math.floor(s / 2);
            var boxX = rightL + (sCol * 140);
            var boxY = rightT - 64 - (sRow * 52);

            var sBox = layerBoxes.pathItems.rectangle(boxY, boxX, 134, 46);
            sBox.fillColor = cCardBg;
            sBox.stroked = true;
            sBox.strokeColor = cBorder;
            sBox.strokeWidth = 0.5;

            var sLbl = layerText.textFrames.pointText([boxX + 10, boxY - 14]);
            sLbl.contents = specs[s].l;
            sLbl.textRange.characterAttributes.size = 6.5;
            sLbl.textRange.characterAttributes.fillColor = cDarkCyan;
            sLbl.textRange.characterAttributes.tracking = 150;
            applyBoldFont(sLbl);

            var sVal = layerText.textFrames.pointText([boxX + 10, boxY - 30]);
            sVal.contents = specs[s].v;
            sVal.textRange.characterAttributes.size = 8;
            sVal.textRange.characterAttributes.fillColor = cDark;
            applyBodyFont(sVal);
        }

        // ====================================================================
        // CAIXA MASTER: FOCO EXCLUSIVO NO VALOR DE ATACADO (MONUMENTAL)
        // ====================================================================
        var priceBoxY = rightT - 232;
        var pBox = layerBoxes.pathItems.rectangle(priceBoxY, rightL, 275, 115);
        pBox.fillColor = cWholesaleBg;
        pBox.stroked = false;

        // Faixa de Realce Cyan
        var accentStrip = layerBoxes.pathItems.rectangle(priceBoxY, rightL, 275, 4);
        accentStrip.fillColor = cCyan;
        accentStrip.stroked = false;

        // Label de Atacado
        var pLbl = layerText.textFrames.pointText([rightL + 16, priceBoxY - 20]);
        pLbl.contents = "VALOR DE ATACADO (EXCLUSIVO B2B)";
        pLbl.textRange.characterAttributes.size = 8;
        pLbl.textRange.characterAttributes.fillColor = cCyan;
        pLbl.textRange.characterAttributes.tracking = 180;
        applyBoldFont(pLbl);

        // Valor de Atacado Monumental em Montserrat Bold
        var pVal = layerCTA.textFrames.pointText([rightL + 16, priceBoxY - 48]);
        pVal.contents = mData.precoAtacado;
        pVal.textRange.characterAttributes.size = 28;
        pVal.textRange.characterAttributes.fillColor = cWhite;
        pVal.textRange.characterAttributes.tracking = 30;
        applyTitleFont(pVal);

        // Subtítulo do Lote Mínimo
        var pLote = layerCTA.textFrames.pointText([rightL + 16, priceBoxY - 78]);
        pLote.contents = "[LOTE] Lote Minimo de 10 unidades: " + mData.lote10;
        pLote.textRange.characterAttributes.size = 8.5;
        pLote.textRange.characterAttributes.fillColor = cLime;
        pLote.textRange.characterAttributes.tracking = 50;
        applyBoldFont(pLote);

        var pTerms = layerCTA.textFrames.pointText([rightL + 16, priceBoxY - 96]);
        pTerms.contents = "• Faturamento Direto com CNPJ • Garantia Z8 • CONTRAN 996";
        pTerms.textRange.characterAttributes.size = 7;
        pTerms.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(pTerms);

        // Box de Suporte da Oficina (2 Elevadores)
        var shopBox = layerBoxes.pathItems.rectangle(priceBoxY - 125, rightL, 275, 60);
        shopBox.fillColor = cCardBg;
        shopBox.stroked = true;
        shopBox.strokeColor = cBorder;
        shopBox.strokeWidth = 0.5;

        var shopTitle = layerText.textFrames.pointText([rightL + 14, priceBoxY - 140]);
        shopTitle.contents = "SUPORTE TECNICO DE MONTADORA // OFICINA";
        shopTitle.textRange.characterAttributes.size = 7.5;
        shopTitle.textRange.characterAttributes.fillColor = cDark;
        shopTitle.textRange.characterAttributes.tracking = 120;
        applyBoldFont(shopTitle);

        var shopDesc = layerText.textFrames.pointText([rightL + 14, priceBoxY - 156]);
        shopDesc.contents = "Pecas de reposicao a pronta entrega, manuais tecnicos de PDI,\resquemas eletricos e alocacao obrigatoria nos 2 elevadores da oficina.";
        shopDesc.textRange.characterAttributes.size = 7;
        shopDesc.textRange.characterAttributes.leading = 11;
        shopDesc.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(shopDesc);
    }

    // ========================================================================
    // 4. PRANCHETA 14: TABELA RESUMO MASTER DE ATACADO & CONTATOS (Artboard 13)
    // ========================================================================
    (function renderWholesaleSummary() {
        var abB = getAbBounds(13);
        var pLeft = abB[0];
        var pTop = abB[1];

        // Título de Encerramento em Montserrat Bold
        var sumTitleT = layerText.textFrames.pointText([pLeft + 45, pTop - 65]);
        sumTitleT.contents = "TABELA GERAL COMPARATIVA DE ATACADO 2026";
        sumTitleT.textRange.characterAttributes.size = 22;
        sumTitleT.textRange.characterAttributes.fillColor = cDark;
        sumTitleT.textRange.characterAttributes.tracking = 40;
        applyTitleFont(sumTitleT);

        // Subtítulo em Adobe Clean
        var sumSubT = layerText.textFrames.pointText([pLeft + 45, pTop - 90]);
        sumSubT.contents = "Valores unitarios e por lote de 10 unidades para faturamento direto de montadora a concessionarias e revendedores homologados.";
        sumSubT.textRange.characterAttributes.size = 9.5;
        sumSubT.textRange.characterAttributes.fillColor = cSlate;
        applyBodyFont(sumSubT);

        // Tabela Comparativa Estruturada (Grid 11 linhas com larguras calibradas)
        var tableTop = pTop - 110;
        var tableLeft = pLeft + 45;
        var tableW = 750;
        var rowH = 24;

        // Cabeçalho da Tabela
        var headerBg = layerBoxes.pathItems.rectangle(tableTop, tableLeft, tableW, 26);
        headerBg.fillColor = cDark;
        headerBg.stroked = false;

        var colX = [tableLeft + 12, tableLeft + 70, tableLeft + 250, tableLeft + 380, tableLeft + 510, tableLeft + 630];
        var colHeaders = ["COD.", "MODELO Z8", "MOTORIZACAO", "BATERIA", "ATACADO UNIT.", "LOTE 10 MOTOS"];

        for (var h = 0; h < colHeaders.length; h++) {
            var hTxt = layerText.textFrames.pointText([colX[h], tableTop - 17]);
            hTxt.contents = colHeaders[h];
            hTxt.textRange.characterAttributes.size = 7.5;
            hTxt.textRange.characterAttributes.fillColor = (h >= 4 ? cCyan : cWhite);
            hTxt.textRange.characterAttributes.tracking = 140;
            applyBoldFont(hTxt);
        }

        // Linhas de cada Modelo com dados calibrados
        for (var r = 0; r < wholesaleModels.length; r++) {
            var rowItem = wholesaleModels[r];
            var rTop = tableTop - 26 - (r * rowH);

            var rowBg = layerBoxes.pathItems.rectangle(rTop, tableLeft, tableW, rowH);
            rowBg.fillColor = (r % 2 === 0 ? cCardBg : cWhite);
            rowBg.stroked = true;
            rowBg.strokeColor = cBorder;
            rowBg.strokeWidth = 0.5;

            var rCode = layerText.textFrames.pointText([colX[0], rTop - 16]);
            rCode.contents = rowItem.code;
            rCode.textRange.characterAttributes.size = 8;
            rCode.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(rCode);

            var rName = layerText.textFrames.pointText([colX[1], rTop - 16]);
            rName.contents = rowItem.name;
            rName.textRange.characterAttributes.size = 8.5;
            rName.textRange.characterAttributes.fillColor = cDark;
            applyBoldFont(rName);

            var rMotor = layerText.textFrames.pointText([colX[2], rTop - 16]);
            rMotor.contents = rowItem.motor;
            rMotor.textRange.characterAttributes.size = 7.5;
            rMotor.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(rMotor);

            var rBat = layerText.textFrames.pointText([colX[3], rTop - 16]);
            rBat.contents = rowItem.bateria;
            rBat.textRange.characterAttributes.size = 7.5;
            rBat.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(rBat);

            var rPrice = layerCTA.textFrames.pointText([colX[4], rTop - 16]);
            rPrice.contents = rowItem.precoAtacado;
            rPrice.textRange.characterAttributes.size = 9;
            rPrice.textRange.characterAttributes.fillColor = cDarkCyan;
            applyTitleFont(rPrice);

            var rLote = layerCTA.textFrames.pointText([colX[5], rTop - 16]);
            rLote.contents = rowItem.lote10;
            rLote.textRange.characterAttributes.size = 9;
            rLote.textRange.characterAttributes.fillColor = cLime;
            applyTitleFont(rLote);
        }

        // Bloco Inferior: Matriz Corporativa e Atendimento Comercial
        var infoTop = tableTop - 26 - (11 * rowH) - 15;
        var infoCards = [
            {
                tag: "MATRIZ CORPORATIVA Z8",
                title: "Z8 EMOTION LTDA.",
                lines: "CNPJ/MF: 68.774.164/0001-00\rAvenida Dr. Adhemar de Barros, 566 - Jd. Sao Dimas\rSao Jose dos Campos - SP • CEP 12.245-010\rForo: Comarca de Sao Jose dos Campos - SP"
            },
            {
                tag: "MESA DE ATACADO & EXPANSAO",
                title: "ATENDIMENTO DIRETO B2B",
                lines: "Diretoria de Expansao e Atacado:\rWhatsApp: (12) 99800-8818 (Christian Hideyuki)\rE-mail: atacado@z8emotion.com\rPortal Oficial do Parceiro: www.z8emotion.com"
            },
            {
                tag: "LOGISTICA & GARANTIA NACIONAL",
                title: "SEGURANCA JURIDICA & PDI",
                lines: "• Resolucao CONTRAN 996 Homologada\r• Despacho de Pecas para todo o Brasil em 48h\r• Suporte para Instalacao dos 2 Elevadores\r• Emissao de NF-e Direta para Revenda"
            }
        ];

        var bCardW = 236;
        var bCardGap = 21;
        var bCardH = 100;

        for (var bc = 0; bc < infoCards.length; bc++) {
            var bItem = infoCards[bc];
            var bCardL = pLeft + 45 + bc * (bCardW + bCardGap);

            var bBox = layerBoxes.pathItems.rectangle(infoTop, bCardL, bCardW, bCardH);
            bBox.fillColor = cCardBg;
            bBox.stroked = true;
            bBox.strokeColor = cBorder;
            bBox.strokeWidth = 0.5;

            var bTag = layerText.textFrames.pointText([bCardL + 12, infoTop - 16]);
            bTag.contents = bItem.tag;
            bTag.textRange.characterAttributes.size = 6.5;
            bTag.textRange.characterAttributes.fillColor = cDarkCyan;
            bTag.textRange.characterAttributes.tracking = 160;
            applyBoldFont(bTag);

            var bTitle = layerText.textFrames.pointText([bCardL + 12, infoTop - 32]);
            bTitle.contents = bItem.title;
            bTitle.textRange.characterAttributes.size = 10;
            bTitle.textRange.characterAttributes.fillColor = cDark;
            applyTitleFont(bTitle);

            var bLines = layerText.textFrames.pointText([bCardL + 12, infoTop - 48]);
            bLines.contents = bItem.lines;
            bLines.textRange.characterAttributes.size = 7;
            bLines.textRange.characterAttributes.leading = 10.5;
            bLines.textRange.characterAttributes.fillColor = cSlate;
            applyBodyFont(bLines);
        }
    })();

    // ========================================================================
    // 5. SALVAR PROJETO NATIVO DO ILLUSTRATOR (.AI) E EXPORTAR PDF
    // ========================================================================
    try {
        var aiPath = projectRoot + "/docs/CATALOGO_ATACADO_Z8_2026.ai";
        var aiFile = new File(aiPath);
        var aiOpts = new IllustratorSaveOptions();
        aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
        aiOpts.pdfCompatible = true;
        doc.saveAs(aiFile, aiOpts);

        // Exportar PDF Vetorial Oficial do Illustrator
        var pdfPath = projectRoot + "/docs/CATALOGO_ATACADO_Z8_2026_ILLUSTRATOR.pdf";
        var pdfFile = new File(pdfPath);
        var pdfOpts = new PDFSaveOptions();
        pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
        pdfOpts.preserveEditability = true;
        doc.saveAs(pdfFile, pdfOpts);

        // Gravar marcador de conclusão com sucesso
        var resFile = new File(projectRoot + "/scratch/catalogo_atacado_ai_ok.txt");
        resFile.open("w");
        resFile.writeln("SUCESSO: Catalogo de Atacado Z8 2026 gerado no Adobe Illustrator!");
        resFile.writeln("AI: " + aiPath);
        resFile.writeln("PDF: " + pdfPath);
        resFile.writeln("Data: " + (new Date()).toString());
        resFile.close();
    } catch(errSave) {
        var errFile = new File(projectRoot + "/scratch/catalogo_atacado_ai_err.txt");
        errFile.open("w");
        errFile.writeln("ERRO: " + errSave.message);
        errFile.close();
    }
}

main();
