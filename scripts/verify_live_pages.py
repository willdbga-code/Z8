import urllib.request
import re

for url, expected_name in [
    ('http://localhost:3000/conceito/', 'Conceito 1'),
    ('http://localhost:3000/conceito-2/', 'Conceito 2')
]:
    req = urllib.request.urlopen(url)
    html = req.read().decode('utf-8')
    print(f"=== {expected_name} ({url}) ===")
    print(f"Status: {req.status}")
    print(f"Length: {len(html)}")
    
    # Check for Tank 2 and FX-12
    tank2_found = 'z8-tank-2' in html or 'Tank 2' in html
    fx12_found = 'z8-fx12' in html or 'FX-12' in html
    print(f"Tank 2 present: {tank2_found}")
    print(f"FX-12 present: {fx12_found}")
    
    # Check for reveal-img (hover backdrop)
    reveal_imgs = len(re.findall(r'helmet-grid-item-reveal-img', html))
    print(f"Hover backdrop images in HTML: {reveal_imgs}")
