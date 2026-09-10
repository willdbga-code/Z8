import os
import shutil
from PIL import Image, ImageDraw, ImageFont

# Dimensions
STORIES_W, STORIES_H = 1080, 1920
FEED_W, FEED_H = 1080, 1080

ROOT_DIR = r"c:\Users\LENOVO\Desktop\Z8"
ARTIFACT_DIR = r"C:\Users\LENOVO\.gemini\antigravity\brain\e45e91ba-eb3d-491c-b9bb-073c162c8447"
OUTPUT_DIR = os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "cartazes")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Fonts
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"

try:
    font_badge = ImageFont.truetype(FONT_BOLD, 22)
    font_headline = ImageFont.truetype(FONT_BOLD, 46)
    font_subhead = ImageFont.truetype(FONT_REGULAR, 26)
    font_badges = ImageFont.truetype(FONT_BOLD, 20)
    font_cta = ImageFont.truetype(FONT_BOLD, 26)
    font_legal = ImageFont.truetype(FONT_REGULAR, 17)
    font_hero_label = ImageFont.truetype(FONT_BOLD, 18)
except Exception as e:
    print(f"Font loading fallback: {e}")
    font_badge = font_headline = font_subhead = font_badges = font_cta = font_legal = font_hero_label = ImageFont.load_default()

# 15 Posters Dataset
POSTERS = [
    {
        "id": "cartaz_sul_01_serra",
        "region": "SUL",
        "model": "Z8 Q10 Vintage",
        "category": "Linha Retrô Clássica",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_01_serra_q10.jpg"),
        "headline": "FRANQUIA Z8 NA SERRA GAÚCHA:\nCONCESSIONÁRIA DE ALTO LUCRO",
        "subhead": "Conquiste um público de alto poder aquisitivo com a marca de\nmobilidade que mais cresce. Margem líquida de até 52%.",
        "badges": ["2 ELEVADORES DE OFICINA", "MARGEM ATÉ 52%", "CONTRAN 996"],
        "cta": "SEJA UM FRANQUEADO Z8 NO RS"
    },
    {
        "id": "cartaz_sul_02_floripa",
        "region": "SUL",
        "model": "Z8 Q11 Compact",
        "category": "Linha Ágil & Jovem",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_02_floripa_n95c.jpg"),
        "headline": "EXPANSÃO SANTA CATARINA:\nSEJA UM FRANQUEADO Z8",
        "subhead": "Conecte seu capital à Ilha da Inovação com veículos ágeis e tecnológicos.\nRetorno projetado em 8 a 14 meses e alto giro diário.",
        "badges": ["2 ELEVADORES TÉCNICOS", "MARKUP ATÉ 78,8%", "RAIO 50KM"],
        "cta": "GARANTA SUA CONCESSIONÁRIA EM SC"
    },
    {
        "id": "cartaz_sul_03_curitiba",
        "region": "SUL",
        "model": "Z8 N7 Standard",
        "category": "Campeão de Vendas",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_01_curitiba_fx10.jpg"),
        "headline": "ABRA SUA CONCESSIONÁRIA Z8 NO PARANÁ:\nALTO GIRO COMERCIAL",
        "subhead": "A capital pioneira em sustentabilidade recebe a franquia líder de faturamento.\nLote inicial de entrada com apenas 10 motos.",
        "badges": ["2 ELEVADORES INCLUSOS", "RETORNO 8 A 14 MESES", "SENATRAN"],
        "cta": "SEJA FRANQUEADO Z8 NO PARANÁ"
    },
    {
        "id": "cartaz_sudeste_01_sp",
        "region": "SUDESTE",
        "model": "Z8 U2 Delivery Cargo",
        "category": "Frotas & Carga",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sudeste_01_sp_tank.jpg"),
        "headline": "FRANQUIA Z8 SÃO PAULO:\nO MAIOR RETORNO DO PAÍS",
        "subhead": "Domine o mercado bilionário de frotas e mobilidade corporativa limpa\nno maior centro financeiro da América Latina.",
        "badges": ["2 ELEVADORES MASTER", "MARGEM 45% A 65%", "CAT SENATRAN"],
        "cta": "INVISTA NA FRANQUIA Z8 EM SP"
    },
    {
        "id": "cartaz_sudeste_02_rio",
        "region": "SUDESTE",
        "model": "Z8 Diamond Luxe",
        "category": "Design Premium",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sudeste_02_rio_fx10.jpg"),
        "headline": "SEJA FRANQUEADO NO RIO DE JANEIRO:\nMARGENS DE ATÉ 65%",
        "subhead": "Mobilidade executiva de alto luxo para o público premium carioca.\nProjeto arquitetônico homologado em ACM Aço Escovado.",
        "badges": ["2 ELEVADORES TÉCNICOS", "MARKUP ATÉ 100%", "RAIO 50KM"],
        "cta": "ABRA SUA CONCESSIONÁRIA NO RJ"
    },
    {
        "id": "cartaz_sudeste_03_sjc",
        "region": "SUDESTE",
        "model": "Z8 N710 Urban Plus",
        "category": "Lançamento 2026",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sudeste_03_sjc_n710.jpg"),
        "headline": "ENGENHARIA DA CAPITAL DO VALE:\nINVISTA NA FRANQUIA Z8",
        "subhead": "Nascida no polo aeroespacial mais avançado do Brasil.\nA solidez de suporte direto da fábrica que seu investimento exige.",
        "badges": ["SUPORTE DE FÁBRICA", "2 ELEVADORES INCLUSOS", "PEÇAS EM ESTOQUE"],
        "cta": "CONHEÇA O PLANO DE EXPANSÃO Z8"
    },
    {
        "id": "cartaz_co_01_brasilia",
        "region": "CENTRO-OESTE",
        "model": "Z8 Harley X21 Custom",
        "category": "Chopper Custom",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_centroeste_01_brasilia_harley.jpg"),
        "headline": "FRANQUIA MASTER BRASÍLIA:\nEXCLUSIVIDADE NO DF",
        "subhead": "Leve a imponência da linha custom elétrica e concessionária flagship\npara o centro do poder nacional com margens de até 65%.",
        "badges": ["CONCESSIONÁRIA MASTER", "FAST CHARGE", "EXCLUSIVIDADE 50KM"],
        "cta": "SEJA FRANQUEADO MASTER NO DF"
    },
    {
        "id": "cartaz_co_02_goiania",
        "region": "CENTRO-OESTE",
        "model": "Z8 U2 Delivery Cargo",
        "category": "Logística & Atacado",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_centroeste_02_goiania_n95c.jpg"),
        "headline": "EXPANSÃO GOIÁS:\nCONCESSIONÁRIA AUTORIZADA Z8",
        "subhead": "Atenda o maior polo atacadista do Centro-Oeste com frotas comerciais\nelétricas de custo imbatível e oficina completa homologada.",
        "badges": ["2 ELEVADORES DE OFICINA", "TAXA FIXA R$ 35K", "CONTRAN 996"],
        "cta": "ABRA SUA CONCESSIONÁRIA EM GOIÁS"
    },
    {
        "id": "cartaz_co_03_agro",
        "region": "CENTRO-OESTE",
        "model": "Z8 N7 Standard",
        "category": "Energia Solar & Agro",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_centroeste_03_agro_tank.jpg"),
        "headline": "FRANQUIA Z8 MATO GROSSO:\nA FORÇA DA ENERGIA LIMPA",
        "subhead": "Cidades-polo e o agronegócio de alta tecnologia aceleram elétrico.\nCusto de recarga zero com usinas solares próprias.",
        "badges": ["2 ELEVADORES DE OFICINA", "MARGENS 45% A 52%", "PAYBACK 8-12 MESES"],
        "cta": "LEVE A Z8 PARA O INTERIOR DO MT"
    },
    {
        "id": "cartaz_nordeste_01_recife",
        "region": "NORDESTE",
        "model": "Z8 Q10 Vintage",
        "category": "Clássica & Inovação",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_nordeste_02_recife_fx10.jpg"),
        "headline": "FRANQUIA Z8 RECIFE:\nA CONCESSIONÁRIA DO FUTURO",
        "subhead": "Conecte sua concessionária ao ecossistema do Porto Digital com\no modelo de mobilidade sustentável mais rentável do Nordeste.",
        "badges": ["LUCRO R$ 4.000/MOTO", "2 ELEVADORES INCLUSOS", "RAIO 50KM"],
        "cta": "SEJA O FRANQUEADO EM PERNAMBUCO"
    },
    {
        "id": "cartaz_nordeste_02_ceara",
        "region": "NORDESTE",
        "model": "Z8 GS-005 Base Norte",
        "category": "Entrada & Giro",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_nordeste_01_ceara_tank.jpg"),
        "headline": "EXPANSÃO NORDESTE:\nINVISTA COM RETORNO RÁPIDO",
        "subhead": "A região líder em energia eólica e solar lidera a mobilidade elétrica.\nAlto giro comercial e suporte técnico completo.",
        "badges": ["MARKUP ATÉ 93,8%", "2 ELEVADORES DE OFICINA", "CONTRAN 996"],
        "cta": "INVISTA NA FRANQUIA Z8 NO NORDESTE"
    },
    {
        "id": "cartaz_nordeste_03_salvador",
        "region": "NORDESTE",
        "model": "Z8 Diamond Luxe",
        "category": "Luxo Litorâneo",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_nordeste_03_salvador_n95c.jpg"),
        "headline": "SEJA FRANQUEADO NA BAHIA:\nNEGÓCIO DE ALTA LUCRATIVIDADE",
        "subhead": "Mobilidade elétrica de luxo para as melhores orlas e condomínios fechados.\nRetorno projetado entre 8 e 14 meses.",
        "badges": ["2 ELEVADORES TÉCNICOS", "MARGEM ATÉ 65%", "LEI 13.966"],
        "cta": "ABRA SUA FRANQUIA Z8 NA BAHIA"
    },
    {
        "id": "cartaz_norte_01_manaus",
        "region": "NORTE",
        "model": "Z8 GS-005 Base Norte",
        "category": "DNA Polo Industrial",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_norte_01_manaus_fx10.jpg"),
        "headline": "FRANQUIA Z8 AMAZONAS:\nO FUTURO DA MOBILIDADE NA ZFM",
        "subhead": "Posicione sua concessionária no berço industrial de duas rodas com\nincentivos regionais e peças a pronta entrega.",
        "badges": ["MOTOR COBRE PURO", "2 ELEVADORES DE OFICINA", "ESTOQUE CENTRAL"],
        "cta": "GARANTA SUA CONCESSIONÁRIA NO AM"
    },
    {
        "id": "cartaz_norte_02_belem",
        "region": "NORTE",
        "model": "Z8 U2 Delivery Cargo",
        "category": "Bioeconomia COP30",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_nordeste_01_ceara_tank.jpg"),
        "headline": "EXPANSÃO BELÉM:\nA CONCESSIONÁRIA SUSTENTÁVEL Z8",
        "subhead": "Mobilidade 100% zero carbono no centro mundial da bioeconomia.\nLucratividade sólida com propósito ecológico.",
        "badges": ["100% ZERO EMISSÕES", "2 ELEVADORES INCLUSOS", "MARGEM 45-65%"],
        "cta": "SEJA FRANQUEADO Z8 NO PARÁ"
    },
    {
        "id": "cartaz_norte_03_palmas",
        "region": "NORTE",
        "model": "Z8 Q11 Compact",
        "category": "Avenidas Solares",
        "image": os.path.join(ROOT_DIR, "public", "assets", "stories_franquias", "story_sul_02_floripa_n95c.jpg"),
        "headline": "FRANQUIA Z8 TOCANTINS:\nSEJA O LÍDER NA SUA REGIÃO",
        "subhead": "Avenidas planejadas, sol o ano inteiro e retorno rápido.\nSeja o primeiro franqueado exclusivo no estado.",
        "badges": ["2 ELEVADORES DE OFICINA", "MARKUP DE 78,8%", "EXCLUSIVIDADE TO"],
        "cta": "ABRA SUA CONCESSIONÁRIA NO TOCANTINS"
    }
]

def render_poster(poster, width=STORIES_W, height=STORIES_H, is_feed=False):
    # 1. Base Canvas
    canvas = Image.new("RGB", (width, height), (10, 13, 18))
    
    # 2. Hero Background Image
    img_path = poster["image"]
    if not os.path.exists(img_path):
        img_path = os.path.join(ROOT_DIR, "public", "assets", "models", "z8_tank_studio.jpg")
    
    try:
        hero = Image.open(img_path).convert("RGB")
        # Cover crop
        hero_ratio = hero.width / hero.height
        canvas_ratio = width / height
        if hero_ratio > canvas_ratio:
            new_h = height
            new_w = int(height * hero_ratio)
        else:
            new_w = width
            new_h = int(width / hero_ratio)
        hero = hero.resize((new_w, new_h), Image.Resampling.LANCZOS)
        offset_x = (width - new_w) // 2
        offset_y = (height - new_h) // 2
        canvas.paste(hero, (offset_x, offset_y))
    except Exception as e:
        print(f"Error loading image {img_path}: {e}")
    
    # 3. Vignette Overlays (Top and Bottom)
    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    
    # Top gradient
    top_limit = int(height * (0.38 if is_feed else 0.44))
    for y in range(top_limit):
        alpha = int(240 * (1 - (y / top_limit)**1.2))
        v_draw.line([(0, y), (width, y)], fill=(6, 8, 12, alpha))
        
    # Bottom gradient
    bot_start = int(height * (0.68 if is_feed else 0.65))
    for y in range(bot_start, height):
        alpha = int(245 * ((y - bot_start) / (height - bot_start))**0.9)
        v_draw.line([(0, y), (width, y)], fill=(6, 8, 12, alpha))
        
    canvas.paste(vignette, (0, 0), vignette)
    
    # 4. Typography Drawing
    draw = ImageDraw.Draw(canvas)
    padding_x = 70
    cursor_y = 90 if is_feed else 180
    
    # Top Brand Badge Pill
    badge_text = f"⚡ Z8 E-MOTION®  •  EXPANSÃO {poster['region']}"
    bbox = font_badge.getbbox(badge_text)
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pill_w = bw + 44
    pill_h = bh + 24
    
    draw.rounded_rectangle([padding_x, cursor_y, padding_x + pill_w, cursor_y + pill_h], radius=15, fill=(0, 240, 255, 35), outline=(0, 240, 255), width=2)
    draw.text((padding_x + 22, cursor_y + 11), badge_text, font=font_badge, fill=(0, 240, 255))
    
    cursor_y += pill_h + (24 if is_feed else 35)
    
    # Headline (with shadow)
    lines = poster["headline"].split("\n")
    for line in lines:
        # Shadow
        draw.text((padding_x + 3, cursor_y + 3), line, font=font_headline, fill=(0, 0, 0))
        draw.text((padding_x, cursor_y), line, font=font_headline, fill=(255, 255, 255))
        l_bbox = font_headline.getbbox(line)
        cursor_y += (l_bbox[3] - l_bbox[1]) + 14
        
    cursor_y += 10
    
    # Subhead
    sub_lines = poster["subhead"].split("\n")
    for s_line in sub_lines:
        draw.text((padding_x, cursor_y), s_line, font=font_subhead, fill=(203, 213, 225))
        s_bbox = font_subhead.getbbox(s_line)
        cursor_y += (s_bbox[3] - s_bbox[1]) + 10
        
    # Product Hero Label
    hero_label = f"VITRINE: {poster['model'].upper()}  •  {poster['category'].upper()}"
    h_bbox = font_hero_label.getbbox(hero_label)
    hw, hh = h_bbox[2] - h_bbox[0], h_bbox[3] - h_bbox[1]
    hl_w = hw + 36
    hl_h = hh + 20
    hl_y = int(height * (0.60 if is_feed else 0.58))
    hl_x = width - padding_x - hl_w
    
    draw.rounded_rectangle([hl_x, hl_y, hl_x + hl_w, hl_y + hl_h], radius=8, fill=(15, 23, 42), outline=(100, 116, 139), width=1)
    draw.text((hl_x + 18, hl_y + 9), hero_label, font=font_hero_label, fill=(241, 245, 249))
    
    # Bottom Badges Bar
    bot_y = height - (140 if is_feed else 240)
    badge_x = padding_x
    for b_item in poster["badges"]:
        bb_box = font_badges.getbbox(b_item)
        bw, bh = bb_box[2] - bb_box[0], bb_box[3] - bb_box[1]
        bw_box = bw + 28
        bh_box = bh + 18
        draw.rounded_rectangle([badge_x, bot_y, badge_x + bw_box, bot_y + bh_box], radius=6, fill=(17, 24, 39), outline=(51, 65, 85), width=1)
        draw.text((badge_x + 14, bot_y + 8), b_item, font=font_badges, fill=(0, 240, 255))
        badge_x += bw_box + 12
        
    # Bottom CTA Box (Stories only)
    if not is_feed:
        cta_y = bot_y + 55
        cta_h = 64
        draw.rounded_rectangle([padding_x, cta_y, width - padding_x, cta_y + cta_h], radius=12, fill=(0, 240, 255))
        cta_text = f"⚡ {poster['cta']}  •  TOQUE EM SAIBA MAIS"
        c_bbox = font_cta.getbbox(cta_text)
        cw = c_bbox[2] - c_bbox[0]
        draw.text(((width - cw) // 2, cta_y + 18), cta_text, font=font_cta, fill=(5, 11, 20))
        
        # Legal line
        legal_text = "Z8 EMOTION LTDA.  •  CNPJ: 68.774.164/0001-00  •  SÃO JOSÉ DOS CAMPOS - SP"
        lg_bbox = font_legal.getbbox(legal_text)
        lw = lg_bbox[2] - lg_bbox[0]
        draw.text(((width - lw) // 2, cta_y + cta_h + 18), legal_text, font=font_legal, fill=(100, 116, 139))
        
    return canvas

# Generate All
print("Starting poster generation...")
for p in POSTERS:
    # 1. Stories 9:16
    story_img = render_poster(p, STORIES_W, STORIES_H, is_feed=False)
    story_filename = f"{p['id']}_stories_9x16.jpg"
    story_path = os.path.join(OUTPUT_DIR, story_filename)
    story_img.save(story_path, quality=95)
    shutil.copy(story_path, os.path.join(ARTIFACT_DIR, story_filename))
    
    # 2. Feed 1:1
    feed_img = render_poster(p, FEED_W, FEED_H, is_feed=True)
    feed_filename = f"{p['id']}_feed_1x1.jpg"
    feed_path = os.path.join(OUTPUT_DIR, feed_filename)
    feed_img.save(feed_path, quality=95)
    shutil.copy(feed_path, os.path.join(ARTIFACT_DIR, feed_filename))
    
    print(f"Generated: {story_filename} and {feed_filename}")

print("All 15 franchise posters generated successfully in Stories and Feed formats!")
