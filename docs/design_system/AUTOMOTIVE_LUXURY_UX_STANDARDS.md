# Diretrizes Globais de Design & UX/UI de Montadoras de Luxo (2026)
*Referência Técnica: Hyundai Motor Brasil, Genesis Global, Polestar Design & Porsche Editorial*

---

## 1. Princípios Fundamentais de Arquitetura Visual

### 1.1 Eliminação do Caos Visual e Contraste Puro
- **O Problema do Design Antigo**: Imagens escuras com texto escuro sobreposto, gerando contraste nulo (< 2:1), fadiga visual e ar amador de página de captura de afiliados.
- **O Padrão de Montadora**:
  - Superfícies claras e serenas: Fundo **Cinza Claro Acetinado de Estúdio** (`#F4F5F7` a `#FFFFFF`).
  - Tipografia de alto impacto e legibilidade garantida: **Cinza Escuro Slate** (`#111827`) e **Azul Navy Heritage** (`#002C5F`), atingindo contraste superior a **12:1** (AAA WCAG 2.2).
  - Linhas milimétricas e sutis (`1px solid #E2E8F0`) no lugar de caixas pesadas ou bordas escuras.

### 1.2 O Veículo como Obra de Arte Industrial (O Palco do Hero)
- O veículo nunca deve ser cortado de forma desajeitada ou escondido atrás de blocos pesados de texto.
- O veículo deve ocupar um **Palco de Estúdio Dedicado**:
  - Ângulo 3/4 frontal dinâmico ou perfil lateral executivo.
  - Sombra física suave de contato dos pneus no solo (`drop-shadow` e pedestal elíptico difuso com gradiente radial).
  - Telemetria integrada em **Pills Minimalistas** (`border-radius: 9999px`), sem sobrecarregar a imagem.
  - Seletor horizontal de versões na base do palco para exploração imediata em 1 clique.

### 1.3 Tipografia Editorial & Escala Hierárquica
- Família Principal de Títulos: **`Outfit`** (pesos 600 a 900) — geométrica, precisa, moderna, sem ser robótica.
- Família Corporal de Leitura: **`Inter`** (pesos 400 a 600) — neutra, com altura de x generosa e excelente legibilidade em qualquer dispositivo móvel.
- Escala:
  - Títulos Hero: `clamp(2rem, 5vw, 3.8rem)` com `line-height: 1.1`.
  - Títulos de Seção: `2.2rem` com `line-height: 1.2`.
  - Corpo de Texto: `1.05rem` a `1.15rem` com `line-height: 1.68` para leitura descansada.

---

## 2. A Jornada do Investidor & Concessionário B2B

1. **Impacto e Autoridade Imediata (Hero Stage)**:
   Apresentação clara da montadora, do veículo protagonista e da proposta de valor regional.
2. **Pilares de Segurança & Confiança**:
   - Margens de fábrica auditadas (até 48,4%).
   - Homologação nacional Resolução CONTRAN 996 (isenção de CNH e modelos elétricos de alta demanda).
   - Centro de distribuição de peças originais e assistência técnica no Brasil (SP).
3. **Showroom de Produtos com Customização**:
   Visualização limpa de cada modelo, especificações essenciais, margem em Reais por moto e troca dinâmica de cores autênticas de fábrica.
4. **Inteligência Financeira (Simulador)**:
   Simulador interativo sóbrio com projeção de lucro líquido mensal e retorno de investimento.
5. **Candidatura para Concessão com Proteção Territorial**:
   Formulário executivo progressivo em 2 etapas com verificação de raio de exclusividade de 50km no município.

---

## 3. Paleta Oficial de Cores Z8 de Montadora
- `--bg-page: #F4F5F7` (Cinza Claro Estúdio Acetinado)
- `--bg-card: #FFFFFF` (Branco Puro Showroom)
- `--bg-inset: #F8FAFC` (Cinza Suave de Controles)
- `--accent-navy: #002C5F` (Azul Navy Heritage Z8)
- `--accent-navy-hover: #001A3A`
- `--accent-slate: #111827` (Cinza Escuro Slate)
- `--text-heading: #111827`
- `--text-body: #334155`
- `--text-muted: #64748B`
- `--border-subtle: #E2E8F0`
- `--border-active: #002C5F`
- `--accent-emerald: #059669` (Destaque sutil de rentabilidade)
