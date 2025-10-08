// ===== MAIN CONTENT FUNCTIONALITY =====
// This file now focuses on page-specific functionality since navbar is handled by shared-elements.js

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe service cards and other animated elements
    const animatedElements = document.querySelectorAll('.service-card, .section-title, .section-description');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== FORM HANDLING =====
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            // Let FormSubmit handle the submission - don't prevent default behavior
            console.log('Form being submitted to FormSubmit:', form.action);
            
            // Optional: Add basic client-side validation here
            const requiredFields = form.querySelectorAll('[required]');
            for (let field of requiredFields) {
                if (!field.value.trim()) {
                    alert(`Please fill in the ${field.name || field.type} field.`);
                    event.preventDefault(); // Only prevent if validation fails
                    field.focus();
                    return;
                }
            }
            
            // If we get here, form is valid and will submit normally to FormSubmit
        });
    });
}

// ===== THEME TOGGLE (Optional - for future dark mode) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-theme');
            
            // Save preference to localStorage
            const isDark = document.documentElement.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        }
    }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== PRELOADER FUNCTIONALITY =====
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.remove();
        }, 300);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for shared elements to load, then initialize page-specific functionality
    setTimeout(() => {
        createIntersectionObserver();
        // initFormHandling(); // Temporarily disabled to test form submission
        initThemeToggle();
        initAccessibility();
        
        // Hide preloader if it exists
        hidePreloader();
        
        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
        
        console.log('BVC Website main functionality initialized successfully!');
    }, 100); // Small delay to ensure shared elements are loaded
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    // You could send this to an error reporting service
});

// ===== UTILITY FUNCTIONS =====
const BVC = {
    // Utility to scroll to any element
    scrollTo: (selector, offset = 0) => {
        const element = document.querySelector(selector);
        if (element) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const top = element.offsetTop - navbarHeight - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },
    
    // Utility to show/hide elements with animation
    show: (element, display = 'block') => {
        element.style.display = display;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },
    
    hide: (element) => {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    },
    
    // Utility to check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Make BVC utilities available globally
window.BVC = BVC;
