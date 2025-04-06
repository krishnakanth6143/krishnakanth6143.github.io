document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
            }
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Theme switcher with enhanced UI
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;
    
    // Add a tooltip to the theme switch
    if (themeSwitch && !themeSwitch.getAttribute('title')) {
        themeSwitch.setAttribute('title', 'Toggle Light/Dark Mode');
    }
    
    // Add transition styles for smooth theme switching
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    themeSwitch.addEventListener('click', () => {
        // Add visual feedback animation
        themeSwitch.classList.add('theme-switch-active');
        setTimeout(() => themeSwitch.classList.remove('theme-switch-active'), 300);
        
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (themeSwitch.querySelector('.theme-icon')) {
                themeSwitch.querySelector('.theme-icon').textContent = '🌙';
            }
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            if (themeSwitch.querySelector('.theme-icon')) {
                themeSwitch.querySelector('.theme-icon').textContent = '☀️';
            }
        }
    });

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Add theme icon if it doesn't exist
    if (themeSwitch && !themeSwitch.querySelector('.theme-icon')) {
        const themeIcon = document.createElement('span');
        themeIcon.className = 'theme-icon';
        themeSwitch.appendChild(themeIcon);
    }
    
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        if (themeSwitch.querySelector('.theme-icon')) {
            themeSwitch.querySelector('.theme-icon').textContent = '🌙';
        }
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (themeSwitch.querySelector('.theme-icon')) {
            themeSwitch.querySelector('.theme-icon').textContent = '☀️';
        }
    } else {
        // No saved preference, use system preference
        if (prefersDarkScheme.matches) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            if (themeSwitch.querySelector('.theme-icon')) {
                themeSwitch.querySelector('.theme-icon').textContent = '🌙';
            }
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            if (themeSwitch.querySelector('.theme-icon')) {
                themeSwitch.querySelector('.theme-icon').textContent = '☀️';
            }
        }
    }

    // Listen for system theme preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                if (themeSwitch.querySelector('.theme-icon')) {
                    themeSwitch.querySelector('.theme-icon').textContent = '🌙';
                }
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                if (themeSwitch.querySelector('.theme-icon')) {
                    themeSwitch.querySelector('.theme-icon').textContent = '☀️';
                }
            }
        }
    });

    // Form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Don't prevent default anymore - let the form submit to formspree
            
            // Get form values for potential client-side validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                e.preventDefault(); // Prevent form submission only if validation fails
                alert('Please fill in all fields');
                return;
            }
            
            // Success indicator handled by formspree redirect
            // If you need a custom "sending" indicator, it can be added here
            
            // Don't reset the form - formspree will handle the redirect
        });
    }

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-level');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = originalWidth;
            }, 200);
        });
    };

    // Animate skill bars when they come into view
    const skillsSection = document.querySelector('.skills');
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(skillsSection);
    }

    // Add active class to navigation links on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href') === `#${current}`) {
                navItem.classList.add('active');
            }
        });
    });

    // Typewriter effect for the hero subtitle
    function typeWriter(element, text, speed) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    const typewriterElement = document.querySelector('.typewriter');
    
    if (typewriterElement) {
        // Use a fixed string instead of reading from the element to avoid any corruption
        const text = "Java Developer | Web Developer";
        typeWriter(typewriterElement, text, 50);
        
        // After typewriter effect completes, ensure correct text from translations is applied
        setTimeout(() => {
            const lang = localStorage.getItem('language') || 'en';
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang]['hero-subtitle']) {
                typewriterElement.setAttribute('data-original-text', text);
                typewriterElement.textContent = translations[lang]['hero-subtitle'];
            }
        }, (text.length * 50) + 500);
    }

    // Generate particle background
    function createParticles() {
        const heroSection = document.querySelector('.hero');
        
        if (!heroSection) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.overflow = 'hidden';
        particlesContainer.style.zIndex = '0';
        
        heroSection.insertBefore(particlesContainer, heroSection.firstChild);
        
        const numberOfParticles = window.innerWidth > 768 ? 50 : 30;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.background = 'var(--primary-color)';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0.5';
            
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add the animation to the stylesheet
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100px) translateX(50px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createParticles();

    // Handle language selection
    const languageButtons = document.querySelectorAll('.language-selector button');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            
            // Update active button
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Save language preference
            localStorage.setItem('language', lang);
            
            // Apply translations
            if (typeof applyTranslations === 'function') {
                applyTranslations(lang);
            }
        });
    });
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Set active language button
    languageButtons.forEach(button => {
        if (button.getAttribute('data-lang') === savedLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Apply initial translations
    if (typeof applyTranslations === 'function') {
        applyTranslations(savedLanguage);
    }
});
