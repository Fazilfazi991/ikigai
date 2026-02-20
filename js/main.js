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
            slideInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
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

    // Arrow Navigation
    const prevBtn = document.querySelector('.hero-arrow.prev');
    const nextBtn = document.querySelector('.hero-arrow.next');

    console.log('Arrow buttons found:', { prevBtn, nextBtn });

    if (prevBtn && nextBtn) {
        console.log('Attaching arrow event listeners...');

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked');
            stopSlider();
            currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
            showSlide(currentSlide);
            startSlider();
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked');
            stopSlider();
            nextSlide();
            startSlider();
        });

        console.log('Arrow event listeners attached successfully');
    } else {
        console.error('Arrow buttons not found!');
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

    // ===== FORM VALIDATION & EMAILJS SUBMISSION =====
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop default form submission

            const submitBtn = document.getElementById('submit-button');
            const originalBtnText = submitBtn.innerHTML;

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
            } else if (email && !validateEmail(email.value)) {
                alert('Please enter a valid email address');
                email.focus();
                isValid = false;
            } else if (phone && phone.value.trim() === '') {
                alert('Please enter your phone number');
                phone.focus();
                isValid = false;
            } else if (message && message.value.trim() === '') {
                alert('Please enter your message');
                message.focus();
                isValid = false;
            } else if (attachment && attachment.files.length > 0) {
                const file = attachment.files[0];
                const maxSize = 50 * 1024; // 50KB for EmailJS Free Tier

                if (file.size > maxSize) {
                    alert('Due to server limits, attachments must be under 50KB. Please remove the file or upload a smaller one.');
                    attachment.value = ''; // Clear the input
                    isValid = false;
                }
            }

            if (isValid) {
                // Update button state to show loading
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                const templateParams = {
                    name: name ? name.value : '',
                    email: email ? email.value : '',
                    phone: phone ? phone.value : '',
                    company: this.querySelector('input[name="company"]').value,
                    country: this.querySelector('input[name="country"]').value,
                    subject: this.querySelector('select[name="subject"]').value,
                    message: message ? message.value : ''
                };

                // Function to handle the actual sending
                const sendEmail = (params) => {
                    emailjs.send('service_z884j6b', 'template_t4dc756', params)
                        .then(() => {
                            console.log('SUCCESS!');
                            alert('Thank you for your message! We will contact you soon.');
                            this.reset();
                        })
                        .catch((error) => {
                            console.log('FAILED...', error);
                            alert('Oops! Something went wrong to send the email: ' + (error.text || JSON.stringify(error)));
                        })
                        .finally(() => {
                            // Restore button state
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.disabled = false;
                        });
                };

                if (attachment && attachment.files.length > 0) {
                    // Convert file to base64
                    const file = attachment.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        templateParams.attachment = reader.result; // add base64 string to params
                        sendEmail(templateParams);
                    };
                    reader.onerror = function (error) {
                        console.log('Error reading file: ', error);
                        alert('Error attaching file. Please try submitting without the attachment.');
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    };
                } else {
                    // Send without attachment
                    sendEmail(templateParams);
                }
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
