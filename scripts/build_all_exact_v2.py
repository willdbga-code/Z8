import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

logo_raw = Image.open('public/assets/logos/ztrasparente.png').convert('RGBA')
logo_tight = logo_raw.crop(logo_raw.getbbox())

font_header = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 24)
font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 66)
font_title_city = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 62)
font_stat_val = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 44)
font_stat_lbl = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 19)
font_micro = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 16)
font_cta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 26)

# 1. TAUBATÉ - SP (Z8 FX-10 Sport)
print('Rendering Taubate...')
base_taubate = Image.open(r'C:\Users\LENOVO\.gemini\antigravity\brain\1450fe3c-76c2-4b1e-90de-e962764fce8d\z8_taubate_safezone_1789605174921.jpg').resize((1080, 1920), Image.Resampling.LANCZOS).convert('RGBA')

# Clean old pill
sky_crop = base_taubate.crop((0, 160, 1080, 270))
base_taubate.paste(sky_crop, (0, 270))

draw = ImageDraw.Draw(base_taubate)

# Square Top Header Box
header_w = 780
header_h = 56
header_x = (1080 - header_w) // 2
header_y = 290
draw.rectangle([header_x, header_y, header_x + header_w, header_y + header_h], 
               fill=(10, 14, 20, 245), outline=(0, 0, 0, 255), width=2)
header_text = 'FRANQUIA Z8 E-MOTION // SEJA UM FRANQUEADO'
bb = draw.textbbox((0, 0), header_text, font=font_header)
draw.text((header_x + (header_w - (bb[2]-bb[0]))//2, header_y + (header_h - (bb[3]-bb[1]))//2 - 2), 
          header_text, font=font_header, fill=(255, 255, 255))

# Composite Official Z8 Metallic Logo on Motorcycle Fairing
target_w = 170
target_h = int(logo_tight.height * (target_w / logo_tight.width))
logo_resized = logo_tight.resize((target_w, target_h), Image.Resampling.LANCZOS)
logo_rotated = logo_resized.rotate(4, resample=Image.Resampling.BICUBIC, expand=True)

logo_alpha = logo_rotated.split()[3]
shadow_alpha = logo_alpha.point(lambda p: int(p * 0.7))
shadow = Image.new('RGBA', logo_rotated.size, (0, 0, 0, 0))
shadow.paste((0, 0, 0, 200), (0, 0), shadow_alpha)
shadow = shadow.filter(ImageFilter.GaussianBlur(3))

pos_x, pos_y = 230, 980
base_taubate.paste(shadow, (pos_x + 3, pos_y + 4), shadow)
base_taubate.paste(logo_rotated, (pos_x, pos_y), logo_rotated)

# Update Cell 1 to 100% DE EXCLUSIVIDADE
cell_bg = (210, 211, 206)
draw.rectangle([83, 1450, 388, 1550], fill=cell_bg)
val_text = '100%'
lbl_text = 'DE EXCLUSIVIDADE'
cell_w = 388 - 83
bb_val = draw.textbbox((0, 0), val_text, font=font_stat_val)
draw.text((83 + (cell_w - (bb_val[2]-bb_val[0]))//2, 1460), val_text, font=font_stat_val, fill=(0, 0, 0))
bb_lbl = draw.textbbox((0, 0), lbl_text, font=font_stat_lbl)
draw.text((83 + (cell_w - (bb_lbl[2]-bb_lbl[0]))//2, 1515), lbl_text, font=font_stat_lbl, fill=(0, 0, 0))

for p in ['public/assets/stories_franquias/story_bauhaus_taubate_fx10.jpg',
          'public/assets/instagram_artes/story_bauhaus_taubate_fx10.jpg',
          'site-principal/public/designer/story_bauhaus_taubate_fx10.jpg']:
    base_taubate.convert('RGB').save(p, quality=96)
print('Taubate rendered successfully!')

# Other cities helper
def render_city_v2(base_path, city_line, stat1_val, stat1_lbl, stat2_val, stat2_lbl, stat3_val, stat3_lbl, subhead, cta, logo_pos, logo_w, logo_rot, out_filename):
    print(f'Rendering {out_filename}...')
    canvas = Image.open(base_path).resize((1080, 1920), Image.Resampling.LANCZOS).convert('RGBA')
    draw = ImageDraw.Draw(canvas)

    # 1. Clean top header completely: Y=240 to Y=350
    sky_crop = canvas.crop((0, 130, 1080, 240))
    canvas.paste(sky_crop, (0, 240))

    # 2. Square Top Header Box
    header_w = 780
    header_h = 56
    header_x = (1080 - header_w) // 2
    header_y = 280
    draw.rectangle([header_x, header_y, header_x + header_w, header_y + header_h], 
                   fill=(10, 14, 20, 245), outline=(255, 255, 255, 220), width=2)
    header_text = 'FRANQUIA Z8 E-MOTION // SEJA UM FRANQUEADO'
    bb = draw.textbbox((0, 0), header_text, font=font_header)
    draw.text((header_x + (header_w - (bb[2]-bb[0]))//2, header_y + (header_h - (bb[3]-bb[1]))//2 - 2), 
              header_text, font=font_header, fill=(255, 255, 255))

    # 3. Clean headline area Y=350 to Y=510 with sky/background and redraw
    head_crop = canvas.crop((0, 140, 1080, 300))
    canvas.paste(head_crop, (0, 350))
    line1 = 'CONCESSÃO EXCLUSIVA:'
    line2 = city_line
    bb1 = draw.textbbox((0, 0), line1, font=font_title)
    draw.text(((1080 - (bb1[2]-bb1[0]))//2, 355), line1, font=font_title, fill=(255, 255, 255))
    bb2 = draw.textbbox((0, 0), line2, font=font_title_city)
    draw.text(((1080 - (bb2[2]-bb2[0]))//2, 430), line2, font=font_title_city, fill=(255, 255, 255))

    # 4. Composite Official Z8 Metallic Logo on Motorcycle
    target_w = logo_w
    target_h = int(logo_tight.height * (target_w / logo_tight.width))
    logo_resized = logo_tight.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if logo_rot != 0:
        logo_resized = logo_resized.rotate(logo_rot, resample=Image.Resampling.BICUBIC, expand=True)

    logo_alpha = logo_resized.split()[3]
    shadow_alpha = logo_alpha.point(lambda p: int(p * 0.7))
    shadow = Image.new('RGBA', logo_resized.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 200), (0, 0), shadow_alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(3))

    canvas.paste(shadow, (logo_pos[0] + 3, logo_pos[1] + 4), shadow)
    canvas.paste(logo_resized, logo_pos, logo_resized)

    # 5. Clean bottom road: clone road asphalt from Y=1720-1880 to Y=1370-1720
    road_sample = canvas.crop((0, 1720, 1080, 1880)).resize((1080, 350))
    canvas.paste(road_sample, (0, 1370))

    # 6. Draw Square Unified Grid (ending strictly above Y=1590, leaving 330px safe zone)
    grid_w = 940
    grid_h = 188
    grid_x = (1080 - grid_w) // 2
    grid_y = 1400
    row1_h = 112
    col_w = grid_w // 3

    # Outer rectangle: sharp 90-degree corners, zero border-radius
    draw.rectangle([grid_x, grid_y, grid_x + grid_w, grid_y + grid_h], 
                   fill=(10, 13, 18, 240), outline=(255, 255, 255, 190), width=2)

    # Column dividers
    draw.line([(grid_x + col_w, grid_y), (grid_x + col_w, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)
    draw.line([(grid_x + col_w * 2, grid_y), (grid_x + col_w * 2, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)
    # Horizontal divider
    draw.line([(grid_x, grid_y + row1_h), (grid_x + grid_w, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)

    # Col 1: 100% / DE EXCLUSIVIDADE
    bb = draw.textbbox((0, 0), stat1_val, font=font_stat_val)
    draw.text((grid_x + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), stat1_val, font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), stat1_lbl, font=font_stat_lbl)
    draw.text((grid_x + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), stat1_lbl, font=font_stat_lbl, fill=(200, 210, 220))

    # Col 2: MARKUP / MARGEM
    bb = draw.textbbox((0, 0), stat2_val, font=font_stat_val)
    draw.text((grid_x + col_w + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), stat2_val, font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), stat2_lbl, font=font_stat_lbl)
    draw.text((grid_x + col_w + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), stat2_lbl, font=font_stat_lbl, fill=(200, 210, 220))

    # Col 3: CONTRAN / 996
    bb = draw.textbbox((0, 0), stat3_val, font=font_stat_val)
    draw.text((grid_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), stat3_val, font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), stat3_lbl, font=font_stat_lbl)
    draw.text((grid_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), stat3_lbl, font=font_stat_lbl, fill=(200, 210, 220))

    # Row 2: Call to action inside grid
    cta_y = grid_y + row1_h
    bb = draw.textbbox((0, 0), subhead, font=font_micro)
    draw.text((grid_x + (grid_w - (bb[2]-bb[0]))//2, cta_y + 9), subhead, font=font_micro, fill=(180, 195, 210))

    bb = draw.textbbox((0, 0), cta, font=font_cta)
    draw.text((grid_x + (grid_w - (bb[2]-bb[0]))//2, cta_y + 35), cta, font=font_cta, fill=(255, 255, 255))

    # Save to all 3 paths
    for p in [f'public/assets/stories_franquias/{out_filename}',
              f'public/assets/instagram_artes/{out_filename}',
              f'site-principal/public/designer/{out_filename}']:
        canvas.convert('RGB').save(p, quality=96)
    print(f'Successfully rendered {out_filename}')

# 2. CARAGUATATUBA
render_city_v2(
    base_path='public/assets/stories_franquias/story_bauhaus_caraguatatuba_n95c.jpg',
    city_line='CARAGUATATUBA - SP',
    stat1_val='100%', stat1_lbl='DE EXCLUSIVIDADE',
    stat2_val='ATÉ 54%', stat2_lbl='MARKUP BRUTO',
    stat3_val='CONTRAN', stat3_lbl='996 (SEM CNH)',
    subhead='CAPITAL DO LITORAL NORTE • TERRITÓRIO MUNICIPAL EXCLUSIVO',
    cta='AGENDAR REUNIÃO // RESERVAR CARAGUÁ',
    logo_pos=(340, 770), logo_w=100, logo_rot=0,
    out_filename='story_bauhaus_caraguatatuba_n95c.jpg'
)

# 3. PINDA
render_city_v2(
    base_path='public/assets/stories_franquias/story_bauhaus_pinda_tank.jpg',
    city_line='PINDAMONHANGABA - SP',
    stat1_val='100%', stat1_lbl='DE EXCLUSIVIDADE',
    stat2_val='ATÉ 53%', stat2_lbl='MARGEM BRUTA',
    stat3_val='CONTRAN', stat3_lbl='996 (SEM CNH)',
    subhead='POLO INDUSTRIAL • TERRITÓRIO MUNICIPAL EXCLUSIVO',
    cta='AGENDAR REUNIÃO // RESERVAR PINDA',
    logo_pos=(360, 930), logo_w=140, logo_rot=-2,
    out_filename='story_bauhaus_pinda_tank.jpg'
)

# 4. JACAREÍ
render_city_v2(
    base_path='public/assets/stories_franquias/story_bauhaus_jacarei_n710.jpg',
    city_line='JACAREÍ - SP',
    stat1_val='100%', stat1_lbl='DE EXCLUSIVIDADE',
    stat2_val='ATÉ 79%', stat2_lbl='MARKUP BRUTO',
    stat3_val='CONTRAN', stat3_lbl='996 (SEM CNH)',
    subhead='POLO LOGÍSTICO & INDUSTRIAL • TERRITÓRIO EXCLUSIVO',
    cta='AGENDAR REUNIÃO // RESERVAR JACAREÍ',
    logo_pos=(345, 785), logo_w=110, logo_rot=0,
    out_filename='story_bauhaus_jacarei_n710.jpg'
)

# 5. CAÇAPAVA
render_city_v2(
    base_path='public/assets/stories_franquias/story_bauhaus_cacapava_q10.jpg',
    city_line='CAÇAPAVA - SP',
    stat1_val='100%', stat1_lbl='DE EXCLUSIVIDADE',
    stat2_val='ATÉ 69%', stat2_lbl='MARKUP BRUTO',
    stat3_val='CONTRAN', stat3_lbl='996 (SEM CNH)',
    subhead='CORAÇÃO DO VALE • TERRITÓRIO MUNICIPAL EXCLUSIVO',
    cta='AGENDAR REUNIÃO // RESERVAR CAÇAPAVA',
    logo_pos=(335, 765), logo_w=115, logo_rot=-3,
    out_filename='story_bauhaus_cacapava_q10.jpg'
)

print('All 5 cities rendered with square frames, official Z8 logo, 100% de exclusividade, and safe zones!')
