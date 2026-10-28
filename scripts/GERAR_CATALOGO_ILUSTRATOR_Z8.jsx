#target illustrator

/**
 * ========================================================================
 * Z8 E-MOTION // SCRIPT MESTRE DE AUTOMAÇÃO ADOBE ILLUSTRATOR 2026
 * GERAÇÃO COMPLETA DO CATÁLOGO DE VENDAS (14 PRANCHETAS A4 PAISAGEM)
 * ========================================================================
 * Conteúdo Completo:
 * - Prancheta 01: Capa Minimalista com Destaques
 * - Prancheta 02: Apresentação da Marca & Manifesto (BMS, Oficina 2 Elevadores, CONTRAN 996)
 * - Pranchetas 03 a 13: Os 11 Modelos Z8 com Fichas Técnicas Reais e Fotos
 * - Prancheta 14: Contracapa Institucional, Matriz Corporativa e Contatos
 * ========================================================================
 * Como executar no Adobe Illustrator:
 * 1. Abra o Adobe Illustrator 2026.
 * 2. Pressione Ctrl + F12 (ou menu Arquivo > Scripts > Outro Script...).
 * 3. Selecione este arquivo: GERAR_CATALOGO_ILUSTRATOR_Z8.jsx
 * ========================================================================
 */

function main() {
    var projectRoot = "C:/Users/LENOVO/Desktop/Z8";
    
    // Dimensões A4 Paisagem em Pontos (1 mm = 2.834645 pt)
    var abWidth = 841.89; // 297 mm
    var abHeight = 595.28; // 210 mm
    var abMarginX = 60.0;
    var abMarginY = 60.0;
    var cols = 7;
    var totalPages = 14;

    // Criar Novo Documento
    var docPreset = new DocumentPreset();
    docPreset.width = abWidth;
    docPreset.height = abHeight;
    docPreset.units = RulerUnits.Millimeters;
    docPreset.colorMode = DocumentColorSpace.RGB;
    docPreset.title = "CATALOGO_MINIMALISTA_Z8_2026";

    var doc = app.documents.addDocument(DocumentColorSpace.RGB, docPreset);

    // Paleta de Cores Z8
    function makeRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    var cWhite = makeRGB(255, 255, 255);
    var cDark = makeRGB(10, 11, 14);
    var cCyan = makeRGB(0, 229, 255);
    var cDarkCyan = makeRGB(0, 140, 168);
    var cLime = makeRGB(34, 197, 94);
    var cSlate = makeRGB(100, 116, 139);
    var cCardBg = makeRGB(248, 250, 252);
    var cBorder = makeRGB(226, 232, 240);

    // Organização de Camadas Profissionais
    var layerBg = doc.layers[0];
    layerBg.name = "01_Background_e_Bordas";

    var layerBoxes = doc.layers.add();
    layerBoxes.name = "02_Cards_e_Molduras";

    var layerPhotos = doc.layers.add();
    layerPhotos.name = "03_Imagens_dos_Veiculos";

    var layerText = doc.layers.add();
    layerText.name = "04_Tipografia_e_Textos";

    var layerCTA = doc.layers.add();
    layerCTA.name = "05_Precos_e_Destaques";

    // Criar as 14 Pranchetas (Artboards) em Grid 7x2
    // A primeira prancheta já existe por padrão
    for (var i = 1; i < totalPages; i++) {
        var colIdx = i % cols;
        var rowIdx = Math.floor(i / cols);
        var left = colIdx * (abWidth + abMarginX);
        var top = -rowIdx * (abHeight + abMarginY);
        var right = left + abWidth;
        var bottom = top - abHeight;

        doc.artboards.add([left, top, right, bottom]);
    }

    // Função utilitária para obter coordenadas de cada prancheta
    function getAbBounds(index) {
        return doc.artboards[index].artboardRect; // [left, top, right, bottom]
    }

    // Desenhar molduras e cabeçalho/rodapé padrão de cada prancheta
    for (var p = 0; p < totalPages; p++) {
        var rectBounds = getAbBounds(p);
        var pLeft = rectBounds[0];
        var pTop = rectBounds[1];

        // Fundo Branco
        var bgRect = layerBg.pathItems.rectangle(pTop, pLeft, abWidth, abHeight);
        bgRect.fillColor = cWhite;
        bgRect.stroked = false;

        // Moldura Sutil Arquitetônica
        var frameRect = layerBg.pathItems.rectangle(pTop - 12, pLeft + 12, abWidth - 24, abHeight - 24);
        frameRect.fillColor = new NoColor();
        frameRect.stroked = true;
        frameRect.strokeColor = cBorder;
        frameRect.strokeWidth = 0.5;

        // Topo: Indicador de Página
        var pageNumText = layerText.textFrames.pointText([pLeft + abWidth - 75, pTop - 32]);
        pageNumText.contents = (p < 9 ? "0" : "") + (p + 1) + " / 14";
        pageNumText.textRange.characterAttributes.size = 9;
        pageNumText.textRange.characterAttributes.fillColor = cSlate;
        pageNumText.textRange.characterAttributes.tracking = 200;

        // Topo: Tag da Marca
        var headerTag = layerText.textFrames.pointText([pLeft + 45, pTop - 32]);
        if (p === 0) {
            headerTag.contents = "Z8 E-MOTION // CATÁLOGO DE VENDAS // EDIÇÃO 2026";
        } else if (p === 1) {
            headerTag.contents = "Z8 E-MOTION // APRESENTAÇÃO DA MARCA // MANIFESTO 2026";
        } else if (p === 13) {
            headerTag.contents = "Z8 E-MOTION // REDE OFICIAL & CONTATO COMERCIAL";
        } else {
            headerTag.contents = "Z8 E-MOTION // LINHA 2026";
        }
        headerTag.textRange.characterAttributes.size = 8.5;
        headerTag.textRange.characterAttributes.fillColor = cDarkCyan;
        headerTag.textRange.characterAttributes.tracking = 250;

        // Rodapé
        var footTag = layerText.textFrames.pointText([pLeft + 45, pTop - abHeight + 25]);
        footTag.contents = "MOBILIDADE 100% ELÉTRICA • ZERO EMISSÕES • GARANTIA NACIONAL Z8";
        footTag.textRange.characterAttributes.size = 7.5;
        footTag.textRange.characterAttributes.fillColor = cSlate;
        footTag.textRange.characterAttributes.tracking = 150;

        var footUrl = layerText.textFrames.pointText([pLeft + abWidth - 110, pTop - abHeight + 25]);
        footUrl.contents = "Z8EMOTION.COM";
        footUrl.textRange.characterAttributes.size = 8;
        footUrl.textRange.characterAttributes.fillColor = cDark;
        footUrl.textRange.characterAttributes.tracking = 200;
    }

    // ========================================================================
    // 1. PRANCHETA 01: CAPA MINIMALISTA (Artboard 0)
    // ========================================================================
    (function renderCover() {
        var abB = getAbBounds(0);
        var pLeft = abB[0];
        var pTop = abB[1];

        // Kicker Pill
        var kickerBox = layerBoxes.pathItems.rectangle(pTop - 65, pLeft + 45, 230, 22);
        kickerBox.fillColor = cDark;
        kickerBox.stroked = false;

        var kickerTxt = layerText.textFrames.pointText([pLeft + 55, pTop - 79]);
        kickerTxt.contents = "MOBILIDADE URBANA 100% ELÉTRICA";
        kickerTxt.textRange.characterAttributes.size = 8;
        kickerTxt.textRange.characterAttributes.fillColor = cCyan;
        kickerTxt.textRange.characterAttributes.tracking = 200;

        // Monumental Headline
        var titleTxt = layerText.textFrames.pointText([pLeft + 45, pTop - 110]);
        titleTxt.contents = "ENGENHARIA, ESTILO E LIBERDADE.";
        titleTxt.textRange.characterAttributes.size = 32;
        titleTxt.textRange.characterAttributes.fillColor = cDark;
        titleTxt.textRange.characterAttributes.tracking = 50;

        // Subtitle Lead
        var subTxt = layerText.textFrames.pointText([pLeft + 45, pTop - 138]);
        subTxt.contents = "Conheça a linha completa de scooters e motocicletas elétricas Z8 E-Motion.\rVeículos homologados pelo CONTRAN 996, com recarga econômica em qualquer tomada comum e zero poluição.";
        subTxt.textRange.characterAttributes.size = 10;
        subTxt.textRange.characterAttributes.leading = 15;
        subTxt.textRange.characterAttributes.fillColor = cSlate;

        // 3 Showcase Cards
        var coverCards = [
            { tag: "SCOOTER EXECUTIVA", name: "Z8 N95C MAX", file: "z8_n95c_studio.jpg", spec: "1200W • Até 50 km", price: "R$ 8.000,00" },
            { tag: "TRAIL PERFORMANCE", name: "Z8 TANK HIGH-SPEED", file: "z8_tank_studio.jpg", spec: "2000W • Chassi Tubular", price: "R$ 9.500,00" },
            { tag: "VINTAGE RETRÔ CANDY", name: "Z8 Q10 VINTAGE", file: "z8_q11_studio.jpg", spec: "1200W • Estilo Italiano", price: "R$ 9.800,00" }
        ];

        var cardW = 236;
        var cardGap = 21;
        var cardH = 340;
        var cardTop = pTop - 180;

        for (var c = 0; c < coverCards.length; c++) {
            var item = coverCards[c];
            var cardLeft = pLeft + 45 + c * (cardW + cardGap);

            // Fundo do Card
            var sBox = layerBoxes.pathItems.rectangle(cardTop, cardLeft, cardW, cardH);
            sBox.fillColor = cCardBg;
            sBox.stroked = true;
            sBox.strokeColor = cBorder;
            sBox.strokeWidth = 1;

            // Tag do Modelo
            var tagT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 22]);
            tagT.contents = item.tag;
            tagT.textRange.characterAttributes.size = 7.5;
            tagT.textRange.characterAttributes.fillColor = cDarkCyan;
            tagT.textRange.characterAttributes.tracking = 180;

            // Nome do Modelo
            var nameT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 42]);
            nameT.contents = item.name;
            nameT.textRange.characterAttributes.size = 14;
            nameT.textRange.characterAttributes.fillColor = cDark;
            nameT.textRange.characterAttributes.tracking = 50;

            // Imagem do Veículo
            var cImgFile = new File(projectRoot + "/public/assets/models/" + item.file);
            if (cImgFile.exists) {
                try {
                    var placedC = layerPhotos.placedItems.add();
                    placedC.file = cImgFile;
                    placedC.position = [cardLeft + 12, cardTop - 58];
                    placedC.width = 212;
                    placedC.height = 195;
                } catch (eImg) {}
            }

            // Linha Divisória
            var divL = layerBoxes.pathItems.rectangle(cardTop - 268, cardLeft + 16, cardW - 32, 1);
            divL.fillColor = cBorder;
            divL.stroked = false;

            // Especificação Curta
            var specT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 288]);
            specT.contents = item.spec;
            specT.textRange.characterAttributes.size = 8;
            specT.textRange.characterAttributes.fillColor = cSlate;
            specT.textRange.characterAttributes.tracking = 100;

            // Preço
            var priceT = layerCTA.textFrames.pointText([cardLeft + 16, cardTop - 310]);
            priceT.contents = item.price;
            priceT.textRange.characterAttributes.size = 15;
            priceT.textRange.characterAttributes.fillColor = cDark;
            priceT.textRange.characterAttributes.tracking = 50;
        }
    })();

    // ========================================================================
    // 2. PRANCHETA 02: APRESENTAÇÃO DA MARCA & MANIFESTO (Artboard 1)
    // ========================================================================
    (function renderBrandPresentation() {
        var abB = getAbBounds(1);
        var pLeft = abB[0];
        var pTop = abB[1];

        // Coluna Esquerda: Manifesto de Engenharia (Largura ~350pt)
        var colLeft = pLeft + 45;

        // Kicker
        var kickerTxt = layerText.textFrames.pointText([colLeft, pTop - 68]);
        kickerTxt.contents = "MANIFESTO DE ENGENHARIA";
        kickerTxt.textRange.characterAttributes.size = 8;
        kickerTxt.textRange.characterAttributes.fillColor = cDarkCyan;
        kickerTxt.textRange.characterAttributes.tracking = 250;

        // Headline
        var titleTxt = layerText.textFrames.pointText([colLeft, pTop - 95]);
        titleTxt.contents = "O FUTURO NÃO ESPERA.\rELE ANDA EM SILÊNCIO.";
        titleTxt.textRange.characterAttributes.size = 24;
        titleTxt.textRange.characterAttributes.leading = 28;
        titleTxt.textRange.characterAttributes.fillColor = cDark;
        titleTxt.textRange.characterAttributes.tracking = 50;

        // Linha divisória
        var divLine = layerBoxes.pathItems.rectangle(pTop - 158, colLeft, 340, 1);
        divLine.fillColor = cBorder;
        divLine.stroked = false;

        // Parágrafo 1
        var p1Txt = layerText.textFrames.pointText([colLeft, pTop - 176]);
        p1Txt.contents = "A Z8 E-Motion Ltda. é referência nacional na transição\rpara a micromobilidade elétrica inteligente. Nascemos\rcom a convicção de que você não precisa mais ser\rrefém do preço da gasolina ou da manutenção pesada.";
        p1Txt.textRange.characterAttributes.size = 9.5;
        p1Txt.textRange.characterAttributes.leading = 15;
        p1Txt.textRange.characterAttributes.fillColor = cDark;

        // Parágrafo 2
        var p2Txt = layerText.textFrames.pointText([colLeft, pTop - 250]);
        p2Txt.contents = "Cada veículo Z8 é projetado com chassi estrutural em aço,\rbaterias de lítio com gestão inteligente BMS e motores\rBrushless de alto rendimento. Entregamos design sofisticado,\rzero emissões e a menor despesa por quilômetro rodado.";
        p2Txt.textRange.characterAttributes.size = 9.5;
        p2Txt.textRange.characterAttributes.leading = 15;
        p2Txt.textRange.characterAttributes.fillColor = cSlate;

        // 3 Cards de Métricas / KPIs
        var kpis = [
            { val: "R$ 1,80", lbl: "RECARGA COMPLETA", col: cDark },
            { val: "+90%", lbl: "ECONOMIA VS GASOLINA", col: cLime },
            { val: "100%", lbl: "CONTRAN 996", col: cDarkCyan }
        ];

        var kpiW = 106;
        var kpiGap = 11;
        var kpiH = 58;
        var kpiTop = pTop - 340;

        for (var k = 0; k < kpis.length; k++) {
            var kLeft = colLeft + k * (kpiW + kpiGap);

            var kBox = layerBoxes.pathItems.rectangle(kpiTop, kLeft, kpiW, kpiH);
            kBox.fillColor = cCardBg;
            kBox.stroked = true;
            kBox.strokeColor = cBorder;
            kBox.strokeWidth = 0.5;

            var kValT = layerText.textFrames.pointText([kLeft + 10, kpiTop - 20]);
            kValT.contents = kpis[k].val;
            kValT.textRange.characterAttributes.size = 15;
            kValT.textRange.characterAttributes.fillColor = kpis[k].col;
            kValT.textRange.characterAttributes.tracking = 50;

            var kLblT = layerText.textFrames.pointText([kLeft + 10, kpiTop - 42]);
            kLblT.contents = kpis[k].lbl;
            kLblT.textRange.characterAttributes.size = 6.5;
            kLblT.textRange.characterAttributes.fillColor = cSlate;
            kLblT.textRange.characterAttributes.tracking = 120;
        }

        // Coluna Direita: Os 4 Pilares da Marca (Largura ~375pt)
        var rColLeft = pLeft + 420;
        var rColW = 375;
        var rCardH = 88;
        var rTopStart = pTop - 65;
        var rStep = 102;

        var pillars = [
            {
                accent: cCyan,
                title: "TECNOLOGIA DE BATERIA & BMS",
                desc: "Baterias de Lítio leves e removíveis com gestão inteligente BMS\rcontra sobrecarga, curto-circuito e aquecimento. Recarregue em\rqualquer tomada 110V ou 220V em 4 a 6 horas com economia máxima."
            },
            {
                accent: cLime,
                title: "PÓS-VENDA & OFICINA PADRÃO (2 ELEVADORES)",
                desc: "Rede nacional com estoque centralizado de peças a pronta entrega\re assistência técnica homologada equipada com 2 elevadores\rhidráulicos exclusivos para manutenção rápida, segura e profissional."
            },
            {
                accent: cDark,
                title: "SEGURANÇA & CONDUÇÃO URBANA",
                desc: "Freios a disco hidráulicos dianteiros e traseiros de alta precisão,\rsuspensão dimensionada para a pavimentação urbana brasileira\re iluminação full LED com visibilidade máxima diurna e noturna."
            },
            {
                accent: cDarkCyan,
                title: "SUSTENTABILIDADE SEM BUROCRACIA",
                desc: "Veículos 100% ecológicos com emissão zero de gases e ruído zero.\rModelos em conformidade com a Resolução CONTRAN 996 para\rlivre circulação urbana imediata com economia de até R$ 450/mês."
            }
        ];

        for (var pl = 0; pl < pillars.length; pl++) {
            var plTop = rTopStart - (pl * rStep);
            var itemP = pillars[pl];

            // Card principal
            var plBox = layerBoxes.pathItems.rectangle(plTop, rColLeft, rColW, rCardH);
            plBox.fillColor = cCardBg;
            plBox.stroked = true;
            plBox.strokeColor = cBorder;
            plBox.strokeWidth = 0.5;

            // Faixa vertical de destaque (4pt)
            var plAccent = layerBoxes.pathItems.rectangle(plTop, rColLeft, 4, rCardH);
            plAccent.fillColor = itemP.accent;
            plAccent.stroked = false;

            // Título do Pilar
            var plTitleT = layerText.textFrames.pointText([rColLeft + 18, plTop - 20]);
            plTitleT.contents = itemP.title;
            plTitleT.textRange.characterAttributes.size = 9.5;
            plTitleT.textRange.characterAttributes.fillColor = cDark;
            plTitleT.textRange.characterAttributes.tracking = 100;

            // Descrição do Pilar
            var plDescT = layerText.textFrames.pointText([rColLeft + 18, plTop - 38]);
            plDescT.contents = itemP.desc;
            plDescT.textRange.characterAttributes.size = 7.5;
            plDescT.textRange.characterAttributes.leading = 11.5;
            plDescT.textRange.characterAttributes.fillColor = cSlate;
        }
    })();

    // ========================================================================
    // 3. PRANCHETAS 03 A 13: OS 11 MODELOS Z8 (Artboards 2 a 12)
    // ========================================================================
    var modelsData = [
        { id: "z8-tank", name: "Z8 TANK HIGH-SPEED", tag: "TRAIL PERFORMANCE (DB018)", file: "z8_tank_studio.jpg", motor: "2000W High Torque", bat: "60V 20Ah (ate 125Ah)", aut: "Ate 70-240 km", vel: "32 km/h (Max 80)", freio: "Duplo Disco Hidraulico", chassi: "Tubular Duplo de Aco", preco: "R$ 9.500,00" },
        { id: "z8-fx10", name: "Z8 FX-10 SPORT", tag: "URBAN SPORT (DB043)", file: "z8_fx10_studio.jpg", motor: "1500W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 68)", freio: "180mm Duplo Disco", chassi: "Esportivo Reforcado", preco: "R$ 9.000,00" },
        { id: "z8-harley-x12", name: "Z8 HARLEY X12", tag: "CUSTOM CHOPPER (XB-024)", file: "z8_harley_studio.jpg", motor: "1200W 27H 30A", bat: "Litio 60V 20Ah", aut: "Ate 40 km", vel: "32 km/h (Max 50)", freio: "Disco Diant. / Tambor", chassi: "Custom Chopper Aco", preco: "R$ 8.000,00" },
        { id: "z8-u2-delivery", name: "Z8 U2 DELIVERY", tag: "CARGA PESADA (XB-010)", file: "z8_u2_studio.jpg", motor: "2000W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 70)", freio: "220mm Duplo Disco", chassi: "Caixa Central Integrada", preco: "R$ 7.500,00" },
        { id: "z8-n95c", name: "Z8 N95C MAX COMFORT", tag: "SCOOTER EXECUTIVA (DB039)", file: "z8_n95c_studio.jpg", motor: "1200W 27H 30A", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "Disco Diant. / Tambor", chassi: "Aco Protecao Lateral", preco: "R$ 8.000,00" },
        { id: "z8-h26", name: "Z8 H26 STANDARD", tag: "MAIS VENDIDO (DB001)", file: "z8_n7_studio.jpg", motor: "1200W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "180mm Duplo Disco", chassi: "Aco Leve e Resistente", preco: "R$ 9.500,00" },
        { id: "z8-q11", name: "Z8 Q11 COMPACT", tag: "CANDY COM BAU (DB043)", file: "z8_q10_studio.jpg", motor: "1000W 9G", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 45)", freio: "180mm Disco Diant.", chassi: "Bau de Serie na Cor", preco: "R$ 9.300,00" },
        { id: "z8-n710", name: "Z8 N710 URBAN PLUS", tag: "LANCAMENTO (DB045-N710)", file: "z8_n710_studio.jpg", motor: "1200W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "180mm Duplo Disco", chassi: "Urban Plus Reforcado", preco: "R$ 9.500,00" },
        { id: "z8-q10", name: "Z8 Q10 VINTAGE", tag: "RETRO XIAO Q (DB038)", file: "z8_q11_studio.jpg", motor: "1200W 30A", bat: "60V 20Ah (ate 120Ah)", aut: "Ate 50-240 km", vel: "32 km/h (Max 45)", freio: "Disco Diant. / Tambor", chassi: "Aco Estilo Italiano", preco: "R$ 9.800,00" },
        { id: "z8-gs005", name: "Z8 GS-005 BASE NORTE", tag: "E-BIKE UTILITARIA (GS-005)", file: "z8_gs005_studio.jpg", motor: "500W Cobre Puro", bat: "Litio 48V 20Ah", aut: "Ate 40-50 km", vel: "28-32 km/h", freio: "Tambor Diant. e Tras.", chassi: "Aco de Trabalho", preco: "R$ 4.200,00" },
        { id: "z8-diamond", name: "Z8 DIAMOND LUXE", tag: "LITTLE KING KONG (GS-052)", file: "z8_diamond_studio.jpg", motor: "500W Cobre Puro", bat: "Litio 48V 20Ah", aut: "Ate 40-50 km", vel: "32 km/h (Max 40)", freio: "Tambor Diant. e Tras.", chassi: "Aro 16 Pneu 3.0 Largo", preco: "R$ 4.800,00" }
    ];

    for (var m = 0; m < modelsData.length; m++) {
        var pageIndex = m + 2; // Artboards 2..12
        var mData = modelsData[m];
        var abB = getAbBounds(pageIndex);
        var abL = abB[0];
        var abT = abB[1];

        // 1. Card da Imagem do Modelo (Lado Esquerdo)
        var cardW = 460;
        var cardH = 430;
        var cardL = abL + 45;
        var cardT = abT - 60;

        var imgCard = layerBoxes.pathItems.rectangle(cardT, cardL, cardW, cardH);
        imgCard.fillColor = cCardBg;
        imgCard.stroked = true;
        imgCard.strokeColor = cBorder;
        imgCard.strokeWidth = 1;

        // Inserir Imagem Fotográfica
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

        // Tag sobre a imagem
        var tagBox = layerBoxes.pathItems.rectangle(cardT - cardH + 40, cardL + 20, 260, 24);
        tagBox.fillColor = cDark;
        tagBox.stroked = false;

        var tagTxt = layerText.textFrames.pointText([cardL + 30, cardT - cardH + 24]);
        tagTxt.contents = "⚡ " + mData.tag + " // 100% ELÉTRICA";
        tagTxt.textRange.characterAttributes.size = 8;
        tagTxt.textRange.characterAttributes.fillColor = cCyan;
        tagTxt.textRange.characterAttributes.tracking = 150;

        // 2. Coluna de Especificações & Vendas (Lado Direito)
        var rightL = abL + 530;
        var rightT = abT - 60;

        // Categoria
        var catTxt = layerText.textFrames.pointText([rightL, rightT]);
        catTxt.contents = mData.tag;
        catTxt.textRange.characterAttributes.size = 8.5;
        catTxt.textRange.characterAttributes.fillColor = cDarkCyan;
        catTxt.textRange.characterAttributes.tracking = 250;

        // Nome Monumental
        var nameTxt = layerText.textFrames.pointText([rightL, rightT - 22]);
        nameTxt.contents = mData.name;
        nameTxt.textRange.characterAttributes.size = 26;
        nameTxt.textRange.characterAttributes.fillColor = cDark;
        nameTxt.textRange.characterAttributes.tracking = 50;

        // Linha divisória
        var divLine = layerBoxes.pathItems.rectangle(rightT - 55, rightL, 270, 1);
        divLine.fillColor = cBorder;
        divLine.stroked = false;

        // Grid Técnico (6 itens)
        var specs = [
            { l: "MOTOR", v: mData.motor },
            { l: "BATERIA", v: mData.bat },
            { l: "AUTONOMIA", v: mData.aut },
            { l: "VELOCIDADE", v: mData.vel },
            { l: "FREIOS", v: mData.freio },
            { l: "CHASSI", v: mData.chassi }
        ];

        for (var s = 0; s < specs.length; s++) {
            var sCol = s % 2;
            var sRow = Math.floor(s / 2);
            var boxX = rightL + (sCol * 140);
            var boxY = rightT - 70 - (sRow * 52);

            var sBox = layerBoxes.pathItems.rectangle(boxY, boxX, 132, 44);
            sBox.fillColor = cCardBg;
            sBox.stroked = true;
            sBox.strokeColor = cBorder;
            sBox.strokeWidth = 0.5;

            var sLbl = layerText.textFrames.pointText([boxX + 10, boxY - 14]);
            sLbl.contents = specs[s].l;
            sLbl.textRange.characterAttributes.size = 7;
            sLbl.textRange.characterAttributes.fillColor = cSlate;
            sLbl.textRange.characterAttributes.tracking = 150;

            var sVal = layerText.textFrames.pointText([boxX + 10, boxY - 30]);
            sVal.contents = specs[s].v;
            sVal.textRange.characterAttributes.size = 9;
            sVal.textRange.characterAttributes.fillColor = cDark;
        }

        // Caixa de Preço e CTA de Vendas
        var priceBoxY = rightT - 250;
        var pBox = layerBoxes.pathItems.rectangle(priceBoxY, rightL, 275, 75);
        pBox.fillColor = cDark;
        pBox.stroked = false;

        var pLbl = layerText.textFrames.pointText([rightL + 18, priceBoxY - 20]);
        pLbl.contents = "PREÇO SUGERIDO // VENDA DIRETA";
        pLbl.textRange.characterAttributes.size = 7.5;
        pLbl.textRange.characterAttributes.fillColor = cSlate;
        pLbl.textRange.characterAttributes.tracking = 150;

        var pVal = layerCTA.textFrames.pointText([rightL + 18, priceBoxY - 48]);
        pVal.contents = mData.preco;
        pVal.textRange.characterAttributes.size = 20;
        pVal.textRange.characterAttributes.fillColor = cWhite;

        var pEco = layerCTA.textFrames.pointText([rightL + 18, priceBoxY - 62]);
        pEco.contents = "🌱 R$ 1,80 POR RECARGA • ATÉ 90% DE ECONOMIA";
        pEco.textRange.characterAttributes.size = 7;
        pEco.textRange.characterAttributes.fillColor = cLime;
        pEco.textRange.characterAttributes.tracking = 100;
    }

    // ========================================================================
    // 4. PRANCHETA 14: CONTRACAPA INSTITUCIONAL & CONTATOS (Artboard 13)
    // ========================================================================
    (function renderBackCover() {
        var abB = getAbBounds(13);
        var pLeft = abB[0];
        var pTop = abB[1];

        // Headline de Encerramento
        var backTitleT = layerText.textFrames.pointText([pLeft + 45, pTop - 70]);
        backTitleT.contents = "SUA LIBERDADE COMEÇA COM UM TEST-RIDE.";
        backTitleT.textRange.characterAttributes.size = 26;
        backTitleT.textRange.characterAttributes.fillColor = cDark;
        backTitleT.textRange.characterAttributes.tracking = 50;

        // Subtítulo
        var backSubT = layerText.textFrames.pointText([pLeft + 45, pTop - 98]);
        backSubT.contents = "Visite nossa rede de concessionárias credenciadas ou solicite atendimento executivo com nossos especialistas.";
        backSubT.textRange.characterAttributes.size = 10;
        backSubT.textRange.characterAttributes.fillColor = cSlate;

        // 3 Cards Corporativos (Matriz, Vendas, Garantia)
        var backCards = [
            {
                tag: "MATRIZ CORPORATIVA",
                title: "Z8 EMOTION LTDA.",
                lines: "CNPJ: 68.774.164/0001-00\r\rAvenida Dr. Adhemar de Barros, 566\rJardim São Dimas\rSão José dos Campos - SP\rCEP: 12.245-010\r\rForo de Eleição:\rComarca de São José dos Campos - SP"
            },
            {
                tag: "ATENDIMENTO & VENDAS",
                title: "CANAIS DIRETOS",
                lines: "Atendimento comercial executivo para\rvenda direta ao consumidor, frotas corporativas\re suporte a revendedores autorizados:\r\r📱 WhatsApp: (12) 99800-8818\r✉️ E-mail: contato@z8emotion.com\r🌐 Portal Oficial: www.z8emotion.com\r\rAtendimento: Segunda a Sábado"
            },
            {
                tag: "GARANTIA & HOMOLOGAÇÃO",
                title: "SEGURANÇA JURÍDICA",
                lines: "• Conformidade total Resolução CONTRAN 996\r• Termo de Garantia Nacional Z8 Oficial\r• Estoque garantido de peças de reposição\r• Inspeção Pré-Entrega (PDI) de fábrica\r• Oficina com 2 elevadores hidráulicos\r• Chassi com gravação de série estrutural"
            }
        ];

        var cardW = 236;
        var cardGap = 21;
        var cardH = 295;
        var cardTop = pTop - 135;

        for (var b = 0; b < backCards.length; b++) {
            var bCard = backCards[b];
            var cardLeft = pLeft + 45 + b * (cardW + cardGap);

            // Fundo
            var bBox = layerBoxes.pathItems.rectangle(cardTop, cardLeft, cardW, cardH);
            bBox.fillColor = cCardBg;
            bBox.stroked = true;
            bBox.strokeColor = cBorder;
            bBox.strokeWidth = 1;

            // Tag
            var bTagT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 22]);
            bTagT.contents = bCard.tag;
            bTagT.textRange.characterAttributes.size = 7.5;
            bTagT.textRange.characterAttributes.fillColor = cDarkCyan;
            bTagT.textRange.characterAttributes.tracking = 180;

            // Título
            var bTitleT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 42]);
            bTitleT.contents = bCard.title;
            bTitleT.textRange.characterAttributes.size = 13;
            bTitleT.textRange.characterAttributes.fillColor = cDark;
            bTitleT.textRange.characterAttributes.tracking = 50;

            // Linha divisória
            var bDiv = layerBoxes.pathItems.rectangle(cardTop - 52, cardLeft + 16, cardW - 32, 1);
            bDiv.fillColor = cBorder;
            bDiv.stroked = false;

            // Conteúdo
            var bBodyT = layerText.textFrames.pointText([cardLeft + 16, cardTop - 70]);
            bBodyT.contents = bCard.lines;
            bBodyT.textRange.characterAttributes.size = 8;
            bBodyT.textRange.characterAttributes.leading = 13;
            bBodyT.textRange.characterAttributes.fillColor = cSlate;
        }

        // Faixa de Rodapé Institucional
        var trustLine = layerBoxes.pathItems.rectangle(pTop - 450, pLeft + 45, abWidth - 90, 1);
        trustLine.fillColor = cBorder;
        trustLine.stroked = false;

        var trustTxt = layerText.textFrames.pointText([pLeft + 45, pTop - 470]);
        trustTxt.contents = "Z8 EMOTION LTDA. © 2026 — TODOS OS DIREITOS RESERVADOS • FORO EXCLUSIVO: COMARCA DE SÃO JOSÉ DOS CAMPOS - SP • WWW.Z8EMOTION.COM";
        trustTxt.textRange.characterAttributes.size = 7.5;
        trustTxt.textRange.characterAttributes.fillColor = cSlate;
        trustTxt.textRange.characterAttributes.tracking = 120;
    })();

    // ========================================================================
    // 5. SALVAR ARQUIVO NATIVO DO ILLUSTRATOR (.AI) E EXPORTAR PDF
    // ========================================================================
    try {
        var aiPath = projectRoot + "/docs/CATALOGO_MINIMALISTA_VENDAS_Z8_2026.ai";
        var aiFile = new File(aiPath);
        var aiOpts = new IllustratorSaveOptions();
        aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
        aiOpts.pdfCompatible = true;
        doc.saveAs(aiFile, aiOpts);

        // Exportar PDF oficial do Illustrator
        var pdfPath = projectRoot + "/docs/CATALOGO_MINIMALISTA_VENDAS_Z8_2026_ILLUSTRATOR.pdf";
        var pdfFile = new File(pdfPath);
        var pdfOpts = new PDFSaveOptions();
        pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
        pdfOpts.preserveEditability = true;
        doc.saveAs(pdfFile, pdfOpts);

        alert("Sucesso! Catálogo Z8 Minimalista criado no Illustrator com 14 pranchetas completas!\n\nPrancheta 1: Capa\nPrancheta 2: Apresentação da Marca & Manifesto\nPranchetas 3-13: 11 Modelos Z8\nPrancheta 14: Contracapa & Matriz\n\nArquivo salvo em:\n" + aiPath);
    } catch (saveErr) {
        // Alerta silencioso em caso de execução não assistida
    }
}

main();
