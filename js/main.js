/* ============================================
   Kal's Joint — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ----------------------------------------
  // Scroll-based header styling
  // ----------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----------------------------------------
  // Mobile navigation toggle
  // ----------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      if (navOverlay) navOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ----------------------------------------
  // Scroll reveal animations
  // ----------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }

  // ----------------------------------------
  // Menu page — active category highlight
  // ----------------------------------------
  const menuNav = document.querySelector('.menu-nav');
  if (menuNav) {
    const menuSections = document.querySelectorAll('.menu-section');
    const menuNavLinks = menuNav.querySelectorAll('a[href^="#"]');

    if (menuSections.length > 0 && menuNavLinks.length > 0) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              menuNavLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
              });
              // Scroll the active link into view in the sticky nav
              const activeLink = menuNav.querySelector('a.active');
              if (activeLink) {
                activeLink.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center',
                });
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '-150px 0px -60% 0px' }
      );
      menuSections.forEach(section => sectionObserver.observe(section));
    }
  }

  // ----------------------------------------
  // Contact form validation & success state
  // ----------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      contactForm.querySelectorAll('.form-error').forEach(el => (el.style.display = 'none'));

      // Validate name
      const name = contactForm.querySelector('[name="name"]');
      if (name && !name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }

      // Validate email
      const email = contactForm.querySelector('[name="email"]');
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          showError(email, 'Please enter your email');
          valid = false;
        } else if (!emailRegex.test(email.value.trim())) {
          showError(email, 'Please enter a valid email address');
          valid = false;
        }
      }

      // Validate message
      const message = contactForm.querySelector('[name="message"]');
      if (message && !message.value.trim()) {
        showError(message, 'Please enter a message');
        valid = false;
      }

      if (valid) {
        // Show success state
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      }
    });

    function showError(input, msg) {
      input.classList.add('error');
      const errorEl = input.closest('.form-group').querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
    }
  }
})();
