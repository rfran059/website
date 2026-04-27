document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initMobileMenu();
  initScrollAnimations();
  initIntersectionObserver();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Add ESC key listener to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation delay for multiple cards
        const delay = index * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach((card, index) => {
    // Only observe cards that don't already have the visible class
    if (!card.classList.contains('visible')) {
      observer.observe(card);
    } else {
      // Card was pre-visible (e.g., hero section), show immediately
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 50);
    }
  });
}

// Initialize Intersection Observer for new elements
function initIntersectionObserver() {
  // This will be used for future dynamic content
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('observed')) {
        entry.target.classList.add('observed');
        // Add any additional animation logic here
      }
    });
  }, observerOptions);

  // Observer is ready for dynamic content
  return observer;
}

// Utility: Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Smooth scroll to element
function smoothScrollTo(element) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - 80;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Add keyboard navigation for better accessibility
document.addEventListener('keydown', (e) => {
  // Arrow keys for card navigation
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const cards = document.querySelectorAll('.card');
    const currentCard = document.activeElement;
    const currentIndex = Array.from(cards).indexOf(currentCard);

    if (currentIndex !== -1) {
      e.preventDefault();
      const nextIndex = e.key === 'ArrowRight'
        ? (currentIndex + 1) % cards.length
        : (currentIndex - 1 + cards.length) % cards.length;

      cards[nextIndex]?.focus();
      smoothScrollTo(cards[nextIndex]);
    }
  }
});
