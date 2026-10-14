import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

test('material routes trigger a one-pass gold sheen on the destination product card', async () => {
	const script = await readFile(new URL('../src/scripts/luxury.js', import.meta.url), 'utf8');
	const grid = await readFile(new URL('../src/components/ProductGrid.astro', import.meta.url), 'utf8');
	const detail = await readFile(new URL('../src/pages/produtos/[slug].astro', import.meta.url), 'utf8');
	let onReady;
	let observerCallback;
	const route = { hash: '#product-example', addEventListener(_type, callback) { this.onClick = callback; } };
	const classes = new Set();
	const target = {
		classList: {
			add(value) { classes.add(value); },
			remove(value) { classes.delete(value); },
		},
		listeners: {},
		addEventListener(type, callback) { this.listeners[type] = callback; },
		removeEventListener(type) { delete this.listeners[type]; },
		querySelector() { return null; },
		append() {},
	};
	class TestIntersectionObserver {
		constructor(callback) { observerCallback = callback; }
		observe() {}
		disconnect() {}
	}
	const document = {
		addEventListener(_type, callback) { onReady = callback; },
		querySelector(selector) { return selector === route.hash ? target : null; },
		querySelectorAll(selector) { return selector === '.material-route' ? [route] : []; },
		getElementById() { return null; },
		createElementNS() { return { setAttribute() {}, append() {}, addEventListener() {} }; },
	};
	const window = { innerHeight: 800, matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {} };

	runInNewContext(script, { document, window, IntersectionObserver: TestIntersectionObserver, AbortController, requestAnimationFrame: callback => callback() });
	onReady();
	const click = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
	route.onClick(click);
	assert.equal(classes.has('is-shining'), false, 'the effect must wait until the destination reaches the viewport');
	observerCallback([{ isIntersecting: true }]);

	assert.equal(click.defaultPrevented, false, 'the native anchor must still perform its jump');
	assert.equal(classes.has('is-shining'), true, 'the destination card must catch the light');
	target.listeners.animationend({ target: route, animationName: 'finish-sheen-pass' });
	assert.equal(classes.has('is-shining'), false, 'the glow must end after its single pass');
	assert.match(grid, /finish-sheen/, 'the product image must receive a shared soft reflected highlight');
	assert.match(detail, /detail-image[^\n]*finish-sheen|finish-sheen[^\n]*detail-image/, 'product detail imagery must use the same highlight treatment');
	assert.doesNotMatch(grid, /product-frame-glow/, 'the selected card must not draw a glowing frame');
});
