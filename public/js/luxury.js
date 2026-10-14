document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCollectionScrollFilm();
  initHeaderScroll();
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

function initCollectionScrollFilm() {
  const track = document.querySelector('[data-scroll-film]');
  const video = track?.querySelector('[data-scroll-film-video]');
  if (!track || !video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const progressLabel = track.querySelector('[data-scroll-film-progress]');
  let frameRequest = 0;
  let targetTime = 0;
  let displayedTime = 0;
  let lastTimestamp = 0;
  let lastSeek = 0;
  track.classList.add('is-scroll-active');
  video.preload = 'auto';
  video.load();

  function updateFrame(timestamp) {
    frameRequest = 0;
    const scrollRange = track.offsetHeight - window.innerHeight;
    const progress = scrollRange > 0
      ? Math.max(0, Math.min(1, -track.getBoundingClientRect().top / scrollRange))
      : 0;

    track.style.setProperty('--film-progress', progress);
    if (progressLabel) progressLabel.textContent = `${String(Math.round(progress * 100)).padStart(2, '0')}%`;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA || !video.duration) return;

    targetTime = progress * Math.max(0, video.duration - 0.05);
    const elapsed = lastTimestamp ? Math.min(timestamp - lastTimestamp, 64) : 16;
    lastTimestamp = timestamp;
    displayedTime += (targetTime - displayedTime) * (1 - Math.exp(-elapsed / 90));

    if (!video.seeking && timestamp - lastSeek >= 40 && Math.abs(displayedTime - video.currentTime) > 0.025) {
      video.currentTime = displayedTime;
      lastSeek = timestamp;
    }

    if (video.seeking || Math.abs(targetTime - video.currentTime) > 0.05) requestFrameUpdate();
  }

  function requestFrameUpdate() {
    if (!frameRequest) frameRequest = window.requestAnimationFrame(updateFrame);
  }

  video.addEventListener('loadedmetadata', requestFrameUpdate, { once: true });
  video.addEventListener('error', () => track.classList.remove('is-scroll-active'), { once: true });
  video.addEventListener('seeked', requestFrameUpdate);
  window.addEventListener('scroll', requestFrameUpdate, { passive: true });
  window.addEventListener('resize', requestFrameUpdate, { passive: true });
  requestFrameUpdate();
}

function initHeaderScroll() {
  const header = document.getElementById('luxury-nav-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}
