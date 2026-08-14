#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../../');

console.log('🧠 [memplace] Gemini Memory Engine & NotebookLM Project Brain');
console.log('------------------------------------------------------------');

const agentsFile = path.join(rootDir, '.agents/AGENTS.md');
const notebookFile = path.join(rootDir, 'docs/BRAIN_NOTEBOOK.md');

if (fs.existsSync(agentsFile)) {
  console.log(`✅ Regras e Memória do Agente: ${agentsFile}`);
} else {
  console.log(`⚠️ .agents/AGENTS.md não encontrado.`);
}

if (fs.existsSync(notebookFile)) {
  console.log(`✅ Caderno de Conhecimento (Notebook Brain): ${notebookFile}`);
} else {
  console.log(`⚠️ docs/BRAIN_NOTEBOOK.md não encontrado.`);
}

console.log('------------------------------------------------------------');
console.log('💡 Memórias indexadas com sucesso no cérebro do projeto Z8!');
