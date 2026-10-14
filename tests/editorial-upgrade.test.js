import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('home combines atelier storytelling and removes the repeated design fold', async () => {
	const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

	assert.match(home, /atelier-finish-notes/, 'atelier should surface the collection finishes');
	assert.doesNotMatch(home, /class="design-fold"/, 'the repeated design section should be removed');
	assert.match(home, /class="sound-fold"/, 'the sound experience section should remain');
});

test('product details show a visual dossier with the existing illustrative price and concept status', async () => {
	const detail = await readFile(new URL('../src/pages/produtos/[slug].astro', import.meta.url), 'utf8');

	assert.match(detail, /detail-dossier/, 'product details should group edition facts in a dossier');
	assert.match(detail, /product\.price/, 'the dossier should use the existing illustrative product price');
	assert.match(detail, /Conceito visual não oficial/, 'the existing non-official concept disclaimer should remain');
	assert.match(detail, /data-contact-prototype/, 'the contact prototype should remain available');
});
