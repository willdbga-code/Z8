import sys
import os

# Read update_c1_cards.py text or define directly
exec(open('scripts/update_c1_cards.py', encoding='utf-8').read().split('with open(\'conceito/index.html\'')[0])
exec(open('scripts/update_c1_fleet.py', encoding='utf-8').read().split('with open(\'conceito/app.js\'')[0])

cards_html = "\n".join([render_card(m, i) for i, m in enumerate(MODELS_CONFIG)])

with open('conceito-2/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

grid_start = html.find('<div data-helmet-grid="" role="list" class="helmet-grid w-dyn-items">')
if grid_start != -1:
    content_start = grid_start + len('<div data-helmet-grid="" role="list" class="helmet-grid w-dyn-items">')
    grid_end = html.find('</div>\n              </div>\n            </div>\n          </section>', content_start)
    if grid_end == -1:
        grid_end = html.find('<!-- ====================', content_start)

    new_html = html[:content_start] + "\n" + cards_html + "\n" + html[grid_end:]
    with open('conceito-2/index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Updated conceito-2/index.html with all 13 cards")
else:
    print("Could not find data-helmet-grid in conceito-2/index.html")

# Update Z8_FLEET in conceito-2/app.js too
with open('conceito-2/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

idx_start = app_js.find('const Z8_FLEET = [')
if idx_start != -1:
    idx_end = app_js.find('];', idx_start) + 2
    app_js = app_js[:idx_start] + NEW_FLEET_CODE + app_js[idx_end:]
    with open('conceito-2/app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Updated Z8_FLEET in conceito-2/app.js with all 13 models")
