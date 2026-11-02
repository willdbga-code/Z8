import os, sys

def clean_portal_laf():
    filepath = 'site-principal/portal-lojista-laf.js'
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read().replace('\r\n', '\n')

    replacements = [
        # Top bar status identity
        ("TABELA DE ATACADO B2B ATIVA // LOTE MÍNIMO 10 MOTOS",
         "TABELA OFICIAL DE ATACADO B2B ABERTA // LOTE MÍNIMO 10 MOTOS (MIX LIVRE)"),

        # Top buttons
        ("<span>📥 BAIXAR CATÁLOGO LAF (PDF 27 PÁGS)</span>",
         '<span><i class="fa-solid fa-download" style="margin-right:6px;"></i>BAIXAR CATÁLOGO LAF (PDF 27 PÁGS)</span>'),

        ("<span>🛒 MESA DE PEDIDOS (<strong id=\"laf-top-cart-count\">10</strong> MOTOS)</span>",
         '<span><i class="fa-solid fa-cart-shopping" style="margin-right:6px;"></i>MESA DE PEDIDOS (<strong id="laf-top-cart-count">10</strong> MOTOS)</span>'),

        ("<span>⚡ PAINEL ADMIN MASTER</span>",
         '<span><i class="fa-solid fa-crown" style="margin-right:6px;"></i>PAINEL ADMIN MASTER</span>'),

        ("<span id=\"laf-auth-action-label\">${user ? '👤 CONTA PARCEIRO / SAIR' : '🔐 LOGIN CREDENCIADO'}</span>",
         '<span id="laf-auth-action-label">${user ? \'<i class="fa-solid fa-user-check" style="margin-right:6px;"></i>CONTA PARCEIRO / SAIR\' : \'<i class="fa-solid fa-key" style="margin-right:6px;"></i>LOGIN CREDENCIADO\'}</span>'),

        ("authBtnLabel.textContent = user ? '👤 CONTA PARCEIRO / SAIR' : '🔐 LOGIN CREDENCIADO';",
         'authBtnLabel.innerHTML = user ? \'<i class="fa-solid fa-user-check" style="margin-right:6px;"></i>CONTA PARCEIRO / SAIR\' : \'<i class="fa-solid fa-key" style="margin-right:6px;"></i>LOGIN CREDENCIADO\';'),

        # Spec header bolt
        ("<span>⚡ VOLTAGEM &amp; BATERIA DE SÉRIE:</span>",
         '<span><i class="fa-solid fa-bolt" style="color:#00F0FF; margin-right:4px;"></i> VOLTAGEM &amp; BATERIA DE SÉRIE:</span>'),

        # Container & MOQ checks
        ("? '✓ Capacidade de Contêiner 40HQ Atingida'",
         "? 'Capacidade de Contêiner 40HQ Atingida'"),

        ("? '✓ Lote Mínimo Nacional Atingido (≥ 10 un.)'",
         "? 'Lote Mínimo Nacional Atingido (≥ 10 un.)'"),

        ('<small id="laf-sum-moq-status" class="is-valid">✓ Lote Mínimo Atingido (≥ 10 un.)</small>',
         '<small id="laf-sum-moq-status" class="is-valid"><i class="fa-solid fa-circle-check" style="color:#10B981; margin-right:4px;"></i>Lote Mínimo Atingido (≥ 10 un.)</small>'),

        # Battery checkmarks
        ("<span>✓ BMS Inteligente Anti-Curto</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>BMS Inteligente Anti-Curto</span>'),

        ("<span>✓ Pack Removível Leve (7 a 9 kg)</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Pack Removível Leve (7 a 9 kg)</span>'),

        ("<span>✓ Recarga 4 a 6h Bivolt</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Recarga 4 a 6h Bivolt</span>'),

        ("<span>✓ 48V / 60V / 72V</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>48V / 60V / 72V</span>'),

        ("<span>✓ Zero Efeito Memória</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Zero Efeito Memória</span>'),

        ("<span>✓ Garantia Nacional por Chassi</span>",
         '<span><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>Garantia Nacional por Chassi</span>'),

        # Mix preset buttons
        ("🇧🇷 LOTE MÍNIMO NACIONAL (MÍN. 10 MOTOS — SJC)",
         '<i class="fa-solid fa-warehouse" style="margin-right:6px;"></i>LOTE MÍNIMO NACIONAL (MÍN. 10 MOTOS — SJC)'),

        ("🚢 IMPORTAÇÃO CONTÊINER FECHADO 40HQ (85 A 294 UN.)",
         '<i class="fa-solid fa-ship" style="margin-right:6px;"></i>IMPORTAÇÃO CONTÊINER FECHADO 40HQ (85 A 294 UN.)'),

        ("⚡ Mix Campeão de Giro (10 Motos — R$ 58.600)",
         '<i class="fa-solid fa-bolt" style="color:#00F0FF; margin-right:6px;"></i>Mix Campeão de Giro (10 Motos — R$ 58.600)'),

        ("🔥 Mix Performance &amp; Executiva (10 Motos — R$ 65.400)",
         '<i class="fa-solid fa-fire" style="color:#EA580C; margin-right:6px;"></i>Mix Performance &amp; Executiva (10 Motos — R$ 65.400)'),

        ("💎 Mix Alto Giro Urbano &amp; E-Bikes (15 Motos — R$ 71.100)",
         '<i class="fa-solid fa-gem" style="color:#00F0FF; margin-right:6px;"></i>Mix Alto Giro Urbano &amp; E-Bikes (15 Motos — R$ 71.100)'),

        ("🚢 Contêiner 40HQ Mix Foshan (112 Motos)",
         '<i class="fa-solid fa-boxes-stacked" style="color:#10B981; margin-right:6px;"></i>Contêiner 40HQ Mix Foshan (112 Motos)'),

        ("✕ Zerar Quantidades",
         '<i class="fa-solid fa-trash-can" style="margin-right:6px;"></i>Zerar Quantidades'),

        # Print / History buttons
        ("<span>⎙ GERAR ESPELHO DE PEDIDO (PDF / IMPRESSÃO)</span>",
         '<span><i class="fa-solid fa-print" style="margin-right:6px;"></i>GERAR ESPELHO DE PEDIDO (PDF / IMPRESSÃO)</span>'),

        ("<span>📋 HISTÓRICO DE PEDIDOS REGISTRADOS NESTA SESSÃO / CONTA</span>",
         '<span><i class="fa-solid fa-clock-rotate-left" style="margin-right:6px;"></i>HISTÓRICO DE PEDIDOS REGISTRADOS NESTA SESSÃO / CONTA</span>'),

        # Lightbox buttons
        ('<button type="button" onclick="window.stepLafLightbox(-1)">◀ ANTERIOR</button>',
         '<button type="button" onclick="window.stepLafLightbox(-1)"><i class="fa-solid fa-chevron-left" style="margin-right:4px;"></i> ANTERIOR</button>'),

        ('<button type="button" onclick="window.stepLafLightbox(1)">PRÓXIMA ▶</button>',
         '<button type="button" onclick="window.stepLafLightbox(1)">PRÓXIMA <i class="fa-solid fa-chevron-right" style="margin-left:4px;"></i></button>'),

        ('<button type="button" class="is-close" onclick="window.closeLafSlideModal()">FECHAR [ESC] ✕</button>',
         '<button type="button" class="is-close" onclick="window.closeLafSlideModal()">FECHAR [ESC] <i class="fa-solid fa-xmark" style="margin-left:4px;"></i></button>'),

        ("submitBtn.innerHTML = '<span>✓ PEDIDO REGISTRADO! ENVIAR NOVO PEDIDO ↱</span>';",
         'submitBtn.innerHTML = \'<span><i class="fa-solid fa-check" style="margin-right:6px;"></i>PEDIDO REGISTRADO! ENVIAR NOVO PEDIDO ↱</span>\';')
    ]

    count = 0
    for orig, repl in replacements:
        if orig in code:
            code = code.replace(orig, repl)
            count += 1
        else:
            print(f"NOT FOUND: {orig[:40]}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"Successfully replaced {count}/{len(replacements)} patterns in {filepath}!")

if __name__ == '__main__':
    clean_portal_laf()
