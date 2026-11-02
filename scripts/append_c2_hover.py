with open('scripts/update_c2_hover_css.py', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('replacement_hover = """') + len('replacement_hover = """')
end = text.find('"""', start)
css_block = text[start:end]

with open('conceito-2/style.css', 'a', encoding='utf-8') as f:
    f.write('\n\n' + css_block)

print("Appended hover styling to conceito-2/style.css successfully!")
