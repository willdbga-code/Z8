import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/index.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'z8-orderdesk-table' in l:
        print(f"Line {i+1}")
        print(''.join(lines[max(0, i-5):min(len(lines), i+30)]))
        break
