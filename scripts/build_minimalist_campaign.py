import os
import shutil
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = r"c:\Users\LENOVO\Desktop\Z8"
ARTIFACT_DIR = r"C:\Users\LENOVO\.gemini\antigravity\brain\e45e91ba-eb3d-491c-b9bb-073c162c8447"
OUTPUT_DIR = os.path.join(ROOT_DIR, "public", "assets", "campanha_minimalista")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Colors
COLOR_TEXT_BLACK = (10, 13, 18)
COLOR_TEXT_MUTED = (71, 85, 105)
COLOR_GOLD_OCHRE = (197, 160, 89) # #C5A059 from user's reference image 2
COLOR_WHITE = (255, 255, 255)

# Fonts
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

# 11 Models Data Matrix (Covering Brazil South to North)
CAMPAIGN_MODELS = [
    {
        "id": "01_tank_sul",
        "model": "Z8 Tank High-Speed",
        "region": "Sul (Serra Gaúcha - RS)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_03_serra_tank.jpg"),
        "headline": "LIDERANÇA EM\nCADA TERRENO.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nPORTFÓLIO HOMOLOGADO // MODELO CHAVE NA MÃO",
        "subhead_feed": "FRANQUIA Z8 // PORTFÓLIO HOMOLOGADO // ALTA PERFORMANCE",
        "support": "O ciclomotor trail de alta velocidade com a maior rentabilidade do portfólio.",
        "footer_stories": "INVESTIMENTO ESTRUTURADO  •  RETORNO ACELERADO",
        "tab_feed": "SHOWROOM AUTORIZADO  •  SUPORTE INTEGRAL"
    },
    {
        "id": "02_q10_sul",
        "model": "Z8 Q10 Vintage",
        "region": "Sul (Bento Gonçalves - RS)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_01_serra_q10.jpg"),
        "headline": "CHARME RETRÔ.\nALTA MARGEM.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nLINHA CLÁSSICA EUROPEIA // R$ 4.000 DE LUCRO",
        "subhead_feed": "FRANQUIA Z8 // LINHA CLÁSSICA EUROPEIA // R$ 4.000 DE LUCRO",
        "support": "O design clássico mais desejado do mercado agora com propulsão 100% elétrica.",
        "footer_stories": "DESIGN EUROPEU  •  EXCLUSIVIDADE REGIONAL",
        "tab_feed": "ESTILO CLÁSSICO  •  ALTO GIRO NO VAREJO"
    },
    {
        "id": "03_q11_sul",
        "model": "Z8 Q11 Compact",
        "region": "Sul (Florianópolis - SC)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "models", "z8_q11_studio.jpg"),
        "headline": "AGILIDADE URBANA.\nGIRO IMEDIATO.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nLEVEZA & TECNOLOGIA // MARKUP DE 78,8%",
        "subhead_feed": "FRANQUIA Z8 // LEVEZA & TECNOLOGIA // MARKUP DE 78,8%",
        "support": "Mobilidade ágil com baú integrado na cor da moto e baixíssimo consumo energético.",
        "footer_stories": "BAIXO CUSTO OPERACIONAL  •  ALTA DEMANDA JOVEM",
        "tab_feed": "LINHA COMPACT  •  CONVERSÃO ACELERADA"
    },
    {
        "id": "04_n7_sul",
        "model": "Z8 N7 Standard",
        "region": "Sul (Curitiba - PR)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "models", "z8_n7_studio.jpg"),
        "headline": "VOLUME RECORDE.\nVENDA DIÁRIA.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nO MODELO CORINGA // DUPLO DISCO HIDRÁULICO",
        "subhead_feed": "FRANQUIA Z8 // O CORINGA DO SHOWROOM // DUPLO DISCO HIDRÁULICO",
        "support": "O ciclomotor mais equilibrado do Brasil com a maior liquidez para o franqueado.",
        "footer_stories": "OFICINA COMPLETA  •  2 ELEVADORES INCLUSOS",
        "tab_feed": "CAMPEÃO DE VENDAS  •  OFICINA HOMOLOGADA"
    },
    {
        "id": "05_fx10_sudeste",
        "model": "Z8 FX-10 Sport",
        "region": "Sudeste (Rio de Janeiro - RJ)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sudeste_02_rio_fx10.jpg"),
        "headline": "LINHAS ESPORTIVAS.\nATRAÇÃO PURA.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nDESIGN AERODINÂMICO // EXCLUSIVIDADE FLAGSHIP",
        "subhead_feed": "FRANQUIA Z8 // DESIGN AERODINÂMICO // EXCLUSIVIDADE FLAGSHIP",
        "support": "Visual esportivo agressivo e motor 1000W que atraem o público para dentro do showroom.",
        "footer_stories": "MARGENS DE ATÉ 65%  •  PROTEÇÃO TERRITORIAL 50KM",
        "tab_feed": "ALTA VELOCIDADE  •  FLAGSHIP EXCLUSIVA"
    },
    {
        "id": "06_u2_sudeste",
        "model": "Z8 U2 Delivery Cargo",
        "region": "Sudeste (São Paulo Faria Lima - SP)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "models", "z8_u2_warehouse_wide.jpg"),
        "headline": "EFICIÊNCIA LOGÍSTICA.\nFROTAS SUSTENTÁVEIS.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nCONTRATOS B2B DE ALTO VALOR // ZERO EMISSÕES",
        "subhead_feed": "FRANQUIA Z8 // CONTRATOS B2B DE ALTO VALOR // ZERO EMISSÕES",
        "support": "A utilitária elétrica projetada para frotas comerciais e entregas corporativas pesadas.",
        "footer_stories": "LOGÍSTICA CORPORATIVA  •  REDUÇÃO DE 90% EM CUSTOS",
        "tab_feed": "FROTAS URBANAS  •  RENTABILIDADE B2B"
    },
    {
        "id": "07_n710_sudeste",
        "model": "Z8 N710 Urban Plus",
        "region": "Sudeste (São José dos Campos - SP)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sudeste_03_sjc_n710.jpg"),
        "headline": "ENGENHARIA AVANÇADA.\nSOLIDEZ INDUSTRIAL.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nSEDE EM SÃO JOSÉ DOS CAMPOS // 1 ANO DE GARANTIA",
        "subhead_feed": "FRANQUIA Z8 // SEDE EM SÃO JOSÉ DOS CAMPOS // GARANTIA NACIONAL",
        "support": "Painel digital LCD laminado, DRL horizontal e reposição direta de peças pela fábrica.",
        "footer_stories": "PEÇAS EM ESTOQUE CENTRAL  •  SUPORTE TÉCNICO DIRETO",
        "tab_feed": "LANÇAMENTO 2026  •  TECNOLOGIA NACIONAL"
    },
    {
        "id": "08_harley_centroeste",
        "model": "Z8 Harley X21 Custom",
        "region": "Centro-Oeste (Brasília Esplanada - DF)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_centroeste_01_brasilia_harley.jpg"),
        "headline": "PRESENÇA MONUMENTAL.\nAUTONOMIA REAL.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nLINHA CHOPPER EXCLUSIVA // SOM BLUETOOTH NATIVO",
        "subhead_feed": "FRANQUIA Z8 // LINHA CHOPPER EXCLUSIVA // SOM BLUETOOTH",
        "support": "Estilo custom inconfundível com pneu largo chopper e sistema de partida keyless NFC.",
        "footer_stories": "CONCESSIONÁRIA MASTER  •  ESTAÇÃO FAST CHARGE",
        "tab_feed": "ESTILO CHOPPER  •  EXCLUSIVIDADE MASTER"
    },
    {
        "id": "09_diamond_centroeste",
        "model": "Z8 Diamond Luxe",
        "region": "Centro-Oeste (Goiânia Alamedas - GO)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "models", "z8_diamond_studio.jpg"),
        "headline": "DESIGN LAPIDADO.\nSOFISTICAÇÃO URBANA.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nACABAMENTO PREMIUM // PARTIDA KEYLESS NFC",
        "subhead_feed": "FRANQUIA Z8 // ACABAMENTO PREMIUM // PARTIDA KEYLESS NFC",
        "support": "Mobilidade leve de luxo com cesta estilizada, banco ergonômico e 100% de markup.",
        "footer_stories": "SUPORTE ARQUITETÔNICO  •  FACHADAS HOMOLOGADAS",
        "tab_feed": "DESIGN DIAMANTE  •  TICKET ELEVADO"
    },
    {
        "id": "10_n95c_nordeste",
        "model": "Z8 N95C Max Comfort",
        "region": "Nordeste (Costa dos Ventos - CE)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_nordeste_03_salvador_n95c.jpg"),
        "headline": "ALTO GIRO.\nMÁXIMA RENTABILIDADE.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nTICKET MÉDIO CONSOLIDADO // HOMOLOGAÇÃO NACIONAL",
        "subhead_feed": "FRANQUIA Z8 // TICKET MÉDIO CONSOLIDADO // HOMOLOGAÇÃO NACIONAL",
        "support": "O modelo executivo com maior taxa de conversão do showroom.",
        "footer_stories": "INVESTIMENTO ESTRUTURADO  •  RETORNO ACELERADO",
        "tab_feed": "SHOWROOM AUTORIZADO  •  SUPORTE INTEGRAL"
    },
    {
        "id": "11_gs005_norte",
        "model": "Z8 GS-005 Base Norte",
        "region": "Norte (Manaus Ponta Negra - AM)",
        "image": os.path.join(ROOT_DIR, "public", "assets", "models", "z8_gs005_studio.jpg"),
        "headline": "DNA INDUSTRIAL.\nMÁXIMA RESISTÊNCIA.",
        "subhead_stories": "FRANQUIA Z8 E-MOTION\nMOTOR 500W COBRE PURO // ALTO GIRO POPULAR",
        "subhead_feed": "FRANQUIA Z8 // MOTOR 500W COBRE PURO // ALTO GIRO POPULAR",
        "support": "Estrutura tubular de alta durabilidade, cesta reforçada e pedais auxiliares pedelec.",
        "footer_stories": "FACILIDADE DE REPOSIÇÃO  •  BAIXÍSSIMA MANUTENÇÃO",
        "tab_feed": "UTILITÁRIA ROBUSTA  •  LÍDER CUSTO-BENEFÍCIO"
    }
]

def render_stories_minimalist(item):
    """Generates 1080x1920 Stories exactly like user's Reference Image 1"""
    W, H = 1080, 1920
    canvas = Image.new("RGB", (W, H), (245, 247, 250))
    
    # 1. Base Image (Cover)
    img_path = item["image"]
    if os.path.exists(img_path):
        base = Image.open(img_path).convert("RGB")
        b_ratio = base.width / base.height
        c_ratio = W / H
        if b_ratio > c_ratio:
            new_h = H
            new_w = int(H * b_ratio)
        else:
            new_w = W
            new_h = int(W / b_ratio)
        base = base.resize((new_w, new_h), Image.Resampling.LANCZOS)
        ox = (W - new_w) // 2
        oy = (H - new_h) // 2
        canvas.paste(base, (ox, oy))
        
    # 2. Subtle Natural Contrast Veil on top (pure gradient to guarantee black text legibility)
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(veil)
    top_limit = int(H * 0.42)
    for y in range(top_limit):
        alpha = int(185 * (1 - (y / top_limit)**1.3))
        v_draw.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))
        
    # Bottom veil for footer
    bot_limit = int(H * 0.88)
    for y in range(bot_limit, H):
        alpha = int(130 * ((y - bot_limit) / (H - bot_limit))**1.1)
        v_draw.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))
        
    canvas.paste(veil, (0, 0), veil)
    
    # 3. Typography
    draw = ImageDraw.Draw(canvas)
    f_headline = ImageFont.truetype(FONT_BOLD, 82)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 30)
    f_sub2 = ImageFont.truetype(FONT_REGULAR, 26)
    f_footer = ImageFont.truetype(FONT_REGULAR, 23)
    f_badge = ImageFont.truetype(FONT_BOLD, 18)
    
    pad_x = 90
    cursor_y = 190
    
    # Headline (Black, bold, tight, period)
    lines = item["headline"].split("\n")
    for line in lines:
        draw.text((pad_x, cursor_y), line, font=f_headline, fill=COLOR_TEXT_BLACK)
        bb = f_headline.getbbox(line)
        cursor_y += (bb[3] - bb[1]) + 16
        
    cursor_y += 18
    
    # Subhead (Two lines, technical uppercase with //)
    sub_lines = item["subhead_stories"].split("\n")
    if len(sub_lines) > 0:
        draw.text((pad_x, cursor_y), sub_lines[0], font=f_sub1, fill=COLOR_TEXT_BLACK)
        bb1 = f_sub1.getbbox(sub_lines[0])
        cursor_y += (bb1[3] - bb1[1]) + 12
    if len(sub_lines) > 1:
        draw.text((pad_x, cursor_y), sub_lines[1], font=f_sub2, fill=COLOR_TEXT_BLACK)
        
    # Discrete subtle brand watermark top right
    z8_tag = "Z8 E-MOTION®"
    t_bb = f_badge.getbbox(z8_tag)
    draw.text((W - pad_x - (t_bb[2] - t_bb[0]), 195), z8_tag, font=f_badge, fill=COLOR_TEXT_MUTED)
    
    # Bottom Footer: Centered with bullet
    footer_text = item["footer_stories"]
    f_bb = f_footer.getbbox(footer_text)
    fw = f_bb[2] - f_bb[0]
    draw.text(((W - fw) // 2, H - 150), footer_text, font=f_footer, fill=COLOR_TEXT_BLACK)
    
    return canvas

def render_feed_minimalist(item):
    """Generates 1080x1080 Feed Square exactly like user's Reference Image 2"""
    W, H = 1080, 1080
    canvas = Image.new("RGB", (W, H), (245, 247, 250))
    
    # 1. Base Image (Cover)
    img_path = item["image"]
    if os.path.exists(img_path):
        base = Image.open(img_path).convert("RGB")
        b_ratio = base.width / base.height
        c_ratio = W / H
        if b_ratio > c_ratio:
            new_h = H
            new_w = int(H * b_ratio)
        else:
            new_w = W
            new_h = int(W / b_ratio)
        base = base.resize((new_w, new_h), Image.Resampling.LANCZOS)
        ox = (W - new_w) // 2
        oy = (H - new_h) // 2
        canvas.paste(base, (ox, oy))
        
    # 2. Subtle Natural Contrast Veil (Left and Top)
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(veil)
    top_limit = int(H * 0.48)
    for y in range(top_limit):
        alpha = int(190 * (1 - (y / top_limit)**1.3))
        v_draw.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))
    canvas.paste(veil, (0, 0), veil)
    
    # 3. Left Gold/Ochre Border Line (Ref Image 2)
    draw = ImageDraw.Draw(canvas)
    gold_bar_w = 20
    draw.rectangle([0, 0, gold_bar_w, H], fill=COLOR_GOLD_OCHRE)
    
    # 4. Typography
    f_headline = ImageFont.truetype(FONT_BOLD, 54)
    f_subhead = ImageFont.truetype(FONT_BOLD, 22)
    f_support = ImageFont.truetype(FONT_REGULAR, 21)
    f_tab = ImageFont.truetype(FONT_BOLD, 20)
    
    pad_x = 75
    cursor_y = 80
    
    # Top Headline (Black, bold, two lines with period)
    lines = item["headline"].split("\n")
    for line in lines:
        draw.text((pad_x, cursor_y), line, font=f_headline, fill=COLOR_TEXT_BLACK)
        bb = f_headline.getbbox(line)
        cursor_y += (bb[3] - bb[1]) + 14
        
    cursor_y += 14
    
    # Subhead (Technical uppercase with //)
    draw.text((pad_x, cursor_y), item["subhead_feed"], font=f_subhead, fill=COLOR_TEXT_BLACK)
    s_bb = f_subhead.getbbox(item["subhead_feed"])
    cursor_y += (s_bb[3] - s_bb[1]) + 14
    
    # Support sentence case
    draw.text((pad_x, cursor_y), item["support"], font=f_support, fill=COLOR_TEXT_MUTED)
    
    # 5. Bottom-Right Gold/Ochre Curved Tab (Exact replica of Ref Image 2)
    tab_w = 560
    tab_h = 75
    tab_x = W - tab_w
    tab_y = H - tab_h
    radius = 38
    
    # Draw custom polygon with rounded top-left corner
    tab_mask = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(tab_mask)
    
    # Top-left arc
    t_draw.pieslice([tab_x, tab_y, tab_x + (radius * 2), tab_y + (radius * 2)], 180, 270, fill=COLOR_GOLD_OCHRE)
    # Rectangles to fill the tab
    t_draw.rectangle([tab_x + radius, tab_y, W, tab_y + radius], fill=COLOR_GOLD_OCHRE)
    t_draw.rectangle([tab_x, tab_y + radius, W, H], fill=COLOR_GOLD_OCHRE)
    canvas.paste(tab_mask, (0, 0), tab_mask)
    
    # Text inside tab
    tab_text = item["tab_feed"]
    tb_bb = f_tab.getbbox(tab_text)
    tw = tb_bb[2] - tb_bb[0]
    th = tb_bb[3] - tb_bb[1]
    
    # Centered in the tab
    tx = tab_x + (tab_w - tw) // 2 + 10
    ty = tab_y + (tab_h - th) // 2
    draw.text((tx, ty), tab_text, font=f_tab, fill=COLOR_TEXT_BLACK)
    
    return canvas

# Execution
print("Rendering Minimalist Campaign for all 11 models...")
for item in CAMPAIGN_MODELS:
    # 1. Stories
    story_canvas = render_stories_minimalist(item)
    story_name = f"campanha_{item['id']}_stories.jpg"
    story_path = os.path.join(OUTPUT_DIR, story_name)
    story_canvas.save(story_path, quality=96)
    shutil.copy(story_path, os.path.join(ARTIFACT_DIR, story_name))
    
    # 2. Feed
    feed_canvas = render_feed_minimalist(item)
    feed_name = f"campanha_{item['id']}_feed.jpg"
    feed_path = os.path.join(OUTPUT_DIR, feed_name)
    feed_canvas.save(feed_path, quality=96)
    shutil.copy(feed_path, os.path.join(ARTIFACT_DIR, feed_name))
    
    print(f"Generated: {story_name} and {feed_name}")

print("Successfully generated all 22 minimalist campaign images!")
