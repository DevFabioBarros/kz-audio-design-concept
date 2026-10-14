import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

async function filesIn(directory) {
	const entries = await readdir(new URL(directory, import.meta.url), { withFileTypes: true });
	const nested = await Promise.all(entries.map(entry => entry.isDirectory()
		? filesIn(`${directory}/${entry.name}`)
		: [`${directory}/${entry.name}`]));
	return nested.flat();
}

test('visual assets live in src/assets and Astro templates use Astro assets for images', async () => {
	const publicFiles = await filesIn('../public');
	const assetFiles = await filesIn('../src/assets');
	const astroFiles = (await filesIn('../src')).filter(path => path.endsWith('.astro'));
	const source = await Promise.all(astroFiles.map(path => readFile(new URL(path, import.meta.url), 'utf8')));
	const productData = await readFile(new URL('../src/data/products.ts', import.meta.url), 'utf8');
	const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
	const productGrid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');
	const productDetail = await readFile(new URL('../src/pages/produtos/[slug].astro', import.meta.url), 'utf8');
	const stylesheet = await readFile(new URL('../src/styles/luxury.css', import.meta.url), 'utf8');
	const assetPaths = assetFiles.map(path => path.replaceAll('\\', '/'));

	assert.ok(publicFiles.every(path => !/\.(?:png|jpe?g|webp|gif|svg|ico|mp4|webm|mov)$/i.test(path)), 'public should not contain image, icon, logo, or video files');
	for (const asset of ['products/imperial-pave-detail.png', 'logos/kz-mark.svg', 'logos/rolex.png', 'icons/favicon.svg', 'icons/grain.svg', 'media/comercial-2.mp4']) {
		assert.ok(assetPaths.some(path => path.endsWith(`/assets/${asset}`)), `${asset} should be stored in src/assets`);
	}
	assert.ok(!assetPaths.some(path => path.endsWith('/assets/icons/favicon.ico')), 'the invalid duplicate ICO favicon should be removed');
	assert.ok(!assetPaths.some(path => path.endsWith('/assets/products/mirrored-24k.jpg')), 'the unused non-detail Mirrored 24K image should be removed');
	assert.match(layout, /favicon\.svg\?url&no-inline/, 'the SVG favicon should be emitted as an external file URL');
	assert.doesNotMatch(layout, /favicon\.ico/, 'the broken ICO fallback should no longer be linked');
	assert.doesNotMatch(stylesheet, /@import\s+url\(['"]https:\/\/fonts\.googleapis\.com/i, 'Google Fonts should not be requested again from the render-blocking stylesheet');
	assert.equal((layout.match(/<link href="https:\/\/fonts\.googleapis\.com/g) ?? []).length, 1, 'Google Fonts should have a single stylesheet request');
	assert.ok(source.every(content => !/<img\b/i.test(content)), 'Astro pages should render raster images with Astro Image');
	assert.ok(source.some(content => /import\s*\{\s*Image\s*\}\s*from\s*['"]astro:assets['"]/.test(content)), 'pages should use Astro Image');
	assert.doesNotMatch(stylesheet, /data:image/i, 'CSS should reference stored assets instead of embedding image data');
	assert.match(stylesheet, /\.\.\/assets\/icons\/grain\.svg/, 'the CSS texture should be bundled from src/assets');
	assert.match(productData, /\.\.\/assets\/products\//, 'product imagery should be imported from src/assets');
	assert.match(productGrid, /loading=\"lazy\"/, 'catalog images should load only as they approach the viewport');
	assert.match(productGrid, /layout=\"constrained\"[^>]*sizes=/, 'catalog images should offer responsive sizes for smaller screens');
	assert.match(productDetail, /loading=\"eager\"[^>]*fetchpriority=\"high\"/, 'the product detail image should not be lazy-loaded when it is the page focus');
});

test('homepage hero poster loads eagerly with high fetch priority', async () => {
	const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
	assert.match(home, /class="film-poster"[^>]*loading="eager"[^>]*fetchpriority="high"/, 'the hero poster should be prioritized as the main first-fold image');
});
