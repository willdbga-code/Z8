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

## 2. 📊 Tabela Oficial de Modelos, Preços e Margens (Memória Atualizada)

| Rank | Modelo | Código | Categoria | Preço Atacado | Preço Varejo | Lucro Bruto | Markup % | Margem % |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1º | **Z8 N710 Urban** | DB002 | Urbana | R$ 5.300,00 | R$ 7.500,00 | R$ 2.200,00 | 41.51% | 29.33% |
| 2º | **Z8 Q11 Compact** | DB043-Q11 | Urbana | R$ 5.200,00 | R$ 7.300,00 | R$ 2.100,00 | 40.38% | 28.77% |
| 3º | **Z8 N7 Standard** | DB001 | Urbana | R$ 5.500,00 | R$ 7.500,00 | R$ 2.000,00 | 36.36% | 26.67% |
| 4º | **Z8 Q10 Vintage** | DB038 | Vintage | R$ 5.800,00 | R$ 7.800,00 | R$ 2.000,00 | 34.48% | 25.64% |
| 5º | **Z8 FX-10 Sport** | DB043 | Esportiva | R$ 7.000,00 | R$ 9.000,00 | R$ 2.000,00 | 28.57% | 22.22% |
| 6º | **Z8 Tank High-Speed** | DB018 | Performance | R$ 7.500,00 | R$ 9.500,00 | R$ 2.000,00 | 26.67% | 21.05% |
| 7º | **Z8 U2 Delivery Cargo** | XB-026 | Utilitária | R$ 6.000,00 | R$ 7.500,00 | R$ 1.500,00 | 25.00% | 20.00% |
| 8º | **Z8 Harley X21 Custom** | XB-024 | Custom | R$ 6.500,00 | R$ 8.000,00 | R$ 1.500,00 | 23.08% | 18.75% |
| 9º | **Z8 N95C Max Comfort** | DB039 | Urbana | R$ 6.500,00 | R$ 8.000,00 | R$ 1.500,00 | 23.08% | 18.75% |
| 10º | **Z8 Diamond Luxury** | DM-001 | Urbana | R$ 3.400,00 | R$ 4.800,00 | R$ 1.400,00 | 41.18% | 29.17% |
| 11º | **Z8 Base Norte GS-005** | GS-005 | Utilitária | R$ 3.200,00 | R$ 4.200,00 | R$ 1.000,00 | 31.25% | 23.81% |

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
