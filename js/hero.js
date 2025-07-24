document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navbarMenu = document.getElementById('menu');
    const burgerMenu = document.getElementById('burger');
    const header = document.getElementById('header');
    const overlay = document.querySelector('.overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const callToAction = document.querySelector('.menu-block .btn');
    let isMenuOpen = false;
    
    // Toggle mobile menu function
    const toggleMenu = (forceClose = false) => {
        if (forceClose === true) {
            navbarMenu.classList.remove('is-active');
            burgerMenu.classList.remove('is-active');
            overlay.classList.remove('is-active');
            document.body.classList.remove('no-scroll');
            isMenuOpen = false;
            return;
        }
        
        isMenuOpen = !isMenuOpen;
        navbarMenu.classList.toggle('is-active', isMenuOpen);
        burgerMenu.classList.toggle('is-active', isMenuOpen);
        overlay.classList.toggle('is-active', isMenuOpen);
        document.body.classList.toggle('no-scroll', isMenuOpen);
        
        // Add animation class when menu opens
        if (isMenuOpen) {
            navbarMenu.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        } else {
            navbarMenu.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }
    };
    
    // Toggle menu on burger click
    if (burgerMenu) {
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu on overlay click
    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(true));
    }
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navbarMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
            toggleMenu(true);
        }
    });
    
    // Handle menu link clicks
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Close menu on mobile when a link is clicked
            if (window.innerWidth < 992) {
                toggleMenu(true);
            }
            
            // Handle smooth scrolling for anchor links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active link
                    menuLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Scroll to section
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header scroll effect
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove header background on scroll
        if (currentScroll > 20) {
            header.classList.add('on-scroll');
        } else {
            header.classList.remove('on-scroll');
        }
        
        // Hide/show header on scroll direction
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
        
        // Close menu if resized to desktop
        if (window.innerWidth >= 992 && isMenuOpen) {
            toggleMenu(true);
        }
    });
    
    // Set initial active link based on current section in view
    const setActiveLink = () => {
        const scrollPosition = window.scrollY + headerHeight + 100;
        
        // Reset all links
        menuLinks.forEach(link => {
            link.classList.remove('active');
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    link.classList.add('active');
                }
            }
        });
    };
    
    // Run once on page load
    handleScroll();
    setActiveLink();
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        setActiveLink();
    });
    
    // Add click handler for call-to-action button
    if (callToAction) {
        callToAction.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && isMenuOpen) {
                toggleMenu(true);
            }
        });
    }
});

// Add smooth scrolling to all links
function smoothScroll(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}
