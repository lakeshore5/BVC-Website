// ===== SHARED ELEMENTS LOADER FOR ROOT DIRECTORY =====
class SharedElementsLoader {
    constructor() {
        // Navbar HTML template with root directory paths
        this.navbarHTML = `
<!-- Navigation -->
<nav class="navbar">
    <div class="nav-container">
        <!-- Logo/Brand -->
        <div class="nav-brand">
            <a href="index.html" class="brand-link">
                <img src="images/BVCLogo.jpg" alt="BVC Logo" class="brand-logo-img">
            </a>
        </div>

        <!-- Desktop Navigation Menu -->
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="pages/consulting.html" class="nav-link">Consulting</a>
            </li>
            <li class="nav-item">
                <a href="pages/private-equity.html" class="nav-link">Private Equity</a>
            </li>
            <li class="nav-item">
                <a href="pages/about-us.html" class="nav-link">About Us</a>
            </li>
            <li class="nav-item">
                <a href="pages/contact.html" class="nav-link">Contact</a>
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
            <a href="index.html" style="display: flex; align-items: center; text-decoration: none;">
                <img src="images/BVCLogo.jpg" alt="BVC Logo" class="sidebar-logo-img">
            </a>
        </div>
        <button class="sidebar-close" id="sidebar-close">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <ul class="sidebar-menu">
        <li class="sidebar-item">
            <a href="pages/consulting.html" class="sidebar-link">
                <i class="fas fa-fire"></i>
                <span>Consulting</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="pages/private-equity.html" class="sidebar-link">
                <i class="fas fa-crown"></i>
                <span>Private Equity</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="pages/about-us.html" class="sidebar-link">
                <i class="fas fa-users"></i>
                <span>About Us</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="pages/contact.html" class="sidebar-link">
                <i class="fas fa-envelope"></i>
                <span>Contact</span>
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

    // Initialize navbar functionality (same as the pages version)
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
            });
        });

        // Set active page highlighting
        this.setActiveNavItem();

        // Handle navigation links (no smooth scrolling needed for separate pages)
        navLinks.forEach(link => {
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

        // Active link highlighting for hash navigation (only for single-page sections)
        // Don't interfere with page-based navigation
        const updateActiveLink = () => {
            // Only update if we're on a page with hash navigation (sections with IDs)
            const sections = document.querySelectorAll('section[id]');
            if (sections.length === 0) return; // Skip if no sections with IDs
            
            const scrollPos = window.scrollY + (navbar?.offsetHeight || 140) + 50;
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Only update links that use hash navigation
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.classList.remove('active');
                    if (href === `#${current}`) {
                        link.classList.add('active');
                    }
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
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        console.log('Root - Current page:', currentPage, 'Current path:', currentPath);
        
        // Remove active class from all links
        [...navLinks, ...sidebarLinks].forEach(link => {
            link.classList.remove('active');
        });
        
        // For root page, we need to handle the special case where links go to pages/ folder
        [...navLinks, ...sidebarLinks].forEach(link => {
            const href = link.getAttribute('href');
            const linkText = link.textContent.trim();
            
            console.log('Checking link:', linkText, href);
            
            // If we're on root index.html, don't highlight any nav items (since they're for other pages)
            // We could add a "Home" nav item if needed, but currently there isn't one
            
            // This function is mainly for when we navigate back to root from other pages
            // The active detection will mainly work from the pages folder
        });
    }
}

// Create global instance
window.SharedElements = new SharedElementsLoader();

// Auto-load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.SharedElements.loadNavbar();
});
