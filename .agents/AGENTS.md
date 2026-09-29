# Z8 E-Motion - Project Brain & Memory Rules

## Workspace Context & Architecture
- **Repository**: `https://github.com/willdbga-code/Z8` (branch: `main`)
- **Structure**: Multi-page Vite Application
  1. **Site Principal**: `/site-principal/` (`site-principal/index.html`, `site-principal/main.js`, `site-principal/style.css`, `site-principal/data/models.js`, `site-principal/data/franchiseInfo.js`)
  2. **Vendas (Landing Page Exclusiva)**: `/vendas/` (`vendas/index.html`, `vendas/app.js`, `vendas/style.css`). Standalone landing page without back navigation links.
  3. **N95C (Página de Produto Executiva)**: `/n95c/` (`n95c/index.html`, `n95c/app.js`, `n95c/style.css`)
  4. **Portal Hub (Root)**: `/` (`index.html`)

## Key Model & Pricing Memory
- Models catalog contains 11 models with `wholesalePrice`, `retailPrice`, `profit`, `markupPct`, `marginPct`, and `rank`.
- Always ensure safe optional chaining or fallback calculation: `model.profit ?? (model.retailPrice - model.wholesalePrice)`.

## Firebase & Authentication Architecture (Official `z8-emotion-brasil`)
- **Project ID**: `z8-emotion-brasil`
- **Firebase Auth API Key**: `AIzaSyCBAe00zQFgJkDJG70ywXx6xr0mOCIK8Fo`
- **Auth Domain**: `z8-emotion-brasil.firebaseapp.com`
- **Status of Auth**: Active & responding 200 OK (Google Auth + automated password reset email).
- **Status of Firestore**: ACTIVE & OPERATIONAL 200 OK on database `'default'` (`catalog_users`, `leads`, `service_orders` live and synchronized).
- **Core Files**:
  - `site-principal/services/firebase-service.js` (Official Firebase SDK v12 implementation)
  - `site-principal/catalog-auth.js` (Unified Auth & Local/Cloud Fallback Engine)
  - `site-principal/data/cloud-config.js` (Centralized Credentials & Seed Users)
  - `api/users.js`, `api/leads.js`, `api/orders.js` (Vercel Serverless Endpoints)

## Recovered Registered Accounts & Partners
1. **Christian Hideyuki (Admin Master)**: `christian.tkh@gmail.com` (Matriz Z8, São Paulo - SP, (12) 99800-8818) -> Status: `approved` / `admin`
2. **christian hideyuki**: `christian.hide@hotmail.com` (hide, Pindamonhangaba - SP, (12) 98898-6148) -> Status: `approved`
3. **William Del Barrio**: `willdbga@gmail.com` (Del Barrio E-Motors, Pindamonhangaba - SP, (12) 98813-0316) -> Status: `approved`
4. **Fabrício Daniel de Oliveira Castro**: `fabriciopolocruzeiro@gmail.com` (JF, Pindamonhangaba - SP, (12) 99106-4106, Passaporte VIP) -> Status: `approved`
5. **Derik**: `derik.dws@gmail.com` (derik, Jacareí - SP, (12) 98198-6760) -> Status: `pending` (Cadastrado via Catálogo Web em 03/09/2026)
6. **Jose da silva**: `zejda@gmail.com` (Empresa, Santana do Parnaíba - SP, (12) 98813-0316) -> Status: `approved`
7. **Vinicius ortiz**: `viniciusortizdovale@gmail.com` (Taubaté - SP, (12) 99666-7031) -> Status: `approved`

## Registered Service Orders (OS)
- `OS-2026-0101`: Mega Motos SP (Carlos Silveira) - Z8 Tank High-Speed - Status: `approved`
- `OS-2026-0102`: Z8 Vale do Paraíba (Roberto Mecânico) - Z8 FX-10 Sport - Status: `analyzing`
- `OS-2026-0103`: E-Motion Sul (Marcio Silva) - Z8 U2 Delivery Cargo - Status: `completed`
- `OS-2026-0104`: Litoral Elétrico Santos (Lucas Santos) - Z8 Sport Scooter - Status: `approved`

## Legal & Corporate Memory (Official `Z8 EMOTION LTDA.`)
- **Razão Social**: `Z8 EMOTION LTDA.`
- **CNPJ/MF**: `68.774.164/0001-00`
- **Sede Corporativa**: Avenida Doutor Adhemar de Barros, nº 566, Jardim São Dimas, São José dos Campos - SP, CEP 12.245-010
- **Foro de Eleição Exclusivo**: Comarca de São José dos Campos - SP
- **Dossiê Jurídico & Franquias**:
  - `CONTRATO_PADRAO_DE_FRANQUIA.md`: Lei 13.966/2019 e Art. 784, III CPC (Título Executivo). Taxa Inicial de R$ 35.000,00, Reincidência de R$ 6.800,00/mês + R$ 1.000,00 tráfego pago. Cláusula penal rescisória de R$ 100.000,00 (ou 12 mensalidades). Descaracterização em 5 dias (R$ 2.000/dia). Fiança solidária e aval dos sócios com renúncia aos arts. 827, 835 e 838 do CC. Non-compete de 24 meses em raio de 100 km (multa R$ 100k). Blindagem trabalhista e CDC paritário.
  - `CIRCULAR_DE_OFERTA_DE_FRANQUIA_COF.md`: 100% harmonizada com o contrato e prazo de entrega > 10 dias corridos.
  - `PARECER_REGULATORIO_CONTRAN_996.md`, `POLITICA_DE_PRIVACIDADE_LGPD.md`, `TERMOS_DE_USO.md`, `TERMO_DE_ENTREGA_TECNICA_E_PDI.md`, `TERMO_DE_GARANTIA_NACIONAL_Z8.md`: 100% harmonizados.
  - Sincronização espelhada em `docs/juridico/` e `public/docs/juridico/`.
  - PDFs oficiais gerados via `scripts/generate_pdf.js`.

## Architectural & Store Design Memory (Official Z8 Standards)
- **Façade Specifications**:
  - Testeira / Viga: ACM Aço Escovado Natural (*Brushed Silver / Inox*), 4mm, proteção UV.
  - Fundo de Paredes: **Cinza Platina** (referência Cartela #284, HEX `#C2C6CA`).
  - Logotipo Z8: 3D em chapa metálica **Bright Silver** com chanfro aero-esportivo e iluminação indireta Halo LED 6500K / Ciano Z8.
  - Letreiro Secundário: **Preto Brilho** (*Black Piano*) usinado a laser "MOBILIDADE ELÉTRICA".
  - Detalhe Amadeirado (Opcional): Chapa ACM textura **Madeira Mogno** nas bases dos pilares, arcos e lounge.
  - Iluminação Rasante: Spots embutidos Downlight IP65 de 4000K (Luz Neutra).
- **Pisos**:
  - Showroom e Vendas: Porcelanato retificado acetinado claro tom cinza (Cinza Platina claro 80x80cm ou 90x90cm).
  - Oficina e PDI: Resina epóxi autonivelante industrial Cinza Médio de alta resistência (≥ 500 kgf/cm²).
- **Requisitos Operacionais & Menor Área Comercial**:
  - 2 Elevadores hidráulicos/pneumáticos para motocicletas elétricas.
  - Lote mínimo de 10 motos por compra da franquia.
  - **Menor Área Útil Comercial Possível**: **50 m² a 55 m² úteis** (mínimo recomendado: **55 m² a 60 m²**).
- **Vínculos com Tamanhos de Fachada**:
  - **Fachada 2m (Módulo Corredor Urban)**: 56 a 60 m² (2m x 28-30m), 2 elevadores em linha (Tandem), 10 motos.
  - **Fachada 3m (Módulo Compact Rua)**: 60 a 66 m² (3m x 20-22m), 2 elevadores semi-escalonados, 10 a 11 motos.
  - **Fachada 5m (Módulo Standard Store)**: 80 a 90 m² (5m x 16-18m), 2 elevadores lado a lado (Twin Bay), 10 a 12 motos.
  - **Fachada 10m a 14,90m (Master Flagship)**: 150 a 250 m² (14,90m x 1,00m de viga, 3 arcos monumentais, torre 4,20m x 1,80m), 18 a 25 motos.
- **Core Architecture Documents**:
  - `docs/Brandbook_Z8_Emotion/MANUAL_ARQUITETURA_E_PLANTA_BAIXA.md` (e .pdf)
  - `docs/manuais/MANUAL_DE_IDENTIDADE_VISUAL_E_ARQUITETURA_Z8.md` (e .pdf)
  - `docs/manuais/GUIA_PADRONIZACAO_ARQUITETURA_E_FACHADAS_Z8.md` (e .pdf)
  - `site-principal/data/franchiseInfo.js`

## Git & Deployment Protocol
- Remote repository is `willdbga-code/Z8`.
- Push permission is authorized for user `christian-hideyuki`.
- Commits deployed: `cad8124`, `358995e`, `89b0cf7`, `cca27dc`, `73d7620`, `8e55022`, `97290e2`, `4e1b26a`, `b0c4902`, `bc5e305`, `dc1a952`, `62442bc`, `8f87583`, `0d87b26`, `64a17ab`, `d69ede0`, `5a0851c`.

## Responsive Design & Cross-Device Engineering Protocol (MANDATORY & PERMANENT)
- **Every Single Modification Protocol**: Whenever adding, editing, or refactoring pages, sections, components, modals, tables, or buttons across ANY page in the Z8 ecosystem (`/`, `/site-principal/`, `/vendas/`, `/n95c/`, `/apresentacao/`, `/posters/`), the agent MUST proactively review, audit, and calibrate responsiveness across all viewport sizes before completing the turn.
- **Breakpoints Standard**:
  - **Small Mobile (< 480px / 360px - 414px)**: Single-column grids, zero horizontal overflow (`overflow-x: clip` or `hidden`), touch targets ≥ 44px, full-width modal dialogs with safe padding (12px-16px), responsive font scaling with `clamp()`, and horizontal scrolling wrappers for tables (`overflow-x: auto; -webkit-overflow-scrolling: touch;`).
  - **Tablet (481px - 768px - 1024px)**: 2-column or fluid auto-fit grids (`repeat(auto-fit, minmax(280px, 1fr))`), adaptable navigation bars, accessible floating CTA buttons, and readable card telemetry.
  - **Desktop (> 1024px)**: Structured multi-column luxury layouts, master flagships, and max-width containers (`1200px` - `1400px`) centered with `margin: 0 auto`.
- **Modals & Overlays**:
  - Max height `90vh` or `92dvh` with internal scroll (`overflow-y: auto`), accessible sticky close buttons, `max-width: min(95vw, <desktopWidth>)`, and safe margins on mobile.
- **Tables & Data Grids (CRM / OS / Admin)**:
  - Always wrapped in dedicated responsive containers (`overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;`) with visible badges, clear headers, and touch-friendly controls.
## Bauhaus Visual Scheme & Regional Advertising Protocol (MANDATORY & PERMANENT)
- **Design Philosophy**: Form follows function (*Form folgt Funktion*). Strict asymmetric mathematical grid, generous negative space, no decorative clutter.
- **Visual Hierarchy & Flow**:
  1. Top Status Pill: `Z8 E-MOTION // CONCESSÃO [ANO]`
  2. Hero Headline: Monumental Bauhaus Grotesque (Bold, Architectural, `leading: 1.05`, uppercase).
  3. Hero Vehicle: Exclusively official Z8 models (`z8Models` in `site-principal/data/models.js`).
     - **NEVER change the motorcycle design/shape**. The frame, silhouette, wheels, and parts must match our real models.
     - **Modify the motorcycle colors** across generations (e.g. Desert Sand Matte, British Racing Emerald, Cyber Electric Blue, Midnight Black Gloss, Pearl White) to prevent visual repetition.
     - **Always use real atmospheric regional background scenery** (agro corridors, modern urban skylines, European cobblestone avenues, coastal boulevards) integrated behind the bike.
     - **NEVER include people / humans in the generated images**. Clean vehicle hero only.
- **Instagram Stories & Reels Safe Zone Protocol (MANDATORY)**:
  - **Resolution**: 1080 × 1920 px (9:16).
  - **Top Dead Zone (250 px)**: Keep the top 250px free of critical text (reserved for profile handle, stories progress bars, close button, time/battery). Top pill and headline must start strictly below Y = 250px.
  - **Bottom Dead Zone (300 px - 350 px)**: Keep the bottom 300px completely free of text, telemetry, and buttons (reserved for Instagram's 'Send Message' reply bar, heart icon, share icon, Reels caption, audio pill, and right-side interactive icons).
  - **Active Safe Zone (Zona Segura)**: All critical typography, headline, vehicle hero, telemetry grid, and CTA must reside strictly within `Y = 260px` to `Y = 1600px`.
  - **Single Unified Grid**: Telemetry metrics (Row 1) and Call To Action for scheduling (Row 2) must be integrated into ONE single Bauhaus grid block, completely eliminating duplicate data rows.
## Z8 Visual Engine & Artistic Generation Protocol (MANDATORY & PERMANENT)
- **Design Foundations & Art Schools**:
  - **Bauhaus (Dessau/Weimar)**: Form follows function (*Form folgt Funktion*). Strict geometric grids, asymmetric balance, absolute elimination of decorative clutter.
  - **Russian Constructivism & Avant-Garde (Rodchenko, El Lissitzky)**: Monumental typography, dynamic diagonal rhythm, high-contrast scale tension (giant hero titles conversing with micro-technical telemetry).
  - **International Typographic Style (Swiss Modernism - Müller-Brockmann)**: Strict mathematical grids, objective hierarchy, and generous negative space.
  - **Walter Mattos & Native Minimalist Humanization**:
    - Functional, non-dogmatic application of the **Golden Ratio ($\phi \approx 1.618$) and Fibonacci spiral** as a compositional balance guide.
    - Optical alignment taking precedence over pure mechanical/metric alignment.
    - Clean vector drafts without visual noise.
  - **Behance Master Benchmark (EGIKE by Omar Elagamy)**:
    - Pure automotive industrial design and editorial art direction (`behance.net/gallery/242918611/EGIKE`).
    - Staggered dynamic pills (`border-radius: 9999px`) in asymmetric solid white, solid cyan, outlined, and dark matte variations with circular icon badges (`✦`, `⚡`).
    - Monumental condensed grotesque typography (`Barlow Condensed` / `Outfit`) tightly stacked with high contrast.
    - Clean industrial automotive studio photography with directional strobe lighting, textured concrete, and natural floor reflections.

- **The 4 Non-Negotiable Creation Conditions**:
  1. **Motorcycle Models as Base for Photographic Generation (`public/assets/models/`)**:
     - All new photographic scenes, clean plates, and commercial backdrops MUST be generated using the REAL motorcycle models from `public/assets/models/` as visual reference. Maintain the authentic frame geometry, headlamps, body lines, and colors.
  2. **Official Z8 Logo Seamlessly Integrated on the Motorcycle**:
     - The logo on the motorcycle MUST make sense with the vehicle's industrial design. It must be situated exclusively on smooth, flat, unobstructed bodywork surfaces (e.g. side battery shroud or tank crest), with zero clipping, and STRICTLY avoiding transposing, intersecting, or colliding with tubular bars, frame pipes, cables, or hardware.
  3. **Structural Z8 Logo / Pattern Repetition Integration**:
     - EVERY artwork MUST incorporate the official Z8 logo within its composition structure:
       - Either as an architectural minimalist watermark badge (`logo minimalista.png`),
       - Or as a geometric isometric repeat pattern (`Repetição em padrão.png`, `Repetição em padrão 2.png`) with opacity $\le 100\%$ (typically 5% to 25% for ambient watermark, up to 100% for solid accent banners).
  4. **Fibonacci, Aspect Ratio & Monumental Typography**:
     - Layout composition must follow the **Golden Ratio ($\phi$) and Fibonacci focal nodes**.
     - Formats supported: Stories/Reels (9:16 - 1080x1920), Feed Portrait (4:5 - 1080x1350), Feed Square (1:1 - 1080x1080).
     - **Exponential Typography Scale**: Main city / hook headlines must have colossal scale (130px - 150px, bold condensed grotesque) to command immediate scroll-stopping power.
     - **EGIKE Dynamic Rounded Pills**: Value propositions, telemetry, and metrics must be formatted as asymmetric dynamic pills (`border-radius: 9999px`) inspired by Omar Elagamy's project.

- **The 4 Golden Negative Rules**:
  - **RULE NEG-1 (NEVER USE TEXT-LADEN ART FOR NEW ART)**: NEVER use an image containing pre-existing rasterized text as a reference/base for creating new images. Always generate or establish the **Clean Plate** first, and layer typography independently on top.
  - **RULE NEG-2 (NEVER LEAVE EXPOSED LINES)**: NEVER leave orphan, exposed lines (random dividing lines, default PowerPoint underlines, or non-functional contours). All graphical elements must be solid modules, glassmorphic cards, or dynamic rounded pills with functional purpose.
  - **RULE NEG-3 (NO HEAVY ARTIFICIAL DEAD ZONE GRADIENTS)**: NEVER apply heavy, muddy black gradient fades over the top and bottom dead zones. Let the natural photography and studio lighting breathe cleanly; simply position all typography and interactive buttons strictly within the active safe zones ($Y = 260px$ to $Y = 1600px$).
  - **RULE NEG-4 (NEVER USE LUMINOUS / NEON EFFECTS)**: NEVER use luminous effects (`text-shadow` glows, neon blooming, cyan outer-glow halos, or glowing blur). All colors and graphic elements must be crisp, solid, matte, and editorial (e.g. solid white `#FFFFFF`, solid cyan `#00F0FF`, deep graphite `#0A0B0E`, crisp 1.5px solid borders, and clean physical drop shadows without colored glow).

- **Official Asset Network (`public/assets/logos/`)**:
  - `logo minimalista.png`: Metallic 3D Z8 emblem with beveled relief, transparent background.
  - `Repetição em padrão.png`: Isometric monochrome diagonal repeating pattern grid.
  - `Repetição em padrão 2.png`: Electric Cyan (`#00F0FF`) diagonal repeating pattern grid.
  - `Logo com impacto.png`: High-impact dual-tone emblem (Lime Green Z + Electric Cyan 8 + E-MOTION POWER).
  - `Mecanicos.png`: Architectural vertical typographical badge (Z8 E-MOTION // ELECTRIC MOBILITY).
  - `z8logo.png` & `logo_z8_main.png`: Official master horizontal vectors.
  - `ztrasparente.png`: Transparent Z watermark element.

- **Mandatory Auto-Save & Separation in /public/assets/cria/ (PERMANENT & MANDATORY)**:
  - **Base Clean Plates / Posters Backup**: All clean plates, raw photographic generations, and clean base posters MUST be saved in `public/assets/cria/posters/` (and mirrored to `dist/assets/cria/posters/`).
  - **Final Composite Pieces**: All finished artworks with injected PNL copy, dynamic pills, and CTAs MUST be saved directly in `public/assets/cria/` (and mirrored to `dist/assets/cria/`).
  - **Immediate Turn Display**: EVERY generated art MUST be immediately displayed/rendered directly in the agent's turn response (via embedded media or interactive artifact) so the USER can consult, inspect, and request corrections on the fly.
  - **High-Curiosity NLP (PNL) Principle**: Avoid lengthy explanatory text. Prioritize provocative psychological hooks, territorial authority, and urgency ("Uma cidade inteira. Uma única chave. Quem chegar primeiro, domina.").

- **Perpetual Memory Engine (MemPlace + Brain Notebook)**:
  - For EVERY new artwork created or proposed, write a permanent contextual entry to `docs/BRAIN_NOTEBOOK.md` and keep this knowledge permanently accessible across all sessions.

## Specialized Subagents & Skill Network (.agents/skills/)
1. **`z8-art-agent`** (`.agents/skills/art_agent/SKILL.md`): Motor Visual e Diretor de Arte Automatizado. Gera clean plates fotográficos (Imagen), aplica tipografia magnética `Syne 800/900`, gerencia resoluções oficiais (Reels 9:16, Feed Retrato 4:5, Feed Quadrado 1:1), executa renderização via Edge Headless, proíbe setas no rodapé e padroniza o domínio corporativo oficial `Z8EMOTION.COM`.
2. **`z8-franchise-sdr`** (`.agents/skills/franchise_sdr/SKILL.md`): Agente Comercial & SDR de Expansão de Franquias. Triagem e qualificação de investidores no banco (`catalog_users`, `leads`), cálculo de score de capital (≥ R$ 90k-100k para taxa de R$ 35k + 10 motos), checagem de viabilidade de ponto comercial (50m², 2 elevadores) e geração de dossiês com scripts prontos para WhatsApp para Christian Hideyuki.
3. **`z8-legal-counsel`** (`.agents/skills/legal_counsel/SKILL.md`): Agente Jurídico & Compliance. Emissão da COF com Recibo e trava dos 10 dias da Lei 13.966/2019, injeção cadastral do Contrato Padrão de Franquia (Título Executivo CPC) e geração de pacotes técnicos de PDI e Garantia por lote de 10 motos.
4. **`z8-service-ops`** (`.agents/skills/service_ops/SKILL.md`): Agente de Pós-Venda, Gestão de OS & Oficina Técnica. Diagnóstico interativo de falhas elétricas (baterias 72V, BMS, FOC, Hall), auditoria de garantia por chassi, laudos com part numbers para expedição e alocação operacional dos 2 elevadores da oficina.
5. **`z8-finance-intel`** (`.agents/skills/finance_intel/SKILL.md`): Agente de Controladoria & Inteligência Financeira. Modelagem de DRE trifásica (10, 15 e 20 motos/mês), cálculo de break-even (4 motos), rentabilidade da oficina dos 2 elevadores e tempo de payback para investidores.
6. **`z8-concierge-b2c`** (`.agents/skills/concierge_b2c/SKILL.md`): Agente de Atendimento ao Consumidor Final & Vendas Varejo. Consultoria de escolha do modelo ideal de moto, desmistificação de regras de CNH e trânsito (CONTRAN 996), cálculo de custo de recarga na tomada (R$ 1,80 a R$ 2,50/carga, economia mensal vs gasolina) e direcionamento geolocalizado para test-ride na concessionária credenciada mais próxima.
7. **`memplace`** (`.agents/skills/memplace/SKILL.md`): Motor de memória contextual e conexão com NotebookLM / Gemini Knowledge Brain.

## Resume Point for Current Session
1. **Rede de 6 Subagentes Oficiais 100% Concluída e Operacional**:
   - `z8-art-agent`: Marketing, Criação Visual & Renderização Multiformato (Reels 9:16, Feed 4:5, Feed 1:1).
   - `z8-franchise-sdr`: Comercial & Expansão de Franquias B2B (Triagem, Score ≥ R$ 100k, WhatsApp 1-Click).
   - `z8-legal-counsel`: Jurídico & Compliance (COF Lei 13.966/2019 com trava de 10 dias, Contrato Executivo CPC e PDI/Garantia de 10 motos).
   - `z8-service-ops`: Pós-Venda, Diagnóstico de OS & Gestão de Oficina (Falhas 72V, Part Numbers e 2 Elevadores).
   - `z8-finance-intel`: Controladoria & Inteligência Financeira (DRE 10/15/20 motos, Break-even 4 motos, Payback).
   - `z8-concierge-b2c`: Atendimento ao Consumidor Final (Match de Modelo, CONTRAN 996, Recarga R$ 1,80 e Test-Ride).
2. **Artes Multiformato Consolidadas (100% Finalizadas nos 3 Formatos: 9:16, 4:5 e 1:1)**:
   - **Jacareí - SP**: Z8 Tank High-Speed (Mostarda Trail / Hero Light) -> Reels 9:16, Feed Retrato 4:5, Feed Quadrado 1:1.
   - **Guaratinguetá - SP**: Z8 FX-10 Sport (Prata Titânio / LED Horizontal / Letreiro Empilhado GUARA / TINGUETÁ) -> Reels 9:16, Feed Retrato 4:5, Feed Quadrado 1:1.
   - **Taubaté - SP**: Z8 Harley X21 Custom (Midnight Gloss Black / Chopper Americana / Letreiro TAUBATÉ) -> Reels 9:16, Feed Retrato 4:5, Feed Quadrado 1:1.
   - **Pindamonhangaba - SP**: Z8 N710 Urban Plus (Cinza Titânio & Grafismos Neon / Letreiro Empilhado PINDA / MONHANGABA) -> Reels 9:16, Feed Retrato 4:5, Feed Quadrado 1:1.
3. **Campanha Oficial de Recrutamento (Matriz SJC - 3 Vagas em Stories 9:16)**:
   - **Mecânico de Motos Elétricas**: Manequim técnico Z8 Power, oficina 2 elevadores, `MECÂNICO` monumental, Direct Instagram.
   - **Consultora de Vendas**: Manequim busto polo Z8 bordada, showroom de luxo, `VENDAS` monumental, Direct Instagram.
   - **Zeladoria & Serviços Gerais**: Manequim atlético camiseta Z8, sede corporativa, `ZELADORIA` monumental, Direct Instagram.
4. **Próximas Praças Estratégicas do Cluster**:
   - São José dos Campos (Matriz / Flagship) e Litoral Norte (Caraguatatuba / Ubatuba / São Sebastião / Ilhabela).
5. **Redesign Drástico de Montadora de Luxo (Padrão Hyundai Brasil - 100% Concluído)**:
   - **Engenharia Reversa AEM/React & CRO**: `docs/design_system/BENCHMARK_HYUNDAI_E_UX_Z8.md`.
   - **Erradicação Total de Skeuomorfismo**: Remoção integral da fonte Orbitron, bevels, texturas pseudo-metálicas e botões plásticos. Adoção da tipografia moderna `Outfit` (pesos 300 a 900) para títulos/destaques e `Inter` para leitura corporal.
   - **Paleta Refinada Automotiva**: Cinza Claro Estúdio Acetinado (`#F4F5F7`), Cinza Escuro Slate (`#111827`), Azul Navy Heritage (`#002C5F`), superfícies brancas puras (`#FFFFFF`) e linhas milimétricas (`1px solid #E2E8F0`).
   - **Palco do Veículo Hero de Montadora (`/site-principal/`)**: Palco monumental com seletor interativo horizontal na base (Tank, FX-10, Harley, N710), telemetria dinâmica em pills e transição de imagem suave.
   - **Showroom & Comparador de Modelos**: Seletor dinâmico de cores de fábrica (swatches) em 11 modelos, Comparador lado a lado com 14 especificações CONTRAN 996, custos de recarga e margens.
   - **Controles & Painel Financeiro Executivo**: Substituição da tela LCD verde e sliders volumosos por controles refinados de montadora, sliders com track milimétrica e tabela executiva.
   - **Landing Page B2B (`/vendas/`)**: Tokens alinhados em `#F4F5F7` e `#002C5F`, tipografia `Outfit`, seletor de cores nos 10 modelos, wizard progressivo em 2 etapas com auto-save e Mobile Sticky Action Bar.
   - **Portal Hub (`/`)**: Totalmente modernizado para padrão corporativo com badges institucionais e cards refinados.
   - **Build & Responsividade**: `npm run build` testado com 100% de sucesso (0 erros de bundling) e calibração responsiva mobile (< 480px, 640px, 768px, 1024px+).
6. **Auditoria 360, Humanização & Limpeza Profunda (100% Concluída)**:
   - **Expurgo do Balão Inferior Esquerdo**: Remoção integral de `#live-sales-popup` e de scripts de compradores simulados (`initLiveSalesPopups`, `initCountdownTimer`, `initSeatDecreaser`).
   - **Remoção de Redundâncias**: Eliminação do footer duplicado intermediário em `/vendas/` e fusão da seção intermediária de franquia diretamente no rodapé de `/site-principal/`, desobstruindo o fluxo de rolagem.
   - **Ampliação do Fluxo de Leitura**: Aumento das fontes corporais (de 11-13px para 15-18px / 1rem - 1.08rem) e altura de linha (1.68) para legibilidade descansada.
   - **Humanização de Tom & Linguagem**: Eliminação de termos de infoproduto ("tripwire", "master card", "taxa gratuita") em prol de comunicação executiva de concessão de montadora.
   - **Correção de Contraste**: Resolução de textos brancos herdados do modo escuro sobre o novo fundo cinza claro.
