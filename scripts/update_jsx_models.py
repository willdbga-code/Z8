with open('scripts/GERAR_CATALOGO_ILUSTRATOR_Z8.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''    var modelsData = [
        { id: "z8-tank", name: "Z8 TANK", tag: "TRAIL PERFORMANCE", file: "z8_tank_studio.jpg", motor: "2000W High Torque", bat: "72V 35Ah Lítio", aut: "Até 60 km", vel: "32 km/h", freio: "Duplo Disco Hidráulico", chassi: "Tubular Duplo Aço", preco: "R$ 11.500,00" },
        { id: "z8-fx10", name: "Z8 FX-10", tag: "URBAN SPORT", file: "z8_fx10_studio.jpg", motor: "1500W High Speed", bat: "72V 25Ah Lítio", aut: "Até 50 km", vel: "32 km/h", freio: "Disco Duplo Hidráulico", chassi: "Esportivo Reforçado", preco: "R$ 11.000,00" },
        { id: "z8-harley-x21", name: "Z8 HARLEY X21", tag: "CHOPPER CUSTOM", file: "z8_harley_studio.jpg", motor: "1500W Torque Cruiser", bat: "60V 20Ah Lítio", aut: "Até 45 km", vel: "32 km/h", freio: "Disco Diant. e Tras.", chassi: "Chopper Customizado", preco: "R$ 10.000,00" },
        { id: "z8-u2-delivery", name: "Z8 U2 DELIVERY", tag: "CARGA PESADA", file: "z8_u2_studio.jpg", motor: "1000W Heavy Duty", bat: "60V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Disco Duplo 180mm", chassi: "Base Carga 150 kg", preco: "R$ 9.500,00" },
        { id: "z8-n95c", name: "Z8 N95C MAX", tag: "SCOOTER EXECUTIVA", file: "z8_n95c_studio.jpg", motor: "1200W High Efficiency", bat: "72V 20Ah Lítio", aut: "Até 50 km", vel: "32 km/h", freio: "Disco Diant. e Tras.", chassi: "Conforto Ergonômico", preco: "R$ 10.000,00" },
        { id: "z8-n7", name: "Z8 N7 STANDARD", tag: "MAIS VENDIDO", file: "z8_n7_studio.jpg", motor: "1000W High Efficiency", bat: "60V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Duplo Disco 180mm", chassi: "Estrutura Aço Leve", preco: "R$ 9.500,00" },
        { id: "z8-q10", name: "Z8 Q10 VINTAGE", tag: "VINTAGE COM BAÚ", file: "z8_q10_studio.jpg", motor: "1000W High Efficiency", bat: "60V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Disco Diant. / Tambor", chassi: "Retrô Candy Style", preco: "R$ 9.800,00" },
        { id: "z8-n710", name: "Z8 N710 URBAN PLUS", tag: "LANÇAMENTO 2026", file: "z8_n710_studio.jpg", motor: "1000W High Performance", bat: "60V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Duplo Disco 180mm", chassi: "Urban Reforçado", preco: "R$ 9.500,00" },
        { id: "z8-q11", name: "Z8 Q11 COMPACT", tag: "LEVE & ÁGIL", file: "z8_q11_studio.jpg", motor: "1000W 9G Silencioso", bat: "60V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Disco Diant. / Tambor", chassi: "Compacto Xiao Q", preco: "R$ 9.300,00" },
        { id: "z8-gs005", name: "Z8 GS-005 BASE NORTE", tag: "E-BIKE UTILITÁRIA", file: "z8_gs005_studio.jpg", motor: "500W Cobre Puro", bat: "48V 20Ah Lítio", aut: "Até 35 km", vel: "32 km/h", freio: "Tambor Reforçado", chassi: "Aço de Trabalho", preco: "R$ 4.200,00" },
        { id: "z8-diamond", name: "Z8 DIAMOND LUXE", tag: "DESIGN PREMIUM", file: "z8_diamond_studio.jpg", motor: "500W High Efficiency", bat: "48V 20Ah Lítio", aut: "Até 40 km", vel: "32 km/h", freio: "Disco Diant. / Tambor", chassi: "Liga Leve Diamond", preco: "R$ 4.800,00" }
    ];'''

new_block = '''    var modelsData = [
        { id: "z8-tank", name: "Z8 TANK HIGH-SPEED", tag: "TRAIL PERFORMANCE (DB018)", file: "z8_tank_studio.jpg", motor: "2000W High Torque", bat: "60V 20Ah (ate 125Ah)", aut: "Ate 70-240 km", vel: "32 km/h (Max 80)", freio: "Duplo Disco Hidraulico", chassi: "Tubular Duplo de Aco", preco: "R$ 9.500,00" },
        { id: "z8-fx10", name: "Z8 FX-10 SPORT", tag: "URBAN SPORT (DB043)", file: "z8_fx10_studio.jpg", motor: "1500W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 68)", freio: "180mm Duplo Disco", chassi: "Esportivo Reforcado", preco: "R$ 9.000,00" },
        { id: "z8-harley-x12", name: "Z8 HARLEY X12", tag: "CUSTOM CHOPPER (XB-024)", file: "z8_harley_studio.jpg", motor: "1200W 27H 30A", bat: "Litio 60V 20Ah", aut: "Ate 40 km", vel: "32 km/h (Max 50)", freio: "Disco Diant. / Tambor", chassi: "Custom Chopper Aco", preco: "R$ 8.000,00" },
        { id: "z8-u2-delivery", name: "Z8 U2 DELIVERY", tag: "CARGA PESADA (XB-010)", file: "z8_u2_studio.jpg", motor: "2000W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 70)", freio: "220mm Duplo Disco", chassi: "Caixa Central Integrada", preco: "R$ 7.500,00" },
        { id: "z8-n95c", name: "Z8 N95C MAX COMFORT", tag: "SCOOTER EXECUTIVA (DB039)", file: "z8_n95c_studio.jpg", motor: "1200W 27H 30A", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "Disco Diant. / Tambor", chassi: "Aco Protecao Lateral", preco: "R$ 8.000,00" },
        { id: "z8-h26", name: "Z8 H26 STANDARD", tag: "MAIS VENDIDO (DB001)", file: "z8_n7_studio.jpg", motor: "1200W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "180mm Duplo Disco", chassi: "Aco Leve e Resistente", preco: "R$ 9.500,00" },
        { id: "z8-q11", name: "Z8 Q11 COMPACT", tag: "CANDY COM BAU (DB043)", file: "z8_q10_studio.jpg", motor: "1000W 9G", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 45)", freio: "180mm Disco Diant.", chassi: "Bau de Serie na Cor", preco: "R$ 9.300,00" },
        { id: "z8-n710", name: "Z8 N710 URBAN PLUS", tag: "LANCAMENTO (DB045-N710)", file: "z8_n710_studio.jpg", motor: "1200W sem escova", bat: "Litio 60V 20Ah", aut: "Ate 50 km", vel: "32 km/h (Max 50)", freio: "180mm Duplo Disco", chassi: "Urban Plus Reforcado", preco: "R$ 9.500,00" },
        { id: "z8-q10", name: "Z8 Q10 VINTAGE", tag: "RETRO XIAO Q (DB038)", file: "z8_q11_studio.jpg", motor: "1200W 30A", bat: "60V 20Ah (ate 120Ah)", aut: "Ate 50-240 km", vel: "32 km/h (Max 45)", freio: "Disco Diant. / Tambor", chassi: "Aco Estilo Italiano", preco: "R$ 9.800,00" },
        { id: "z8-gs005", name: "Z8 GS-005 BASE NORTE", tag: "E-BIKE UTILITARIA (GS-005)", file: "z8_gs005_studio.jpg", motor: "500W Cobre Puro", bat: "Litio 48V 20Ah", aut: "Ate 40-50 km", vel: "28-32 km/h", freio: "Tambor Diant. e Tras.", chassi: "Aco de Trabalho", preco: "R$ 4.200,00" },
        { id: "z8-diamond", name: "Z8 DIAMOND LUXE", tag: "LITTLE KING KONG (GS-052)", file: "z8_diamond_studio.jpg", motor: "500W Cobre Puro", bat: "Litio 48V 20Ah", aut: "Ate 40-50 km", vel: "32 km/h (Max 40)", freio: "Tambor Diant. e Tras.", chassi: "Aro 16 Pneu 3.0 Largo", preco: "R$ 4.800,00" }
    ];'''

assert old_block in text, "old_block not found in JSX"
text = text.replace(old_block, new_block)

with open('scripts/GERAR_CATALOGO_ILUSTRATOR_Z8.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("GERAR_CATALOGO_ILUSTRATOR_Z8.jsx updated with factory specs!")
