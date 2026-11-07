import re

with open('public/assets/lando/lando-engine.js', 'r', encoding='utf-8') as f:
    c = f.read()

events = re.findall(r'dispatchEvent\(new \w+\(([\'"][^\'"]+[\'"])', c)
print('Events dispatched:', set(events))

# Also search for "Page enter completed"
idx = c.find('Page enter completed')
if idx != -1:
    print('Context around Page enter completed:')
    print(c[idx-100:idx+300])
