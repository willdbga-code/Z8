import re

with open('conceito/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'(<(?:h1|h2|h3|h4|p|div|span)[^>]+(?:split-text|data-anim)[^>]*>)(.*?)(?:</)', html)
print(f"Total animated text elements in conceito/index.html: {len(matches)}")
for idx, (tag, text) in enumerate(matches[:25]):
    clean_text = re.sub(r'<[^>]+>', '', text).strip()[:60]
    print(f"{idx+1}: {tag[:80]}... -> \"{clean_text}\"")
