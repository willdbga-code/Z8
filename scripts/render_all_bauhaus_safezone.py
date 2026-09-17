import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

logo_raw = Image.open('public/assets/logos/ztrasparente.png').convert('RGBA')
logo_tight = logo_raw.crop(logo_raw.getbbox())

font_header = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 24)
font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 68)
font_title_city = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
font_stat_val = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 42)
font_stat_lbl = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
font_micro = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 16)
font_cta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 26)

cities_config = [
    {
        'key': 'taubate',
        'base': r'C:\Users\LENOVO\.gemini\antigravity\brain\1450fe3c-76c2-4b1e-90de-e962764fce8d\z8_taubate_safezone_1789605174921.jpg',
        'city_line': 'TAUBATÉ - SP',
        'stat1_val': '100%', 'stat1_lbl': 'DE EXCLUSIVIDADE',
        'stat2_val': 'ATÉ 57%', 'stat2_lbl': 'MARKUP BRUTO',
        'stat3_val': 'CONTRAN', 'stat3_lbl': '996 (SEM CNH)',
        'subhead': 'POLO INDUSTRIAL • TERRITÓRIO MUNICIPAL EXCLUSIVO',
        'cta': 'AGENDAR REUNIÃO // RESERVAR TAUBATÉ',
        'logo_pos': (230, 975), 'logo_w': 175, 'logo_rot': 4,
        'clean_fairing': (220, 960, 210, 120),
        'clean_sky_h': 110,
        'output_name': 'story_bauhaus_taubate_fx10.jpg'
    },
    {
        'key': 'caraguatatuba',
        'base': 'public/assets/stories_franquias/story_bauhaus_caraguatatuba_n95c.jpg',
        'city_line': 'CARAGUATATUBA - SP',
        'stat1_val': '100%', 'stat1_lbl': 'DE EXCLUSIVIDADE',
        'stat2_val': 'ATÉ 54%', 'stat2_lbl': 'MARKUP BRUTO',
        'stat3_val': 'CONTRAN', 'stat3_lbl': '996 (SEM CNH)',
        'subhead': 'CAPITAL DO LITORAL NORTE • TERRITÓRIO MUNICIPAL EXCLUSIVO',
        'cta': 'AGENDAR REUNIÃO // RESERVAR CARAGUÁ',
        'logo_pos': (335, 765), 'logo_w': 90, 'logo_rot': 0,
        'clean_fairing': (330, 755, 100, 50),
        'clean_sky_h': 110,
        'output_name': 'story_bauhaus_caraguatatuba_n95c.jpg'
    },
    {
        'key': 'pinda',
        'base': 'public/assets/stories_franquias/story_bauhaus_pinda_tank.jpg',
        'city_line': 'PINDAMONHANGABA - SP',
        'stat1_val': '100%', 'stat1_lbl': 'DE EXCLUSIVIDADE',
        'stat2_val': 'ATÉ 53%', 'stat2_lbl': 'MARGEM BRUTA',
        'stat3_val': 'CONTRAN', 'stat3_lbl': '996 (SEM CNH)',
        'subhead': 'POLO INDUSTRIAL • TERRITÓRIO MUNICIPAL EXCLUSIVO',
        'cta': 'AGENDAR REUNIÃO // RESERVAR PINDA',
        'logo_pos': (360, 930), 'logo_w': 140, 'logo_rot': -2,
        'clean_fairing': (350, 920, 160, 70),
        'clean_sky_h': 110,
        'output_name': 'story_bauhaus_pinda_tank.jpg'
    },
    {
        'key': 'jacarei',
        'base': 'public/assets/stories_franquias/story_bauhaus_jacarei_n710.jpg',
        'city_line': 'JACAREÍ - SP',
        'stat1_val': '100%', 'stat1_lbl': 'DE EXCLUSIVIDADE',
        'stat2_val': 'ATÉ 79%', 'stat2_lbl': 'MARKUP BRUTO',
        'stat3_val': 'CONTRAN', 'stat3_lbl': '996 (SEM CNH)',
        'subhead': 'POLO LOGÍSTICO & INDUSTRIAL • TERRITÓRIO EXCLUSIVO',
        'cta': 'AGENDAR REUNIÃO // RESERVAR JACAREÍ',
        'logo_pos': (345, 785), 'logo_w': 105, 'logo_rot': 0,
        'clean_fairing': (340, 775, 120, 50),
        'clean_sky_h': 110,
        'output_name': 'story_bauhaus_jacarei_n710.jpg'
    },
    {
        'key': 'cacapava',
        'base': 'public/assets/stories_franquias/story_bauhaus_cacapava_q10.jpg',
        'city_line': 'CAÇAPAVA - SP',
        'stat1_val': '100%', 'stat1_lbl': 'DE EXCLUSIVIDADE',
        'stat2_val': 'ATÉ 69%', 'stat2_lbl': 'MARKUP BRUTO',
        'stat3_val': 'CONTRAN', 'stat3_lbl': '996 (SEM CNH)',
        'subhead': 'CORAÇÃO DO VALE • TERRITÓRIO MUNICIPAL EXCLUSIVO',
        'cta': 'AGENDAR REUNIÃO // RESERVAR CAÇAPAVA',
        'logo_pos': (335, 765), 'logo_w': 115, 'logo_rot': -3,
        'clean_fairing': (325, 755, 135, 55),
        'clean_sky_h': 110,
        'output_name': 'story_bauhaus_cacapava_q10.jpg'
    }
]

for cfg in cities_config:
    city_key = cfg['key']
    print(f'Processing {city_key}...')
    canvas = Image.open(cfg['base']).resize((1080, 1920), Image.Resampling.LANCZOS).convert('RGBA')
    draw = ImageDraw.Draw(canvas)

    # 1. Clean previous top header / pill
    sky_c = canvas.getpixel((540, 230))
    patch_top = Image.new('RGBA', (880, cfg['clean_sky_h']), (sky_c[0], sky_c[1], sky_c[2], 255))
    canvas.paste(patch_top, ((1080 - 880)//2, 245))

    # Clean border lines above CONCESSÃO EXCLUSIVA if present
    patch_line = Image.new('RGBA', (760, 30), (sky_c[0], sky_c[1], sky_c[2], 255))
    canvas.paste(patch_line, ((1080 - 760)//2, 335))

    # 2. Draw Square Top Header: sharp corners, zero border-radius
    header_w = 750
    header_h = 56
    header_x = (1080 - header_w) // 2
    header_y = 265
    draw.rectangle([header_x, header_y, header_x + header_w, header_y + header_h], fill=(10, 14, 20, 225), outline=(255, 255, 255, 210), width=2)

    header_text = 'FRANQUIA Z8 E-MOTION // SEJA UM FRANQUEADO'
    bb = draw.textbbox((0, 0), header_text, font=font_header)
    draw.text((header_x + (header_w - (bb[2]-bb[0]))//2, header_y + (header_h - (bb[3]-bb[1]))//2 - 2), header_text, font=font_header, fill=(255, 255, 255))

    # 3. Clean and redraw Headline: CONCESSÃO EXCLUSIVA: / [CIDADE] - SP
    head_c = canvas.getpixel((540, 360))
    patch_head = Image.new('RGBA', (940, 175), (head_c[0], head_c[1], head_c[2], 255))
    canvas.paste(patch_head, ((1080 - 940)//2, 350))

    line1 = 'CONCESSÃO EXCLUSIVA:'
    line2 = cfg['city_line']
    bb1 = draw.textbbox((0, 0), line1, font=font_title)
    draw.text(((1080 - (bb1[2]-bb1[0]))//2, 355), line1, font=font_title, fill=(255, 255, 255))
    bb2 = draw.textbbox((0, 0), line2, font=font_title_city)
    draw.text(((1080 - (bb2[2]-bb2[0]))//2, 435), line2, font=font_title_city, fill=(255, 255, 255))

    # 4. Composite Authentic Z8 Logo on Motorcycle
    cf = cfg['clean_fairing']
    f_color = canvas.getpixel((cf[0] + cf[2]//2, cf[1] + cf[3]//2))
    f_patch = Image.new('RGBA', (cf[2], cf[3]), (f_color[0], f_color[1], f_color[2], 220))
    canvas.paste(f_patch, (cf[0], cf[1]))

    target_w = cfg['logo_w']
    target_h = int(logo_tight.height * (target_w / logo_tight.width))
    logo_resized = logo_tight.resize((target_w, target_h), Image.Resampling.LANCZOS)
    if cfg['logo_rot'] != 0:
        logo_resized = logo_resized.rotate(cfg['logo_rot'], resample=Image.Resampling.BICUBIC, expand=True)
    canvas.paste(logo_resized, cfg['logo_pos'], logo_resized)

    # 5. Clean road/asphalt at bottom: clone asphalt from Y=1680 to Y=1860 into Y=1380-1700
    road_sample = canvas.crop((60, 1680, 1020, 1870)).resize((960, 300))
    canvas.paste(road_sample, (60, 1380))

    # 6. Draw Square Unified Grid (ending strictly above Y=1590, leaving 330px safe zone)
    grid_w = 940
    grid_h = 188
    grid_x = (1080 - grid_w) // 2
    grid_y = 1395
    row1_h = 112
    col_w = grid_w // 3

    # Outer rectangle: sharp 90-degree corners, zero border-radius
    draw.rectangle([grid_x, grid_y, grid_x + grid_w, grid_y + grid_h], fill=(10, 13, 18, 235), outline=(255, 255, 255, 185), width=2)

    # Column dividers
    draw.line([(grid_x + col_w, grid_y), (grid_x + col_w, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)
    draw.line([(grid_x + col_w * 2, grid_y), (grid_x + col_w * 2, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)
    # Horizontal divider
    draw.line([(grid_x, grid_y + row1_h), (grid_x + grid_w, grid_y + row1_h)], fill=(255, 255, 255, 120), width=1)

    # Col 1: 100% / DE EXCLUSIVIDADE
    bb = draw.textbbox((0, 0), cfg['stat1_val'], font=font_stat_val)
    draw.text((grid_x + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), cfg['stat1_val'], font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), cfg['stat1_lbl'], font=font_stat_lbl)
    draw.text((grid_x + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), cfg['stat1_lbl'], font=font_stat_lbl, fill=(200, 210, 220))

    # Col 2: MARKUP / MARGEM
    bb = draw.textbbox((0, 0), cfg['stat2_val'], font=font_stat_val)
    draw.text((grid_x + col_w + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), cfg['stat2_val'], font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), cfg['stat2_lbl'], font=font_stat_lbl)
    draw.text((grid_x + col_w + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), cfg['stat2_lbl'], font=font_stat_lbl, fill=(200, 210, 220))

    # Col 3: CONTRAN / 996
    bb = draw.textbbox((0, 0), cfg['stat3_val'], font=font_stat_val)
    draw.text((grid_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, grid_y + 16), cfg['stat3_val'], font=font_stat_val, fill=(255, 255, 255))
    bb = draw.textbbox((0, 0), cfg['stat3_lbl'], font=font_stat_lbl)
    draw.text((grid_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, grid_y + 68), cfg['stat3_lbl'], font=font_stat_lbl, fill=(200, 210, 220))

    # Row 2: Call to action inside grid
    cta_y = grid_y + row1_h
    bb = draw.textbbox((0, 0), cfg['subhead'], font=font_micro)
    draw.text((grid_x + (grid_w - (bb[2]-bb[0]))//2, cta_y + 9), cfg['subhead'], font=font_micro, fill=(180, 195, 210))

    bb = draw.textbbox((0, 0), cfg['cta'], font=font_cta)
    draw.text((grid_x + (grid_w - (bb[2]-bb[0]))//2, cta_y + 35), cfg['cta'], font=font_cta, fill=(255, 255, 255))

    # Save to all target paths
    res_rgb = canvas.convert('RGB')
    out_name = cfg['output_name']
    p1 = f'public/assets/stories_franquias/{out_name}'
    p2 = f'public/assets/instagram_artes/{out_name}'
    p3 = f'site-principal/public/designer/{out_name}'

    res_rgb.save(p1, quality=95)
    res_rgb.save(p2, quality=95)
    res_rgb.save(p3, quality=95)
    print(f'Successfully rendered and saved {city_key} -> {out_name}')

print('All 5 cities rendered successfully with Safe Zone, Square Bauhaus frames, Official Z8 metallic logo, and 100% DE EXCLUSIVIDADE!')
