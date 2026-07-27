import gsap from 'gsap';

export function initRouter() {
  const pageLinks = document.querySelectorAll('[data-page]');
  const logoLink = document.getElementById('brand-logo');
  const curtain = document.getElementById('page-transition-curtain');
  
  let isAnimating = false;
  let currentPageId = 'page-home';

  // Handle Logo Click for Home (ANUJ YADAV)
  const brandLogos = document.querySelectorAll('#brand-logo, .brand-logo');
  brandLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();

      // Close any active open modals
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        if (window.portfolioModalManager) {
          window.portfolioModalManager.close(modal);
        } else {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
      document.body.style.overflow = '';

      // Smooth scroll to top of landing hero stage
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 0.9 });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

      if (currentPageId !== 'page-home' && document.getElementById('page-home')) {
        navigateTo('page-home', '/');
      }

      // Clean URL hash back to '/'
      history.pushState('', document.title, window.location.pathname);
    });
  });

  // Handle Nav Links
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPageId = `page-${link.getAttribute('data-page')}`;
      const path = `/${link.getAttribute('data-page')}`;
      
      if (targetPageId !== currentPageId) {
        navigateTo(targetPageId, path);
      }
    });
  });

  // Handle Back/Forward Buttons
  window.addEventListener('popstate', (e) => {
    const targetPageId = e.state?.pageId || 'page-home';
    if (targetPageId !== currentPageId) {
      navigateTo(targetPageId, window.location.pathname, true);
    }
  });

  function navigateTo(targetPageId, path, isPopState = false) {
    if (isAnimating) return;
    isAnimating = true;

    const targetPage = document.getElementById(targetPageId);
    const currentPage = document.getElementById(currentPageId);

    if (!targetPage || !currentPage) {
      isAnimating = false;
      return;
    }

    // Update History
    if (!isPopState) {
      history.pushState({ pageId: targetPageId }, '', path);
    }

    // Play Out Transition
    const tl = gsap.timeline({
      onComplete: () => {
        // Swap active classes behind the curtain
        currentPage.classList.remove('active-page');
        targetPage.classList.add('active-page');
        
        // Reset scroll position on new page
        targetPage.scrollTop = 0;
        
        // Play In Transition
        gsap.to(curtain, {
          y: '-100%',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            gsap.set(curtain, { y: '100%' }); // Reset curtain for next time
            currentPageId = targetPageId;
            isAnimating = false;
          }
        });

        // Optionally animate content in
        gsap.fromTo(targetPage.children, 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
        );
      }
    });

    curtain.classList.add('is-loading');
    
    tl.to(curtain, {
      y: '0%',
      duration: 0.8,
      ease: 'power4.inOut'
    });
  }

  // Intercept closes within new pages (formerly modals)
  const closeBtns = document.querySelectorAll('.modal-close');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Go back home when closed
      if (currentPageId !== 'page-home') {
        navigateTo('page-home', '/');
      }
    });
  });
}
