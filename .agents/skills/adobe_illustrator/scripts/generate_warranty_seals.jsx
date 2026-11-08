#target illustrator

/**
 * Z8 E-MOTION - GERADOR DE SELOS VETORIAIS DE GARANTIA NACIONAL
 * Adobe Illustrator 2026 ExtendScript (.jsx)
 * 
 * Cria 3 modelos oficiais de selos vetoriais:
 * 1. Selo Circular Duplo de Garantia Nacional (2 Anos / Chassi & Bateria 72V)
 * 2. Selo Hexagonal Aero-Tech (PDI Approved & Inspeção Técnica Z8)
 * 3. Selo Diamante Minimalista Black Piano & Ciano (Certificado de Autenticidade)
 */

function createWarrantySeals() {
    if (app.documents.length === 0) {
        var preset = new DocumentPreset();
        preset.width = 841.89; // 297mm (A4 Paisagem)
        preset.height = 595.28; // 210mm
        preset.units = RulerUnits.Millimeters;
        preset.colorMode = DocumentColorSpace.RGB;
        preset.title = "SELOS_GARANTIA_Z8_EMOTION";
        app.documents.addDocument(DocumentColorSpace.RGB, preset);
    }

    var doc = app.activeDocument;

    // Definição de Cores Oficiais Z8
    function getRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    var colDark   = getRGB(10, 11, 14);     // #0A0B0E Black Piano
    var colCyan   = getRGB(0, 229, 255);    // #00E5FF Electric Cyan
    var colLime   = getRGB(34, 197, 94);    // #22C55E Lime Green
    var colSilver = getRGB(194, 198, 202);  // #C2C6CA Platinum Grey
    var colWhite  = getRGB(255, 255, 255);  // #FFFFFF Pure White
    var colGold   = getRGB(212, 175, 55);   // #D4AF37 Metallic Gold
    var colDarkBg = getRGB(18, 20, 26);     // #12141A Deep Studio

    // Criação da Camada Dedicada aos Selos
    var layerSeals = doc.layers.add();
    layerSeals.name = "SELOS_GARANTIA_VETORIAIS_Z8";

    // Fundo Técnico de Contraste
    var bg = layerSeals.pathItems.rectangle(doc.height, 0, doc.width, doc.height);
    bg.fillColor = colDarkBg;
    bg.stroked = false;

    // Título Superior da Prancheta
    var titleFrame = layerSeals.textFrames.pointText([doc.width / 2, doc.height - 40]);
    titleFrame.contents = "Z8 E-MOTION // ESPECIFICAÇÃO DE SELOS VETORIAIS DE GARANTIA NACIONAL";
    titleFrame.textRange.characterAttributes.size = 14;
    titleFrame.textRange.characterAttributes.fillColor = colCyan;
    titleFrame.textRange.characterAttributes.tracking = 150;
    titleFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

    var subFrame = layerSeals.textFrames.pointText([doc.width / 2, doc.height - 58]);
    subFrame.contents = "PADRÃO CORPORATIVO 2026 • 100% VETORIAL • COMPATÍVEL COM IMPRESSÃO E GRAVAÇÃO A LASER";
    subFrame.textRange.characterAttributes.size = 9;
    subFrame.textRange.characterAttributes.fillColor = colSilver;
    subFrame.textRange.characterAttributes.tracking = 100;
    subFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

    // =========================================================================
    // MODELO 1: SELO CIRCULAR DUPLO - GARANTIA NACIONAL 2 ANOS
    // Posição: Centro X = 160, Centro Y = 280
    // =========================================================================
    var cx1 = 160;
    var cy1 = 280;
    var rOuter1 = 100;

    // Grupo do Selo 1
    var groupSeal1 = layerSeals.groupItems.add();
    groupSeal1.name = "Selo_01_Circular_2Anos";

    // Círculo Dentado / Borda de Alta Segurança (36 dentes chanfrados)
    var numTeeth = 36;
    var starSeal = groupSeal1.pathItems.add();
    starSeal.stroked = true;
    starSeal.strokeWidth = 1.5;
    starSeal.strokeColor = colCyan;
    starSeal.fillColor = colDark;

    var angleStep = (2 * Math.PI) / (numTeeth * 2);
    var points = [];
    for (var i = 0; i < numTeeth * 2; i++) {
        var r = (i % 2 === 0) ? rOuter1 : (rOuter1 - 6);
        var ang = i * angleStep;
        var px = cx1 + r * Math.cos(ang);
        var py = cy1 + r * Math.sin(ang);
        points.push([px, py]);
    }
    starSeal.setEntirePath(points);
    starSeal.closed = true;

    // Anel Interno Fino de Contorno
    var ring1 = groupSeal1.pathItems.ellipse(cy1 + rOuter1 - 10, cx1 - (rOuter1 - 10), (rOuter1 - 10) * 2, (rOuter1 - 10) * 2);
    ring1.stroked = true;
    ring1.strokeWidth = 1;
    ring1.strokeColor = colCyan;
    ring1.fillColor = colDark;

    // Anel Central Sólido
    var ringInner1 = groupSeal1.pathItems.ellipse(cy1 + 60, cx1 - 60, 120, 120);
    ringInner1.stroked = true;
    ringInner1.strokeWidth = 2;
    ringInner1.strokeColor = colCyan;
    ringInner1.fillColor = getRGB(15, 18, 24);

    // Textos do Selo 1
    var tTop = groupSeal1.textFrames.pointText([cx1, cy1 + 72]);
    tTop.contents = "★ GARANTIA NACIONAL ★";
    tTop.textRange.characterAttributes.size = 8.5;
    tTop.textRange.characterAttributes.fillColor = colWhite;
    tTop.textRange.characterAttributes.tracking = 120;
    tTop.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tYear = groupSeal1.textFrames.pointText([cx1, cy1 + 14]);
    tYear.contents = "2 ANOS";
    tYear.textRange.characterAttributes.size = 32;
    tYear.textRange.characterAttributes.fillColor = colCyan;
    tYear.textRange.characterAttributes.tracking = 40;
    tYear.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tDesc = groupSeal1.textFrames.pointText([cx1, cy1 - 16]);
    tDesc.contents = "COBERTURA TOTAL Z8";
    tDesc.textRange.characterAttributes.size = 8;
    tDesc.textRange.characterAttributes.fillColor = colWhite;
    tDesc.textRange.characterAttributes.tracking = 140;
    tDesc.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSub = groupSeal1.textFrames.pointText([cx1, cy1 - 32]);
    tSub.contents = "MOTOR & BATERIA 72V";
    tSub.textRange.characterAttributes.size = 7;
    tSub.textRange.characterAttributes.fillColor = colSilver;
    tSub.textRange.characterAttributes.tracking = 100;
    tSub.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tBot = groupSeal1.textFrames.pointText([cx1, cy1 - 76]);
    tBot.contents = "★ CONFORME RESOLUÇÃO 996 ★";
    tBot.textRange.characterAttributes.size = 7;
    tBot.textRange.characterAttributes.fillColor = colSilver;
    tBot.textRange.characterAttributes.tracking = 80;
    tBot.textRange.paragraphAttributes.justification = Justification.CENTER;


    // =========================================================================
    // MODELO 2: SELO HEXAGONAL AERO-TECH (PDI INSPEÇÃO APROVADA)
    // Posição: Centro X = 420, Centro Y = 280
    // =========================================================================
    var cx2 = 420;
    var cy2 = 280;
    var rOuter2 = 98;

    var groupSeal2 = layerSeals.groupItems.add();
    groupSeal2.name = "Selo_02_Hexagonal_PDI";

    // Hexágono Externo Chanfrado
    var hexOuter = groupSeal2.pathItems.add();
    hexOuter.stroked = true;
    hexOuter.strokeWidth = 2;
    hexOuter.strokeColor = colLime;
    hexOuter.fillColor = colDark;

    var hexPoints = [];
    for (var h = 0; h < 6; h++) {
        var hAng = (Math.PI / 3) * h - (Math.PI / 6);
        hexPoints.push([cx2 + rOuter2 * Math.cos(hAng), cy2 + rOuter2 * Math.sin(hAng)]);
    }
    hexOuter.setEntirePath(hexPoints);
    hexOuter.closed = true;

    // Hexágono Interno com Linha Dupla
    var hexInner = groupSeal2.pathItems.add();
    hexInner.stroked = true;
    hexInner.strokeWidth = 1;
    hexInner.strokeColor = colLime;
    hexInner.fillColor = getRGB(14, 22, 18);

    var hexInnerPoints = [];
    for (var hi = 0; hi < 6; hi++) {
        var hiAng = (Math.PI / 3) * hi - (Math.PI / 6);
        hexInnerPoints.push([cx2 + (rOuter2 - 12) * Math.cos(hiAng), cy2 + (rOuter2 - 12) * Math.sin(hiAng)]);
    }
    hexInner.setEntirePath(hexInnerPoints);
    hexInner.closed = true;

    // Ícone de Raio / Check Vetorial Central
    var bolt = groupSeal2.pathItems.add();
    bolt.fillColor = colLime;
    bolt.stroked = false;
    bolt.setEntirePath([
        [cx2 - 4,  cy2 + 45],
        [cx2 + 18, cy2 + 45],
        [cx2 + 2,  cy2 + 15],
        [cx2 + 22, cy2 + 15],
        [cx2 - 18, cy2 - 35],
        [cx2 - 4,  cy2 + 2],
        [cx2 - 20, cy2 + 2]
    ]);
    bolt.closed = true;

    // Textos do Selo 2
    var tPdiTop = groupSeal2.textFrames.pointText([cx2, cy2 + 62]);
    tPdiTop.contents = "INSPEÇÃO TÉCNICA DE PDI";
    tPdiTop.textRange.characterAttributes.size = 8;
    tPdiTop.textRange.characterAttributes.fillColor = colWhite;
    tPdiTop.textRange.characterAttributes.tracking = 140;
    tPdiTop.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tPdiTitle = groupSeal2.textFrames.pointText([cx2, cy2 - 46]);
    tPdiTitle.contents = "100% APROVADO";
    tPdiTitle.textRange.characterAttributes.size = 13;
    tPdiTitle.textRange.characterAttributes.fillColor = colLime;
    tPdiTitle.textRange.characterAttributes.tracking = 100;
    tPdiTitle.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tPdiSub = groupSeal2.textFrames.pointText([cx2, cy2 - 62]);
    tPdiSub.contents = "LAUDO ELETRÔNICO HOMOLOGADO";
    tPdiSub.textRange.characterAttributes.size = 6.5;
    tPdiSub.textRange.characterAttributes.fillColor = colSilver;
    tPdiSub.textRange.characterAttributes.tracking = 90;
    tPdiSub.textRange.paragraphAttributes.justification = Justification.CENTER;


    // =========================================================================
    // MODELO 3: SELO DIAMANTE MINIMALISTA BLACK PIANO & CIANO (AUTENTICIDADE)
    // Posição: Centro X = 680, Centro Y = 280
    // =========================================================================
    var cx3 = 680;
    var cy3 = 280;
    var dSize = 75;

    var groupSeal3 = layerSeals.groupItems.add();
    groupSeal3.name = "Selo_03_Diamante_Autenticidade";

    // Diamante Externo
    var diamOuter = groupSeal3.pathItems.add();
    diamOuter.stroked = true;
    diamOuter.strokeWidth = 2;
    diamOuter.strokeColor = colCyan;
    diamOuter.fillColor = colDark;
    diamOuter.setEntirePath([
        [cx3, cy3 + dSize + 15],
        [cx3 + dSize + 15, cy3],
        [cx3, cy3 - dSize - 15],
        [cx3 - dSize - 15, cy3]
    ]);
    diamOuter.closed = true;

    // Moldura Dupla Interna
    var diamInner = groupSeal3.pathItems.add();
    diamInner.stroked = true;
    diamInner.strokeWidth = 0.75;
    diamInner.strokeColor = colWhite;
    diamInner.fillColor = getRGB(12, 14, 18);
    diamInner.setEntirePath([
        [cx3, cy3 + dSize + 5],
        [cx3 + dSize + 5, cy3],
        [cx3, cy3 - dSize - 5],
        [cx3 - dSize - 5, cy3]
    ]);
    diamInner.closed = true;

    // Núcleo Z8 Vetorial
    var tLogo = groupSeal3.textFrames.pointText([cx3, cy3 + 22]);
    tLogo.contents = "Z8";
    tLogo.textRange.characterAttributes.size = 38;
    tLogo.textRange.characterAttributes.fillColor = colCyan;
    tLogo.textRange.characterAttributes.tracking = 60;
    tLogo.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tEmotion = groupSeal3.textFrames.pointText([cx3, cy3 - 2]);
    tEmotion.contents = "E-MOTION";
    tEmotion.textRange.characterAttributes.size = 10;
    tEmotion.textRange.characterAttributes.fillColor = colWhite;
    tEmotion.textRange.characterAttributes.tracking = 180;
    tEmotion.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tAuth = groupSeal3.textFrames.pointText([cx3, cy3 - 22]);
    tAuth.contents = "AUTHENTIC PRODUCT";
    tAuth.textRange.characterAttributes.size = 7.5;
    tAuth.textRange.characterAttributes.fillColor = colSilver;
    tAuth.textRange.characterAttributes.tracking = 120;
    tAuth.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tSerial = groupSeal3.textFrames.pointText([cx3, cy3 - 42]);
    tSerial.contents = "MATRIZ // SÃO JOSÉ DOS CAMPOS";
    tSerial.textRange.characterAttributes.size = 6.5;
    tSerial.textRange.characterAttributes.fillColor = colCyan;
    tSerial.textRange.characterAttributes.tracking = 70;
    tSerial.textRange.paragraphAttributes.justification = Justification.CENTER;


    // =========================================================================
    // RODAPÉ TÉCNICO E DIRETRIZES DE USO
    // =========================================================================
    var footerFrame = layerSeals.textFrames.pointText([doc.width / 2, 45]);
    footerFrame.contents = "CONCESSÃO OFICIAL Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • SÃO JOSÉ DOS CAMPOS - SP";
    footerFrame.textRange.characterAttributes.size = 8;
    footerFrame.textRange.characterAttributes.fillColor = colSilver;
    footerFrame.textRange.characterAttributes.tracking = 110;
    footerFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Exportação em formato nativo (.AI) e (.PDF)
    var outFolder = new Folder("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator");
    if (!outFolder.exists) {
        outFolder.create();
    }

    var aiPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/SELOS_GARANTIA_Z8_2026.ai");
    var aiOpts = new IllustratorSaveOptions();
    aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
    aiOpts.pdfCompatible = true;
    doc.saveAs(aiPath, aiOpts);

    var pdfPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/SELOS_GARANTIA_Z8_2026.pdf");
    var pdfOpts = new PDFSaveOptions();
    pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
    pdfOpts.preserveEditability = true;
    doc.saveAs(pdfPath, pdfOpts);

    alert("✅ Selos de Garantia e PDI Z8 gerados com sucesso!\n\nArquivo .AI: " + aiPath.fsName + "\nArquivo .PDF: " + pdfPath.fsName);
}

createWarrantySeals();
