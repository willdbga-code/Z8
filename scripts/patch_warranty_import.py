with open('conceito/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """} from '../site-principal/catalog-auth.js';"""

replacement = """} from '../site-principal/catalog-auth.js';
import {
  getStoredWarrantyOrders,
  getWarrantyOrdersForUser,
  saveWarrantyOrder,
  updateWarrantyOrderStatus,
  fetchWarrantyOrdersFromFirestore
} from '../site-principal/data/warranty-db.js';"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open('conceito/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added warranty-db imports to conceito/app.js")
else:
    print("Target not found in conceito/app.js")
