/**
 * Gallery Module
 * Handles gallery navigation, lightbox modal, and panel interactions
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const panels = container.querySelectorAll('.gallery-panel');
    const lightboxModal = document.getElementById('lightboxModal');

    if (!lightboxModal) return;

    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxSubtitle = document.getElementById('lightboxSubtitle');
    const lightboxTags = document.getElementById('lightboxTags');
    const lightboxShort = document.getElementById('lightboxShort');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightboxTitle || !lightboxImage || !lightboxDescription || !lightboxClose) {
      console.warn('Gallery: Required lightbox elements not found');
      return;
    }

    let currentPanel = null;

    /**
     * Open the lightbox modal with gallery panel content
     */
    function openLightbox(panel) {
      if (!panel) return;

      currentPanel = panel;
      const shortDesc = panel.getAttribute('data-short-description');
      const caption = panel.querySelector('.gallery-caption');
      const h4 = caption?.querySelector('h4');
      const p = caption?.querySelector('p');

      // Extract colors from gradient background
      const bgStyle = panel.style.background || '';
      const gradientColors = extractGradientColors(bgStyle);

      // Populate lightbox content
      lightboxTitle.textContent = h4?.textContent || 'Gallery Item';
      lightboxSubtitle.textContent = p?.textContent || '';
      lightboxDescription.textContent = shortDesc || '';
      lightboxShort.textContent = p?.textContent || '';

      // Set image with gradient background
      lightboxImage.src = bgStyle;
      lightboxImage.alt = h4?.textContent || '';

      // Add active class to panel
      panels.forEach((panelEl) => panelEl.classList.remove('active-panel'));
      panel.classList.add('active-panel');

      // Close any open modal first
      if (lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
      }

      // Open modal with fade-in animation
      setTimeout(() => {
        lightboxModal.classList.add('active');
      }, 100);

      // Update keyboard focus
      lightboxClose.focus();
    }

    /**
     * Close the lightbox modal
     */
    function closeLightbox() {
      lightboxModal.classList.remove('active');

      // Reset active classes on panels
      if (currentPanel) {
        currentPanel.classList.remove('active-panel');
      }

      currentPanel = null;
    }

    /**
     * Extract colors from CSS gradient string
     * Returns an array of hex color values
     */
    function extractGradientColors(gradient) {
      // Simple extraction of hex colors from gradient
      const hexMatch = gradient.match(/#[0-9a-fA-F]{3,6}/g);
      return hexMatch || [];
    }

    /**
     * Handle panel click events
     */
    panels.forEach(panel => {
      panel.addEventListener('click', () => {
        openLightbox(panel);
      });
    });

    /**
     * Close button handler
     */
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    /**
     * Close on outside click of modal
     */
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    /**
     * Close on Escape key
     */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });

    /**
     * Navigation buttons
     */
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -800, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 800, behavior: 'smooth' });
      });
    }
  }

  // Export for module systems
  if (typeof window !== 'undefined') {
    window.Gallery = {
      init,
      openLightbox,
      closeLightbox
    };
  }
})();
