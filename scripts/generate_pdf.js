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

const HTML_TEMPLATE = (title, contentHtml) => {
  const hasAbntCover = contentHtml.includes('abnt-folha-rosto');
  return `<!DOCTYPE html>
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
      padding: 8px 10px;
      border-radius: 6px;
      overflow: hidden;
      margin: 10px 0;
      page-break-inside: avoid;
    }

    pre code {
      background: transparent;
      color: #38bdf8;
      border: none;
      padding: 0;
      font-size: 6.8pt;
      line-height: 1.15;
      letter-spacing: -0.25px;
      font-family: 'JetBrains Mono', Consolas, 'Courier New', monospace;
      white-space: pre;
      display: block;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 10px 0;
      border: 1px solid #cbd5e1;
      display: block;
      page-break-inside: avoid;
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

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* --- NORMAS ABNT (NBR 14724, NBR 6028, NBR 6027) --- */
    .abnt-folha-rosto {
      page-break-after: always;
      break-after: page;
      min-height: 245mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 8mm 6mm;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
      margin-bottom: 20px;
    }

    .abnt-instituicao h2 {
      font-family: 'Orbitron', 'Inter', sans-serif;
      font-size: 13pt;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #0f172a;
      margin: 0;
      text-transform: uppercase;
    }

    .abnt-sub {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0284c7;
      letter-spacing: 1px;
      margin-top: 4px;
      text-transform: uppercase;
    }

    .abnt-dados {
      font-size: 8pt;
      color: #64748b;
      margin-top: 2px;
    }

    .abnt-titulo-bloco {
      margin: 20px 0 15px 0;
    }

    .abnt-titulo {
      font-family: 'Orbitron', 'Inter', sans-serif;
      font-size: 12.5pt;
      font-weight: 800;
      line-height: 1.35;
      color: #0f172a;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .abnt-subtitulo {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0284c7;
      line-height: 1.3;
      text-transform: uppercase;
      margin: 0;
    }

    .abnt-nota-natureza {
      margin-left: 42%;
      margin-top: 15px;
      margin-bottom: 20px;
      text-align: justify;
      font-size: 8.5pt;
      line-height: 1.45;
      color: #334155;
      border-left: 2px solid #0284c7;
      padding-left: 12px;
    }

    .abnt-partes-resumo {
      font-size: 8.5pt;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 4px;
      margin: 0 4% 18px 4%;
      text-align: left;
    }

    .abnt-rodape {
      margin-top: auto;
      font-size: 8.5pt;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.5px;
    }

    .abnt-rodape span {
      color: #0284c7;
    }

    /* Seções Pré-Textuais (Resumo e Abstract) */
    .abnt-secao-pre-textual {
      page-break-after: always;
      break-after: page;
      margin-bottom: 24px;
    }

    .abnt-secao-titulo {
      font-family: 'Orbitron', 'Inter', sans-serif;
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      text-align: center;
      margin: 10px 0 16px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .abnt-resumo-corpo {
      text-align: justify;
      font-size: 9pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      padding: 16px 18px;
      border-left: 4px solid #0284c7;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .abnt-palavras-chave {
      font-size: 8.5pt;
      line-height: 1.5;
      color: #334155;
      margin-top: 8px;
      padding: 0 4px;
    }

    /* Sumário / Índice ABNT NBR 6027 com Dotted Leaders */
    .abnt-sumario-grid {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 18px 22px;
      font-size: 8.5pt;
      line-height: 1.6;
      color: #1e293b;
    }

    .sumario-entry {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .sumario-nivel-1 {
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }

    .sumario-nivel-2 {
      padding-left: 14px;
      color: #334155;
    }

    .sumario-num {
      flex-shrink: 0;
      margin-right: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #0284c7;
    }

    .sumario-texto {
      flex-shrink: 0;
      max-width: 80%;
    }

    .sumario-dots {
      flex-grow: 1;
      border-bottom: 1px dotted #94a3b8;
      margin: 0 8px;
      height: 1px;
    }

    .sumario-pag {
      flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
    }
  </style>
</head>
<body class="${hasAbntCover ? 'has-abnt-cover' : ''}">
  ${!hasAbntCover ? `
  <div class="doc-header">
    <div class="doc-brand">Z8 <span>E-MOTION</span></div>
    <div class="doc-badge">DOCUMENTO CORPORATIVO OFICIAL</div>
  </div>` : ''}

  <main>
    ${contentHtml}
  </main>

  <div class="doc-footer">
    <span>© 2026 Z8 E-Motion Mobilidade Elétrica Brasil • Confidencial & Estratégico</span>
    <span>Gerado automaticamente pelo Sistema Z8</span>
  </div>
</body>
</html>`;
};

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
  let parsedHtml = marked.parse(markdownContent);

  // Resolve image paths to file:/// URLs so headless browser loads them reliably
  parsedHtml = parsedHtml.replace(/<img\s+([^>]*?)src=["']([^"']+)["']/g, (match, prefix, src) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('file:///')) {
      return match;
    }
    const absoluteImgPath = path.resolve(path.dirname(mdPath), src);
    const fileUrl = `file:///${absoluteImgPath.replace(/\\/g, '/')}`;
    return `<img ${prefix}src="${fileUrl}"`;
  });

  const title = path.basename(relativePath).replace('.md', '').replace(/_/g, ' ');
  const fullHtml = HTML_TEMPLATE(title, parsedHtml);

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  const browserPath = getBrowserPath();
  const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, '/')}`;

  // Try modern --headless=new first, fallback to --headless
  const cmd = `"${browserPath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
  
  try {
    try {
      execSync(cmd, { stdio: 'ignore' });
    } catch {
      const fallbackCmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
      execSync(fallbackCmd, { stdio: 'ignore' });
    }

    // Mirror to public/docs for Vite & Vercel production hosting
    const publicPdfPath = path.join(rootDir, 'public', 'docs', pdfRelative);
    const publicPdfDir = path.dirname(publicPdfPath);
    if (!fs.existsSync(publicPdfDir)) {
      fs.mkdirSync(publicPdfDir, { recursive: true });
    }
    fs.copyFileSync(pdfPath, publicPdfPath);

    // Mirror to dist/docs if dist folder exists
    const distPath = path.join(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      const distPdfPath = path.join(distPath, 'docs', pdfRelative);
      const distPdfDir = path.dirname(distPdfPath);
      if (!fs.existsSync(distPdfDir)) {
        fs.mkdirSync(distPdfDir, { recursive: true });
      }
      fs.copyFileSync(pdfPath, distPdfPath);
    }

    console.log(`✅ PDF Gerado com Sucesso: ${pdfRelative} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB) -> [docs/ & public/docs/ & dist/docs/]`);
  } catch (err) {
    console.error(`❌ Erro ao gerar PDF para ${relativePath}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

async function main() {
  const isContractOnly = process.argv.includes('--contract');
  const targetFiles = isContractOnly
    ? ['juridico/CONTRATO_DEFINITIVO_DE_COMPRA_E_ADESAO_DE_FRANQUIA_Z8.md']
    : [
        // Documentos Centrais
        'BRAIN_NOTEBOOK.md',
        'GUIA_AUTOMACAO_VEO.md',
        'KEEP_FORNECEDORES_CAPACETES.md',
        // Dossiê Jurídico & Franquias
        'juridico/CIRCULAR_DE_OFERTA_DE_FRANQUIA_COF.md',
        'juridico/CONTRATO_PADRAO_DE_FRANQUIA.md',
        'juridico/CONTRATO_DEFINITIVO_DE_COMPRA_E_ADESAO_DE_FRANQUIA_Z8.md',
        'juridico/TERMO_DE_GARANTIA_NACIONAL_Z8.md',
        'juridico/TERMO_DE_GARANTIA_E_POLITICA_DE_POS_VENDA_ATACADO.md',
        'juridico/POLITICA_NACIONAL_DE_GARANTIA_E_POS_VENDA_Z8.md',
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

  if (isContractOnly) {
    console.log('🚀 Iniciando compilação dedicada do CONTRATO DEFINITIVO DE COMPRA E ADESÃO Z8 (ABNT)...');
  } else {
    console.log('🚀 Iniciando geração de PDFs para todos os documentos corporativos e jurídicos da Z8 E-Motion...');
  }

  for (const file of targetFiles) {
    await convertMarkdownToPdf(file);
  }
  console.log('🎉 Geração de PDF concluída com sucesso!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
