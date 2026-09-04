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

## Git & Deployment Protocol
- Remote repository is `willdbga-code/Z8`.
- Push permission is authorized for user `christian-hideyuki`.
- Always run `git status` and verify rebase clean before pushing.
- Commits deployed: `cad8124`, `358995e`, `89b0cf7`.

