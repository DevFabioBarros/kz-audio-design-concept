import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('404 page communicates the missing page and offers routes back into the site', async () => {
	const page = await readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');

	assert.match(page, /<Layout[\s\S]*title="404/);
	assert.match(page, /<h1[^>]*>Esta página não está/);
	assert.match(page, /not-found__code[^>]*>404<\/span>/);
	assert.match(page, /href="\/"/);
	assert.match(page, /href="\/catalogo"/);
});
