// ==========================================================================
// Z8 E-Motion - Automated Cybersecurity & Cryptographic Hardening Test Suite
// Validates HMAC-SHA256 tokens, timing-safe auth, PBKDF2 hashing, and API guards
// ==========================================================================

import assert from 'node:assert';
import crypto from 'node:crypto';
import {
  MASTER_ADMIN_EMAIL,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  generateSecureAdminToken,
  verifySecureToken,
  validateAdminAuth,
  checkRateLimit,
  resetRateLimit
} from '../api/security-utils.js';
import usersHandler from '../api/users.js';

console.log('🔒 INICIANDO BATERIA DE TESTES DE CIBERSEGURANÇA Z8 E-MOTION...\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Erro: ${err.message}\n`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Erro: ${err.message}\n`);
  }
}

// --------------------------------------------------------------------------
// 1. TESTES DE GERAÇÃO E VERIFICAÇÃO DE TOKENS HMAC-SHA256
// --------------------------------------------------------------------------
console.log('--- 1. Criptografia de Tokens HMAC-SHA256 ---');

runTest('Deve gerar token assinado no formato z8s.<payload>.<signature>', () => {
  const token = generateSecureToken({ sub: 'user@test.com' }, 'partner');
  assert.ok(typeof token === 'string');
  const parts = token.split('.');
  assert.strictEqual(parts.length, 3);
  assert.strictEqual(parts[0], 'z8s');
  assert.ok(parts[1].length > 10);
  assert.strictEqual(parts[2].length, 64); // SHA-256 hex é 64 chars
});

runTest('Deve validar com sucesso um token legítimo de administrador', () => {
  const adminToken = generateSecureAdminToken('christian.tkh@gmail.com');
  const res = verifySecureToken(adminToken);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.payload.role, 'admin');
  assert.strictEqual(res.payload.sub, 'christian.tkh@gmail.com');
});

runTest('Deve rejeitar token com assinatura forjada/adulterada', () => {
  const legitToken = generateSecureToken({ sub: 'attacker@evil.com' }, 'partner');
  const parts = legitToken.split('.');
  // Adultera o payload
  const tamperedPayload = Buffer.from(JSON.stringify({ sub: 'admin@z8.com', role: 'admin' })).toString('base64url');
  const forgedToken = `z8s.${tamperedPayload}.${parts[2]}`;

  const res = verifySecureToken(forgedToken);
  assert.strictEqual(res.valid, false);
  assert.match(res.error, /Assinatura criptográfica/i);
});

runTest('Deve rejeitar token expirado', () => {
  // Gera token com validade negativa (-10 segundos)
  const expiredToken = generateSecureToken({ sub: 'expired@z8.com' }, 'partner', -10);
  const res = verifySecureToken(expiredToken);
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.expired, true);
  assert.match(res.error, /expirado/i);
});

runTest('Deve rejeitar strings arbitrárias e tokens malformados', () => {
  assert.strictEqual(verifySecureToken('').valid, false);
  assert.strictEqual(verifySecureToken('token_master_12345').valid, false);
  assert.strictEqual(verifySecureToken('z8s.invalid').valid, false);
  assert.strictEqual(verifySecureToken('Bearer xyz').valid, false);
});

// --------------------------------------------------------------------------
// 2. TESTES DE AUTORIZAÇÃO DE ADMIN (validateAdminAuth)
// --------------------------------------------------------------------------
console.log('\n--- 2. Blindagem de Autenticação Administrativa (/api) ---');

runTest('Vulnerabilidade eliminada: Deve REJEITAR token que apenas começa com token_master_', () => {
  const fakeReq = {
    headers: {
      authorization: 'Bearer token_master_1787674451313_fake'
    }
  };
  const isAuthorized = validateAdminAuth(fakeReq);
  assert.strictEqual(isAuthorized, false, 'Brecha token_master_ arbitrária não deve ser aceita!');
});

runTest('Vulnerabilidade eliminada: Deve REJEITAR token que apenas começa com token_admin_', () => {
  const fakeReq = {
    headers: {
      authorization: 'Bearer token_admin_forged_bypass'
    }
  };
  const isAuthorized = validateAdminAuth(fakeReq);
  assert.strictEqual(isAuthorized, false, 'Brecha token_admin_ arbitrária não deve ser aceita!');
});

runTest('Deve aceitar token assinado de administrador legítimo', () => {
  const adminToken = generateSecureAdminToken('christian.tkh@gmail.com');
  const req = {
    headers: {
      authorization: `Bearer ${adminToken}`
    }
  };
  const isAuthorized = validateAdminAuth(req);
  assert.strictEqual(isAuthorized, true);
});

runTest('Deve REJEITAR token de parceiro comum tentando executar funções de admin', () => {
  const partnerToken = generateSecureToken({ sub: 'lojista@loja.com' }, 'partner');
  const req = {
    headers: {
      authorization: `Bearer ${partnerToken}`
    }
  };
  const isAuthorized = validateAdminAuth(req);
  assert.strictEqual(isAuthorized, false, 'Parceiro comum não pode receber autorização admin');
});

// --------------------------------------------------------------------------
// 3. TESTES DE HASHING PBKDF2 & SEGURANÇA DE SENHA
// --------------------------------------------------------------------------
console.log('\n--- 3. Hashing PBKDF2 & Comparação em Tempo Constante ---');

runTest('Hash de senha deve ser gerado no padrão PBKDF2 SHA-512', () => {
  const hash = hashPassword('@Z8SecurityTest2026!');
  assert.ok(hash.startsWith('pbkdf2$sha512$100000$'));
  const parts = hash.split('$');
  assert.strictEqual(parts.length, 5);
});

runTest('Verificação de senha correta deve retornar valid=true', () => {
  const rawPass = 'MinhaSenhaForte#2026';
  const hash = hashPassword(rawPass);
  const result = verifyPassword(rawPass, hash);
  assert.strictEqual(result.valid, true);
});

runTest('Verificação de senha incorreta deve retornar valid=false', () => {
  const hash = hashPassword('SenhaCorreta#123');
  const result = verifyPassword('SenhaIncorreta#123', hash);
  assert.strictEqual(result.valid, false);
});

// --------------------------------------------------------------------------
// 4. TESTE DE INTEGRAÇÃO DO ENDPOINT /api/users
// --------------------------------------------------------------------------
console.log('\n--- 4. Integração do Endpoint Serverless (/api/users) ---');

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    end() { return this; }
  };
}

await runAsyncTest('Login do Master Admin deve retornar token HMAC assinado', async () => {
  const req = {
    method: 'POST',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      action: 'login',
      email: 'christian.tkh@gmail.com',
      password: '@12345678@'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token, 'Token deve estar presente');
  assert.ok(res.body.token.startsWith('z8s.'), 'Token deve ter prefixo de assinatura segura z8s.');
  
  // Valida token retornado pelo login
  const tokenCheck = verifySecureToken(res.body.token);
  assert.strictEqual(tokenCheck.valid, true);
  assert.strictEqual(tokenCheck.payload.role, 'admin');
});

await runAsyncTest('Login com senha incorreta deve retornar 401 Unauthorized', async () => {
  const req = {
    method: 'POST',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      action: 'login',
      email: 'christian.tkh@gmail.com',
      password: 'senha_completamente_errada'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.token, undefined);
});

await runAsyncTest('PUT para alteração de lojista deve REJEITAR token forjado (401)', async () => {
  const req = {
    method: 'PUT',
    headers: {
      origin: 'https://z8emotion.com',
      authorization: 'Bearer token_master_attacker_forgery'
    },
    body: {
      email: 'willdbga@gmail.com',
      status: 'approved'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.success, false);
});

await runAsyncTest('PUT para alteração de lojista deve ACEITAR token HMAC assinado de admin', async () => {
  const adminToken = generateSecureAdminToken('christian.tkh@gmail.com');
  const req = {
    method: 'PUT',
    headers: {
      origin: 'https://z8emotion.com',
      authorization: `Bearer ${adminToken}`
    },
    body: {
      email: 'willdbga@gmail.com',
      status: 'approved'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
});

await runAsyncTest('Login com usuário "admin" deve normalizar para Master Admin e emitir token HMAC', async () => {
  const req = {
    method: 'POST',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      action: 'login',
      email: 'admin',
      password: '@12345678@'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token.startsWith('z8s.'));
  const check = verifySecureToken(res.body.token);
  assert.strictEqual(check.valid, true);
  assert.strictEqual(check.payload.role, 'admin');
  assert.strictEqual(check.payload.sub, MASTER_ADMIN_EMAIL.toLowerCase());
});

await runAsyncTest('Cadastro de novo parceiro deve emitir token HMAC assinado', async () => {
  const testEmail = `novo_parceiro_${Date.now()}@loja.com.br`;
  const req = {
    method: 'POST',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      name: 'Lojista Teste',
      company: 'Teste E-Motors',
      city: 'Campinas - SP',
      email: testEmail,
      phone: '(19) 99887-7665',
      password: 'SenhaSegura@2026'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token, 'Deve retornar token assinado');
  assert.ok(res.body.token.startsWith('z8s.'));
  const check = verifySecureToken(res.body.token);
  assert.strictEqual(check.valid, true);
  assert.strictEqual(check.payload.role, 'partner');
  assert.strictEqual(check.payload.sub, testEmail);
});

await runAsyncTest('Login/Sync via Google OAuth (action: google_auth) deve emitir token HMAC assinado', async () => {
  const googleEmail = `google_user_${Date.now()}@gmail.com`;
  const req = {
    method: 'POST',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      action: 'google_auth',
      email: googleEmail,
      name: 'Google Partner',
      photoUrl: 'https://lh3.googleusercontent.com/a/test'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token.startsWith('z8s.'));
  const check = verifySecureToken(res.body.token);
  assert.strictEqual(check.valid, true);
  assert.strictEqual(check.payload.role, 'partner');
  assert.strictEqual(check.payload.sub, googleEmail);
});

await runAsyncTest('PATCH de senha sem telefone e sem token admin deve ser REJEITADO (403)', async () => {
  const req = {
    method: 'PATCH',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      email: 'willdbga@gmail.com',
      password: 'nova_senha_tentativa_hacker'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.body.success, false);
  assert.ok(res.body.error.includes('Verificação de segurança falhou'));
});

await runAsyncTest('PATCH de senha com telefone incorreto deve ser REJEITADO (403)', async () => {
  const req = {
    method: 'PATCH',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      email: 'willdbga@gmail.com',
      phone: '11999990000', // Telefone falso que não termina em 0316
      password: 'nova_senha_tentativa'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.body.success, false);
});

await runAsyncTest('PATCH de senha com telefone correto (últimos 4 dígitos) deve ser ACEITO (200)', async () => {
  const req = {
    method: 'PATCH',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      email: 'willdbga@gmail.com',
      phone: '12988130316', // Telefone de William termina em 0316
      password: 'nova_senha_legitima_2026'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, 'Senha atualizada com sucesso!');
});

await runAsyncTest('PATCH de senha do Master Admin via endpoint público deve ser REJEITADO (403)', async () => {
  const req = {
    method: 'PATCH',
    headers: { origin: 'https://z8emotion.com' },
    body: {
      email: 'christian.tkh@gmail.com',
      phone: '12998008818',
      password: 'nova_senha_master_proibida'
    }
  };
  const res = createMockRes();
  await usersHandler(req, res);

  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.body.success, false);
  assert.ok(res.body.error.includes('A senha master não pode ser alterada'));
});

console.log(`\n======================================================`);
console.log(`RESULTADO: ${passedTests}/${totalTests} testes passaram com sucesso!`);
if (passedTests === totalTests) {
  console.log('🛡️ TODAS AS DEFESAS DE CIBERSEGURANÇA FORAM VALIDADAS COM SUCESSO!');
} else {
  console.error('⚠️ ALGUNS TESTES FALHARAM. REVISAR IMPLEMENTAÇÃO.');
  process.exit(1);
}
