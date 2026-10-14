document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initMaterialSelector();
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

function initMaterialSelector() {
  const selector = document.querySelector('[data-material-selector]');
  if (!selector) return;

  const choices = Array.from(selector.querySelectorAll('[data-material-choice]'));
  const stage = selector.querySelector('[data-material-stage]');
  const image = selector.querySelector('[data-material-image]');
  const title = selector.querySelector('[data-material-title]');
  const name = selector.querySelector('[data-material-name]');
  const finish = selector.querySelector('[data-material-finish]');
  const description = selector.querySelector('[data-material-description]');
  const count = selector.querySelector('[data-material-count]');
  const detail = selector.querySelector('[data-material-detail]');
  const route = selector.querySelector('[data-material-route]');
  if (!choices.length || !stage || !image || !title || !name || !finish || !description || !count || !detail || !route) return;

  choices.forEach(choice => {
    choice.addEventListener('click', () => {
      if (choice.classList.contains('is-selected')) return;

      choices.forEach(option => {
        const selected = option === choice;
        option.setAttribute('aria-pressed', String(selected));
        option.classList.toggle('is-selected', selected);
      });

      const { title: selectedTitle, name: selectedName, finish: selectedFinish, description: selectedDescription, count: selectedCount, image: selectedImage, alt, slug } = choice.dataset;
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.src = selectedImage;
      image.alt = alt;
      title.textContent = selectedTitle;
      name.textContent = selectedName;
      finish.textContent = selectedFinish;
      description.textContent = selectedDescription;
      count.textContent = selectedCount;
      detail.href = `/produtos/${slug}`;
      detail.setAttribute('aria-label', `Conheça ${selectedName}`);
      route.href = `#product-${slug}`;
      route.setAttribute('aria-label', `Encontrar ${selectedName} no catálogo`);
      stage.classList.remove('is-transitioning');
      requestAnimationFrame(() => stage.classList.add('is-transitioning'));
    });
  });
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
          if (event.animationName !== 'finish-sheen-pass') return;
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
