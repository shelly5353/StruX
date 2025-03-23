// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // הגדרת משתנה לפני השימוש בו
        let lastScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        // ראשית ניסיון גלילה בצורה חלקה
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // יש פה שני פתרונות למקרה שהגלילה החלקה לא מגיעה עד למעלה:
        
        // פתרון 1: לאחר הגלילה החלקה, נוודא שמגיעים לקצה העליון בקפיצה מידית
        setTimeout(() => {
            // שימוש בדרכים שונות לגלילה למעלה כדי לתמוך בדפדפנים ישנים
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 1000);
        
        // פתרון 2: פתרון נוסף עם מעקב אחרי התקדמות הגלילה
        const scrollInterval = setInterval(() => {
            // מקבלים את המיקום הנוכחי בצורה תואמת לכל הדפדפנים
            const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            // אם כבר הגענו למצב די קרוב לראש הדף
            if (currentScrollPos < 10) {
                // נקפוץ למיקום 0,0 כדי להבטיח שהגענו לגמרי למעלה
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                clearInterval(scrollInterval);
            } 
            // אם הגלילה נעצרה באמצע - נמשיך למעלה בקפיצה
            else if (currentScrollPos > 0 && Math.abs(lastScrollPos - currentScrollPos) < 1) {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                clearInterval(scrollInterval);
            }
            
            lastScrollPos = currentScrollPos;
        }, 100);
    });

    // Phone input validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add animation to the target section
                target.classList.add('section-highlight');
                setTimeout(() => {
                    target.classList.remove('section-highlight');
                }, 1500);
            }
        });
    });

    // Enhanced Service cards interaction
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            serviceCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Improved animation sequence
            this.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                this.classList.add('pulse-animation');
                setTimeout(() => {
                    this.style.transform = '';
                    this.classList.remove('pulse-animation');
                }, 800);
            }, 200);
        });
        
        // Hover animation
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) translateY(-5px)';
                icon.style.color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = '';
                icon.style.color = '';
            }
        });
    });

    // Enhanced Benefits cards interaction with 3D effect
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const maxRotate = 10; // max rotation in degrees
            
            const rotateY = maxRotate * (x - centerX) / centerX;
            const rotateX = -1 * maxRotate * (y - centerY) / centerY;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s ease-out';
        });
        
        // Click animation
        card.addEventListener('click', function() {
            benefitCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            setTimeout(() => {
                this.classList.add('float-back');
                setTimeout(() => {
                    this.classList.remove('float-back');
                }, 500);
            }, 300);
        });
    });

    // Table of Contents functionality
    const tocButton = document.getElementById('tocButton');
    const tocModal = document.getElementById('tocModal');

    // פתיחת המודל
    tocButton.addEventListener('click', function() {
        tocModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // סגירת המודל בלחיצה על קישור
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            tocModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // סגירת המודל בלחיצה מחוץ למודל
    document.addEventListener('click', function(event) {
        if (!tocModal.contains(event.target) && !tocButton.contains(event.target)) {
            tocModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Form submission with improved animation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animation for the submit button
            const submitButton = this.querySelector('.submit-button');
            submitButton.innerHTML = '<span class="spinner"></span> שולח...';
            submitButton.disabled = true;
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                callTimes: Array.from(formData.getAll('call_time[]')),
                message: formData.get('message')
            };
            
            console.log('Form submitted:', data);
            
            // Simulated form submission delay for animation
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> נשלח בהצלחה!';
                submitButton.style.backgroundColor = '#4caf50';
                
                // Create and show a success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> תודה! נציג שלנו יצור איתך קשר בהקדם.';
                this.parentNode.appendChild(successMessage);
                
                // Hide the form
                this.style.opacity = '0.5';
                this.style.pointerEvents = 'none';
                
                // Reset after a delay
                setTimeout(() => {
                    this.reset();
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                    submitButton.innerHTML = 'שלח פרטים';
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
        
        // Animation for form fields focus
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentNode.classList.remove('input-focused');
                }
            });
        });
    }
    
    // Add animations to section titles when they enter viewport
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const animateSectionTitles = () => {
        sectionTitles.forEach(title => {
            const titlePosition = title.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (titlePosition < screenPosition) {
                title.classList.add('animate-title');
            }
        });
    };
    
    window.addEventListener('scroll', animateSectionTitles);
    animateSectionTitles(); // Run once on load
});

// Add animations for carousel items
document.addEventListener('DOMContentLoaded', function() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    carouselItems.forEach(item => {
        item.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                const title = this.querySelector('.carousel-title');
                const text = this.querySelector('.carousel-text');
                
                if (title && text) {
                    title.classList.add('animate-text');
                    text.classList.add('animate-text');
                    
                    setTimeout(() => {
                        title.classList.remove('animate-text');
                        text.classList.remove('animate-text');
                    }, 500);
                }
            }
        });
    });
});

// Add CSS class definitions for new animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .success-message {
            background: linear-gradient(135deg, #4caf50, #2e7d32);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .input-focused label {
            color: var(--primary-color);
            font-weight: 500;
            transform: translateY(-5px);
            transition: all 0.3s ease;
        }
        
        .section-highlight {
            animation: highlight 1.5s ease-out;
        }
        
        @keyframes highlight {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(31, 58, 147, 0.1); }
        }
        
        .animate-title {
            animation: titleEffect 0.8s ease-out forwards;
        }
        
        @keyframes titleEffect {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-text {
            animation: textEffect 0.5s ease-out;
        }
        
        @keyframes textEffect {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .pulse-animation {
            animation: pulse 0.8s ease-in-out;
        }
    `;
    document.head.appendChild(style);
});

// Benefit cards hover and touch animation
document.querySelectorAll('.benefit-card').forEach(card => {
    // Mouse events for desktop
    card.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
            this.classList.add('float-back');
            this.addEventListener('animationend', function() {
                this.classList.remove('float-back');
            }, { once: true });
        }
    });

    // Touch events for mobile
    let touchTimeout;
    
    card.addEventListener('touchstart', function(e) {
        // מונע את ברירת המחדל של הדפדפן
        e.preventDefault();
        
        // מסיר את הקלאס מכל הקוביות האחרות
        document.querySelectorAll('.benefit-card').forEach(otherCard => {
            if (otherCard !== this) {
                otherCard.classList.remove('active', 'float-back');
            }
        });
        
        // מוסיף את הקלאס active לקובייה הנוכחית
        this.classList.add('active');
        
        // מנקה טיימר קודם אם קיים
        if (touchTimeout) {
            clearTimeout(touchTimeout);
        }
    });

    card.addEventListener('touchend', function() {
        const currentCard = this;
        
        // מחכה רגע קצר ואז מפעיל את אנימציית החזרה
        touchTimeout = setTimeout(() => {
            currentCard.classList.remove('active');
            currentCard.classList.add('float-back');
            
            currentCard.addEventListener('animationend', function() {
                currentCard.classList.remove('float-back');
            }, { once: true });
        }, 200);
    });
});

// Service Cards Touch Effect
document.querySelectorAll('.service-card').forEach(card => {
    let touchTimeout;
    
    card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        clearTimeout(touchTimeout);
        this.classList.remove('fade-out');
        this.classList.add('active');
    });

    card.addEventListener('touchend', function() {
        const self = this;
        self.classList.remove('active');
        self.classList.add('fade-out');
        
        touchTimeout = setTimeout(() => {
            self.classList.remove('fade-out');
        }, 300);
    });

    card.addEventListener('touchcancel', function() {
        const self = this;
        self.classList.remove('active');
        self.classList.add('fade-out');
        
        touchTimeout = setTimeout(() => {
            self.classList.remove('fade-out');
        }, 300);
    });
});

// Welcome Popup for new users
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, checking for popup");
    
    // איפוס localStorage לצורך בדיקה - תוכל להסיר שורה זו כשהפופאפ עובד כראוי
    localStorage.removeItem('hasVisitedBefore');
    
    const popup = document.getElementById('welcomePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupCtaBtn = document.getElementById('popupCta');
    
    console.log("Popup element:", popup);
    
    if (!popup) {
        console.error("Popup element not found!");
        return;
    }
    
    if (!closePopupBtn) {
        console.error("Close button not found!");
    } else {
        console.log("Close button found, attaching event listener");
        // Close popup when close button is clicked - ישירות מסיר את הסגנון
        closePopupBtn.addEventListener('click', function(e) {
            console.log("Close button clicked");
            popup.style.opacity = "0";
            popup.style.visibility = "hidden";
            popup.style.pointerEvents = "none";
        });
    }
    
    if (!popupCtaBtn) {
        console.error("CTA button not found!");
    } else {
        console.log("CTA button found, attaching event listener");
        // CTA button action - ישירות מסיר את הסגנון
        popupCtaBtn.addEventListener('click', function(e) {
            console.log("CTA button clicked");
            popup.style.opacity = "0";
            popup.style.visibility = "hidden";
            popup.style.pointerEvents = "none";
            
            // גלילה לתחילת הדף
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            console.log("Clicked outside popup");
            popup.style.opacity = "0";
            popup.style.visibility = "hidden";
            popup.style.pointerEvents = "none";
        }
    });
}); 