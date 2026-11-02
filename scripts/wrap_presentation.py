# Wrap prelogin presentation in both conceito-2 and conceito

def wrap_presentation(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_marker = '<!-- ==================== SECTION 1 & 2: STICKY HERO + MARQUEE ==================== -->'
    end_marker = '<!-- ==================== PORTAL DO LOJISTA'

    if '<div id="z8-public-presentation-wrap"' in content:
        print(f"Already wrapped in {file_path}")
        return

    if start_marker in content and end_marker in content:
        content = content.replace(
            start_marker,
            '<div id="z8-public-presentation-wrap" class="z8-public-presentation-wrap">\n        ' + start_marker
        )
        content = content.replace(
            end_marker,
            '</div><!-- /z8-public-presentation-wrap -->\n\n        ' + end_marker
        )
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully wrapped presentation in {file_path}")
    else:
        print(f"Markers not found in {file_path}")

wrap_presentation('conceito-2/index.html')
wrap_presentation('conceito/index.html')
