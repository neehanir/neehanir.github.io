// ==========================================================================
// Neeharika Aniruddh — Main JS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navbar scroll effect ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ---------- Mobile toggle ----------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // ---------- Dropdown menus ----------
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();

      // Close other dropdowns
      document.querySelectorAll('.has-dropdown').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      const isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.has-dropdown').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu on link click
  document.querySelectorAll('.dropdown-link, .nav-menu > .nav-item > .nav-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ---------- Gallery ----------
  const galleryGrid = document.getElementById('gallery');
  if (galleryGrid) {
    loadGallery(galleryGrid);
  }

  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    setupLightbox(lightbox);
  }
});

// ==========================================================================
// Gallery Loader — loads images listed in a data file or scans /img/ folder
// ==========================================================================
function loadGallery(container) {
  // Fetch the gallery manifest (a simple JSON array of filenames)
  fetch('/img/manifest.json')
    .then(res => {
      if (!res.ok) throw new Error('No manifest');
      return res.json();
    })
    .then(images => renderGallery(container, images))
    .catch(() => {
      // Fallback: show a friendly message
      container.innerHTML = '<p class="gallery-empty">Gallery images coming soon.</p>';
    });
}

function renderGallery(container, images) {
  if (!images || images.length === 0) {
    container.innerHTML = '<p class="gallery-empty">Gallery images coming soon.</p>';
    return;
  }

  container.innerHTML = '';
  images.forEach((img, index) => {
    const src = '/img/' + img;
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `<img src="${src}" alt="Artwork by Neeharika Aniruddh" loading="lazy">`;
    container.appendChild(div);
  });
}

// ==========================================================================
// Lightbox
// ==========================================================================
function setupLightbox(lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  let galleryItems = [];

  // Open lightbox on gallery item click
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    currentIndex = parseInt(item.getAttribute('data-index'), 10);
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function showImage() {
    const img = galleryItems[currentIndex]?.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showImage();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showImage();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; showImage(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % galleryItems.length; showImage(); }
  });
}
