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
4. **Fabrício Daniel de Oliveira Castro**: `fabriciopolocruzeiro@gmail.com` (JF, Pindamonhangaba - SP, (12) 99106-4106, Passaporte VIP) -> Status: `pending`
5. **Derik**: `derik.dws@gmail.com` (derik, Jacareí - SP, (12) 98198-6760) -> Status: `pending` (Cadastrado via Catálogo Web em 03/09/2026)

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
- Commits deployed: `cad8124`, `358995e`, `89b0cf7`, `cca27dc`, `73d7620`, `8e55022`, `97290e2`.

## Resume Point for Next Session
1. Confirmar sincronização em tempo real das Ordens de Serviço (OS) e leads no Firestore oficial.
2. Testar fluxo ponta a ponta em produção.

