import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def fit_cover(im, target_w=1080, target_h=1920):
    """Resizes and center-crops clean image to fill target 9:16 dimensions perfectly."""
    orig_w, orig_h = im.size
    scale = max(target_w / orig_w, target_h / orig_h)
    new_w = int(orig_w * scale)
    new_h = int(orig_h * scale)
    im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return im_resized.crop((left, top, left + target_w, top + target_h)).convert('RGBA')

def draw_sync_icon(draw, center_x, center_y, radius=11, color=(255, 184, 0, 255), width=2):
    """Draws two clean curved arrows forming a rotation/sync icon."""
    box = [center_x - radius, center_y - radius, center_x + radius, center_y + radius]
    draw.arc(box, start=190, end=350, fill=color, width=width)
    tip_x = center_x + radius * math.cos(math.radians(350))
    tip_y = center_y + radius * math.sin(math.radians(350))
    draw.polygon([(tip_x, tip_y), (tip_x - 5, tip_y - 4), (tip_x - 2, tip_y + 4)], fill=color)
    
    draw.arc(box, start=10, end=170, fill=color, width=width)
    tip2_x = center_x + radius * math.cos(math.radians(170))
    tip2_y = center_y + radius * math.sin(math.radians(170))
    draw.polygon([(tip2_x, tip2_y), (tip2_x + 5, tip2_y + 4), (tip2_x + 2, tip2_y - 4)], fill=color)

def create_wa_curriculo_badge(width=720, height=76):
    """Creates a dedicated WhatsApp sticker pill for sending resume/CV."""
    badge = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(badge)
    
    # White rounded rectangle with subtle shadow and border
    d.rounded_rectangle([0, 0, width-1, height-1], radius=height//2, fill=(255, 255, 255, 255), outline=(215, 222, 230, 255), width=2)
    
    # WhatsApp green circle
    circle_size = height - 16
    cx = 14
    cy = 8
    d.ellipse([cx, cy, cx + circle_size, cy + circle_size], fill=(37, 211, 102, 255))
    
    # White Speech Bubble
    bw = circle_size * 0.72
    bh = circle_size * 0.72
    bx = cx + (circle_size - bw) / 2
    by = cy + (circle_size - bh) / 2
    d.ellipse([bx, by, bx + bw, by + bh], fill=(255, 255, 255, 255))
    
    # Tail at bottom-left
    tail_tip = (cx + 6, cy + circle_size - 6)
    tail_base1 = (bx + bw * 0.20, by + bh * 0.75)
    tail_base2 = (bx + bw * 0.44, by + bh * 0.82)
    d.polygon([tail_tip, tail_base1, tail_base2], fill=(255, 255, 255, 255))
    
    # Accurate phone handset inside speech bubble
    handset_layer = Image.new('RGBA', (int(bw), int(bh)), (0, 0, 0, 0))
    hd = ImageDraw.Draw(handset_layer)
    hd.arc([bw*0.22, bh*0.22, bw*0.78, bh*0.78], start=120, end=290, fill=(37, 211, 102, 255), width=int(bw*0.18))
    hd.rounded_rectangle([bw*0.56, bh*0.18, bw*0.82, bh*0.42], radius=4, fill=(37, 211, 102, 255))
    hd.rounded_rectangle([bw*0.18, bh*0.56, bw*0.42, bh*0.82], radius=4, fill=(37, 211, 102, 255))
    
    badge.paste(handset_layer, (int(bx), int(by)), handset_layer)
    
    # Typography
    font_wa = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 28)
    wa_text = 'Enviar currículo pelo WhatsApp'
    t_bb = d.textbbox((0, 0), wa_text, font=font_wa)
    text_x = cx + circle_size + 24
    text_y = (height - (t_bb[3] - t_bb[1])) // 2 - 2
    d.text((text_x, text_y), wa_text, font=font_wa, fill=(24, 32, 47, 255))
    
    return badge

# 1. Load Fonts
font_pill = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
font_head1 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 44)
font_head2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 48)
font_head3 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 42)

font_hero_num = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 72)
font_hero_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)

font_stat_val = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 36)
font_stat_lbl = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 17)
font_info_txt = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 21)

font_saiba = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 40)
font_clique = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 23)
font_arrow = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 34)

# 2. Load Assets
logo_raw = Image.open('public/assets/logos/ztrasparente.png').convert('RGBA')
logo_tight = logo_raw.crop(logo_raw.getbbox())
logo_w = 210
logo_h = int(logo_tight.height * (logo_w / logo_tight.width))
logo_img = logo_tight.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

wa_badge = create_wa_curriculo_badge()
wa_badge.save('public/assets/logos/whatsapp_curriculo_badge.png')

# Colors
COLOR_GOLD = (255, 184, 0, 255)
COLOR_WHITE = (255, 255, 255, 255)
COLOR_PLATINA = (226, 232, 240, 255)
COLOR_MUTED = (160, 175, 195, 255)

hiring_stories = [
    {
        'id': 'faxineira',
        'base': 'public/assets/models/z8_q10_madalena_wide.jpg',
        'pill_pre': 'VAGA ABERTA // ', 'pill_post': 'CONTRATAÇÃO IMEDIATA',
        'h1': 'ESTAMOS CONTRATANDO',
        'h2': 'AUXILIAR DE LIMPEZA',
        'h3': '& SERVIÇOS GERAIS',
        'hero_num': 'SHOWROOM Z8',
        'hero_sub': 'LOJA MATRIZ • SÃO JOSÉ DOS CAMPOS - SP',
        's1_v': 'CLT EFETIVO', 's1_l': 'CARTEIRA ASSINADA',
        's2_v': 'BENEFÍCIOS', 's2_l': 'VT + VALE REFEIÇÃO',
        's3_v': 'SEG A SEX', 's3_l': 'HORÁRIO COMERCIAL',
        'info1': 'Limpeza, organização e zelo pelo showroom de motos, escritórios e copa.',
        'info2': 'Local: Av. Dr. Adhemar de Barros, 566 - Jd. São Dimas (Matriz Z8).',
        'filename': 'story_contratacao_01_faxineira.jpg'
    },
    {
        'id': 'vendedora',
        'base': 'public/assets/models/z8_fx10_sjc_wide.jpg',
        'pill_pre': 'VAGA ABERTA // ', 'pill_post': 'EXPANSÃO COMERCIAL',
        'h1': 'ESTAMOS CONTRATANDO',
        'h2': 'CONSULTORA DE VENDAS',
        'h3': 'SHOWROOM & LEADS DIGITAIS',
        'hero_num': 'SALÁRIO + COMISSÃO',
        'hero_sub': 'ALTO POTENCIAL DE GANHO • VEÍCULOS ELÉTRICOS',
        's1_v': 'CLT + COMISSÃO', 's1_l': 'GANHOS ACIMA DA MÉDIA',
        's2_v': 'LEADS DIÁRIOS', 's2_l': 'TRÁFEGO PAGO ATIVO',
        's3_v': 'LOJA MATRIZ', 's3_l': 'SÃO JOSÉ DOS CAMPOS',
        'info1': 'Atendimento consultivo a clientes no showroom e fechamento de vendas.',
        'info2': 'Gestão e contato ativo com leads diários de alta intenção no WhatsApp.',
        'filename': 'story_contratacao_02_vendedora.jpg'
    }
]

out_dirs = [
    'public/assets/instagram_artes',
    'public/assets/stories_franquias',
    'site-principal/public/designer'
]
for od in out_dirs:
    os.makedirs(od, exist_ok=True)

print(f'Starting rendering of {len(hiring_stories)} recruitment stories with 100% CLEAN base images...')

for item in hiring_stories:
    fname = item['filename']
    print(f'Rendering {fname} with base {item["base"]}...')
    
    # 1. Base Image with Cover Crop
    base_img = Image.open(item['base'])
    canvas = fit_cover(base_img, 1080, 1920)
    
    # 2. Cinematic Chiaroscuro Dark Gradient Overlays
    top_overlay = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    td = ImageDraw.Draw(top_overlay)
    for y in range(0, 700):
        alpha = int(245 * (1.0 - (y / 700) * 0.45))
        td.line([(0, y), (1080, y)], fill=(6, 10, 16, alpha))
        
    for y in range(650, 1350):
        td.line([(0, y), (1080, y)], fill=(6, 9, 14, 195))
        
    for y in range(1300, 1920):
        progress = (y - 1300) / 620
        alpha = int(195 + progress * 55)
        td.line([(0, y), (1080, y)], fill=(4, 6, 10, alpha))
        
    canvas = Image.alpha_composite(canvas, top_overlay)
    draw = ImageDraw.Draw(canvas)
    
    # 3. Top Status Pill (Starts at Y = 268)
    pre_text = item['pill_pre']
    post_text = item['pill_post']
    bb_pre = draw.textbbox((0, 0), pre_text, font=font_pill)
    bb_post = draw.textbbox((0, 0), post_text, font=font_pill)
    
    icon_space = 32
    pill_content_w = icon_space + (bb_pre[2] - bb_pre[0]) + (bb_post[2] - bb_post[0])
    pill_w = pill_content_w + 36
    pill_h = 44
    pill_x = (1080 - pill_w) // 2
    pill_y = 268
    
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h//2, fill=(10, 14, 22, 235), outline=(255, 255, 255, 75), width=1)
    
    icon_center_x = pill_x + 22
    icon_center_y = pill_y + pill_h // 2
    draw_sync_icon(draw, icon_center_x, icon_center_y, radius=9, color=COLOR_GOLD, width=2)
    
    text_start_x = pill_x + 16 + icon_space
    draw.text((text_start_x, pill_y + 10), pre_text, font=font_pill, fill=COLOR_WHITE)
    draw.text((text_start_x + (bb_pre[2] - bb_pre[0]), pill_y + 10), post_text, font=font_pill, fill=COLOR_GOLD)
    
    # 4. Brand Logo
    logo_x = (1080 - logo_w) // 2
    logo_y = 330
    canvas.paste(logo_img, (logo_x, logo_y), logo_img)
    
    # 5. Headline (3 Lines with Shadow & Bicolor Contrast)
    def draw_text_shadow(pos, text, font, fill, shadow_fill=(0, 0, 0, 220), offset=(0, 3)):
        draw.text((pos[0] + offset[0], pos[1] + offset[1]), text, font=font, fill=shadow_fill)
        draw.text(pos, text, font=font, fill=fill)
        
    bb1 = draw.textbbox((0, 0), item['h1'], font=font_head1)
    draw_text_shadow(((1080 - (bb1[2]-bb1[0]))//2, 435), item['h1'], font_head1, COLOR_GOLD)
    
    bb2 = draw.textbbox((0, 0), item['h2'], font=font_head2)
    draw_text_shadow(((1080 - (bb2[2]-bb2[0]))//2, 490), item['h2'], font_head2, COLOR_WHITE)
    
    bb3 = draw.textbbox((0, 0), item['h3'], font=font_head3)
    draw_text_shadow(((1080 - (bb3[2]-bb3[0]))//2, 550), item['h3'], font_head3, COLOR_GOLD)
    
    # 6. Monumental Hero Highlight (Y = 620 to 760)
    hero_box_y = 620
    bb_hero = draw.textbbox((0, 0), item['hero_num'], font=font_hero_num)
    draw_text_shadow(((1080 - (bb_hero[2]-bb_hero[0]))//2, hero_box_y), item['hero_num'], font_hero_num, COLOR_WHITE, offset=(0, 4))
    
    bb_sub = draw.textbbox((0, 0), item['hero_sub'], font=font_hero_sub)
    draw_text_shadow(((1080 - (bb_sub[2]-bb_sub[0]))//2, hero_box_y + 88), item['hero_sub'], font_hero_sub, COLOR_GOLD)
    
    # 7. Telemetry & Information Glass Card (Y = 770 to 1180)
    card_w = 960
    card_h = 390
    card_x = (1080 - card_w) // 2
    card_y = 770
    
    card_bg = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card_bg)
    cd.rounded_rectangle([0, 0, card_w-1, card_h-1], radius=24, fill=(8, 12, 18, 230), outline=(255, 255, 255, 65), width=2)
    canvas.paste(card_bg, (card_x, card_y), card_bg)
    
    col_w = card_w // 3
    divider_y_end = card_y + 180
    
    draw.line([(card_x + col_w, card_y + 20), (card_x + col_w, divider_y_end - 10)], fill=(255, 255, 255, 50), width=1)
    draw.line([(card_x + col_w*2, card_y + 20), (card_x + col_w*2, divider_y_end - 10)], fill=(255, 255, 255, 50), width=1)
    draw.line([(card_x + 30, divider_y_end), (card_x + card_w - 30, divider_y_end)], fill=(255, 255, 255, 50), width=1)
    
    def draw_col_stat(center_x, y, text, font, fill, max_w=280):
        cur_font = font
        bb = draw.textbbox((0, 0), text, font=cur_font)
        if (bb[2] - bb[0]) > max_w:
            for sz in range(cur_font.size - 2, 16, -2):
                tf = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', sz)
                bbt = draw.textbbox((0, 0), text, font=tf)
                if (bbt[2] - bbt[0]) <= max_w:
                    cur_font = tf
                    bb = bbt
                    break
        draw.text((center_x - (bb[2] - bb[0]) // 2, y), text, font=cur_font, fill=fill)

    # Column 1
    col1_cx = card_x + col_w // 2
    draw_col_stat(col1_cx, card_y + 45, item['s1_v'], font_stat_val, COLOR_WHITE, max_w=col_w - 30)
    draw_col_stat(col1_cx, card_y + 105, item['s1_l'], font_stat_lbl, COLOR_MUTED, max_w=col_w - 30)
    
    # Column 2
    col2_cx = card_x + col_w + col_w // 2
    draw_col_stat(col2_cx, card_y + 45, item['s2_v'], font_stat_val, COLOR_GOLD, max_w=col_w - 30)
    draw_col_stat(col2_cx, card_y + 105, item['s2_l'], font_stat_lbl, COLOR_MUTED, max_w=col_w - 30)
    
    # Column 3
    col3_cx = card_x + col_w * 2 + col_w // 2
    draw_col_stat(col3_cx, card_y + 45, item['s3_v'], font_stat_val, COLOR_WHITE, max_w=col_w - 30)
    draw_col_stat(col3_cx, card_y + 105, item['s3_l'], font_stat_lbl, COLOR_MUTED, max_w=col_w - 30)
    
    # Lower Card Rows: Informative Bullet Texts
    row_info_y = divider_y_end + 32
    
    bb_i1 = draw.textbbox((0, 0), item['info1'], font=font_info_txt)
    draw.text(((1080 - (bb_i1[2]-bb_i1[0]))//2, row_info_y), item['info1'], font=font_info_txt, fill=COLOR_PLATINA)
    
    bb_i2 = draw.textbbox((0, 0), item['info2'], font=font_info_txt)
    draw.text(((1080 - (bb_i2[2]-bb_i2[0]))//2, row_info_y + 55), item['info2'], font=font_info_txt, fill=COLOR_PLATINA)
    
    # 8. Call To Action & WhatsApp Sticker (Y = 1200 to 1540)
    cta_base_y = 1200
    bb_saiba = draw.textbbox((0, 0), 'ENVIE SEU CURRÍCULO', font=font_saiba)
    draw_text_shadow(((1080 - (bb_saiba[2]-bb_saiba[0]))//2, cta_base_y), 'ENVIE SEU CURRÍCULO', font_saiba, COLOR_GOLD)
    
    bb_clique = draw.textbbox((0, 0), 'CLICANDO NO BOTÃO ABAIXO', font=font_clique)
    draw_text_shadow(((1080 - (bb_clique[2]-bb_clique[0]))//2, cta_base_y + 52), 'CLICANDO NO BOTÃO ABAIXO', font_clique, COLOR_WHITE)
    
    bb_arrow = draw.textbbox((0, 0), 'v', font=font_arrow)
    draw_text_shadow(((1080 - (bb_arrow[2]-bb_arrow[0]))//2, cta_base_y + 90), 'v', font_arrow, COLOR_WHITE)
    
    # WhatsApp Sticker Button
    wa_x = (1080 - wa_badge.width) // 2
    wa_y = cta_base_y + 145
    canvas.paste(wa_badge, (wa_x, wa_y), wa_badge)
    
    # Save output to all relevant paths
    res_rgb = canvas.convert('RGB')
    for od in out_dirs:
        dest_path = os.path.join(od, fname)
        res_rgb.save(dest_path, quality=96)
        
    print(f'Done {fname} successfully!')

print('Both hiring stories rendered successfully!')
