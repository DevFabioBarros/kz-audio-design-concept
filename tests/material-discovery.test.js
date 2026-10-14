import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('product introduction groups the collection into direct, static material routes', async () => {
	const page = await readFile(new URL('../src/pages/produtos.astro', import.meta.url), 'utf8');
	const grid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');

	assert.ok(page.includes('materialJourneys'), 'catalog should organize editions by visual material');
	assert.ok(page.includes('material-discovery-links'), 'catalog should render a visual route selector');
	assert.ok(!page.includes('collection-calibre') && !page.includes('collection-dial'), 'catalog should not render the rejected dial');
	assert.ok(page.includes('#product-${journey.product.slug}'), 'each route should target its featured product');
	assert.ok(grid.includes('product-${product.slug}'), 'each product card should expose its matching anchor');
	assert.ok(!page.includes('data-edition-toggle') && !page.includes('data-edition-duplicate'), 'catalog should not retain carousel controls or duplicate items');
	assert.ok(!page.includes('edition-index.js'), 'catalog should not load the removed carousel behavior');
});
