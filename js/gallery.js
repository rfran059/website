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
     * Get the scroll distance for navigation buttons
     */
    function getScrollDistance() {
      const firstPanel = panels[0];
      if (!firstPanel) return 800;
      const panelWidth = firstPanel.getBoundingClientRect().width;
      return Math.round(panelWidth);
    }

    /**
     * Open the lightbox modal with gallery panel content
     */
    function openLightbox(panel) {
      if (!panel) return;

      currentPanel = panel;
      var shortDesc = panel.getAttribute('data-short-description');
      var caption = panel.querySelector('.gallery-caption');
      var h4 = caption ? caption.querySelector('h4') : null;
      var p = caption ? caption.querySelector('p') : null;

      // Extract background style from panel
      var bgStyle = panel.style.background || panel.style.backgroundColor || '';

      // Populate lightbox content
      lightboxTitle.textContent = h4 ? h4.textContent : 'Gallery Item';
      lightboxSubtitle.textContent = p ? p.textContent : '';
      lightboxDescription.textContent = shortDesc || '';
      lightboxShort.textContent = p ? p.textContent : '';

      // Display background in lightbox - use a styled div since panels
      // don't have real images, they use gradient backgrounds
      lightboxImage.style.background = bgStyle;
      lightboxImage.style.display = 'flex';
      lightboxImage.style.alignItems = 'center';
      lightboxImage.style.justifyContent = 'center';

      // Clear previous content and safely insert new elements
      lightboxImage.replaceChildren();
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align:center;padding:2rem;';
      var titleEl = document.createElement('h3');
      titleEl.style.cssText = 'color:#f1f5f9;font-size:2rem;margin:0 0 1rem;';
      titleEl.textContent = h4 ? h4.textContent : 'Gallery Item';
      var descEl = document.createElement('p');
      descEl.style.cssText = 'color:#94a3b8;font-size:1.1rem;';
      descEl.textContent = p ? p.textContent : '';
      wrapper.appendChild(titleEl);
      wrapper.appendChild(descEl);
      lightboxImage.appendChild(wrapper);

      // Add active class to panel
      panels.forEach(function(panelEl) { panelEl.classList.remove('active-panel'); });
      panel.classList.add('active-panel');

      // Close any open modal first
      if (lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
      }

      // Open modal with fade-in animation
      setTimeout(function() {
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
     * Handle panel click events
     */
    panels.forEach(function(panel) {
      panel.addEventListener('click', function() {
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
    lightboxModal.addEventListener('click', function(e) {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    /**
     * Close on Escape key
     */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });

    /**
     * Navigation buttons
     */
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        container.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        container.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
      });
    }
  }

  // Export for module systems
  if (typeof window !== 'undefined') {
    window.Gallery = {
      init: init,
      openLightbox: openLightbox,
      closeLightbox: closeLightbox
    };
  }
})();
