import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

function element(dataset = {}) {
	const attributes = {};
	const classes = new Set();
	return {
		dataset,
		attributes,
		classList: {
			add(name) { classes.add(name); },
			remove(name) { classes.delete(name); },
			toggle(name, force) { if (force) classes.add(name); else classes.delete(name); },
			contains(name) { return classes.has(name); },
		},
		listeners: {},
		addEventListener(type, callback) { this.listeners[type] = callback; },
		setAttribute(name, value) { attributes[name] = value; },
		removeAttribute(name) { delete attributes[name]; },
	};
}

test('choosing a finish updates its product details, links, and accessible selected state', async () => {
	const script = await readFile(new URL('../public/js/luxury.js', import.meta.url), 'utf8');
	let onReady;
	const firstChoice = element({ title: 'Ouro & lapidação', name: 'Imperial Pavé', finish: 'Ouro 24K', description: 'Ouro polido', count: '03 edições', image: '/one.jpg', alt: 'Fone dourado', slug: 'imperial-pave' });
	const selectedChoice = element({ title: 'Noir técnico', name: 'Obsidian Stage', finish: 'Preto · Filete dourado', description: 'Linhas escuras', count: '02 edições', image: '/two.jpg', alt: 'Fone preto', slug: 'obsidian-stage' });
	const choices = [firstChoice, selectedChoice];
	const targets = {
		'[data-material-stage]': element(),
		'[data-material-image]': element(),
		'[data-material-title]': element(),
		'[data-material-name]': element(),
		'[data-material-finish]': element(),
		'[data-material-description]': element(),
		'[data-material-count]': element(),
		'[data-material-detail]': element(),
		'[data-material-route]': element(),
	};
	const selector = {
		querySelectorAll: () => choices,
		querySelector: key => targets[key],
	};
	targets['[data-material-image]'].attributes.srcset = '/_astro/imperial.webp 1254w';
	targets['[data-material-image]'].attributes.sizes = '100vw';
	const document = {
		addEventListener(_event, callback) { onReady = callback; },
		querySelector: key => key === '[data-material-selector]' ? selector : null,
		querySelectorAll: () => [],
		getElementById: () => null,
	};
	class IntersectionObserver { observe() {} disconnect() {} }
	const window = { matchMedia: () => ({ matches: false }), addEventListener() {}, innerHeight: 800 };

	runInNewContext(script, { document, window, IntersectionObserver, requestAnimationFrame: callback => callback() });
	onReady();
	assert.equal(typeof selectedChoice.listeners.click, 'function', 'finish choices should react to selection');
	selectedChoice.listeners.click();

	assert.equal(targets['[data-material-image]'].src, '/two.jpg');
	assert.equal(targets['[data-material-image]'].attributes.srcset, undefined, 'dynamic image changes should discard the initial Astro srcset');
	assert.equal(targets['[data-material-image]'].alt, 'Fone preto');
	assert.equal(targets['[data-material-title]'].textContent, 'Noir técnico');
	assert.equal(targets['[data-material-name]'].textContent, 'Obsidian Stage');
	assert.equal(targets['[data-material-finish]'].textContent, 'Preto · Filete dourado');
	assert.equal(targets['[data-material-description]'].textContent, 'Linhas escuras');
	assert.equal(targets['[data-material-count]'].textContent, '02 edições');
	assert.equal(targets['[data-material-detail]'].href, '/produtos/obsidian-stage');
	assert.equal(targets['[data-material-route]'].href, '#product-obsidian-stage');
	assert.equal(targets['[data-material-stage]'].classList.contains('is-transitioning'), true, 'changing finish should animate the stage');
	assert.equal(selectedChoice.attributes['aria-pressed'], 'true');
	assert.equal(firstChoice.attributes['aria-pressed'], 'false');
});
