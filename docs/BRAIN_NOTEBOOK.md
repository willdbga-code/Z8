# 🧠 CÉREBRO DE MEMÓRIAS Z8 E-MOTION (Gemini & NotebookLM Knowledge Brain)

> Documento de referência central de memórias do projeto **Z8 E-Motion**, indexado e gerenciado pela função `memplace`.

---

## 1. 📐 Arquitetura & Estrutura de Páginas

| Aplicação | Diretório | Arquivos Principais | Função no Ecossistema |
| :--- | :--- | :--- | :--- |
| **Portal Hub** | `/` | `index.html`, `vite.config.js` | Navegação central para todas as aplicações |
| **Site Principal** | `/site-principal/` | `index.html`, `main.js`, `style.css`, `data/models.js` | Portal da marca, catálogo completo de 11 modelos, comparativo de lucros e formulário de parceria |
| **Vendas (B2B)** | `/vendas/` | `index.html`, `app.js`, `style.css` | Landing page de alta conversão para atacadistas e franqueados. Página 100% isolada e sem links de retorno |
| **N95C Executive** | `/n95c/` | `index.html`, `app.js`, `style.css` | Página premium focada na Scooter Executiva N95C E-Motion |

---

## 2. 📊 Tabela Oficial de Modelos, Preços e Margens (Memória Atualizada 2026)

| Rank | Modelo | Código | Categoria | Preço Atacado | Preço Varejo | Lucro Bruto | Markup % | Margem % |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1º | **Z8 Diamond Luxe** | DB050-DM | Vintage | R$ 3.400,00 | R$ 6.800,00 | R$ 3.400,00 | 100.0% | 50.00% |
| 2º | **Z8 GS-005 Base Norte** | GS-005 | Utilitária | R$ 3.200,00 | R$ 6.200,00 | R$ 3.000,00 | 93.75% | 48.39% |
| 3º | **Z8 N710 Urban Plus** | DB045-N710 | Urbana | R$ 5.300,00 | R$ 9.500,00 | R$ 4.200,00 | 79.25% | 44.21% |
| 4º | **Z8 Q11 Compact** | DB043-Q11 | Urbana | R$ 5.200,00 | R$ 9.300,00 | R$ 4.100,00 | 78.85% | 44.09% |
| 5º | **Z8 N7 Standard** | DB001 | Urbana | R$ 5.500,00 | R$ 9.500,00 | R$ 4.000,00 | 72.73% | 42.11% |
| 6º | **Z8 Q10 Vintage** | DB038 | Vintage | R$ 5.800,00 | R$ 9.800,00 | R$ 4.000,00 | 68.97% | 40.82% |
| 7º | **Z8 U2 Delivery Cargo** | XB-026 | Utilitária | R$ 6.000,00 | R$ 9.500,00 | R$ 3.500,00 | 58.33% | 36.84% |
| 8º | **Z8 FX-10 Sport** | DB043 | Esportiva | R$ 7.000,00 | R$ 11.000,00 | R$ 4.000,00 | 57.14% | 36.36% |
| 9º | **Z8 Harley X21 Custom** | XB-024 | Custom | R$ 6.500,00 | R$ 10.000,00 | R$ 3.500,00 | 53.85% | 35.00% |
| 10º | **Z8 N95C Max Comfort** | DB039 | Urbana | R$ 6.500,00 | R$ 10.000,00 | R$ 3.500,00 | 53.85% | 35.00% |
| 11º | **Z8 Tank High-Speed** | DB018 | Performance | R$ 7.500,00 | R$ 11.500,00 | R$ 4.000,00 | 53.33% | 34.78% |

---

## 3. 🎨 Design System & Estética (Skeuomorphic Glassmorphism)

- **Cores Principais**:
  - Dark Metal: `#0A0D14`, `#121620`, `#1A202C`
  - Neon Accent: `#00F2FE`, `#4FACFE`
  - Emerald Green: `#10B981` (Destaque de lucros)
  - Gold Accent: `#F59E0B`, `#FFD700`
- **Tipografia**: `Inter`, `Rajdhani`, `Orbitron` (Google Fonts)

---

## 4. 🔑 Memória de Integração Git & Servidor

- **Git Remote**: `https://github.com/willdbga-code/Z8`
- **Branch**: `main`
- **Usuário Autorizado**: `christian-hideyuki`
- **Servidor Dev Vite**: Port 3004 (`http://localhost:3004/`)
- **Localtunnel Público**: `https://social-dots-lead.loca.lt` (Password IP: `189.111.85.132`)

---

## 5. 📦 Cadeia de Suprimentos & Fornecedores de Capacetes (Atacado)

| Fabricante / Distribuidor | Marcas Representadas | Perfil / Categoria | Link Oficial B2B | Contato |
| :--- | :--- | :--- | :--- | :--- |
| **Starplast** | Peels, Bieffe, Fly | Escamoteável, Jet/Aberto, Retrô | [starplast.com.br](https://www.starplast.com.br) | (19) 3456-9000 / `contato@starplast.com.br` |
| **Pro Tork** | Evolution, Stealth, New Liberty, R8 | Entrada, Frotas, Alto Giro | [protork.com.br](https://www.protork.com.br) | Partner Center B2B |
| **Taurus Helmets** | San Marino, Urban Helmets, Taurus | Delivery clássico e Custom/Vintage | [taurushelmets.com.br](https://www.taurushelmets.com.br) | Portal Comercial B2B |
| **EBF Capacetes** | Spark, City, EBF 7, New Spark | Urbano Econômico | [ebfcapacetes.com.br](https://www.ebfcapacetes.com.br) | Fábrica SP |
| **Laquila Moto** | Texx + Multimarcas | Distribuidor Geral e Vestuário | [laquila.com.br](https://www.laquila.com.br) | Seção Revendedor |
| **BR Motorsport** | LS2, Norisk, KYT, AGV | Premium, Esportivo, Viseira Solar | [brmotorsport.com.br](https://www.brmotorsport.com.br) | Portal Lojista |
| **MTO Distribuidora** | Multimarcas Nacional | Motopeças e Capacetes | [mtodistribuidora.com.br](https://www.mtodistribuidora.com.br) | Portal B2B |
| **Damásio Motopeças** | Multimarcas Nacional | Distribuição Atacado | [damasiomotopecas.com.br](https://www.damasiomotopecas.com.br) | Representantes |

---

## 6. 👥 Base Consolidada de Parceiros, Leads e Ordens de Serviço (Setembro/2026)

### 6.1 Parceiros e Administradores Cadastrados
1. **Christian Hideyuki (Admin Master)**: `christian.tkh@gmail.com` | Matriz Z8 (São Paulo - SP) | `(12) 99800-8818` | Status: `approved` / `admin`
2. **christian hideyuki**: `christian.hide@hotmail.com` | hide (Pindamonhangaba - SP) | `(12) 98898-6148` | Status: `approved` / `partner`
3. **William Del Barrio**: `willdbga@gmail.com` | Del Barrio E-Motors (Pindamonhangaba - SP) | `(12) 98813-0316` | Status: `approved` / `partner`
4. **Fabrício Daniel de Oliveira Castro**: `fabriciopolocruzeiro@gmail.com` | JF (Pindamonhangaba - SP) | `(12) 99106-4106` | Status: `approved` / `partner` (Passaporte VIP)
5. **Derik**: `derik.dws@gmail.com` | derik (Jacareí - SP) | `(12) 98198-6760` | Status: `pending` (Cadastrado em 03/09/2026)
6. **Jose da silva**: `zejda@gmail.com` | Empresa (Santana do Parnaíba - SP) | `(12) 98813-0316` | Status: `approved` / `partner`
7. **Vinicius ortiz**: `viniciusortizdovale@gmail.com` | Viniciusortizdovale (Taubaté - SP) | `(12) 99666-7031` | Status: `approved` / `partner`

### 6.2 Leads e Oportunidades no CRM
- **Fabrício Castro (Passaporte VIP)**: R$ 2.989,00 | Exclusividade Pindamonhangaba | Tel: `(12) 99106-4106`
- **Jose da silva**: Santana do Parnaíba - SP | Tel: `(12) 98813-0316` | Status: Aprovado
- **Vinicius ortiz**: Taubaté - SP | Tel: `(12) 99666-7031` | Status: Aprovado
- **Derik (Portal Catálogo)**: Jacareí - SP | Tel: `(12) 98198-6760`
- **Lead WhatsApp**: Tel: `5512992236440` | R$ 450,00 | Retrato Autoral

### 6.3 Ordens de Serviço (SLA 48h)
- `OS-2026-0101`: Mega Motos SP (Carlos Silveira) - Z8 Tank High-Speed - Rastreio: `BR849302194SP` (Aprovado)
- `OS-2026-0102`: Z8 Vale do Paraíba (Roberto) - Z8 FX-10 Sport - Análise Técnica
- `OS-2026-0103`: E-Motion Sul (Marcio Silva) - Z8 U2 Delivery Cargo - Rastreio: `BR994820145PR` (Concluído)
- `OS-2026-0104`: Litoral Elétrico Santos (Lucas) - Z8 Sport Scooter - Rastreio: `BR771920334SP` (Aprovado)

---

## 7. 🎨 Z8 Visual Engine, Asset Network & Brand Architecture Protocol

> Protocolo perpétuo de geração de artes para redes sociais, campanhas publicitárias e identidade visual da Z8 E-Motion.

### 7.1 Rede de Assets Oficiais (`public/assets/logos/`)
- `logo minimalista.png`: Emblema 3D Z8 em Bright Silver/Cromo com chanfro aeroesportivo e relevo sutil. Uso: Selo de tanque e assinatura institucional.
- `Repetição em padrão.png`: Grid isométrico de repetição diagonal em tom monocromático. Uso: Watermark estrutural e texturas com opacidade ≤ 100% (5% a 25%).
- `Repetição em padrão 2.png`: Grid isométrico em Ciano Elétrico Z8 (`#00F0FF`). Uso: Acentos tecnológicos, faixas de velocidade e banners.
- `Logo com impacto.png`: Logotipo dual-tone de alta energia (Z Verde Neon + 8 Ciano + "E-MOTION POWER").
- `Mecanicos.png`: Selo tipográfico arquitetural vertical ("Z8 E-MOTION // ELECTRIC MOBILITY").
- `z8logo.png` & `logo_z8_main.png`: Master vetorial horizontal com sub-assentamento institucional.
- `ztrasparente.png`: Elemento tipográfico "Z" recortado translúcido para fundos e layouts de impacto.

### 7.2 As 4 Condições Inegociáveis & 4 Leis Negativas de Criação
1. **Modelos Reais como Base para Novas Imagens Fotográficas (`public/assets/models/`)**: O veículo hero DEVE ser gerado ou composto tendo como referência visual direta os modelos reais do catálogo oficial Z8 (`public/assets/models/z8_tank_studio.jpg`, `z8_fx10_studio.jpg`, etc.). Mantêm-se a anatomia, o chassi, o farol duplo e as proporções industriais da moto Z8.
2. **Logo Z8 com Sentido Anatômico no Design da Moto**: O emblema na moto deve fazer sentido com a volumetria da carenagem, situando-se exclusivamente em superfícies lisas, amplas e sem obstruções (ex: face central da carenagem ou cume do tanque). É terminantemente proibido sobrepor ou transpor o logo sobre canos de aço tubular, barras de proteção, soldas ou fiações.
3. **Logo Z8 Estrutural / Pattern de Repetição**: Todo cartaz deve conter a marca integrada à composição (ex: `Repetição em padrão 2.png` com opacidade de 10% a 25% no quadrante de acento ou monograma `Z8 E-MOTION` de fundo em escala monumental).
4. **Fibonacci, Escala Monumental & Pílulas Dinâmicas EGIKE**:
   - Títulos de cidades em **Escala Exponencial Monumental** (130px a 150px, bold grotesque condensado) para travar o scroll imediatamente.
   - Telemetria e métricas estruturadas na anatomia de **Pílulas Dinâmicas EGIKE** (sistema assimétrico de pílulas sólidas brancas, ciano elétrico, contorno vazado e cápsulas circulares de ícones `✦`, `⚡`).
- **LEI NEGATIVA 1**: NUNCA usar imagens que contenham textos rasterizados para gerar novas artes com texto. O Clean Plate fotográfico é gerado puro primeiro; a tipografia é injetada em camada independente.
- **LEI NEGATIVA 2**: NUNCA deixar linhas expostas soltas (sublinhados órfãos, traços de PowerPoint). Todo elemento gráfico deve ser um bloco/card/pílula funcional.
- **LEI NEGATIVA 3**: NUNCA usar degradês pesados artificiais cobrindo as áreas mortas. A fotografia de estúdio/ambiente deve respirar limpa; o controle de corte é feito posicionando a tipografia e botões estritamente dentro da Zona Segura ($Y = 260px$ a $Y = 1600px$).
- **LEI NEGATIVA 4**: NUNCA usar efeitos luminosos (sem `text-shadow` brilhante, sem `box-shadow` com neon glow, sem halos azuis difusos ou borrões). Cores sólidas, foscas, tipografia editorial de altíssimo contraste e sombras físicas puras.

### 7.3 Escolas de Referência & Benchmark EGIKE
- **Behance Master Benchmark (EGIKE por Omar Elagamy)**:
  - Estudo de caso: `behance.net/gallery/242918611/EGIKE`.
  - Direção de arte automotiva minimalista pura: fotografia com iluminação rasante direcional de estúdio sobre concreto grafite escuro, reflexos suaves no piso e zero artifícios neon.
  - Tipografia de display condensada e monumental em camadas com o veículo.
  - Matriz de pílulas dinâmicas assimétricas com alta densidade de informação limpa.
- **Bauhaus (Dessau/Weimar)**: Forma segue função (*Form folgt Funktion*), grids geométricos puros, assimetria intencional.
- **Construtivismo Russo (Rodchenko, El Lissitzky)**: Tensões de escala monumental em contraste com dados técnicos.
- **Estilo Tipográfico Internacional Suíço (Josef Müller-Brockmann)**: Grelha matemática modular, clareza cirúrgica.
- **Walter Mattos (Brasil)**: Desmistificação prática de Fibonacci, alinhamento óptico prioritário sobre o mecânico.

### 7.4 Registro Canônico de Artes Produzidas (Z8 Visual Engine Log)
- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V3-EGIKE`
  - **Data / Horário**: 24/09/2026 - 03:35 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Modelo Hero**: Fotografia automotiva baseada na Z8 Tank High-Speed (`public/assets/models/z8_tank_studio.jpg`)
  - **Clean Plate**: `public/assets/cria/story_jacarei_clean_egike.jpg` (estúdio industrial dark, iluminação direcional pura, zero neon)
  - **Selo na Moto**: Emblema metálico "Z8" perfeitamente posicionado na face lisa amarela da carenagem lateral, com folga total das barras tubulares e ferragens.
  - **Formato**: 9:16 Stories & Reels (1080 × 1920 px)
  - **Tipografia**: Barlow Condensed 148px (Branco sólido) + 82px (Ciano Z8 sólido) — ZERO efeito luminoso.
  - **Estrutura de Copy PNL**: `1 ÚNICA CONCESSÃO EXCLUSIVA. DOMINE O MERCADO DE MOBILIDADE DO VALE ANTES QUE OUTRO SE ANTECIPE.`
  - **Asset Estrutural Aplicado**: `Repetição em padrão 2.png` no canto superior direito (10% opacidade) + Watermark colossal `Z8 E-MOTION` ao fundo.
  - **Matriz de Pílulas EGIKE**:
    - Pílula Sólida Branca: `52% Margem Líquida`
    - Pílula Sólida Ciano: `Raio Exclusivo Comarca`
    - Cápsula Ícone: `✦`
    - Pílula Contorno: `Oficina 2 Elevadores`
    - Pílula Fosca Dark: `Lote Mínimo 10 Motos`
    - Cápsula Ícone Ciano: `⚡`
  - **CTA de Conversão**: `[ ASSEGURE SUA CONCESSÃO • (12) 99800-8818 ]` (Pílula 9999px em ciano sólido sem brilho difuso)
  - **Conformidade**: 100% compliant com Safe Zones do Instagram (Y=275px a 1600px), salvo em `public/assets/cria/story_jacarei_franquia_final.png` e sincronizado com `dist/assets/cria/`.

- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V4-7ELEMENTS`
  - **Data / Horário**: 24/09/2026 - 04:12 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Modelo Hero**: Z8 Tank High-Speed 3000W em ângulo 3/4 estúdio industrial matte
  - **Aplicação Rigorosa dos 7 Elementos EGIKE**:
    1. **Tipografia Monumental Monolítica**: `JACAREÍ` (168px branco) + `ELÉTRICA` (142px ciano Z8), entrelinha 0.80 colada.
    2. **Camadas & Profundidade (Vehicle Overlapping Text)**: A moto fica fisicamente em 1º plano, com retrovisor e carenagem sobrepondo a palavra `ELÉTRICA`.
    3. **Matriz de Pílulas Dinâmicas EGIKE**: Pílula sólida branca (52% Margem Líquida), sólida azul (Raio Exclusivo Comarca), cápsula circular (✦), contorno vazado (Oficina 2 Elevadores), fosca dark (Lote Mínimo 10 Motos), cápsula circular (⚡).
    4. **Color Blocking Radical (Máximo 3 cores)**: Azul Elétrico Z8 (`#00F0FF`), Branco Cirúrgico (`#FFFFFF`) e Grafite Escuro (`#080A0E`).
    5. **Fotografia com Luz Rasante & Zero Efeitos Luminosos**: Iluminação direcional pura de estúdio, zero neon glow, zero borrão difuso.
    6. **Aplicação Cirúrgica do Logo na Moto**: Emblema metálico Z8 em área plana da carenagem lateral amarela, com folga total das barras tubulares.
    7. **Micro-Tipografia Suíça Editorial**: Header `Z8 // TANK HIGH-SPEED (3000W)` + `HOMOLOGAÇÃO CONTRAN Nº 996` + parágrafo descritivo limpo à esquerda.
  - **Condição Especial**: Pattern de repetição removido conforme instrução ("ignore a nossa logo rerepetição para essa criação").
  - **Conformidade**: 100% compliant com Safe Zones do Instagram, salvo em `public/assets/cria/story_jacarei_franquia_final.png` e sincronizado com `dist/assets/cria/`.

- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V5-HEROLIGHT`
  - **Data / Horário**: 24/09/2026 - 04:45 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Direção de Arte "Desengessada"**: Ruptura com templates centralizados convencionais, aplicando o **Plano Americano em ângulo baixo com iluminação Hero Light** (strobe superior direcional recortando carenagem amarela mostarda e texturas de fibra de carbono).
  - **Ativos Fotográficos Gerados**:
    - `public/assets/cria/z8_tank_hero_light.jpg`: Fotografia de estúdio plano americano 3/4 com Hero Light, pneus off-road fincados no piso e faróis duplos com anéis DRL cristalinos.
    - `public/assets/cria/z8_tank_macro_detail.jpg`: Fotografia macro 1:1 destacando o emblema metálico OEM "Z8", a ótica do projetor cristal e o chassi de carbono.
  - **Execução dos 7 Elementos EGIKE**:
    1. **Tipografia Monumental Monolítica**: `JACAREÍ` (168px branco) + `ELÉTRICA` (114px ciano), empilhamento vertical maciço e entrelinha 0.78.
    2. **Sobreposição 3D Real (Vehicle Overlapping Text)**: O para-brisa e os retrovisores da moto sobrepõem suavemente a base da palavra `ELÉTRICA`.
    3. **Matriz de Pílulas EGIKE Assimétricas**: Pílula sólida branca (52% Margem Líquida), sólida ciano (Raio Exclusivo Comarca), cápsula circular (✦), contorno vazado (Oficina 2 Elevadores), fosca dark (Lote Mínimo 10 Motos), cápsula circular (⚡).
    4. **Color Blocking Estrito**: Azul Elétrico Z8 (`#00F0FF`), Branco (`#FFFFFF`), Grafite Profundo (`#06080B`).
    5. **Luz Rasante & Zero Efeitos Luminosos**: Iluminação direcional pura de estúdio, sombras físicas puras, zero neon glow.
    6. **Logo OEM Integrado**: Logotipo Z8 metálico em alto relevo na face esculpida da moto.
    7. **Micro-Tipografia Suíça**: Dados técnicos e legais CONTRAN 996 com parágrafo editorial limpo e espaçamento de respiro.
  - **Conformidade**: 100% compliant com Safe Zones do Instagram, salvo em `public/assets/cria/story_jacarei_franquia_final.png` e sincronizado com `dist/assets/cria/`.

- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V6-PROVOCATIVE`
  - **Data / Horário**: 24/09/2026 - 05:45 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Nova Métrica PNL (Alta Curiosidade & Provocação)**:
    - Ruptura com textos descritivos longos. Foco em impacto psicológico, curiosidade, FOMO e autoridade territorial.
    - Hook: `UMA CIDADE INTEIRA. UMA ÚNICA CHAVE.` / `O mercado elétrico não espera. Quem chegar primeiro, domina.`
    - Pílulas EGIKE Enxutas: `[ Monopólio Territorial ]`, `[ Apenas 1 Vaga ]`, `[ Lucro de Montadora ]`, cápsulas `✦` e `⚡`.
    - CTA de Comando PNL: `[ ASSUMA O CONTROLE • (12) 99800-8818 ]`.
  - **Nova Estrutura de Pastas e Backup**:
    - **Backup de Bases Criadas**: `public/assets/cria/posters/base_jacarei_tank.jpg` (Base fotográfica pura gerada com o título monumental `JACAREI` e piso livre).
    - **Arte Final Pós-Injeção**: `public/assets/cria/story_jacarei_franquia_final.png` (Composição com os dados de conversão injetados sobre o piso reflexivo).
  - **Conformidade**: 100% compliant com Safe Zones do Instagram, salvo em `public/assets/cria/story_jacarei_franquia_final.png` e sincronizado com `dist/assets/cria/`.

- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V7-UNENCAPSULATED`
  - **Data / Horário**: 24/09/2026 - 06:10 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Diretriz de Design Desencapsulado**:
    - **Zero Pílulas / Zero Cápsulas**: Textos totalmente libertos de caixas e contornos, atuando como tipografia editorial pura sobre o piso de concreto.
    - **Remoção do Botão CTA**: Eliminado o botão "Assuma o controle" para deixar a imagem respirar com elegância e foco puro na autoridade.
    - **Escala Ampliada de Textos-Chave**:
      - `MONOPÓLIO TERRITORIAL` (42px branco condensed) + `//` + `APENAS 1 VAGA` (42px ciano Z8 condensed).
      - Hook Provocante PNL: `UMA CIDADE INTEIRA. UMA ÚNICA CHAVE.` (48px) / `O mercado elétrico não espera. Quem chegar primeiro, domina.`
      - Linha Direta de Contato: `Z8 EMOTION // CONCESSÃO JACAREÍ - SP` e `(12) 99800-8818` (32px ciano elétrico).
  - **Base de Injeção**: `public/assets/cria/posters/base_jacarei_tank.jpg` (preservada em backup).
- **ID da Arte**: `ARTE-2026-JACAREI-TANK-V7-MULTIFORMAT-PACK`
  - **Data / Horário**: 24/09/2026 - 23:20 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Jacareí - SP (Vale do Paraíba)
  - **Veículo**: Z8 Tank High-Speed (Amarela Mostarda, iluminação Hero Light, plano americano 3/4)
  - **Decisões Estratégicas Consolidadas via /grill-me**:
    1. **Sobreposição 3D com Contraste**: Mantida a sobreposição parcial do texto sobre o pneu dianteiro com sombra física preta (`rgba(0, 0, 0, 0.95)`), reforçando a tridimensionalidade sem comprometer a leitura.
    2. **Domínio Corporativo Oficial**: Substituído o telefone pelo link institucional oficial `Z8EMOTION.COM` (estrita proibição de `.com.br`).
    3. **Topo Limpo & Dinâmico**: Topo livre de chancelas, preservando o impacto monumental do letreiro de cada cidade.
    4. **Alternância de Modelos**: Confirmada a alternância de motos oficiais para as próximas praças (SJC, Taubaté, Pinda, etc.).
  - **Arquivos do Pacote Multiformato (Salvos em /public e sincronizados em /dist)**:
    - **Stories / Reels (9:16 - 1080 × 1920)**: `public/assets/cria/story_jacarei_franquia_final.png` (Base: `public/assets/cria/posters/base_jacarei_tank.jpg`).
    - **Feed Retrato (4:5 - 1080 × 1350)**: `public/assets/cria/feed_portrait_jacarei_franquia_final.png` (Base: `public/assets/cria/posters/base_jacarei_tank_4x5.jpg`).
    - **Feed Quadrado (1:1 - 1080 × 1080)**: `public/assets/cria/feed_square_jacarei_franquia_final.png` (Base: `public/assets/cria/posters/base_jacarei_tank_1x1.jpg`).
  - **Scripts de Renderização**:
- **ID da Arte**: `ARTE-2026-GUARATINGUETA-FX10-REELS`
  - **Data / Horário**: 25/09/2026 - 01:35 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Guaratinguetá - SP (Vale Histórico / Vale do Paraíba)
  - **Veículo**: Z8 FX-10 Sport (Prata Titânio Metálico, plano americano 3/4 com iluminação Hero Light, faróis duplos LED com barras horizontais e acabamento em fibra de carbono)
  - **Letreiro Monumental Adaptado**: `GUARATINGUETÁ` empilhado em duas linhas colossais atrás da moto:
    - Linha 1: `GUARA` (Branco cirúrgico `#FFFFFF`)
    - Linha 2: `TINGUETÁ` (Ciano elétrico Z8 `#00F0FF`)
  - **Diretrizes Tipográficas & Rodapé Consolidadas**:
    1. **Tipografia Magnética**: Hook em fonte `Syne 800` (`UMA CIDADE INTEIRA.` em branco / `UMA ÚNICA CHAVE.` em ciano).
    2. **Subtítulo Aumentado (32px)**: *"O mercado elétrico não espera. / Quem chegar primeiro, domina."*
    3. **Métrica Editorial**: `MONOPÓLIO TERRITORIAL // APENAS 1 VAGA` em `Syne 800`.
    4. **Regra Permanente de Rodapé**: ZERO microtextos e **PROIBIÇÃO DE SETAS (`→`)**. Apenas o link limpo `Z8EMOTION.COM` em ciano elétrico, alinhado à direita sobre o piso.
  - **Arquivos Gerados**:
    - **Base Limpa (Backup)**: `public/assets/cria/posters/base_guaratingueta_fx10.jpg` (e espelho em `dist/assets/cria/posters/`).
    - **Reels Final (9:16 - 1080 × 1920)**: `public/assets/cria/story_guaratingueta_franquia_final.png` (e espelho em `dist/assets/cria/`).
  - **Script de Renderização**: `scripts/render_guaratingueta_reels.js` (Edge Headless 1080x1920).

- **Subagente Oficial Consolidado**: `z8-franchise-sdr` (`.agents/skills/franchise_sdr/SKILL.md`)
  - **Função**: Triagem, scoring de capital (≥ R$ 100k) e geração de script de abordagem WhatsApp para Christian Hideyuki.
  - **Status**: 100% Calibrado e Validado pelo Usuário em 25/09/2026.
  - **Regras Validadas**: Filtro antecipado de requisitos (10 motos + 2 elevadores) mantido no primeiro contato para afastar curiosos; remoção do link do site na mensagem pois a maioria dos leads já vem do site.
- **Subagente Oficial Consolidado**: `z8-legal-counsel` (`.agents/skills/legal_counsel/SKILL.md`)
  - **Função**: Emissão de COF com Recibo e trava legal de 10 dias corridos (Lei 13.966/2019), injeção cadastral do Contrato Padrão de Franquia (Título Executivo Art. 784 CPC) e geração de pacotes técnicos de PDI e Garantia vinculados a lotes de 10 motos.
  - **Status**: 100% Calibrado e Validado pelo Usuário em 25/09/2026.
  - **Script Operacional**: `scripts/legal_counsel_engine.js`.
- **Subagente Oficial Consolidado**: `z8-service-ops` (`.agents/skills/service_ops/SKILL.md`)
  - **Função**: Diagnóstico interativo de falhas elétricas em motos Z8 (baterias 72V, BMS, FOC, Hall), auditoria de vigência de garantia por chassi, emissão de laudo técnico com Part Numbers de reposição para autorização da diretoria e alocação especializada dos 2 elevadores da oficina.
  - **Status**: 100% Calibrado e Validado pelo Usuário em 25/09/2026.
  - **Script Operacional**: `scripts/service_ops_engine.js`.
- **Subagente Oficial Consolidado**: `z8-finance-intel` (`.agents/skills/finance_intel/SKILL.md`)
  - **Função**: Controladoria, simulação de DRE trifásica (10, 15 e 20 motos/mês), cálculo de break-even (4 motos com oficina), receita dos 2 elevadores e tempo de retorno (payback).
  - **Status**: 100% Calibrado e Validado pelo Usuário em 25/09/2026.
  - **Script Operacional**: `scripts/finance_intel_engine.js`.
- **Subagente Oficial Consolidado**: `z8-concierge-b2c` (`.agents/skills/concierge_b2c/SKILL.md`)
  - **Função**: Atendimento ao consumidor final, consultoria de modelo ideal (trabalho, retrô, custom, esportiva, executiva), desmistificação jurídica CONTRAN 996 (sem CNH/emplacamento até 32 km/h), calculadora de recarga na tomada (R$ 1,80 a R$ 2,50/carga, R$ 0,05/km) e direcionamento geolocalizado para test-ride nas concessionárias autorizadas do Vale do Paraíba.
  - **Status**: 100% Calibrado e Validado em 25/09/2026.
  - **Script Operacional**: `scripts/concierge_b2c_engine.js`.

- **ID da Arte**: `ARTE-2026-GUARATINGUETA-FX10-MULTIFORMAT-PACK`
  - **Data / Horário**: 25/09/2026 - 15:45 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Guaratinguetá - SP (Vale Histórico / Vale do Paraíba)
  - **Veículo**: Z8 FX-10 Sport (Prata Titânio Metálico, faróis duplos LED com projetor, carenagem aerodinâmica, acabamento em fibra de carbono e iluminação Hero Light)
  - **Pacote Multiformato Completo (Salvos em /public e sincronizados em /dist)**:
    - **Stories / Reels (9:16 - 1080 × 1920)**: `public/assets/cria/story_guaratingueta_franquia_final.png` (Base: `public/assets/cria/posters/base_guaratingueta_fx10.jpg`).
    - **Feed Retrato (4:5 - 1080 × 1350)**: `public/assets/cria/feed_portrait_guaratingueta_franquia_final.png` (Base: `public/assets/cria/posters/base_guaratingueta_fx10_4x5.jpg`).
    - **Feed Quadrado (1:1 - 1080 × 1080)**: `public/assets/cria/feed_square_guaratingueta_franquia_final.png` (Base: `public/assets/cria/posters/base_guaratingueta_fx10_1x1.jpg`).
  - **Scripts de Renderização**: `scripts/render_guaratingueta_reels.js`, `scripts/render_guaratingueta_portrait.js`, `scripts/render_guaratingueta_square.js`.

- **ID da Arte**: `ARTE-2026-TAUBATE-HARLEY-MULTIFORMAT-PACK`
  - **Data / Horário**: 25/09/2026 - 15:45 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Taubaté - SP (Polo Automotivo e Industrial / Vale do Paraíba)
  - **Veículo**: Z8 Harley X21 Custom (Acabamento Midnight Gloss Black, guidão alto chopper americano, pneus largos fat-bob com sulcos profundos, chassi tubular customizado, farol duplo circular com anéis DRL LED e descanso lateral rebaixado)
  - **Letreiro Monumental Monolítico**: Letreiro colossal `TAUBATÉ` em grotesco condensado com contorno Ciano Elétrico Z8 (`#00F0FF`) e corpo branco sólido, integrado à arquitetura industrial da moto.
  - **Diretrizes Tipográficas & Rodapé**: Hook PNL em `Syne 800` (`UMA CIDADE INTEIRA.` em branco / `UMA ÚNICA CHAVE.` em ciano), subtítulo `Outfit 600/800` com barra ciano, métrica `MONOPÓLIO TERRITORIAL // APENAS 1 VAGA` em linha única contínua, rodapé 100% limpo com link direto `Z8EMOTION.COM` à direita (sem setas).
  - **Pacote Multiformato Completo (Salvos em /public e sincronizados em /dist)**:
    - **Stories / Reels (9:16 - 1080 × 1920)**: `public/assets/cria/story_taubate_franquia_final.png` (Base: `public/assets/cria/posters/base_taubate_harley.jpg`).
    - **Feed Retrato (4:5 - 1080 × 1350)**: `public/assets/cria/feed_portrait_taubate_franquia_final.png` (Base: `public/assets/cria/posters/base_taubate_harley_4x5.jpg`).
    - **Feed Quadrado (1:1 - 1080 × 1080)**: `public/assets/cria/feed_square_taubate_franquia_final.png` (Base: `public/assets/cria/posters/base_taubate_harley_1x1.jpg`).
- **ID da Arte**: `ARTE-2026-PINDA-N710-MULTIFORMAT-PACK`
  - **Data / Horário**: 25/09/2026 - 16:25 BRT
  - **Campanha**: Expansão de Concessionárias / Franquia B2B
  - **Praça**: Comarca de Pindamonhangaba - SP (Polo Regional Vale do Paraíba)
  - **Veículo**: Z8 N710 Urban Plus (Carenagem aerodinâmica cinza titânio escuro com grafismos neon e laranja, farol dianteiro mecha LED projetor horizontal, rodas de liga leve pretas, freios a disco e encosto traseiro esportivo)
  - **Letreiro Monumental Empilhado**: `PINDA` no topo em branco cirúrgico maciço, sobreposto a `MONHANGABA` em Ciano Elétrico Z8 (`#00F0FF`) em caixa alta condensada, conferindo monumentalidade legível sem poluição visual.
  - **Diretrizes Tipográficas & Rodapé**: Hook PNL em `Syne 800` (`UMA CIDADE INTEIRA.` em branco / `UMA ÚNICA CHAVE.` em ciano), subtítulo `Outfit 600/800` com barra ciano vertical de 3.5px, métrica horizontal contínua `MONOPÓLIO TERRITORIAL // APENAS 1 VAGA` e rodapé institucional puro `Z8EMOTION.COM` alinhado à direita (sem setas).
  - **Pacote Multiformato Completo (Salvos em /public e sincronizados em /dist)**:
    - **Stories / Reels (9:16 - 1080 × 1920)**: `public/assets/cria/story_pinda_franquia_final.png` (Base: `public/assets/cria/posters/base_pinda_n710.jpg`).
    - **Feed Retrato (4:5 - 1080 × 1350)**: `public/assets/cria/feed_portrait_pinda_franquia_final.png` (Base: `public/assets/cria/posters/base_pinda_n710_4x5.jpg`).
    - **Feed Quadrado (1:1 - 1080 × 1080)**: `public/assets/cria/feed_square_pinda_franquia_final.png` (Base: `public/assets/cria/posters/base_pinda_n710_1x1.jpg`).
  - **Scripts de Renderização**: `scripts/render_pinda_pack.js`.

- **ID da Arte**: `ARTE-2026-RECRUTAMENTO-MATRIZ-SJC-PACK`
  - **Data / Horário**: 25/09/2026 - 20:00 BRT
  - **Campanha**: Recrutamento de Talentos // Loja Matriz & Showroom Z8 (São José dos Campos - SP)
  - **Formato**: Stories / Reels (9:16 - 1080 × 1920) com resposta direta via Direct do Instagram
  - **Diretriz de Arte com Manequins & Uniformes Oficiais**:
    - Manequins esportivos/estilizados em acabamento preto fosco / cinza chumbo (sem rosto humano / faceless), destacando 100% o caimento, detalhes e logotipos dos uniformes da Z8.
    - Letreiro monumental do cargo (`MECÂNICO`, `VENDAS`, `ZELADORIA`) em tipografia condensada monumental atrás do manequim com sobreposição 3D.
    - Subtítulo em `Outfit 600/800` com barra ciano vertical de 3.5px, pílula de status superior e métricas de benefícios em `Syne 800`.
    - CTA nativo para Instagram Stories: `RESPONDA ESTE STORY COM SEU CURRÍCULO` e link oficial `Z8EMOTION.COM` (sem número de WhatsApp nem e-mail, direcionando direto para o chat do Direct).
  - **Peças Geradas (Salvas em /public/assets/cria/ e sincronizadas em /dist/assets/cria/)**:
    1. **Mecânico de Motos Elétricas**: `public/assets/cria/story_vaga_mecanico_final.png` (Base: `public/assets/cria/posters/base_vaga_mecanico.jpg`). Manequim com camiseta técnica Z8 Power (ciano/verde), oficina de 2 elevadores ao fundo, hook: *"A OFICINA DO FUTURO PRECISA DAS SUAS MÃOS."*
    2. **Consultora de Vendas / Showroom**: `public/assets/cria/story_vaga_vendas_final.png` (Base: `public/assets/cria/posters/base_vaga_vendas.jpg`). Manequim em busto de alfaiataria com camisa polo preta Z8 bordada, showroom moderno, hook: *"SEU TALENTO MERECE ACELERAR COM A GENTE."*
    3. **Zeladoria & Serviços Gerais**: `public/assets/cria/story_vaga_zeladoria_final.png` (Base: `public/assets/cria/posters/base_vaga_zeladoria.jpg`). Manequim atlético com camiseta preta oficial Z8 E-Motion, sede corporativa impecável, hook: *"O PRIMEIRO BRILHO DA MARCA COMEÇA NO SEU CUIDADO."*
  - **Scripts de Renderização**: `scripts/render_vagas_pack.js`.


## 8. Arquitetura de Design de Montadora & Benchmark Hyundai Brasil (28/09/2026)
> Estudo de engenharia reversa do portal Hyundai Brasil (`hyundai.com.br`) e implantação oficial nas páginas `/vendas/` e `/site-principal/`.

### 8.1 Stack & Engenharia do Portal Hyundai Brasil
- **CMS / Infraestrutura**: Adobe Experience Manager (AEM 6.5 / Cloud Service) com dispatchers Akamai CDN.
- **Frontend Engine**: React SPA (`clientlib-react`) com hidratação sob demanda, Webpack code splitting e renderização progressiva.
- **CRO & A/B Testing**: Visual Website Optimizer (VWO v2.2) com triggers de intenção de saída e scroll depth.
- **Acessibilidade**: Hand Talk virtual sign language integration e conformidade WCAG AA.
- **Identidade Estética (Sensuous Sportiness)**:
  - Fundo **Clean Pewter White** (`#F8F9FA` / `#FFFFFF`).
  - Cores institucionais: **Hyundai Heritage Navy** (`#002C5F`), **Active Cyan** (`#00AAD2`) e **Slate Dark** (`#0F172A`).
  - Grids de 12 colunas assimétricos, tipografia condensada e cartões de veículos elevados com sombreamento suave (`0 4px 20px rgba(0, 44, 95, 0.05)`).
- **Dossiê Completo**: `docs/design_system/BENCHMARK_HYUNDAI_E_UX_Z8.md`.

### 8.2 Melhorias de UX e Conversão Implementadas nas Duas Páginas Z8

#### 1. Página de Vendas (`/vendas/`)
- **Tema Pewter White Montadora**: Migração dos tokens de `:root` para fundo claro de showroom (`#F8F9FA`), mantendo o hero em vídeo Veo com overlay escuro para contraste cinematográfico do headline.
- **Seletor Interativo de Cores de Montadora (Swatches)**: 10 cartões de produtos equipados com paleta de cores reais (`MODEL_COLORS`), permitindo troca instantânea de foto com transição suave de opacidade (`opacity: 0.35 -> 1.0`).
- **Formulário Wizard Progressivo em 2 Etapas**: Divisão do formulário de investidor em Etapa 1 (Contato & Praça) e Etapa 2 (Aporte, Prazo & Dedicação) com pílulas visuais de progresso e auto-salvamento na Nuvem Z8 na Etapa 1 (reduz abandono de carrinho/lead).
- **Barra Fixa Inferior Mobile (Sticky Action Bar)**: Barra de ação ancorada no rodapé em telas `≤ 768px` com acesso direto a "Modelos", "Consultar Minha Cidade" e WhatsApp comercial com respeito a `safe-area-inset-bottom`.

#### 2. Site Principal (`/site-principal/`)
- **Tema Híbrido Padrão Montadora**: Calibração dos tokens `:root[data-theme="light"]` e `:root[data-theme="dark"]` para estética automotiva limpa com Azul Marinho Corporativo (`#002C5F`) e Ciano Z8 (`#00F0FF`).
- **Top Announcement Bar**: Barra institucional superior padrão montadora com dados de homologação CONTRAN 996, contato corporativo e atalho VIP para vendas.
- **Showroom com Seletor Dinâmico de Cores**: Cards do catálogo dinâmico de 11 modelos dotados de seletor visual de cores com indicador de nome da cor ativa e troca dinâmica de imagem.
- **Comparador de Modelos Lado a Lado (Versões A vs B)**: Comparador técnico interativo inspirado no "Compare as Versões" da Hyundai, com 14 métricas lado a lado (Regulação CONTRAN 996, Isenção de CNH, Potência W, Velocidade km/h, Autonomia, Baterias, Custo de Recarga R$ 2,10, Economia Mensal R$ 450,00, Freios, Pneus, Preço Atacado e Lucro Unitário).
- **Barra Fixa Mobile Sticky**: Navegação ágil no rodapé de dispositivos móveis com links para Modelos, Comparador e WhatsApp comercial.

### 8.3 Conclusão da Reformulação Drástica 100% Montadora de Luxo (Hyundai Motor Brasil)

- **Erradicação Total do Skeuomorfismo & Orbitron**:
  - Eliminação completa de relevos plásticos, botões chanfrados, telas LCD simuladas em verde e texturas pseudo-metálicas.
  - Adoção da tipografia moderna `Outfit` (pesos 300 a 900) para todos os cabeçalhos, números e títulos, aliada a `Inter` para o corpo de texto.
- **Paleta Refinada Automotiva**:
  - **Cinza Claro Estúdio Acetinado** (`#F4F5F7`): Tom neutro de estúdio fotográfico automotivo utilizado como base das duas páginas e do Hub.
  - **Cinza Escuro Slate** (`#111827`): Tipografia monumental de alto contraste e elegância sóbria.
  - **Azul Navy Heritage** (`#002C5F`): Cor de autoridade executiva da montadora, acentos, botões primários e cabeçalhos de tabela.
  - Superfícies em Branco Puro (`#FFFFFF`) com linhas milimétricas estruturais (`1px solid #E2E8F0`) e sombras físicas suaves (`0 4px 20px rgba(0, 44, 95, 0.05)`).
- **Palco do Veículo Hero de Montadora (`/site-principal/`)**:
  - Palco automotivo de luxo com iluminação cenográfica no piso e pedestal elíptico.
  - Seletor interativo horizontal na base permitindo alternar instantaneamente entre modelos emblemáticos (Z8 Tank High-Speed, Z8 FX-10 Sport, Z8 Harley X21 Custom, Z8 N710 Urban Plus).
  - Telemetria dinâmica em pills (`border-radius: 9999px`) e fade suave de foto (`opacity: 0.25 -> 1.0`).
- **Painel Financeiro & Controles Executivos**:
  - Substituição da tela LCD retrô por um Painel de Resultados Financeiros moderno em cartão branco e navy.
  - Sliders com cursores circulares minimalistas brancos com anel Navy e trilha contínua sem bevels 3D.
- **Portal Hub Corporativo (`/`)**:
  - Redesenhado integralmente no mesmo padrão de luxo com selo `HUB CORPORATIVO Z8 E-MOTION`, tipografia `Outfit` e cards elevados.
- **Engenharia de Responsividade & Build**:
  - Calibração completa para Mobile (< 480px, 640px), Tablet (768px, 900px) e Desktop (1024px+).
  - `npm run build` executado com 100% de sucesso sem qualquer erro de bundling ou dependência.

### 8.4 Auditoria 360, Humaniza��o & Limpeza Profunda de Resqu�cios

- **Erradica��o do Bal�o Flutuante Inferior Esquerdo**: Removido #live-sales-popup e o loop de compradores fict�cios.
- **Elimina��o de Falsa Urg�ncia**: Removidos #top-timer e #seats-left em prol de an�ncio corporativo.
- **Remo��o de Redund�ncias**: Footer duplicado eliminado em /vendas/ e se��o de franquia fundida no rodap� de /site-principal/.
- **Amplia��o do Fluxo de Leitura**: Fontes ampliadas para 1rem-1.08rem com line-height 1.68.
- **Humaniza��o**: Substitui��o de jarg�es de infoproduto por tom de concess�o de montadora.

### 8.5 Conclusao Integral das 12 Otimizacoes de UX, Design Tatil e Fluxo Otico

1. Reordenacao do Palco Hero
2. Dock do Switcher Integrado
3. Hierarquia de Acao 1+1 (Lei de Hick)
4. Strip de Credibilidade e Homologacao (Trust Ticker)
5. Alinhamento Otico Rigido nos Cards
6. Ergonomia Tactil do Lightbox com Touch Swipe
7. Calibracao Mobile da Regua do Simulador
8. Visualizacao Grafica do Painel de ROI
9. Transicao Suave e Radar de CEP
10. Transicao em Slide no Modal Wizard
11. Adaptacao de Safe Area na Barra Fixa Mobile
12. Padronizacao de Fisica Mecanica Global nos Botoes
13. Harmonizacao de Cores do Rodape (Clean Showroom Branco WCAG AAA)

### 8.6 Motor de Cores Estático de Montadora (Configurador Automotivo Estilo Hyundai/Porsche)

- **Objetivo**: Eliminar o salto visual e a troca de ângulo de câmera ao alternar as amostras de cores (swatches) nos cards de produto e no Lightbox executivo.
- **Técnica de Geração**: Fotografias de estúdio geradas com perspectiva 3/4 estática 100% congelada (pixel-aligned), mantendo exatamente a mesma iluminação direcional, o mesmo piso de concreto com reflexo sutil e o mesmo enquadramento, alterando exclusivamente a pintura da carenagem da moto.
- **Modelos e Variantes Geradas**:
  1. **Z8 Tank High-Speed**:
     - Mostarda Trilha (z8_tank_amber.jpg)
     - Preto Ônix Paulista (z8_tank_black.jpg)
     - Cinza Titânio Studio (z8_tank_titanium.jpg)
  2. **Z8 FX-10 Sport**:
     - Prata Líquido (z8_fx10_studio.jpg)
     - Preto Noturno SJC (z8_fx10_black.jpg)
     - Branco Studio (z8_fx10_white.jpg)
  3. **Z8 N710 Urban Plus**:
     - Cinza Faria Lima (z8_n710_studio.jpg)
     - Branco Platina (z8_n710_white.jpg)
     - Preto Ônix (z8_n710_black.jpg)
  4. **Z8 Harley X21 Custom**:
     - Preto Midnight (z8_harley_studio.jpg)
     - Vinho Bordeaux Metálico (z8_harley_crimson.jpg)
     - Prata Titânio Líquido (z8_harley_silver.jpg)
  5. **Z8 U2 Delivery Cargo**:
     - Branco Fulfillment (z8_u2_white.jpg)
     - Preto Industrial (z8_u2_black.jpg)
     - Azul E-Motion (z8_u2_studio.jpg)
  6. **Z8 Q10 Vintage**:
     - Verde Madalena Retrô (z8_q10_green.jpg)
     - Preto Vintage Ônix (z8_q10_black.jpg)
     - Amarelo Retrô (z8_q10_studio.jpg)
- **Arquivos & Integração**:
  - Salvos e espelhados em public/assets/models/ e public/assets/cria/posters/.
  - Vinculados aos botões .color-swatch-btn em endas/index.html e herdados automaticamente pelo modal Lightbox.
  - Zero saltos de câmera: transição 100% fluida de pintura de fábrica.

### 8.7 Otimização de UX & Clareza da Área de Login em Todas as Etapas

- **Diagnóstico**: O botão de login no cabeçalho exibia anteriormente apenas o ícone de cadeado [ 🔒 ] no mobile/tablet porque a classe .btn-header-login-text estava configurada com display: none; abaixo de 640px, e o texto original era o vago PORTAL.
- **Implementações Realizadas**:
  1. **Cabeçalho (Navbar Sticky)**:
     - Texto alterado de PORTAL para **LOGIN** explícito.
     - .btn-header-login-text configurado com display: inline-block !important; em todos os breakpoints (Desktop, Tablet, Mobile < 640px e < 380px).
     - Visual montadora com fundo #F8FAFC, borda Navy 1.5px solid rgba(0, 44, 95, 0.28), tipografia com peso 700 e contraste superior.
  2. **Barra Fixa Inferior Mobile (mobile-sticky-action-bar)**:
     - Inclusão do botão de acesso direto [ 🔒 Login ] entre *Modelos* e *Consultar Minha Cidade*, garantindo que em qualquer momento do scroll no smartphone o usuário tenha acesso imediato à autenticação.
  3. **Etapas de Modais (Wizard de Candidatura & Checkout)**:
     - Adicionada a faixa de atalho .modal-login-prompt em ambos os passos do investor-lead-modal (Passo 1 e Passo 2) e no checkout-modal: *"Já é concessionário credenciado? [ Fazer Login no Portal → ]"*.
  4. **Modal de Login (#portal-login-modal)**:
     - Aba de login renomeada para **FAZER LOGIN**.
     - Inputs com labels detalhadas contendo ícones (envelope e lock), foco automático no input de usuário e botão de alternância de visibilidade da senha (olho aberto/fechado).
  5. **Sincronização de Estado de Autenticação**:
     - Se o usuário já estiver conectado, o botão no cabeçalho exibe automaticamente seu primeiro nome com badge verde [ 👤 NOME ] em vez do cadeado genérico.

### 8.8 Simplificação do Menu de Navegação do Site Principal (site-principal/index.html)

- **Solicitação do Usuário**: Remoção de todos os tópicos de página da barra de navegação (.skeuo-nav), mantendo exclusivamente a **Área de Login** e o botão **Início**.
- **Ações Executadas**:
  - Removidos os 7 botões de tópicos: *Modelos & Preços*, *Comparador*, *Seja Concessionário*, *Calculadora de Rentabilidade*, *Portal do Franqueado*, *Garantia & O.S* e *Central de Manuais*.
  - Mantidos exclusivamente:
    1. **🏠 Início** (.skeuo-nav-btn active) com scroll suave para o hero stage.
    2. **🚪 Área de Login / Sair (Nome)** (#open-catalog-login-btn), permitindo entrar e sair com sincronização em tempo real de sessão.
    3. **👤 Aprovações de Acesso** (#open-catalog-admin-btn), mantido dinâmico para acesso exclusivo da conta admin master (Christian).
  - A barra ficou minimalista, sem quebras de linha ou sobrecarga visual em qualquer resolução.

### 8.9 Correção de Renderização de Imagem do Card Z8 Tank High-Speed no Showroom

- **Diagnóstico do Bug**: O objeto MODEL_COLORS em site-principal/main.js apontava anteriormente para caminhos legados inexistentes (/assets/models/z8_tank_yellow_hero.png e z8_tank_hero_paulista.png), causando erro 404 e ícone quebrado na amostra inicial "Amarelo Mostarda".
- **Ações Executadas**:
  1. Atualizado MODEL_COLORS em site-principal/main.js para apontar diretamente para as fotografias oficiais de estúdio de alta resolução:
     - Amarelo Mostarda: /assets/models/z8_tank_amber.jpg
     - Preto Paulista: /assets/models/z8_tank_black.jpg
     - Cinza Titânio Studio: /assets/models/z8_tank_titanium.jpg
  2. Sincronizados todos os demais modelos do MODEL_COLORS (z8-fx10, z8-harley-x21, z8-u2-delivery, z8-n95c, z8-n7, z8-q10, z8-n710, z8-q11, z8-gs005, z8-diamond) com suas respectivas imagens reais e validadas.
  3. Criados aliases de segurança public/assets/models/z8_tank_yellow_hero.png e z8_tank_hero_paulista.png como salvaguarda para qualquer cache legado de navegador.
  4. Adicionada salvaguarda onerror="this.onerror=null; this.src='';" no template HTML de renderização dos cards do showroom para blindagem contra 404 em qualquer circunstância.

### 8.10 Remoção Completa do Modo Escuro no Site Principal (`/site-principal/`)

- **Solicitação do Usuário**: Remoção definitiva do modo escuro e seu seletor no site principal, unificando toda a experiência na identidade visual oficial de montadora de luxo (Light Theme / Cinza Platina Estúdio).
- **Ações Executadas**:
  1. **HTML (`site-principal/index.html`)**:
     - Removido o container do botão de alternância rocker switch (`.theme-switch-container`, com ícones de sol e lua e `#theme-toggle-switch`).
     - Mantido `<html lang="pt-BR" data-theme="light">` fixo.
  2. **JavaScript (`site-principal/main.js`)**:
     - Substituída a função `initThemeToggle()` por um travamento permanente: força `document.documentElement.setAttribute('data-theme', 'light')` e limpa/sobrescreve qualquer valor prévio em `localStorage.setItem('z8_theme', 'light')`.
     - Removidos listeners de troca de tema.
  3. **CSS (`site-principal/style.css`)**:
     - Removido o bloco completo `:root[data-theme="dark"]` com todas as suas variáveis escuras.
     - Padronizado `:root` unicamente com os tokens de montadora de luxo (Light Theme).
     - Removidas todas as regras e seletores específicos `[data-theme="dark"]` (`.embossed-badge`, `.skeuo-header`, `.badge-national`, `.skeuo-nav-btn.active`, `.hero-title-accent`, `.model-img-wrapper`, `.model-price-box`, `.price-val`, `.comparator-vehicle-price`, `.comparator-table tbody tr:hover`, `.comparator-badge-pill.exempt`, `.mobile-sticky-action-bar`).
     - Removidas todas as classes de estilo do rocker switch (`.theme-switch-container`, `.switch-label`, `.rocker-switch`, `.rocker-slider`).
  4. **Validação**:
     - `npm run build` executado com sucesso (código 0, 0 erros de empacotamento).
     - Deploy efetuado no GitHub com commit `3540716`.

### 8.11 Blindagem Integral de Responsividade e Correção de Overflow nos Cards de Telemetria

- **Problema Diagnosticado**: Na imagem reportada pelo usuário (`media_1790718912363.png`), a grade 2x2 de especificações técnicas do Palco de Montadora (`POTÊNCIA`, `VELOCIDADE`, `AUTONOMIA`, `CONTRAN 996`) apresentava corte de texto na borda direita (*text clipping*) para valores mais extensos como `"32 km/h Homologada"` e `"Dispensa CNH"`. O problema ocorria porque o layout padrão alinhava o rótulo e o valor lado a lado (`flex-direction: row; justify-content: space-between`), espremendo os valores em colunas estreitas (~60px a 80px) em tablets e telas médias (641px–900px) e celulares compactos.
- **Implementações & Solução Estrutural**:
  1. **Arquitetura Vertical de 2 Níveis (`.telemetry-pill`)**:
     - Padronização em `site-principal/style.css` e `vendas/style.css` da estrutura vertical em todos os breakpoints (`flex-direction: column; align-items: flex-start; justify-content: center; width: 100%; box-sizing: border-box; min-width: 0;`).
     - Linha 1 (`.pill-label`): Rótulo superior com ícone e texto (`display: flex; align-items: center; gap: 6px; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: clamp(0.58rem, 1.8vw, 0.66rem);`).
     - Linha 2 (`.pill-val`): Valor com 100% da largura útil disponível (`font-size: clamp(0.76rem, 2.2vw, 0.86rem); font-weight: 800; text-align: left; width: 100%; min-width: 0; overflow-wrap: anywhere; hyphens: auto; white-space: normal;`).
  2. **Blindagem de Grids e Prevenção de Estouro (`minmax(0, 1fr)`)**:
     - Conversão de todas as colunas rígidas `1fr` para `minmax(0, 1fr)` em todas as seções (Garantia, OS, Admin, Modelos, Comparador).
     - Adicionado `-webkit-text-size-adjust: 100%; text-size-adjust: 100%;` no elemento raiz `html` para blindar contra distorção de fontes no iOS Safari e Android Chrome.
  3. **Barra Móvel Inferior e Botões de Ação**:
     - `.mobile-sticky-action-bar` blindada com `width: 100%; max-width: 100vw; box-sizing: border-box;`.
     - Botão de WhatsApp sintetizado para `<i class="fa-brands fa-whatsapp"></i> <span>WhatsApp</span>`, impedindo qualquer alargamento forçado da página em telas de 320px–360px.
     - Botões primários (`.btn-montadora`, `.btn-hero-primary`) calibrados com padding responsivo e tipografia fluida com `clamp()`.
  4. **Bateria Automatizada de Testes Headless (Headless Edge)**:
     - Script `scripts/test_responsive_renders.js` executado sobre 9 configurações de viewport (Mobile 360px, 375px, 414px; Tablet 768px; Desktop 1280px).
     - Resultado: **0 elementos estourando a tela (`stretcherCount: 0`)** em todos os testes, e verificação visual confirmando 100% de legibilidade dos textos e alinhamento dos botões.

### 8.12 Geometrização do Badge de Margem de Lucro (.price-margin) no Showroom

- **Solicitação do Usuário**: Deixar a área de destaque da margem de lucro (`Lucro R$ 4.000`) mais quadrada (menos arredondada / remoção do formato de pílula oval).
- **Ações Executadas**:
  1. **Folha de Estilos (`site-principal/style.css`)**:
     - `.price-margin`: `border-radius` reduzido de `20px` (oval estilo cápsula) para `4px` (formato retangular técnico arquitetural).
     - Adicionada borda sutil de precisão `border: 1px solid rgba(5, 150, 105, 0.28);`.
     - Inserido `display: inline-flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;` para manter o valor alinhado e sem quebras indesejadas.
  2. **Scripts (`site-principal/main.js`)**:
     - Botão alternativo de consulta (`.btn-unlock-price`) também harmonizado para `border-radius: 4px;`.
  3. **Build & Deploy**:
     - Build de produção verificado com sucesso (`npm run build`).
     - Commit `657e21f` enviado para `main`.

### 8.13 Blindagem de Responsividade da Barra de Sessão Master & Filtro de Unidades (O.S)

- **Problema Diagnosticado**: Na imagem `media_1790799011010.png`, o card dourado de status da Sessão Master do Portal de Garantia & Engenharia (`.os-account-bar.master-admin`) apresentava overflow horizontal: o seletor escuro de unidades (`#os-admin-unit-filter-select`) e seu rótulo `"Unidade:"` extrapolavam fisicamente a borda direita do card, invadindo a página.
- **Causas**:
  1. O elemento `<select>` possuía `width: auto` com opções longas (ex: `"🏢 Todas as Concessionárias (4 Total)"`), exigindo largura intrínseca maior que a largura disponível no card em telas médias/móveis.
  2. Ausência de `max-width: 100%`, `text-overflow: ellipsis` e regras de empilhamento vertical (`flex-direction: column`) para telas <= 768px e <= 480px.
  3. Cores legadas de modo escuro (`#0b0e14` e `#cbd5e1`) incompatíveis com o padrão Light Theme de montadora.
- **Implementações & Solução**:
  1. **Markup Semântico (`site-principal/main.js`)**:
     - Criação do wrapper `.os-account-filter-wrap` com rótulo de alto contraste `.os-account-filter-label` (`color: var(--text-main); font-weight: 700;`).
     - Estruturação do texto à esquerda com `.os-account-info-text`, `.os-account-title` e `.os-account-subtitle` com contenção de quebra (`word-break: break-word`).
  2. **Folha de Estilos (`site-principal/style.css`)**:
     - `.os-admin-unit-select`: Estilizado no padrão Montadora Luxo Light (`background: #FFFFFF`, texto Azul Navy `#002C5F`, borda dourada `rgba(217, 119, 6, 0.45)`, `max-width: min(100%, 300px)`, `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`).
     - Breakpoint `<= 768px`: `.os-account-bar` passa para layout em coluna (`flex-direction: column; align-items: stretch; gap: 12px;`), garantindo que o filtro ocupe sua própria linha com 100% de largura disponível.
     - Breakpoint `<= 480px`: O wrapper `.os-account-filter-wrap` empilha o rótulo e o select verticalmente (`width: 100%; max-width: 100%;`), eliminando qualquer possibilidade de sangria lateral.
  3. **Build & Deploy**:
     - `npm run build` bem-sucedido (0 erros).
     - Commit `b4da5e1` enviado para `main`.

### 8.14 Ocultação de E-mail do Administrador & Padronização de "Esperando Aprovação"

- **Solicitação do Usuário**: O cliente via o e-mail do administrador ao solicitar acesso/cadastro. Alterar para exibir apenas *"Esperando aprovação"*.
- **Ações Executadas**:
  1. **Interface de Cadastro (`site-principal/index.html`)**:
     - Removida a menção ao e-mail `christian.tkh@gmail.com` na caixa de aviso do formulário de solicitação de acesso (`#cat-box-register`).
     - Atualizado para: `<i class="fa-solid fa-clock"></i> <strong>Status:</strong> Esperando aprovação`.
     - No banner de boas-vindas do usuário pendente (`#pending-approval-banner`), o título foi atualizado para: `CONTA REGISTRADA • ESPERANDO APROVAÇÃO`.
     - No cabeçalho do painel de administração (`#catalog-admin-modal`), o badge foi generalizado para `Administrador Master`.
  2. **Controle de Autenticação (`site-principal/main.js`)**:
     - No cabeçalho principal, quando o usuário está conectado porém com status pendente (`!approved`), o botão do menu agora exibe explicitamente `<i class="fa-solid fa-clock"></i> Esperando Aprovação` (em vez de `Sair (...)`).
     - No alerta de abertura de Ordens de Serviço (Garantia), a mensagem foi simplificada para: *"Seu cadastro está esperando aprovação. A abertura de O.S e requisição de garantia é liberada mediante autorização comercial."* (sem exibir e-mail de administrador).
  3. **Build & Deploy**:
     - `npm run build` executado com 0 erros.
     - Commit `e25b473` enviado para `main`.


### 8.15 Diagnóstico e Integração Integral de Login e Cadastro com Firebase Oficial de Christian Hideyuki (z8-emotion-brasil)

- **Solicitação do Usuário**: "gem verifique a area de cadastr e login, parece não estar funcionando, lembrando que estão no firebase do Christian Hide"
- **Diagnóstico Minucioso**:
  1. **Conexão Real com o Firebase**: Testado via script direto contra z8-emotion-brasil com database 'default'. O Firestore respondeu com 200 OK e retornou 10 usuários ativos já cadastrados no banco oficial do Christian Hide (incluindo christian.tkh@gmail.com, christian.hide@hotmail.com, willdbga@gmail.com, fabriciopolocruzeiro@gmail.com, viniciusortizdovale@gmail.com, zejda@gmail.com, etc.).
  2. **Gargalo no Login**: O método loginCatalogUser tentava chamar apenas /api/users (serverless Vercel) e, se falhasse, recorria apenas ao cache localStorage da máquina local, NUNCA consultando o Firestore oficial. Em máquinas novas ou limpas, o lojista recebia erro de 'usuário não encontrado' mesmo estando cadastrado no Firebase do Christian Hide.
  3. **Gargalo no Cadastro**: No cadastro (registerCatalogUser), não havia verificação prévia no Firestore antes da criação, podendo gerar inconsistências com usuários já registrados.
  4. **Gargalo no Portal de Vendas (vendas/app.js)**: O listener do formulário de login chamava 'const res = loginCatalogUser(...)' sem async e sem await. Sendo uma promessa assíncrona, res.success sempre retornava undefined e bloqueava o redirecionamento.
  5. **Divergência de IDs no DOM**: Em site-principal/main.js, botões da área de garantia buscavam #catalog-auth-modal que não existia no DOM (o ID correto é #catalog-login-modal).
- **Implementações & Solução**:
  1. **Novas Funções de Integração Direta (site-principal/services/firebase-service.js)**:
     - getUserFromFirestore(email): Consulta direta do documento do lojista no Firestore (catalog_users).
     - fetchUsersFromFirestore(): Varredura de todos os usuários registrados em catalog_users no Firebase de Christian Hide.
     - authenticateUserFirestore(emailOrUser, password): Autenticação direta contra a base real de lojistas e administrador mestre no Firebase, com validação de status (approved, pending, blocked) e checagem de senhas.
  2. **Motor de Autenticação (site-principal/catalog-auth.js)**:
     - fetchUsersFromCloud: Agora prioriza a sincronização direta com o Cloud Firestore do Christian Hide, garantindo que todos os 10 lojistas cadastrados sejam sincronizados com o cache local do cliente.
     - registerCatalogUser: Consulta prévia em nuvem para evitar cadastros duplicados e grava atomicamente no Firestore de Christian Hide (saveUserToFirestore).
     - loginCatalogUser: Valida primeiro contra o Firebase Firestore; se validado, atualiza o cache local e inicia a sessão instantaneamente.
  3. **Inicialização Ágil (site-principal/main.js)**:
     - fetchUsersFromCloud() agora roda no carregamento da página, permitindo login instantâneo.
     - Corrigidas referências de abertura do modal de autenticação para #catalog-login-modal.
  4. **Correção no Portal de Vendas (vendas/app.js)**:
     - Adicionado async/await no evento de submit do formulário de login (#portal-login-form).
  5. **Build & Deploy**:
     - npm run build executado com 100% de sucesso.
     - Commit 5659da1 enviado com sucesso para main.


### 8.16 Remoção do Botão Flutuante (Balãozinho) de WhatsApp Sobreposto ao Conteúdo

- **Solicitação do Usuário**: "remova o balaozinho de msg no wpp" acompanhado da imagem media_1790801757562.png demonstrando o botão redondo verde flutuante de WhatsApp sobrepondo textos ("...nômica") no canto inferior da tela.
- **Ações Executadas**:
  1. **HTML (site-principal/index.html)**:
     - Removida a tag fixa `<a class="floating-whatsapp">...</a>` que causava sobreposição de texto em resoluções mobile e desktop.
     - Preservada a barra fixa de ações mobile oficial da montadora (`.mobile-sticky-action-bar`) e os links dedicados de atendimento no cabeçalho e rodapé.
  2. **CSS (site-principal/style.css)**:
     - Definido `.floating-whatsapp { display: none !important; }` e removidas as regras redundantes nos media queries.
  3. **Build & Deploy**:
     - Compilação de produção com Vite (`npm run build`) concluída com 100% de sucesso.
     - Commit `7a4a9ea` enviado para `main`.


### 8.17 Solução Definitiva da Sincronização em Tempo Real e Liberação de Cadastros no Cloud Firestore

- **Solicitação do Usuário**: 'o banco de dados do site nao esta atualizando em tempo real, fiz liberação do cadstro mais ainda nao conseigyiu entrr' / 'o banco de dados foi solucionado ?'
- **Causa Raiz Identificada**:
  1. **Falha de Atributo ID no Botão de Liberação (renderAdminUsersList)**: Documentos do Firestore (como derik.dws@gmail.com) não possuíam o campo id preenchido no corpo do documento JSON. Na listagem de administração, o botão era renderizado como data-id="undefined". Ao clicar em 'Liberar Acesso', a função chamava updateUserStatus('undefined', 'approved'), falhando silenciosamente e mantendo o lojista com status 'pending' no Firestore.
  2. **Ausência de Listener em Tempo Real para o Lojista Conectado**: O listener subscribeToUsersRealtime era acionado unicamente quando o Administrador abria o painel master. Para o lojista comum com status 'pending' aguardando na página, nenhum listener WebSocket do Firestore estava ativo; mesmo quando aprovado, sua tela permanecia bloqueada até um reload forçado.
  3. **Autorização na API Serverless**: Chamadas de atualização PUT no endpoint /api/users não enviavam o cabeçalho Authorization: Bearer <token>, resultando em 401 Unauthorized.
- **Implementações & Solução**:
  1. **Blindagem dos Botões de Ação (site-principal/main.js)**:
     - Adicionado data-email="${u.email}" e fallback inteligente data-id="${u.id || u.email}" em todos os botões (.btn-approve-user, .btn-revoke-user, .btn-del-user).
     - No evento de clique, a busca extrai approveBtn.getAttribute('data-email') || approveBtn.getAttribute('data-id'), garantindo a identificação infalível do lojista pelo seu e-mail canônico.
  2. **Sincronização em Tempo Real Reativa (setupUserRealtimeSync)**:
     - Implementada a função subscribeToUserDocRealtime(email, callback) em firebase-service.js, conectando diretamente via snapshot do Firestore no documento do lojista.
     - Assim que o lojista se conecta ou cadastra e entra em modo 'pending', o listener é ativado. Quando o administrador aprova no painel, o Firestore dispara o evento em milissegundos: o banner 'Esperando Aprovação' desaparece instantaneamente, os preços de atacado e markups são liberados e o cabeçalho é atualizado sem que o usuário precise recarregar a página.
  3. **Garantia de ID Canônico em fetchUsersFromFirestore**:
     - Geração automática de id: data.id || ('user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')) para garantir que nenhum lojista fique com id: undefined.
  4. **Atualização Atômica da Base (api/users.js, cloud-config.js e Firestore)**:
     - Conta de Derik (derik.dws@gmail.com) atualizada com status 'approved' no Cloud Firestore, em api/users.js e em site-principal/data/cloud-config.js.
  5. **Build & Validação**:
     - npm run build executado com 100% de sucesso.
