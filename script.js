// =============================================
// GOURI SHANKAR DAS - Professional Website Script
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initReels();
    initGallery();
    initLightbox();
    initReviewsCarousel();
    initShareButtons();
    initSmoothScroll();
    initScrollAnimations();
});

// =============================================
// NAVIGATION
// =============================================

function initNavigation() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect for navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// =============================================
// MOBILE MENU
// =============================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const closeBtn = document.getElementById('mobileNavClose');
    const mobileLinks = mobileNav.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// =============================================
// INSTAGRAM REELS
// =============================================

async function initReels() {
    const reelsGrid = document.getElementById('reelsGrid');
    
    try {
        const response = await fetch('video-data.json');
        const data = await response.json();
        
        reelsGrid.innerHTML = data.reels.map(reel => {
            const reelId = extractReelId(reel.url);
            return `
                <div class="reel-card">
                    <div class="reel-overlay">
                        <a href="${reel.url}" class="reel-link" target="_blank" rel="noopener">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    <div class="reel-embed">
                        <iframe 
                            src="https://www.instagram.com/reel/${reelId}/embed" 
                            allowfullscreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading reels:', error);
        reelsGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Unable to load reels. Please try again later.</p>';
    }
}

function extractReelId(url) {
    const match = url.match(/reel\/([^\/\?]+)/);
    return match ? match[1] : '';
}

// =============================================
// GALLERY
// =============================================

let galleryData = { persona: [], public: [] };
let currentGalleryTab = 'persona';
let currentLightboxImages = [];
let currentLightboxIndex = 0;

async function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const tabs = document.querySelectorAll('.gallery-tab');
    
    try {
        const response = await fetch('gallery-data.json');
        galleryData = await response.json();
        
        renderGallery('persona');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentGalleryTab = tab.dataset.tab;
                renderGallery(currentGalleryTab);
            });
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Unable to load gallery. Please try again later.</p>';
    }
}

function renderGallery(tab) {
    const galleryGrid = document.getElementById('galleryGrid');
    const images = tab === 'persona' ? galleryData.persona : galleryData.public;
    currentLightboxImages = images;
    
    galleryGrid.innerHTML = images.map((item, index) => `
        <div class="gallery-item" data-index="${index}">
            <img src="${item.filename}" alt="${item.caption}" loading="lazy">
            <div class="gallery-overlay">
                <span class="gallery-caption">${item.caption}</span>
            </div>
            <div class="gallery-expand">
                <i class="fas fa-expand"></i>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(index);
        });
    });
}

// =============================================
// LIGHTBOX
// =============================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    currentLightboxIndex = index;
    const item = currentLightboxImages[index];
    
    img.src = item.filename;
    img.alt = item.caption;
    caption.textContent = item.caption;
    
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentLightboxImages.length - 1;
    } else if (currentLightboxIndex >= currentLightboxImages.length) {
        currentLightboxIndex = 0;
    }
    
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const item = currentLightboxImages[currentLightboxIndex];
    
    img.src = item.filename;
    img.alt = item.caption;
    caption.textContent = item.caption;
}

// =============================================
// REVIEWS CAROUSEL
// =============================================

function initReviewsCarousel() {
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    
    let scrollPosition = 0;
    const scrollAmount = 370; // Card width + gap
    
    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - scrollAmount);
        track.style.transform = `translateX(-${scrollPosition}px)`;
    });
    
    nextBtn.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
        scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
        track.style.transform = `translateX(-${scrollPosition}px)`;
    });
}

// =============================================
// SHARE BUTTONS
// =============================================

function initShareButtons() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent('Gouri Shankar Das - Hypno-Mentalist & Illusionist');
    const pageDesc = encodeURIComponent('Experience the extraordinary world of mind reading and psychological illusion.');
    
    document.getElementById('shareWhatsApp').addEventListener('click', () => {
        window.open(`https://wa.me/?text=${pageTitle}%20${pageUrl}`, '_blank');
    });
    
    document.getElementById('shareFacebook').addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank');
    });
    
    document.getElementById('shareTwitter').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank');
    });
    
    document.getElementById('shareLinkedIn').addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`, '_blank');
    });
    
    document.getElementById('shareCopy').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!');
        });
    });
    
    document.getElementById('shareNative').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Gouri Shankar Das - Hypno-Mentalist & Illusionist',
                text: 'Experience the extraordinary world of mind reading and psychological illusion.',
                url: window.location.href
            });
        } else {
            showToast('Share not supported on this browser');
        }
    });
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =============================================
// SMOOTH SCROLL
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// SCROLL ANIMATIONS
// =============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section-header, .about-grid, .stat-card, .reel-card, .review-card, .gallery-item, .contact-card, .social-btn').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
