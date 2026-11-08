---
name: adobe-illustrator
description: Engenharia vetorial avançada, automação gráfica e geração de documentos nativos (.ai, .pdf, .svg) no Adobe Illustrator 2026 via ExtendScript (.jsx), incluindo selos de garantia, certificados executivos de entrega técnica, catálogos e padrões geométricos para a Z8 E-Motion.
---

# 🎨 Adobe Illustrator Advanced Vector Engineering & Automation Skill

Esta skill capacita os agentes e designers da Z8 a projetar, desenhar, diagramar e exportar documentos gráficos vetoriais nativos no **Adobe Illustrator 2026** no Windows, automatizando a criação de **selos de garantia**, **certificados de entrega técnica**, **catálogos comerciais** e **padrões geométricos corporativos**.

---

## 📌 Ambiente & Localização do Executável

- **Caminho do Executável (Windows)**:
  `C:\Program Files\Adobe\Adobe Illustrator 2026\Support Files\Contents\Windows\Illustrator.exe`
- **Pasta de Scripts Presets do Illustrator**:
  `C:\Program Files\Adobe\Adobe Illustrator 2026\Presets\pt_BR\Scripts`
- **Atalhos no Illustrator**:
  - `Ctrl + F12` (ou `Arquivo > Scripts > Outro Script...`): Executa qualquer script `.jsx` imediatamente.
- **Execução via VS Code (ExtendScript Debugger)**:
  - Abra qualquer arquivo `.jsx` nesta pasta ou em `scripts/illustrator/`.
  - Pressione <kbd>F5</kbd> com o Illustrator aberto para desenhar na tela em tempo real.
- **Execução Direta via Terminal (PowerShell)**:
  ```powershell
  & "C:\Program Files\Adobe\Adobe Illustrator 2026\Support Files\Contents\Windows\Illustrator.exe" "c:\Users\LENOVO\Desktop\Z8\scripts\illustrator\generate_warranty_seals.jsx"
  ```

---

## 📐 Biblioteca de Scripts Prontos (`scripts/illustrator/`)

| Script | Finalidade | Arquivo de Saída |
| :--- | :--- | :--- |
| `generate_warranty_seals.jsx` | 3 Selos Oficiais de Garantia (Circular 2 Anos, Hexagonal PDI e Diamante Autenticidade) | `public/assets/cria/illustrator/SELOS_GARANTIA_Z8_2026.ai` |
| `generate_certificate_a4.jsx` | Certificado Oficial A4 Paisagem de Entrega Técnica, PDI e Garantia Nacional | `public/assets/cria/illustrator/CERTIFICADO_ENTREGA_TECNICA_GARANTIA_Z8.ai` |
| `generate_pattern_swatch.jsx` | Padrão Vetorial Isométrico Z8 (45°) adicionado ao painel Swatches (Amostras) | Injetado no documento ativo |

---

## 🛡️ Módulo 1: Selos Vetoriais de Garantia Nacional (Warranty Seals)

### 1. Selo Circular Duplo Bauhaus (2 Anos / Chassi & Bateria 72V)
- **Construção Geométrica Paramétrica**: Estrela de 36 a 72 dentes de alta precisão desenhada matematicamente via trigonometria:
  $$x = c_x + r \cdot \cos(\theta), \quad y = c_y + r \cdot \sin(\theta)$$
- **Camadas e Anéis**:
  - Borda externa dentada (`strokeWidth = 1.5`, cor `#00E5FF` ou `#C2C6CA`);
  - Anel intermediário escuro (`#0A0B0E`) com inscrição em arco: `★ GARANTIA NACIONAL Z8 E-MOTION ★`;
  - Núcleo central com tipografia colossal `2 ANOS` em Grotesque Condensada (`#00E5FF`);
  - Subtítulo técnico inferior: `MOTOR & BATERIA 72V // CONTRAN 996`.

### 2. Selo Hexagonal Aero-Tech (PDI Approved & Inspeção Técnica)
- **Inspiração**: Geometria estrutural automotiva e corte aeronáutico.
- **Construção**: Polígono de 6 vértices com linha perimetral dupla e ícone vetorial de raio elétrico (`⚡`) vazado no centro.
- **Inscrição**: `INSPEÇÃO TÉCNICA DE PDI // 100% APROVADO // LAUDO HOMOLOGADO`.

### 3. Selo Diamante Minimalista (Autenticidade & Concessão)
- **Construção**: Quadrado rotacionado 45° com moldura de alta densidade (0.75 pt), fundo Black Piano acetinado e logotipo `Z8 E-MOTION` centralizado com tracking estendido (+180).

---

## 📜 Módulo 2: Certificados Oficiais de Entrega Técnica e Garantia (A4)

Documento impresso em papel couché fosco 250g entregue fisicamente ao comprador na retirada da motocicleta elétrica em qualquer concessionária Z8:

### Anatomia Técnica do Certificado:
1. **Prancheta**: A4 Paisagem ($297 \times 210\text{ mm} = 841.89 \times 595.28\text{ pt}$).
2. **Moldura de Segurança Perimetral**:
   - Linha dupla perimetral (`strokeWidth = 2.5` e `0.75`) com cantoneiras técnicas Bauhaus estilizadas a 45°.
3. **Cabeçalho Jurídico Harmonizado**:
   - `Z8 EMOTION LTDA.` • CNPJ: `68.774.164/0001-00`
   - Sede: `Avenida Doutor Adhemar de Barros, nº 566, Jd. São Dimas, São José dos Campos - SP`
   - Foro Exclusivo: Comarca de São José dos Campos - SP.
4. **Bloco Esquerdo (Telemetria do Veículo)**:
   - Modelo Comercial (ex: `Z8 TANK HIGH-SPEED // LAF EDITION 2026`);
   - Número do Chassi (VIN / 17 dígitos no padrão ISO 3779);
   - Motor Elétrico (ex: `Brushless Hub Motor 3000W / IP67`);
   - Bateria de Tração (ex: `Lítio NMC 72V 45Ah com BMS CAN-Bus`);
   - Homologação: `Resolução CONTRAN 996/2022`.
5. **Bloco Direito (Titularidade & Checklist PDI de 6 Eixos)**:
   - Nome do Proprietário Adquirente e CPF/CNPJ;
   - Concessionária Z8 Emitente;
   - Checklist com 6 itens de inspeção técnica checados e validados:
     - `[X] Torque de Eixos & Balança`
     - `[X] Sangria e Freios Hidráulicos`
     - `[X] Calibração de BMS 72V`
     - `[X] Iluminação Full LED & Faróis`
     - `[X] Sensores Hall e Mapeamento`
     - `[X] Test-Ride Dinâmico Aprovado`
6. **Selo de Garantia Vetorial Embutido**:
   - Aplicado diretamente na prancheta com chancela visual de 2 Anos de Cobertura Total.
7. **Campos Formais de Assinatura**:
   - Responsável Técnico Autorizado Z8 (CREA/CFT);
   - Titular Adquirente (declaração expressa de recebimento e treinamento de pilotagem elétrica).

---

## 🎨 Paleta Corporativa Vetorial Oficial

Sempre utilize estas fórmulas de cor no ExtendScript:

```javascript
function makeRGB(r, g, b) {
    var c = new RGBColor();
    c.red = r; c.green = g; c.blue = b;
    return c;
}

// Cores RGB Oficiais Z8
var cDark     = makeRGB(10, 11, 14);     // #0A0B0E Black Piano
var cCyan     = makeRGB(0, 229, 255);    // #00E5FF Electric Cyan
var cLime     = makeRGB(34, 197, 94);    // #22C55E Lime Green
var cSilver   = makeRGB(194, 198, 202);  // #C2C6CA Platinum Grey
var cCardBg   = makeRGB(248, 250, 252);  // #F8FAFC Acetinado
var cBorder   = makeRGB(203, 213, 225);  // #CBD5E1 Linha Técnica
var cGold     = makeRGB(194, 150, 40);   // #C29628 Dourado de Segurança
```

Para materiais gráficos destinados à gráfica (Impressão Offset ou Digital), converta para **CMYK**:
```javascript
function makeCMYK(c, m, y, k) {
    var col = new CMYKColor();
    col.cyan = c; col.magenta = m; col.yellow = y; col.black = k;
    return col;
}

var cmykBlackPiano = makeCMYK(75, 68, 67, 90); // Preto Rico
var cmykCyanZ8     = makeCMYK(65, 0, 5, 0);     // Ciano Elétrico Gráfico
var cmykPlatinum   = makeCMYK(15, 10, 10, 0);   // Cinza Platina Gráfico
```

---

## 🚀 Boas Práticas de Engenharia Vetorial no Illustrator

1. **Camadas Estruturadas**:
   - Nunca jogue elementos soltos em uma única camada. Organize sempre: `01_Fundo`, `02_Moldura_Seguranca`, `03_Blocos_Dados`, `04_Tipografia`, `05_Selos_e_Assinaturas`.
2. **Conversão de Textos em Curvas para Gráfica**:
   - Antes de exportar o PDF para impressão final, converta os frames de texto para curvas para evitar problemas de fontes ausentes no bureau:
   ```javascript
   var textOutlines = textFrame.createOutline();
   ```
3. **Sangria (Bleed) de 3mm para Impressão**:
   - Ao exportar PDFs para impressão, mantenha 8.5 pt (3mm) de sangria nas bordas para refile perfeito na guilhotina.
4. **Preservação de Editabilidade**:
   - Sempre salve simultaneamente a versão `.AI` nativa com `pdfCompatible = true` e a versão `.PDF` em alta definição Acrobat 8 / PDF/X.


---

## 🧠 Protocolo de Treinamento de Design Vetorial (Design Thinking & Art Direction)

Para garantir que o agente gere peças de nível **Diretoria de Arte Sênior** e nunca layouts crus de programador:

### As 5 Leis Estéticas Invioláveis no Illustrator:
1. **Lei da Tipografia Editorial Contida (`areaText` Obrigatório para Parágrafos)**:
   - É estritamente proibido usar `pointText` para sentenças ou parágrafos com mais de 5 palavras.
   - Parágrafos devem sempre ser criados através de caixas delimitadoras (`pathItems.rectangle`) convertidas em `textFrames.areaText`, com largura e altura fixadas e `leading` explícito (`autoLeading = false`), impedindo que o texto transpasse as margens do documento.
2. **Lei do Selo Tridimensional de Prestígio (Luxury Embossed Badge)**:
   - Nenhum selo pode ser uma forma geométrica chapada e escura.
   - Todo selo oficial deve possuir:
     - Fita decorativa inferior bipartida (*Ribbon banner*) com pontas chanfradas em V;
     - Anel externo dentado de alta precisão (36 a 72 dentes calculados trigonometricamente);
     - Anel intermediário com contas peroladas (*beaded ring*);
     - Núcleo com tipografia monumental contrastante e estrelas de chancela.
3. **Lei da Segurança Gráfica e Fé Pública (Guilloché & QR Code)**:
   - Certificados, laudos e termos de garantia devem obrigatoriamente incorporar:
     - Malhas senoidais matemáticas de segurança (*Guilloché pattern*) com traçado ultra-fino (0.4 pt);
     - Cantoneiras decorativas de precisão nos 4 vértices da moldura perimetral;
     - QR Code vetorial autêntico de rastreabilidade com chave criptográfica e identificador de chassi (VIN).
4. **Lei da Proporção Áurea e Escala Modular**:
   - Alturas e larguras devem respeitar proporções harmônicas sem espaços ociosos.
   - O documento A4 Paisagem divide-se em:
     - Topo (15%): Cabeçalho institucional e marca;
     - Corpo Superior (45%): Duas colunas gêmeas de telemetria e dados técnicos;
     - Corpo Intermediário (15%): Declaração jurídica e conformidade CDC / CONTRAN 996;
     - Base (25%): Assinaturas formais com carimbo PDI, QR Code e Medalhão de Garantia de Luxo.
5. **Paleta de Contrastes Nobres**:
   - Fundo sempre claro acetinado (`#FEFEFF` / `#FAFAFD`);
   - Textos de leitura em ardósia escura (`#1E293B` / `#334155`);
   - Títulos em Black Piano puro (`#0A0B0E`);
   - Acentos nobres em Dourado de Segurança (`#C29628` / `#D4AF37`) e Ciano Elétrico Z8 (`#00E5FF`).


---

## 📐 Caderno de Lições de Design de Walter Mattos (Aplicadas ao Illustrator)

Com base no estudo aprofundado dos projetos e ensinamentos de **Walter Mattos** (referência brasileira em identidade visual e design de marcas):

### 1. O Grid vem para Harmonizar, não para Engessar
- O grid não é uma prisão matemática onde tudo tem que se encaixar à força. Ele entra após a ideia estabelecida para:
  - Definir proporções consistentes entre colunas, margens e caixas;
  - Estabelecer ritmo de leitura (relação harmônica entre blocos de texto e espaços de respiro);
  - Unificar a família de elementos para que selos, certificados e cartazes conversem na mesma linguagem visual.

### 2. O Princípio Soberano do Ajuste Ótico (Optical Correction)
- **A matemática do software mente para o olho humano**:
  - **Centralização Ótica vs. Mecânica**: Em formas curvas (círculos, selos, medalhões) ou caixas com cantos arredondados, o centro geométrico faz textos e ícones parecerem "afundados" ou deslocados para baixo. A regra de Walter Mattos exige subir o elemento ótico em $1.5\text{ pt}$ a $3\text{ pt}$ em relação ao centro métrico para que o cérebro humano o perceba perfeitamente centralizado.
  - **Peso Visual e Compensação**: Formas triangulares ou pontiagudas (como o raio Z8 ou fitas chanfradas) têm menos massa visual do que retângulos. Elas devem ser ligeiramente ampliadas ou deslocadas para balancear o peso com os blocos adjacentes.

### 3. A Proporção Áurea ($\phi = 1.618$) com Propósito Prático
- Walter Mattos combate a aplicação cega e vazia da proporção áurea ("jogar espirais em cima de desenhos para impressionar").
- **Como usamos de verdade**:
  - Escala modular de tipografia: $6.2\text{ pt} \times 1.618 \approx 10\text{ pt} \times 1.618 \approx 16.2\text{ pt} \times 1.618 \approx 26.2\text{ pt}$.
  - Relação entre áreas de informação: a proporção entre a área técnica (veículo) e a área legal/assinaturas segue razões harmônicas que geram conforto imediato na leitura.

### 4. Economia Vetorial (Clean Vector Paths)
- Em projetos no Adobe Illustrator, **menos pontos de ancoragem (anchor points) resultam em curvas mais orgânicas e perfeitas**.
- Vetores com nós em excesso geram cantos vincados e perda de fluidez. Cada arco ou curva deve ser construído com o mínimo indispensável de pontos Bézier com alças direcionais simétricas.

### 5. Respiro e Espaço Negativo Ativo (Gestalt)
- O espaço em branco ao redor dos textos técnicos e dos selos é um elemento de composição ativo. Ele evita a poluição visual e confere a autoridade, serenidade e prestígio que uma montadora de veículos elétricos exige.
