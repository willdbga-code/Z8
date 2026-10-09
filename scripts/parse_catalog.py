import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'docs/laf_extracted/pages_text.json', encoding='utf-8') as f:
    data = json.load(f)

for p in data:
    lines = p.get('lines', [])
    if lines:
        print(f"\n==================== Page {p['page']} ====================")
        for i, l in enumerate(lines):
            print(f"[{i:02d}] {l}")
