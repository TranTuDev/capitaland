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

    // ================= SPLIT TEXT (giữ nguyên cho menu) =================//
    function initEntranceAnimations() {
        const elements = document.querySelectorAll('[data-animation]');

        const getFromVars = (el, direction) => {
            const type = el.getAttribute('data-animation');

            switch (type) {
                case 'fade-in':
                    return { opacity: 0 };

                case 'fade-in-up':
                    return { opacity: 0, y: direction === 'down' ? 100 : -100 };

                case 'zoom-in':
                    return { opacity: 0, scale: 0.8 };

                case 'slide-up':
                    return { opacity: 0, y: direction === 'down' ? 120 : -120 };

                default:
                    return { opacity: 0 };
            }
        };

        elements.forEach((el) => {

            ScrollTrigger.create({
                trigger: el, // 🔥 trigger theo từng element
                start: 'top 85%',
                end: 'bottom 15%',

                onEnter: () => {
                    gsap.killTweensOf(el);
                    gsap.set(el, getFromVars(el, 'down'));

                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: 'power4.out',
                        overwrite: 'auto'
                    });
                },

                onEnterBack: () => {
                    gsap.killTweensOf(el);
                    gsap.set(el, getFromVars(el, 'up'));

                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: 'power4.out',
                        overwrite: 'auto'
                    });
                },

                markers: false
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

