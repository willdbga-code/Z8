#target illustrator

/**
 * Z8 E-MOTION - GERADOR DE PADRÃO VETORIAL ISOMÉTRICO (PATTERN SWATCH)
 * Adobe Illustrator 2026 ExtendScript (.jsx)
 * 
 * Cria e injeta o padrão vetorial oficial da Z8 (linhas diagonais 45° + monograma Z8)
 * no painel Swatches (Amostras) do Illustrator para uso imediato em fundos e acabamentos.
 */

function createZ8PatternSwatch() {
    if (app.documents.length === 0) {
        var preset = new DocumentPreset();
        preset.width = 595.28;
        preset.height = 595.28;
        preset.units = RulerUnits.Millimeters;
        preset.title = "Z8_PATTERN_LIBRARY";
        app.documents.addDocument(DocumentColorSpace.RGB, preset);
    }

    var doc = app.activeDocument;

    function getRGB(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }

    var colDark  = getRGB(10, 11, 14);    // #0A0B0E
    var colCyan  = getRGB(0, 229, 255);   // #00E5FF
    var colGrey  = getRGB(226, 232, 240); // #E2E8F0

    var layer = doc.layers.add();
    layer.name = "Z8_ISOMETRIC_PATTERN_BASE";

    // Criar Módulo Base do Pattern (60x60 pt)
    var tileSize = 60;
    var groupTile = layer.groupItems.add();

    // Fundo Transparente do Módulo (Bounding Box do Pattern)
    var boundingBox = groupTile.pathItems.rectangle(tileSize, 0, tileSize, tileSize);
    boundingBox.stroked = false;
    boundingBox.filled = false;

    // Linha Diagonal Técnica 45°
    var diag1 = groupTile.pathItems.add();
    diag1.stroked = true;
    diag1.strokeWidth = 0.5;
    diag1.strokeColor = colCyan;
    diag1.setEntirePath([[0, tileSize], [tileSize, 0]]);

    // Monograma Z8 Vetorial Compacto
    var tZ = groupTile.textFrames.pointText([tileSize / 2, (tileSize / 2) + 4]);
    tZ.contents = "Z8";
    tZ.textRange.characterAttributes.size = 9;
    tZ.textRange.characterAttributes.fillColor = colCyan;
    tZ.textRange.characterAttributes.tracking = 100;
    tZ.textRange.paragraphAttributes.justification = Justification.CENTER;

    // Converter Texto para Curvas
    var outlinedZ = tZ.createOutline();

    // Criação do Pattern Swatch no Illustrator
    var pattern = doc.patterns.add();
    pattern.name = "Z8_Pattern_Isometric_Cyan";
    
    // Adicionar Amostra
    var swatch = doc.swatches.add();
    swatch.name = "Z8_Pattern_Cyan_45deg";
    var patColor = new PatternColor();
    patColor.pattern = pattern;
    swatch.color = patColor;

    alert("✅ Padrão Isométrico Z8 criado e adicionado ao painel Swatches (Amostras) com sucesso!");
}

createZ8PatternSwatch();
