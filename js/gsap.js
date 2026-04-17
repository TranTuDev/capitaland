// ================= PAGE LOADER =================
function initLoader(onDone) {
    const loader = document.getElementById('pageLoader');
    const wrapper = document.getElementById('mainWrapper');

    if (!loader || !wrapper) {
        console.warn('⚠️ Không tìm thấy loader hoặc wrapper');
        onDone?.();
        return;
    }

    wrapper.style.visibility = 'hidden';
    wrapper.style.opacity = '0';

    const LOADER_DURATION = 1800;

    setTimeout(() => {
        loader.classList.add('is-done');

        setTimeout(() => {
            try {
                if (loader.parentNode) loader.remove();
            } catch (e) {
                loader.style.display = 'none';
            }

            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            wrapper.classList.add('wrapper--ready');

            console.log('✅ Loader ẩn - Page vào mượt');
            onDone?.();
        }, 750);
    }, LOADER_DURATION);
}
// ================= GSAP =================
function initGSAP() {
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP chưa load');
        return;
    }
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh();
    }

    // ================= SPLIT TEXT (giữ nguyên cho menu) =================

    function initEntranceAnimations() {
        const groups = document.querySelectorAll('section');
        groups.forEach(group => {
            const elements = group.querySelectorAll('[data-animation]');
            if (!elements.length) return;

            const getFromVars = (el, direction) => {
                const type = el.getAttribute('data-animation');
                switch (type) {
                    case 'fade-in': return { opacity: 0 };
                    case 'fade-in-up': return { opacity: 0, y: direction === 'down' ? 60 : -60 };
                    case 'zoom-in': return { opacity: 0, scale: 0.85 };
                    case 'slide-up': return { opacity: 0, y: direction === 'down' ? 80 : -80 };
                    default: return {};
                }
            };

            const animateIn = (direction) => {
                gsap.killTweensOf(elements);
                elements.forEach((el, i) => {
                    gsap.fromTo(el,
                        getFromVars(el, direction), // from: đúng hướng
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: 'power3.out',
                            delay: i * 0.15,
                            overwrite: 'auto',
                        }
                    );
                });
            };

            // Set trạng thái ban đầu
            elements.forEach(el => gsap.set(el, getFromVars(el, 'down')));

            ScrollTrigger.create({
                trigger: group,
                start: 'top 85%',
                end: 'bottom 85%',   // ← trigger onEnterBack sớm hơn
                invalidateOnRefresh: true,
                onEnter: () => animateIn('down'),
                onEnterBack: () => animateIn('up'),
                onLeave: () => elements.forEach(el => gsap.set(el, getFromVars(el, 'up'))),
                onLeaveBack: () => elements.forEach(el => gsap.set(el, getFromVars(el, 'down'))),
            });
        });
    }
    // ================= CHẠY TẤT CẢ =================
    initEntranceAnimations();

    if (typeof initLineHighlights === 'function') {
        setTimeout(() => {
            try { initLineHighlights(); } catch (err) { console.error('❌ initLineHighlights lỗi:', err); }
        }, 300);
    }
}

// ================= ENTRY POINT =================
document.addEventListener('DOMContentLoaded', () => {
    initLoader(() => {
        initGSAP();
    });
});

