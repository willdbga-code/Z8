import os
import sys
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
    # Top arc
    draw.arc(box, start=190, end=350, fill=color, width=width)
    tip_x = center_x + radius * math.cos(math.radians(350))
    tip_y = center_y + radius * math.sin(math.radians(350))
    draw.polygon([(tip_x, tip_y), (tip_x - 5, tip_y - 4), (tip_x - 2, tip_y + 4)], fill=color)
    
    # Bottom arc
    draw.arc(box, start=10, end=170, fill=color, width=width)
    tip2_x = center_x + radius * math.cos(math.radians(170))
    tip2_y = center_y + radius * math.sin(math.radians(170))
    draw.polygon([(tip2_x, tip2_y), (tip2_x + 5, tip2_y + 4), (tip2_x + 2, tip2_y - 4)], fill=color)

# 1. Load Fonts
font_pill = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
font_head1 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 44)
font_head2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 48)
font_head3 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 42)

font_hero_num = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 76)
font_hero_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)

font_stat_val = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 38)
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

wa_badge = Image.open('public/assets/logos/whatsapp_pill_badge.png').convert('RGBA')

# Colors
COLOR_GOLD = (255, 184, 0, 255)
COLOR_WHITE = (255, 255, 255, 255)
COLOR_PLATINA = (226, 232, 240, 255)
COLOR_MUTED = (160, 175, 195, 255)

# 100% CLEAN BASE IMAGES ONLY (ZERO PRE-BAKED TEXT, NO LETTERS, NO PREVIOUS GRAPHICS)
stories_data = [
    {
        'id': '01',
        'base': 'public/assets/arquitetura/fachada_render_oficial_3arcos.jpg',
        'pill_pre': 'FRANQUIA EM ', 'pill_post': 'EXPANSÃO',
        'h1': 'OPORTUNIDADE DE NEGÓCIO',
        'h2': 'FRANQUIA Z8 E-MOTION',
        'h3': 'CONCESSÃO EXCLUSIVA 2026',
        'hero_num': 'R$ 35.000',
        'hero_sub': 'TAXA INICIAL DE FRANQUIA HOMOLOGADA',
        's1_v': '100% EXCLUSIVA', 's1_l': 'TERRITÓRIO MUNICIPAL',
        's2_v': 'ATÉ 57%', 's2_l': 'MARKUP BRUTO',
        's3_v': '6 A 12 MESES', 's3_l': 'PAYBACK MÉDIO',
        'info1': 'Alta rentabilidade com venda direta no atacado, varejo e oficina.',
        'info2': 'Projeto arquitetônico, sistema de gestão e garantia nacional inclusos.',
        'filename': 'story_franquia_01_oportunidade.jpg'
    },
    {
        'id': '02',
        'base': 'public/assets/franchise/store_interior.jpg',
        'pill_pre': 'ALTA RENTABILIDADE // ', 'pill_post': 'PODER DE CAIXA',
        'h1': 'FATURAMENTO ESTIMADO',
        'h2': 'POR UNIDADE HOMOLOGADA',
        'h3': 'OPERAÇÃO ENXUTA & LUCRATIVA',
        'hero_num': 'R$ 80k A R$ 180k/MÊS',
        'hero_sub': 'FATURAMENTO MÉDIO MENSAL ESTIMADO',
        's1_v': 'R$ 3k A R$ 7k', 's1_l': 'LUCRO POR MOTO',
        's2_v': '20% A 35%', 's2_l': 'LUCRO LÍQUIDO',
        's3_v': '0% ROYALTIES', 's3_l': 'S/ FATURAMENTO',
        'info1': 'Taxa operacional fixa previsível sem cobrança de royalties sobre vendas.',
        'info2': 'Múltiplas fontes de receita: motos elétricas, revisões e baterias de lítio.',
        'filename': 'story_franquia_02_faturamento.jpg'
    },
    {
        'id': '03',
        'base': 'public/assets/models/z8_fx10_sjc_wide.jpg',
        'pill_pre': 'LEGISLAÇÃO A FAVOR DO ', 'pill_post': 'SEU NEGÓCIO',
        'h1': 'MERCADO BILIONÁRIO',
        'h2': 'RESOLUÇÃO CONTRAN 996',
        'h3': 'VENDA RÁPIDA SEM BUROCRACIA',
        'hero_num': 'SEM CNH & SEM PLACA',
        'hero_sub': 'MODELOS AUTOPROPELIDOS HOMOLOGADOS',
        's1_v': 'CONTRAN 996', 's1_l': 'REGULAMENTAÇÃO',
        's2_v': '100% LEGAL', 's2_l': 'CIRCULAÇÃO LIVRE',
        's3_v': 'ZERO IMPOSTO', 's3_l': 'ISENTO DE IPVA',
        'info1': 'O cliente compra e sai rodando imediatamente sem custos de despachante.',
        'info2': 'Demanda explosiva para delivery, deslocamento diário e lazer.',
        'filename': 'story_franquia_03_contran996.jpg'
    },
    {
        'id': '04',
        'base': 'public/assets/arquitetura/fachada_3m_compact_store.jpg',
        'pill_pre': 'BAIXO CUSTO // ', 'pill_post': 'INSTALAÇÃO RÁPIDA',
        'h1': 'PONTO COMERCIAL MODULAR',
        'h2': 'FACHADAS DE 2M A 5M',
        'h3': 'MÓDULO CORREDOR OU RUA',
        'hero_num': '50 M² A 60 M² ÚTEIS',
        'hero_sub': 'MENOR ÁREA COMERCIAL HOMOLOGADA',
        's1_v': 'A PARTIR 50m²', 's1_l': 'ÁREA COMERCIAL',
        's2_v': '10 MOTOS', 's2_l': 'LOTE INICIAL',
        's3_v': 'OBRA RÁPIDA', 's3_l': 'PADRÃO ACM INOX',
        'info1': 'Operação enxuta com custos fixos baixos (1 consultor + 1 mecânico).',
        'info2': 'Identidade visual de alto padrão em ACM Aço Escovado e Cinza Platina.',
        'filename': 'story_franquia_04_ponto_compacto.jpg'
    },
    {
        'id': '05',
        'base': 'public/assets/franchise/insta_tech.jpg',
        'pill_pre': 'RECEITA RECORRENTE // ', 'pill_post': 'PÓS-VENDA',
        'h1': 'OFICINA TÉCNICA HOMOLOGADA',
        'h2': 'MONTAGEM, REVISÃO & PDI',
        'h3': 'PACOTE COMPLETO INCLUSO',
        'hero_num': '2 ELEVADORES INCLUSOS',
        'hero_sub': 'ELEVADORES TÉCNICOS NA SUA UNIDADE',
        's1_v': '2 ELEVADORES', 's1_l': 'PDI & OFICINA',
        's2_v': 'PEÇAS 100%', 's2_l': 'ESTOQUE ORIGINAL',
        's3_v': '16H TREINO', 's3_l': 'Z8 ACADEMY',
        'info1': 'Estrutura técnica completa inclusa para revisão e manutenção.',
        'info2': 'Faturamento constante com substituição de baterias, pastilhas e revisões.',
        'filename': 'story_franquia_05_oficina_elevadores.jpg'
    },
    {
        'id': '06',
        'base': 'public/assets/models/z8_tank_paulista_wide.jpg',
        'pill_pre': 'BLINDAGEM DE MERCADO // ', 'pill_post': 'MATRIZ Z8',
        'h1': 'RAIO DE PROTEÇÃO TOTAL',
        'h2': '1 FRANQUEADO POR PRAÇA',
        'h3': 'REPASSE INTEGRAL DE LEADS',
        'hero_num': '50 KM DE EXCLUSIVIDADE',
        'hero_sub': 'RAIO RADIAL PROTEGIDO EM CONTRATO',
        's1_v': '50 KM', 's1_l': 'RAIO PROTEGIDO',
        's2_v': '100% LEADS', 's2_l': 'REPASSADOS',
        's3_v': 'TÍTULO CPC', 's3_l': 'CONTRATO SEGURO',
        'info1': 'Garantia contratual: a matriz não abre outra unidade no seu raio de atuação.',
        'info2': 'Todos os contatos gerados pelas campanhas nacionais são seus clientes.',
        'filename': 'story_franquia_06_exclusividade_50km.jpg'
    },
    {
        'id': '07',
        'base': 'public/assets/models/z8_u2_warehouse_wide.jpg',
        'pill_pre': 'ESTOQUE NO BRASIL // ', 'pill_post': 'SEM RISCO ADUANEIRO',
        'h1': 'CENTRO DE FULFILLMENT SP',
        'h2': 'VEÍCULOS MONTADOS & REVISADOS',
        'h3': 'IMPORTAÇÃO PRÓPRIA DIRETA',
        'hero_num': 'DESPACHO EM ATÉ 48H',
        'hero_sub': 'LOGÍSTICA ÁGIL COM RASTREAMENTO',
        's1_v': 'EM 48 HORAS', 's1_l': 'DESPACHO SP',
        's2_v': '1 ANO', 's2_l': 'GARANTIA NACIONAL',
        's3_v': 'FOB / CIF', 's3_l': 'TRANSPORTE ÁGIL',
        'info1': 'Elimine a espera por contêineres e custos imprevisíveis de porto.',
        'info2': 'Estoque nacionalizado pronto para despacho com peças de reposição imediatas.',
        'filename': 'story_franquia_07_pronta_entrega.jpg'
    },
    {
        'id': '08',
        'base': 'public/assets/models/z8_n710_studio.jpg',
        'pill_pre': 'EXPANSÃO REGIONAL // ', 'pill_post': 'POLO INDUSTRIAL',
        'h1': 'OPORTUNIDADE DE NEGÓCIO NO',
        'h2': 'VALE DO PARAÍBA - SP',
        'h3': 'CONCESSÃO MUNICIPAL ABERTA',
        'hero_num': 'VALE DO PARAÍBA - SP',
        'hero_sub': 'SJC • TAUBATÉ • JACAREÍ • PINDA • CAÇAPAVA',
        's1_v': 'ALTO PIB', 's1_l': 'EIXO DUTRA',
        's2_v': '2,5 MI HAB', 's2_l': 'POPULAÇÃO REGIONAL',
        's3_v': 'VAGAS LIM.', 's3_l': '1 POR MUNICÍPIO',
        'info1': 'Região de altíssimo poder aquisitivo com forte demanda por mobilidade limpa.',
        'info2': 'Agende reunião com nossa diretoria para reservar o território da sua cidade.',
        'filename': 'story_franquia_08_vale_do_paraiba.jpg'
    },
    {
        'id': '09',
        'base': 'public/assets/models/z8_n95c_studio.jpg',
        'pill_pre': 'EXPANSÃO LITORAL // ', 'pill_post': 'ALTA TEMPORADA',
        'h1': 'OPORTUNIDADE DE NEGÓCIO NO',
        'h2': 'LITORAL & BAIXADA SANTISTA',
        'h3': 'MERCADO EM ALTA VELOCIDADE',
        'hero_num': 'LITORAL PAULISTA',
        'hero_sub': 'CARAGUÁ • SANTOS • SÃO SEBASTIÃO • UBATUBA',
        's1_v': 'ALTO FLUXO', 's1_l': 'TURISMO & LAZER',
        's2_v': 'CONTRAN 996', 's2_l': 'ORLAS & CICLOVIAS',
        's3_v': 'ATÉ 54%', 's3_l': 'MARKUP BRUTO',
        'info1': 'As scooters elétricas dominam a preferência nas cidades litorâneas o ano todo.',
        'info2': 'Público diversificado: moradores, veranistas, condomínios e delivery.',
        'filename': 'story_franquia_09_litoral_paulista.jpg'
    },
    {
        'id': '10',
        'base': 'public/assets/models/z8_harley_carvalho_wide.jpg',
        'pill_pre': 'MAIOR MERCADO DA AMÉRICA LATINA // ', 'pill_post': 'EXPANSÃO Z8',
        'h1': 'OPORTUNIDADE DE NEGÓCIO EM',
        'h2': 'SÃO PAULO & CAPITAL',
        'h3': 'GRANDE SÃO PAULO & ABC',
        'hero_num': 'SÃO PAULO & CAPITAL',
        'hero_sub': 'MOBILIDADE URBANA • FROTAS • CORPORATIVO',
        's1_v': '+12 MI HAB', 's1_l': 'MERCADO GIGANTE',
        's2_v': 'ATÉ 57%', 's2_l': 'MARGEM DE VENDA',
        's3_v': 'PDI ÁGIL', 's3_l': 'MATRIZ PRÓXIMA',
        'info1': 'Demanda massiva para frotas comerciais, delivery limpo e executivos urbanos.',
        'info2': 'Converse diretamente com o Diretor de Expansão para apresentação exclusiva.',
        'filename': 'story_franquia_10_sao_paulo_capital.jpg'
    }
]

out_dirs = [
    'public/assets/instagram_artes',
    'public/assets/stories_franquias',
    'site-principal/public/designer'
]
for od in out_dirs:
    os.makedirs(od, exist_ok=True)

print(f'Starting rendering of all {len(stories_data)} franchise expansion stories with 100% CLEAN base images...')

for item in stories_data:
    art_id = item['id']
    fname = item['filename']
    print(f'Rendering Art {art_id}: {fname} with base {item["base"]}...')
    
    # 1. Base Image with Cover Crop
    base_img = Image.open(item['base'])
    canvas = fit_cover(base_img, 1080, 1920)
    
    # 2. Cinematic Chiaroscuro Dark Gradient Overlays
    # Top overlay (0 to 700)
    top_overlay = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
    td = ImageDraw.Draw(top_overlay)
    for y in range(0, 700):
        alpha = int(245 * (1.0 - (y / 700) * 0.45))
        td.line([(0, y), (1080, y)], fill=(6, 10, 16, alpha))
        
    # Middle overlay (650 to 1350)
    for y in range(650, 1350):
        td.line([(0, y), (1080, y)], fill=(6, 9, 14, 195))
        
    # Bottom vignette (1300 to 1920)
    for y in range(1300, 1920):
        progress = (y - 1300) / 620
        alpha = int(195 + progress * 55)
        td.line([(0, y), (1080, y)], fill=(4, 6, 10, alpha))
        
    canvas = Image.alpha_composite(canvas, top_overlay)
    draw = ImageDraw.Draw(canvas)
    
    # 3. Top Status Pill (Starts at Y = 265, perfectly within Safe Zone)
    pre_text = item['pill_pre']
    post_text = item['pill_post']
    bb_pre = draw.textbbox((0, 0), pre_text, font=font_pill)
    bb_post = draw.textbbox((0, 0), post_text, font=font_pill)
    
    # Pill with sync icon width
    icon_space = 32
    pill_content_w = icon_space + (bb_pre[2] - bb_pre[0]) + (bb_post[2] - bb_post[0])
    pill_w = pill_content_w + 36
    pill_h = 44
    pill_x = (1080 - pill_w) // 2
    pill_y = 268
    
    # Draw dark pill with border
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h//2, fill=(10, 14, 22, 235), outline=(255, 255, 255, 75), width=1)
    
    # Draw rotation sync icon
    icon_center_x = pill_x + 22
    icon_center_y = pill_y + pill_h // 2
    draw_sync_icon(draw, icon_center_x, icon_center_y, radius=9, color=COLOR_GOLD, width=2)
    
    # Text
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
    
    # 6. Monumental Number / Financial Hero (Y = 620 to 760)
    hero_box_y = 620
    bb_hero = draw.textbbox((0, 0), item['hero_num'], font=font_hero_num)
    draw_text_shadow(((1080 - (bb_hero[2]-bb_hero[0]))//2, hero_box_y), item['hero_num'], font_hero_num, COLOR_WHITE, offset=(0, 4))
    
    bb_sub = draw.textbbox((0, 0), item['hero_sub'], font=font_hero_sub)
    draw_text_shadow(((1080 - (bb_sub[2]-bb_sub[0]))//2, hero_box_y + 92), item['hero_sub'], font_hero_sub, COLOR_GOLD)
    
    # 7. Telemetry & Information Glass Card (Y = 770 to 1180)
    card_w = 960
    card_h = 390
    card_x = (1080 - card_w) // 2
    card_y = 770
    
    # Draw semi-transparent card background
    card_bg = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card_bg)
    cd.rounded_rectangle([0, 0, card_w-1, card_h-1], radius=24, fill=(8, 12, 18, 230), outline=(255, 255, 255, 65), width=2)
    canvas.paste(card_bg, (card_x, card_y), card_bg)
    
    # Grid 3 columns inside card
    col_w = card_w // 3
    divider_y_end = card_y + 180
    
    # Vertical dividers
    draw.line([(card_x + col_w, card_y + 20), (card_x + col_w, divider_y_end - 10)], fill=(255, 255, 255, 50), width=1)
    draw.line([(card_x + col_w*2, card_y + 20), (card_x + col_w*2, divider_y_end - 10)], fill=(255, 255, 255, 50), width=1)
    # Horizontal divider
    draw.line([(card_x + 30, divider_y_end), (card_x + card_w - 30, divider_y_end)], fill=(255, 255, 255, 50), width=1)
    
    # Column 1
    bb = draw.textbbox((0, 0), item['s1_v'], font=font_stat_val)
    draw.text((card_x + (col_w - (bb[2]-bb[0]))//2, card_y + 45), item['s1_v'], font=font_stat_val, fill=COLOR_WHITE)
    bb = draw.textbbox((0, 0), item['s1_l'], font=font_stat_lbl)
    draw.text((card_x + (col_w - (bb[2]-bb[0]))//2, card_y + 105), item['s1_l'], font=font_stat_lbl, fill=COLOR_MUTED)
    
    # Column 2
    bb = draw.textbbox((0, 0), item['s2_v'], font=font_stat_val)
    draw.text((card_x + col_w + (col_w - (bb[2]-bb[0]))//2, card_y + 45), item['s2_v'], font=font_stat_val, fill=COLOR_GOLD)
    bb = draw.textbbox((0, 0), item['s2_l'], font=font_stat_lbl)
    draw.text((card_x + col_w + (col_w - (bb[2]-bb[0]))//2, card_y + 105), item['s2_l'], font=font_stat_lbl, fill=COLOR_MUTED)
    
    # Column 3
    bb = draw.textbbox((0, 0), item['s3_v'], font=font_stat_val)
    draw.text((card_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, card_y + 45), item['s3_v'], font=font_stat_val, fill=COLOR_WHITE)
    bb = draw.textbbox((0, 0), item['s3_l'], font=font_stat_lbl)
    draw.text((card_x + col_w*2 + (col_w - (bb[2]-bb[0]))//2, card_y + 105), item['s3_l'], font=font_stat_lbl, fill=COLOR_MUTED)
    
    # Lower Card Rows: Informative Bullet Texts
    row_info_y = divider_y_end + 32
    
    bb_i1 = draw.textbbox((0, 0), item['info1'], font=font_info_txt)
    draw.text(((1080 - (bb_i1[2]-bb_i1[0]))//2, row_info_y), item['info1'], font=font_info_txt, fill=COLOR_PLATINA)
    
    bb_i2 = draw.textbbox((0, 0), item['info2'], font=font_info_txt)
    draw.text(((1080 - (bb_i2[2]-bb_i2[0]))//2, row_info_y + 55), item['info2'], font=font_info_txt, fill=COLOR_PLATINA)
    
    # 8. Call To Action & WhatsApp Sticker (Y = 1200 to 1540)
    cta_base_y = 1200
    bb_saiba = draw.textbbox((0, 0), 'SAIBA +', font=font_saiba)
    draw_text_shadow(((1080 - (bb_saiba[2]-bb_saiba[0]))//2, cta_base_y), 'SAIBA +', font_saiba, COLOR_GOLD)
    
    bb_clique = draw.textbbox((0, 0), 'CLICANDO NO BOTÃO ABAIXO', font=font_clique)
    draw_text_shadow(((1080 - (bb_clique[2]-bb_clique[0]))//2, cta_base_y + 52), 'CLICANDO NO BOTÃO ABAIXO', font_clique, COLOR_WHITE)
    
    bb_arrow = draw.textbbox((0, 0), 'v', font=font_arrow)
    draw_text_shadow(((1080 - (bb_arrow[2]-bb_arrow[0]))//2, cta_base_y + 90), 'v', font_arrow, COLOR_WHITE)
    
    # WhatsApp Sticker Button (Centered, Y = 1380 to 1456)
    wa_x = (1080 - wa_badge.width) // 2
    wa_y = cta_base_y + 145
    canvas.paste(wa_badge, (wa_x, wa_y), wa_badge)
    
    # Save output to all relevant paths
    res_rgb = canvas.convert('RGB')
    for od in out_dirs:
        dest_path = os.path.join(od, fname)
        res_rgb.save(dest_path, quality=96)
        
    print(f'Done Art {art_id} -> {fname}')

print('All 10 franchise expansion stories successfully rendered from 100% CLEAN base photos!')
