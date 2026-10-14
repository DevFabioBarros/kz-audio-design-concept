import { gsap } from 'gsap';

const section = document.querySelector('[data-edition-index]');
const viewport = section?.querySelector('.edition-index-window');
const rail = section?.querySelector('[data-edition-rail]');
const group = rail?.querySelector('.edition-index-group');
const duplicate = section?.querySelector('[data-edition-duplicate]');
const toggle = section?.querySelector('[data-edition-toggle]');

if (section && viewport && rail && group && duplicate && toggle && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
	duplicate.hidden = false;
	toggle.hidden = false;
	viewport.classList.add('is-moving');

	const carousel = gsap.to(rail, {
		x: () => -group.offsetWidth,
		duration: () => group.offsetWidth / 38,
		ease: 'none',
		repeat: -1,
	});
	let userPaused = false;

	const setPaused = (paused) => {
		userPaused = paused;
		carousel.paused(paused);
		toggle.setAttribute('aria-pressed', String(paused));
		toggle.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
	};

	toggle.addEventListener('click', () => setPaused(!userPaused));
	viewport.addEventListener('focusin', () => carousel.pause());
	viewport.addEventListener('focusout', (event) => {
		if (!viewport.contains(event.relatedTarget) && !userPaused) carousel.play();
	});
}
