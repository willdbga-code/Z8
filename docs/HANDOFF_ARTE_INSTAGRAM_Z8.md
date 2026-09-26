# HANDOFF OFICIAL // MOTOR VISUAL & ARTES INSTAGRAM Z8
**Data do Checkpoint:** 24 de Setembro de 2026 — 06:15 BRT  
**Status do Projeto:** V7 Desencapsulada Finalizada & Estrutura Operacional Pronta para Retomada  
**Branch:** `main` | **Repositório:** `https://github.com/willdbga-code/Z8`

---

## 1. Resumo Executivo da Sessão de Hoje
Nesta sessão, desenvolvemos, testamos e validamos o **Z8 Visual Engine** para criação de peças de alto impacto para Instagram (Stories 9:16 e Feed), com foco inicial na campanha de **Expansão de Franquias para Jacareí - SP**. 

Evoluímos através de 7 iterações refinadas pelo feedback direto do usuário:
* **V1 & V2**: Transição de alucinações de IA para uso obrigatório dos **modelos reais de catálogo** (`public/assets/models/z8_tank_studio.jpg`), logo oficial e escala exponencial.
* **V3**: Incorporação das referências de arte automotiva minimalista do projeto **EGIKE de Omar Elagamy** (Behance) e eliminação total de efeitos luminosos/neon.
* **V4**: Implementação dos **7 Elementos Notórios de EGIKE** com sobreposição de camadas 3D (moto na frente do título).
* **V5**: Desengessamento do layout aplicando **Plano Americano em ângulo baixo com iluminação Hero Light** + geração do ativo auxiliar **Macro 1:1 de ótica e fibra de carbono**.
* **V6**: Enxugamento do fluxo via geração direta do poster base pelo motor generativo (com o título monumental `JACAREI` e piso limpo) + backup em `/posters` + injeção de copy PNL provocante.
* **V7 (Estado Atual)**: **Desencapsulamento total dos textos**, remoção do botão de CTA, ampliação das frases de autoridade (`MONOPÓLIO TERRITORIAL // APENAS 1 VAGA`) e respiro editorial de estúdio.

---

## 2. Nova Arquitetura de Pastas e Armazenamento
Estabelecemos um fluxo limpo e padronizado:
1. **`public/assets/cria/posters/`** (e espelho em `dist/assets/cria/posters/`):
   * Guarda as **Bases Fotográficas Puras (Clean Plates / Generative Bases)** com a moto e o título hero de cidade, mantendo o terço inferior livre para injeção.
   * Arquivo ativo: `base_jacarei_tank.jpg`.
2. **`public/assets/cria/`** (e espelho em `dist/assets/cria/`):
   * Guarda os **Cartazes Finais Prontos para Veiculação** após a injeção de tipografia editorial, PNL e contato.
   * Arquivo ativo: `story_jacarei_franquia_final.png` (V7 Desencapsulada).
3. **`scripts/`**:
   * Motor de compilação pixel-perfect 1080x1920 via Edge Headless:
     * `scripts/poster_jacarei_v7_desencapsulado.html` (Template atual)
     * `scripts/render_poster_image.js` (Script Node de renderização)

---

## 3. Diretrizes e Regras Consolidadas no Cérebro
* **Regra Negativa 4 (Zero Efeitos Luminosos)**: Proibição absoluta de neon glow, halos difusos de luz, borrões azuis ou sombras coloridas. Cores sólidas, foscas e contraste editorial puro.
* **Color Blocking Estrito**: Máximo de 3 cores por peça:
  1. **Azul Elétrico Z8 / Ciano** (`#00F0FF`)
  2. **Branco Cirúrgico** (`#FFFFFF`)
  3. **Grafite Escuro / Preto Concreto** (`#080A0E`)
* **Métrica PNL de Alta Curiosidade**: Sem textos explicativos longos. Apenas ganchos psicológicos provocantes, escassez territorial e autoridade:
  * Hook: *"UMA CIDADE INTEIRA. UMA ÚNICA CHAVE. O mercado elétrico não espera. Quem chegar primeiro, domina."*
  * Pilares: *"MONOPÓLIO TERRITORIAL // APENAS 1 VAGA"*
  * Contato direto sem botão genérico: *"Z8 EMOTION // CONCESSÃO JACAREÍ - SP • (12) 99800-8818"*.
* **Design Desencapsulado**: Sem pílulas, sem cartões pesados e sem botões de template. Tipografia livre respirando sobre o piso reflexivo.
* **Integração Anatômica do Logo**: Emblema metálico Z8 posicionado exclusivamente sobre superfícies lisas da carenagem, sem cruzar barras tubulares ou soldas.

---

## 4. Ativos Ativos Prontos para Retomada
* `public/assets/cria/story_jacarei_franquia_final.png`: Cartaz oficial final V7 (1080 × 1920 px).
* `public/assets/cria/posters/base_jacarei_tank.jpg`: Base fotográfica pura de backup (1080 × 1920 px).
* `public/assets/cria/z8_tank_macro_detail.jpg`: Estudo macro 1:1 de ótica, fibra de carbono e emblema OEM Z8.
* `public/assets/cria/z8_tank_hero_light.jpg`: Fotografia de estúdio Plano Americano com iluminação Hero Light.

---

## 5. Pauta e Próximos Passos para Amanhã
1. **Revisão e Aprovação da V7**:
   * Avaliar os ajustes finos de entrelinha, espaçamento e leitura do cartaz V7 desencapsulado com o usuário.
2. **Expansão para as Próximas Cidades do Cluster**:
   * Replicar a base enxuta com os títulos monumentais das cidades vizinhas no Vale do Paraíba:
     * **São José dos Campos**
     * **Taubaté**
     * **Pindamonhangaba**
     * **Litoral Norte (Caraguatatuba / São Sebastião / Ubatuba)**
3. **Desdobramento com os Outros Modelos do Catálogo**:
   * Aplicar a mesma estética fotográfica (Plano Americano / Hero Light) nos demais modelos de `public/assets/models/`:
     * **Z8 FX-10 Sport** (Motoneta esportiva carenada)
     * **Z8 N95C Executive** (Scooter urbana executiva)
     * **Z8 Diamond** (Scooter retrô luxo)
     * **Z8 U2 Delivery Cargo** (Linha profissional para logística)
4. **Variações de Formato (Opcional)**:
   * Adaptar os templates de Stories (9:16) para Feed Retrato (4:5 - 1080x1350) e Feed Quadrado (1:1 - 1080x1080).
