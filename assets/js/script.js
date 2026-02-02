// Particle Network Background Animation
class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn('Particle network canvas not found');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connectionDistance = 150;
    this.particleCount = 0;
    this.mouse = { x: 0, y: 0 };
    
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    this.particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }
  }

  animate() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle (darker gray for Ether theme)
      this.ctx.fillStyle = `rgba(70, 70, 70, ${particle.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw connections (darker lines for Ether theme)
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.4;
          this.ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggle());
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => this.close());
      });
    }
  }

  toggle() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  close() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }
}

// Navigation Highlighter
class NavHighlighter {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => this.updateActiveLink());
    this.updateActiveLink();
  }

  updateActiveLink() {
    let current = '';
    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Intersection Observer for animations
class ScrollAnimations {
  constructor() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          entry.target.style.animation = getComputedStyle(entry.target).animation;
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.project-card, .interest-item, .section-title, .about-content p').forEach((el) => {
      observer.observe(el);
    });
  }
}

// Mouse Particle Effect
class MouseParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.createParticles(e.clientX, e.clientY);
    });
    
    this.animateParticles();
  }
  
  createParticles(x, y) {
    if (Math.random() > 0.7) return; // 30% chance to create particle on mouse move
    
    const particleCount = 2;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 2,
        life: 1,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 217, 255, ' : 'rgba(255, 0, 110, ',
      });
    }
  }
  
  animateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(p => p.life > 0);
    
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.life -= 0.015;
      
      this.ctx.fillStyle = particle.color + particle.life + ')';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add glow
      this.ctx.strokeStyle = particle.color + (particle.life * 0.5) + ')';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
    
    requestAnimationFrame(() => this.animateParticles());
  }
}

// Interactive Glow Follow
class GlowFollow {
  constructor() {
    this.interactiveElements = document.querySelectorAll('.btn, .project-card, .contact-link, .nav-link, .interest-item');
    document.addEventListener('mousemove', (e) => this.updateGlow(e));
  }
  
  updateGlow(event) {
    this.interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const distance = Math.sqrt(x * x + y * y);
      
      if (distance < 150) {
        const intensity = (1 - distance / 150) * 0.5;
        el.style.boxShadow = `
          0 0 ${20 + intensity * 30}px rgba(0, 217, 255, ${intensity}),
          inset 0 0 ${15 + intensity * 20}px rgba(0, 217, 255, ${intensity * 0.3})
        `;
      } else {
        el.style.boxShadow = '';
      }
    });
  }
}

// Parallax Scroll Effect
class ParallaxScroll {
  constructor() {
    this.heroContent = document.querySelector('.hero-content');
    this.heroTitle = document.querySelector('.hero-title');
    window.addEventListener('scroll', () => this.updateParallax());
    this.updateParallax();
  }
  
  updateParallax() {
    const scrollY = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').clientHeight;
    
    if (scrollY < heroHeight) {
      const offset = scrollY * 0.5;
      const opacity = 1 - (scrollY / heroHeight) * 0.3;
      
      if (this.heroContent) {
        this.heroContent.style.transform = `translateY(${offset}px)`;
        this.heroContent.style.opacity = opacity;
      }
      
      // Add subtle rotation to stars based on scroll
      const starfieldCanvas = document.getElementById('starfieldCanvas');
      if (starfieldCanvas) {
        starfieldCanvas.style.opacity = 1 - (scrollY / heroHeight) * 0.2;
      }
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle network background
  const networkCanvas = document.createElement('canvas');
  networkCanvas.id = 'networkCanvas';
  networkCanvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 0; pointer-events: none;';
  document.body.insertBefore(networkCanvas, document.body.firstChild);
  
  new ParticleNetwork('networkCanvas');

  // Particle animation disabled - using planet cursor instead
  // const particleCanvas = document.createElement('canvas');
  // particleCanvas.id = 'particleCanvas';
  // particleCanvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 1; pointer-events: none; width: 100%; height: 100%;';
  // particleCanvas.width = window.innerWidth;
  // particleCanvas.height = window.innerHeight;
  // document.body.insertBefore(particleCanvas, document.body.firstChild.nextSibling);
  // 
  // window.addEventListener('resize', () => {
  //   particleCanvas.width = window.innerWidth;
  //   particleCanvas.height = window.innerHeight;
  // });
  //
  // new MouseParticles('particleCanvas');

  // Initialize components
  new MobileNav();
  new NavHighlighter();
  new SmoothScroll();
  new ScrollAnimations();
  new GlowFollow();
  new ParallaxScroll();

  // Adjust body margin for fixed navbar
  document.body.style.marginTop = '0';
  document.querySelector('.navbar').style.position = 'fixed';
  document.querySelector('.navbar').style.width = '100%';
  document.querySelector('.navbar').style.top = '0';
  document.querySelector('.navbar').style.zIndex = '1000';
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }
});
