document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Hamburger Menu ──
    const hamburger = document.getElementById('hamburger');
    const navClose  = document.getElementById('navClose');
    const navLinks  = document.getElementById('navLinks');
    const navPanel  = document.getElementById('navPanel');

    function openMenu() {
        navClose.classList.add('open');
        navPanel.classList.add('active');
        hamburger.querySelector('i').classList.replace('fa-bars', 'fa-times');
    }
    function closeMenu() {
        navClose.classList.remove('open');
        navPanel.classList.remove('active');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    }

    if (hamburger) hamburger.addEventListener('click', openMenu);
    if (navClose)  navClose.addEventListener('click', closeMenu);

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ── Force Hero Video Play ──
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked — try again on first user interaction
                document.addEventListener('click', () => heroVideo.play(), { once: true });
                document.addEventListener('touchstart', () => heroVideo.play(), { once: true });
            });
        }
    }
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                window.scrollTo({
                    top: targetEl.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Scroll Animations ──
    const animEls = document.querySelectorAll('.fade-in, .fade-left, .fade-right, .fade-up, .fade-scale');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => observer.observe(el));

    // Trigger elements already in view on load (important for GitHub Pages)
    setTimeout(() => {
        animEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // ── Sticky Mobile CTA + Scroll Progress + Back to Top + Navbar ──
    const mobileStickyCta = document.getElementById('mobileStickyCta');
    const heroSection     = document.getElementById('home');
    const navbar          = document.querySelector('.navbar');
    const scrollBar       = document.getElementById('scrollBar');
    const backToTop       = document.getElementById('backToTop');

    if (backToTop) {
        backToTop.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', () => {
        if (scrollBar) {
            const scrollTop    = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
        }
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 300);
        if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 50);

        if (mobileStickyCta && heroSection && window.innerWidth <= 768) {
            mobileStickyCta.classList.toggle('show', heroSection.getBoundingClientRect().bottom < 0);
        } else if (mobileStickyCta) {
            mobileStickyCta.classList.remove('show');
        }
    });

    // ── Gallery Tabs ──
    const tabBtns         = document.querySelectorAll('.tab-btn');
    const galleryContents = document.querySelectorAll('.gallery-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            galleryContents.forEach(c => c.classList.add('hidden'));
            const target = document.getElementById(btn.getAttribute('data-target'));
            if (target) target.classList.remove('hidden');
        });
    });

    // ── Mobile Show More ──
    function initShowMore(gridId, btnId, wrapId) {
        const grid = document.getElementById(gridId);
        const btn  = document.getElementById(btnId);
        const wrap = document.getElementById(wrapId);
        if (!grid || !btn || !wrap) return;

        // Use querySelectorAll so it works for both CSS grid and CSS columns layouts
        const items = Array.from(grid.querySelectorAll('.gallery-item'));
        let expanded = false;

        function applyMobile() {
            if (window.innerWidth <= 768) {
                items.forEach((item, i) => {
                    if (i >= 3) {
                        item.style.display = expanded ? '' : 'none';
                    }
                });
                wrap.style.display = items.length > 3 ? 'flex' : 'none';
            } else {
                // Desktop: show everything
                items.forEach(item => item.style.display = '');
                wrap.style.display = 'none';
            }
        }

        btn.addEventListener('click', () => {
            expanded = !expanded;
            btn.innerHTML = expanded
                ? 'Show Less <i class="fas fa-chevron-down"></i>'
                : 'Show More <i class="fas fa-chevron-down"></i>';
            btn.classList.toggle('expanded', expanded);
            applyMobile();
        });

        applyMobile();
        window.addEventListener('resize', applyMobile);
    }

    initShowMore('photoGrid', 'photoShowMore', 'photoShowMoreWrap');
    initShowMore('videoGrid', 'videoShowMore', 'videoShowMoreWrap');

    // ── 3D Card Hover ──
    document.querySelectorAll('.about-card, .service-card, .review-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -10;
            const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            card.style.zIndex = '1';
        });
    });

    // ── Image Modal ──
    const modal      = document.getElementById('imageModal');
    const modalImg   = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal-close');

    document.querySelectorAll('.service-img, .gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            let src = '';
            if (img.tagName.toLowerCase() === 'img') {
                src = img.src;
            } else {
                const bg    = window.getComputedStyle(img).backgroundImage;
                const match = bg && bg.match(/url\(['"]?(.*?)['"]?\)/);
                if (match) src = match[1];
            }
            if (src && src !== 'none') {
                modalImg.src = src;
                modal.classList.add('show');
            }
        });
    });

    if (closeModal) closeModal.addEventListener('click', () => modal.classList.remove('show'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

});