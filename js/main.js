document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initContactForm();
  initScrollFadeIn();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ESC key closes menu (single listener)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card');
  const galleryPanels = document.querySelectorAll('.gallery-panel');
  const gallerySection = document.querySelector('.gallery-section');
  const allElements = Array.from(cards).concat(galleryPanels);
  if (gallerySection) allElements.push(gallerySection);

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  allElements.forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    } else {
      el.classList.add('visible');
    }
  });
}

// Scroll Fade-in Animation
function initScrollFadeIn() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('hero')) {
      section.classList.add('fade-in-section');
      observer.observe(section);
    }
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Build mailto link
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    );
    const subjectLine = encodeURIComponent(`Portfolio Contact: ${subject}`);

    window.location.href = `mailto:hello@russellfranklin.github.io?subject=${subjectLine}&body=${body}`;

    // Show success message
    if (successMsg) {
      successMsg.classList.add('show');
      form.reset();

      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 5000);
    }
  });
}
