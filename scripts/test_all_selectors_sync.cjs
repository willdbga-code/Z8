const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/conceito-2/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Testing sync across all areas...');

  const results = await page.evaluate(() => {
    // 1. Check store existence
    const store = window.Z8_WHOLESALE_ORDER_STORE;
    if (!store) return { error: 'No Z8_WHOLESALE_ORDER_STORE found' };

    // Get initial FX-12 qty
    const initialQty = store.getQty('z8-fx12');

    // Simulate clicking + on laf-card-qty or calling adjustLafQty('z8-fx12', 1)
    window.adjustLafQty('z8-fx12', 2);

    const qtyAfterCard = store.getQty('z8-fx12');

    // Check all DOM elements representing z8-fx12
    const tableInput = document.getElementById('order-qty-z8-fx12');
    const cardInput = document.getElementById('laf-card-qty-z8-fx12');
    const cardQty = document.getElementById('card-qty-z8-fx12');
    const selectedItem = document.querySelector('[data-order-item-id="z8-fx12"]');

    return {
      initialQty,
      qtyAfterCard,
      tableInputValue: tableInput ? tableInput.value : 'not found',
      cardInputValue: cardInput ? cardInput.value : 'not found',
      cardQtyText: cardQty ? cardQty.textContent : 'not found',
      selectedItemFound: !!selectedItem,
      totals: store.getTotals()
    };
  });

  console.log('Sync test results:', JSON.stringify(results, null, 2));

  await browser.close();
})();
