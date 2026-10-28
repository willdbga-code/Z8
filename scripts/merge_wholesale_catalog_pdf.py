
import fitz
import os

root_dir = r"C:\\Users\\LENOVO\\Desktop\\Z8"
img_dir = os.path.join(root_dir, "public", "assets", "catalogo_atacado")
pdf_docs = os.path.join(root_dir, "docs", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")
pdf_public = os.path.join(root_dir, "public", "docs", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")
pdf_dist = os.path.join(root_dir, "dist", "docs", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")
pdf_atacado = os.path.join(root_dir, "catalogo_atacado_pdf", "TABELA_DE_PRECOS_ATACADO_REVENDEDORES_Z8_2026.pdf")

doc = fitz.open()

img_files = sorted([f for f in os.listdir(img_dir) if f.startswith("pagina_") and f.endswith("_atacado.png")])
print(f"Total de paginas a unificar: {len(img_files)}")

for f in img_files:
    img_path = os.path.join(img_dir, f)
    img_doc = fitz.open(img_path)
    pdf_bytes = img_doc.convert_to_pdf()
    img_pdf = fitz.open("pdf", pdf_bytes)
    doc.insert_pdf(img_pdf)
    print(f"  + Inserida: {f}")

for target in [pdf_docs, pdf_public, pdf_dist, pdf_atacado]:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    try:
        doc.save(target)
        print(f"[OK] PDF gravado em: {target} ({os.path.getsize(target)/1024/1024:.2f} MB)")
    except Exception as e:
        print(f"[AVISO] {target} bloqueado/aberto: {e}")
