with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('${m.category} // ${m.pn}', "${m.categoryLabel || m.categoryKey || 'OFICIAL'} // ${m.pn}")

with open('site-principal/portal-lojista-laf.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed category label in site-principal/portal-lojista-laf.js")
