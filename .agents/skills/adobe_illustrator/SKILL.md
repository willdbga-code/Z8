---
name: adobe-illustrator
description: Automação, criação de pranchetas vetoriais e geração de documentos nativos (.ai e .pdf) no Adobe Illustrator 2026 via ExtendScript (.jsx) e manipulação vetorial para a Z8 E-Motion.
---

# 🎨 Adobe Illustrator Automation & Vector Engineering Skill

Esta skill capacita os agentes da Z8 a projetar, desenhar, manipular e exportar documentos gráficos vetoriais nativos no **Adobe Illustrator 2026** instalado no ambiente Windows.

---

## 📌 Ambiente & Localização do Executável

- **Caminho do Executável (Windows)**:
  `C:\Program Files\Adobe\Adobe Illustrator 2026\Support Files\Contents\Windows\Illustrator.exe`
- **Pasta Oficial de Scripts Presets**:
  `C:\Program Files\Adobe\Adobe Illustrator 2026\Presets\pt_BR\Scripts`
- **Atalho no Illustrator**:
  Pressione `Ctrl + F12` (ou navegue em `Arquivo > Scripts > Outro Script...`) para executar qualquer script `.jsx`.

---

## 📐 Estrutura de Script ExtendScript (.jsx)

O Adobe Illustrator utiliza ExtendScript (JavaScript ECMAScript 3 com a API nativa da Adobe).

### 1. Inicialização e Dimensões
```javascript
#target illustrator

var docPreset = new DocumentPreset();
docPreset.width = 841.89; // 297mm (A4 Paisagem) em pontos
docPreset.height = 595.28; // 210mm em pontos
docPreset.units = RulerUnits.Millimeters;
docPreset.colorMode = DocumentColorSpace.RGB;
docPreset.title = "CATALOGO_Z8";

var doc = app.documents.addDocument(DocumentColorSpace.RGB, docPreset);
```

### 2. Gestão de Cores Oficiais da Z8
```javascript
function makeRGB(r, g, b) {
    var c = new RGBColor();
    c.red = r; c.green = g; c.blue = b;
    return c;
}

var cDark = makeRGB(10, 11, 14);       // #0A0B0E Black Piano
var cCyan = makeRGB(0, 229, 255);      // #00E5FF Electric Cyan Z8
var cLime = makeRGB(34, 197, 94);      // #22C55E Lime Accent
var cSlate = makeRGB(100, 116, 139);   // #64748B Slate Grey
var cCardBg = makeRGB(248, 250, 252);  // #F8FAFC Platinum Card
var cBorder = makeRGB(226, 232, 240);  // #E2E8F0 Subtle Border
```

### 3. Organização de Camadas (Layers)
```javascript
var layerBg = doc.layers[0]; layerBg.name = "01_Background";
var layerBoxes = doc.layers.add(); layerBoxes.name = "02_Cards_Molduras";
var layerPhotos = doc.layers.add(); layerPhotos.name = "03_Fotos_Modelos";
var layerText = doc.layers.add(); layerText.name = "04_Tipografia";
var layerCTA = doc.layers.add(); layerCTA.name = "05_Precos_CTA";
```

### 4. Criação de Pranchetas Adicionais (Artboards)
```javascript
// [left, top, right, bottom]
doc.artboards.add([posX, posY, posX + abWidth, posY - abHeight]);
```

### 5. Inserção de Imagens e Vetores
```javascript
var placed = layerPhotos.placedItems.add();
placed.file = new File("C:/Users/LENOVO/Desktop/Z8/public/assets/models/z8_tank_studio.jpg");
placed.position = [posX, posY];
placed.width = 460;
placed.height = 257;
```

### 6. Tipografia e Textos
```javascript
var tf = layerText.textFrames.pointText([posX, posY]);
tf.contents = "Z8 E-MOTION";
tf.textRange.characterAttributes.size = 28;
tf.textRange.characterAttributes.fillColor = cDark;
tf.textRange.characterAttributes.tracking = 150;
```

### 7. Salvamento Nativo (.AI) e Exportação (.PDF)
```javascript
// Salvar como .AI nativo com compatibilidade PDF
var aiFile = new File("C:/Users/LENOVO/Desktop/Z8/docs/CATALOGO_MINIMALISTA_VENDAS_Z8_2026.ai");
var aiOpts = new IllustratorSaveOptions();
aiOpts.compatibility = Compatibility.ILLUSTRATOR24;
aiOpts.pdfCompatible = true;
doc.saveAs(aiFile, aiOpts);

// Exportar como PDF de alta resolução
var pdfFile = new File("C:/Users/LENOVO/Desktop/Z8/docs/CATALOGO_MINIMALISTA_VENDAS_Z8_2026.pdf");
var pdfOpts = new PDFSaveOptions();
pdfOpts.compatibility = PDFCompatibility.ACROBAT8;
pdfOpts.preserveEditability = true;
doc.saveAs(pdfFile, pdfOpts);
```
