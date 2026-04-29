document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initContactForm();
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
// Handles card reveals, gallery panel animations, and section fade-ins
function initScrollAnimations() {
  // Track observed elements to prevent re-observing sections after fade-in completes
  const observedSections = new Set();

  // Card and gallery panel reveal animation
  const cards = document.querySelectorAll('.card');
  const galleryPanels = document.querySelectorAll('.gallery-panel');
  const cardElements = Array.from(cards).concat(galleryPanels);

  // Section fade-in animation for sections below hero
  const sections = document.querySelectorAll('section:not(.hero)');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('fade-in-section')) {
        // Handle cards and gallery panels - add visible class and stop observing
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      } else if (entry.isIntersecting && entry.target.classList.contains('fade-in-section')) {
        // Handle section fade-ins - add visible class and prevent re-observation
        entry.target.classList.add('visible');
        observedSections.add(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and gallery panels
  cardElements.forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    } else {
      el.classList.add('visible');
    }
  });

  // Observe sections for fade-in animation
  sections.forEach(section => {
    if (!section.classList.contains('visible') && !observedSections.has(section)) {
      observer.observe(section);
    } else if (section.classList.contains('visible')) {
      section.classList.add('visible');
    }
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');
  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    isSubmitting = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      isSubmitting = false;
      showFormError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      isSubmitting = false;
      showFormError('Please enter a valid email address.');
      return;
    }

    // Build mailto link
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    );
    const subjectLine = encodeURIComponent(`Portfolio Contact: ${subject}`);
    const mailtoUrl = `mailto:hello@russellfranklin.github.io?subject=${subjectLine}&body=${body}`;

    // Show success message after a brief delay to give user feedback
    if (successMsg) {
      setTimeout(() => {
        successMsg.classList.add('show');
        form.reset();
        isSubmitting = false;

        setTimeout(() => {
          successMsg.classList.remove('show');
        }, 5000);
      }, 300);
    }

    // Open mailto client - wrapped in try-catch for browser compatibility
    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      isSubmitting = false;
      showFormError('Failed to open email client. Please try manually sending an email to hello@russellfranklin.github.io');
      console.error('Mailto error:', err);
    }
  });

  /**
   * Show error message to user
   */
  function showFormError(errorMessage) {
    // Hide success message if showing
    if (successMsg) {
      successMsg.classList.remove('show');
    }

    // Create temporary error message element
    const errorContainer = form.closest('.container');
    if (errorContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = 'display:none; padding: 1rem; margin-bottom: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); color: #f87171; font-weight: 500; text-align: center;';
      errorDiv.textContent = errorMessage;
      errorContainer.insertBefore(errorDiv, errorContainer.firstChild);

      // Remove error after 5 seconds
      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
    }
  }
}
