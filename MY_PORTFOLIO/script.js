/**
 * OLUWATIMILEHIN AYODEJI JOHN | PORTFOLIO SCRIPT
 * Manages theme switching, animations, and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // THEME MANAGEMENT
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Default to 'dark' if no preference, or follow system if specified
    const getInitialTheme = () => {
        if (savedTheme) return savedTheme;
        return systemPrefersDark.matches ? 'dark' : 'light';
    };
    
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle icon accessibility
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    
    // Initialize theme
    setTheme(getInitialTheme());
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
    
    // Listen for system theme changes
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll(
        '.section-header, .about-text, .skill-card, .project-card, ' +
        '.service-card, .vision-content, .vision-image-wrapper, ' +
        '.contact-info, .contact-form-wrapper, .about-stats'
    );

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Add reveal class and initial state
    revealElements.forEach(el => el.classList.add('reveal'));
    
    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load after a short delay for initial elements
    setTimeout(revealOnScroll, 200);

    // ========================================
    // STATS COUNTER ANIMATION
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const target = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                const stepTime = duration / steps;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }
                }, stepTime);
            });
        }
    };

    window.addEventListener('scroll', animateStats);

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            
            // UI State: Sending
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showToast('Message sent! Check your email for confirmation.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showToast(data.errors.map(error => error.message).join(", "));
                    } else {
                        showToast('Oops! There was a problem submitting your form');
                    }
                }
            } catch (error) {
                showToast('Oops! There was a problem connecting to the server');
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }
        });
    }

    const showToast = (message) => {
        const toastMessage = toast.querySelector('.toast-message');
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // ========================================
    // HERO IMAGE PARALLAX
    // ========================================
    const heroImageContainer = document.querySelector('.hero-image-container');
    if (heroImageContainer && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            heroImageContainer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });
    }

    // ========================================
    // IMAGE FALLBACKS
    // ========================================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.textContent = this.alt || 'Asset';
            placeholder.style.cssText = `
                width: 100%; height: 100%; background: var(--bg-tertiary);
                display: flex; align-items: center; justify-content: center;
                color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border);
            `;
            if (this.parentElement) this.parentElement.appendChild(placeholder);
        });
    });

    console.log('Portfolio Experience Initialized - Deep Dark Mode Ready');
});
