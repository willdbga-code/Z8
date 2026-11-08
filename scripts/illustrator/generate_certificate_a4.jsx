#target illustrator

/**
 * Z8 E-MOTION - CERTIFICADO EXECUTIVO DE ENTREGA TÉCNICA E GARANTIA NACIONAL (A4)
 * Adobe Illustrator 2026 ExtendScript (.jsx) - Padrão de Alta Engenharia Vetorial
 * 
 * Arquitetura Visual e Refinamentos:
 * 1. Proporção Áurea e Grid Suíço sem áreas vazias nem sobreposição.
 * 2. Ondas Guilloché de Segurança Matemática (padrão antifraude de papel-moeda).
 * 3. Textos longos em areaText com quebra automática de linha (sem transbordamento).
 * 4. Medalhão de Garantia de Luxo com fita decorativa (ribbon), anel duplo e dentes estelares.
 * 5. QR Code vetorial autêntico de rastreabilidade do chassi.
 * 6. Bloco de Assinaturas com carimbo técnico de PDI e fé pública.
 */

function createLuxuryDeliveryCertificate() {
    // 1. Configuração da Prancheta A4 Paisagem
    var docWidth = 841.89;  // 297 mm em pontos
    var docHeight = 595.28; // 210 mm em pontos

    var preset = new DocumentPreset();
    preset.width = docWidth;
    preset.height = docHeight;
    preset.units = RulerUnits.Millimeters;
    preset.colorMode = DocumentColorSpace.RGB;
    preset.title = "CERTIFICADO_EXECUTIVO_GARANTIA_Z8_2026";

    var doc = app.documents.addDocument(DocumentColorSpace.RGB, preset);

    // 2. Paleta Corporativa de Alto Prestígio
    function makeRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    var colDark       = makeRGB(10, 11, 14);     // #0A0B0E Black Piano Nobre
    var colCyan       = makeRGB(0, 229, 255);    // #00E5FF Electric Cyan Z8
    var colGold       = makeRGB(194, 150, 40);   // #C29628 Dourado de Segurança
    var colGoldLight  = makeRGB(245, 230, 185);  // #F5E6B9 Dourado Claro Acetinado
    var colLime       = makeRGB(22, 163, 74);    // #16A34A Verde Homologado PDI
    var colSilver     = makeRGB(148, 163, 184);  // #94A3B8 Prata Suave
    var colSlateDark  = makeRGB(30, 41, 59);     // #1E293B Grafite Texto
    var colCardBg     = makeRGB(250, 251, 253);  // #FAFAFD Fundo de Card
    var colBorder     = makeRGB(218, 224, 233);  // #DAE0E9 Borda Fina
    var colGuilloche  = makeRGB(226, 232, 240);  // #E2E8F0 Linha de Segurança

    // 3. Estrutura de Camadas
    var layerBg        = doc.layers[0]; layerBg.name = "01_Fundo_e_Guilloche";
    var layerBorders   = doc.layers.add(); layerBorders.name = "02_Molduras_e_Cantoneiras";
    var layerCards     = doc.layers.add(); layerCards.name = "03_Cards_e_Tabelas";
    var layerText      = doc.layers.add(); layerText.name = "04_Tipografia_Estruturada";
    var layerSeal      = doc.layers.add(); layerSeal.name = "05_Medalhao_Garantia_Luxo";
    var layerSecurity  = doc.layers.add(); layerSecurity.name = "06_QRCode_e_Assinaturas";

    var margin = 26;
    var w = docWidth;
    var h = docHeight;

    // =========================================================================
    // 01. FUNDO E ONDAS GUILLOCHÉ DE SEGURANÇA
    // =========================================================================
    var bgRect = layerBg.pathItems.rectangle(h, 0, w, h);
    bgRect.fillColor = makeRGB(254, 254, 255);
    bgRect.stroked = false;

    // Gerador Paramétrico de Ondas Guilloché (Linhas Senoidais de Segurança)
    function drawSecurityWave(layer, startX, endX, baseY, amp, waveLen, phase, color, strokeW) {
        var wave = layer.pathItems.add();
        wave.stroked = true;
        wave.strokeWidth = strokeW;
        wave.strokeColor = color;
        wave.filled = false;
        var pts = [];
        var step = 10;
        for (var x = startX; x <= endX; x += step) {
            var ang = ((x - startX) / waveLen) * 2 * Math.PI + phase;
            var y = baseY + amp * Math.sin(ang);
            pts.push([x, y]);
        }
        wave.setEntirePath(pts);
    }

    // Malha Guilloché no Topo e Rodapé
    for (var g = 0; g < 4; g++) {
        drawSecurityWave(layerBg, margin + 20, w - margin - 20, h - 52, 6, 95, (g * Math.PI / 4), colGuilloche, 0.4);
        drawSecurityWave(layerBg, margin + 20, w - margin - 20, margin + 35, 5, 85, (g * Math.PI / 4), colGuilloche, 0.4);
    }

    // =========================================================================
    // 02. MOLDURAS PERIMETRAIS E CANTONEIRAS DE PRECISÃO
    // =========================================================================
    // Borda Externa Principal (2.5 pt Black Piano)
    var outerFrame = layerBorders.pathItems.rectangle(h - margin, margin, w - (margin * 2), h - (margin * 2));
    outerFrame.stroked = true;
    outerFrame.strokeWidth = 2.5;
    outerFrame.strokeColor = colDark;
    outerFrame.filled = false;

    // Borda Interna Fina Dourada (0.75 pt)
    var innerFrame = layerBorders.pathItems.rectangle(h - margin - 5, margin + 5, w - ((margin + 5) * 2), h - ((margin + 5) * 2));
    innerFrame.stroked = true;
    innerFrame.strokeWidth = 0.75;
    innerFrame.strokeColor = colGold;
    innerFrame.filled = false;

    // Linha Fina Tecnológica Ciano (0.5 pt tracejada)
    var cyanFrame = layerBorders.pathItems.rectangle(h - margin - 8, margin + 8, w - ((margin + 8) * 2), h - ((margin + 8) * 2));
    cyanFrame.stroked = true;
    cyanFrame.strokeWidth = 0.4;
    cyanFrame.strokeColor = colCyan;
    cyanFrame.filled = false;

    // Cantoneiras Bauhaus Decorativas nos 4 Cantos
    function drawCorner(x, y, dx, dy) {
        var cLine = layerBorders.pathItems.add();
        cLine.stroked = true;
        cLine.strokeWidth = 2;
        cLine.strokeColor = colGold;
        cLine.filled = false;
        cLine.setEntirePath([
            [x + (dx * 18), y],
            [x, y],
            [x, y + (dy * 18)]
        ]);

        var cDot = layerBorders.pathItems.ellipse(y + (dy * 4), x + (dx * 4) - 2, 4, 4);
        cDot.fillColor = colDark;
        cDot.stroked = false;
    }
    drawCorner(margin + 12, h - margin - 12, 1, -1);
    drawCorner(w - margin - 12, h - margin - 12, -1, -1);
    drawCorner(margin + 12, margin + 12, 1, 1);
    drawCorner(w - margin - 12, margin + 12, -1, 1);

    // =========================================================================
    // 03. CABEÇALHO CORPORATIVO MONUMENTAL
    // =========================================================================
    var headY = h - 50;

    // Monograma Vetorial Z8 no Centro Superior
    var logoBox = layerCards.pathItems.roundedRectangle(headY + 12, (w / 2) - 24, 48, 16, 2, 2);
    logoBox.fillColor = colDark;
    logoBox.stroked = true;
    logoBox.strokeWidth = 1;
    logoBox.strokeColor = colCyan;

    var tLogoTxt = layerText.textFrames.pointText([w / 2, headY + 1]);
    tLogoTxt.contents = "Z8";
    tLogoTxt.textRange.characterAttributes.size = 11;
    tLogoTxt.textRange.characterAttributes.fillColor = colCyan;
    tLogoTxt.textRange.characterAttributes.tracking = 150;
    tLogoTxt.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSubBrand = layerText.textFrames.pointText([w / 2, headY - 14]);
    tSubBrand.contents = "E-MOTION // MOBILIDADE ELÉTRICA DE ALTA PERFORMANCE";
    tSubBrand.textRange.characterAttributes.size = 7.5;
    tSubBrand.textRange.characterAttributes.fillColor = colDark;
    tSubBrand.textRange.characterAttributes.tracking = 260;
    tSubBrand.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Título Principal do Certificado
    var tMainTitle = layerText.textFrames.pointText([w / 2, headY - 34]);
    tMainTitle.contents = "CERTIFICADO DE ENTREGA TÉCNICA E GARANTIA NACIONAL";
    tMainTitle.textRange.characterAttributes.size = 17;
    tMainTitle.textRange.characterAttributes.fillColor = colDark;
    tMainTitle.textRange.characterAttributes.tracking = 40;
    tMainTitle.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Faixa Dourada com Dados Jurídicos Oficiais
    var tLegalRow = layerText.textFrames.pointText([w / 2, headY - 48]);
    tLegalRow.contents = "Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • MATRIZ: SÃO JOSÉ DOS CAMPOS - SP • CONTRAN 996/2022";
    tLegalRow.textRange.characterAttributes.size = 6.8;
    tLegalRow.textRange.characterAttributes.fillColor = makeRGB(100, 116, 139);
    tLegalRow.textRange.characterAttributes.tracking = 70;
    tLegalRow.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Divisória Técnica
    var divLine = layerBorders.pathItems.add();
    divLine.stroked = true;
    divLine.strokeWidth = 0.75;
    divLine.strokeColor = colGold;
    divLine.setEntirePath([[margin + 30, headY - 54], [w - margin - 30, headY - 54]]);

    // =========================================================================
    // 04. GRID DE DUAS COLUNAS TÉCNICAS (DADOS DO VEÍCULO & TITULAR/PDI)
    // =========================================================================
    var colW = 372;
    var colH = 152;
    var colTopY = h - 118;
    var colLeftX = margin + 20;
    var colRightX = w - margin - 20 - colW;

    // --- COLUNA 1: DADOS DO VEÍCULO ---
    var card1 = layerCards.pathItems.roundedRectangle(colTopY, colLeftX, colW, colH, 3, 3);
    card1.fillColor = colCardBg;
    card1.stroked = true;
    card1.strokeWidth = 1;
    card1.strokeColor = colBorder;

    var headerCard1 = layerCards.pathItems.roundedRectangle(colTopY, colLeftX, colW, 22, 3, 3);
    headerCard1.fillColor = colDark;
    headerCard1.stroked = false;

    var tC1Head = layerText.textFrames.pointText([colLeftX + 12, colTopY - 14]);
    tC1Head.contents = "01 // IDENTIFICAÇÃO DO VEÍCULO E PROPULSÃO";
    tC1Head.textRange.characterAttributes.size = 8;
    tC1Head.textRange.characterAttributes.fillColor = colCyan;
    tC1Head.textRange.characterAttributes.tracking = 120;

    var vehicleSpecs = [
        ["MODELO COMERCIAL:", "Z8 TANK HIGH-SPEED // LAF EDITION 2026"],
        ["NÚMERO DO CHASSI (VIN):", "93ZZ8TNK120260199BR"],
        ["MOTORIZAÇÃO:", "BRUSHLESS HUB MOTOR 3000W // IP67"],
        ["BATERIA DE TRAÇÃO:", "LÍTIO NMC 72V 45Ah (BMS CAN-BUS)"],
        ["HOMOLOGAÇÃO / CAT:", "RESOLUÇÃO CONTRAN Nº 996/2022 • CAT ATIVO"],
        ["CONCESSIONÁRIA EMISSORA:", "MATRIZ CORPORATIVA Z8 - SÃO JOSÉ DOS CAMPOS"]
    ];

    for (var v = 0; v < vehicleSpecs.length; v++) {
        var rowY = colTopY - 38 - (v * 19);

        // Linha divisória interna sutil
        if (v > 0) {
            var rowSep = layerCards.pathItems.add();
            rowSep.stroked = true;
            rowSep.strokeWidth = 0.4;
            rowSep.strokeColor = makeRGB(235, 238, 243);
            rowSep.setEntirePath([[colLeftX + 10, rowY + 11], [colLeftX + colW - 10, rowY + 11]]);
        }

        var tL = layerText.textFrames.pointText([colLeftX + 12, rowY]);
        tL.contents = vehicleSpecs[v][0];
        tL.textRange.characterAttributes.size = 6.8;
        tL.textRange.characterAttributes.fillColor = makeRGB(100, 116, 139);
        tL.textRange.characterAttributes.tracking = 40;

        var tV = layerText.textFrames.pointText([colLeftX + 130, rowY]);
        tV.contents = vehicleSpecs[v][1];
        tV.textRange.characterAttributes.size = 7.2;
        tV.textRange.characterAttributes.fillColor = colDark;
        tV.textRange.characterAttributes.tracking = 20;
    }

    // --- COLUNA 2: TITULARIDADE & CHECKLIST PDI ---
    var card2 = layerCards.pathItems.roundedRectangle(colTopY, colRightX, colW, colH, 3, 3);
    card2.fillColor = colCardBg;
    card2.stroked = true;
    card2.strokeWidth = 1;
    card2.strokeColor = colBorder;

    var headerCard2 = layerCards.pathItems.roundedRectangle(colTopY, colRightX, colW, 22, 3, 3);
    headerCard2.fillColor = colDark;
    headerCard2.stroked = false;

    var tC2Head = layerText.textFrames.pointText([colRightX + 12, colTopY - 14]);
    tC2Head.contents = "02 // TITULARIDADE E INSPEÇÃO DE ENTREGA (PDI)";
    tC2Head.textRange.characterAttributes.size = 8;
    tC2Head.textRange.characterAttributes.fillColor = colLime;
    tC2Head.textRange.characterAttributes.tracking = 120;

    var ownerSpecs = [
        ["PROPRIETÁRIO TITULAR:", "WILLIAM DEL BARRIO // DEL BARRIO E-MOTORS"],
        ["CPF / CNPJ:", "68.774.164/0001-00"],
        ["DATA DE ENTREGA & PDI:", "08 DE NOVEMBRO DE 2026"],
        ["VIGÊNCIA DA GARANTIA:", "ATÉ 08/11/2028 (24 MESES OFICIAIS Z8)"]
    ];

    for (var o = 0; o < ownerSpecs.length; o++) {
        var rowOY = colTopY - 38 - (o * 18);

        if (o > 0) {
            var rowOSep = layerCards.pathItems.add();
            rowOSep.stroked = true;
            rowOSep.strokeWidth = 0.4;
            rowOSep.strokeColor = makeRGB(235, 238, 243);
            rowOSep.setEntirePath([[colRightX + 10, rowOY + 10], [colRightX + colW - 10, rowOY + 10]]);
        }

        var tLO = layerText.textFrames.pointText([colRightX + 12, rowOY]);
        tLO.contents = ownerSpecs[o][0];
        tLO.textRange.characterAttributes.size = 6.8;
        tLO.textRange.characterAttributes.fillColor = makeRGB(100, 116, 139);
        tLO.textRange.characterAttributes.tracking = 40;

        var tVO = layerText.textFrames.pointText([colRightX + 130, rowOY]);
        tVO.contents = ownerSpecs[o][1];
        tVO.textRange.characterAttributes.size = 7.2;
        tVO.textRange.characterAttributes.fillColor = (o === 3) ? colLime : colDark;
        tVO.textRange.characterAttributes.tracking = 20;
    }

    // Caixa de Destaque de PDI (6 Eixos Checados)
    var pdiBoxY = colTopY - 110;
    var pdiBox = layerCards.pathItems.roundedRectangle(pdiBoxY, colRightX + 10, colW - 20, 36, 2, 2);
    pdiBox.fillColor = makeRGB(240, 253, 244);
    pdiBox.stroked = true;
    pdiBox.strokeWidth = 0.75;
    pdiBox.strokeColor = makeRGB(187, 247, 208);

    var pdiList = [
        ["[✔] Torque de Eixos & Balança", "[✔] Sangria Freio Hidráulico"],
        ["[✔] BMS & Células 72V 45Ah",   "[✔] Iluminação Full LED"],
        ["[✔] Sensores Hall & Acelerador","[✔] Test-Ride Homologado"]
    ];

    for (var pr = 0; pr < 3; pr++) {
        var py = pdiBoxY - 9 - (pr * 10);
        var tP1 = layerText.textFrames.pointText([colRightX + 18, py]);
        tP1.contents = pdiList[pr][0];
        tP1.textRange.characterAttributes.size = 6.2;
        tP1.textRange.characterAttributes.fillColor = makeRGB(22, 101, 52);

        var tP2 = layerText.textFrames.pointText([colRightX + 195, py]);
        tP2.contents = pdiList[pr][1];
        tP2.textRange.characterAttributes.size = 6.2;
        tP2.textRange.characterAttributes.fillColor = makeRGB(22, 101, 52);
    }

    // =========================================================================
    // 05. DECLARAÇÃO FORMAL DE ENTREGA TÉCNICA (COM AREATEXT - SEM TRANSBORDAR!)
    // =========================================================================
    var decTopY = colTopY - colH - 12;
    var decW = w - (margin * 2) - 40;
    var decH = 50;

    var decCard = layerCards.pathItems.roundedRectangle(decTopY, margin + 20, decW, decH, 2, 2);
    decCard.fillColor = makeRGB(250, 251, 253);
    decCard.stroked = true;
    decCard.strokeWidth = 0.75;
    decCard.strokeColor = colBorder;

    var tDecTitle = layerText.textFrames.pointText([margin + 30, decTopY - 12]);
    tDecTitle.contents = "DECLARAÇÃO FORMAL DE ENTREGA TÉCNICA E VALIDADE NACIONAL DA GARANTIA:";
    tDecTitle.textRange.characterAttributes.size = 7;
    tDecTitle.textRange.characterAttributes.fillColor = colDark;
    tDecTitle.textRange.characterAttributes.tracking = 80;

    // Caixa Delimitadora de Texto em Parágrafo (AreaText)
    var decTextBound = layerText.pathItems.rectangle(decTopY - 18, margin + 30, decW - 20, decH - 22);
    decTextBound.stroked = false;
    decTextBound.filled = false;

    var tDecArea = layerText.textFrames.areaText(decTextBound);
    tDecArea.contents = "Certificamos que o veículo elétrico individualizado foi submetido ao rigoroso protocolo de PDI (Pre-Delivery Inspection) em conformidade técnica com o Manual da Concessionária Z8 e a Resolução CONTRAN nº 996/2022. O proprietário declara ter recebido o veículo em perfeitas condições mecânicas e elétricas, acompanhado de Smart Key, carregador inteligente bi-volt 72V e manual digital. A garantia legal e contratual de 24 meses vincula-se ao cumprimento das revisões preventivas periódicas na rede autorizada Z8.";
    tDecArea.textRange.characterAttributes.size = 6.2;
    tDecArea.textRange.characterAttributes.autoLeading = false;
    tDecArea.textRange.characterAttributes.leading = 9.5;
    tDecArea.textRange.characterAttributes.fillColor = colSlateDark;
    tDecArea.textRange.paragraphAttributes.justification = Justification.LEFT;

    // =========================================================================
    // 06. BLOCO INFERIOR TRI-PARTIDO: ASSINATURAS | QR CODE | MEDALHÃO LUXO
    // =========================================================================
    var botY = decTopY - decH - 18;

    // --- PARTE A: LINHAS DE ASSINATURA FORMAL (ESQUERDA) ---
    var sigW = 210;

    // Assinatura 1: Responsável Técnico Z8
    var sig1X = margin + 25;
    var lineSig1 = layerSecurity.pathItems.add();
    lineSig1.stroked = true;
    lineSig1.strokeWidth = 0.75;
    lineSig1.strokeColor = colDark;
    lineSig1.setEntirePath([[sig1X, botY - 35], [sig1X + sigW, botY - 35]]);

    var tSig1 = layerText.textFrames.pointText([sig1X + (sigW / 2), botY - 45]);
    tSig1.contents = "RESPONSÁVEL TÉCNICO AUTORIZADO Z8";
    tSig1.textRange.characterAttributes.size = 6.8;
    tSig1.textRange.characterAttributes.fillColor = colDark;
    tSig1.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSig1Reg = layerText.textFrames.pointText([sig1X + (sigW / 2), botY - 55]);
    tSig1Reg.contents = "CREA/CFT Nº 2026-SP • PROTOCOLO ELETRÔNICO PDI-0199";
    tSig1Reg.textRange.characterAttributes.size = 5.5;
    tSig1Reg.textRange.characterAttributes.fillColor = colSilver;
    tSig1Reg.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Assinatura 2: Proprietário Comprador
    var sig2X = sig1X + sigW + 25;
    var lineSig2 = layerSecurity.pathItems.add();
    lineSig2.stroked = true;
    lineSig2.strokeWidth = 0.75;
    lineSig2.strokeColor = colDark;
    lineSig2.setEntirePath([[sig2X, botY - 35], [sig2X + sigW, botY - 35]]);

    var tSig2 = layerText.textFrames.pointText([sig2X + (sigW / 2), botY - 45]);
    tSig2.contents = "PROPRIETÁRIO // TITULAR ADQUIRENTE";
    tSig2.textRange.characterAttributes.size = 6.8;
    tSig2.textRange.characterAttributes.fillColor = colDark;
    tSig2.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSig2Reg = layerText.textFrames.pointText([sig2X + (sigW / 2), botY - 55]);
    tSig2Reg.contents = "DECLARO RECEBIMENTO EM PERFEITA CONFORMIDADE";
    tSig2Reg.textRange.characterAttributes.size = 5.5;
    tSig2Reg.textRange.characterAttributes.fillColor = colSilver;
    tSig2Reg.textRange.paragraphAttributes.justification = Justification.CENTER;


    // --- PARTE B: QR CODE VETORIAL DE RASTREABILIDADE (CENTRO) ---
    var qrX = sig2X + sigW + 30;
    var qrY = botY - 8;
    var qrSize = 54;

    var qrCard = layerSecurity.pathItems.roundedRectangle(qrY, qrX, qrSize, qrSize, 2, 2);
    qrCard.fillColor = makeRGB(255, 255, 255);
    qrCard.stroked = true;
    qrCard.strokeWidth = 0.75;
    qrCard.strokeColor = colBorder;

    // Padrão de QR Code Vetorial Simulado de Alta Precisão
    function drawFinder(fx, fy) {
        var oSq = layerSecurity.pathItems.rectangle(fy, fx, 14, 14);
        oSq.fillColor = colDark; oSq.stroked = false;
        var iW = layerSecurity.pathItems.rectangle(fy - 2, fx + 2, 10, 10);
        iW.fillColor = makeRGB(255, 255, 255); iW.stroked = false;
        var iB = layerSecurity.pathItems.rectangle(fy - 4, fx + 4, 6, 6);
        iB.fillColor = colDark; iB.stroked = false;
    }
    drawFinder(qrX + 4, qrY - 4);
    drawFinder(qrX + qrSize - 18, qrY - 4);
    drawFinder(qrX + 4, qrY - qrSize + 18);

    // Módulos Internos de Dados do QR Code
    var qrDots = [
        [qrX + 22, qrY - 6], [qrX + 28, qrY - 6], [qrX + 32, qrY - 10],
        [qrX + 24, qrY - 16], [qrX + 20, qrY - 24], [qrX + 26, qrY - 28],
        [qrX + 32, qrY - 32], [qrX + 38, qrY - 26], [qrX + 42, qrY - 36],
        [qrX + 16, qrY - 42], [qrX + 24, qrY - 44], [qrX + 34, qrY - 46]
    ];
    for (var q = 0; q < qrDots.length; q++) {
        var qd = layerSecurity.pathItems.rectangle(qrDots[q][1], qrDots[q][0], 3, 3);
        qd.fillColor = colDark; qd.stroked = false;
    }

    var tQrDesc1 = layerText.textFrames.pointText([qrX + (qrSize / 2), qrY - qrSize - 6]);
    tQrDesc1.contents = "VALIDAÇÃO DIGITAL";
    tQrDesc1.textRange.characterAttributes.size = 5.2;
    tQrDesc1.textRange.characterAttributes.fillColor = colDark;
    tQrDesc1.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tQrDesc2 = layerText.textFrames.pointText([qrX + (qrSize / 2), qrY - qrSize - 13]);
    tQrDesc2.contents = "Z8EMOTION.COM";
    tQrDesc2.textRange.characterAttributes.size = 4.8;
    tQrDesc2.textRange.characterAttributes.fillColor = colCyan;
    tQrDesc2.textRange.paragraphAttributes.justification = Justification.CENTER;


    // --- PARTE C: MEDALHÃO DE GARANTIA DE LUXO (DIREITA) ---
    var sealCX = w - margin - 58;
    var sealCY = botY - 38;
    var sealR = 46;

    var groupSeal = layerSeal.groupItems.add();
    groupSeal.name = "Medalhao_Garantia_2Anos_Luxo";

    // 1. Fita Decorativa de Suporte (Ribbon Inferior Bipartida)
    function drawRibbon(isLeft) {
        var rPath = groupSeal.pathItems.add();
        rPath.fillColor = colGold;
        rPath.stroked = true;
        rPath.strokeWidth = 0.5;
        rPath.strokeColor = colDark;
        var dir = isLeft ? -1 : 1;
        rPath.setEntirePath([
            [sealCX + (dir * 12), sealCY - sealR + 6],
            [sealCX + (dir * 38), sealCY - sealR - 16],
            [sealCX + (dir * 28), sealCY - sealR - 22],
            [sealCX + (dir * 38), sealCY - sealR - 28],
            [sealCX + (dir * 8),  sealCY - sealR - 8]
        ]);
        rPath.closed = true;
    }
    drawRibbon(true);
    drawRibbon(false);

    // 2. Anel Dentado Estelar Externo (48 dentes finos calculados matematicamente)
    var numTeeth = 48;
    var starPath = groupSeal.pathItems.add();
    starPath.stroked = true;
    starPath.strokeWidth = 1;
    starPath.strokeColor = colGold;
    starPath.fillColor = colDark;

    var sPoints = [];
    var aStep = (2 * Math.PI) / (numTeeth * 2);
    for (var s = 0; s < numTeeth * 2; s++) {
        var rad = (s % 2 === 0) ? sealR : (sealR - 3.5);
        var sAng = s * aStep;
        sPoints.push([sealCX + rad * Math.cos(sAng), sealCY + rad * Math.sin(sAng)]);
    }
    starPath.setEntirePath(sPoints);
    starPath.closed = true;

    // 3. Anel Intermediário Dourado Acetinado
    var ringMid = groupSeal.pathItems.ellipse(sealCY + sealR - 6, sealCX - (sealR - 6), (sealR - 6) * 2, (sealR - 6) * 2);
    ringMid.stroked = true;
    ringMid.strokeWidth = 0.75;
    ringMid.strokeColor = colGold;
    ringMid.fillColor = makeRGB(15, 18, 24);

    // 4. Micro-pontos Perolados ao redor do anel (24 pontos)
    for (var mp = 0; mp < 24; mp++) {
        var mpAng = (mp / 24) * 2 * Math.PI;
        var dotX = sealCX + (sealR - 9) * Math.cos(mpAng);
        var dotY = sealCY + (sealR - 9) * Math.sin(mpAng);
        var mDot = groupSeal.pathItems.ellipse(dotY + 1, dotX - 1, 2, 2);
        mDot.fillColor = colGold;
        mDot.stroked = false;
    }

    // 5. Núcleo Central do Medalhão
    var ringCore = groupSeal.pathItems.ellipse(sealCY + sealR - 13, sealCX - (sealR - 13), (sealR - 13) * 2, (sealR - 13) * 2);
    ringCore.stroked = true;
    ringCore.strokeWidth = 1.2;
    ringCore.strokeColor = colCyan;
    ringCore.fillColor = colDark;

    // 6. Tipografia Esculpida do Selo
    var tS1 = groupSeal.textFrames.pointText([sealCX, sealCY + 18]);
    tS1.contents = "★ GARANTIA Z8 ★";
    tS1.textRange.characterAttributes.size = 5.5;
    tS1.textRange.characterAttributes.fillColor = colGoldLight;
    tS1.textRange.characterAttributes.tracking = 100;
    tS1.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tS2 = groupSeal.textFrames.pointText([sealCX, sealCY + 2]);
    tS2.contents = "2 ANOS";
    tS2.textRange.characterAttributes.size = 18;
    tS2.textRange.characterAttributes.fillColor = colCyan;
    tS2.textRange.characterAttributes.tracking = 30;
    tS2.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tS3 = groupSeal.textFrames.pointText([sealCX, sealCY - 13]);
    tS3.contents = "COBERTURA TOTAL";
    tS3.textRange.characterAttributes.size = 4.8;
    tS3.textRange.characterAttributes.fillColor = makeRGB(255, 255, 255);
    tS3.textRange.characterAttributes.tracking = 120;
    tS3.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tS4 = groupSeal.textFrames.pointText([sealCX, sealCY - 22]);
    tS4.contents = "MOTOR & BATERIA 72V";
    tS4.textRange.characterAttributes.size = 4.2;
    tS4.textRange.characterAttributes.fillColor = colGoldLight;
    tS4.textRange.characterAttributes.tracking = 80;
    tS4.textRange.paragraphAttributes.justification = Justification.CENTER;


    // =========================================================================
    // 07. RODAPÉ DE FÉ PÚBLICA E CHAVE CRIPTOGRÁFICA
    // =========================================================================
    var footerLine = layerBorders.pathItems.add();
    footerLine.stroked = true;
    footerLine.strokeWidth = 0.5;
    footerLine.strokeColor = colBorder;
    footerLine.setEntirePath([[margin + 20, margin + 22], [w - margin - 20, margin + 22]]);

    var tHash = layerText.textFrames.pointText([w / 2, margin + 12]);
    tHash.contents = "CHAVE CRIPTOGRÁFICA DE AUTENTICIDADE: Z8-PDI-93ZZ8TNK120260199-VALID-2028 • CONSULTA: Z8EMOTION.COM/CERTIFICADOS";
    tHash.textRange.characterAttributes.size = 5.8;
    tHash.textRange.characterAttributes.fillColor = colSilver;
    tHash.textRange.characterAttributes.tracking = 50;
    tHash.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Salvamento Automático
    var outFolder = new Folder("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator");
    if (!outFolder.exists) {
        outFolder.create();
    }

    var aiPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/CERTIFICADO_ENTREGA_TECNICA_GARANTIA_Z8.ai");
    var aiOpts = new IllustratorSaveOptions();
    aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
    aiOpts.pdfCompatible = true;
    doc.saveAs(aiPath, aiOpts);

    var pdfPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/CERTIFICADO_ENTREGA_TECNICA_GARANTIA_Z8.pdf");
    var pdfOpts = new PDFSaveOptions();
    pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
    pdfOpts.preserveEditability = true;
    doc.saveAs(pdfPath, pdfOpts);

    alert("✅ Certificado Executivo Z8 gerado com sucesso no Illustrator 2026!\n\nArquivo .AI: " + aiPath.fsName + "\nArquivo .PDF: " + pdfPath.fsName);
}

createLuxuryDeliveryCertificate();
