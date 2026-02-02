// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    this.themeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    this.hamburger.addEventListener('click', () => this.toggleMenu());
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-container')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }
}

// Navigation Highlighter
class NavHighlighter {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    this.init();
  }

  init() {
    const options = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.highlightNavLink(entry.target.id);
        }
      });
    }, options);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  highlightNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    this.navLinks = document.querySelectorAll('a[href^="#"]');
    this.init();
  }

  init() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new MobileNav();
  new NavHighlighter();
  new SmoothScroll();
  document.body.classList.add('loaded');
});

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered');
      })
      .catch(err => {
        console.log('Service Worker registration failed');
      });
  });
}
