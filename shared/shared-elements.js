// ===== SHARED ELEMENTS LOADER =====
class SharedElementsLoader {
    constructor() {
        // Navbar HTML template embedded directly to avoid CORS issues with file:// protocol
        this.navbarHTML = `
<!-- Navigation -->
<nav class="navbar">
    <div class="nav-container">
        <!-- Logo/Brand -->
        <div class="nav-brand">
            <a href="../index.html" class="brand-link">
                <img src="../images/BVC.png" alt="BVC Logo" class="brand-logo" id="brand-logo">
                <span class="brand-text">BVC</span>
            </a>
        </div>

        <!-- Desktop Navigation Menu -->
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="consulting.html" class="nav-link">Consulting</a>
            </li>
            <li class="nav-item">
                <a href="asset-management.html" class="nav-link">Asset Management</a>
            </li>
            <li class="nav-item">
                <a href="about-us.html" class="nav-link">About Us</a>
            </li>
            <li class="nav-item">
                <a href="contact.html" class="nav-link">Contact</a>
            </li>
            <li class="nav-item">
                <a href="career.html" class="nav-link">Career</a>
            </li>
        </ul>

        <!-- Mobile Hamburger Menu -->
        <div class="hamburger" id="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>

<!-- Mobile Sidebar -->
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-brand">
            <a href="../index.html" class="brand-link" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                <img src="../images/BVC.png" alt="BVC Logo" class="sidebar-logo" id="sidebar-logo">
            </a>
        </div>
        <button class="sidebar-close" id="sidebar-close">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <ul class="sidebar-menu">
        <li class="sidebar-item">
            <a href="consulting.html" class="sidebar-link">
                <i class="fas fa-lightbulb"></i>
                <span>Consulting</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="asset-management.html" class="sidebar-link">
                <i class="fas fa-chart-line"></i>
                <span>Asset Management</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="about-us.html" class="sidebar-link">
                <i class="fas fa-users"></i>
                <span>About Us</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="contact.html" class="sidebar-link">
                <i class="fas fa-envelope"></i>
                <span>Contact</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="career.html" class="sidebar-link">
                <i class="fas fa-briefcase"></i>
                <span>Career</span>
            </a>
        </li>
    </ul>
</div>

<!-- Sidebar Overlay -->
<div class="sidebar-overlay" id="sidebar-overlay"></div>
        `;
    }

    // Load navbar into the page
    loadNavbar(targetSelector = 'body') {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            // Insert navbar at the beginning of the target element
            targetElement.insertAdjacentHTML('afterbegin', this.navbarHTML);
            
            // Initialize navbar functionality after loading
            this.initializeNavbar();
            
            console.log('Navbar loaded successfully');
            return true;
        } else {
            console.error(`Target element ${targetSelector} not found`);
            return false;
        }
    }

    // Initialize navbar functionality (moved from main script)
    initializeNavbar() {
        // Re-initialize navbar elements after loading
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarClose = document.getElementById('sidebar-close');
        const navLinks = document.querySelectorAll('.nav-link');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const brandLogo = document.getElementById('brand-logo');
        const sidebarLogo = document.getElementById('sidebar-logo');

        if (!hamburger || !sidebar || !sidebarOverlay || !sidebarClose) {
            console.error('Navbar elements not found after loading');
            return;
        }

        // Mobile menu functionality
        const toggleSidebar = () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Event listeners
        hamburger.addEventListener('click', toggleSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        // Close sidebar when clicking on a link
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeSidebar();
                // Allow normal navigation to other pages
                // No need to prevent default or handle smooth scrolling for external pages
            });
        });

        // Set active page highlighting
        setTimeout(() => {
            this.setActiveNavItem();
        }, 100);

        // Handle navigation links (no smooth scrolling needed for separate pages)
        navLinks.forEach(link => {
            // Allow normal navigation to other pages
            // Smooth scrolling only needed for same-page anchors
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Only handle smooth scrolling for anchor links on same page
                    event.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 140;
                        const targetPosition = target.offsetTop - navbarHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // For external pages (.html files), allow normal navigation
            });
        });

        // Logo loading handlers
        const handleLogoLoad = (logoElement) => {
            if (logoElement) {
                logoElement.addEventListener('load', () => {
                    logoElement.classList.add('loaded');
                });
                
                logoElement.addEventListener('error', () => {
                    logoElement.style.display = 'none';
                });
                
                if (logoElement.complete && logoElement.naturalHeight !== 0) {
                    logoElement.classList.add('loaded');
                }
            }
        };

        handleLogoLoad(brandLogo);
        handleLogoLoad(sidebarLogo);

        // Resize handler
        const handleResize = () => {
            if (window.innerWidth > 920 && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        };
        
        window.addEventListener('resize', handleResize);

        // Keyboard navigation
        const handleKeyboardNavigation = (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
            
            if (event.target === hamburger && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                toggleSidebar();
            }
        };

        document.addEventListener('keydown', handleKeyboardNavigation);

        // Navbar scroll effect
        let lastScrollTop = 0;
        let isScrolling = false;
        const navbar = document.querySelector('.navbar');

        const handleScroll = () => {
            if (!isScrolling && navbar) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    if (scrollTop > 20) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Active link highlighting
        const updateActiveLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + (navbar?.offsetHeight || 70) + 50;
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        let ticking = false;
        const requestActiveUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
                setTimeout(() => { ticking = false; }, 100);
            }
        };

        window.addEventListener('scroll', requestActiveUpdate, { passive: true });
        
        // Initial active link update
        updateActiveLink();
    }

    // Set active navigation item based on current page
    setActiveNavItem() {
        console.log('=== ACTIVE NAV DEBUG START ===');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        console.log('Current page:', currentPage);
        console.log('Current path:', currentPath);
        
        const navLinks = document.querySelectorAll('.nav-link');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        console.log('Found nav links:', navLinks.length);
        console.log('Found sidebar links:', sidebarLinks.length);
        
        // Remove active class from all links
        [...navLinks, ...sidebarLinks].forEach(link => {
            link.classList.remove('active');
        });
        
        // Direct matching approach
        [...navLinks, ...sidebarLinks].forEach((link, index) => {
            const href = link.getAttribute('href');
            const linkText = link.textContent.trim();
            
            console.log(`Link ${index}: "${linkText}" -> "${href}"`);
            
            // Simple direct matching
            if (href === currentPage) {
                link.classList.add('active');
                console.log('✓ ACTIVATED:', linkText);
            } else {
                console.log('✗ No match for:', linkText);
            }
        });
        
        console.log('=== ACTIVE NAV DEBUG END ===');
    }

    // Load footer (for future use)
    loadFooter(targetSelector = 'body') {
        // Footer HTML can be added here in the future
        const footerHTML = '<!-- Footer will be added here -->';
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.insertAdjacentHTML('beforeend', footerHTML);
            console.log('Footer placeholder loaded');
            return true;
        }
        return false;
    }
}

// Create global instance
window.SharedElements = new SharedElementsLoader();

// Auto-load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.SharedElements.loadNavbar();
});
