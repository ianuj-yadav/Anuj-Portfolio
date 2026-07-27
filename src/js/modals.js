/* ==========================================================================
   MODAL INTERACTION & CONTACT TOAST CONTROLLER
   ========================================================================== */

import { gsap } from 'gsap';

export function setupModals() {
  const triggers = document.querySelectorAll('[data-modal]');
  const closers = document.querySelectorAll('[data-close]');
  const backdrops = document.querySelectorAll('.modal-backdrop');
  const modalStack = [];
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const setModalState = (modal, isOpen) => {
    modal.classList.toggle('active', isOpen);
    modal.setAttribute('aria-hidden', String(!isOpen));
    modal.inert = !isOpen;
  };

  const getFocusableElements = (modal) => [...modal.querySelectorAll(focusableSelector)]
    .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);

  const open = (modal, trigger = document.activeElement) => {
    if (!modal) return;

    const current = modalStack.at(-1);
    if (current?.modal === modal) return;

    if (current) {
      current.modal.setAttribute('aria-hidden', 'true');
      current.modal.inert = true;
    }

    modalStack.push({ modal, trigger });
    setModalState(modal, true);
    document.body.style.overflow = 'hidden';
    document.dispatchEvent(new CustomEvent('portfolio:modalopen', { detail: { id: modal.id } }));

    // Sync URL hash for deep linking
    const cleanId = modal.id.replace('modal-', '');
    if (['about', 'resume', 'projects', 'artworks', 'contact'].includes(cleanId)) {
      history.pushState({ modalId: cleanId }, '', `#${cleanId}`);
    }

    window.setTimeout(() => {
      const focusTarget = modal.querySelector('[data-autofocus], .modal-close, .paper-close-btn, input, button, a[href]') || modal;
      focusTarget.focus({ preventScroll: true });
    }, 0);
  };

  const close = (modal) => {
    if (!modal) return;

    // Force close state regardless of stack index to prevent stuck modals
    setModalState(modal, false);

    const index = modalStack.findLastIndex(entry => entry.modal === modal);
    if (index !== -1) {
      modalStack.splice(index, 1);
    }

    const previous = modalStack.at(-1);
    if (previous) {
      previous.modal.setAttribute('aria-hidden', 'false');
      previous.modal.inert = false;
      const prevId = previous.modal.id.replace('modal-', '');
      if (['about', 'resume', 'projects', 'artworks', 'contact'].includes(prevId)) {
        history.replaceState({ modalId: prevId }, '', `#${prevId}`);
      }
    } else {
      document.body.style.overflow = '';
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  const manager = {
    open,
    close,
    openById: (id, trigger) => open(document.getElementById(`modal-${id}`), trigger),
    closeTop: () => {
      const active = modalStack.at(-1);
      if (active) {
        close(active.modal);
      } else {
        document.querySelectorAll('.modal-backdrop.active').forEach(m => close(m));
      }
    }
  };

  window.portfolioModalManager = manager;

  // Sync hash on initial load or popstate
  const checkHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (['about', 'resume', 'projects', 'artworks', 'contact'].includes(hash)) {
      manager.openById(hash);
    } else if (modalStack.length > 0) {
      manager.closeTop();
    }
  };

  window.addEventListener('popstate', (e) => {
    if (e.state?.modalId) {
      manager.openById(e.state.modalId);
    } else {
      checkHash();
    }
  });

  // Run on page load
  checkHash();

  backdrops.forEach(backdrop => {
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('tabindex', '-1');
    backdrop.inert = true;
  });

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      manager.openById(modalId, btn);
    });
  });

  closers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      manager.close(document.getElementById(`modal-${modalId}`));
    });
  });

  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        manager.close(backdrop);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      manager.closeTop();
    }

    if (e.key === 'Tab') {
      const active = modalStack.at(-1)?.modal;
      if (!active) return;

      const focusable = getFocusableElements(active);
      if (!focusable.length) {
        e.preventDefault();
        active.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // PDF In-Browser Preview Lightbox Modal
  const previewPdfBtn = document.getElementById('preview-pdf-btn');
  const pdfModal = document.getElementById('modal-pdf-viewer');
  const pdfCloseBtn = document.getElementById('pdf-close-btn');

  if (previewPdfBtn && pdfModal) {
    previewPdfBtn.addEventListener('click', () => {
      const frame = pdfModal.querySelector('iframe[data-src]');
      if (frame && !frame.getAttribute('src')) frame.src = frame.dataset.src;
      manager.open(pdfModal, previewPdfBtn);
    });
  }

  if (pdfCloseBtn && pdfModal) {
    pdfCloseBtn.addEventListener('click', () => {
      manager.close(pdfModal);
    });
  }

  // Resume Section Filter Tabs Handler
  const resumeFilterBtns = document.querySelectorAll('#resume-filter-bar .filter-chip-btn');
  const resumeSections = document.querySelectorAll('#modal-resume .resume-section');

  resumeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-resume-filter');

      resumeFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      resumeSections.forEach(section => {
        const secCategory = section.getAttribute('data-resume-sec');

        if (filter === 'all' || secCategory === filter || (filter === 'skills' && secCategory === 'skills')) {
          section.classList.remove('hidden-section');
          gsap.fromTo(section, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
        } else {
          section.classList.add('hidden-section');
        }
      });
    });
  });

  // Copy email button
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ianujy@gmail.com');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'COPIED!';
      copyBtn.style.background = 'var(--color-peach)';
      copyBtn.style.color = '#141318';

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = 'rgba(232, 165, 137, 0.2)';
        copyBtn.style.color = 'var(--color-peach)';
      }, 2000);
    });
  }

  // Copy Contact button in Resume Drawer
  const downloadBtn = document.getElementById('download-resume-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+917838042623 | ianujy@gmail.com');
      const originalText = downloadBtn.textContent;
      downloadBtn.textContent = 'CONTACT COPIED!';
      setTimeout(() => {
        downloadBtn.textContent = originalText;
      }, 2000);
    });
  }

  // Contact form: hand the completed message to the visitor's mail application.
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  const contactModal = document.getElementById('modal-contact');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value.trim() || 'Portfolio visitor';
      const email = document.getElementById('form-email')?.value.trim() || '';
      const message = document.getElementById('form-message')?.value.trim() || '';
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      toast.textContent = 'Opening your email app…';
      toast.classList.add('active');
      window.location.href = `mailto:ianujy@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        toast.classList.remove('active');
        if (contactModal) {
          manager.close(contactModal);
        }
      }, 2500);
    });
  }
}
