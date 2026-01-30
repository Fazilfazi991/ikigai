// ===================================
// IKIGAI AUTO PARTS - MAIN JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== MOBILE MENU TOGGLE =====
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // ===== STICKY NAVIGATION =====
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== HERO SLIDER =====
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        if (heroSlides[index]) {
            heroSlides[index].classList.add('active');
        }
        if (heroDots[index]) {
            heroDots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        if (heroSlides.length > 0) {
            showSlide(0);
            slideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        }
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Dot navigation
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlider();
            currentSlide = index;
            showSlide(currentSlide);
            startSlider();
        });
    });

    // Start the slider
    startSlider();

    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }

    // ===== SCROLL ANIMATIONS =====
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }

    // Check on scroll
    window.addEventListener('scroll', checkFade);

    // Check on load
    checkFade();

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== ACTIVE NAVIGATION LINK =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ===== FORM VALIDATION =====
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form fields
            const name = this.querySelector('input[name="name"]');
            const email = this.querySelector('input[name="email"]');
            const phone = this.querySelector('input[name="phone"]');
            const message = this.querySelector('textarea[name="message"]');
            const attachment = this.querySelector('input[name="attachment"]');

            let isValid = true;

            // Simple validation
            if (name && name.value.trim() === '') {
                alert('Please enter your name');
                name.focus();
                isValid = false;
                return;
            }

            if (email && !validateEmail(email.value)) {
                alert('Please enter a valid email address');
                email.focus();
                isValid = false;
                return;
            }

            if (phone && phone.value.trim() === '') {
                alert('Please enter your phone number');
                phone.focus();
                isValid = false;
                return;
            }

            if (message && message.value.trim() === '') {
                alert('Please enter your message');
                message.focus();
                isValid = false;
                return;
            }

            if (attachment && attachment.files.length > 0) {
                const file = attachment.files[0];
                const maxSize = 10 * 1024 * 1024; // 10MB

                if (file.size > maxSize) {
                    alert('File size exceeds 10MB limit');
                    attachment.value = ''; // Clear the input
                    isValid = false;
                    return;
                }
            }

            if (isValid) {
                // In a real application, you would send this data to a server
                alert('Thank you for your message! We will contact you soon.');
                this.reset();
            }
        });
    }

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===== COUNTER ANIMATION FOR STATS =====
    const stats = document.querySelectorAll('.stat-item h3');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const suffix = stat.textContent.replace(/[0-9,]/g, '');
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + suffix;
                }
            }, stepTime);
        });

        statsAnimated = true;
    }

    // Trigger stats animation when in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ===== WHATSAPP FLOATING BUTTON =====
    function createWhatsAppButton() {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = 'https://wa.me/971507363657';
        whatsappBtn.target = '_blank';
        whatsappBtn.className = 'whatsapp-float';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.title = 'Chat on WhatsApp';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .whatsapp-float {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25D366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
        z-index: 999;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      }
      
      .whatsapp-float:hover {
        background: #20BA5A;
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
      }
      
      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
        }
        50% {
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.7);
        }
      }
      
      @media (max-width: 768px) {
        .whatsapp-float {
          width: 50px;
          height: 50px;
          font-size: 28px;
          bottom: 20px;
          right: 20px;
        }
      }
    `;

        document.head.appendChild(style);
        document.body.appendChild(whatsappBtn);
    }

    // Create WhatsApp button
    createWhatsAppButton();



});
