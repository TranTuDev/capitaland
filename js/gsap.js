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
    function splitText(el) {
        const $el = $(el);
        if (!$el.length || $el.data('split')) return;
        const text = $el.text().trim();
        if (!text) return;

        const words = text.split(/\s+/);
        let html = '';
        words.forEach((word, wi) => {
            html += `<span class="word">`;
            for (let char of word) html += `<span class="char">${char}</span>`;
            html += `</span>`;
            if (wi < words.length - 1) html += ' ';
        });
        $el.html(html);
        $el.data('split', true);
    }

    $('.header__menu-link').each(function () {
        const $link = $(this);
        const $target = $link.find('span').first().length ? $link.find('span').first() : $link;
        splitText($target);
        const chars = $link.find('.char');
        if (!chars.length) return;

        $link.on('mouseenter', () => gsap.to(chars, { y: -10, stagger: 0.04, duration: 0.3, ease: 'power2.out' }));
        $link.on('mouseleave', () => gsap.to(chars, { y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' }));
    });

    // ================= ANIMATION ENTRANCE ĐƠN GIẢN (THEO YÊU CẦU) =================
    function initEntranceAnimations() {
        const groups = document.querySelectorAll('section'); // group theo section

        groups.forEach(group => {
            const elements = group.querySelectorAll('[data-animation]');
            if (!elements.length) return;

            // set trạng thái ban đầu cho từng element
            elements.forEach(el => {
                const type = el.getAttribute('data-animation');

                let fromVars = {};

                switch (type) {
                    case 'fade-in':
                        fromVars = { opacity: 0 };
                        break;

                    case 'fade-in-up':
                        fromVars = { opacity: 0, y: 60 };
                        break;

                    case 'zoom-in':
                        fromVars = { opacity: 0, scale: 0.85 };
                        break;

                    case 'slide-up':
                        fromVars = { opacity: 0, y: 80 };
                        break;

                    default:
                        return;
                }

                gsap.set(el, fromVars);
            });

            // animate theo nhóm (🔥 stagger)
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.15, // 🔥 chạy lần lượt
                scrollTrigger: {
                    trigger: group,
                    start: 'top 85%',
                    once: true,
                    invalidateOnRefresh: true
                }
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

