import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('home combines atelier storytelling and removes the repeated design fold', async () => {
	const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

	assert.match(home, /atelier-finish-notes/, 'atelier should surface the collection finishes');
	assert.doesNotMatch(home, /class="design-fold"/, 'the repeated design section should be removed');
	assert.match(home, /class="sound-fold"/, 'the sound experience section should remain');
});

test('mobile hero avoids loading the background video and displays its prioritized poster', async () => {
	const home = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
	const script = await readFile(new URL('../public/js/luxury.js', import.meta.url), 'utf8');

	assert.match(home, /<video[^>]*data-src=\{commercialFilm\}[^>]*preload="none"/s, 'video source should be deferred until JavaScript opts into desktop playback');
	assert.match(home, /<video[^>]*data-poster=\{filmPoster\.src\}/s, 'the video poster should also be deferred because mobile already renders its own poster image');
	assert.doesNotMatch(home, /<video[^>]*\ssrc=\{commercialFilm\}/, 'the browser must not download the video before the viewport is checked');
	assert.match(home, /@media \(max-width: 700px\)[\s\S]*?\.film-video \{ display: none; \}[\s\S]*?\.film-poster \{ display: block; \}/, 'mobile should show the eager poster instead of video');
	assert.match(home, /\.film-hero \.film-poster \{ display: block; \}[\s\S]*?\.film-hero\.has-film-video \.film-video \{ display: block; \}/, 'poster should remain a fallback until desktop video playback is activated');
	assert.match(script, /matchMedia\('\(min-width: 701px\) and \(prefers-reduced-motion: no-preference\)'\)/, 'video playback should be limited to larger viewports that allow motion');
	assert.match(script, /heroVideo\.poster = heroVideo\.dataset\.poster/, 'the video poster should be loaded only on larger viewports');
	assert.match(script, /hero\.classList\.add\('has-film-video'\)/, 'desktop playback should replace the poster only after JavaScript activates the video');
});

test('mobile scroll reveals keep opacity and transform without animating blur filters', async () => {
	const stylesheet = await readFile(new URL('../src/styles/luxury.css', import.meta.url), 'utf8');

	assert.match(stylesheet, /@media \(max-width: 700px\)\s*\{[\s\S]*?\.reveal,[\s\S]*?filter: none;[\s\S]*?transition-property: opacity, transform;/, 'mobile reveal animations should avoid non-composited filter changes');
});

test('product details show a visual dossier with the existing illustrative price and concept status', async () => {
	const detail = await readFile(new URL('../src/pages/produtos/[slug].astro', import.meta.url), 'utf8');

	assert.match(detail, /detail-dossier/, 'product details should group edition facts in a dossier');
	assert.match(detail, /product\.price/, 'the dossier should use the existing illustrative product price');
	assert.match(detail, /Conceito visual não oficial/, 'the existing non-official concept disclaimer should remain');
	assert.match(detail, /data-contact-prototype/, 'the contact prototype should remain available');
});
