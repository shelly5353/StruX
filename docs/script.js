// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // תפריט ניווט
    const tocButton = document.getElementById('tocButton');
    const tocModal = document.getElementById('tocModal');
    const tocCloseButton = document.querySelector('.toc-close-button');
    
    if (tocButton && tocModal) {
        tocButton.addEventListener('click', function() {
            tocModal.classList.toggle('active');
        });

        if (tocCloseButton) {
            tocCloseButton.addEventListener('click', function() {
                tocModal.classList.remove('active');
            });
        }

        // סגירת התפריט בלחיצה מחוץ לו
        document.addEventListener('click', function(event) {
            if (!tocButton.contains(event.target) && !tocModal.contains(event.target)) {
                tocModal.classList.remove('active');
            }
        });

        // סגירת התפריט בלחיצה על קישור
        tocModal.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                tocModal.classList.remove('active');
            });
        });
    }

    // Accessibility bar functionality
    const accessibilityBar = document.querySelector('.accessibility-bar');
    const accessibilityToggle = document.querySelector('.accessibility-toggle');
    const accessibilityPanel = document.querySelector('.accessibility-panel');
    const closeAccessibility = document.querySelector('.close-accessibility');
    const decreaseText = document.getElementById('decreaseText');
    const increaseText = document.getElementById('increaseText');
    const highContrast = document.getElementById('highContrast');
    const grayScale = document.getElementById('grayScale');
    const textToSpeech = document.getElementById('textToSpeech');
    const resetSettings = document.getElementById('resetSettings');
    const increaseCursor = document.getElementById('increaseCursor');
    const disableAnimations = document.getElementById('disableAnimations');

    if (accessibilityToggle && accessibilityPanel) {
        // Toggle accessibility panel
        accessibilityToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            accessibilityBar.classList.toggle('active');
            const isExpanded = accessibilityToggle.getAttribute('aria-expanded') === 'true';
            accessibilityToggle.setAttribute('aria-expanded', !isExpanded);
            accessibilityPanel.setAttribute('aria-hidden', isExpanded);
        });

        // Close accessibility panel
        if (closeAccessibility) {
            closeAccessibility.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                accessibilityBar.classList.remove('active');
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityPanel.setAttribute('aria-hidden', 'true');
            });
        }

        // Close panel when clicking outside
        document.addEventListener('click', function(event) {
            if (accessibilityBar.classList.contains('active') && 
                !accessibilityBar.contains(event.target)) {
                accessibilityBar.classList.remove('active');
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityPanel.setAttribute('aria-hidden', 'true');
            }
        });

        // Prevent panel closing when clicking inside
        accessibilityPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Text size controls
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 100;
    const minFontSize = 80;
    const maxFontSize = 140;

    function updateFontSize() {
        document.documentElement.style.fontSize = `${currentFontSize}%`;
        localStorage.setItem('fontSize', currentFontSize);
        
        // Update button states
        if (decreaseText) {
            decreaseText.disabled = currentFontSize <= minFontSize;
        }
        if (increaseText) {
            increaseText.disabled = currentFontSize >= maxFontSize;
        }
    }

    // Initialize font size
    updateFontSize();

    if (decreaseText) {
        decreaseText.addEventListener('click', function() {
            if (currentFontSize > minFontSize) {
                currentFontSize -= 10;
                updateFontSize();
            }
        });
    }

    if (increaseText) {
        increaseText.addEventListener('click', function() {
            if (currentFontSize < maxFontSize) {
                currentFontSize += 10;
                updateFontSize();
            }
        });
    }

    // High contrast mode - תיקון #2
    function toggleHighContrast() {
        document.documentElement.classList.toggle('high-contrast');
        highContrast.classList.toggle('active');
        localStorage.setItem('highContrast', document.documentElement.classList.contains('high-contrast'));
    }

    // טעינת מצב ניגודיות שמור
    if (localStorage.getItem('highContrast') === 'true') {
        toggleHighContrast();
    }

    highContrast.addEventListener('click', toggleHighContrast);

    // Grayscale mode
    function toggleGrayScale() {
        document.body.classList.toggle('gray-scale');
        grayScale.classList.toggle('active');
        localStorage.setItem('grayScale', document.body.classList.contains('gray-scale'));
    }

    // טעינת מצב אפור שמור
    if (localStorage.getItem('grayScale') === 'true') {
        toggleGrayScale();
    }

    grayScale.addEventListener('click', toggleGrayScale);

    // Text to speech functionality
    let currentUtterance = null;
    let currentSpeechRate = 1.0;

    function startSpeech(text) {
        if (currentUtterance) {
            speechSynthesis.cancel();
        }

        // מחלק את הטקסט למשפטים
        const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
        
        // פונקציה להקראת משפט
        function speakSentence(index) {
            if (index >= sentences.length) {
                textToSpeech.textContent = 'הקראה';
                textToSpeech.classList.remove('active');
                return;
            }

            const sentence = sentences[index] + '.';
            currentUtterance = new SpeechSynthesisUtterance(sentence);
            currentUtterance.rate = currentSpeechRate;
            currentUtterance.lang = 'he-IL';

            // חיפוש קול בעברית
            const voices = speechSynthesis.getVoices();
            const hebrewVoice = voices.find(voice => voice.lang.includes('he'));
            if (hebrewVoice) {
                currentUtterance.voice = hebrewVoice;
            }

            currentUtterance.onend = () => {
                speakSentence(index + 1);
            };

            speechSynthesis.speak(currentUtterance);
        }

        // מתחיל את ההקראה מהמשפט הראשון
        speakSentence(0);
        textToSpeech.textContent = 'עצור';
        textToSpeech.classList.add('active');
    }

    textToSpeech.addEventListener('click', function() {
        if ('speechSynthesis' in window) {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                textToSpeech.textContent = 'הקראה';
                textToSpeech.classList.remove('active');
                return;
            }

            let fullText = '';

            // התחלה מהטקסט הראשי בדף הבית
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const mainHeading = heroContent.querySelector('h1');
                const mainParagraph = heroContent.querySelector('p');
                if (mainHeading) fullText += mainHeading.textContent + '. ';
                if (mainParagraph) fullText += mainParagraph.textContent + '. ';
            }

            // הוספת טקסט מהגריד הראשון (services)
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                const serviceTitle = servicesSection.querySelector('.section-title');
                if (serviceTitle) {
                    fullText += 'שירותים שלנו: ' + serviceTitle.textContent + '. ';
                }

                const serviceCards = servicesSection.querySelectorAll('.service-card');
                serviceCards.forEach(card => {
                    const cardTitle = card.querySelector('h3');
                    const cardText = card.querySelector('p');
                    if (cardTitle) fullText += cardTitle.textContent + ': ';
                    if (cardText) fullText += cardText.textContent + '. ';
                });
            }

            // הוספת טקסט מהחברות בקבוצה
            const groupSection = document.querySelector('#group');
            if (groupSection) {
                const groupTitle = groupSection.querySelector('.section-title');
                if (groupTitle) {
                    fullText += 'חברות בקבוצה: ' + groupTitle.textContent + '. ';
                }

                const companyCards = groupSection.querySelectorAll('.company-card');
                companyCards.forEach(card => {
                    const companyName = card.querySelector('.company-name');
                    const companyDesc = card.querySelector('.company-description');
                    if (companyName) fullText += companyName.textContent + ': ';
                    if (companyDesc) fullText += companyDesc.textContent + '. ';
                });
            }

            // הוספת טקסט מהיתרונות
            const benefitsSection = document.querySelector('#benefits');
            if (benefitsSection) {
                const benefitsTitle = benefitsSection.querySelector('.section-title');
                if (benefitsTitle) {
                    fullText += 'יתרונות המערכת: ' + benefitsTitle.textContent + '. ';
                }

                const benefitCards = benefitsSection.querySelectorAll('.benefit-card');
                benefitCards.forEach(card => {
                    const cardTitle = card.querySelector('h3');
                    const cardText = card.querySelector('p');
                    if (cardTitle) fullText += cardTitle.textContent + ': ';
                    if (cardText) fullText += cardText.textContent + '. ';
                });
            }

            // הוספת טקסט מהטופס
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const contactTitle = contactSection.querySelector('.section-title');
                if (contactTitle) {
                    fullText += 'צור קשר: ' + contactTitle.textContent + '. ';
                }
                const contactText = contactSection.querySelector('p');
                if (contactText) {
                    fullText += contactText.textContent + '. ';
                }
                const submitButton = contactSection.querySelector('.submit-button');
                if (submitButton) {
                    fullText += 'לסיום, לחץ על כפתור ' + submitButton.textContent;
                }
            }

            // טיפול בטקסט לפני ההקראה
            fullText = fullText
                .replace(/\s+/g, ' ')  // מסיר רווחים מיותרים
                .replace(/\.+/g, '.') // מסיר נקודות מיותרות
                .trim();

            if (fullText) {
                startSpeech(fullText);
            } else {
                alert('לא נמצא טקסט להקראה');
            }
        } else {
            alert('הדפדפן שלך אינו תומך בהקראת טקסט');
        }
    });

    // Speed control
    const decreaseSpeed = document.getElementById('decreaseSpeed');
    const increaseSpeed = document.getElementById('increaseSpeed');
    const speedDisplay = document.getElementById('speedDisplay');

    function updateSpeedDisplay() {
        speedDisplay.textContent = `x${currentSpeechRate.toFixed(1)}`;
    }

    decreaseSpeed.addEventListener('click', () => {
        if (currentSpeechRate > 0.5) {
            currentSpeechRate -= 0.1;
            updateSpeedDisplay();
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                textToSpeech.click(); // מתחיל מחדש עם המהירות החדשה
            }
        }
    });

    increaseSpeed.addEventListener('click', () => {
        if (currentSpeechRate < 2.0) {
            currentSpeechRate += 0.1;
            updateSpeedDisplay();
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                textToSpeech.click(); // מתחיל מחדש עם המהירות החדשה
            }
        }
    });

    // הגדלת סמן
    function toggleLargeCursor() {
        document.body.classList.toggle('large-cursor');
        increaseCursor.classList.toggle('active');
        localStorage.setItem('largeCursor', document.body.classList.contains('large-cursor'));
    }

    // טעינת מצב סמן שמור
    if (localStorage.getItem('largeCursor') === 'true') {
        toggleLargeCursor();
    }

    increaseCursor.addEventListener('click', toggleLargeCursor);

    // ביטול הנפשות
    function toggleAnimations() {
        document.body.classList.toggle('no-animations');
        disableAnimations.classList.toggle('active');
        localStorage.setItem('noAnimations', document.body.classList.contains('no-animations'));
    }

    // טעינת מצב הנפשות שמור
    if (localStorage.getItem('noAnimations') === 'true') {
        toggleAnimations();
    }

    disableAnimations.addEventListener('click', toggleAnimations);

    // Reset settings - תיקון #5
    resetSettings.addEventListener('click', function() {
        // איפוס גודל טקסט
        currentFontSize = 100;
        document.documentElement.style.fontSize = '100%';
        localStorage.removeItem('fontSize');

        // איפוס ניגודיות
        if (document.documentElement.classList.contains('high-contrast')) {
            toggleHighContrast();
        }

        // איפוס מצב אפור
        if (document.body.classList.contains('gray-scale')) {
            toggleGrayScale();
        }

        // איפוס סמן
        if (document.body.classList.contains('large-cursor')) {
            toggleLargeCursor();
        }

        // איפוס הנפשות
        if (document.body.classList.contains('no-animations')) {
            toggleAnimations();
        }

        // עצירת הקראה אם פעילה
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            textToSpeech.textContent = 'הקראה';
            textToSpeech.classList.remove('active');
        }

        // איפוס localStorage
        localStorage.removeItem('highContrast');
        localStorage.removeItem('grayScale');
        localStorage.removeItem('largeCursor');
        localStorage.removeItem('noAnimations');

        // איפוס מצב כפתורים
        highContrast.classList.remove('active');
        grayScale.classList.remove('active');
        increaseCursor.classList.remove('active');
        disableAnimations.classList.remove('active');
        textToSpeech.classList.remove('active');
    });

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