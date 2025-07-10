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

// Among Us Sound Manager - Complete Redesign
class AmongUsSoundManager {
  constructor() {
    // Among Us Audio Files
    this.ejectSound = new Audio('assets/audio/Among us/among-us-eject-sound-effect.mp3');
    this.roleRevealSound = new Audio('assets/audio/Among us/among-us-role-reveal-sound.mp3');
    this.enterGameSound = new Audio('assets/audio/Among us/enter-da-game.mp3');
    this.killSound = new Audio('assets/audio/Among us/stationary-kill_gDwMUvN.mp3');
    this.taskCompleteSound = new Audio('assets/audio/Among us/Task_complete.mp3');
    this.walkingSound = new Audio('assets/audio/Among us/the-among-us-walking-sound-effect.mp3');
    this.ventSound = new Audio('assets/audio/Among us/Vent.mp3');
    
    // Set base volumes
    this.ejectSound.volume = 0.3;
    this.roleRevealSound.volume = 0.25;
    this.enterGameSound.volume = 0.4;
    this.killSound.volume = 0.3;
    this.taskCompleteSound.volume = 0.35;
    this.walkingSound.volume = 0.15;
    this.ventSound.volume = 0.3;
    
    // Store original volumes for fade animation
    this.originalVolumes = {
      eject: 0.3,
      roleReveal: 0.25,
      enterGame: 0.4,
      kill: 0.3,
      taskComplete: 0.35,
      walking: 0.15,
      vent: 0.3
    };
    
    // Global cooldown system
    this.lastSoundTime = {
      eject: 0,
      roleReveal: 0,
      enterGame: 0,
      kill: 0,
      taskComplete: 0,
      walking: 0,
      vent: 0
    };
    
    this.cooldowns = {
      eject: 1000,      // 1 second for eject (external links)
      roleReveal: 3000,  // 3 seconds for role reveal
      enterGame: 0,      // No cooldown - plays once only
      kill: 2000,        // 2 seconds for kill
      taskComplete: 0,   // No cooldown - section-based tracking
      walking: 0,        // No cooldown - interactive cursor movement
      vent: 800         // 800ms for vent (navigation jumps)
    };
    
    // Section tracking for task complete sounds
    this.completedSections = new Set();
    this.hasEnteredGame = false;
    
    // Sound duration and animation
    this.maxDuration = 500;
    this.activeTimeouts = [];
    this.currentlyPlaying = null; // Prevent multiple sounds at once
  }

  canPlaySound(soundType) {
    const now = Date.now();
    
    // Prevent multiple sounds playing simultaneously
    if (this.currentlyPlaying && this.currentlyPlaying !== soundType) {
      return false;
    }
    
    return (now - this.lastSoundTime[soundType]) >= this.cooldowns[soundType];
  }

  fadeVolume(audio, soundType, startVolume, endVolume, duration) {
    const startTime = Date.now();
    const volumeDiff = endVolume - startVolume;
    
    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVolume = startVolume + (volumeDiff * easedProgress);
      
      audio.volume = currentVolume;
      
      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };
    
    requestAnimationFrame(fade);
  }

  playSound(audio, soundType, customFadeEnd = null, fullClip = false) {
    if (!this.canPlaySound(soundType)) return;
    
    this.currentlyPlaying = soundType;
    audio.currentTime = 0;
    
    // Set initial volume to 100% of original
    const startVolume = this.originalVolumes[soundType];
    const fadeEndVolume = customFadeEnd || (this.originalVolumes[soundType] * 0.2);
    audio.volume = startVolume;
    
    audio.play().catch(e => console.error(`Error playing ${soundType} sound:`, e));
    this.lastSoundTime[soundType] = Date.now();
    
    // For full clips, use the actual audio duration
    const duration = fullClip ? (audio.duration * 1000) : this.maxDuration;
    
    if (!fullClip) {
      // Start volume fade animation (100% to 20%) for short clips
      this.fadeVolume(audio, soundType, startVolume, fadeEndVolume, this.maxDuration);
    }
    
    // Stop the sound after duration
    const timeoutId = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = this.originalVolumes[soundType];
      this.currentlyPlaying = null; // Allow next sound to play
    }, duration);
    
    this.activeTimeouts.push(timeoutId);
    
    // Clean up old timeouts
    if (this.activeTimeouts.length > 10) {
      clearTimeout(this.activeTimeouts.shift());
    }
  }

  // Among Us Sound Methods
  playEject() {
    this.playSound(this.ejectSound, 'eject');
  }

  playRoleReveal() {
    this.playSound(this.roleRevealSound, 'roleReveal');
  }

  playEnterGame() {
    if (!this.hasEnteredGame) {
      this.hasEnteredGame = true;
      // Play full 1.582 second clip
      this.playSound(this.enterGameSound, 'enterGame', null, true);
    }
  }

  playKill() {
    this.playSound(this.killSound, 'kill');
  }

  playTaskComplete(sectionId) {
    // Only play once per section
    if (!this.completedSections.has(sectionId)) {
      this.completedSections.add(sectionId);
      this.playSound(this.taskCompleteSound, 'taskComplete');
    }
  }

  playWalking() {
    this.playSound(this.walkingSound, 'walking');
  }

  playVent() {
    this.playSound(this.ventSound, 'vent');
  }
}

// Mobile navigation
class MobileNav {
  constructor(soundManager) {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.soundManager = soundManager;
    
    this.init();
  }

  init() {
    // Add event listeners
    this.hamburger.addEventListener('click', () => {
        this.toggleMenu();
        this.soundManager.playVent(); // Vent sound for menu toggle
    });
    
    // Close menu when clicking on nav links (sound handled by LinkHandler)
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
          this.closeMenu();
          // Sound is handled by AmongUsLinkHandler now
        });
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
  constructor(soundManager) {
    this.navLinks = document.querySelectorAll('a[href^="#"]');
    this.soundManager = soundManager;
    this.init();
  }

  init() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Sound is handled by LinkHandler now
        
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
  constructor(soundManager) {
    this.soundManager = soundManager;
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
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.setAttribute('data-animated', 'true');
          
          // Removed collecting sound - animations are now silent
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
  constructor(soundManager) {
    this.emailLink = document.querySelector('a[href^="mailto:"]');
    this.soundManager = soundManager;
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
      this.soundManager.playTaskComplete('email-copy'); // Task complete for successful copy
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

// Among Us Link Handler
class AmongUsLinkHandler {
  constructor(soundManager) {
    this.allLinks = document.querySelectorAll('a');
    this.soundManager = soundManager;
    this.init();
  }

  init() {
    this.allLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          // Check if it's an external link (EJECT sound)
          const isExternal = link.hasAttribute('target') && link.getAttribute('target') === '_blank' ||
                            (link.href && (link.href.includes('http') && !link.href.includes(window.location.hostname)));
          
          if (isExternal) {
            this.soundManager.playEject(); // EJECT for external links!
          } else if (link.href && link.href.includes('#')) {
            // Internal navigation with hash (section jumping) = VENT sound
            this.soundManager.playVent();
          }
          
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

// Among Us Hover Effects (Walking Sound)
class AmongUsHoverEffects {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this.hoverElements = document.querySelectorAll(
      '.project-card, .skill-category, .experience-item, .contact-link, .btn'
    );
    this.init();
  }

  init() {
    this.hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.soundManager.playWalking(); // Walking sound for hovers
      });
    });
  }
}

// Among Us Task Complete System - Only for Contact Section
class AmongUsTaskComplete {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this.hasCompletedPortfolio = false;
    this.init();
  }

  init() {
    // Track completion only when user reads the final contact section
    const options = {
      rootMargin: '0px 0px -20% 0px', // More strict - need to see 80% of section
      threshold: 0.8 // 80% of section must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'contact' && !this.hasCompletedPortfolio) {
          // Start tracking time in contact section
          if (!this.contactStartTime) {
            this.contactStartTime = Date.now();
          }
        } else if (!entry.isIntersecting && entry.target.id === 'contact' && this.contactStartTime) {
          // When leaving contact section, check if enough time was spent
          const timeSpent = Date.now() - this.contactStartTime;
          
          // Minimum 3 seconds to complete the portfolio (read contact properly)
          if (timeSpent >= 3000 && !this.hasCompletedPortfolio) {
            this.hasCompletedPortfolio = true;
            this.soundManager.playTaskComplete('portfolio-complete');
            console.log('🎉 PORTFOLIO TASK COMPLETE! All sections explored!');
            
            // Stop observing after completion
            observer.disconnect();
          }
        }
      });
    }, options);

    // Only observe the contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }
  }
}

// Among Us Interactive Cursor Walking Sound
class AmongUsCursorWalking {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isMouseMoving = false;
    this.walkingInterval = null;
    this.movementThreshold = 5; // Minimum pixels to trigger walking
    this.walkingFrequency = 300; // Play walking sound every 300ms while moving
    this.init();
  }

  init() {
    let moveTimeout = null;

    document.addEventListener('mousemove', (e) => {
      const deltaX = Math.abs(e.clientX - this.lastMouseX);
      const deltaY = Math.abs(e.clientY - this.lastMouseY);
      const totalMovement = deltaX + deltaY;

      if (totalMovement > this.movementThreshold) {
        // Start walking if not already walking
        if (!this.isMouseMoving) {
          this.startWalking();
        }

        // Reset the stop timer
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          this.stopWalking();
        }, 150); // Stop walking 150ms after mouse stops
      }

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    // Also stop walking when mouse leaves the window
    document.addEventListener('mouseleave', () => {
      this.stopWalking();
    });
  }

  startWalking() {
    if (this.isMouseMoving) return;
    
    this.isMouseMoving = true;
    
    // Play first walking sound immediately
    this.soundManager.playWalking();
    
    // Continue playing walking sounds while moving
    this.walkingInterval = setInterval(() => {
      if (this.isMouseMoving) {
        this.soundManager.playWalking();
      }
    }, this.walkingFrequency);
  }

  stopWalking() {
    this.isMouseMoving = false;
    
    if (this.walkingInterval) {
      clearInterval(this.walkingInterval);
      this.walkingInterval = null;
    }
  }
}

// Among Us Enter Game Welcome Sound
class AmongUsEnterGame {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this.init();
  }

  init() {
    // Play enter game sound once when page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.soundManager.playEnterGame();
        console.log('🎮 Welcome to the Among Us Portfolio!');
      }, 1000); // Delay for dramatic effect
    });
  }
}

// Initialize all Among Us components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const soundManager = new AmongUsSoundManager();
    new ThemeManager(soundManager);
    new MobileNav(soundManager);
    new SmoothScroll(soundManager);
    new NavHighlighter();
    new ScrollAnimations(soundManager);
    new NavbarScroll();
    new LoadingAnimation();
    new EmailCopy(soundManager);
    new KeyboardNav();
    new AmongUsLinkHandler(soundManager);
    new AmongUsHoverEffects(soundManager);
    new AmongUsTaskComplete(soundManager);
    new AmongUsCursorWalking(soundManager);
    new AmongUsEnterGame(soundManager);

    // Add vent sound to remaining clickable elements
    const buttons = document.querySelectorAll('.btn:not(a), button');
    const themeToggle = document.getElementById('theme-toggle');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playVent(); // Vent sound for buttons
        });
    });
    
    // Theme toggle gets eject sound (leaving current theme)
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            soundManager.playEject();
        });
    }

    // Add task complete sound to form elements
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(element => {
        element.addEventListener('focus', () => {
            soundManager.playWalking(); // Walking sound when focusing on forms
        });
    });

    // Add task complete sound to CV/resume download
    const cvLinks = document.querySelectorAll('a[href*=".pdf"], a[download]');
    cvLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                soundManager.playTaskComplete('cv-download');
            }, 100);
        });
    });
    
    console.log('🚀 Among Us Portfolio System Activated! Welcome Crewmate!');
  } catch (error) {
    console.error('Error initializing Among Us website:', error);
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
