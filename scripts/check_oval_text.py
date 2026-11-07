with open('conceito/index.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'data-oval-scroll' in l:
        print(f"Line {i+1}:")
        print(''.join(lines[i:i+10]))
