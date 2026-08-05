/* ===================================================
   EcoConnect – Food Waste Management System
   Analytics Page JavaScript (analytics.js)
   OST Practical No. 4: Data Visualization using Matplotlib
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. SCROLL ANIMATIONS USING INTERSECTION OBSERVER
    // ===================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // If stat box is in view, trigger counter animation
                    if (entry.target.classList.contains('stat-box')) {
                        animateStatCounter(entry.target);
                    }

                    // Unobserve after animating once
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            scrollObserver.observe(element);
        });
    } else {
        // Fallback for older browsers without IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }

    // ===================================================
    // 2. STATISTIC COUNTER ANIMATION
    // ===================================================
    function animateStatCounter(statCard) {
        const valueElement = statCard.querySelector('.stat-box-value');
        if (!valueElement) return;

        const rawValue = valueElement.getAttribute('data-target') || valueElement.textContent.trim();
        const numericMatch = rawValue.match(/\d+/);
        
        if (!numericMatch) return; // Non-numeric like 'Matplotlib' or 'EcoConnect'

        const targetVal = parseInt(numericMatch[0], 10);
        const duration = 1200; // ms
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function outQuad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * targetVal);

            valueElement.textContent = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                valueElement.textContent = targetVal;
            }
        }

        requestAnimationFrame(updateCount);
    }

    // ===================================================
    // 3. GRAPH IMAGE LIGHTBOX MODAL
    // ===================================================
    const graphImgWrappers = document.querySelectorAll('.graph-img-wrapper');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');

    if (graphImgWrappers.length > 0 && imageModal && modalImage) {
        graphImgWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('.graph-img');
                const card = wrapper.closest('.graph-card');
                const titleElement = card ? card.querySelector('.graph-card-title') : null;

                if (img) {
                    modalImage.src = img.src;
                    modalImage.alt = img.alt || 'Graph Screenshot';
                    
                    if (modalTitle && titleElement) {
                        modalTitle.textContent = titleElement.textContent;
                    }
                    
                    // Show Bootstrap Modal
                    if (window.bootstrap && window.bootstrap.Modal) {
                        const bsModal = new bootstrap.Modal(imageModal);
                        bsModal.show();
                    }
                }
            });
        });
    }

    // ===================================================
    // 4. SMOOTH SCROLLING FOR INTERNAL ANCHORS
    // ===================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================================
    // 5. DYNAMIC NAVBAR AUTH STATE MANAGER
    // ===================================================
    function setupNavAuth() {
        const storedUser = localStorage.getItem('user');
        const donateItems = document.querySelectorAll('.nav-donate-item, a[href="donation.html"]');
        const authButtons = document.querySelectorAll('.btn-nav-login, .btn-nav-logout, .auth-nav-btn');

        if (storedUser) {
            // User IS logged in: Show 'Donate Food' and 'Logout'
            donateItems.forEach(el => {
                const li = el.tagName === 'LI' ? el : el.closest('li');
                if (li) li.style.display = 'inline-block';
            });
            authButtons.forEach(btn => {
                btn.textContent = 'Logout';
                btn.className = 'btn-nav-logout auth-nav-btn';
                btn.href = '#';
                btn.onclick = (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                };
            });
        } else {
            // User is NOT logged in: Hide 'Donate Food', Show 'Login'
            donateItems.forEach(el => {
                const li = el.tagName === 'LI' ? el : el.closest('li');
                if (li) li.style.display = 'none';
            });
            authButtons.forEach(btn => {
                btn.textContent = 'Login';
                btn.className = 'btn-nav-login auth-nav-btn';
                btn.href = 'login.html';
                btn.onclick = null;
            });
        }
    }

    setupNavAuth();

});

