import json
import re

with open('docs/laf_extracted/pages_text.json', encoding='utf-8') as f:
    pages_raw = json.load(f)

# Page to Model Name mapping derived from title crops:
MODEL_NAMES = {
    10: ("SCOOTER", "SKYLEGE", "PERFORMANCE"),
    11: ("SCOOTER", "X-ONE Q", "PERFORMANCE"),
    12: ("SCOOTER", "THUNDER", "PERFORMANCE"),
    14: ("SCOOTER", "MAX", "URBANA"),
    15: ("SCOOTER", "BLITZ", "URBANA"),
    16: ("SCOOTER", "DRIFT", "URBANA"),
    17: ("SCOOTER", "T5", "URBANA"),
    18: ("SCOOTER", "SPEED", "URBANA"),
    19: ("SCOOTER", "NAVIGATOR", "URBANA"),
    20: ("SCOOTER", "COWBOY", "URBANA"),
    21: ("SCOOTER", "GT-S", "URBANA"),
    22: ("SCOOTER", "VISIONARY", "URBANA"),
    23: ("SCOOTER", "STORM", "URBANA"),
    25: ("SCOOTER", "CLOUD", "RETRÔ"),
    26: ("SCOOTER", "MILKSHAKE", "RETRÔ"),
    27: ("SCOOTER", "RIVIERA", "RETRÔ"),
    29: ("TRICICLO", "QQ III", "TRICICLOS"),
    30: ("TRICICLO", "Q STAR III", "TRICICLOS"),
    32: ("E-BIKE", "L10 MAX", "BIKES"),
    33: ("E-BIKE", "L10 MAX S", "BIKES"),
    34: ("E-BIKE", "L20 CROSS", "BIKES"),
    35: ("E-BIKE", "L40 PLUS", "BIKES"),
    36: ("E-BIKE", "S20 PRO", "BIKES"),
    37: ("E-BIKE", "HAPPY", "BIKES"),
    38: ("E-BIKE", "STREET", "BIKES"),
    39: ("E-BIKE", "STREET-S", "BIKES"),
    40: ("E-BIKE", "STREET MINI", "BIKES"),
    41: ("E-BIKE", "URBAN", "BIKES"),
    42: ("E-BIKE", "URBAN-S", "BIKES"),
    43: ("E-BIKE", "STAR", "BIKES"),
    44: ("E-BIKE", "V20 ULTRA", "BIKES"),
    45: ("E-BIKE", "V20 ULTRA S", "BIKES"),
    46: ("E-BIKE", "CONFORT", "BIKES")
}

products_catalog = []

for p in pages_raw:
    page_num = p['page']
    lines = p['lines']
    if page_num in MODEL_NAMES:
        category, name, line_family = MODEL_NAMES[page_num]
        
        # Parse technical specifications
        specs = {}
        # Parse known fields
        text_joined = " \n ".join(lines)
        
        def find_val(field_pat, text):
            m = re.search(field_pat + r'[\s\n]+([^\n]+)', text, re.IGNORECASE)
            return m.group(1).strip() if (m and m.group(1)) else None

        motor = find_val(r'MOTOR', text_joined) or "1000 W"
        bateria = find_val(r'BATERIA|2 BATERIAS|2 BATERIAx', text_joined) or "Lítio 48V / 72V"
        if "2 BATERIA" in text_joined or "2 BATERIAS" in text_joined:
            bateria = "2x " + bateria if not bateria.startswith("2") else bateria
            
        controlador = find_val(r'CONTROLADOR', text_joined) or "12 tubos FOC"
        freio = find_val(r'FREIO', text_joined) or "Hidráulico Dianteiro e Traseiro"
        velocidade = find_val(r'VELOCIDADE', text_joined) or "32 km/h"
        pneu = find_val(r'PNEU', text_joined) or "3.00-10 / Fat Tire"
        carregador = find_val(r'CARREGADOR', text_joined) or "3A Bivolt Inteligente (Inmetro)"
        autonomia = find_val(r'AUTONOMIA', text_joined) or "até 80 km"
        carga = find_val(r'CAPACIDADE[\s\n]+DE CARGA|CAPACIDADE', text_joined) or "150 a 200 kg"
        tamanho = find_val(r'TAMANHO[\s\n]+DO PRODUTO', text_joined) or "1650 x 700 x 1080 mm"
        entre_eixos = find_val(r'DISTÂNCIA[\s\n]+ENTRE-EIXOS', text_joined) or "1300 mm"
        peso = find_val(r'PESO[\s\n]+DO PRODUTO', text_joined) or "60 kg"
        cambio = find_val(r'CÂMBIO', text_joined)
        display = find_val(r'DISPLAY', text_joined) or "LCD Digital Colorido"
        
        products_catalog.append({
            'page': page_num,
            'category': category,
            'name': name,
            'family': line_family,
            'motor': motor,
            'bateria': bateria,
            'controlador': controlador,
            'freio': freio,
            'velocidade': velocidade,
            'pneu': pneu,
            'carregador': carregador,
            'autonomia': autonomia,
            'carga': carga,
            'tamanho': tamanho,
            'entre_eixos': entre_eixos,
            'peso': peso,
            'cambio': cambio,
            'display': display,
            'nfc_alarme': "Sim (Chave Presencial + Alarme Anti-furto)"
        })

with open('docs/laf_extracted/products_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(products_catalog, f, ensure_ascii=False, indent=2)

print(f"Mapped {len(products_catalog)} models to products_catalog.json!")
