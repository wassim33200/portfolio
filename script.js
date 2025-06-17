let vantaEffect = null; // Store Vanta instance

// --- Theme Switching ---
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;
const toggleIcon = themeToggleButton.querySelector('i');

const setTheme = (theme) => {
    body.classList.remove('light-theme', 'dark-theme'); // Clear existing
    let vantaBgColor, vantaPointColor;

    if (theme === 'light') {
        body.classList.add('light-theme');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
        vantaBgColor = 0xfdfdfd; // Corresponds to --vanta-bg in light-theme
        vantaPointColor = 0x0062cc; // Corresponds to --vanta-color in light-theme
    } else {
        body.classList.add('dark-theme'); // Explicitly add dark-theme class
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
        vantaBgColor = 0x0a0a1a; // Corresponds to --vanta-bg in :root
        vantaPointColor = 0x00aaff; // Corresponds to --vanta-color in :root
    }
    updateVantaTheme(vantaBgColor, vantaPointColor); // Update Vanta background
};

const updateVantaTheme = (bgColor, pointColor) => {
    if (vantaEffect) {
        vantaEffect.setOptions({
            backgroundColor: bgColor,
            color: pointColor
        });
    }
};

themeToggleButton.addEventListener('click', () => {
    const isLight = body.classList.contains('light-theme');
    setTheme(isLight ? 'dark' : 'light');
});

// --- Initialize Theme on Load ---
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    let currentTheme;

    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = prefersLight ? 'light' : 'dark';
    }
    setTheme(currentTheme); // Apply the determined theme
    // Vanta initialization will happen after DOMContentLoaded
};

// --- Vanta.js Initialization ---
const initializeVanta = () => {
    if (vantaEffect) {
        vantaEffect.destroy(); // Clean up previous instance if any
    }
    // Get initial colors based on the theme set by initializeTheme()
    const isLight = body.classList.contains('light-theme');
    const initialBgColor = isLight ? 0xfdfdfd : 0x0a0a1a;
    const initialPointColor = isLight ? 0x0062cc : 0x00aaff;

    if (typeof VANTA !== 'undefined' && VANTA.NET) { // Check if VANTA is loaded
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.00, minWidth: 200.00,
            scale: 1.00, scaleMobile: 1.00,
            backgroundColor: initialBgColor,
            color: initialPointColor,
            points: 14.00,       // Slightly increased density
            maxDistance: 20.00, // Adjusted distance
            spacing: 16.00       // Slightly decreased spacing
        });
    } else {
        console.error("VANTA.NET not loaded");
    }
}

// --- ScrollReveal Initialization ---
const initializeScrollReveal = () => {
    if (typeof ScrollReveal !== 'undefined') { // Check if ScrollReveal is loaded
        const sr = ScrollReveal({
            origin: 'bottom', distance: '60px', duration: 900, delay: 100,
            opacity: 0, scale: 0.9, easing: 'cubic-bezier(0.5, 0, 0, 1)', // Smoother ease
            reset: false, viewFactor: 0.25, useDelay: 'always', mobile: true
        });
        sr.reveal('.reveal', { interval: 100 }); // Faster interval general reveal
        sr.reveal('.project-card, .skill-category', { interval: 80 }); // Stagger cards/skills
        sr.reveal('.timeline-item', { interval: 150, distance: '80px', origin: (el) => el.classList.contains('timeline-item:nth-child(odd)') ? 'left' : 'right' }); // Animate timeline from correct side (basic attempt)
    } else {
        console.error("ScrollReveal not loaded");
    }
}


// --- Navigation & Active Link Highlighting ---
const navMenu = document.getElementById('nav-menu');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times'); // Change icon to X
        }
    });
}

// Close Mobile Menu When Link is Clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        // Active link logic handled by scrollspy
    });
});

// Active Link Scrollspy
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', navHighlighter);

function navHighlighter() {
    let scrollY = window.pageYOffset;
    let current = "hero"; // Default to hero
     // Use a dynamic offset based on actual header height + a buffer
    const headerOffset = (header?.offsetHeight || 70) + 40;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

     // Special check for reaching the absolute bottom of the page
    if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50 && sections.length > 0) {
        current = sections[sections.length - 1].getAttribute('id'); // Activate last section (likely contact)
     }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// --- Footer Current Year ---
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// --- Run Initializations After DOM is Ready ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();  // Set theme first
    initializeVanta();  // Initialize Vanta with correct theme colors
    initializeScrollReveal();   // Setup scroll animations
    navHighlighter();   // Set initial active link
});