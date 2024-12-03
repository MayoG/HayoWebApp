// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Carousel functionality
class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.dots = Array.from(document.querySelectorAll('.carousel-dot'));
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.slideWidth = this.slides[0].offsetWidth;
        
        this.init();
    }

    init() {
        // Add event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Mouse events for drag
        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        this.track.addEventListener('mousemove', this.drag.bind(this));
        this.track.addEventListener('mouseup', this.dragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.dragEnd.bind(this));

        // Touch events for mobile
        this.track.addEventListener('touchstart', this.dragStart.bind(this));
        this.track.addEventListener('touchmove', this.drag.bind(this));
        this.track.addEventListener('touchend', this.dragEnd.bind(this));

        // Prevent context menu on long press
        this.track.addEventListener('contextmenu', (e) => e.preventDefault());

        // Start autoplay
        this.startAutoPlay();

        // Pause autoplay on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.addEventListener('mouseleave', () => {
            if (!this.isDragging) {
                this.startAutoPlay();
            }
        });

        // Update slide width on window resize
        window.addEventListener('resize', () => {
            this.slideWidth = this.slides[0].offsetWidth;
            this.updateCarousel();
        });
    }

    dragStart(e) {
        if (e.type === 'mousedown') {
            this.startPos = e.clientX;
            e.preventDefault();
        } else {
            this.startPos = e.touches[0].clientX;
        }
        this.isDragging = true;
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.track.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const currentPosition = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        
        // Add resistance at the edges
        if (currentTranslate > 0 || currentTranslate < -(this.slideWidth * (this.slides.length - 1))) {
            this.currentTranslate = this.prevTranslate + (currentPosition - this.startPos) * 0.3;
        } else {
            this.currentTranslate = currentTranslate;
        }
    }

    dragEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        // If moved enough negative, next slide
        if (movedBy < -60) {
            this.nextSlide();
        }
        // If moved enough positive, previous slide
        else if (movedBy > 60) {
            this.previousSlide();
        }
        // If not moved enough, snap back
        else {
            this.goToSlide(this.currentIndex);
        }

        this.track.style.cursor = 'grab';
    }

    animation() {
        if (this.isDragging) {
            this.setSliderPosition();
            requestAnimationFrame(this.animation.bind(this));
        }
    }

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.prevTranslate = -(this.slideWidth * this.currentIndex);
        this.currentTranslate = this.prevTranslate;
        this.updateCarousel();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    updateCarousel() {
        this.prevTranslate = -(this.slideWidth * this.currentIndex);
        this.currentTranslate = this.prevTranslate;
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        if (!this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => {
                if (!this.isDragging) {
                    if (this.currentIndex === this.slides.length - 1) {
                        this.goToSlide(0);
                    } else {
                        this.nextSlide();
                    }
                }
            }, 3000);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel();
});
