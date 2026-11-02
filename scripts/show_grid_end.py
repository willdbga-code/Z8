import sys
with open('conceito/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx_start = c.find('data-helmet-grid=""')
idx_end = c.find('</div>\n              </div>\n            </div>', idx_start)
if idx_end == -1:
    idx_end = c.find('<!-- ==================== SECTION 8:', idx_start)
print("Start:", idx_start, "End:", idx_end)
print(c[idx_end-200:idx_end+200])
