// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
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
    card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.classList.add('active');
    });

    card.addEventListener('touchend', function() {
        setTimeout(() => {
            this.classList.remove('active');
        }, 500);
    });
}); 