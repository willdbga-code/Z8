with open('docs/BRAIN_NOTEBOOK.md', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length of BRAIN_NOTEBOOK.md:", len(text))
print("Last 800 chars:")
print(text[-800:])
