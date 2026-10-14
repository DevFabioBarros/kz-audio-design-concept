document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initMaterialRouteHighlights();
});

function initScrollAnimations() {
  const hero = document.querySelector('.film-hero');
  const heroVideo = hero?.querySelector('.film-video');
  const heroCaption = hero?.querySelector('.film-caption');
  const heroCopy = heroCaption?.querySelector('.film-copy');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .expand-line');

  if (reduceMotion) {
    heroVideo?.pause();
    revealElements.forEach(element => element.classList.add('is-active'));
    return;
  }

  window.addEventListener('scroll', () => {
    if (!hero || !heroVideo) return;

    const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
    heroVideo.style.transform = `scale(${1.08 - progress * 0.08}) translateY(${progress * 18}px)`;
    heroCaption?.style.setProperty('--hero-scroll-shift', `${progress * 64}px`);
    if (heroCopy) heroCopy.style.opacity = `${1 - progress * 1.25}`;
  }, { passive: true });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-active');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(element => observer.observe(element));
}

function initHeaderScroll() {
  const header = document.getElementById('luxury-nav-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

function initMaterialRouteHighlights() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let pendingHighlight;
  const viewportInset = Math.min(220, window.innerHeight * 0.28);
  document.querySelectorAll('.material-route').forEach(route => {
    route.addEventListener('click', () => {
      const target = document.querySelector(route.hash);
      if (!target) return;

      pendingHighlight?.disconnect();
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        target.classList.remove('is-shining');
        const finishShine = event => {
          if (event.target !== target || event.animationName !== 'product-frame-glow') return;
          target.classList.remove('is-shining');
          target.removeEventListener('animationend', finishShine);
        };
        target.addEventListener('animationend', finishShine);
        requestAnimationFrame(() => target.classList.add('is-shining'));
      }, { rootMargin: `-${viewportInset}px 0px -${viewportInset}px 0px` });

      pendingHighlight = observer;
      observer.observe(target);
    });
  });
}
