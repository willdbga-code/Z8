target_hover = """.helmet-grid-item-img-helmet.z8-card-fit {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  object-fit: cover !important;
  object-position: center center !important;
  transform: scale(1) !important;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.65));
  transition: filter 0.45s ease;
}

.helmet-grid-item-reveal-img.z8-card-fit-cover {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  background-image: none !important;
  transform: scale(1) !important;
  z-index: 1;
  transition: clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.helmet-grid-item-w:hover .helmet-grid-item-reveal-img.z8-card-fit-cover {
  clip-path: ellipse(150% 150% at 50% 0%) !important;
}"""

replacement_hover = """/* === ARCHITECTURAL LAYERED VEHICLE CARD HOVER === */
.helmet-grid-item-img-w {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  border-radius: 7.5px !important;
  z-index: 2 !important;
}

/* 1. Behind: Scenic Atmospheric Background Image */
.helmet-grid-item-reveal-img,
.helmet-grid-item-reveal-img.z8-card-fit-cover {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
  background-image: none !important;
  z-index: 1 !important;
  opacity: 0 !important;
  clip-path: ellipse(0% 0% at 50% 50%) !important;
  transform: scale(1.15) !important;
  transition: clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
  pointer-events: none !important;
}

.helmet-grid-item-w:hover .helmet-grid-item-reveal-img,
.helmet-grid-item-w:hover .helmet-grid-item-reveal-img.z8-card-fit-cover,
[data-helmet-item]:hover .helmet-grid-item-reveal-img {
  opacity: 1 !important;
  clip-path: ellipse(150% 150% at 50% 50%) !important;
  transform: scale(1) !important;
}

/* 2. In Front: Transparent Vehicle Cutout (Always Forefront & Floating) */
.helmet-grid-item-img-helmet-w {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3 !important;
  pointer-events: none !important;
}

.helmet-grid-item-img-helmet,
.helmet-grid-item-img-helmet.z8-card-fit {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  object-fit: contain !important;
  object-position: center center !important;
  transform: scale(1) translateY(0) !important;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.65)) !important;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease !important;
}

.helmet-grid-item-w:hover .helmet-grid-item-img-helmet,
.helmet-grid-item-w:hover .helmet-grid-item-img-helmet.z8-card-fit,
[data-helmet-item]:hover .helmet-grid-item-img-helmet {
  transform: scale(1.08) translateY(-4px) !important;
  filter: drop-shadow(0 18px 32px rgba(0, 240, 255, 0.38)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.85)) !important;
}"""

with open('conceito-2/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

if target_hover in c:
    c = c.replace(target_hover, replacement_hover)
    with open('conceito-2/style.css', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Replaced hover styling in conceito-2/style.css successfully!")
else:
    t_crlf = target_hover.replace('\n', '\r\n')
    r_crlf = replacement_hover.replace('\n', '\r\n')
    if t_crlf in c:
        c = c.replace(t_crlf, r_crlf)
        with open('conceito-2/style.css', 'w', encoding='utf-8') as f:
            f.write(c)
        print("Replaced CRLF hover styling in conceito-2/style.css successfully!")
    else:
        print("Not found in conceito-2/style.css, checking if replacement already present or appending")
