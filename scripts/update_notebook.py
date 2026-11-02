import datetime

with open('docs/BRAIN_NOTEBOOK.md', 'a', encoding='utf-8') as f:
    f.write(f"""

---

## 29. ⚡ Separação Definitiva Conceito 1 vs Conceito 2 & Atualização dos 13 Modelos com Hover em Camadas e Animações Responsivas ({datetime.date.today().strftime('%d/%m/%Y')})

### A. Papéis Claros e Distintos dos Ambientes
1. **Conceito 1 (`/conceito/`) — Flagship Motion & Showroom Visual**:
   - Experiência completa com WebGL 3D, Carrossel interativo dos 13 modelos, simulador de lucratividade DRE e design cinemático nativo inspirado em landonorris.com.
   - Desvinculado do desvio forçado `is-poslogin-direct`, permitindo que investidores e visitantes explorem toda a visão da marca e a frota completa.
2. **Conceito 2 (`/conceito-2/`) — Portal do Lojista & Mesa de Atacado LAF 2026**:
   - Experiência pós-login de alta conversão B2B, motor de montagem de pedidos de lote (mínimo 10 motos), ocupação em tempo real de contêiner 40HQ (pág. 24 do catálogo oficial), espelho de faturamento e minuta WhatsApp 1-Clique.
   - Central de Ordens de Serviço (OS) com tabela interativa, filtros, cadastro de OS e sincronização em tempo real com o Cloud Firestore (`service_orders` e `wholesale_orders`).

### B. Integração dos 2 Novos Modelos (Total de 13 Motos)
- **Z8 Tank 2 Expedition (`z8-tank-2`)**:
  - Código: `DB018-T2` | Categoria: `alta-velocidade` | CNH: `CNH A // Trail Expedition`
  - Atacado: **R$ 8.500,00** | Varejo Sugerido: **R$ 12.500,00** | Lucro Bruto: **R$ 4.000,00** (+47,1% Markup / 32,0% Margem)
  - Cores: Desert Amber, Midnight Black, Glacier White
  - Cutout: `/assets/models/cutouts/z8_tank2_cutout.png` | Hover: `/assets/models/hover/z8_tank2_hover.jpg`
- **Z8 FX-12 Sport (`z8-fx12`)**:
  - Código: `DB043-FX12` | Categoria: `alta-velocidade` | CNH: `CNH A // Sport Touring`
  - Atacado: **R$ 7.800,00** | Varejo Sugerido: **R$ 10.600,00** | Lucro Bruto: **R$ 2.800,00** (+35,9% Markup / 26,4% Margem)
  - Cores: Lava Orange, Cyber Silver, Stealth Black
  - Cutout: `/assets/models/cutouts/z8_fx12_cutout.png` | Hover: `/assets/models/hover/z8_fx12_hover.jpg`

### C. Arquitetura de Hover em Camadas (Imagem Atrás da Moto)
- **Camada 1 (Fundo, z-index: 1)**: `.helmet-grid-item-reveal-img` contém a fotografia de cenário/lifestyle real da moto em estrada/cidade (`/assets/models/hover/z8_*.jpg`). Por padrão está oculta (`opacity: 0; clip-path: ellipse(0% 0% at 50% 50%)`). No hover, expande suavemente com `clip-path: ellipse(150% 150% at 50% 50%)` e `opacity: 1`.
- **Camada 2 (Frente, z-index: 3)**: `.helmet-grid-item-img-helmet-w` mantém o recorte transparente PNG da moto (`/assets/models/cutouts/z8_*.png`) sempre visível em primeiro plano. No hover, o recorte da moto escala suavemente (`scale(1.08) translateY(-4px)`) e ganha projeção de sombra tridimensional com aura ciano Z8, flutuando à frente do cenário que se revela no fundo.

### D. Animações Cinéticas de Texto no Scroll Desbloqueadas (Duo, Tablet e Mobile)
- No motor `public/assets/lando/lando-engine.js`, foi removida a restrição `window.innerWidth >= 992` que bloqueava a execução de `D7()`, `E7()` e `k7()` em telas menores que 992px.
- Agora, as transições cinéticas de revelação de linhas com tarjas coloridas (`data-anim-high`), o split-text e os scrolls ovais são executados com precisão matemática em smartphones, dobráveis (Surface Duo / iPhone Duo) e tablets.
""")

print("Appended update to docs/BRAIN_NOTEBOOK.md")
