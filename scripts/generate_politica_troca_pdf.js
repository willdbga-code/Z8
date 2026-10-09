import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getBrowserPath() {
  const paths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Nenhum navegador encontrado.');
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Politica de Troca e Garantia - Z8 Emotion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 18mm 15mm 18mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.35pt;
      line-height: 1.46;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      min-height: 265mm;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    h1.main-title {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    h2.sub-title {
      font-size: 11.2pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }

    p.sub-desc {
      font-size: 9.3pt;
      color: #475569;
      margin-bottom: 14px;
    }

    h3.section-title {
      font-size: 9.6pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    p {
      font-size: 9.35pt;
      color: #1e293b;
      margin-bottom: 8px;
      text-align: justify;
    }

    .note-box {
      font-size: 9.35pt;
      margin-bottom: 9px;
    }

    table.warranty-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      margin-bottom: 6px;
      font-size: 8.9pt;
    }

    table.warranty-table th {
      font-weight: 700;
      color: #0f172a;
      text-align: left;
      padding: 5px 6px;
      border-bottom: 1.5px solid #cbd5e1;
      font-size: 8.6pt;
      background: #f8fafc;
    }

    table.warranty-table td {
      padding: 5px 6px;
      vertical-align: middle;
      border-bottom: 1px solid #f1f5f9;
      line-height: 1.35;
    }

    table.warranty-table td.col-item {
      width: 5%;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
    }

    table.warranty-table td.col-desc {
      width: 76%;
    }

    table.warranty-table td.col-time {
      width: 19%;
      white-space: nowrap;
      color: #0f172a;
      font-weight: 500;
      text-align: right;
    }

    .pill-time {
      display: inline-block;
      background: #f1f5f9;
      padding: 2.5px 7px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 600;
      color: #334155;
    }

    .bullet-item {
      margin-bottom: 7px;
      font-size: 9.35pt;
      line-height: 1.45;
      text-align: justify;
    }

    ol.num-list {
      padding-left: 17px;
      margin-bottom: 8px;
    }

    ol.num-list li {
      margin-bottom: 6px;
      font-size: 9.35pt;
      line-height: 1.42;
      text-align: justify;
    }

    .alert-text {
      font-size: 9pt;
      font-style: italic;
      color: #334155;
      margin-top: 8px;
      margin-bottom: 12px;
      text-align: justify;
      background: #f8fafc;
      padding: 7px 11px;
      border-left: 3px solid #64748b;
      border-radius: 0 4px 4px 0;
    }

    .juridico-box {
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      padding: 7px 11px;
      border-radius: 0 4px 4px 0;
      margin-top: 5px;
      margin-bottom: 6px;
      font-size: 8.8pt;
      line-height: 1.4;
      color: #0f172a;
      text-align: justify;
    }

    .sign-section {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      font-size: 8.8pt;
    }

    .sign-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 8px;
    }

    .sign-line {
      border-bottom: 1px solid #94a3b8;
      height: 22px;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: Institucional + Prazos + TABELA COMPLETA (Itens 1 a 11) SEM QUEBRA -->
  <div class="page">
    <h1 class="main-title">Z8 Emotion</h1>
    <h2 class="sub-title">TERMO DE GARANTIA E POLÍTICA DE PÓS-VENDA</h2>
    <p class="sub-desc">Diretrizes para Revendedores e Parceiros Atacadistas</p>

    <h3 class="section-title">1. Introdução e Compromisso com a Qualidade</h3>
    <p>A Z8 Emotion tem como missão fornecer soluções de mobilidade elétrica de alta performance, pautadas pela inovação e durabilidade. Este documento estabelece as diretrizes que regem a relação comercial entre a Z8 Emotion e seus REVENDEDORES no que tange aos processos de garantia, assistência técnica e logística reversa. Nosso compromisso é assegurar que cada produto entregue atenda aos mais rigorosos padrões de segurança e funcionamento, garantindo a satisfação do consumidor final e a sustentabilidade da operação de nossos parceiros.</p>

    <h3 class="section-title">2. Prazos de Garantia</h3>
    <p>Os prazos de garantia aqui estipulados aplicam-se exclusivamente a defeitos de fabricação e componentes originais, contados a partir da data de emissão da Nota Fiscal de venda ao consumidor final pelo REVENDEDOR.</p>

    <p class="note-box">Na nota de <strong>VENDA FINAL AO CONSUMIDOR</strong> deve conter: (Modelo da Bike, Cor e Chassi).</p>

    <table class="warranty-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">Item</th>
          <th style="width: 76%;">Componente e Condições de Cobertura</th>
          <th style="width: 19%; text-align: right;">Prazo de Garantia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-item">1</td>
          <td class="col-desc"><strong>Bateria:</strong> Como a bateria está fora da rede elétrica, não armazena energia e sua capacidade é inferior a 60% (falha no BMS ou indicador luminoso).</td>
          <td class="col-time"><span class="pill-time">6 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">2</td>
          <td class="col-desc"><strong>Motor:</strong> Falha de fase elétrica, queima da bobina, desmagnetização de ímãs e outros problemas congênitos de qualidade.</td>
          <td class="col-time"><span class="pill-time">12 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">3</td>
          <td class="col-desc"><strong>Chicote, Controlador, Carregador:</strong> Falha de componentes eletrônicos / MOSFETs, falha de saída de tensão ou falha de desempenho devido a defeito de fabricação irreparável.</td>
          <td class="col-time"><span class="pill-time">6 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">4</td>
          <td class="col-desc"><strong>Suspensão dianteira/traseira:</strong> Danos naturais, deformação e fratura de usinagem ou vazamento prematuro sem colisão.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">5</td>
          <td class="col-desc"><strong>Cubo dianteiro/traseiro:</strong> Trincas espontâneas de fundição ou defeito estrutural original de fabricação.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">6</td>
          <td class="col-desc"><strong>Alarme, instrumento, alavanca de velocidade:</strong> Falha de desempenho devido a defeito de fabricação e irreparável.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">7</td>
          <td class="col-desc"><strong>Alavanca de freio:</strong> Quebra por fadiga precoce de material ou defeito original de fundição (sem queda).</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">8</td>
          <td class="col-desc"><strong>Faróis, lanternas traseiras, indicadores de direção:</strong> Queima de blocos selados de LED ou vício elétrico interno original.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">9</td>
          <td class="col-desc"><strong>Pisca-pisca:</strong> Falha de desempenho devido a defeito de fabricação e irreparável.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">10</td>
          <td class="col-desc"><strong>Interruptores combinados:</strong> Falha mecânica ou perda de contato elétrico interno dos comandos de guidão.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
        <tr>
          <td class="col-item">11</td>
          <td class="col-desc"><strong>Disjuntor Geral / Interruptor de Proteção (Air Switch):</strong> Falha interna de disparo térmico/magnético ou defeito de montagem.</td>
          <td class="col-time"><span class="pill-time">3 meses</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 2: Seções 3, 4 e 5 -->
  <div class="page">
    <h3 class="section-title" style="margin-top: 0;">3. Obrigações do Revendedor</h3>
    <p>Para a manutenção da garantia e eficiência do pós-venda, o REVENDEDOR compromete-se a cumprir as seguintes obrigações:</p>

    <div class="bullet-item">●&nbsp; <strong>3.1. Montagem Profissional:</strong> Todas as bicicletas entregues em caixa devem ser montadas e revisadas por um técnico capacitado ou oficina especializada. A Z8 Emotion não se responsabiliza por danos decorrentes de montagem inadequada realizada pelo lojista ou pelo consumidor final.</div>
    <div class="bullet-item">●&nbsp; <strong>3.2. Triagem Técnica Inicial:</strong> Antes de acionar a garantia, o REVENDEDOR deve realizar uma análise técnica preliminar para identificar se o problema é de configuração, ajuste mecânico ou vício de fabricação. O acionamento do suporte deve ser acompanhado obrigatoriamente de fotos e vídeos que comprovem a falha.</div>
    <div class="bullet-item">●&nbsp; <strong>3.3. Registro de Venda:</strong> O lojista deve manter arquivada a cópia da Nota Fiscal de venda na qual haverá o número de série ou chassi, para fins de rastreabilidade e validação do prazo de garantia, onde sua garantia se iniciará a partir da Venda para o Consumidor Final.</div>

    <h3 class="section-title">4. Logística Reversa e Procedimento de RMA</h3>
    <p>O processo de retorno de mercadoria ou peças (RMA - Return Merchandise Authorization) seguirá o fluxo abaixo:</p>

    <div class="bullet-item">●&nbsp; <strong>4.1. Prioridade de Reposição Modular Local:</strong> A Z8 Emotion priorizará o envio de componentes para substituição local pelo REVENDEDOR, visando agilidade e redução de custos logísticos, evitando o translado oneroso da bicicleta completa à fábrica (o envio da bicicleta completa só ocorrerá em casos excepcionais autorizados pela nossa equipe técnica). Esclarece-se que esta priorização refere-se à modalidade técnica do reparo local, seguindo a validação e o envio de peças o procedimento oficial de RMA descrito na Seção 6.</div>
    <div class="bullet-item">●&nbsp; <strong>4.2. Custos de Frete:</strong> A Z8 Emotion arcará com os custos de frete (coleta e reenvio) exclusivamente nos casos em que o defeito de fabricação for formalmente confirmado por nosso laboratório técnico.</div>

    <div class="alert-text">
      <strong>Atenção:</strong> Caso seja constatado que o dano foi causado por mau uso, falta de manutenção ou instalação incorreta, todos os custos de frete e reparo serão de responsabilidade integral do REVENDEDOR.
    </div>

    <h3 class="section-title">5. Exclusões de Garantia</h3>
    <p>A garantia será automaticamente invalidada nas seguintes situações:</p>

    <ol class="num-list">
      <li>Danos causados por acidentes, quedas, exposição excessiva a intempéries (oxidação por maresia) ou contato excessivo de água.</li>
      <li>Alteração do Chicote Elétrico: Cortar fios, instalar acessórios (buzinas, faróis extras) ou rastreadores sem usar os conectores originais.</li>
      <li>Uso de carregadores de bateria não originais.</li>
      <li>Manutenção realizada por pessoal não autorizado.</li>
      <li>Alteração de Performance: Modificação das configurações de fábrica no painel (P-settings) para aumentar a velocidade máxima ou torque acima do limite original 32km/h.</li>
      <li>Desgaste natural de componentes decorrente do uso regular (pneus, freios, relação).</li>
      <li>Alteração de peças originais que possam alterar o funcionamento e forçar os componentes levando a um defeito posterior (EX: Pneus de Motocicletas).</li>
    </ol>
  </div>

  <!-- PAGE 3: Seções 6 e 7 + Termo de Ciência -->
  <div class="page">
    <h3 class="section-title" style="margin-top: 0;">6. Solicitação de Peças e Garantia</h3>
    <p>Após identificação de defeito, seja ele dentro do prazo de garantia legal após a emissão de NOTA FISCAL AO CONSUMIDOR FINAL ou no ato da montagem, o revendedor deve contatar o setor de pós-venda indicado pelo seu vendedor e fazer o contato com as seguintes informações:</p>

    <ol class="num-list" style="margin-bottom: 6px;">
      <li><strong>Nota fiscal de Venda</strong> em caso de garantia dentro do prazo legal; A nota deve conter o número de chassi correspondente à bicicleta com defeito.</li>
      <li><strong>Vídeo e fotos explicativas</strong> com o problema identificado, neste ou em outro vídeo deve conter: estado de conservação da bicicleta, vídeo mostrando se a mesma está bloqueada, e o chassi correspondente à nota apresentada.</li>
      <li><strong>Peças avariadas na montagem:</strong> Em caso de peças quebradas, avariadas ou faltantes no momento da montagem, faça vídeos mostrando que a bicicleta não teve saída do estabelecimento. No caso de danos causados por falta de experiência na montagem a garantia não se aplica (Exemplo: Câmaras e pneus estourados por excesso de pressão, conexões de chicotes com pinagem torta ou quebrada, painéis mal instalados com excesso de aperto em suas conexões).</li>
      <li><strong>Validação e Envio de Peças (Fluxo de RMA):</strong> Após a análise preliminar das mídias, será emitido o RMA para envio da peça defeituosa à fábrica para recebimento posterior da peça de substituição. <em>Regra Geral:</em> Não será entregue uma peça nova definitiva sem o envio, recebimento físico e validação pericial do defeito e estado de conservação da mesma. <em>Regime Especial (Urgência):</em> Mediante autorização expressa do Pós-Venda para agilizar o atendimento, a peça nova poderá ser despachada previamente, ficando o REVENDEDOR obrigado a devolver a peça defeituosa no prazo máximo de 15 dias corridos; caso a peça não seja devolvida ou seja constatado dano por mau uso, a peça nova e fretes serão faturados contra o REVENDEDOR.</li>
      <li>As peças de garantia e reposição após abertura de processo de RMA deverão ser enviadas com um formulário de identificação, contendo as informações referente a modelo, chassi e defeito identificada com o nome do revendedor.</li>
      <li>Em caso de falta de sucesso pelos meios disponibilizados o setor responsável pode solicitar o envio da bicicleta ou partes dela para análise e devolução posterior.</li>
      <li><strong>Prazo do Artigo 18 do CDC e Responsabilidade por Mora do Revendedor:</strong> Conforme o Artigo 18 do CDC, o fornecedor tem o prazo máximo de 30 dias para sanar o vício do produto, contados estritamente a partir da entrega física da peça para análise com a documentação completa em nosso laboratório técnico.
        <div class="juridico-box">
          <strong>Parágrafo Único (Mora do Distribuidor/Revendedor):</strong> O REVENDEDOR é o responsável primário direto pelo atendimento ao cliente final. Caso o consumidor final exija devolução de valores, troca do produto ou indenização com base no decurso dos 30 dias do Art. 18 do CDC, e reste comprovado que o atraso ocorreu por inércia, demora no atendimento, omissão na abertura de RMA ou demora no envio da peça física pelo REVENDEDOR à Z8 Emotion, toda a responsabilidade civil, administrativa e financeira (incluindo recompra do bem, multas e indenizações) recairá <strong>única e exclusivamente sobre o REVENDEDOR</strong>, ficando a Z8 Emotion integralmente isenta, com pleno direito de regresso e compensação financeira imediata.
        </div>
      </li>
      <li>Em caso de disponibilidade imediata a peça poderá ser substituída no ato da entrega, salvo necessidade de reabastecimento do fabricante, que poderá se estender a 30 dias.</li>
    </ol>

    <h3 class="section-title">7. Disposições Gerais</h3>
    <p>Este termo entra em vigor na data de sua assinatura e aplica-se a todos os pedidos faturados a partir desta data. Eventuais omissões serão resolvidas em comum acordo entre as partes, priorizando sempre a solução técnica mais eficiente para o cliente final.</p>

    <div class="sign-section">
      <p style="font-weight: 600; margin-bottom: 5px;">Termo de Ciência e Concordância do Revendedor / Distribuidor</p>
      <div class="sign-grid">
        <div>
          <p style="font-size: 8.4pt; color: #475569; margin-bottom: 2px;">Razão Social / Nome Fantasia:</p>
          <div class="sign-line"></div>
        </div>
        <div>
          <p style="font-size: 8.4pt; color: #475569; margin-bottom: 2px;">CNPJ / CPF:</p>
          <div class="sign-line"></div>
        </div>
        <div>
          <p style="font-size: 8.4pt; color: #475569; margin-bottom: 2px;">Assinatura do Responsável Legal:</p>
          <div class="sign-line"></div>
        </div>
        <div>
          <p style="font-size: 8.4pt; color: #475569; margin-bottom: 2px;">Data de Assinatura: _____ / _____ / 2026</p>
          <div class="sign-line"></div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;

async function generate() {
  const tempHtmlPath = path.resolve(rootDir, 'temp_politica_troca.html');
  fs.writeFileSync(tempHtmlPath, HTML_CONTENT, 'utf8');

  const browserPath = getBrowserPath();
  const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, '/')}`;

  // 1. Gera sempre primeiro em arquivo temporário livre de bloqueios
  const masterPdf = path.resolve(rootDir, 'docs', 'temp_master_politica.pdf');
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${masterPdf}" "${fileUrl}"`;

  try {
    console.log('Compilando Master PDF (Layout de 3 Páginas com Suspensão)...');
    execSync(cmd, { stdio: 'ignore' });

    // 2. Destinos oficiais
    const targets = [
      path.resolve(rootDir, 'docs', 'Politica de Troca e Garantia - Z8 Emotion (Atualizado).pdf'),
      path.resolve(rootDir, 'docs', 'POLITICA_DE_TROCA_E_GARANTIA_Z8_EMOTION.pdf'),
      path.resolve(rootDir, 'public', 'docs', 'Politica de Troca e Garantia - Z8 Emotion.pdf'),
      path.resolve(rootDir, 'public', 'docs', 'POLITICA_DE_TROCA_E_GARANTIA_Z8_EMOTION.pdf'),
      path.resolve(rootDir, 'dist', 'docs', 'Politica de Troca e Garantia - Z8 Emotion.pdf'),
      path.resolve(rootDir, 'dist', 'docs', 'POLITICA_DE_TROCA_E_GARANTIA_Z8_EMOTION.pdf'),
      path.resolve(rootDir, 'docs', 'Politica de Troca e Garantia - Z8 Emotion.pdf')
    ];

    for (const target of targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      try {
        fs.copyFileSync(masterPdf, target);
        console.log(`✅ Atualizado com sucesso: ${path.basename(target)} em ${path.dirname(target)}`);
      } catch (err) {
        console.warn(`⚠️ Aviso: ${path.basename(target)} está bloqueado por outro aplicativo (Acrobat). Salvo na versão alternativa.`);
      }
    }
  } finally {
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    if (fs.existsSync(masterPdf)) fs.unlinkSync(masterPdf);
  }
}

generate().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
