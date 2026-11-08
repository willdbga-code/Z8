#target illustrator

/**
 * Z8 E-MOTION - CERTIFICADO OFICIAL DE ENTREGA TÉCNICA E GARANTIA NACIONAL
 * Adobe Illustrator 2026 ExtendScript (.jsx)
 * 
 * Gera documento A4 Paisagem de altíssimo padrão executivo e segurança jurídica:
 * - Moldura de precisão técnica Bauhaus com cantoneiras de segurança
 * - Dados corporativos harmonizados da Z8 EMOTION LTDA. (São José dos Campos - SP)
 * - Tabela de telemetria do veículo (Chassi VIN, Motor, Bateria 72V, BMS)
 * - Checklist de PDI (Inspeção Pré-Entrega) de 6 eixos operacionais
 * - Selo vetorial de Garantia 2 Anos embutido
 * - Linhas formais de assinatura com fé pública comercial
 */

function createDeliveryCertificate() {
    var preset = new DocumentPreset();
    preset.width = 841.89; // 297mm (A4 Paisagem)
    preset.height = 595.28; // 210mm
    preset.units = RulerUnits.Millimeters;
    preset.colorMode = DocumentColorSpace.RGB;
    preset.title = "CERTIFICADO_ENTREGA_TECNICA_GARANTIA_Z8";

    var doc = app.documents.addDocument(DocumentColorSpace.RGB, preset);

    function getRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    // Paleta Corporativa Oficial Z8
    var colDark       = getRGB(10, 11, 14);     // #0A0B0E Black Piano
    var colCyan       = getRGB(0, 229, 255);    // #00E5FF Electric Cyan
    var colLime       = getRGB(34, 197, 94);    // #22C55E Lime Accent
    var colSilver     = getRGB(194, 198, 202);  // #C2C6CA Platinum Grey
    var colSlateDark  = getRGB(30, 41, 59);     // #1E293B Deep Slate
    var colCardBg     = getRGB(248, 250, 252);  // #F8FAFC Clean White Card
    var colBorder     = getRGB(203, 213, 225);  // #CBD5E1 Technical Line
    var colGold       = getRGB(194, 150, 40);   // #C29628 Security Gold

    // Criação de Camadas
    var layerBg       = doc.layers[0]; layerBg.name = "01_Fundo_e_Moldura";
    var layerBorders  = doc.layers.add(); layerBorders.name = "02_Guilherme_Seguranca";
    var layerCards    = doc.layers.add(); layerCards.name = "03_Blocos_Dados";
    var layerText     = doc.layers.add(); layerText.name = "04_Tipografia_Certificado";
    var layerSeal     = doc.layers.add(); layerSeal.name = "05_Selo_Garantia_Vetorial";

    var w = doc.width;
    var h = doc.height;
    var margin = 28;

    // 1. Fundo Branco Acetinado Premium
    var bgRect = layerBg.pathItems.rectangle(h, 0, w, h);
    bgRect.fillColor = getRGB(253, 253, 254);
    bgRect.stroked = false;

    // 2. Moldura de Segurança Externa Dupla
    var outerFrame = layerBorders.pathItems.rectangle(h - margin, margin, w - (margin * 2), h - (margin * 2));
    outerFrame.stroked = true;
    outerFrame.strokeWidth = 2.5;
    outerFrame.strokeColor = colDark;
    outerFrame.fillColor = getRGB(255, 255, 255);

    var innerFrame = layerBorders.pathItems.rectangle(h - margin - 5, margin + 5, w - ((margin + 5) * 2), h - ((margin + 5) * 2));
    innerFrame.stroked = true;
    innerFrame.strokeWidth = 0.75;
    innerFrame.strokeColor = colCyan;
    innerFrame.filled = false;

    // Cantoneiras Bauhaus de Precisão
    function drawCorner(x, y, dx, dy) {
        var cLine = layerBorders.pathItems.add();
        cLine.stroked = true;
        cLine.strokeWidth = 2;
        cLine.strokeColor = colCyan;
        cLine.filled = false;
        cLine.setEntirePath([
            [x + (dx * 18), y],
            [x, y],
            [x, y + (dy * 18)]
        ]);
    }
    drawCorner(margin + 9, h - margin - 9, 1, -1);
    drawCorner(w - margin - 9, h - margin - 9, -1, -1);
    drawCorner(margin + 9, margin + 9, 1, 1);
    drawCorner(w - margin - 9, margin + 9, -1, 1);

    // =========================================================================
    // CABEÇALHO CORPORATIVO
    // =========================================================================
    var headerY = h - 55;

    // Faixa Superior de Marca
    var bar = layerBorders.pathItems.rectangle(headerY + 8, margin + 15, w - ((margin + 15) * 2), 2);
    bar.fillColor = colCyan;
    bar.stroked = false;

    var tLogo = layerText.textFrames.pointText([w / 2, headerY - 5]);
    tLogo.contents = "Z8 E-MOTION // ELECTRIC MOBILITY";
    tLogo.textRange.characterAttributes.size = 13;
    tLogo.textRange.characterAttributes.fillColor = colDark;
    tLogo.textRange.characterAttributes.tracking = 250;
    tLogo.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tTitle = layerText.textFrames.pointText([w / 2, headerY - 26]);
    tTitle.contents = "CERTIFICADO DE ENTREGA TÉCNICA E GARANTIA NACIONAL";
    tTitle.textRange.characterAttributes.size = 18;
    tTitle.textRange.characterAttributes.fillColor = colDark;
    tTitle.textRange.characterAttributes.tracking = 60;
    tTitle.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tLegal = layerText.textFrames.pointText([w / 2, headerY - 42]);
    tLegal.contents = "Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • SÃO JOSÉ DOS CAMPOS - SP • HOMOLOGAÇÃO CONTRAN 996";
    tLegal.textRange.characterAttributes.size = 7.5;
    tLegal.textRange.characterAttributes.fillColor = getRGB(100, 116, 139);
    tLegal.textRange.characterAttributes.tracking = 90;
    tLegal.textRange.paragraphAttributes.justification = Justification.CENTER;

    // =========================================================================
    // SEÇÃO 1: BLOCO ESQUERDO (DADOS DO VEÍCULO E TELEMETRIA TÉCNICA)
    // =========================================================================
    var boxLeftX = margin + 20;
    var boxW = 360;
    var boxTopY = h - 130;
    var boxH = 145;

    var card1 = layerCards.pathItems.roundedRectangle(boxTopY, boxLeftX, boxW, boxH, 4, 4);
    card1.fillColor = colCardBg;
    card1.stroked = true;
    card1.strokeWidth = 1;
    card1.strokeColor = colBorder;

    var card1Header = layerCards.pathItems.roundedRectangle(boxTopY, boxLeftX, boxW, 24, 4, 4);
    card1Header.fillColor = colDark;
    card1Header.stroked = false;

    var tCard1H = layerText.textFrames.pointText([boxLeftX + 12, boxTopY - 16]);
    tCard1H.contents = "01 // IDENTIFICAÇÃO DO VEÍCULO E PROPULSÃO";
    tCard1H.textRange.characterAttributes.size = 8.5;
    tCard1H.textRange.characterAttributes.fillColor = colCyan;
    tCard1H.textRange.characterAttributes.tracking = 120;

    // Linhas de Dados do Veículo
    var fieldsV = [
        ["MODELO COMERCIAL:", "Z8 TANK HIGH-SPEED // LAF EDITION 2026"],
        ["NÚMERO DO CHASSI (VIN):", "93ZZ8TNK120260199BR"],
        ["MOTORIZAÇÃO:", "BRUSHLESS HUB MOTOR 3000W // IP67"],
        ["BATERIA DE TRAÇÃO:", "LÍTIO NMC 72V 45Ah (BMS INTELIGENTE CAN-BUS)"],
        ["HOMOLOGAÇÃO:", "RESOLUÇÃO CONTRAN Nº 996/2022 (CAT/CCT ATIVO)"],
        ["CONCESSIONÁRIA EMISSORA:", "MATRIZ CORPORATIVA Z8 - SÃO JOSÉ DOS CAMPOS"]
    ];

    for (var f = 0; f < fieldsV.length; f++) {
        var rowY = boxTopY - 42 - (f * 18);
        
        var tLabel = layerText.textFrames.pointText([boxLeftX + 12, rowY]);
        tLabel.contents = fieldsV[f][0];
        tLabel.textRange.characterAttributes.size = 7;
        tLabel.textRange.characterAttributes.fillColor = getRGB(100, 116, 139);
        tLabel.textRange.characterAttributes.tracking = 60;

        var tVal = layerText.textFrames.pointText([boxLeftX + 130, rowY]);
        tVal.contents = fieldsV[f][1];
        tVal.textRange.characterAttributes.size = 7.5;
        tVal.textRange.characterAttributes.fillColor = colDark;
        tVal.textRange.characterAttributes.tracking = 40;
    }

    // =========================================================================
    // SEÇÃO 2: BLOCO DIREITO (DADOS DO TITULAR E PROTOCOLO PDI)
    // =========================================================================
    var boxRightX = w - margin - 20 - boxW;

    var card2 = layerCards.pathItems.roundedRectangle(boxTopY, boxRightX, boxW, boxH, 4, 4);
    card2.fillColor = colCardBg;
    card2.stroked = true;
    card2.strokeWidth = 1;
    card2.strokeColor = colBorder;

    var card2Header = layerCards.pathItems.roundedRectangle(boxTopY, boxRightX, boxW, 24, 4, 4);
    card2Header.fillColor = colDark;
    card2Header.stroked = false;

    var tCard2H = layerText.textFrames.pointText([boxRightX + 12, boxTopY - 16]);
    tCard2H.contents = "02 // TITULARIDADE E INSPEÇÃO DE ENTREGA (PDI)";
    tCard2H.textRange.characterAttributes.size = 8.5;
    tCard2H.textRange.characterAttributes.fillColor = colLime;
    tCard2H.textRange.characterAttributes.tracking = 120;

    var fieldsT = [
        ["PROPRIETÁRIO TITULAR:", "WILLIAM DEL BARRIO // DEL BARRIO E-MOTORS"],
        ["CPF / CNPJ:", "68.774.164/0001-00"],
        ["DATA DE ENTREGA & PDI:", "08 DE NOVEMBRO DE 2026"],
        ["VIGÊNCIA DA GARANTIA:", "ATÉ 08/11/2028 (24 MESES OFICIAIS Z8)"]
    ];

    for (var ft = 0; ft < fieldsT.length; ft++) {
        var rowTY = boxTopY - 42 - (ft * 18);
        
        var tLabelT = layerText.textFrames.pointText([boxRightX + 12, rowTY]);
        tLabelT.contents = fieldsT[ft][0];
        tLabelT.textRange.characterAttributes.size = 7;
        tLabelT.textRange.characterAttributes.fillColor = getRGB(100, 116, 139);
        tLabelT.textRange.characterAttributes.tracking = 60;

        var tValT = layerText.textFrames.pointText([boxRightX + 130, rowTY]);
        tValT.contents = fieldsT[ft][1];
        tValT.textRange.characterAttributes.size = 7.5;
        tValT.textRange.characterAttributes.fillColor = colDark;
        tValT.textRange.characterAttributes.tracking = 40;
    }

    // Grid de Inspeção Técnica PDI (Checkmarks 100% Ok)
    var pdiGridY = boxTopY - 118;
    var pdiChecks = [
        "[X] Torque de Eixos & Balança",
        "[X] Sangria e Freios Hidráulicos",
        "[X] Calibração de BMS 72V",
        "[X] Iluminação Full LED & Faróis",
        "[X] Sensores Hall e Mapeamento",
        "[X] Test-Ride Dinâmico Aprovado"
    ];

    for (var c = 0; c < pdiChecks.length; c++) {
        var colIdx = c % 2;
        var rowIdx = Math.floor(c / 2);
        var cx = boxRightX + 12 + (colIdx * 175);
        var cy = pdiGridY - (rowIdx * 12);

        var tCheck = layerText.textFrames.pointText([cx, cy]);
        tCheck.contents = pdiChecks[c];
        tCheck.textRange.characterAttributes.size = 6.5;
        tCheck.textRange.characterAttributes.fillColor = getRGB(22, 101, 52); // Dark Green
        tCheck.textRange.characterAttributes.tracking = 30;
    }

    // =========================================================================
    // SEÇÃO 3: TERMO DE DECLARAÇÃO LEGAL (BASE CDC E LEI DE FRANQUIAS)
    // =========================================================================
    var decY = boxTopY - boxH - 18;
    var decW = w - (margin * 2) - 40;

    var tDec = layerText.textFrames.pointText([margin + 20, decY]);
    tDec.contents = "DECLARAÇÃO FORMAL DE ENTREGA TÉCNICA E VALIDADE NACIONAL DA GARANTIA:";
    tDec.textRange.characterAttributes.size = 7.5;
    tDec.textRange.characterAttributes.fillColor = colDark;
    tDec.textRange.characterAttributes.tracking = 80;

    var tDecBody = layerText.textFrames.pointText([margin + 20, decY - 14]);
    tDecBody.contents = "Certificamos que o veículo elétrico acima individualizado foi submetido ao rigoroso protocolo de PDI (Pre-Delivery Inspection) em conformidade técnica com o Manual da Concessionária Z8 e a Resolução CONTRAN 996/2022. O proprietário declara ter recebido o veículo em perfeitas condições de uso, acompanhado de chave presencial, carregador inteligente bi-volt 72V homologado e manual técnico digital. A garantia de 24 meses vincula-se ao cumprimento do cronograma oficial de revisões periódicas na rede de concessionárias autorizadas Z8 Emotion.";
    tDecBody.textRange.characterAttributes.size = 6.2;
    tDecBody.textRange.characterAttributes.fillColor = getRGB(71, 85, 105);
    tDecBody.textRange.characterAttributes.tracking = 20;

    // =========================================================================
    // SEÇÃO 4: SELO DE GARANTIA VETORIAL EMBUTIDO (CANTO INFERIOR DIREITO)
    // =========================================================================
    var sealCX = w - margin - 75;
    var sealCY = margin + 95;
    var sealR = 48;

    var sealGroup = layerSeal.groupItems.add();
    sealGroup.name = "Selo_Oficial_Garantia_2Anos";

    // Círculo Dentado (32 dentes)
    var numT = 32;
    var sealPath = sealGroup.pathItems.add();
    sealPath.stroked = true;
    sealPath.strokeWidth = 1.2;
    sealPath.strokeColor = colDark;
    sealPath.fillColor = colCyan;

    var sealPts = [];
    var aStep = (2 * Math.PI) / (numT * 2);
    for (var st = 0; st < numT * 2; st++) {
        var rad = (st % 2 === 0) ? sealR : (sealR - 4);
        var sAng = st * aStep;
        sealPts.push([sealCX + rad * Math.cos(sAng), sealCY + rad * Math.sin(sAng)]);
    }
    sealPath.setEntirePath(sealPts);
    sealPath.closed = true;

    // Anel Interno Dark
    var innerSeal = sealGroup.pathItems.ellipse(sealCY + sealR - 8, sealCX - (sealR - 8), (sealR - 8) * 2, (sealR - 8) * 2);
    innerSeal.stroked = true;
    innerSeal.strokeWidth = 1;
    innerSeal.strokeColor = colCyan;
    innerSeal.fillColor = colDark;

    // Textos do Selo
    var tSeloTop = sealGroup.textFrames.pointText([sealCX, sealCY + 22]);
    tSeloTop.contents = "★ GARANTIA Z8 ★";
    tSeloTop.textRange.characterAttributes.size = 5.5;
    tSeloTop.textRange.characterAttributes.fillColor = colWhite;
    tSeloTop.textRange.characterAttributes.tracking = 100;
    tSeloTop.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSeloNum = sealGroup.textFrames.pointText([sealCX, sealCY + 2]);
    tSeloNum.contents = "2 ANOS";
    tSeloNum.textRange.characterAttributes.size = 17;
    tSeloNum.textRange.characterAttributes.fillColor = colCyan;
    tSeloNum.textRange.characterAttributes.tracking = 30;
    tSeloNum.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSeloBot = sealGroup.textFrames.pointText([sealCX, sealCY - 16]);
    tSeloBot.contents = "COBERTURA TOTAL";
    tSeloBot.textRange.characterAttributes.size = 5;
    tSeloBot.textRange.characterAttributes.fillColor = colSilver;
    tSeloBot.textRange.characterAttributes.tracking = 120;
    tSeloBot.textRange.paragraphAttributes.justification = Justification.CENTER;

    // =========================================================================
    // SEÇÃO 5: ASSINATURAS FORMAIS
    // =========================================================================
    var sigY = margin + 55;

    // Assinatura 1: Responsável Técnico da Concessionária
    var lineSig1 = layerBorders.pathItems.add();
    lineSig1.stroked = true;
    lineSig1.strokeWidth = 1;
    lineSig1.strokeColor = colDark;
    lineSig1.setEntirePath([[margin + 40, sigY], [margin + 260, sigY]]);

    var tSig1 = layerText.textFrames.pointText([margin + 150, sigY - 10]);
    tSig1.contents = "ENGENHEIRO / RESPONSÁVEL TÉCNICO AUTORIZADO Z8";
    tSig1.textRange.characterAttributes.size = 6.5;
    tSig1.textRange.characterAttributes.fillColor = colDark;
    tSig1.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSig1Reg = layerText.textFrames.pointText([margin + 150, sigY - 20]);
    tSig1Reg.contents = "CREA/CFT Nº 2026-SP • PROTOCOLO ELETRÔNICO PDI-0199";
    tSig1Reg.textRange.characterAttributes.size = 5.5;
    tSig1Reg.textRange.characterAttributes.fillColor = getRGB(100, 116, 139);
    tSig1Reg.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Assinatura 2: Proprietário Comprador
    var lineSig2 = layerBorders.pathItems.add();
    lineSig2.stroked = true;
    lineSig2.strokeWidth = 1;
    lineSig2.strokeColor = colDark;
    lineSig2.setEntirePath([[margin + 320, sigY], [margin + 540, sigY]]);

    var tSig2 = layerText.textFrames.pointText([margin + 430, sigY - 10]);
    tSig2.contents = "PROPRIETÁRIO // TITULAR ADQUIRENTE";
    tSig2.textRange.characterAttributes.size = 6.5;
    tSig2.textRange.characterAttributes.fillColor = colDark;
    tSig2.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSig2Doc = layerText.textFrames.pointText([margin + 430, sigY - 20]);
    tSig2Doc.contents = "DECLARO O RECEBIMENTO TÉCNICO E CONFORMIDADE INTEGRAL DO VEÍCULO";
    tSig2Doc.textRange.characterAttributes.size = 5.5;
    tSig2Doc.textRange.characterAttributes.fillColor = getRGB(100, 116, 139);
    tSig2Doc.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Rodapé de Fé Pública e Chave de Validação
    var tHash = layerText.textFrames.pointText([w / 2, margin + 14]);
    tHash.contents = "CHAVE DE AUTENTICIDADE CRIPTOGRÁFICA: Z8-PDI-93ZZ8TNK120260199-VALID-2028 • CONSULTA: Z8EMOTION.COM/CERTIFICADOS";
    tHash.textRange.characterAttributes.size = 6;
    tHash.textRange.characterAttributes.fillColor = getRGB(148, 163, 184);
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

    alert("✅ Certificado Oficial de Entrega Técnica e Garantia Z8 gerado com sucesso!\n\nArquivo .AI: " + aiPath.fsName + "\nArquivo .PDF: " + pdfPath.fsName);
}

createDeliveryCertificate();
