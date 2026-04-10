document.addEventListener('DOMContentLoaded', () => {
  // Smooth entry animations for cards and sections
  const cards = document.querySelectorAll('.card');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(card);
  });

  // Mobile menu logic (Simple placeholder for expansion)
  const navLinks = document.querySelector('.nav-links');
  // In a real production app, we'd add a hamburger icon and toggle logic here.
});
