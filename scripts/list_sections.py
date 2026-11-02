import re

for path in ['conceito-2/index.html', 'conceito/index.html']:
    print('===', path, '===')
    lines = open(path, encoding='utf-8').readlines()
    for i, line in enumerate(lines):
        if '<section' in line or '<footer' in line:
            m = re.search(r'id=["\']([^"\']+)["\']', line)
            id_str = m.group(1) if m else ''
            print(f'{i+1}: {line.strip()[:80]}  [ID: {id_str}]')
