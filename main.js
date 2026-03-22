// ============================================
//   CAMILLE ROBUCHON — PORTFOLIO v2
//   main.js — Premium Interactive Features
// ============================================

// ---- Scroll progress bar ----
const scrollBar = document.getElementById('scroll-progress');
function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScroll, { passive: true });

// ---- Navbar scroll state + dark cursor ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ---- Custom cursor ----
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
if (cursor && cursorDot) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    document.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
        cursorDot.style.left = tx + 'px';
        cursorDot.style.top = ty + 'px';
    });

    // Lag the ring cursor
    function animCursor() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animCursor);
    }
    animCursor();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .pf-item, .filter-btn, .vision-card, .pillar, .asp-tab, .asp-card, .timeline-content');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Dark cursor on dark sections
    const darkSections = document.querySelectorAll('#aspirations, footer, .marquee-strip');
    const darkObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) document.body.classList.add('cursor-dark');
            else {
                // Only remove if no dark section is visible
                const anyDark = [...darkSections].some(s => {
                    const r = s.getBoundingClientRect();
                    return r.top < window.innerHeight && r.bottom > 0;
                });
                if (!anyDark) document.body.classList.remove('cursor-dark');
            }
        });
    }, { threshold: 0.1 });
    darkSections.forEach(s => darkObserver.observe(s));
}

// ---- Magnetic buttons ----
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ---- Reveal on scroll ----
const reveals = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings within the same parent
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal-up')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx * 0.07) + 's';
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ---- Active nav on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
    });
}, { threshold: 0.3 });
sections.forEach(s => sectionObs.observe(s));

// ---- Parallax hero image ----
const parallaxImg = document.getElementById('parallax-img');
if (parallaxImg) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            parallaxImg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }, { passive: true });
}

// ---- Counter animation ----
function animCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 20));
    const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(interval);
    }, 60);
}
const statNums = document.querySelectorAll('.stat-num[data-count]');
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animCounter(entry.target);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });
statNums.forEach(el => counterObs.observe(el));

// ============================================
//   PORTFOLIO: Filter + Modal
// ============================================

// Portfolio data — matches data-index on .pf-item
const portfolioItems = document.querySelectorAll('.pf-item');
let currentIndex = 0;
const openItems = []; // filtered-in items in DOM order

// Build index-ordered list of items
function getVisibleItems() {
    return [...portfolioItems].filter(el => !el.classList.contains('filtered-out'));
}

// ---- Filter buttons ----
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-cat') === filter) {
                item.classList.remove('filtered-out');
            } else {
                item.classList.add('filtered-out');
            }
        });
    });
});

// ---- Modal ----
const modal = document.getElementById('pf-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

function openModal(item) {
    const img = item.querySelector('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalTag.textContent = item.getAttribute('data-tag');
    modalTitle.textContent = item.getAttribute('data-title');
    modalDesc.textContent = item.getAttribute('data-desc');
    currentIndex = [...portfolioItems].indexOf(item);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateModalNav();
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function updateModalNav() {
    const visible = getVisibleItems();
    const pos = visible.indexOf(portfolioItems[currentIndex]);
    modalPrev.style.opacity = pos <= 0 ? '0.25' : '1';
    modalNext.style.opacity = pos >= visible.length - 1 ? '0.25' : '1';
}

function navModal(dir) {
    const visible = getVisibleItems();
    const pos = visible.indexOf(portfolioItems[currentIndex]);
    const newPos = pos + dir;
    if (newPos < 0 || newPos >= visible.length) return;
    const newItem = visible[newPos];
    currentIndex = [...portfolioItems].indexOf(newItem);

    // Animate out/in
    const body = document.querySelector('.modal-content');
    body.style.opacity = '0';
    body.style.transform = `translateX(${dir > 0 ? '30px' : '-30px'})`;
    setTimeout(() => {
        const img = newItem.querySelector('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTag.textContent = newItem.getAttribute('data-tag');
        modalTitle.textContent = newItem.getAttribute('data-title');
        modalDesc.textContent = newItem.getAttribute('data-desc');
        body.style.transition = 'opacity 0.3s, transform 0.3s';
        body.style.opacity = '1';
        body.style.transform = 'translateX(0)';
        updateModalNav();
    }, 200);
    body.style.transition = 'opacity 0.2s, transform 0.2s';
}

// Attach click on each portfolio item
portfolioItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
});

// Close handlers
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navModal(-1));
modalNext.addEventListener('click', () => navModal(1));

// Keyboard nav
document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') navModal(1);
    if (e.key === 'ArrowLeft') navModal(-1);
});

// Touch swipe on modal
let touchStartX = 0;
modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navModal(dx < 0 ? 1 : -1);
});

// ============================================
//   ASPIRATIONS: Tab switching
// ============================================
const aspTabs = document.querySelectorAll('.asp-tab');
const aspPanels = document.querySelectorAll('.asp-panel');

aspTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = 'tab-' + tab.getAttribute('data-tab');

        // Deactivate current
        aspTabs.forEach(t => t.classList.remove('active'));
        aspPanels.forEach(p => {
            if (p.classList.contains('active')) {
                p.style.opacity = '0';
                p.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    p.classList.remove('active');
                    p.style.opacity = '';
                    p.style.transform = '';
                }, 200);
            }
        });

        // Activate new after brief delay
        tab.classList.add('active');
        setTimeout(() => {
            const panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.add('active');
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(10px)';
                panel.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0)';
                    });
                });
            }
        }, 220);
    });
});
