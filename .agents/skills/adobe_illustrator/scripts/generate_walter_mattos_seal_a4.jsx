#target illustrator

/**
 * Z8 E-MOTION - SELO DE GARANTIA NACIONAL // ESTUDO GEOMÉTRICO WALTER MATTOS (A4)
 * Adobe Illustrator 2026 ExtendScript (.jsx)
 * 
 * Princípios de Design Aplicados (Escola Walter Mattos):
 * 1. Proporção Áurea Funcional (Anéis em escala geométrica phi = 1.618).
 * 2. Compensação Ótica de Gravidade (+3.0 pt no centro de massa visual).
 * 3. Economia de Curvas Bézier (mínimo de pontos de ancoragem para fluidez máxima).
 * 4. Grid de Construção Técnica visível com círculos guias e eixos de tensão visual.
 * 5. Apresentação Editorial Executiva com variações de cor e zona de proteção.
 */

function createWalterMattosSealA4() {
    var docWidth = 841.89;  // 297 mm em pontos (A4 Paisagem)
    var docHeight = 595.28; // 210 mm em pontos

    var preset = new DocumentPreset();
    preset.width = docWidth;
    preset.height = docHeight;
    preset.units = RulerUnits.Millimeters;
    preset.colorMode = DocumentColorSpace.RGB;
    preset.title = "SELO_GARANTIA_WALTER_MATTOS_Z8_2026";

    var doc = app.documents.addDocument(DocumentColorSpace.RGB, preset);

    function getRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    // Paleta Corporativa Walter Mattos / Z8
    var colDark        = getRGB(10, 11, 14);     // #0A0B0E Black Piano
    var colDeepStudio  = getRGB(18, 21, 28);     // #12151C Carvão Acetinado
    var colCyan        = getRGB(0, 229, 255);    // #00E5FF Electric Cyan Z8
    var colGold        = getRGB(194, 150, 40);   // #C29628 Dourado Nobre
    var colGoldLight   = getRGB(245, 230, 185);  // #F5E6B9 Ouro Champagne
    var colSilver      = getRGB(148, 163, 184);  // #94A3B8 Prata Suave
    var colSlate       = getRGB(51, 65, 85);     // #334155 Ardósia
    var colBorder      = getRGB(226, 232, 240);  // #E2E8F0 Linha Técnica
    var colGuideCyan   = getRGB(165, 243, 252);  // #A5F3FC Guia Técnica Ciano
    var colGuideGold   = getRGB(254, 240, 138);  // #FEF08A Guia Dourada

    var layerBg       = doc.layers[0]; layerBg.name = "01_Fundo_e_Grid_Modular";
    var layerGuides   = doc.layers.add(); layerGuides.name = "02_Linhas_Guia_Proporcao_Aurea";
    var layerSeal     = doc.layers.add(); layerSeal.name = "03_Selo_Hero_Construcao_Otica";
    var layerVariants = doc.layers.add(); layerVariants.name = "04_Variacoes_e_Escala";
    var layerText     = doc.layers.add(); layerText.name = "05_Diretrizes_Editoriais";

    var w = docWidth;
    var h = docHeight;
    var margin = 28;

    var bg = layerBg.pathItems.rectangle(h, 0, w, h);
    bg.fillColor = getRGB(253, 254, 255);
    bg.stroked = false;

    var outerFrame = layerBg.pathItems.rectangle(h - margin, margin, w - (margin * 2), h - (margin * 2));
    outerFrame.stroked = true;
    outerFrame.strokeWidth = 0.75;
    outerFrame.strokeColor = colBorder;
    outerFrame.filled = false;

    var splitX = margin + ((w - (margin * 2)) * 0.58);

    var splitLine = layerBg.pathItems.add();
    splitLine.stroked = true;
    splitLine.strokeWidth = 0.5;
    splitLine.strokeColor = colBorder;
    splitLine.setEntirePath([[splitX, h - margin - 15], [splitX, margin + 15]]);

    var tBrand = layerText.textFrames.pointText([margin + 20, h - margin - 22]);
    tBrand.contents = "Z8 E-MOTION // DESIGN SYSTEM & BRAND ANATOMY";
    tBrand.textRange.characterAttributes.size = 8;
    tBrand.textRange.characterAttributes.fillColor = colCyan;
    tBrand.textRange.characterAttributes.tracking = 200;

    var tSheetTitle = layerText.textFrames.pointText([margin + 20, h - margin - 38]);
    tSheetTitle.contents = "SELO OFICIAL DE GARANTIA NACIONAL // ESTUDO GEOMÉTRICO E COMPENSAÇÃO ÓTICA";
    tSheetTitle.textRange.characterAttributes.size = 12;
    tSheetTitle.textRange.characterAttributes.fillColor = colDark;
    tSheetTitle.textRange.characterAttributes.tracking = 50;

    var tSheetSub = layerText.textFrames.pointText([margin + 20, h - margin - 50]);
    tSheetSub.contents = "DIRETRIZES DE REFINAMENTO BASEADAS NOS PRINCÍPIOS DE WALTER MATTOS • PROPORÇÃO ÁUREA (Φ) E EQUILÍBRIO GRAVITACIONAL";
    tSheetSub.textRange.characterAttributes.size = 6.2;
    tSheetSub.textRange.characterAttributes.fillColor = colSilver;
    tSheetSub.textRange.characterAttributes.tracking = 80;

    var heroCX = margin + ((splitX - margin) / 2);
    var heroCY = (h / 2) - 15;

    var r0 = 128;
    var r1 = r0 / 1.14;
    var r2 = r0 / 1.618;
    var r3 = r2 / 1.618;

    function drawGuideLine(x1, y1, x2, y2) {
        var gl = layerGuides.pathItems.add();
        gl.stroked = true;
        gl.strokeWidth = 0.35;
        gl.strokeColor = colGuideCyan;
        gl.filled = false;
        gl.setEntirePath([[x1, y1], [x2, y2]]);
    }

    drawGuideLine(heroCX - r0 - 25, heroCY, heroCX + r0 + 25, heroCY);
    drawGuideLine(heroCX, heroCY - r0 - 25, heroCX, heroCY + r0 + 25);
    drawGuideLine(heroCX - (r0 * 0.85), heroCY - (r0 * 0.85), heroCX + (r0 * 0.85), heroCY + (r0 * 0.85));
    drawGuideLine(heroCX - (r0 * 0.85), heroCY + (r0 * 0.85), heroCX + (r0 * 0.85), heroCY - (r0 * 0.85));

    function drawGuideCircle(radius, label, isGold) {
        var gc = layerGuides.pathItems.ellipse(heroCY + radius, heroCX - radius, radius * 2, radius * 2);
        gc.stroked = true;
        gc.strokeWidth = 0.4;
        gc.strokeColor = isGold ? colGuideGold : colGuideCyan;
        gc.filled = false;

        var tLbl = layerGuides.textFrames.pointText([heroCX + radius + 4, heroCY + 3]);
        tLbl.contents = label;
        tLbl.textRange.characterAttributes.size = 5.2;
        tLbl.textRange.characterAttributes.fillColor = isGold ? colGold : colSilver;
        tLbl.textRange.characterAttributes.tracking = 50;
    }

    drawGuideCircle(r0, "R0 (Outer Bound)", false);
    drawGuideCircle(r2, "R1 (Phi = 1.618)", true);
    drawGuideCircle(r3, "R2 (Phi^2)", false);

    var groupHero = layerSeal.groupItems.add();
    groupHero.name = "Selo_Garantia_WalterMattos_Hero";

    var numFacets = 24;
    var sealOuter = groupHero.pathItems.add();
    sealOuter.stroked = true;
    sealOuter.strokeWidth = 1.5;
    sealOuter.strokeColor = colDark;
    sealOuter.fillColor = colDark;

    var outerPts = [];
    var fStep = (2 * Math.PI) / (numFacets * 2);
    for (var f = 0; f < numFacets * 2; f++) {
        var rVal = (f % 2 === 0) ? r0 : (r0 - 5.5);
        var fAng = f * fStep;
        outerPts.push([heroCX + rVal * Math.cos(fAng), heroCY + rVal * Math.sin(fAng)]);
    }
    sealOuter.setEntirePath(outerPts);
    sealOuter.closed = true;

    var ringAccent = groupHero.pathItems.ellipse(heroCY + r0 - 8, heroCX - (r0 - 8), (r0 - 8) * 2, (r0 - 8) * 2);
    ringAccent.stroked = true;
    ringAccent.strokeWidth = 1;
    ringAccent.strokeColor = colCyan;
    ringAccent.fillColor = colDeepStudio;

    var ringMid = groupHero.pathItems.ellipse(heroCY + r1, heroCX - r1, r1 * 2, r1 * 2);
    ringMid.stroked = true;
    ringMid.strokeWidth = 0.5;
    ringMid.strokeColor = colBorder;
    ringMid.fillColor = colDeepStudio;

    var tTopCurve = groupHero.textFrames.pointText([heroCX, heroCY + r2 + 13]);
    tTopCurve.contents = "★ GARANTIA NACIONAL DE 24 MESES ★";
    tTopCurve.textRange.characterAttributes.size = 6.5;
    tTopCurve.textRange.characterAttributes.fillColor = colGoldLight;
    tTopCurve.textRange.characterAttributes.tracking = 140;
    tTopCurve.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tBotCurve = groupHero.textFrames.pointText([heroCX, heroCY - r2 - 18]);
    tBotCurve.contents = "★ CONFORME RESOLUÇÃO CONTRAN 996 ★";
    tBotCurve.textRange.characterAttributes.size = 5.8;
    tBotCurve.textRange.characterAttributes.fillColor = colSilver;
    tBotCurve.textRange.characterAttributes.tracking = 110;
    tBotCurve.textRange.paragraphAttributes.justification = Justification.CENTER;

    var ringGold = groupHero.pathItems.ellipse(heroCY + r2, heroCX - r2, r2 * 2, r2 * 2);
    ringGold.stroked = true;
    ringGold.strokeWidth = 1.8;
    ringGold.strokeColor = colGold;
    ringGold.fillColor = colDark;

    for (var d = 0; d < 32; d++) {
        var dAng = (d / 32) * 2 * Math.PI;
        var dx = heroCX + (r2 - 6) * Math.cos(dAng);
        var dy = heroCY + (r2 - 6) * Math.sin(dAng);
        var pDot = groupHero.pathItems.ellipse(dy + 0.8, dx - 0.8, 1.6, 1.6);
        pDot.fillColor = colGold;
        pDot.stroked = false;
    }

    var opticalOffset = 3.0;

    var tCoreBrand = groupHero.textFrames.pointText([heroCX, heroCY + opticalOffset + 24]);
    tCoreBrand.contents = "Z8 E-MOTION";
    tCoreBrand.textRange.characterAttributes.size = 7.5;
    tCoreBrand.textRange.characterAttributes.fillColor = colSilver;
    tCoreBrand.textRange.characterAttributes.tracking = 220;
    tCoreBrand.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tCoreBig = groupHero.textFrames.pointText([heroCX, heroCY + opticalOffset + 4]);
    tCoreBig.contents = "2 ANOS";
    tCoreBig.textRange.characterAttributes.size = 32;
    tCoreBig.textRange.characterAttributes.fillColor = colCyan;
    tCoreBig.textRange.characterAttributes.tracking = 40;
    tCoreBig.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tCoreSub = groupHero.textFrames.pointText([heroCX, heroCY + opticalOffset - 16]);
    tCoreSub.contents = "COBERTURA TOTAL";
    tCoreSub.textRange.characterAttributes.size = 7;
    tCoreSub.textRange.characterAttributes.fillColor = getRGB(255, 255, 255);
    tCoreSub.textRange.characterAttributes.tracking = 160;
    tCoreSub.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tCoreTech = groupHero.textFrames.pointText([heroCX, heroCY + opticalOffset - 27]);
    tCoreTech.contents = "BATERIA 72V & CHASSI";
    tCoreTech.textRange.characterAttributes.size = 6;
    tCoreTech.textRange.characterAttributes.fillColor = colGoldLight;
    tCoreTech.textRange.characterAttributes.tracking = 100;
    tCoreTech.textRange.paragraphAttributes.justification = Justification.CENTER;

    function drawMinimalRibbon(isLeft) {
        var rib = groupHero.pathItems.add();
        rib.fillColor = colGold;
        rib.stroked = true;
        rib.strokeWidth = 0.5;
        rib.strokeColor = colDark;
        var dir = isLeft ? -1 : 1;
        rib.setEntirePath([
            [heroCX + (dir * 24), heroCY - r0 + 12],
            [heroCX + (dir * 65), heroCY - r0 - 18],
            [heroCX + (dir * 52), heroCY - r0 - 26],
            [heroCX + (dir * 65), heroCY - r0 - 34],
            [heroCX + (dir * 18), heroCY - r0 - 8]
        ]);
        rib.closed = true;
    }
    drawMinimalRibbon(true);
    drawMinimalRibbon(false);

    var rightX = splitX + 22;
    var rightW = w - margin - rightX;

    var tR1Title = layerText.textFrames.pointText([rightX, h - margin - 22]);
    tR1Title.contents = "01 // CONCEITO E RACIONAL DE CONSTRUÇÃO";
    tR1Title.textRange.characterAttributes.size = 7.5;
    tR1Title.textRange.characterAttributes.fillColor = colDark;
    tR1Title.textRange.characterAttributes.tracking = 140;

    var boxDesc = layerText.pathItems.rectangle(h - margin - 32, rightX, rightW, 65);
    boxDesc.stroked = false; boxDesc.filled = false;
    var tDescArea = layerText.textFrames.areaText(boxDesc);
    tDescArea.contents = "O Selo de Garantia Nacional Z8 foi construído a partir dos princípios de clareza formal e compensação ótica preconizados por Walter Mattos. O círculo externo utiliza 24 facetas chanfradas aerodinâmicas inspiradas no design de chassi e aros automotivos. A hierarquia entre os anéis respeita a Proporção Áurea (Φ = 1.618), garantindo que a tipografia central tenha respiro harmônico sem poluição visual. Todos os textos internos possuem elevação de +3.0 pt no eixo vertical para neutralizar a ilusão de ótica que rebaixa elementos circulares aos olhos humanos.";
    tDescArea.textRange.characterAttributes.size = 6.2;
    tDescArea.textRange.characterAttributes.autoLeading = false;
    tDescArea.textRange.characterAttributes.leading = 9.5;
    tDescArea.textRange.characterAttributes.fillColor = colSlate;
    tDescArea.textRange.paragraphAttributes.justification = Justification.LEFT;

    var tR2Title = layerText.textFrames.pointText([rightX, h - margin - 110]);
    tR2Title.contents = "02 // VARIAÇÕES E ADAPTAÇÃO DE SUPERFÍCIE";
    tR2Title.textRange.characterAttributes.size = 7.5;
    tR2Title.textRange.characterAttributes.fillColor = colDark;
    tR2Title.textRange.characterAttributes.tracking = 140;

    var varCardW = (rightW - 14) / 2;
    var varCardH = 95;
    var varTopY = h - margin - 122;

    var cardVarA = layerVariants.pathItems.roundedRectangle(varTopY, rightX, varCardW, varCardH, 3, 3);
    cardVarA.fillColor = colDark;
    cardVarA.stroked = true;
    cardVarA.strokeWidth = 0.5;
    cardVarA.strokeColor = colBorder;

    var sealMiniA = layerVariants.pathItems.ellipse(varTopY - 14, rightX + (varCardW / 2) - 24, 48, 48);
    sealMiniA.stroked = true;
    sealMiniA.strokeWidth = 1;
    sealMiniA.strokeColor = colCyan;
    sealMiniA.fillColor = colDeepStudio;

    var tMiniATxt = layerVariants.textFrames.pointText([rightX + (varCardW / 2), varTopY - 34]);
    tMiniATxt.contents = "2 ANOS";
    tMiniATxt.textRange.characterAttributes.size = 10;
    tMiniATxt.textRange.characterAttributes.fillColor = colCyan;
    tMiniATxt.textRange.characterAttributes.tracking = 30;
    tMiniATxt.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tMiniALbl = layerVariants.textFrames.pointText([rightX + (varCardW / 2), varTopY - 76]);
    tMiniALbl.contents = "VERSÃO BLACK PIANO (DARK)";
    tMiniALbl.textRange.characterAttributes.size = 5.2;
    tMiniALbl.textRange.characterAttributes.fillColor = colSilver;
    tMiniALbl.textRange.paragraphAttributes.justification = Justification.CENTER;

    var cardVarB = layerVariants.pathItems.roundedRectangle(varTopY, rightX + varCardW + 14, varCardW, varCardH, 3, 3);
    cardVarB.fillColor = getRGB(245, 247, 250);
    cardVarB.stroked = true;
    cardVarB.strokeWidth = 0.5;
    cardVarB.strokeColor = colBorder;

    var sealMiniB = layerVariants.pathItems.ellipse(varTopY - 14, rightX + varCardW + 14 + (varCardW / 2) - 24, 48, 48);
    sealMiniB.stroked = true;
    sealMiniB.strokeWidth = 1;
    sealMiniB.strokeColor = colDark;
    sealMiniB.fillColor = getRGB(255, 255, 255);

    var tMiniBTxt = layerVariants.textFrames.pointText([rightX + varCardW + 14 + (varCardW / 2), varTopY - 34]);
    tMiniBTxt.contents = "2 ANOS";
    tMiniBTxt.textRange.characterAttributes.size = 10;
    tMiniBTxt.textRange.characterAttributes.fillColor = colDark;
    tMiniBTxt.textRange.characterAttributes.tracking = 30;
    tMiniBTxt.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tMiniBLbl = layerVariants.textFrames.pointText([rightX + varCardW + 14 + (varCardW / 2), varTopY - 76]);
    tMiniBLbl.contents = "GRAVAÇÃO A LASER / CHASSI";
    tMiniBLbl.textRange.characterAttributes.size = 5.2;
    tMiniBLbl.textRange.characterAttributes.fillColor = colSlate;
    tMiniBLbl.textRange.paragraphAttributes.justification = Justification.CENTER;

    var tR3Title = layerText.textFrames.pointText([rightX, varTopY - varCardH - 18]);
    tR3Title.contents = "03 // ZONA DE PROTEÇÃO E REDUÇÃO MÍNIMA";
    tR3Title.textRange.characterAttributes.size = 7.5;
    tR3Title.textRange.characterAttributes.fillColor = colDark;
    tR3Title.textRange.characterAttributes.tracking = 140;

    var boxProt = layerText.pathItems.rectangle(varTopY - varCardH - 28, rightX, rightW, 60);
    boxProt.stroked = false; boxProt.filled = false;
    var tProtArea = layerText.textFrames.areaText(boxProt);
    tProtArea.contents = "A Zona de Proteção (Clear Space) corresponde à constante X = raio do núcleo áureo central (r2/2). Nenhum texto, foto ou elemento gráfico deve invadir esta área perimetral. A redução mínima recomendada para impressão offset e rotulagem é de 22 mm de diâmetro (preservando total legibilidade das inscrições CONTRAN 996). Para gravação física no cabeçote do motor ou chassi de alumínio, a redução mínima admitida é de 18 mm na versão linear simplificada.";
    tProtArea.textRange.characterAttributes.size = 6.2;
    tProtArea.textRange.characterAttributes.autoLeading = false;
    tProtArea.textRange.characterAttributes.leading = 9.5;
    tProtArea.textRange.characterAttributes.fillColor = colSlate;
    tProtArea.textRange.paragraphAttributes.justification = Justification.LEFT;

    var palY = varTopY - varCardH - 96;
    var tR4Title = layerText.textFrames.pointText([rightX, palY]);
    tR4Title.contents = "04 // PALETA CROMÁTICA OFICIAL (ESPECIFICAÇÃO DE COR)";
    tR4Title.textRange.characterAttributes.size = 7.5;
    tR4Title.textRange.characterAttributes.fillColor = colDark;
    tR4Title.textRange.characterAttributes.tracking = 140;

    var swatches = [
        ["BLACK PIANO", colDark, "#0A0B0E • C75 M68 Y67 K90"],
        ["ELECTRIC CYAN", colCyan, "#00E5FF • C65 M0 Y5 K0"],
        ["NOBLE GOLD", colGold, "#C29628 • C20 M35 Y85 K10"],
        ["PLATINUM GREY", colSilver, "#94A3B8 • C40 M28 Y25 K0"]
    ];

    for (var sw = 0; sw < swatches.length; sw++) {
        var sY = palY - 14 - (sw * 16);
        var sBox = layerVariants.pathItems.roundedRectangle(sY, rightX, 11, 11, 2, 2);
        sBox.fillColor = swatches[sw][1];
        sBox.stroked = true;
        sBox.strokeWidth = 0.4;
        sBox.strokeColor = colBorder;

        var sName = layerText.textFrames.pointText([rightX + 18, sY - 8]);
        sName.contents = swatches[sw][0] + " — " + swatches[sw][2];
        sName.textRange.characterAttributes.size = 6;
        sName.textRange.characterAttributes.fillColor = colDark;
        sName.textRange.characterAttributes.tracking = 30;
    }

    var footerLine = layerBg.pathItems.add();
    footerLine.stroked = true;
    footerLine.strokeWidth = 0.5;
    footerLine.strokeColor = colBorder;
    footerLine.setEntirePath([[margin + 20, margin + 18], [w - margin - 20, margin + 18]]);

    var tFooterL = layerText.textFrames.pointText([margin + 20, margin + 9]);
    tFooterL.contents = "Z8 EMOTION LTDA. • CNPJ: 68.774.164/0001-00 • SÃO JOSÉ DOS CAMPOS - SP • MANUAL DE MARCA 2026";
    tFooterL.textRange.characterAttributes.size = 6.2;
    tFooterL.textRange.characterAttributes.fillColor = colSilver;
    tFooterL.textRange.characterAttributes.tracking = 60;

    var tFooterR = layerText.textFrames.pointText([w - margin - 20, margin + 9]);
    tFooterR.contents = "METODOLOGIA DE DESIGN WALTER MATTOS • PROPORÇÃO ÁUREA E EQUILÍBRIO ÓTICO";
    tFooterR.textRange.characterAttributes.size = 6.2;
    tFooterR.textRange.characterAttributes.fillColor = colCyan;
    tFooterR.textRange.characterAttributes.tracking = 60;
    tFooterR.textRange.paragraphAttributes.justification = Justification.RIGHT;

    var outFolder = new Folder("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator");
    if (!outFolder.exists) {
        outFolder.create();
    }

    var aiPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/SELO_GARANTIA_WALTER_MATTOS_A4.ai");
    var aiOpts = new IllustratorSaveOptions();
    aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
    aiOpts.pdfCompatible = true;
    doc.saveAs(aiPath, aiOpts);

    var pdfPath = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/cria/illustrator/SELO_GARANTIA_WALTER_MATTOS_A4.pdf");
    var pdfOpts = new PDFSaveOptions();
    pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
    pdfOpts.preserveEditability = true;
    doc.saveAs(pdfPath, pdfOpts);

    alert("✅ Prancha A4 do Selo de Garantia Walter Mattos gerada com sucesso!\n\nArquivo .AI: " + aiPath.fsName + "\nArquivo .PDF: " + pdfPath.fsName);
}

createWalterMattosSealA4();
