const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'z8-wms', 'app.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the orphan } after openMobileConnectModal
const badMiddleCRLF = "    modal.classList.add('active');\r\n  }\r\n}\r\n\r\n  // ================= BATCH BAR UPDATE =================";
const goodMiddleCRLF = "    modal.classList.add('active');\r\n  }\r\n\r\n  // ================= BATCH BAR UPDATE =================";

const badMiddleLF = "    modal.classList.add('active');\n  }\n}\n\n  // ================= BATCH BAR UPDATE =================";
const goodMiddleLF = "    modal.classList.add('active');\n  }\n\n  // ================= BATCH BAR UPDATE =================";

if (content.includes(badMiddleCRLF)) {
  content = content.replace(badMiddleCRLF, goodMiddleCRLF);
  console.log('Fixed middle orphan brace (CRLF)');
} else if (content.includes(badMiddleLF)) {
  content = content.replace(badMiddleLF, goodMiddleLF);
  console.log('Fixed middle orphan brace (LF)');
} else {
  console.error('Could not find bad middle string!');
}

// Replace the bad ending
const badEndCRLF = "  handlePrintCustomsManifest() {\r\n    window.print();\r\n  }\r\n\r\n}\r\n\r\n);";
const goodEndCRLF = "  handlePrintCustomsManifest() {\r\n    window.print();\r\n  }\r\n}\r\n\r\n// Instantiate and initialize\r\nconst app = new Z8WmsApp();\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  app.init();\r\n});";

const badEndLF = "  handlePrintCustomsManifest() {\n    window.print();\n  }\n\n}\n\n);";
const goodEndLF = "  handlePrintCustomsManifest() {\n    window.print();\n  }\n}\n\n// Instantiate and initialize\nconst app = new Z8WmsApp();\ndocument.addEventListener('DOMContentLoaded', () => {\n  app.init();\n});";

if (content.includes(badEndCRLF)) {
  content = content.replace(badEndCRLF, goodEndCRLF);
  console.log('Fixed end structure (CRLF)');
} else if (content.includes(badEndLF)) {
  content = content.replace(badEndLF, goodEndLF);
  console.log('Fixed end structure (LF)');
} else {
  console.error('Could not find bad end string!');
}

fs.writeFileSync(filePath, content, 'utf-8');
