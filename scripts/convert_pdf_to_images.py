import fitz
import os
import sys

rootDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf_path = os.path.join(rootDir, 'docs', 'CATALOGO_OFICIAL_Z8_EMOTION_2026.pdf')
out_dir = os.path.join(rootDir, 'public', 'assets', 'catalogo')
os.makedirs(out_dir, exist_ok=True)

if not os.path.exists(pdf_path):
    print(f"Erro: PDF não encontrado em {pdf_path}")
    sys.exit(1)

doc = fitz.open(pdf_path)
print(f"Total páginas do PDF Z8: {len(doc)}")

page_names = [
    "pagina_01_capa.png",
    "pagina_02_z8_tank_high_speed.png",
    "pagina_03_z8_fx10_sport.png",
    "pagina_04_z8_harley_x21_custom.png",
    "pagina_05_z8_u2_delivery_cargo.png",
    "pagina_06_z8_n95c_max_comfort.png",
    "pagina_07_z8_n7_standard.png",
    "pagina_08_z8_q10_vintage.png",
    "pagina_09_z8_n710_urban_plus.png",
    "pagina_10_z8_q11_compact.png",
    "pagina_11_z8_gs005_base_norte.png",
    "pagina_12_z8_diamond_luxe.png",
    "pagina_13_contracapa.png"
]

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    name = page_names[i] if i < len(page_names) else f"pagina_{i+1:02d}.png"
    out_file = os.path.join(out_dir, name)
    pix.save(out_file)
    print(f"Página {i+1} salva: {name} ({pix.width}x{pix.height})")

print("Renderização completa de todas as páginas!")
