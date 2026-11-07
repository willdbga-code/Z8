import sys

sys.stdout.reconfigure(encoding='utf-8')

entry = """

## [Sessão 2026-11-02] Restauração Integral do Motor WebGL 3D (Lando Norris), Hover em Camadas das 13 Motos, Animações de Texto no Scroll para Mobile/Tablet/Duo e Sincronização B2B Reativa

### 1. Diagnóstico e Resolução da Tela Escura no Conceito 1 (`conceito/`)
- **Causa Raiz**: Tentativas anteriores de substituição de strings brutas via regex em `public/assets/lando/lando-engine.js` causaram quebra de sintaxe (`SyntaxError: Unexpected token ';'`), interrompendo o boot do Three.js WebGL, 3D Canvas, Rive e Lenis.
- **Resolução Definitiva**: 
  - `public/assets/lando/lando-engine.js` e `dist/assets/lando/lando-engine.js` foram restaurados para a versão pristina do commit `e1db54b`.
  - Validação de sintaxe via `node -c` (código de saída 0).
  - Verificação visual via Puppeteer headless: o motor 3D WebGL, iluminação dinâmica, modelo 3D do herói, contornos topográficos de fundo e shaders retornaram com 100% de estabilidade (0 erros no console).
  - Regra permanente estabelecida: **NUNCA modificar diretamente o bundle minificado `lando-engine.js`**. Extensões de animação responsiva devem ser implementadas no módulo da página (`conceito/app.js`).

### 2. Catálogo Oficial de 13 Modelos e Hover em Camadas
- **Modelos Integrados**: Inseridos os 2 novos modelos da linha 2026 do Catálogo LAF:
  1. `z8-tank-2` (DB018-T2 // Z8 Tank 2 High-Speed 2000W Trail): Atacado R$ 8.500, Varejo R$ 12.500, Lucro +R$ 4.000, +47,1% Markup.
  2. `z8-fx12` (DB043-FX12 // Z8 FX-12 Sport 2000W Brushless): Atacado R$ 7.800, Varejo R$ 10.600, Lucro +R$ 2.800, +35,9% Markup.
- **Arquitetura Visual de Hover em Duas Camadas**:
  - **Camada 1 (Fundo)**: `.helmet-grid-item-reveal-img` com `z-index: 1`, `opacity: 0`, e expansão elíptica no hover (`clip-path: ellipse(150% 150% at 50% 50%)`, `opacity: 1`), revelando a fotografia cênica/atmosférica do modelo atrás da moto.
  - **Camada 2 (Frente)**: `.helmet-grid-item-img-helmet-w` com `z-index: 3`, recorte PNG transparente de alta definição com `object-fit: contain`, elevando-se suavemente no hover (`scale(1.08) translateY(-4px)`) com iluminação drop-shadow ciano e preta.
  - Corrigido mapeamento de assets para os 13 modelos em `conceito/index.html` e `conceito-2/index.html` (incluindo desambiguação dos pares Q10 e Q11).

### 3. Motor de Animação Cinética de Texto no Scroll para Mobile, Tablet e Telas Dobráveis (Duo)
- **Problema Original**: O motor original do Lando Norris restringia a função `D7()` (tarjas ciano animadas de revelação de linhas em `[data-anim-high]` e `[split-text]`) estritamente a viewports desktop (`window.innerWidth >= 992`). Em celulares e telas como iPhone Duo / Surface Duo fechado, os textos ficavam estáticos.
- **Implementação Segura (`initKineticTextScrollMobile`)**:
  - Criado motor autônomo acionado em `conceito/app.js` e `conceito-2/app.js`.
  - Utiliza as instâncias globais já carregadas de `window.gsap` e `window.ScrollTrigger`.
  - Detecta as linhas geradas pelo SplitText (`.line`), aplica o corte inicial `clipPath: inset(0 100% 0 0)`, injeta a tarja `.high-line-reveal` com cor institucional Z8 (`#00F0FF`) e orquestra a animação de revelação e deslizamento da barra conforme o elemento entra no viewport (gatilho ScrollTrigger em 92%).
  - Prevenção de colisões: Ocultado `.home-hero-next-race-w` em telas `<= 991px` para evitar sobreposição com o texto monumental em telas dobráveis e smartphones.

### 4. Sincronização Reativa Total no Portal do Lojista (`conceito-2/`)
- **Páginas Independentes**: `conceito/` (Showroom Conceito 1 com 3D WebGL) e `conceito-2/` (Portal do Lojista B2B) mantidos como rotas distintas e independentes.
- **Sincronização 100% Reativa das Áreas de Compra**:
  - Inserida a tabela completa "SELEÇÃO DE MODELOS & QUANTIDADES" (Mesa de Atacado) com todos os 13 modelos no Módulo 03 (`#laf-block-pedidos`), complementando a barra de presets e os chips selecionados.
  - Qualquer alteração de quantidade em qualquer lugar (fichas Split 40/60 no catálogo, chips do resumo, tabela de montagem do lote, ou gaveta de detalhes) atualiza o mesmo estado central `wholesaleOrderStore`.
  - Recálculo reativo instantâneo do volume de motos, ocupação de contêiner 40HQ, investimento total de atacado, faturamento estimado e lucro bruto projetado.
  - Exemplo verificado em teste automatizado: ao adicionar 1 unidade de FX-12 na ficha inicial e mais 1 unidade na tabela final, o sistema unifica em 2 unidades (R$ 15.600,00) em todas as áreas simultaneamente.
- **Pós-Venda e Ordens de Serviço (OS)**:
  - Módulo 04 (`#rodape-os`) com gestão completa de chamados técnicos de garantia, 2 elevadores de oficina homologada e sincronização em tempo real com a coleção `service_orders` do Firestore oficial (`z8-emotion-brasil`).
"""

with open('docs/BRAIN_NOTEBOOK.md', 'a', encoding='utf-8') as f:
    f.write(entry)

print("✓ Appended contextual entry to docs/BRAIN_NOTEBOOK.md")
