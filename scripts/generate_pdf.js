import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'docs');

// Detect browser executable (Chrome or Edge)
function getBrowserPath() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Nenhum navegador (Chrome ou Edge) encontrado para renderização de PDF.');
}

const HTML_TEMPLATE = (title, contentHtml) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.5pt;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .doc-header {
      border-bottom: 2px solid #0ea5e9;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .doc-brand {
      font-family: 'Orbitron', sans-serif;
      font-size: 16pt;
      font-weight: 900;
      letter-spacing: 1px;
      color: #0f172a;
    }

    .doc-brand span {
      color: #0ea5e9;
    }

    .doc-badge {
      background: #0f172a;
      color: #38bdf8;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 4px 10px;
      border-radius: 6px;
    }

    h1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 10px;
      margin-bottom: 14px;
      line-height: 1.25;
    }

    h2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #0284c7;
      margin-top: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 10px;
      color: #334155;
    }

    blockquote {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 8px 12px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
      color: #065f46;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    thead th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #0f172a;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tbody td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }

    tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    tbody tr:hover {
      background: #f1f5f9;
    }

    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      background: #f1f5f9;
      color: #0f172a;
      font-size: 8.5pt;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    pre code {
      background: transparent;
      color: #38bdf8;
      border: none;
      padding: 0;
      font-size: 8pt;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      margin-bottom: 4px;
    }

    input[type="checkbox"] {
      margin-right: 6px;
    }

    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16px 0;
    }

    .doc-footer {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 7.5pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }

    a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 500;
    }

    .profit-badge {
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="doc-brand">Z8 <span>E-MOTION</span></div>
    <div class="doc-badge">DOCUMENTO CORPORATIVO OFICIAL</div>
  </div>

  <main>
    ${contentHtml}
  </main>

  <div class="doc-footer">
    <span>© 2026 Z8 E-Motion Mobilidade Elétrica Brasil • Confidencial & Estratégico</span>
    <span>Gerado automaticamente pelo Sistema Z8</span>
  </div>
</body>
</html>`;

async function convertMarkdownToPdf(relativePath) {
  const mdPath = path.join(docsDir, relativePath);
  const pdfRelative = relativePath.replace(/\.md$/i, '.pdf');
  const pdfPath = path.join(docsDir, pdfRelative);
  const tempHtmlPath = path.join(docsDir, `_temp_${path.basename(relativePath)}.html`);

  if (!fs.existsSync(mdPath)) {
    console.error(`❌ Arquivo não encontrado: ${mdPath}`);
    return;
  }

  // Ensure destination directory exists
  const pdfDir = path.dirname(pdfPath);
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const markdownContent = fs.readFileSync(mdPath, 'utf8');
  const parsedHtml = marked.parse(markdownContent);
  const title = path.basename(relativePath).replace('.md', '').replace(/_/g, ' ');
  const fullHtml = HTML_TEMPLATE(title, parsedHtml);

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  const browserPath = getBrowserPath();
  const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, '/')}`;

  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
  
  try {
    execSync(cmd, { stdio: 'ignore' });

    // Also mirror to public/docs for Vite & Vercel production hosting
    const publicPdfPath = path.join(rootDir, 'public', 'docs', pdfRelative);
    const publicPdfDir = path.dirname(publicPdfPath);
    if (!fs.existsSync(publicPdfDir)) {
      fs.mkdirSync(publicPdfDir, { recursive: true });
    }
    fs.copyFileSync(pdfPath, publicPdfPath);

    console.log(`✅ PDF Gerado com Sucesso: ${pdfRelative} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB) -> [docs/ & public/docs/]`);
  } catch (err) {
    console.error(`❌ Erro ao gerar PDF para ${relativePath}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

async function main() {
  const targetFiles = [
    // Documentos Centrais
    'BRAIN_NOTEBOOK.md',
    'GUIA_AUTOMACAO_VEO.md',
    'KEEP_FORNECEDORES_CAPACETES.md',
    // Dossiê Jurídico & Franquias
    'juridico/CIRCULAR_DE_OFERTA_DE_FRANQUIA_COF.md',
    'juridico/CONTRATO_PADRAO_DE_FRANQUIA.md',
    'juridico/TERMO_DE_GARANTIA_NACIONAL_Z8.md',
    'juridico/TERMO_DE_ENTREGA_TECNICA_E_PDI.md',
    'juridico/TERMOS_DE_USO.md',
    'juridico/POLITICA_DE_PRIVACIDADE_LGPD.md',
    'juridico/PARECER_REGULATORIO_CONTRAN_996.md',
    // Manuais Oficiais da Rede de Franquias
    'MANUAL_UNIFICADO_ARQUITETURA_E_FACHADAS_Z8.md',
    'manuais/MANUAL_DE_IDENTIDADE_VISUAL_E_ARQUITETURA_Z8.md',
    'manuais/GUIA_PADRONIZACAO_ARQUITETURA_E_FACHADAS_Z8.md',
    'Brandbook_Z8_Emotion/MANUAL_ARQUITETURA_E_PLANTA_BAIXA.md',
    'manuais/MANUAL_DE_OPERACOES_E_VENDAS_CONSULTIVAS.md',
    'manuais/MANUAL_DE_ASSISTENCIA_TECNICA_E_MANUTENCAO_PREVENTIVA.md',
    'manuais/TREINAMENTO_TECNICO_INICIAL_16H.md'
  ];

  console.log('🚀 Iniciando geração de PDFs para todos os documentos corporativos e jurídicos da Z8 E-Motion...');
  for (const file of targetFiles) {
    await convertMarkdownToPdf(file);
  }
  console.log('🎉 Todos os PDFs foram gerados e salvos com sucesso!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
