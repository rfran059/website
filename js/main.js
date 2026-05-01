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
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ESC key closes menu
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
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and gallery panels
  document.querySelectorAll('.card, .gallery-panel, .fade-in-section').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });

  // Observe sections for fade-in animation (skip hero)
  document.querySelectorAll('section:not(.hero)').forEach(section => {
    if (!section.classList.contains('visible')) {
      observer.observe(section);
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
      'Name: ' + name + '\nEmail: ' + email + '\nSubject: ' + subject + '\n\n' + message
    );
    const subjectLine = encodeURIComponent('Portfolio Contact: ' + subject);
    const mailtoUrl = 'mailto:rfran059@ucr.edu?subject=' + subjectLine + '&body=' + body;

    // Show success message
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

    // Open mailto client
    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      isSubmitting = false;
      showFormError('Failed to open email client. Please try manually sending an email to rfran059@ucr.edu');
      console.error('Mailto error:', err);
    }
  });

  function showFormError(errorMessage) {
    if (successMsg) {
      successMsg.classList.remove('show');
    }

    const errorContainer = form.closest('.container');
    if (errorContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = 'display:none; padding: 1rem; margin-bottom: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); color: #f87171; font-weight: 500; text-align: center;';
      errorDiv.textContent = errorMessage;
      errorContainer.insertBefore(errorDiv, errorContainer.firstChild);

      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
    }
  }
}
