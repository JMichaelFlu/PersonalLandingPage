/**
 * Animations.js - Neon Bar Aesthetic Animations
 * Bearly In a Hurry Personal Site
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Neon Flicker Effect
 * Randomly flickers neon text elements to mimic real neon signs
 */
function flickerNeon(element) {
    if (prefersReducedMotion) return;

    const flickerSequence = [0.7, 1, 0.8, 1, 0.9, 1];
    const flickerDelays = [50, 100, 50, 80, 60, 0];
    let step = 0;

    function flicker() {
        if (step < flickerSequence.length) {
            element.style.opacity = flickerSequence[step];
            setTimeout(flicker, flickerDelays[step]);
            step++;
        } else {
            element.style.opacity = 1;
            // Schedule next flicker randomly between 5-15 seconds
            const nextFlicker = Math.random() * 10000 + 5000;
            setTimeout(() => {
                step = 0;
                flicker();
            }, nextFlicker);
        }
    }

    flicker();
}

/**
 * Initialize flicker effect on neon headings
 */
function initFlickerEffects() {
    if (prefersReducedMotion) return;

    const neonHeadings = document.querySelectorAll('.story h2, .category-header h3, .contact-form-section h2');
    neonHeadings.forEach((heading, index) => {
        // Stagger initial flicker
        setTimeout(() => {
            flickerNeon(heading);
        }, index * 500);
    });
}

/**
 * Parallax Scrolling Effect
 * Subtle depth effect on background image
 */
function initParallax() {
    if (prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const offset = scrolled * 0.3;
        document.body.style.backgroundPositionY = `${offset}px`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/**
 * Typing Animation
 * Character-by-character reveal for headings
 */
function typeWriter(element, text, speed = 70) {
    if (prefersReducedMotion) {
        element.textContent = text;
        return;
    }

    let i = 0;
    const originalText = text;
    element.textContent = '';
    element.classList.add('typing-cursor');

    function type() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
        }
    }

    type();
}

/**
 * Initialize typing animation on main headings
 */
function initTypingAnimation() {
    if (prefersReducedMotion) return;

    // Only run once per session
    if (sessionStorage.getItem('typingShown')) return;

    const mainHeading = document.querySelector('.story h2, h1');
    if (mainHeading) {
        const text = mainHeading.textContent;
        typeWriter(mainHeading, text, 70);
        sessionStorage.setItem('typingShown', 'true');
    }
}

/**
 * Fade-in on Scroll using IntersectionObserver
 */
function initScrollAnimations() {
    if (prefersReducedMotion) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('fade-in-up')) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.nav-card, .story, .contact-intro, .link-list a, .social-links a');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Easter Egg: Konami Code
 * ↑ ↑ ↓ ↓ ← → ← → B A
 */
function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateDiscoMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

/**
 * Disco Mode - Rapid color cycling
 */
function activateDiscoMode() {
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.classList.add('disco-mode');
    });

    // Run for 5 seconds
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('disco-mode');
        });
    }, 5000);
}

/**
 * Easter Egg: Triple Click on Logo/Header
 */
function initTripleClick() {
    const header = document.querySelector('.neon-sign-img, h1, .hero-text');
    if (!header) return;

    let clickCount = 0;
    let clickTimer = null;

    header.addEventListener('click', () => {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            activateDiscoMode();
        }
    });
}

/**
 * Easter Egg: Shift + Hover for enhanced effect
 */
function initShiftHover() {
    let shiftPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            shiftPressed = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            shiftPressed = false;
        }
    });

    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (shiftPressed) {
                card.classList.add('shift-hover');
            }
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('shift-hover');
        });
    });
}

/**
 * Initialize all animations
 */
function init() {
    // Core animations
    initParallax();
    initFlickerEffects();
    initTypingAnimation();
    initScrollAnimations();

    // Easter eggs
    initKonamiCode();
    initTripleClick();
    initShiftHover();

    console.log('🎨 Neon animations initialized!');
    if (prefersReducedMotion) {
        console.log('ℹ️ Animations disabled due to prefers-reduced-motion setting');
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
