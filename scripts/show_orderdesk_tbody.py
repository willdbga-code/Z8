import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('conceito-2/app.js', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for i, l in enumerate(lines):
    if 'orderdesk-table-body' in l:
        print(''.join(lines[max(0, i-5):min(len(lines), i+35)]))
        break
