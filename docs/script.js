// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (backToTopBtn) {
        // Show/hide back to top button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });
        
        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

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

    // מונע את הבעיה של "bounce" בקצוות הדף
    document.addEventListener('touchmove', function(e) {
        // מאפשר גלילה רגילה בלי התערבות
    }, { passive: true });
    
    // טיפול בגלילה בסוף הדף
    let lastScrollPosition = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        // אם מגיעים לסוף העמוד ולא מנסים לגלול למעלה
        if ((windowHeight + currentScroll >= documentHeight - 5) && currentScroll > lastScrollPosition) {
            // מוסיף מרווח קטן למניעת "היתקעות"
            document.body.style.paddingBottom = '1px';
            setTimeout(function() {
                document.body.style.paddingBottom = '0';
            }, 200);
        }
        
        lastScrollPosition = currentScroll;
    }, { passive: true });

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

    // Form submission with improved animation and Google Sheets integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form data
            const name = this.querySelector('#name').value.trim();
            const phone = this.querySelector('#phone').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            if (!name || !phone || !email) {
                showError('אנא מלא את כל השדות החובה');
                return;
            }
            
            if (phone.length < 10) {
                showError('מספר הטלפון חייב להכיל לפחות 10 ספרות');
                return;
            }
            
            if (!isValidEmail(email)) {
                showError('כתובת האימייל אינה תקינה');
                return;
            }
            
            // Animation for the submit button
            const submitButton = this.querySelector('.submit-button');
            submitButton.innerHTML = '<span class="spinner"></span> שולח...';
            submitButton.disabled = true;

            // Get selected call times
            const selectedTimes = Array.from(this.querySelectorAll('input[name="call_time[]"]:checked'))
                .map(checkbox => checkbox.value)
                .join(', ');
            
            try {
                // כתובת ה-URL של הסקריפט
                const scriptURL = 'https://script.google.com/macros/s/AKfycbyOTDktIq9A4-AFuW_pVnZNabxAbHjz77oEXY39owisKHKWwp2kcMvbGLf1n4rZF8-m/exec';
                
                // בנייה של ה-URL עם פרמטרים
                const url = new URL(scriptURL);
                const params = new URLSearchParams();
                params.append('name', name);
                params.append('phone', phone);
                params.append('email', email);
                params.append('callTime', selectedTimes);
                params.append('notes', message);
                
                // הוספת הפרמטרים ל-URL
                url.search = params.toString();
                
                // שליחת הבקשה
                const response = await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors' // חשוב - זה מונע שגיאות CORS
                });
                
                // גם אם אין לנו תשובה (mode: no-cors לא מחזיר תוכן), נניח שהפעולה הצליחה
                showSuccess();
                contactForm.reset();
                
            } catch (error) {
                console.error('Error:', error);
                showError('אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר או צור קשר בטלפון 050-6599806');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'שלח פרטים';
            }
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
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const form = document.getElementById('contactForm');
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.parentNode.insertBefore(errorDiv, form);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> תודה! נציג שלנו יצור איתך קשר בהקדם.';
        
        const form = document.getElementById('contactForm');
        form.parentNode.appendChild(successMessage);
        
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
        
        setTimeout(() => {
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
            successMessage.remove();
        }, 5000);
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
    
    const popup = document.getElementById('welcomePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const popupCtaBtn = document.getElementById('popupCta');
    
    if (!popup) {
        console.error("Popup element not found!");
        return;
    }
    
    // מציג את הפופאפ תמיד בשביל בדיקה (אחר-כך נוכל להחזיר לגרסה המקורית)
    console.log("Showing popup for testing");
    setTimeout(() => {
        showPopup();
    }, 1500); // עיכוב של 1.5 שניות לפני הצגת הפופאפ
    
    /* הקוד המקורי - מוחבא כרגע לצורך בדיקה
    // בדיקה אם המשתמש ביקר בעבר
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
        console.log("New user detected, showing popup");
        // הצגת הפופאפ רק למשתמשים חדשים
        setTimeout(() => {
            showPopup();
        }, 1500); // עיכוב של 1.5 שניות לפני הצגת הפופאפ
    } else {
        console.log("Returning user, popup will not be shown");
    }
    */
    
    // הצגת הפופאפ
    function showPopup() {
        console.log("Showing popup");
        popup.style.opacity = "1";
        popup.style.visibility = "visible";
        popup.style.pointerEvents = "all";
        document.body.style.overflow = "hidden";
        popup.classList.add('active');
        
        // הפעלת אנימציית הפופאפ
        const container = popup.querySelector('.popup-container');
        if (container) {
            container.style.transform = "scale(1)";
            container.style.opacity = "1";
        }
    }
    
    // הסתרת הפופאפ
    function hidePopup() {
        popup.style.opacity = "0";
        popup.style.visibility = "hidden";
        popup.style.pointerEvents = "none";
        document.body.style.overflow = "";
        localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // טיפול בלחיצה על כפתור הסגירה
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hidePopup();
        });
    }
    
    // טיפול בלחיצה על כפתור ה-CTA
    if (popupCtaBtn) {
        popupCtaBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hidePopup();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // טיפול בלחיצה מחוץ לפופאפ
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            hidePopup();
        }
    });
}); 