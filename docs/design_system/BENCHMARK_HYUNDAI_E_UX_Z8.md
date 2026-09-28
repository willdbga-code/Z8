# Estudo de Engenharia Reversa: Hyundai Brasil (hyundai.com.br) & Plano de Aplicação Z8 E-Motion

## 1. Como o Site da Hyundai Brasil foi Construído (/learn)

### 1.1 Arquitetura & Stack Tecnológica
- **CMS Corporativo de Alto Desempenho**: Adobe Experience Manager (AEM 6.5 / AEM as a Cloud Service). É a plataforma padrão de montadoras globais para gestão de catálogos multilíngues e milhares de concessionárias.
- **Frontend SPA**: React.js integrado ao AEM através de Client Libraries (`clientlib-react`). Essa abordagem permite que o site se comporte como uma Single Page Application fluida, sem recarregar a página durante a navegação entre versões de carros ou personalizações de opcionais.
- **Ferramentas de Experimentação & CRO**: Visual Website Optimizer (VWO v2.2) para testes A/B em tempo real de botões de CTA, ordenação de carros e gatilhos de conversão.
- **Tag Management & Analytics**: Adobe Launch (antigo DTM) integrado ao Adobe Analytics e Google Tag Manager, rastreando cada interação do usuário com telemetria detalhada (tempo no configurador, cores mais clicadas, abandono de formulário).
- **Acessibilidade Digital**: Integração com a suíte Hand Talk (avatar 3D para tradução de conteúdo em Libras).
- **Rede de Distribuição & Cache**: Akamai Edge CDN com pré-carregamento agressivo de fontes e assets críticos (LCP otimizado).

### 1.2 Filosofia de Design: "Sensuous Sportiness"
A Hyundai estrutura toda a sua experiência digital sobre quatro pilares visuais:
1. **Proporção**: Grids assimétricos de 12 colunas com respiro generoso (margens laterais de 5% a 8%), evitando o acúmulo de elementos em telas menores.
2. **Arquitetura Visual**: Tipografia monumental geométrica (*Hyundai Sans Head*) contrastando com legendas ultra-limpas e espaçadas.
3. **Estilo & Cor**: 
   - Azul Marinho Profundo (*Hyundai Navy* `#002C5F`): Transmite autoridade, segurança e herança industrial.
   - Ciano Elétrico (*Active Cyan* `#00AAD2`): Destaque para a linha eletrificada (Ioniq) e botões de chamada primária.
   - Branco Puro & Cinzas Minerais (`#FFFFFF`, `#F6F6F6`, `#222222`): Fundo limpo que permite que o design do carro seja o centro das atenções.
4. **Tecnologia & Micro-interações**: Paletas de cores interativas, animações de transição suaves (300ms cubic-bezier), sombras em camadas leves (`0 8px 30px rgba(0,0,0,0.06)`), sem efeito de relevo ou botões pesados antigos.

### 1.3 Recursos de UX Chave da Hyundai
- **"Monte o Seu" (Configurador Visual)**: O cliente seleciona o modelo, versão, cor da lataria e acabamento interno com feedback visual imediato.
- **"Compare Modelos"**: Matriz lado a lado onde o cliente seleciona dois ou três veículos e visualiza a diferença exata de itens de série, consumo e preço.
- **Sticky Bottom Bar no Mobile**: Barra fixa inferior com altura reduzida (64px) contendo CTAs estratégicos: "Agendar Test Drive" e "Simular Financiamento".
- **Fluxo "Click to Buy"**: Redução da barreira de entrada com formulários de 2 etapas (Progressive Disclosure) para envio direto do lead à concessionária da região.

---

## 2. Auditoria Crítica de UX do Ecossistema Atual da Z8 (/grill-me & /boost)

### 2.1 Análise da Página 1: Site Principal (`/site-principal/`)
- **Pontos Fortes**:
  - Dados de rentabilidade muito sólidos e detalhados (custo fábrica, atacado, markup, margem de cada um dos 11 modelos).
  - Tabela de pedidos (Order Desk) e fluxo de Garantia & O.S sincronizados em tempo real com o Firestore.
- **Fricções e Oportunidades de Melhoria**:
  - **Linguagem Visual "Skeuomorphic" Datada**: O site principal adota botões chanfrados com relevo metálico cinza e rocker switches industriais pesados que lembram softwares dos anos 2000. Isso destoa da elegância futurista e minimalista de marcas de veículos elétricos modernos (Tesla, Polestar, Hyundai Ioniq).
  - **Falta de Seletor de Cores no Catálogo**: O visitante visualiza apenas uma foto fixa por modelo, sem interatividade.
  - **Ausência de Comparador Direto**: Não é possível comparar rapidamente dois modelos (ex: Z8 Tank vs Z8 FX-10) lado a lado em uma tabela limpa.
  - **Header com Muita Carga Cognitiva**: Muitos botões de navegação horizontal no desktop que quebram a hierarquia visual.

### 2.2 Análise da Página 2: Vendas (`/vendas/`)
- **Pontos Fortes**:
  - Copy persuasiva orientada a negócios B2B e expansão territorial.
  - Vídeos cinematográficos Veo de alta qualidade integrados no Hero e Bento Grid.
  - Verificador de CEP e cálculo de faturamento em tempo real.
- **Fricções e Oportunidades de Melhoria**:
  - **Formulário com Atrito Excessivo**: O formulário do Drawer exige responder 6 perguntas (nome, empresa, e-mail, telefone, capital, experiência, prazo) antes de poder falar com um consultor. No mobile, isso gera abandono de leads com alto potencial.
  - **Mobile Action Bar Ausente**: Enquanto o usuário rola a página no celular lendo os modelos e o bento grid, ele perde o botão de ação rápida para falar no WhatsApp.
  - **Tipografia e Cartões**: Alguns cards possuem texto denso e tags sobrepostas que disputam a atenção do visitante.

---

## 3. Matriz de Transformação: Do Atual para o Padrão Montadora de Luxo

| Elemento de UX | Estado Atual Z8 | Novo Padrão Inspirado na Hyundai |
| :--- | :--- | :--- |
| **Estilo Visual** | Skeuomorphism metálico (bordas chanfradas, botões com relevo 3D cinza) | **Flat Luxury Automotivo** (Dark Graphite `#080A0E`, vidro translúcido fumê, acentos Ciano Z8 `#00F0FF`) |
| **Catálogo de Modelos** | Cards estáticos verticais com specs simples | **Showroom Interativo**: seletor de cores reais da moto, abas por categoria e modal 360° |
| **Comparação de Veículos** | Não disponível (o cliente precisa rolar a página para ver cada modelo) | **Comparador Z8 Lado a Lado**: compare 2 ou 3 modelos em autonomia, velocidade, potência e margem |
| **Menu Superior** | Lista de botões prateados horizontais | **Mega-Menu com Silhuetas**: menu clean com abas Urbanas, Trail, Custom e Acesso Parceiro |
| **Mobile Experience** | Botões estáticos espalhados no meio do conteúdo | **Sticky Bottom Bar**: barra flutuante elegante com "Falar no WhatsApp" e "Simular Lote" |
| **Captação de Leads** | Formulário longo com 6 a 8 campos de uma vez | **Funil Progressivo**: Etapa 1 (Cidade + WhatsApp imediato) -> Etapa 2 (Perfil de Investidor após envio) |

---

## 4. Plano de Execução Técnica

1. **Tokens de Design System Unificados (`site-principal/style.css` e `vendas/style.css`)**:
   - Padronizar paleta de cores: Fundo principal `#080A0E`, Cards `rgba(255,255,255,0.025)`, Bordas `rgba(255,255,255,0.08)`, Acento `var(--cyan-z8, #00F0FF)`.
   - Padronizar tipografia: Títulos monumentais em `Syne` / `Orbitron` geométrico e corpo em `Inter` / `Outfit`.
2. **Componente Comparador de Modelos (Novo)**:
   - Interface interativa com dropdown para selecionar Modelo A e Modelo B, renderizando tabela comparativa limpa com badges visuais.
3. **Seletor de Cores Interativo nas Fotos**:
   - Botões circulares de cores que trocam instantaneamente a imagem da moto sem reload.
4. **Sticky Action Bar Mobile**:
   - Barra inferior fixa discreta com botões otimizados para touch (≥ 48px).
