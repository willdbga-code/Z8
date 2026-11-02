import sys
with open('site-principal/portal-lojista-laf.js', 'r', encoding='utf-8') as f:
    c = f.read()

sys.stdout.reconfigure(encoding='utf-8')
idx = c.find("document.getElementById('laf-order-checkout-form')")
if idx == -1:
    idx = c.find("'laf-order-checkout-form'")
    idx = c.find("'laf-order-checkout-form'", idx+1)
print(c[idx:idx+2500])
