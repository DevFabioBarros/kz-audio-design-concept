import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

test('collection uses /catalogo while product details keep /produtos/:slug', async () => {
	const pages = await readdir(new URL('../src/pages/', import.meta.url));
	const catalog = await readFile(new URL('../src/pages/catalogo.astro', import.meta.url), 'utf8').catch(() => '');
	const sources = await Promise.all([
		'src/components/Header.astro',
		'src/components/Footer.astro',
		'src/pages/index.astro',
		'src/pages/produtos/[slug].astro',
	].map(path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')));

	assert.ok(pages.includes('catalogo.astro'), 'the collection page should have the /catalogo route');
	assert.equal(catalog.includes('class="catalog-page"'), true, 'the catalog page content should live on /catalogo');
	assert.ok(sources.every(source => !/href="\/produtos(?:["#])/.test(source)), 'collection links should no longer point to the old /produtos URL');
	assert.match(sources[3], /href=\{`\/produtos\/\$\{previousProduct\.slug\}`\}/, 'product detail routes should remain under /produtos/:slug');
});

test('page headings use one H1 and do not skip a heading level', async () => {
	const paths = [
		'../src/pages/index.astro',
		'../src/pages/catalogo.astro',
		'../src/pages/produtos/[slug].astro',
	];
	const pages = await Promise.all(paths.map(path => readFile(new URL(path, import.meta.url), 'utf8').catch(() => '')));
	const footer = await readFile(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');

	for (const [index, page] of pages.entries()) {
		assert.ok(page, `route source ${paths[index]} should exist`);
		const levels = [...page.matchAll(/<h([1-6])\b/g)].map(([, level]) => Number(level));
		assert.equal(levels.filter(level => level === 1).length, 1, `${paths[index]} should have exactly one H1`);
		for (let i = 1; i < levels.length; i++) assert.ok(levels[i] <= levels[i - 1] + 1, `${paths[index]} should not skip heading levels`);
	}

	assert.doesNotMatch(footer, /<h[4-6]\b/, 'shared footer headings should not jump to H4 or beyond');
});
