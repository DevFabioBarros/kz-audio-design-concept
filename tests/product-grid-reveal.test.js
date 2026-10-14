import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('product cards reveal individually as each one enters the viewport', async () => {
	const grid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');

	assert.match(grid, /class="product-grid"/, 'the grid must not activate every card as one staggered group');
	assert.match(grid, /class:list=\{\['product-card', 'reveal'/, 'each card must use the shared per-element scroll reveal');
});
