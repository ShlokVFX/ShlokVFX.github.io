// Theme management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listener
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update icon
    this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    // Update aria-label
    this.themeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Mobile navigation
class MobileNav {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }

  init() {
    // Add event listeners
    this.hamburger.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    
    // Update aria attributes
    const isExpanded = this.navMenu.classList.contains('active');
    this.hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Manage focus
    if (isExpanded) {
      this.navMenu.querySelector('.nav-link').focus();
    }
  }

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
  }
}

// Smooth scrolling for navigation links
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
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Intersection Observer for nav highlighting
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
    // Remove active class from all nav links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current nav link
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll(
      '.project-card, .skill-category, .writing-item, .experience-item'
    );
    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const options = {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, options);

    // Set initial state and observe elements
    this.animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Navbar background on scroll
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.init();
  }

  init() {
    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        this.navbar.style.backgroundColor = 'rgba(var(--bg-primary-rgb, 255, 255, 255), 0.95)';
        this.navbar.style.backdropFilter = 'blur(10px)';
      } else {
        this.navbar.style.backgroundColor = 'var(--bg-primary)';
        this.navbar.style.backdropFilter = 'none';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }
}

// Loading animation
class LoadingAnimation {
  constructor() {
    this.init();
  }

  init() {
    // Add loaded class to body when page is fully loaded
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Trigger initial animations
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }
    });
  }
}

// Copy email functionality
class EmailCopy {
  constructor() {
    this.emailLink = document.querySelector('a[href^="mailto:"]');
    this.init();
  }

  init() {
    if (!this.emailLink) return;

    this.emailLink.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.copyEmail();
    });
  }

  async copyEmail() {
    const email = 'Shlokvfx2003@gmail.com';
    
    try {
      await navigator.clipboard.writeText(email);
      this.showCopyFeedback();
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }

  showCopyFeedback() {
    const originalText = this.emailLink.querySelector('span').textContent;
    const span = this.emailLink.querySelector('span');
    
    span.textContent = 'Email copied!';
    this.emailLink.style.color = 'var(--accent-color)';
    
    setTimeout(() => {
      span.textContent = originalText;
      this.emailLink.style.color = '';
    }, 2000);
  }
}

// Keyboard navigation improvements
class KeyboardNav {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // Skip to main content with Tab
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        e.preventDefault();
        document.querySelector('main').focus();
      }
    });
  }
}

// Error handling for external links
class LinkHandler {
  constructor() {
    this.externalLinks = document.querySelectorAll('a[target="_blank"]');
    this.init();
  }

  init() {
    this.externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          // Add visual feedback
          link.style.opacity = '0.7';
          setTimeout(() => {
            link.style.opacity = '';
          }, 200);
        } catch (err) {
          console.error('Link navigation error:', err);
        }
      });
    });
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ThemeManager();
    new MobileNav();
    new SmoothScroll();
    new NavHighlighter();
    new ScrollAnimations();
    new NavbarScroll();
    new LoadingAnimation();
    new EmailCopy();
    new KeyboardNav();
    new LinkHandler();
    
    console.log('Portfolio website initialized successfully');
  } catch (error) {
    console.error('Error initializing website:', error);
  }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
