import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('layout exposes canonical Open Graph and Twitter metadata with absolute social images', async () => {
	const layout = await readFile(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
	const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');

	assert.match(layout, /image\??:\s*string\s*\|\s*ImageMetadata/, 'layout should accept a URL or an imported Astro image');
	assert.match(layout, /canonicalURL\s*=\s*new URL\(Astro\.url\.pathname, Astro\.site \?\? Astro\.url\)\.href/, 'canonical URLs should use the configured site and current pathname');
	assert.match(layout, /new URL\([^\n]*Astro\.site \?\? Astro\.url\)\.href/, 'social image URLs should be absolute on production and in development');
	assert.match(layout, /getImage\(\{\s*src:\s*image,\s*width:\s*1200,\s*height:\s*630,\s*fit:\s*'cover',\s*format:\s*'jpg'/, 'social cards should use a generated, landscape JPEG');
	assert.match(layout, /og:image:width/);
	assert.match(layout, /og:image:height/);
	assert.match(layout, /og:image:alt/);
	assert.match(layout, /twitter:image:alt/);
	for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
		assert.ok(layout.includes(tag), `${tag} should be emitted`);
	}
	assert.match(config, /site:\s*['"]https:\/\/kz-audio-design-concept\.vercel\.app['"]/, 'Astro should know the deployed canonical origin');
});

test('every route supplies a social preview image suited to its content', async () => {
	const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
	const catalog = await readFile(new URL('../src/pages/catalogo.astro', import.meta.url), 'utf8');
	const detail = await readFile(new URL('../src/pages/produtos/[slug].astro', import.meta.url), 'utf8');

	assert.match(home, /<Layout[\s\S]*?image=\{products\[0\]\.image\}/, 'home should use its featured product image');
	assert.match(catalog, /<Layout[\s\S]*?image=\{products\[2\]\.image\}/, 'catalog should use a collection image');
	assert.match(detail, /<Layout[\s\S]*?image=\{product\.image\}/, 'each product detail should use its own image');
	assert.match(detail, /imageAlt=\{product\.alt\}/, 'each product detail should provide descriptive image alt text for social cards');
});
