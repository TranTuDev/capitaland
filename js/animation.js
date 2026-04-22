// ===== INFINITE SLIDE =====
$(document).ready(function () {
  $('.infiniteslide_wrap').each(function () {
    const $wrap = $(this);
    const slide = $wrap.find('.infiniteslide')[0];
    const slideWidth = slide.scrollWidth / 2;
    const tl = gsap.to(slide, {
      x: -slideWidth,
      duration: 18,
      ease: "linear",
      repeat: -1
    });

    $wrap.hover(
      function () { tl.pause(); },
      function () { tl.resume(); }
    );
  });
});
// ===== DATA ANIMATE =====
$(document).ready(function () {
  const $items = $('[data-animate]');

  function checkAnimate() {
    const windowBottom = $(window).scrollTop() + $(window).height();

    $items.each(function () {
      const itemTop = $(this).offset().top + 100;

      if (windowBottom > itemTop) {
        $(this).addClass('animated');
      }
    });
  }

  $(window).on('scroll', checkAnimate);
  checkAnimate();
});
// ===== GO TOP BUTTON =====
$(function () {
  const $goTop = $("#goTop");

  $(window).on("scroll", function () {
    const scrollTop = $(this).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const progress = (scrollTop / docHeight) * 360;

    if (scrollTop > 300) {
      $goTop.addClass("show");
    } else {
      $goTop.removeClass("show");
    }

    $goTop.find(".border-progress")
      .css("--progress-angle", progress + "deg");
  });

  $goTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

});

// ===== COUNTER ANIMATION =====
$(document).ready(function () {
  const $counters = $('[data-target]');

  function checkCounter() {
    const windowBottom = $(window).scrollTop() + $(window).height();

    $counters.each(function () {
      const $el = $(this);
      if ($el.data('animated')) return;

      const elementTop = $el.offset().top;

      if (windowBottom > elementTop + 100) {
        const targetValue = Number($el.data('target'));
        const suffix = $el.data('suffix') || '';

        // GSAP counter
        gsap.fromTo(
          { value: 0 },
          {
            value: targetValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              $el.html(Math.round(this.targets()[0].value) + suffix);
            }
          }
        );

        $el.data('animated', true);
      }
    });
  }

  $(window).on('scroll', checkCounter);
  setTimeout(checkCounter, 100); // chạy lần đầu
});

// ===== PAGE TRANSITION =====
$(document).ready(function () {

  const $overlay = $(".page-transition");
  if (!$overlay.length) return;

  const $logo = $(".transition-logo");
  const panelLeft = $(".panel-left")[0];
  const panelRight = $(".panel-right")[0];

  // Split chữ nếu chưa có
  if ($logo.find("span").length === 0) {
    $logo.html(
      $logo.text().trim()
        .split("")
        .map(l => `<span>${l}</span>`)
        .join("")
    );
  }

  const letters = $(".transition-logo span").toArray();

  function playTransition() {
    $overlay.css("display", "flex");

    const tl = gsap.timeline({
      ease: "expo.inOut",
      onComplete: () => {
        $overlay.hide();


        gsap.set(letters, { y: 60, opacity: 0, filter: "blur(8px)" });
        gsap.set([panelLeft, panelRight], { x: "0%" });
      }
    });

    tl
      .fromTo(letters,
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08
        }
      )
      .to(letters, {
        opacity: 0,
        duration: 0.4,
        delay: 0.2
      })
      .to(panelLeft, {
        x: "-100%",
        duration: 0.9
      })
      .to(panelRight, {
        x: "100%",
        duration: 0.9
      }, "-=0.9");
  }


  setTimeout(playTransition, 150);
});

// ===== SCROLL ANIMATIONS (GSAP) =====
$(document).ready(function () {
  const isMobile = window.innerWidth <= 768;
  const moveDistance = isMobile ? 20 : 50;

  const animatedElements = [];

  // Ẩn thanh cuộn ngang
  $('html, body').css('overflow-x', 'hidden');

  function setupElement(el) {
    const $el = $(el);
    const rawDelay = $el.attr('data-delay');


    let customDelay = 0;
    if (rawDelay) {
      customDelay = rawDelay.includes('s')
        ? parseFloat(rawDelay) * 1000
        : parseInt(rawDelay);
    }


    gsap.set($el[0], {
      opacity: 0,
      y: moveDistance,
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden'
    });

    animatedElements.push({
      el: $el[0],
      delay: customDelay,
      animated: false
    });
  }


  const EXCLUDED = '.tf-topbar, #header, .tf-slider-show, footer, .video-popup';

  $('section .animation-bottom, div:not(' + EXCLUDED + ') > .animation-bottom').each(function () {
    if ($(this).closest(EXCLUDED).length) return;
    setupElement(this);
  });


  function animateElement(item) {
    gsap.to(item.el, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      delay: item.delay / 1000,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",   // giữ nguyên easing bạn dùng
      onComplete: () => {
        item.animated = true;
      }
    });
  }


  function checkScroll() {
    const viewportBottom = window.innerHeight + window.scrollY;

    animatedElements.forEach(item => {
      if (item.animated) return;

      const rect = item.el.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;


      if (viewportBottom > elementTop + (item.el.offsetHeight * 0.15)) {
        animateElement(item);
      }
    });
  }


  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkScroll();
        ticking = false;
      });
      ticking = true;
    }
  });


  setTimeout(checkScroll, 100);
});

// ================= STICKY HEADER =================//
const header = document.getElementById("header");

window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    header.classList.add("is-sticky");
  } else {
    header.classList.remove("is-sticky");
  }
});

// ================= FADE UP =================//

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".fade-up");

  if (elements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));
  }
});

// ================= DOWNLOAD STICKY =================
const sticky = document.querySelector('.download-sticky');
const footer = document.querySelector('.download-sticky__footer');

footer.addEventListener('click', () => {
  sticky.classList.toggle('is-active');
});















// ================= load page =================//

// const loader = document.getElementById('pageLoader');
// const wrapper = document.getElementById('mainWrapper');

// // Ẩn wrapper cho đến khi loader xong
// wrapper.style.visibility = 'hidden';

// // Tổng thời gian loader: shine (0.3s delay + 1s) + logoFadeIn = ~1.6s
// // Thêm buffer nhỏ rồi trigger slide-up
// const LOADER_DURATION = 1800; // ms

// window.addEventListener('DOMContentLoaded', () => {
//   setTimeout(() => {
//     // 1. Chạy animation slide-up
//     loader.classList.add('is-done');

//     // 2. Sau khi slide-up xong (0.7s) → hiện wrapper, xóa loader
//     loader.addEventListener('animationend', () => {
//       loader.remove();
//       wrapper.style.visibility = 'visible';
//       wrapper.classList.add('wrapper--ready'); // trigger các animation khác
//     }, { once: true });

//   }, LOADER_DURATION);
// });