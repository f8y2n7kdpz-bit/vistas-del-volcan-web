document.addEventListener('DOMContentLoaded', function () {
  var WA_NUMBER = '523320274445';

  /* Header scroll state */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('nav-open');
    });
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('nav-open'); });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Model gallery thumb switching */
  document.querySelectorAll('.model-block').forEach(function (block) {
    var mainImg = block.querySelector('.model-gallery-main img');
    var badge = block.querySelector('.render-badge');
    var thumbs = block.querySelectorAll('.model-thumbs button');

    function setBadge(btn) {
      if (!badge) return;
      if (btn && btn.hasAttribute('data-render')) badge.classList.add('show');
      else badge.classList.remove('show');
    }

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        thumbs.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var src = btn.getAttribute('data-full');
        mainImg.setAttribute('src', src);
        mainImg.setAttribute('alt', btn.querySelector('img').getAttribute('alt'));
        setBadge(btn);
      });
    });

    /* Set initial badge state to match the thumb marked active in the HTML */
    setBadge(block.querySelector('.model-thumbs button.active'));
  });

  /* Lightbox */
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox.querySelector('img');
  var lbCaption = lightbox.querySelector('.lightbox-caption');
  var currentGallery = [];
  var currentIndex = 0;

  function openLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function updateLightbox() {
    var item = currentGallery[currentIndex];
    lbImg.setAttribute('src', item.src);
    lbImg.setAttribute('alt', item.alt || '');
    lbCaption.textContent = item.alt || '';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightbox();
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
  });

  /* Wire up any element with data-gallery to open the lightbox using
     all images sharing that gallery name (in DOM order). */
  var galleries = {};
  document.querySelectorAll('[data-gallery]').forEach(function (el) {
    var name = el.getAttribute('data-gallery');
    if (!galleries[name]) galleries[name] = [];
    var full = el.getAttribute('data-full') || el.querySelector('img').getAttribute('src');
    var alt = el.querySelector('img') ? el.querySelector('img').getAttribute('alt') : '';
    galleries[name].push({ src: full, alt: alt, el: el });
  });
  Object.keys(galleries).forEach(function (name) {
    galleries[name].forEach(function (item, idx) {
      item.el.addEventListener('click', function () {
        var list = galleries[name].map(function (g) { return { src: g.src, alt: g.alt }; });
        openLightbox(list, idx);
      });
    });
  });

  /* Model tab pills scroll to section */
  document.querySelectorAll('.model-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.model-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.querySelector(tab.getAttribute('data-target'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
      }
    });
  });

  /* Contact form -> WhatsApp */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var modelo = form.modelo.value;
      var message = form.message.value.trim();
      var text = 'Hola, soy ' + name + '. Me interesa el modelo "' + modelo + '" en Vistas del Volcán.';
      if (phone) text += ' Mi teléfono es ' + phone + '.';
      if (message) text += ' ' + message;
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
