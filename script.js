/**
 * Brewora — Hero cup carousel & mobile nav
 */

(function () {
  'use strict';

  const DRINK_META = {
    matcha: { name: 'Matcha Frappé', desc: 'Ceremonial matcha · oat milk · honey · vanilla' },
    mango: { name: 'Mango Frappé', desc: 'Concord grape · Alphonso mango · coconut cream' },
    strawberry: { name: 'Strawberry Frappé', desc: 'Local strawberries · Madagascar vanilla · light cream' },
    choco: { name: 'Choco Frappé', desc: '72% dark chocolate · espresso · cocoa nib crunch' },
  };

  /* ---- Cup Carousel ---- */
  const cups = document.querySelectorAll('.cup-item');
  const stage = document.querySelector('.cup-carousel__stage');
  const dots = document.querySelectorAll('.flavor-dots .dot');

  let activeIndex = 0;
  let autoplayTimer = null;
  const INTERVAL = 3000;

  function getPositionForCup(cupIndex, active) {
    return cupIndex === active ? 'featured' : 'hidden';
  }

  function updateCarousel(active) {
    activeIndex = ((active % cups.length) + cups.length) % cups.length;

    cups.forEach((cup) => {
      const cupIndex = parseInt(cup.dataset.index, 10);
      const pos = getPositionForCup(cupIndex, activeIndex);

      cup.classList.remove('cup-item--featured', 'cup-item--hidden', 'cup-item--top', 'cup-item--right', 'cup-item--bottom');
      cup.classList.add(`cup-item--${pos}`);
    });

    dots.forEach((dot) => {
      const i = parseInt(dot.dataset.index, 10);
      const isActive = i === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const activeCup = cups[activeIndex];
    const drinkId = activeCup.dataset.drink;
    const meta = DRINK_META[drinkId];

    if (stage) {
      stage.setAttribute('data-active-drink', drinkId);
      stage.setAttribute(
        'aria-label',
        `Brewora shake showcase — now featuring ${meta.name}`
      );
    }
  }

  function nextCup() {
    updateCarousel(activeIndex + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(nextCup, INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      updateCarousel(parseInt(dot.dataset.index, 10));
      startAutoplay();
    });
  });

  const carousel = document.querySelector('.cup-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
  }

  if (cups.length > 0) {
    updateCarousel(0);
    startAutoplay();
  }

  /* ---- Order Modal (Google Form) ---- */
  const ORDER_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeXywpXUyyhUmgLw7bxJ3gtStRljspXgfUH7ceuT9QL7JlXiQ/viewform?embedded=true';

  const orderModal = document.getElementById('order-modal');
  const orderFrame = document.getElementById('order-form-frame');
  const orderTriggers = document.querySelectorAll('.order-trigger');
  const closeBtn = document.getElementById('btn-order-close');
  let orderModalOpen = false;

  function openOrderModal() {
    if (!orderModal) return;

    orderModal.hidden = false;
    orderModalOpen = true;
    document.body.style.overflow = 'hidden';

    if (orderFrame && !orderFrame.dataset.loaded) {
      orderFrame.src = ORDER_FORM_URL;
      orderFrame.dataset.loaded = 'true';
    }

    const closeBtn = orderModal.querySelector('.order-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeOrderModal() {
    if (!orderModal) return;

    orderModal.hidden = true;
    orderModalOpen = false;
    document.body.style.overflow = '';
  }

  orderTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openOrderModal();

      const mobileNav = document.getElementById('mobile-nav');
      const menuToggle = document.querySelector('.menu-toggle');
      if (mobileNav && menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      }
    });
  });

  if (closeBtn) {
  closeBtn.addEventListener('click', closeOrderModal);
}

  // document.addEventListener('keydown', (e) => {
  //   if (e.key === 'Escape' && orderModalOpen) {
  //     closeOrderModal();
  //   }
  // });

  /* ---- Scroll reveal ---- */
  function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const singles = document.querySelectorAll(
      '#about .section-header, #about .about-grid > *, ' +
      '#menu .section-header, #process .section-header, #locations .section-header'
    );

    singles.forEach((el) => el.classList.add('reveal'));

    document.querySelectorAll('.card-grid').forEach((grid) => {
      grid.querySelectorAll('.card').forEach((card, index) => {
        card.classList.add('reveal');
        card.style.setProperty('--reveal-delay', `${index * 0.1}s`);
      });
    });

    document.querySelectorAll('.process-steps').forEach((list) => {
      list.querySelectorAll('li').forEach((step, index) => {
        step.classList.add('reveal');
        step.style.setProperty('--reveal-delay', `${index * 0.12}s`);
      });
    });

    document.querySelectorAll('.location-grid').forEach((grid) => {
      grid.querySelectorAll('.location-card').forEach((card, index) => {
        card.classList.add('reveal');
        card.style.setProperty('--reveal-delay', `${index * 0.1}s`);
      });
    });

    const revealItems = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((el) => observer.observe(el));
  }

  initScrollReveal();

  /* ---- Mobile Navigation ---- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      mobileNav.hidden = isOpen;

      if (!isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
        document.body.style.overflow = '';
      });
    });
  }
})();