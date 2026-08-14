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

## Git & Deployment Protocol
- Remote repository is `willdbga-code/Z8`.
- Push permission is authorized for user `christian-hideyuki`.
- Always run `git status` and verify rebase clean before pushing.
