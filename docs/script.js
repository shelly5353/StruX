// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cube Animation
const cube = document.querySelector('.cube');
const container = document.querySelector('.cube-container');

function rotateCube() {
    if (cube && container) {
        const containerRect = container.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        container.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const deltaX = (e.clientX - containerCenterX) / containerRect.width;
                const deltaY = (e.clientY - containerCenterY) / containerRect.height;

                const rotateX = deltaY * 30;
                const rotateY = deltaX * 30;

                cube.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        container.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                cube.style.transform = 'rotateX(0) rotateY(0)';
            }
        });
    }
}

// Initialize cube animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    rotateCube();
    console.log('Cube initialized');
});

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        callTimes: Array.from(formData.getAll('call_time[]')),
        message: formData.get('message')
    };
    
    // Here you would typically send the data to your server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('תודה! נציג שלנו יצור איתך קשר בהקדם.');
    
    // Reset form
    this.reset();
});

// Add header shadow on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Phone input validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
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
// Initialize Bootstrap carousel
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the carousel with custom options
    const whyUsCarousel = new bootstrap.Carousel(document.getElementById('whyUsCarousel'), {
        interval: 5000, // Change slides every 5 seconds
        pause: 'hover', // Pause on mouse hover
        wrap: true,     // Loop through slides
        keyboard: true  // Allow keyboard navigation
    });

    // Add hover pause functionality
    const carousel = document.getElementById('whyUsCarousel');
    
    carousel.addEventListener('mouseenter', function() {
        whyUsCarousel.pause();
    });
    
    carousel.addEventListener('mouseleave', function() {
        whyUsCarousel.cycle();
    });

    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            whyUsCarousel.next();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            whyUsCarousel.prev();
        }
    }
    
    // Apply AOS animations to carousel elements
    // This ensures AOS animations work properly with carousel
    carousel.addEventListener('slide.bs.carousel', function (e) {
        const nextSlide = e.relatedTarget;
        const elements = nextSlide.querySelectorAll('[data-aos]');
        
        elements.forEach(element => {
            element.classList.remove('aos-animate');
            setTimeout(function() {
                element.classList.add('aos-animate');
            }, 10);
        });
    });
});

// טיפול בכותרת הדינמית בסרגל העליון
document.addEventListener('DOMContentLoaded', function() {
    const headerTitle = document.querySelector('.section-title-header');
    const sections = document.querySelectorAll('section');
    const sectionTitles = {
        'hero': 'פתרון מהפכני בניהול הבניין שלכם',
        'services': 'השירותים שלנו',
        'why-us': 'למה דווקא איתנו?',
        'benefits': 'יתרונות המערכת',
        'contact': 'לקבלת הצעת מחיר מותאמת לבניין שלך'
    };

    function updateHeaderTitle() {
        const scrollPosition = window.scrollY;
        let currentSection = 'hero';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        const title = sectionTitles[currentSection];
        if (title) {
            headerTitle.textContent = title;
            headerTitle.classList.add('visible');
        } else {
            headerTitle.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateHeaderTitle);
    updateHeaderTitle(); // עדכון ראשוני
});