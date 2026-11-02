#target illustrator

/**
 * ============================================================================
 * Z8 E-MOTION // CATALOGO OFICIAL 2026 (LAF EDITION - ADOBE ILLUSTRATOR)
 * ENGENHARIA REVERSA COMPLETA DO PADRAO LAF + FICHAS DE FABRICA + ATACADO B2B
 * ============================================================================
 * Estrutura: 26 Pranchetas A4 Paisagem (841.89 pt x 595.28 pt)
 * ============================================================================
 */

function main() {
    var projectRoot = "C:/Users/LENOVO/Desktop/Z8";
    try {
        var modelsDir = projectRoot + "/public/assets/models";
        var cutoutsDir = modelsDir + "/cutouts";
        var pptxDir = modelsDir + "/pptx_extracted";

        var abWidth = 841.89;
        var abHeight = 595.28;
        var abMarginX = 45.0;
        var abMarginY = 45.0;
        var cols = 7;
        var totalPages = 26;

        while (app.documents.length > 0) {
            app.documents[0].close(SaveOptions.DONOTSAVECHANGES);
        }

        var docPreset = new DocumentPreset();
        docPreset.width = abWidth;
        docPreset.height = abHeight;
        docPreset.units = RulerUnits.Millimeters;
        docPreset.colorMode = DocumentColorSpace.RGB;
        docPreset.title = "CATALOGO_OFICIAL_Z8_LAF_EDITION_2026";

        var doc = app.documents.addDocument(DocumentColorSpace.RGB, docPreset);

        function makeRGB(r, g, b) {
            var c = new RGBColor();
            c.red = r; c.green = g; c.blue = b;
            return c;
        }

        var cWhite       = makeRGB(255, 255, 255);
        var cDark        = makeRGB(10, 11, 14);      // #0A0B0E Black Piano
        var cCharcoal    = makeRGB(18, 21, 28);      // #12151C Dark Studio Panel
        var cWholesaleBg = makeRGB(15, 23, 42);      // #0F172A Midnight Blue B2B
        var cCyan        = makeRGB(0, 229, 255);     // #00E5FF Z8 Electric Cyan
        var cDarkCyan    = makeRGB(0, 130, 160);     // #0082A0 Deep Cyan
        var cOrange      = makeRGB(249, 115, 22);    // #F97316 LAF Performance Orange
        var cAmber       = makeRGB(245, 158, 11);    // #F59E0B Amber Accent
        var cLime        = makeRGB(34, 197, 94);     // #22C55E Profit Green
        var cSlate       = makeRGB(100, 116, 139);   // #64748B Muted Label
        var cSilver      = makeRGB(194, 198, 202);   // #C2C6CA Platinum Silver
        var cCardBg      = makeRGB(244, 246, 249);   // #F4F6F9 Telemetry Grid Bg
        var cBorder      = makeRGB(220, 226, 234);   // #DCE2EA Crisp Grid Line

        var fontTitle = null;
        var fontBody = null;
        var fontBold = null;

        try { fontTitle = app.textFonts.getByName("Montserrat-Bold"); } catch(e1) {
            try { fontTitle = app.textFonts.getByName("AdobeClean-Bold"); } catch(e2) {}
        }
        try { fontBody = app.textFonts.getByName("AdobeClean-Regular"); } catch(e3) {
            try { fontBody = app.textFonts.getByName("MyriadPro-Regular"); } catch(e4) {}
        }
        try { fontBold = app.textFonts.getByName("AdobeClean-Bold"); } catch(e5) {
            try { fontBold = app.textFonts.getByName("MyriadPro-Bold"); } catch(e6) {}
        }

        function applyTitleFont(tf) {
            if (fontTitle) { try { tf.textRange.characterAttributes.textFont = fontTitle; } catch(e) {} }
        }
        function applyBodyFont(tf) {
            if (fontBody) { try { tf.textRange.characterAttributes.textFont = fontBody; } catch(e) {} }
        }
        function applyBoldFont(tf) {
            if (fontBold) { try { tf.textRange.characterAttributes.textFont = fontBold; } catch(e) {} }
        }

        var layerBg     = doc.layers[0]; layerBg.name = "01_Background_Panels";
        var layerBoxes  = doc.layers.add(); layerBoxes.name = "02_Grids_e_Badges_LAF";
        var layerPhotos = doc.layers.add(); layerPhotos.name = "03_Fotografia_e_Recortes";
        var layerText   = doc.layers.add(); layerText.name = "04_Tipografia_e_Telemetria";
        var layerCTA    = doc.layers.add(); layerCTA.name = "05_Atacado_B2B_Destaques";

        for (var i = 1; i < totalPages; i++) {
            var colIdx = i % cols;
            var rowIdx = Math.floor(i / cols);
            var left = colIdx * (abWidth + abMarginX);
            var top = -rowIdx * (abHeight + abMarginY);
            doc.artboards.add([left, top, left + abWidth, top - abHeight]);
        }

        function getAbBounds(index) {
            return doc.artboards[index].artboardRect;
        }

        function drawBox(layer, top, left, width, height, fillCol, strokeCol, strokeW) {
            var r = layer.pathItems.rectangle(top, left, width, height);
            if (fillCol !== null && fillCol !== undefined) {
                r.fillColor = fillCol;
            } else {
                r.fillColor = new NoColor();
            }
            if (strokeCol !== null && strokeCol !== undefined && strokeW > 0) {
                r.stroked = true;
                r.strokeColor = strokeCol;
                r.strokeWidth = strokeW;
            } else {
                r.stroked = false;
            }
            return r;
        }

        function drawCircle(layer, top, left, diameter, fillCol, strokeCol, strokeW) {
            var el = layer.pathItems.ellipse(top, left, diameter, diameter);
            if (fillCol !== null && fillCol !== undefined) {
                el.fillColor = fillCol;
            } else {
                el.fillColor = new NoColor();
            }
            if (strokeCol !== null && strokeCol !== undefined && strokeW > 0) {
                el.stroked = true;
                el.strokeColor = strokeCol;
                el.strokeWidth = strokeW;
            } else {
                el.stroked = false;
            }
            return el;
        }

        function addText(layer, x, y, textStr, size, color, fontType, trackingVal, leadingVal) {
            var tf = layer.textFrames.pointText([x, y]);
            tf.contents = textStr;
            var ca = tf.textRange.characterAttributes;
            ca.size = size;
            ca.fillColor = color;
            if (trackingVal !== undefined && trackingVal !== null) {
                ca.tracking = trackingVal;
            }
            if (leadingVal !== undefined && leadingVal !== null) {
                ca.leading = leadingVal;
            }
            if (fontType === "title") applyTitleFont(tf);
            else if (fontType === "bold") applyBoldFont(tf);
            else applyBodyFont(tf);
            return tf;
        }

        function placeImageSafe(layer, fullPath, x, y, maxW, maxH) {
            var f = new File(fullPath);
            if (!f.exists) return null;
            try {
                var p = layer.placedItems.add();
                p.file = f;
                var origW = p.width;
                var origH = p.height;
                if (origW > 0 && origH > 0) {
                    var sW = maxW / origW;
                    var sH = maxH / origH;
                    var scale = (sW < sH) ? sW : sH;
                    var newW = origW * scale;
                    var newH = origH * scale;
                    p.width = newW;
                    p.height = newH;
                    var offsetX = x + (maxW - newW) / 2.0;
                    var offsetY = y - (maxH - newH) / 2.0;
                    p.position = [offsetX, offsetY];
                } else {
                    p.position = [x, y];
                    p.width = maxW;
                    p.height = maxH;
                }
                return p;
            } catch(e) {
                return null;
            }
        }

        function addDarkHeaderFooter(abIndex, pageLabel) {
            var b = getAbBounds(abIndex);
            var pL = b[0]; var pT = b[1];
            drawBox(layerBg, pT, pL, abWidth, abHeight, cDark, null, 0);
            drawBox(layerBoxes, pT - 14, pL + 14, abWidth - 28, abHeight - 28, null, makeRGB(40, 46, 58), 0.6);
            addText(layerText, pL + 36, pT - 34, "Z8 E-MOTION // VEICULOS ELETRICOS", 9, cWhite, "title", 180, null);
            addText(layerText, pL + abWidth - 235, pT - 34, "CATALOGO DE PRODUTOS & ATACADO 2026", 8, cOrange, "bold", 120, null);
            addText(layerText, pL + 36, pT - abHeight + 28, "POWER, DESIGN AND FREEDOM  //  " + pageLabel, 7.5, cOrange, "bold", 150, null);
            var pgStr = (abIndex + 1 < 10 ? "0" : "") + (abIndex + 1) + " / " + totalPages;
            addText(layerText, pL + abWidth - 75, pT - abHeight + 28, pgStr, 8, cSilver, "bold", 150, null);
        }

        // ====================================================================
        // P.01: CAPA OFICIAL (Artboard 0 - Estilo LAF Page 1)
        // ====================================================================
        addDarkHeaderFooter(0, "CAPA OFICIAL");
        (function() {
            var b = getAbBounds(0);
            var pL = b[0]; var pT = b[1];

            drawBox(layerBoxes, pT - 45, pL + 475, 4, 490, cOrange, null, 0);
            drawBox(layerBoxes, pT - 45, pL + 790, 4, 490, cCyan, null, 0);

            placeImageSafe(layerPhotos, cutoutsDir + "/z8_tank_cutout.png", pL + 420, pT - 90, 380, 390);

            drawBox(layerBoxes, pT - 105, pL + 45, 255, 22, cOrange, null, 0);
            addText(layerText, pL + 54, pT - 120, "EDICAO OFICIAL B2B & VAREJO // 2026", 8, cDark, "bold", 180, null);

            addText(layerText, pL + 45, pT - 175, "Z8 E-MOTION", 44, cWhite, "title", 60, null);
            addText(layerText, pL + 45, pT - 212, "VEICULOS ELETRICOS", 20, cCyan, "title", 140, null);

            drawBox(layerBoxes, pT - 234, pL + 45, 320, 2, cOrange, null, 0);

            addText(layerText, pL + 45, pT - 265, "CATALOGO DE PRODUTOS\r& TABELA DE ATACADO 2026", 17, cWhite, "title", 80, 23);

            addText(layerText, pL + 45, pT - 330,
                "Engenharia de alta performance, baterias de litio de longa duracao\re faturamento direto de montadora para lojistas e concessionarias.\r11 Modelos homologados pela Resolucao CONTRAN 996.",
                9.5, cSilver, "body", 20, 15);

            var badges = [
                { t: "11 MODELOS", s: "URBANO AO 2000W" },
                { t: "LOTE MINIMO", s: "10 MOTOS ATACADO" },
                { t: "CONTRAN 996", s: "100% HOMOLOGADO" }
            ];
            for (var i = 0; i < 3; i++) {
                var bx = pL + 45 + i * 115;
                var by = pT - 425;
                drawBox(layerBoxes, by, bx, 105, 52, cCharcoal, cCyan, 0.8);
                addText(layerText, bx + 10, by - 20, badges[i].t, 10, cCyan, "title", 60, null);
                addText(layerText, bx + 10, by - 38, badges[i].s, 7, cWhite, "bold", 100, null);
            }
        })();

        // ====================================================================
        // P.02: A FORCA POR TRAS DA MARCA Z8 (Artboard 1 - Estilo LAF Page 2)
        // ====================================================================
        addDarkHeaderFooter(1, "INSTITUCIONAL & SEDE");
        (function() {
            var b = getAbBounds(1);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 45, pT - 85, "A FORCA POR TRAS", 28, cWhite, "title", 40, null);
            addText(layerText, pL + 45, pT - 118, "DA MARCA Z8 E-MOTION", 28, cOrange, "title", 40, null);

            addText(layerText, pL + 45, pT - 150,
                "Mais do que comercializar veiculos eletricos, a Z8 E-Motion constroi uma base solida\rpara o crescimento sustentavel da mobilidade eletrica no Brasil. Com sede corporativa\rem Sao Jose dos Campos - SP (Polo Tecnologico do Vale do Paraiba), operamos com\rexcelencia logistica, controle tecnico rigoroso (PDI) e suporte integral ao lojista.",
                9, cSilver, "body", 10, 14.5);

            placeImageSafe(layerPhotos, modelsDir + "/z8_u2_warehouse_wide.jpg", pL + 450, pT - 65, 345, 210);

            drawBox(layerBoxes, pT - 245, pL + 45, 385, 58, cWholesaleBg, cOrange, 1);
            addText(layerText, pL + 58, pT - 265, "MATRIZ CORPORATIVA: SAO JOSE DOS CAMPOS - SP", 9, cOrange, "title", 80, null);
            addText(layerText, pL + 58, pT - 283, "Z8 EMOTION LTDA.  |  CNPJ: 68.774.164/0001-00\rAv. Dr. Adhemar de Barros, 566 - Jd. Sao Dimas - CEP 12.245-010", 7.5, cWhite, "body", 20, 11);

            var pillars = [
                { title: "ESTRUTURA PROPRIA", desc: "Operacao solida e preparada\rpara atender todo o Brasil." },
                { title: "CONTROLE DE QUALIDADE", desc: "Inspecao tecnica PDI em cada\rlote de 10 motocicletas." },
                { title: "ESTOQUE NACIONAL", desc: "Veiculos e pecas disponiveis\rpara envio em ate 48h uteis." },
                { title: "SUPORTE TECNICO", desc: "Oficina padrao com 2 elevadores\re atendimento especializado." },
                { title: "EXPANSAO ESTRATEGICA", desc: "Crescimento estruturado com\rexclusividade territorial." }
            ];
            for (var p = 0; p < 5; p++) {
                var px = pL + 45 + p * 152;
                var py = pT - 335;
                drawBox(layerBoxes, py, px, 142, 165, cCharcoal, makeRGB(50, 58, 72), 0.7);
                drawCircle(layerBoxes, py - 18, px + 16, 28, null, cOrange, 1.5);
                addText(layerText, px + 24, py - 36, "0" + (p + 1), 10, cOrange, "title", 40, null);
                addText(layerText, px + 14, py - 75, pillars[p].title, 8, cWhite, "title", 40, null);
                drawBox(layerBoxes, py - 84, px + 14, 30, 2, cOrange, null, 0);
                addText(layerText, px + 14, py - 105, pillars[p].desc, 7.5, cSilver, "body", 10, 12);
            }
        })();

        // ====================================================================
        // P.03: NUMEROS QUE MOVEM O FUTURO (Artboard 2 - Estilo LAF Page 3)
        // ====================================================================
        addDarkHeaderFooter(2, "NUMEROS & MERCADO");
        (function() {
            var b = getAbBounds(2);
            var pL = b[0]; var pT = b[1];

            placeImageSafe(layerPhotos, modelsDir + "/z8_tank_paulista_wide.jpg", pL + 36, pT - 65, 360, 460);

            var rX = pL + 420;
            addText(layerText, rX, pT - 85, "NUMEROS QUE", 26, cWhite, "title", 40, null);
            addText(layerText, rX, pT - 116, "MOVEM O FUTURO", 26, cOrange, "title", 40, null);
            addText(layerText, rX, pT - 140, "Mais que veiculos eletricos, uma estrutura pronta para alta rentabilidade.", 8.5, cSilver, "body", 20, null);

            var cards = [
                { t: "11 MODELOS", s: "Portfolio completo do urbano\rao high-speed de 2000W" },
                { t: "ATE 100% MARKUP", s: "Margens reais de R$ 2.800\ra R$ 4.200 por moto vendida" },
                { t: "SUPORTE POS-VENDA", s: "Garantia nacional Z8 e\rlaudos tecnicos imediatos" },
                { t: "PECAS EM ESTOQUE", s: "Controladores, baterias,\rpaineis e carenagens no Brasil" },
                { t: "TECNOLOGIA NFC", s: "Partida sem chave, alarme\ranti-furto e painel LCD" },
                { t: "CONTRAN 996", s: "Parecer juridico completo\re circulacao 100% legal" }
            ];

            for (var c = 0; c < 6; c++) {
                var col = c % 2;
                var row = Math.floor(c / 2);
                var cx = rX + col * 192;
                var cy = pT - 172 - row * 112;
                drawBox(layerBoxes, cy, cx, 180, 96, cCharcoal, cOrange, 0.8);
                addText(layerText, cx + 14, cy - 28, cards[c].t, 10.5, cOrange, "title", 40, null);
                addText(layerText, cx + 14, cy - 52, cards[c].s, 8, cWhite, "body", 10, 12);
            }
        })();

        // ====================================================================
        // P.04: MOBILIDADE COM PROPOSITO // FOSHAN & BASE NORTE (Artboard 3)
        // ====================================================================
        addDarkHeaderFooter(3, "POLOS INDUSTRIAIS GLOBAIS");
        (function() {
            var b = getAbBounds(3);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 45, pT - 85, "MOBILIDADE COM PROPOSITO", 25, cOrange, "title", 40, null);
            addText(layerText, pL + 45, pT - 115,
                "A Z8 E-Motion opera em alianca direta com os dois maiores polos industriais de\rmotocicletas eletricas da Asia: as Bases de Foshan & Huizhou e a Base Norte.\rCada veiculo e produzido em linhas automatizadas com chassi de aco de alto carbono.",
                9, cWhite, "body", 15, 14);

            drawBox(layerBoxes, pT - 165, pL + 45, 365, 240, cCharcoal, cCyan, 1);
            drawBox(layerBoxes, pT - 165, pL + 45, 365, 32, cCyan, null, 0);
            addText(layerText, pL + 60, pT - 185, "POLO 01 // BASES DE FOSHAN & HUIZHOU", 9.5, cDark, "title", 100, null);
            addText(layerText, pL + 60, pT - 218, "Especialidade: Scooters Urbanas, Executivas, Retro e Cargo", 8.5, cCyan, "bold", 40, null);
            addText(layerText, pL + 60, pT - 242,
                "- Z8 Q11 Compact (PN: DB043) - 1000W 9G - 109 pcs/40HQ\r- Z8 Q10 Xiao Q (PN: DB038) - 1200W 30A - 109 a 130 pcs/40HQ\r- Z8 H26 / N7 Standard (PN: DB001) - 1200W 12G - 130 pcs/40HQ\r- Z8 N95C Max Comfort (PN: DB039) - 1200W 30A - 112 pcs/40HQ\r- Z8 FX-10 Sport (PN: DB043) - 1500W 12G-38A - 90 pcs/40HQ\r- Z8 U2 Delivery Cargo (PN: XB-010) - 2000W 12G - 216 pcs/40HQ\r- Z8 N710 Urban Plus (PN: DB045) - 1200W High Performance",
                8, cWhite, "body", 10, 15.5);

            drawBox(layerBoxes, pT - 165, pL + 430, 365, 240, cCharcoal, cOrange, 1);
            drawBox(layerBoxes, pT - 165, pL + 430, 365, 32, cOrange, null, 0);
            addText(layerText, pL + 445, pT - 185, "POLO 02 // BASE NORTE (NORTHERN BASE)", 9.5, cDark, "title", 100, null);
            addText(layerText, pL + 445, pT - 218, "Especialidade: High-Speed Trail, Custom Chopper e E-Bikes", 8.5, cOrange, "bold", 40, null);
            addText(layerText, pL + 445, pT - 242,
                "- Z8 Tank High-Speed (PN: DB018) - 2000W 15G - 85 pcs/40HQ\r- Z8 Harley X12 Custom (PN: XB-024) - 1200W 30A - 216 pcs/40HQ\r- Z8 GS-005 Golden Eagle (PN: GS-005) - 500W Cobre Puro - 294 pcs/40HQ\r- Z8 Diamond Luxe King Kong (PN: GS-052) - 500W - 294 pcs/40HQ\r\rPadrao de Exportacao Internacional:\r- Embalagens SKD reforcadas em aco e papelao multi-camada\r- Certificacao ISO 9001 e componentes homologados Inmetro",
                8, cWhite, "body", 10, 15.5);

            var stats = [
                { v: "2 POLOS", l: "FOSHAN/HUIZHOU & NORTE" },
                { v: "85 a 294 un.", l: "CAPACIDADE POR CONTAINER 40HQ" },
                { v: "ACO CARBONO", l: "CHASSIS DE ALTA DENSIDADE" },
                { v: "ATE 2000W", l: "MOTORES BRUSHLESS PURO COBRE" }
            ];
            for (var s = 0; s < 4; s++) {
                var sx = pL + 45 + s * 190;
                drawBox(layerBoxes, pT - 430, sx, 180, 75, cWholesaleBg, makeRGB(60, 70, 90), 0.6);
                addText(layerText, sx + 14, pT - 460, stats[s].v, 14, cCyan, "title", 40, null);
                addText(layerText, sx + 14, pT - 482, stats[s].l, 7, cSilver, "bold", 80, null);
            }
        })();

        // ====================================================================
        // P.05: TECNOLOGIA DE BATERIAS DE LITIO Z8 (Artboard 4 - LAF Page 5)
        // ====================================================================
        addDarkHeaderFooter(4, "TECNOLOGIA DE BATERIAS");
        (function() {
            var b = getAbBounds(4);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 45, pT - 80, "POR QUE AS BATERIAS DE LITIO Z8", 23, cWhite, "title", 40, null);
            addText(layerText, pL + 45, pT - 108, "(48V / 60V / 72V) SAO MUITO MELHORES?", 23, cOrange, "title", 40, null);

            addText(layerText, pL + 45, pT - 142,
                "Todos os 11 modelos do catalogo Z8 E-Motion sao equipados de serie com baterias\rde Litio de alta densidade (48V 20Ah, 60V 20Ah ou 72V 20Ah), alem de suportarem\rpacks modulares de longa distancia de ate 60V 120Ah / 125Ah (240 km de autonomia).",
                9, cSilver, "body", 15, 14);

            var tTop = pT - 195;
            var tLeft = pL + 45;
            var rowH = 38;
            var headers = ["CARACTERISTICA TECNICA", "LITIO Z8 HIGH-DENSITY (SERIE)", "CHUMBO-ACIDO / COMUM"];

            drawBox(layerBoxes, tTop, tLeft, 750, 34, cOrange, null, 0);
            addText(layerText, tLeft + 14, tTop - 21, headers[0], 8.5, cDark, "title", 80, null);
            addText(layerText, tLeft + 235, tTop - 21, headers[1], 8.5, cDark, "title", 80, null);
            addText(layerText, tLeft + 510, tTop - 21, headers[2], 8.5, cDark, "title", 80, null);

            var rows = [
                ["Ciclos de Vida Util", "[OK] 1.500 a 3.000+ ciclos (5 a 8 anos)", "300 a 500 ciclos (1 a 1,5 ano)"],
                ["Peso do Pack de Energia", "[OK] Ultra leve (7 kg a 9 kg - Removivel)", "Pesado (28 kg a 38 kg fixo)"],
                ["Capacidade & Expansao", "[OK] 60V 20Ah ate 60V 125Ah (240 km)", "Limitado a 40-50 km sem upgrade"],
                ["Seguranca Termica & BMS", "[OK] BMS Inteligente Anti-Curto e Sobrecarga", "Sem gerenciamento eletronico ativo"],
                ["Tempo de Recarga", "[OK] Rapida: 4 a 6 horas (Tomada 110V/220V)", "Lenta: 8 a 12 horas com efeito memoria"],
                ["Custo por Recarga Completa", "[OK] Apenas R$ 1,80 a R$ 2,50 na tomada", "Maior perda energetica por calor"]
            ];

            for (var r = 0; r < rows.length; r++) {
                var ry = tTop - 34 - r * rowH;
                var bgCol = (r % 2 === 0) ? cCharcoal : makeRGB(26, 32, 44);
                drawBox(layerBoxes, ry, tLeft, 750, rowH, bgCol, makeRGB(45, 55, 72), 0.5);
                addText(layerText, tLeft + 14, ry - 23, rows[r][0], 8.5, cWhite, "bold", 20, null);
                addText(layerText, tLeft + 235, ry - 23, rows[r][1], 8.5, cCyan, "bold", 20, null);
                addText(layerText, tLeft + 510, ry - 23, rows[r][2], 8.5, cSlate, "body", 20, null);
            }

            drawBox(layerBoxes, pT - 478, tLeft, 750, 42, cWholesaleBg, cCyan, 0.8);
            addText(layerText, tLeft + 16, pT - 503,
                "DESTAQUE B2B: Nossos modelos Z8 Tank (DB018) e Z8 Q10 Xiao Q (DB038) possuem cofre compativel com baterias de Litio de ate 125Ah (240 km de autonomia real)!",
                8, cWhite, "bold", 20, null);
        })();

        // ====================================================================
        // P.06: SUPORTE, POS-VENDA & OFICINA 2 ELEVADORES (Artboard 5)
        // ====================================================================
        addDarkHeaderFooter(5, "POS-VENDA & OFICINA TECNICA");
        (function() {
            var b = getAbBounds(5);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 45, pT - 85, "SUPORTE E POS-VENDA", 28, cWhite, "title", 40, null);
            addText(layerText, pL + 45, pT - 118, "SEMPRE COM VOCE", 28, cOrange, "title", 40, null);

            addText(layerText, pL + 45, pT - 155,
                "Na Z8 E-Motion, a venda do lote de atacado e apenas o inicio da parceria.\rEstruturamos um ecossistema completo de pos-venda, portal digital de abertura\rde Ordens de Servico (OS) em tempo real e padrao arquitetonico de oficina.",
                9, cSilver, "body", 15, 14.5);

            var boxes = [
                {
                    t: "01 // PADRAO OBRIGATORIO DE 2 ELEVADORES",
                    d: "Toda concessionaria Z8 opera com no minimo 2 elevadores hidraulicos/pneumaticos\r(em linha nos modulos de 2m ou lado a lado Twin Bay nas lojas de 5m a 14,90m),\rgarantindo execucao rapida de PDI, revisoes programadas e diagnostico de 72V."
                },
                {
                    t: "02 // PORTAL DIGITAL DE GARANTIA E ORDENS DE SERVICO (OS)",
                    d: "Sistema exclusivo integrado na nuvem onde o mecanico da franquia registra\ro chassi, envia fotos/videos do componente (controlador, BMS, motor Hall) e\rrecebe aprovacao expressa da diretoria tecnica para despacho imediato."
                },
                {
                    t: "03 // CHECKLIST DE ENTREGA TECNICA (PDI) & TREINAMENTO",
                    d: "Fornecemos os manuais completos de PDI, Termo de Garantia Nacional Z8 e\rParecer Regulatorio CONTRAN 996. Sua equipe comercial e tecnica recebe\rcapacitacao integral para vender e dar manutencao com seguranca total."
                }
            ];

            for (var i = 0; i < 3; i++) {
                var by = pT - 215 - i * 95;
                drawBox(layerBoxes, by, pL + 45, 450, 82, cCharcoal, cOrange, 0.8);
                addText(layerText, pL + 60, by - 22, boxes[i].t, 9, cOrange, "title", 60, null);
                addText(layerText, pL + 60, by - 42, boxes[i].d, 8, cWhite, "body", 10, 12);
            }

            placeImageSafe(layerPhotos, modelsDir + "/z8_fx10_sjc_bodywork.jpg", pL + 520, pT - 85, 275, 200);
            placeImageSafe(layerPhotos, modelsDir + "/z8_tank_paulista_headlight.jpg", pL + 520, pT - 300, 275, 200);
        })();

        // ====================================================================
        // P.07: FILOSOFIA Z8 // POWER, DESIGN & FREEDOM (Artboard 6)
        // ====================================================================
        addDarkHeaderFooter(6, "MANIFESTO DE MARCA");
        (function() {
            var b = getAbBounds(6);
            var pL = b[0]; var pT = b[1];

            placeImageSafe(layerBg, modelsDir + "/z8_tank_minas_wide.jpg", pL + 36, pT - 55, 770, 480);
            drawBox(layerBoxes, pT - 120, pL + 60, 460, 280, cDark, cOrange, 1.2);

            addText(layerText, pL + 85, pT - 175, "Z8 E-MOTION", 38, cWhite, "title", 80, null);
            addText(layerText, pL + 85, pT - 208, "POWER, DESIGN AND FREEDOM", 13, cOrange, "title", 200, null);
            drawBox(layerBoxes, pT - 222, pL + 85, 180, 2, cCyan, null, 0);

            addText(layerText, pL + 85, pT - 255,
                "Mais do que um slogan, essa e a essencia da Z8 E-Motion.\rAcreditamos que se locomover deve ser simples, acessivel,\rsustentavel e cheio de personalidade.\r\rCada modelo Z8 e projetado para transformar a rotina urbana\rem uma experiencia silenciosa, potente e livre de combustiveis\rfosseis - gerando orgulho para quem pilota e prosperidade\rpara o lojista que lidera essa revolucao em sua cidade.",
                9, cSilver, "body", 15, 14);
        })();

        // ====================================================================
        // P.08: A ESCOLHA INTELIGENTE (Artboard 7 - Estilo LAF Page 8)
        // ====================================================================
        addDarkHeaderFooter(7, "A ESCOLHA INTELIGENTE");
        (function() {
            var b = getAbBounds(7);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 65, pT - 110, "A ESCOLHA", 24, cOrange, "title", 60, null);
            addText(layerText, pL + 55, pT - 170, "INTELI-", 58, cOrange, "title", 40, null);
            addText(layerText, pL + 55, pT - 230, "GENTE.", 58, cWhite, "title", 40, null);

            placeImageSafe(layerPhotos, cutoutsDir + "/z8_fx10_cutout.png", pL + 430, pT - 65, 370, 280);

            var cols5 = [
                { t: "ECONOMIA", d: "Mais eficiencia,\rmenos custo.\rRecarga completa\ra partir de R$ 1,80." },
                { t: "SUSTENTABILIDADE", d: "Zero emissao de CO2,\rzero poluicao sonora.\rEscolhas que mudam\ro futuro da cidade." },
                { t: "TECNOLOGIA", d: "Motores Brushless de\rate 2000W, NFC Keyless,\rdisplay LCD e freios\rhidraulicos a disco." },
                { t: "RENTABILIDADE B2B", d: "Precos de atacado\rdiretos de montadora\rcom margem bruta de\rate R$ 4.200/moto." },
                { t: "DESIGN PREMIUM", d: "Estetica Bauhaus\rautomotiva que inspira\re impressiona em\rcada detalhe." }
            ];

            for (var i = 0; i < 5; i++) {
                var cx = pL + 45 + i * 152;
                var cy = pT - 345;
                if (i > 0) {
                    drawBox(layerBoxes, cy, cx - 8, 0.7, 155, makeRGB(60, 68, 82), null, 0);
                }
                drawCircle(layerBoxes, cy - 5, cx + 45, 34, null, cOrange, 1.5);
                addText(layerText, cx + 56, cy - 26, "0" + (i + 1), 11, cOrange, "title", 40, null);
                addText(layerText, cx + 10, cy - 60, cols5[i].t, 8, cWhite, "title", 40, null);
                drawBox(layerBoxes, cy - 68, cx + 10, 28, 2, cOrange, null, 0);
                addText(layerText, cx + 10, cy - 88, cols5[i].d, 7.5, cSilver, "body", 10, 12);
            }
        })();

        // ====================================================================
        // FUNCAO CONSTRUTORA DE DIVISORES DE LINHA (Estilo LAF Pages 9, 13, 24, 28, 31)
        // ====================================================================
        function buildCategoryDivider(abIndex, lineTitle, accentCol, subTitle, bodyText, bullets, img1, img2) {
            addDarkHeaderFooter(abIndex, "DIVISOR DE CATEGORIA // " + lineTitle);
            var b = getAbBounds(abIndex);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 45, pT - 120, "LINHA", 22, cSilver, "body", 180, null);
            addText(layerText, pL + 45, pT - 172, lineTitle, 46, accentCol, "title", 40, null);

            addText(layerText, pL + 45, pT - 215, subTitle, 11, cWhite, "bold", 40, 16);
            drawBox(layerBoxes, pT - 255, pL + 45, 85, 2.5, accentCol, null, 0);

            addText(layerText, pL + 45, pT - 280, bodyText, 8.5, cSilver, "body", 15, 14);

            for (var i = 0; i < bullets.length; i++) {
                var bx = pL + 45 + i * 92;
                var by = pT - 420;
                drawBox(layerBoxes, by, bx, 84, 68, cCharcoal, accentCol, 0.8);
                addText(layerText, bx + 8, by - 22, "[+]", 10, accentCol, "title", 0, null);
                addText(layerText, bx + 8, by - 42, bullets[i], 6.5, cWhite, "bold", 30, 10);
            }

            if (img1) placeImageSafe(layerPhotos, img1, pL + 410, pT - 140, 195, 290);
            if (img2) placeImageSafe(layerPhotos, img2, pL + 575, pT - 115, 225, 325);
        }

        // ====================================================================
        // FUNCAO MASTER: FICHA DE PRODUTO SPLIT 40/60 (ESTILO LAF + FABRICA + ATACADO)
        // ====================================================================
        function buildProductSheetLAF(abIndex, m) {
            var b = getAbBounds(abIndex);
            var pL = b[0]; var pT = b[1];
            var leftW = 330;
            var rightW = abWidth - leftW;
            var rL = pL + leftW;

            // 1. PAINEL ESQUERDO (40% - ESCURO ATMOSFERICO)
            drawBox(layerBg, pT, pL, leftW, abHeight, cCharcoal, null, 0);

            // Pilula Vertical de Categoria (Estilo LAF)
            drawBox(layerBoxes, pT, pL + 20, 24, 150, m.catColor, null, 0);
            var catTf = addText(layerText, pL + 25, pT - 110, m.catShort, 8.5, cDark, "title", 140, null);
            try { catTf.rotate(90); catTf.position = [pL + 26, pT - 35]; } catch(eRot) {}

            // Codigo PN e Base Industrial
            addText(layerText, pL + 54, pT - 28, "PN: " + m.pn + "  //  " + m.base, 7.5, cCyan, "bold", 100, null);

            // Nome Monumental do Modelo
            addText(layerText, pL + 52, pT - 64, m.shortTitle, 29, cWhite, "title", 30, null);
            addText(layerText, pL + 54, pT - 86, m.fullName, 9, cSilver, "bold", 60, null);
            drawBox(layerBoxes, pT - 94, pL + 54, 250, 1.5, m.catColor, null, 0);

            // Foto Principal no Painel Esquerdo
            placeImageSafe(layerPhotos, m.leftHeroImg, pL + 16, pT - 106, leftW - 32, 265);

            // CAIXA MONUMENTAL DE ATACADO B2B NO PAINEL ESQUERDO
            var wBoxTop = pT - 385;
            drawBox(layerCTA, wBoxTop, pL + 16, leftW - 32, 158, cWholesaleBg, m.catColor, 1.2);
            drawBox(layerCTA, wBoxTop, pL + 16, leftW - 32, 5, m.catColor, null, 0);

            addText(layerCTA, pL + 28, wBoxTop - 20, "VALOR DE ATACADO UNITARIO (B2B)", 7.5, cCyan, "bold", 130, null);
            addText(layerCTA, pL + 28, wBoxTop - 52, m.wholesalePrice, 26, cWhite, "title", 30, null);

            drawBox(layerCTA, wBoxTop - 64, pL + 28, leftW - 56, 0.6, makeRGB(45, 60, 85), null, 0);

            addText(layerCTA, pL + 28, wBoxTop - 80, "LOTE MINIMO (10 UN.): " + m.lote10Price, 8.5, cLime, "title", 40, null);
            addText(layerCTA, pL + 28, wBoxTop - 98, "Varejo Sugerido: " + m.retailPrice + "   |   Lucro: " + m.profitUnit, 7.5, cWhite, "bold", 20, null);
            addText(layerCTA, pL + 28, wBoxTop - 116, "Container 40HQ: " + m.containerQty + "   |   Pacote: " + m.packageSize, 7, cSilver, "body", 20, null);
            addText(layerCTA, pL + 28, wBoxTop - 134, "Voltagem Suportada: " + m.voltageSupport, 7, cOrange, "bold", 30, null);

            // Rodape Esquerdo
            addText(layerText, pL + 16, pT - abHeight + 22, "Z8EMOTION.COM  //  CONTRAN 996", 7.5, cSilver, "bold", 120, null);

            // 2. PAINEL DIREITO (60% - ESTUDIO BRANCO + 4 BADGES + TELEMETRIA 12/13 ITENS)
            drawBox(layerBg, pT, rL, rightW, abHeight, cWhite, null, 0);

            addText(layerText, rL + 20, pT - 24, "ESPECIFICACOES OFICIAIS DE FABRICA  //  " + m.factoryRef, 8, cSlate, "bold", 90, null);
            var pgNumStr = (abIndex + 1 < 10 ? "0" : "") + (abIndex + 1) + " / " + totalPages;
            addText(layerText, pL + abWidth - 65, pT - 24, pgNumStr, 8.5, cDark, "title", 120, null);
            drawBox(layerBoxes, pT - 32, rL + 20, rightW - 40, 0.8, cBorder, null, 0);

            if (m.lineupImg) {
                placeImageSafe(layerPhotos, m.rightMainImg, rL + 20, pT - 40, 275, 208);
                drawBox(layerBoxes, pT - 254, rL + 20, 275, 92, cCardBg, cBorder, 0.6);
                addText(layerText, rL + 28, pT - 267, "VARIACOES E CORES DE FABRICA:", 6.5, cDarkCyan, "bold", 120, null);
                placeImageSafe(layerPhotos, m.lineupImg, rL + 24, pT - 272, 267, 70);
            } else {
                placeImageSafe(layerPhotos, m.rightMainImg, rL + 20, pT - 42, 275, 300);
            }

            // 4 Badges Circulares de Zoom / Destaques Tecnicos
            var calloutX = rL + 305;
            for (var c = 0; c < 4; c++) {
                var cy = pT - 42 - c * 78;
                drawBox(layerBoxes, cy, calloutX, 186, 70, cCardBg, cBorder, 0.8);
                drawCircle(layerBoxes, cy - 13, calloutX + 10, 42, cDark, m.catColor, 2.0);
                addText(layerText, calloutX + 23, cy - 38, "0" + (c + 1), 10.5, cWhite, "title", 40, null);

                addText(layerText, calloutX + 60, cy - 22, m.callouts[c].title, 7, cDark, "title", 30, null);
                addText(layerText, calloutX + 60, cy - 38, m.callouts[c].desc, 6.5, cSlate, "body", 10, 10);
            }

            // 3. GRADE DE TELEMETRIA PADRONIZADA EM 2 LINHAS (ESTILO LAF)
            var gridTop = pT - 358;
            var gridLeft = rL + 20;
            var gridW = rightW - 40;
            var gridH = 185;

            drawBox(layerBoxes, gridTop, gridLeft, gridW, gridH, cCardBg, cBorder, 1.0);
            drawBox(layerBoxes, gridTop - 90, gridLeft + 10, gridW - 20, 0.8, cBorder, null, 0);

            var colW1 = gridW / 6.0;
            for (var i1 = 0; i1 < 6; i1++) {
                var gx = gridLeft + i1 * colW1;
                var gy = gridTop - 12;
                if (i1 > 0) {
                    drawBox(layerBoxes, gridTop - 10, gx, 0.6, 72, cBorder, null, 0);
                }
                drawBox(layerBoxes, gy, gx + 8, 18, 4, m.catColor, null, 0);
                addText(layerText, gx + 8, gy - 16, m.row1[i1].label, 6.5, cDark, "title", 30, null);
                addText(layerText, gx + 8, gy - 32, m.row1[i1].val1, 7.5, cDarkCyan, "bold", 10, null);
                addText(layerText, gx + 8, gy - 46, m.row1[i1].val2, 6.5, cSlate, "body", 10, null);
                if (m.row1[i1].val3) {
                    addText(layerText, gx + 8, gy - 58, m.row1[i1].val3, 6, cSlate, "body", 10, null);
                }
            }

            var colW2 = gridW / 6.0;
            for (var i2 = 0; i2 < 6; i2++) {
                var gx2 = gridLeft + i2 * colW2;
                var gy2 = gridTop - 102;
                if (i2 > 0) {
                    drawBox(layerBoxes, gridTop - 98, gx2, 0.6, 76, cBorder, null, 0);
                }
                drawBox(layerBoxes, gy2, gx2 + 8, 18, 4, cDark, null, 0);
                addText(layerText, gx2 + 8, gy2 - 16, m.row2[i2].label, 6.5, cDark, "title", 30, null);
                addText(layerText, gx2 + 8, gy2 - 32, m.row2[i2].val1, 7.5, cDark, "bold", 10, null);
                addText(layerText, gx2 + 8, gy2 - 46, m.row2[i2].val2, 6.5, cSlate, "body", 10, null);
                if (m.row2[i2].val3) {
                    addText(layerText, gx2 + 8, gy2 - 58, m.row2[i2].val3, 6, cSlate, "body", 10, null);
                }
            }

            addText(layerText, gridLeft, pT - abHeight + 22, "Consulte as cores disponiveis com nossa equipe comercial  |  Faturamento Direto CNPJ", 7, cSlate, "bold", 30, null);
            addText(layerText, pL + abWidth - 155, pT - abHeight + 22, "GARANTIA NACIONAL Z8", 7.5, cDark, "title", 90, null);
        }

        // ====================================================================
        // P.09: DIVISOR LINHA PERFORMANCE (Artboard 8)
        // ====================================================================
        buildCategoryDivider(
            8,
            "PERFORMANCE",
            cOrange,
            "POTENCIA QUE TE MOVE.\rTECNOLOGIA QUE TE LEVA MAIS LONGE.",
            "A Linha Z8 Performance foi desenvolvida para quem exige o maximo\rda mobilidade eletrica. Motores de 1500W a 2000W de alto torque,\rcontroladores de 12G a 15G e freios a disco hidraulicos duplos para\rentregar velocidade, autonomia e seguranca em qualquer terreno.",
            ["ALTA\rPERFORMANCE", "BATERIA ATE\r125Ah / 240KM", "DUPLO DISCO\rHIDRAULICO", "TECNOLOGIA\rNFC & LCD"],
            cutoutsDir + "/z8_fx10_cutout.png",
            cutoutsDir + "/z8_tank_cutout.png"
        );

        var allModels = [
            // 1. Z8 TANK HIGH-SPEED (Artboard 9 -> Page 10)
            {
                abIndex: 9,
                pn: "DB018",
                base: "BASE NORTE (NORTHERN BASE)",
                factoryRef: "MODELO DB018 // TANK HIGH-SPEED 2000W",
                catShort: "PERFORM.",
                catColor: cOrange,
                shortTitle: "Z8 TANK",
                fullName: "Z8 TANK HIGH-SPEED 2000W TRAIL",
                leftHeroImg: modelsDir + "/z8_tank_paulista_wide.jpg",
                rightMainImg: pptxDir + "/image19.png",
                lineupImg: modelsDir + "/z8_tank_minas_bodywork.jpg",
                wholesalePrice: "R$ 7.500,00",
                lote10Price: "R$ 75.000,00",
                retailPrice: "R$ 11.500,00",
                profitUnit: "+R$ 4.000,00",
                containerQty: "85 pcs / 40HQ",
                packageSize: "179x57x83 cm",
                voltageSupport: "60V / 72V (Suporta ate 125Ah)",
                callouts: [
                    { title: "FAROIS DUPLOS LED HALO", desc: "Iluminacao off-road de longo\ralcance com grade frontal." },
                    { title: "MOTOR 2000W + 15G", desc: "Torque extremo para subidas\ringremes e velocidade 80km/h." },
                    { title: "PNEUS NEVE 110/70-12", desc: "Pneus Hot Melt texturizados\rpara asfalto e terra." },
                    { title: "SISTEMA NFC + ALARME", desc: "Partida sem chave por cartao\rNFC e antifurto remoto." }
                ],
                row1: [
                    { label: "MOTOR", val1: "2000 W", val2: "High Torque", val3: "Sem escova" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Chumbo 72V20Ah", val3: "Max: 60V125Ah" },
                    { label: "CONTROLADOR", val1: "15G Modulo", val2: "Alta corrente", val3: "Reforcado" },
                    { label: "FREIO", val1: "Duplo Disco", val2: "Hidraulico a oleo", val3: "Diant. e Tras." },
                    { label: "PNEU", val1: "110/70-12", val2: "Textura Neve", val3: "Hot Melt Vacuo" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 80 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 70 km", val2: "Com 60V125Ah:", val3: "Ate 240 km" },
                    { label: "AMORTECEDOR", val1: "Hidr. Grosso", val2: "Diant. Reforcado", val3: "Mola Damping T." },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Tubular Duplo", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "179x57x83 cm", val2: "85 pcs / 40HQ", val3: "Exportacao SKD" },
                    { label: "PESO s/ BAT.", val1: "80 kg (Liq.)", val2: "90 kg (Bruto)", val3: "Chassi Trail" },
                    { label: "INTELIGENCIA", val1: "NFC + Alarme", val2: "Controle Remoto", val3: "Painel Digital" }
                ]
            },
            // 2. Z8 FX-10 SPORT (Artboard 10 -> Page 11)
            {
                abIndex: 10,
                pn: "DB043",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB043 // FX-10 SPORT 1500W",
                catShort: "PERFORM.",
                catColor: cOrange,
                shortTitle: "FX-10 SPORT",
                fullName: "Z8 FX-10 SPORT 1500W BRUSHLESS",
                leftHeroImg: modelsDir + "/z8_fx10_sjc_wide.jpg",
                rightMainImg: pptxDir + "/image15.png",
                lineupImg: pptxDir + "/image16.png",
                wholesalePrice: "R$ 6.700,00",
                lote10Price: "R$ 67.000,00",
                retailPrice: "R$ 9.000,00",
                profitUnit: "+R$ 2.300,00",
                containerQty: "90 pcs / 40HQ",
                packageSize: "162x50x85 cm",
                voltageSupport: "60V 20Ah Litio de Serie",
                callouts: [
                    { title: "CARENAGEM SPORT FX", desc: "Design aerodinamico agressivo\rem 6 cores metalicas." },
                    { title: "MOTOR 1500W + 12G-38A", desc: "Aceleracao progressiva ate\r68 km/h em pista." },
                    { title: "DUPLO DISCO 180mm", desc: "Freios a disco hidraulicos\rdianteiro e traseiro 180mm." },
                    { title: "PNEU LARGO 130/60-10", desc: "Pneu de vacuo esportivo de\rmaior aderencia em curvas." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1500 W", val2: "Sem escova", val3: "High Speed" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Alta Descarga", val3: "Removivel" },
                    { label: "CONTROLADOR", val1: "12G-38A", val2: "Modulo Sport", val3: "38 Amperes" },
                    { label: "FREIO", val1: "Disco 180mm", val2: "Hidraulico Oleo", val3: "Diant. e Tras." },
                    { label: "PNEU", val1: "130/60-10", val2: "Pneu Vacuo", val3: "Perfil Largo" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 68 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50-60 km", val2: "Recarga: 4-8h", val3: "Bivolt Inmetro" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Damping T.", val3: "Duplo Curso" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Alta Resistencia", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "162x50x85 cm", val2: "90 pcs / 40HQ", val3: "Base Foshan" },
                    { label: "PESO s/ BAT.", val1: "60 kg (Liq.)", val2: "70 kg (Bruto)", val3: "Equilibrado" },
                    { label: "RECURSOS", val1: "Alarme + USB", val2: "Painel LED", val3: "Encosto Traseiro" }
                ]
            }
        ];

        buildProductSheetLAF(allModels[0].abIndex, allModels[0]);
        buildProductSheetLAF(allModels[1].abIndex, allModels[1]);

        // ====================================================================
        // P.12: DIVISOR LINHA URBANA (Artboard 11)
        // ====================================================================
        buildCategoryDivider(
            11,
            "URBANA",
            cCyan,
            "MOBILIDADE INTELIGENTE\rPARA O SEU DIA A DIA.",
            "A Linha Z8 Urbana foi criada para quem vive a intensidade da cidade.\rPraticidade, conforto executivo e motores de 1200W que se adaptam\ra rotina urbana, com altissimo giro comercial para a concessionaria.",
            ["IDEAL PARA\rA CIDADE", "MOTORES\r1200W BRUSHLESS", "ECONOMICA E\rSUSTENTAVEL", "MAIOR GIRO\rDE VAREJO"],
            cutoutsDir + "/z8_n95c_cutout.png",
            cutoutsDir + "/z8_n7_cutout.png"
        );

        var urbanModels = [
            // 3. Z8 N95C MAX COMFORT (Artboard 12 -> Page 13)
            {
                abIndex: 12,
                pn: "DB039",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB039 // N95C MAX COMFORT",
                catShort: "URBANA",
                catColor: cCyan,
                shortTitle: "N95C MAX",
                fullName: "Z8 N95C MAX COMFORT 1200W EXECUTIVA",
                leftHeroImg: modelsDir + "/z8_n95c_studio.jpg",
                rightMainImg: pptxDir + "/image9.png",
                lineupImg: pptxDir + "/image10.jpeg",
                wholesalePrice: "R$ 6.500,00",
                lote10Price: "R$ 65.000,00",
                retailPrice: "R$ 10.000,00",
                profitUnit: "+R$ 3.500,00",
                containerQty: "112 pcs / 40HQ",
                packageSize: "158x45x85 cm",
                voltageSupport: "60V 20Ah Litio de Serie",
                callouts: [
                    { title: "BARRA LED DRL FRONTAL", desc: "Assinatura luminosa executiva\rde ponta a ponta em LED." },
                    { title: "MOTOR 1200W 27H + 30A", desc: "Motor magnetico 27H silencioso\rcom controlador de 30A." },
                    { title: "PNEUS LARGOS 130/70-10", desc: "Estabilidade superior e\rconforto em pisos irregulares." },
                    { title: "BANCO DUPLO VIP", desc: "Assento anatomico costurado\rcom bagageiro/encosto." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1200 W (27H)", val2: "Alto Rendimento", val3: "Brushless" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Recarga 4-8h", val3: "Removivel" },
                    { label: "CONTROLADOR", val1: "30A Modulo", val2: "Entrega Suave", val3: "Inteligente" },
                    { label: "FREIO", val1: "Disco Diant.", val2: "Tambor Traseiro", val3: "Alta Precisao" },
                    { label: "PNEU", val1: "130/70-10", val2: "Pneus Alargados", val3: "Sem Camara" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 50 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50-60 km", val2: "Uso Urbano", val3: "Economico" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Damping T.", val3: "Max Comfort" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Protecao Lateral", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "158x45x85 cm", val2: "112 pcs / 40HQ", val3: "Base Foshan" },
                    { label: "PESO s/ BAT.", val1: "60 kg (Liq.)", val2: "65 kg (Bruto)", val3: "Leve e Estavel" },
                    { label: "DESTAQUE", val1: "LED Perimetral", val2: "Painel Digital", val3: "Alarme Keyless" }
                ]
            },
            // 4. Z8 H26 / N7 STANDARD (Artboard 13 -> Page 14)
            {
                abIndex: 13,
                pn: "DB001",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB001 // N7 10-INCH STANDARD",
                catShort: "URBANA",
                catColor: cCyan,
                shortTitle: "N7 / H26",
                fullName: "Z8 H26 STANDARD (N7) 1200W",
                leftHeroImg: modelsDir + "/z8_n7_studio.jpg",
                rightMainImg: pptxDir + "/image4.jpeg",
                lineupImg: pptxDir + "/image6.jpeg",
                wholesalePrice: "R$ 5.500,00",
                lote10Price: "R$ 55.000,00",
                retailPrice: "R$ 9.500,00",
                profitUnit: "+R$ 4.000,00",
                containerQty: "109 a 130 pcs / 40HQ",
                packageSize: "158x45x85 cm",
                voltageSupport: "60V 20Ah Litio / Chumbo",
                callouts: [
                    { title: "CAMPEA DE GIRO COMERCIAL", desc: "O modelo mais vendido com\r72,7% de markup para a loja." },
                    { title: "DUPLO DISCO HIDR. 180mm", desc: "Frenagem hidraulica a oleo\rnas duas rodas de serie." },
                    { title: "MOTOR 1200W + 12G-33A", desc: "Controlador modular de 33A\rcom resposta imediata." },
                    { title: "SISTEMA ANTI-FURTO", desc: "Controle remoto inteligente\rcom trava eletrica de roda." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1200 W", val2: "Sem escova", val3: "Brushless" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Autonomia 50km", val3: "Removivel" },
                    { label: "CONTROLADOR", val1: "12G-33A", val2: "Modulo 33A", val3: "Alta Eficiencia" },
                    { label: "FREIO", val1: "Duplo Disco", val2: "180mm Hidraulico", val3: "Diant. e Tras." },
                    { label: "PNEU", val1: "3.00-10", val2: "Pneu de Vacuo", val3: "Aro 10 pol." },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 50 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50 km", val2: "Por recarga", val3: "Custo R$ 1,80" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Damping T.", val3: "Urbano Macio" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Piso Plano", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "158x45x85 cm", val2: "109 / 130 pcs", val3: "158x45x75 cm" },
                    { label: "PESO s/ BAT.", val1: "60 kg (Liq.)", val2: "70 kg (Bruto)", val3: "Agil no Transito" },
                    { label: "FUNCAO SMART", val1: "Alarme Remoto", val2: "Keyless Start", val3: "Encosto Duplo" }
                ]
            },
            // 5. Z8 N710 URBAN PLUS (Artboard 14 -> Page 15)
            {
                abIndex: 14,
                pn: "DB045-N710",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB045 // N710 URBAN PLUS MECHA",
                catShort: "URBANA",
                catColor: cCyan,
                shortTitle: "N710 PLUS",
                fullName: "Z8 N710 URBAN PLUS 1200W MECHA",
                leftHeroImg: modelsDir + "/z8_n710_farialima_wide.jpg",
                rightMainImg: cutoutsDir + "/z8_n710_cutout.png",
                lineupImg: modelsDir + "/z8_n710_farialima_headlight.jpg",
                wholesalePrice: "R$ 5.300,00",
                lote10Price: "R$ 53.000,00",
                retailPrice: "R$ 9.500,00",
                profitUnit: "+R$ 4.200,00",
                containerQty: "115 pcs / 40HQ",
                packageSize: "158x45x85 cm",
                voltageSupport: "60V 20Ah Litio de Serie",
                callouts: [
                    { title: "MAIOR LUCRO BRUTO (R$ 4.200)", desc: "Excelente posicionamento de\rpreco de compra vs venda." },
                    { title: "FAROL LED MECHA", desc: "Design frontal cyber-mecha\rcom projetor de alta nitidez." },
                    { title: "DUPLO DISCO 180mm", desc: "Freios hidraulicos dianteiro\re traseiro de serie." },
                    { title: "PORTA-OBJETOS E USB", desc: "Espaco funcional para celular\re itens do dia a dia." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1200 W", val2: "Sem escova", val3: "High Perf." },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Ciclo Profundo", val3: "Removivel" },
                    { label: "CONTROLADOR", val1: "12G Modulo", val2: "Sinusoidal", val3: "Silencioso" },
                    { label: "FREIO", val1: "Duplo Disco", val2: "180mm Hidraulico", val3: "Diant. e Tras." },
                    { label: "PNEU", val1: "3.00-10", val2: "Pneu de Vacuo", val3: "Urbano" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 50 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50-60 km", val2: "Recarga 4-6h", val3: "Bivolt" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Damping T.", val3: "Conforto" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Urban Reforcado", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "158x45x85 cm", val2: "115 pcs / 40HQ", val3: "Base Foshan" },
                    { label: "PESO s/ BAT.", val1: "58 kg (Liq.)", val2: "68 kg (Bruto)", val3: "Compacta" },
                    { label: "FUNCAO SMART", val1: "Alarme + NFC", val2: "Painel Digital", val3: "Grafismo Mecha" }
                ]
            }
        ];

        for (var u = 0; u < urbanModels.length; u++) {
            buildProductSheetLAF(urbanModels[u].abIndex, urbanModels[u]);
        }

        // ====================================================================
        // P.16: DIVISOR LINHA RETRO & CUSTOM (Artboard 15)
        // ====================================================================
        buildCategoryDivider(
            15,
            "RETRO & CUSTOM",
            cAmber,
            "CLASSICO, CUSTOM E ATEMPORAL.\rESTILO E PARA SEMPRE.",
            "A Linha Z8 Retro & Custom celebra o charme do design italiano candy-style\re a presenca imponente das choppers americanas com toda a inovacao\rda mobilidade 100% eletrica. Elegancia, conforto e personalidade unica.",
            ["DESIGN\rICONICO", "CORES CANDY\r& CHOPPER", "100% ELETRICA\rSILENCIOSA", "ATE 240 KM\rDE CAPACIDADE"],
            cutoutsDir + "/z8_q11_cutout.png",
            cutoutsDir + "/z8_harley_cutout.png"
        );

        var retroModels = [
            // 6. Z8 Q11 COMPACT (Artboard 16 -> Page 17)
            {
                abIndex: 16,
                pn: "DB043-Q11",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB043 // Q11 CANDY PASTEL LOVE",
                catShort: "RETRO",
                catColor: cAmber,
                shortTitle: "Q11 LOVE",
                fullName: "Z8 Q11 COMPACT RETRO CANDY STYLE",
                leftHeroImg: modelsDir + "/z8_q10_studio.jpg",
                rightMainImg: pptxDir + "/image1.jpeg",
                lineupImg: pptxDir + "/image2.png",
                wholesalePrice: "R$ 5.200,00",
                lote10Price: "R$ 52.000,00",
                retailPrice: "R$ 9.300,00",
                profitUnit: "+R$ 4.100,00",
                containerQty: "109 pcs / 40HQ",
                packageSize: "158x45x85 cm",
                voltageSupport: "48V - 60V (Litio 60V20Ah de Serie)",
                callouts: [
                    { title: "BAU TRASEIRO DE SERIE", desc: "Acompanha bau exclusivo na\rmesma cor pastel da carenagem." },
                    { title: "AMORTECEDOR 27 NUCLEOS", desc: "Suspensao dianteira hidraulica\r27 nucleos + Shuang Yangni." },
                    { title: "DISCO 180mm FRONTAL", desc: "Freio a disco dianteiro 180mm\re tambor traseiro seguro." },
                    { title: "6 CORES CANDY PASTEL", desc: "Rosa, Azul Bebe, Verde Menta,\rCreme, Branco e Cinza." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1000 W", val2: "Alta Eficiencia", val3: "Brushless" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Autonomia 50km", val3: "Suporta 48-60V" },
                    { label: "CONTROLADOR", val1: "9G Controlador", val2: "Suave e Linear", val3: "Baixo Consumo" },
                    { label: "FREIO", val1: "Disco 180mm D.", val2: "Tambor Traseiro", val3: "Progressivo" },
                    { label: "PNEU", val1: "3.00-10", val2: "Pneu de Vacuo", val3: "Aro 10 pol." },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 45 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50 km", val2: "Uso Diario", val3: "Economica" },
                    { label: "AMORTECEDOR", val1: "27 Nucleos Hidr.", val2: "Traseiro Duplo", val3: "Shuang Yangni" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Estilo Italiano", val3: "Carga: 180 kg" },
                    { label: "PACOTE 40HQ", val1: "158x45x85 cm", val2: "109 pcs / 40HQ", val3: "Base Foshan" },
                    { label: "PESO s/ BAT.", val1: "60 kg (Liq.)", val2: "70 kg (Bruto)", val3: "Super Leve" },
                    { label: "ACESSORIO", val1: "Bau Integrado", val2: "Painel Digital", val3: "Farol Halo LED" }
                ]
            },
            // 7. Z8 Q10 VINTAGE / XIAO Q (Artboard 17 -> Page 18)
            {
                abIndex: 17,
                pn: "DB038 (Q520S1)",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO DB038 // XIAO Q (Q520S1) VINTAGE",
                catShort: "RETRO",
                catColor: cAmber,
                shortTitle: "Q10 XIAO Q",
                fullName: "Z8 Q10 VINTAGE (XIAO Q / Q520S1) 1200W",
                leftHeroImg: modelsDir + "/z8_q10_madalena_wide.jpg",
                rightMainImg: cutoutsDir + "/z8_q10_cutout.png",
                lineupImg: pptxDir + "/image3.jpg",
                wholesalePrice: "R$ 5.800,00",
                lote10Price: "R$ 58.000,00",
                retailPrice: "R$ 9.800,00",
                profitUnit: "+R$ 4.000,00",
                containerQty: "109 a 130 pcs / 40HQ",
                packageSize: "158x45x85 cm",
                voltageSupport: "48-60V (Suporta Litio ate 60V 120Ah / 240km!)",
                callouts: [
                    { title: "ATE 60V 120Ah (240 KM!)", desc: "Cofre projetado para suportar\rbateria gigante de ate 240 km." },
                    { title: "FAROL HALO RGB GUIDAO", desc: "Farol circular retro cromado\rcom anel angel-eye colorido." },
                    { title: "MOTOR 1200W + 30A", desc: "Mais forte da categoria retro\rcom controlador de 30 Amperes." },
                    { title: "BANCO COURO CARAMELO", desc: "Acabamento boutique europeu\rem cores vibrantes e pastel." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1200 W", val2: "Alto Torque", val3: "Brushless" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Max: 60V 120Ah", val3: "Ate 240 km!" },
                    { label: "CONTROLADOR", val1: "30A Modulo", val2: "30 Amperes", val3: "Forte Subida" },
                    { label: "FREIO", val1: "Disco Diant.", val2: "Tambor Traseiro", val3: "Seguro" },
                    { label: "PNEU", val1: "3.00-10", val2: "Pneu de Vacuo", val3: "Aro 10 pol." },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 45 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "50 km (20Ah)", val2: "240 km (120Ah)", val3: "Recarga 4-6h" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Damping T.", val3: "Macio" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Chassi Xiao Q", val3: "Carga: 180 kg" },
                    { label: "PACOTE 40HQ", val1: "158x45x85 cm", val2: "109 / 130 pcs", val3: "158x45x75 cm" },
                    { label: "PESO s/ BAT.", val1: "55 kg (Liq.)", val2: "60 kg (Bruto)", val3: "Mais Leve" },
                    { label: "ILUMINACAO", val1: "Halo LED RGB", val2: "Setas Neon", val3: "Painel Retro" }
                ]
            },
            // 8. Z8 HARLEY X12 CUSTOM (Artboard 18 -> Page 19)
            {
                abIndex: 18,
                pn: "DB039 / XB-024",
                base: "BASE NORTE (NORTHERN BASE)",
                factoryRef: "MODELO X12 // CHOPPER CUSTOM CRUISER",
                catShort: "CUSTOM",
                catColor: cAmber,
                shortTitle: "HARLEY X12",
                fullName: "Z8 HARLEY X12 CUSTOM CHOPPER 1200W",
                leftHeroImg: modelsDir + "/z8_harley_carvalho_wide.jpg",
                rightMainImg: pptxDir + "/image12.png",
                lineupImg: pptxDir + "/image13.png",
                wholesalePrice: "R$ 6.500,00",
                lote10Price: "R$ 65.000,00",
                retailPrice: "R$ 10.000,00",
                profitUnit: "+R$ 3.500,00",
                containerQty: "216 pcs / 40HQ",
                packageSize: "130x37x65 cm",
                voltageSupport: "60V 20Ah Litio Removivel",
                callouts: [
                    { title: "ESTILO CHOPPER AMERICANO", desc: "Guidao alto custom, garfo longo\re postura estradeira unica." },
                    { title: "PNEUS LARGOS 130/70-10", desc: "Visual musculoso com alta\restabilidade em retas e curvas." },
                    { title: "SOM BLUETOOTH + NFC", desc: "Caixa de som integrada para\rmusica e partida sem chave." },
                    { title: "ALTA DENSIDADE 40HQ", desc: "Embalagem inteligente que\rcomporta 216 motos por 40HQ." }
                ],
                row1: [
                    { label: "MOTOR", val1: "1200 W (27H)", val2: "Alto Torque", val3: "Cubo Traseiro" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Removivel", val3: "Recarga 4-8h" },
                    { label: "CONTROLADOR", val1: "30A Modulo", val2: "30 Amperes", val3: "Custom Tuned" },
                    { label: "FREIO", val1: "Disco Diant.", val2: "Tambor Traseiro", val3: "Hidraulico" },
                    { label: "PNEU", val1: "130/70-10", val2: "Pneu Alargado", val3: "Chopper Tire" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 50 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 45-50 km", val2: "Passeio Urbano", val3: "Recarga 4-8h" },
                    { label: "AMORTECEDOR", val1: "Garfo Hidr. D.", val2: "Duplo Mola T.", val3: "Cromado/Preto" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Berco Duplo", val3: "Carga: 200 kg" },
                    { label: "PACOTE 40HQ", val1: "130x37x65 cm", val2: "216 pcs / 40HQ", val3: "Base Norte" },
                    { label: "PESO s/ BAT.", val1: "60 kg (Liq.)", val2: "65 kg (Bruto)", val3: "Centro Baixo" },
                    { label: "EXCLUSIVO", val1: "Som Bluetooth", val2: "Banco VIP Duplo", val3: "Alarme Keyless" }
                ]
            }
        ];

        for (var r = 0; r < retroModels.length; r++) {
            buildProductSheetLAF(retroModels[r].abIndex, retroModels[r]);
        }

        // ====================================================================
        // P.20: DIVISOR LINHA CARGO & E-BIKES (Artboard 19)
        // ====================================================================
        buildCategoryDivider(
            19,
            "CARGO & BIKES",
            cLime,
            "LIBERDADE E FORCA DE TRABALHO\rPARA IR ALEM DE QUALQUER CAMINHO.",
            "A Linha Z8 Cargo & E-Bikes une o melhor de dois mundos: a brutalidade\rutilitaria da U2 Delivery de 2000W para frotas comerciais e a leveza\rinteligente das E-Bikes de 500W (Golden Eagle e Little King Kong)\rpara mobilidade acessivel e altissimo volume de vendas.",
            ["FROTAS &\rDELIVERY 2000W", "E-BIKES DE\rALTO GIRO", "BAIXISSIMO\rCUSTO/KM", "ACESSIVEL A\rTODOS PUBLICOS"],
            cutoutsDir + "/z8_u2_cutout.png",
            cutoutsDir + "/z8_diamond_cutout.png"
        );

        var cargoBikeModels = [
            // 9. Z8 U2 DELIVERY CARGO (Artboard 20 -> Page 21)
            {
                abIndex: 20,
                pn: "XB-010",
                base: "BASES DE FOSHAN & HUIZHOU",
                factoryRef: "MODELO XB-010 // U2 12-INCH HEAVY-DUTY CARGO",
                catShort: "CARGO",
                catColor: cLime,
                shortTitle: "U2 CARGO",
                fullName: "Z8 U2 DELIVERY CARGO 2000W ARO 12",
                leftHeroImg: modelsDir + "/z8_u2_studio.jpg",
                rightMainImg: pptxDir + "/image17.jpeg",
                lineupImg: pptxDir + "/image18.png",
                wholesalePrice: "R$ 6.000,00",
                lote10Price: "R$ 60.000,00",
                retailPrice: "R$ 9.500,00",
                profitUnit: "+R$ 3.500,00",
                containerQty: "168 a 216 pcs / 40HQ",
                packageSize: "148x37x75 cm",
                voltageSupport: "48V - 60V - 72V (Multivoltagem!)",
                callouts: [
                    { title: "MOTOR 2000W + MODULO 12G", desc: "Forca industrial para entregas\rpesadas e uso profissional." },
                    { title: "CAIXA CENTRAL + SELIM LONGO", desc: "Compartimento de bateria grande\re novo bau central integrado." },
                    { title: "RODAS LIGA ARO 12 + 220mm", desc: "Rodas de aluminio aro 12 com\rduplo disco hidraulico 220mm." },
                    { title: "4 CORES CORPORATIVAS", desc: "Creme/Laranja, Preto/Laranja,\rBranco/Laranja e Verde Militar." }
                ],
                row1: [
                    { label: "MOTOR", val1: "2000 W", val2: "Sem escova", val3: "Heavy-Duty" },
                    { label: "BATERIA", val1: "Litio 60V 20Ah", val2: "Cofre Ampliado", val3: "Suporta 48-72V" },
                    { label: "CONTROLADOR", val1: "12G Reforcado", val2: "Modulo Cargo", val3: "Alta Dissipacao" },
                    { label: "FREIO", val1: "Duplo Disco", val2: "220mm Hidraulico", val3: "Diant. e Tras." },
                    { label: "PNEU", val1: "90/90-12", val2: "Vacuo Aro 12", val3: "Roda Aluminio" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 70 km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50-60 km", val2: "Expansivel", val3: "Uso Comercial" },
                    { label: "AMORTECEDOR", val1: "Hidraulico D.", val2: "Mola Carga T.", val3: "Reforcado" },
                    { label: "CONFIGURACAO", val1: "Novo Bau Medio", val2: "Selim Longo", val3: "Grade Frontal" },
                    { label: "PACOTE 40HQ", val1: "148x31.5x75 cm", val2: "168 / 192 / 216", val3: "pcs por 40HQ" },
                    { label: "PESO s/ BAT.", val1: "55 kg (Liq.)", val2: "65 kg (Bruto)", val3: "Aco Carbono" },
                    { label: "PAINEL", val1: "Tela Blade LED", val2: "Alarme Remoto", val3: "Farol Halo" }
                ]
            },
            // 10. Z8 GS-005 BASE NORTE (Artboard 21 -> Page 22)
            {
                abIndex: 21,
                pn: "GS-005",
                base: "BASE NORTE (NORTHERN BASE)",
                factoryRef: "MODELO GS-005 // GOLDEN EAGLE E-BIKE",
                catShort: "E-BIKE",
                catColor: cLime,
                shortTitle: "GS-005",
                fullName: "Z8 GS-005 GOLDEN EAGLE 500W PEDELEC",
                leftHeroImg: modelsDir + "/z8_gs005_studio.jpg",
                rightMainImg: pptxDir + "/image20.jpeg",
                lineupImg: pptxDir + "/image21.jpeg",
                wholesalePrice: "R$ 3.200,00",
                lote10Price: "R$ 32.000,00",
                retailPrice: "R$ 6.200,00",
                profitUnit: "+R$ 3.000,00",
                containerQty: "288 a 294 pcs / 40HQ",
                packageSize: "129x31.5x62 cm",
                voltageSupport: "48V 20Ah / 60V 20Ah Litio (50 km)",
                callouts: [
                    { title: "93,7% MARKUP P/ LOJISTA", desc: "Menor ticket de entrada B2B\r(R$ 3.200) e giro imediato." },
                    { title: "MOTOR 500W COBRE PURO", desc: "Bobinamento em cobre puro de\ralta eficiencia e durabilidade." },
                    { title: "CAPO MECHA LED + SETAS", desc: "Farol frontal estilo mecha\rcom indicadores de direcao." },
                    { title: "CESTA + ASSENTO DUPLO", desc: "Pronta para compras, entregas\rleves e transporte diario." }
                ],
                row1: [
                    { label: "MOTOR", val1: "500 W", val2: "Cobre Puro", val3: "Brushless" },
                    { label: "BATERIA", val1: "Litio 48V/60V", val2: "20Ah (50 km)", val3: "Chumbo/Litio" },
                    { label: "CONTROLADOR", val1: "6G-NEW Modulo", val2: "Nova Geracao", val3: "Suave" },
                    { label: "FREIO", val1: "Tambor D/T", val2: "Expansao Tras.", val3: "Baixa Manut." },
                    { label: "PNEU", val1: "14 x 2.5 pol.", val2: "Pneu de Vacuo", val3: "Urbano" },
                    { label: "VELOCIDADE", val1: "28-32 km/h", val2: "100% Legal", val3: "Autopropelido" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50 km", val2: "Pedal Assistido", val3: "E Acelerador" },
                    { label: "AMORTECEDOR", val1: "Molas Damping", val2: "Diant. e Tras.", val3: "Confortavel" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "Cesta Frontal", val3: "Carga: 150 kg" },
                    { label: "PACOTE 40HQ", val1: "129x31.5x62 cm", val2: "288 a 294 pcs", val3: "Base Norte" },
                    { label: "PESO s/ BAT.", val1: "30 kg (Liq.)", val2: "35 kg (Bruto)", val3: "Ultra Leve" },
                    { label: "DESTAQUE", val1: "Capo LED Mecha", val2: "Com Setas", val3: "Encosto Tras." }
                ]
            },
            // 11. Z8 DIAMOND LUXE / LITTLE KING KONG (Artboard 22 -> Page 23)
            {
                abIndex: 22,
                pn: "GS-052",
                base: "BASE NORTE (NORTHERN BASE)",
                factoryRef: "MODELO GS-052 // LITTLE KING KONG LUXE",
                catShort: "E-BIKE",
                catColor: cLime,
                shortTitle: "DIAMOND",
                fullName: "Z8 DIAMOND LUXE (LITTLE KING KONG) 500W",
                leftHeroImg: modelsDir + "/z8_diamond_studio.jpg",
                rightMainImg: pptxDir + "/image24.png",
                lineupImg: pptxDir + "/image25.png",
                wholesalePrice: "R$ 3.400,00",
                lote10Price: "R$ 34.000,00",
                retailPrice: "R$ 6.800,00",
                profitUnit: "+R$ 3.400,00",
                containerQty: "288 a 294 pcs / 40HQ",
                packageSize: "129x31x62 cm",
                voltageSupport: "48V 20Ah / 60V 20Ah Litio (50 km)",
                callouts: [
                    { title: "100% MARKUP (DOBRO DO CAPITAL)", desc: "Compra por R$ 3.400 no atacado\re venda sugerida a R$ 6.800!" },
                    { title: "PNEUS LARGOS ARO 16x3.0", desc: "Rodas maiores de 16 polegadas\rcom pneus balao 3.0 de vacuo." },
                    { title: "CHASSI LITTLE KING KONG", desc: "Estrutura super reforcada com\ropcao de cadeirinha infantil." },
                    { title: "ALARME ANTI-FURTO REMOTO", desc: "Seguranca completa com trava\rremota e farol circular LED." }
                ],
                row1: [
                    { label: "MOTOR", val1: "500 W", val2: "Cobre Puro", val3: "Alto Torque" },
                    { label: "BATERIA", val1: "Litio 48V/60V", val2: "20Ah (50 km)", val3: "Removivel" },
                    { label: "CONTROLADOR", val1: "500W Modulo", val2: "Estavel", val3: "Protecao BMS" },
                    { label: "FREIO", val1: "Tambor D/T", val2: "Reforcado", val3: "Seguro" },
                    { label: "PNEU", val1: "16 - 3.0 pol.", val2: "Vacuo Alargado", val3: "Aro 16" },
                    { label: "VELOCIDADE", val1: "32 km/h (Legal)", val2: "Max: 35-40km/h", val3: "CONTRAN 996" }
                ],
                row2: [
                    { label: "AUTONOMIA", val1: "Ate 50 km", val2: "Por Recarga", val3: "Bivolt" },
                    { label: "AMORTECEDOR", val1: "Molas Damping", val2: "Diant. e Tras.", val3: "Reforcado" },
                    { label: "QUADRO", val1: "Aco Carbono", val2: "King Kong Frame", val3: "Carga: 160 kg" },
                    { label: "PACOTE 40HQ", val1: "129x31x62 cm", val2: "288 a 294 pcs", val3: "Base Norte" },
                    { label: "PESO s/ BAT.", val1: "37 kg (Liq.)", val2: "43 kg (Bruto)", val3: "Robusta" },
                    { label: "FUNCAO SMART", val1: "Alarme Remoto", val2: "Cesta Metalica", val3: "6 Cores Vivas" }
                ]
            }
        ];

        for (var cb = 0; cb < cargoBikeModels.length; cb++) {
            buildProductSheetLAF(cargoBikeModels[cb].abIndex, cargoBikeModels[cb]);
        }

        // ====================================================================
        // P.24: TABELA MASTER DE ATACADO, MARGENS & CONTAINER 40HQ (Artboard 23)
        // ====================================================================
        addDarkHeaderFooter(23, "TABELA OFICIAL DE ATACADO & RENTABILIDADE B2B");
        (function() {
            var b = getAbBounds(23);
            var pL = b[0]; var pT = b[1];

            addText(layerText, pL + 36, pT - 68, "TABELA OFICIAL DE ATACADO, MARGENS & CONTAINER 40HQ (2026)", 19, cWhite, "title", 40, null);
            addText(layerText, pL + 36, pT - 90, "Condicoes comerciais exclusivas para lojistas e franqueados Z8 E-Motion (Pedido minimo: Lote de 10 unidades).", 8.5, cCyan, "bold", 40, null);

            var tTop = pT - 108;
            var tLeft = pL + 36;
            var tW = abWidth - 72;
            var rH = 29;

            drawBox(layerBoxes, tTop, tLeft, tW, 28, cOrange, null, 0);
            var cX = [tLeft + 8, tLeft + 65, tLeft + 215, tLeft + 295, tLeft + 385, tLeft + 475, tLeft + 575, tLeft + 670];
            var cH = ["PN COD.", "MODELO Z8", "MOTOR", "BATERIA", "QTD 40HQ", "ATACADO UN.", "LOTE 10 UN.", "VAREJO / LUCRO"];
            for (var h = 0; h < cH.length; h++) {
                addText(layerText, cX[h], tTop - 18, cH[h], 7.5, cDark, "title", 40, null);
            }

            var summaryRows = [
                ["DB018", "Z8 Tank High-Speed", "2000W 15G", "60V/72V 20Ah+", "85 pcs", "R$ 7.500,00", "R$ 75.000", "R$ 11.500 (+4.0k)"],
                ["DB043", "Z8 FX-10 Sport", "1500W 12G", "60V 20Ah Litio", "90 pcs", "R$ 6.700,00", "R$ 67.000", "R$ 9.000 (+2.3k)"],
                ["XB-024", "Z8 Harley X12 Custom", "1200W 30A", "60V 20Ah Litio", "216 pcs", "R$ 6.500,00", "R$ 65.000", "R$ 10.000 (+3.5k)"],
                ["XB-010", "Z8 U2 Delivery Cargo", "2000W 12G", "60V 20Ah (48-72V)", "168-216 pcs", "R$ 6.000,00", "R$ 60.000", "R$ 9.500 (+3.5k)"],
                ["DB039", "Z8 N95C Max Comfort", "1200W 30A", "60V 20Ah Litio", "112 pcs", "R$ 6.500,00", "R$ 65.000", "R$ 10.000 (+3.5k)"],
                ["DB001", "Z8 H26 Standard (N7)", "1200W 33A", "60V 20Ah Litio", "109-130 pcs", "R$ 5.500,00", "R$ 55.000", "R$ 9.500 (+4.0k)"],
                ["DB043-Q11", "Z8 Q11 Compact Retro", "1000W 9G", "60V 20Ah Litio", "109 pcs", "R$ 5.200,00", "R$ 52.000", "R$ 9.300 (+4.1k)"],
                ["DB045", "Z8 N710 Urban Plus", "1200W 12G", "60V 20Ah Litio", "115 pcs", "R$ 5.300,00", "R$ 53.000", "R$ 9.500 (+4.2k)"],
                ["DB038", "Z8 Q10 Vintage (Xiao Q)", "1200W 30A", "60V 20Ah (120Ah)", "109-130 pcs", "R$ 5.800,00", "R$ 58.000", "R$ 9.800 (+4.0k)"],
                ["GS-005", "Z8 GS-005 Golden Eagle", "500W Cobre", "48V/60V 20Ah", "288-294 pcs", "R$ 3.200,00", "R$ 32.000", "R$ 6.200 (+3.0k)"],
                ["GS-052", "Z8 Diamond King Kong", "500W Cobre", "48V/60V 20Ah", "288-294 pcs", "R$ 3.400,00", "R$ 34.000", "R$ 6.800 (+3.4k)"]
            ];

            for (var r = 0; r < summaryRows.length; r++) {
                var ry = tTop - 28 - r * rH;
                var bg = (r % 2 === 0) ? cCharcoal : makeRGB(24, 30, 42);
                drawBox(layerBoxes, ry, tLeft, tW, rH, bg, makeRGB(45, 55, 70), 0.5);
                var row = summaryRows[r];
                addText(layerText, cX[0], ry - 19, row[0], 7.5, cCyan, "bold", 20, null);
                addText(layerText, cX[1], ry - 19, row[1], 8, cWhite, "bold", 20, null);
                addText(layerText, cX[2], ry - 19, row[2], 7.5, cSilver, "body", 10, null);
                addText(layerText, cX[3], ry - 19, row[3], 7.5, cSilver, "body", 10, null);
                addText(layerText, cX[4], ry - 19, row[4], 7.5, cSilver, "body", 10, null);
                addText(layerCTA,  cX[5], ry - 19, row[5], 8.5, cOrange, "title", 20, null);
                addText(layerCTA,  cX[6], ry - 19, row[6], 8.5, cWhite, "title", 20, null);
                addText(layerCTA,  cX[7], ry - 19, row[7], 7.5, cLime, "bold", 10, null);
            }

            drawBox(layerBoxes, pT - 472, tLeft, tW, 62, cWholesaleBg, cCyan, 0.8);
            addText(layerText, tLeft + 16, pT - 492, "DIRETRIZES DE EXPANSAO E FRANQUIA Z8 E-MOTION:", 8.5, cCyan, "title", 80, null);
            addText(layerText, tLeft + 16, pT - 512,
                "- Taxa Inicial de Franquia: R$ 35.000,00  |  Lote Inicial Obrigatorio: 10 Motos (Mix Livre)  |  Area Comercial Minima: 50 a 60 m2  |  Oficina: 2 Elevadores\r- Contato Direto Mesa de Atacado: WhatsApp (12) 99800-8818 (Christian Hideyuki)  |  Sede: Sao Jose dos Campos - SP",
                7.5, cWhite, "body", 15, 13);
        })();

        // ====================================================================
        // P.25: POR QUE A Z8 E-MOTION? (Artboard 24 - Estilo LAF Page 47)
        // ====================================================================
        addDarkHeaderFooter(24, "POR QUE ESCOLHER A Z8?");
        (function() {
            var b = getAbBounds(24);
            var pL = b[0]; var pT = b[1];

            drawCircle(layerBoxes, pT - 110, pL + 45, 320, cCharcoal, cOrange, 3.0);
            drawCircle(layerBoxes, pT - 125, pL + 60, 290, cDark, cCyan, 1.2);
            placeImageSafe(layerPhotos, cutoutsDir + "/z8_tank_cutout.png", pL + 75, pT - 150, 260, 240);

            var rX = pL + 410;
            addText(layerText, rX, pT - 105, "POR QUE A ", 32, cOrange, "title", 40, null);
            addText(layerText, rX + 205, pT - 105, "Z8?", 32, cWhite, "title", 40, null);

            addText(layerText, rX, pT - 145,
                "Porque, no fim, nao se trata apenas de chegar. Trata-se de como\rvoce vive o caminho - e de como sua concessionaria lidera a\rtransformacao energetica da sua cidade.\r\rE e por isso que a Z8 E-Motion existe: para transformar cada trajeto\rem liberdade, tecnologia e alta rentabilidade. Com design Bauhaus\rsofisticado, motores de ate 2000W e suporte tecnico real com 2\relevadores, entregamos muito mais do que veiculos eletricos.\rEntregamos o futuro da mobilidade urbana no Brasil.",
                9, cSilver, "body", 15, 14);

            placeImageSafe(layerPhotos, modelsDir + "/z8_fx10_capivari_wide.jpg", rX, pT - 295, 122, 145);
            placeImageSafe(layerPhotos, modelsDir + "/z8_q10_madalena_wide.jpg", rX + 132, pT - 295, 122, 145);
            placeImageSafe(layerPhotos, modelsDir + "/z8_harley_carvalho_wide.jpg", rX + 264, pT - 295, 122, 145);

            addText(layerText, rX, pT - 485, "T E M   S E M P R E   U M A   Z 8   P A R A   V O C E !", 10.5, cWhite, "title", 200, null);
        })();

        // ====================================================================
        // P.26: CONTRACAPA MINIMALISTA OFICIAL (Artboard 25 - Estilo LAF Page 48)
        // ====================================================================
        (function() {
            var b = getAbBounds(25);
            var pL = b[0]; var pT = b[1];

            drawBox(layerBg, pT, pL, abWidth, abHeight, cDark, null, 0);

            drawCircle(layerBoxes, pT - 165, pL + (abWidth / 2) - 42, 84, cCharcoal, cOrange, 2.5);
            addText(layerText, pL + (abWidth / 2) - 24, pT - 220, "Z8", 34, cCyan, "title", 60, null);

            addText(layerText, pL + (abWidth / 2) - 135, pT - 285, "Z8 E-MOTION", 34, cWhite, "title", 120, null);
            addText(layerText, pL + (abWidth / 2) - 92, pT - 310, "VEICULOS ELETRICOS", 11, cSilver, "bold", 220, null);

            addText(layerText, pL + (abWidth / 2) - 118, pT - 375, "A ESCOLHA INTELIGENTE", 15, cOrange, "title", 100, null);

            addText(layerText, pL + (abWidth / 2) - 185, pT - 465,
                "Z8 EMOTION LTDA.  |  CNPJ: 68.774.164/0001-00\rAv. Dr. Adhemar de Barros, 566 - Jd. Sao Dimas - Sao Jose dos Campos/SP",
                8, cSlate, "body", 40, 13);

            addText(layerText, pL + (abWidth / 2) - 175, pT - 515,
                "@Z8EMOTION     |     Z8EMOTION.COM     |     (12) 99800-8818",
                9, cOrange, "bold", 100, null);
        })();

        // ====================================================================
        // SALVAR ARQUIVO NATIVO (.AI) E EXPORTAR PDF VETORIAL (.PDF)
        // ====================================================================
        var aiPath = projectRoot + "/docs/CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.ai";
        var aiFile = new File(aiPath);
        var aiOpts = new IllustratorSaveOptions();
        aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
        aiOpts.pdfCompatible = true;
        doc.saveAs(aiFile, aiOpts);

        var pdfPath1 = projectRoot + "/docs/CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.pdf";
        var pdfFile1 = new File(pdfPath1);
        var pdfOpts = new PDFSaveOptions();
        pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
        pdfOpts.preserveEditability = true;
        doc.saveAs(pdfFile1, pdfOpts);

        var pdfPath2 = projectRoot + "/catalogo_atacado_pdf/CATALOGO_OFICIAL_Z8_LAF_EDITION_2026.pdf";
        var pdfFile2 = new File(pdfPath2);
        doc.saveAs(pdfFile2, pdfOpts);

        var okFile = new File(projectRoot + "/scratch/laf_edition_ai_ok.txt");
        okFile.open("w");
        okFile.writeln("SUCESSO: Catalogo Z8 LAF Edition (26 pranchetas) gerado no Illustrator!");
        okFile.writeln("AI: " + aiPath);
        okFile.writeln("PDF: " + pdfPath1);
        okFile.writeln("Data: " + (new Date()).toString());
        okFile.close();
    } catch(globalErr) {
        var errFile = new File(projectRoot + "/scratch/laf_edition_ai_err.txt");
        errFile.open("w");
        errFile.writeln("ERRO GLOBAL: " + globalErr.message + " (Linha: " + globalErr.line + ")");
        errFile.close();
    }
}

main();
