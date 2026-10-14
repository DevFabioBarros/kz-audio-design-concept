import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('product introduction offers an accessible finish selector and keeps direct catalog navigation', async () => {
	const page = await readFile(new URL('../src/pages/catalogo.astro', import.meta.url), 'utf8');
	const grid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');

	assert.ok(page.includes('materialJourneys'), 'catalog should organize editions by visual material');
	assert.ok(page.includes('data-material-selector'), 'catalog should render the interactive finish selector');
	assert.ok(page.includes('data-material-choice') && page.includes('aria-pressed'), 'finish options should be keyboard-accessible buttons with selected state');
	assert.ok(page.includes('data-material-image') && page.includes('data-material-detail'), 'the selected finish should update a real product image and details link');
	assert.ok(page.includes('class="material-route"'), 'the selector should retain its direct jump to the matching catalog card');
	assert.ok(!page.includes('collection-calibre') && !page.includes('collection-dial'), 'catalog should not render the rejected dial');
	assert.ok(page.includes('#product-${initialJourney.product.slug}'), 'the selected finish should target its representative product');
	assert.ok(grid.includes('product-${product.slug}'), 'each product card should expose its matching anchor');
	assert.ok(!page.includes('data-edition-toggle') && !page.includes('data-edition-duplicate'), 'catalog should not retain carousel controls or duplicate items');
	assert.ok(!page.includes('edition-index.js'), 'catalog should not load the removed carousel behavior');
});
