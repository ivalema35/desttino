/**
 * SkyWay Travel - Flight Booking Landing Page
 * Interactive JavaScript functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const tripToggles = document.querySelectorAll('.trip-toggle');
    const returnDateGroup = document.getElementById('return-date-group');
    const topicButtons = document.querySelectorAll('.topic-btn');
    const topicPanels = document.querySelectorAll('.topic-panel');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const searchForm = document.getElementById('search-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const swapBtn = document.querySelector('.swap-btn');
    const fromCity = document.getElementById('from-city');
    const toCity = document.getElementById('to-city');
    const departDate = document.getElementById('depart-date');
    const returnDate = document.getElementById('return-date');

    // Set minimum date for date inputs (today)
    function setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        if (departDate) departDate.min = today;
        if (returnDate) returnDate.min = today;
        
        // Update return date min when depart date changes
        if (departDate) {
            departDate.addEventListener('change', function() {
                if (returnDate) {
                    returnDate.min = this.value;
                    // If return date is before depart date, clear it
                    if (returnDate.value && returnDate.value < this.value) {
                        returnDate.value = '';
                    }
                }
            });
        }
    }

    // Mobile Navigation Toggle
    function initMobileNav() {
        if (!hamburger || !mobileNav) return;

        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileNav.hidden = isExpanded;
        });

        // Close mobile nav when clicking on a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileNav.hidden = true;
            });
        });

        // Close mobile nav when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !mobileNav.hidden) {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileNav.hidden = true;
                hamburger.focus();
            }
        });
    }

    // Trip Type Toggle (One-way / Round-trip / Multi-city)
    function initTripTypeToggle() {
        tripToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                // Update active states
                tripToggles.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                // Show/hide return date based on trip type
                const tripType = this.dataset.trip;
                if (returnDateGroup) {
                    if (tripType === 'one-way') {
                        returnDateGroup.classList.add('hidden');
                        if (returnDate) returnDate.removeAttribute('required');
                    } else {
                        returnDateGroup.classList.remove('hidden');
                        if (returnDate) returnDate.setAttribute('required', 'required');
                    }
                }
            });
        });
    }

    // Swap Cities Button
    function initSwapCities() {
        if (!swapBtn || !fromCity || !toCity) return;

        swapBtn.addEventListener('click', function() {
            const fromValue = fromCity.value;
            fromCity.value = toCity.value;
            toCity.value = fromValue;

            // Add a little animation
            this.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }

    // Sidebar Topic Navigation
    function initTopicNavigation() {
        topicButtons.forEach(button => {
            button.addEventListener('click', function() {
                const topicId = this.dataset.topic;

                // Update button states
                topicButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Update panel visibility with animation
                topicPanels.forEach(panel => {
                    if (panel.id === `topic-${topicId}`) {
                        panel.hidden = false;
                        panel.classList.add('active');
                        // Trigger reflow for animation
                        panel.offsetHeight;
                        panel.style.animation = 'none';
                        panel.offsetHeight;
                        panel.style.animation = '';
                    } else {
                        panel.hidden = true;
                        panel.classList.remove('active');
                    }
                });

                // Scroll panel into view on mobile
                if (window.innerWidth < 1024) {
                    const activePanel = document.getElementById(`topic-${topicId}`);
                    if (activePanel) {
                        setTimeout(() => {
                            activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            });

            // Keyboard navigation
            button.addEventListener('keydown', function(e) {
                const buttons = Array.from(topicButtons);
                const currentIndex = buttons.indexOf(this);
                let nextIndex;

                switch(e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        nextIndex = (currentIndex + 1) % buttons.length;
                        buttons[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                        buttons[nextIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        buttons[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        buttons[buttons.length - 1].focus();
                        break;
                }
            });
        });
    }

    // FAQ Accordion
    function initAccordion() {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const content = document.getElementById(this.getAttribute('aria-controls'));

                // Close other accordions in the same group (optional - remove for independent accordions)
                const parentAccordion = this.closest('.accordion');
                if (parentAccordion) {
                    parentAccordion.querySelectorAll('.accordion-header').forEach(h => {
                        if (h !== this) {
                            h.setAttribute('aria-expanded', 'false');
                            const c = document.getElementById(h.getAttribute('aria-controls'));
                            if (c) c.hidden = true;
                        }
                    });
                }

                // Toggle current accordion
                this.setAttribute('aria-expanded', !isExpanded);
                if (content) content.hidden = isExpanded;
            });

            // Keyboard support
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Search Form Handling
    function initSearchForm() {
        if (!searchForm) return;

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Get selected trip type
            const activeToggle = document.querySelector('.trip-toggle.active');
            data.tripType = activeToggle ? activeToggle.dataset.trip : 'round-trip';

            // Log data (replace with actual API call)
            console.log('Search submitted:', data);

            // Show loading state
            const submitBtn = this.querySelector('.search-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/></svg> Searching...';
            submitBtn.disabled = true;

            // Simulate search (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message or redirect to results
                alert('Search functionality is ready to be connected to your backend API. Check the console for submitted data.');
            }, 1500);
        });
    }

    // Newsletter Form Handling
    function initNewsletterForms() {
        const forms = document.querySelectorAll('.newsletter-form, .footer-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value;

                // Basic validation
                if (!email || !isValidEmail(email)) {
                    emailInput.classList.add('error');
                    return;
                }

                emailInput.classList.remove('error');
                
                // Log data (replace with actual API call)
                console.log('Newsletter signup:', email);

                // Show success
                const originalValue = emailInput.value;
                emailInput.value = 'Thanks for subscribing!';
                emailInput.disabled = true;
                
                setTimeout(() => {
                    emailInput.value = '';
                    emailInput.disabled = false;
                }, 3000);
            });
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    // Animate elements on scroll
    function initScrollAnimations() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        document.querySelectorAll('.flight-card, .testimonial-card, .promo-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // Add animate-in class styles dynamically
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            
            .error {
                border-color: #dc2626 !important;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Handle floating CTA visibility on scroll
    function initFloatingCTA() {
        const floatingCTA = document.getElementById('floating-cta');
        if (!floatingCTA) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', function() {
            lastScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(function() {
                    // Hide floating CTA when near the top
                    if (lastScrollY < 300) {
                        floatingCTA.style.opacity = '0';
                        floatingCTA.style.visibility = 'hidden';
                    } else {
                        floatingCTA.style.opacity = '1';
                        floatingCTA.style.visibility = 'visible';
                    }
                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // Mobile sidebar accordion behavior
    function initMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarTitle = document.querySelector('.sidebar-title');
        
        if (!sidebar || !sidebarTitle || window.innerWidth >= 1024) return;

        // Make sidebar title clickable on mobile
        sidebarTitle.style.cursor = 'pointer';
        sidebarTitle.setAttribute('role', 'button');
        sidebarTitle.setAttribute('aria-expanded', 'true');
        
        sidebarTitle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('mobile-accordion');
            
            const topicList = sidebar.querySelector('.topic-list');
            if (topicList) {
                topicList.style.display = isExpanded ? 'none' : 'flex';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                const topicList = sidebar.querySelector('.topic-list');
                if (topicList) {
                    topicList.style.display = '';
                }
                sidebarTitle.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Popular flight card click handling
    function initFlightCards() {
        document.querySelectorAll('.flight-card .flight-cta').forEach(cta => {
            cta.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get route information
                const card = this.closest('.flight-card');
                const cities = card.querySelectorAll('.city');
                const fromCityValue = cities[0]?.textContent || '';
                const toCityValue = cities[1]?.textContent || '';

                // Pre-fill search form
                if (fromCity) fromCity.value = fromCityValue;
                if (toCity) toCity.value = toCityValue;

                // Scroll to search form
                const searchFormEl = document.getElementById('search-form');
                if (searchFormEl) {
                    searchFormEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Focus on date field after scroll
                    setTimeout(() => {
                        if (departDate) departDate.focus();
                    }, 500);
                }
            });
        });
    }

    // Initialize all functionality
    function init() {
        addAnimationStyles();
        setMinDates();
        initMobileNav();
        initTripTypeToggle();
        initSwapCities();
        initTopicNavigation();
        initAccordion();
        initSearchForm();
        initNewsletterForms();
        initSmoothScroll();
        initScrollAnimations();
        initFloatingCTA();
        initMobileSidebar();
        initFlightCards();
        initPromoNotification();
    }

    // Promo Notification System
    function initPromoNotification() {
        const notification = document.getElementById('promo-notification');
        const closeBtn = document.getElementById('promo-notification-close');
        
        if (!notification || !closeBtn) return;

        let notificationTimer;
        let autoHideTimer;

        // Check if user has dismissed notification recently (within 24 hours)
        const lastDismissed = localStorage.getItem('promoNotificationDismissed');
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (lastDismissed && (now - parseInt(lastDismissed)) < oneDayMs) {
            return; // Don't show notification if dismissed recently
        }

        // Function to show notification
        function showNotification() {
            notification.classList.add('show');
            notification.setAttribute('aria-hidden', 'false');

            // Auto-hide after 8 seconds
            autoHideTimer = setTimeout(() => {
                hideNotification();
            }, 8000);
        }

        // Function to hide notification
        function hideNotification() {
            notification.classList.remove('show');
            notification.setAttribute('aria-hidden', 'true');
            clearTimeout(autoHideTimer);
        }

        // Close button handler
        closeBtn.addEventListener('click', () => {
            hideNotification();
            localStorage.setItem('promoNotificationDismissed', Date.now().toString());
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && notification.classList.contains('show')) {
                hideNotification();
            }
        });

        // Show notification after 20 seconds
        setTimeout(() => {
            showNotification();
        }, 20000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
