import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('edition index is a continuous, pausable carousel with accessible mobile fallback', async () => {
	const page = await readFile(new URL('../src/pages/produtos.astro', import.meta.url), 'utf8');
	const grid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');

	assert.ok(page.includes('data-edition-index'), 'catalog should render an edition index');
	assert.ok(!page.includes('collection-calibre') && !page.includes('collection-dial'), 'catalog should not render the rejected dial');
	assert.ok(page.includes('#product-${product.slug}'), 'each index item should target its product card');
	assert.ok(grid.includes('product-${product.slug}'), 'each product card should expose its matching anchor');
	assert.ok(page.includes('data-edition-duplicate'), 'carousel should repeat the editions for a seamless loop');
	assert.ok(page.includes('data-edition-toggle'), 'people should be able to pause the moving carousel');
	const animation = await readFile(new URL('../src/scripts/edition-index.js', import.meta.url), 'utf8');
	assert.ok(animation.includes('repeat: -1'), 'carousel should loop continuously');
	assert.ok(animation.includes('prefers-reduced-motion'), 'carousel should respect reduced-motion preferences');
	assert.ok(animation.includes('aria-pressed'), 'pause control should communicate its state');
});
