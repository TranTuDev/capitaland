
// ================= HOME-SLIDER =================
if ($(".slider-home").length > 0) {
  const sliderHome = new Swiper(".slider-home", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    loop: true,

    navigation: {
      nextEl: ".sw-btn-next",
      prevEl: ".sw-btn-prev",
    },

    pagination: {
      el: ".sw-pagination-slider",
      type: "fraction",
    },

    on: {
      init(swiper) {
        requestAnimationFrame(() => {
          setActive(swiper);
        });
      },

      slideChangeTransitionStart(swiper) {
        clearAll(swiper);
      },

      slideChangeTransitionEnd(swiper) {
        setActive(swiper);
      },
    },
  });

  function clearAll(swiper) {
    swiper.slides.forEach((slide) => {
      slide.querySelectorAll(".fade-item").forEach((el) => {
        el.classList.remove("is-animated");
      });
    });
  }

  function setActive(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide) return;

    activeSlide.querySelectorAll(".fade-item").forEach((el) => {
      el.classList.add("is-animated");
    });
  }
}



// ================= PREMIUM-SLIDER =================//

// jQuery(function ($) {
//   new Swiper('.premium-slider', {
//     loop: false,
//     spaceBetween: 24,
//     slidesPerView: 1,
//     pagination: {
//       el: '.premium-slider .swiper-pagination',
//       clickable: true
//     },
//     breakpoints: {
//       576: {
//         slidesPerView: 2
//       },
//       992: {
//         slidesPerView: 3
//       },
//       1200: {
//         slidesPerView: 4
//       }
//     }
//   });
// });

jQuery(function ($) {
  new Swiper('.premium-slider', {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.premium-slider .swiper-pagination',
      clickable: true
    },
    breakpoints: {
      576: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });
});










//===step===//


// const steps = document.querySelectorAll('.download-step__item');
// const preview = document.getElementById('stepPreviewImage');


// function updateStepLines() {
//   const items = document.querySelectorAll('.download-step__item');

//   items.forEach((item, index) => {
//     if (index === items.length - 1) return;

//     const currentBtn = item.querySelector('.download-step__button');
//     const nextBtn = items[index + 1].querySelector('.download-step__button');
//     if (!currentBtn || !nextBtn) return;

//     const currentRect = currentBtn.getBoundingClientRect();
//     const nextRect = nextBtn.getBoundingClientRect();
//     const lineHeight = nextRect.top - currentRect.bottom - 16;

//     currentBtn.style.setProperty('--line-height', `${Math.max(lineHeight, 0)}px`);
//   });
// }

// steps.forEach(step => {
//   step.addEventListener('click', () => {
//     const currentActive = document.querySelector('.download-step__item.active');

//     if (currentActive !== step) {
//       currentActive?.classList.remove('active');
//       step.classList.add('active');

//       const image = step.dataset.image;
//       preview.style.opacity = 0;

//       setTimeout(() => {
//         preview.src = image;
//         preview.style.opacity = 1;
//       }, 200);


//       requestAnimationFrame(updateStepLines);
//       setTimeout(updateStepLines, 420);
//     }
//   });
// });

// updateStepLines();
// window.addEventListener('resize', updateStepLines);


jQuery(function ($) {
  const $thumbRoot = $('.download-step-thumb');

  const stepThumb = new Swiper('.download-step-thumb', {
    direction: 'vertical',
    slidesPerView: 5,
    spaceBetween: 0,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    speed: 600,
    breakpoints: {
      0: {
        direction: 'horizontal',
        slidesPerView: 5,
        spaceBetween: 12
      },
      768: {
        direction: 'vertical',
        slidesPerView: 5,
        spaceBetween: 0
      }
    }
  });

  const stepContent = new Swiper('.download-step-content', {
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    autoHeight: true
  });

  function syncStepActiveState(index) {
    $thumbRoot.find('.download-step__item').removeClass('active');
    $thumbRoot.find('.swiper-slide').eq(index).find('.download-step__item').addClass('active');
  }

  function updateStepLines() {
    const slides = document.querySelectorAll('.download-step-thumb .swiper-slide');

    slides.forEach((slide) => {
      const btn = slide.querySelector('.download-step__button');
      if (btn) btn.style.removeProperty('--line-height');
    });

    if (window.innerWidth <= 767) return;

    slides.forEach((slide, index) => {
      if (index === slides.length - 1) return;

      const currentBtn = slide.querySelector('.download-step__button');
      const nextBtn = slides[index + 1]?.querySelector('.download-step__button');

      if (!currentBtn || !nextBtn) return;

      const currentRect = currentBtn.getBoundingClientRect();
      const nextRect = nextBtn.getBoundingClientRect();

      const lineHeight = nextRect.top - currentRect.bottom - 8;
      currentBtn.style.setProperty('--line-height', `${Math.max(lineHeight, 30)}px`);
    });
  }

  function refreshLines() {
    requestAnimationFrame(() => {
      updateStepLines();
      setTimeout(updateStepLines, 450);
    });
  }

  function goToStep(index) {
    stepThumb.slideTo(index);
    stepContent.slideTo(index);
    syncStepActiveState(index);
    refreshLines();
  }

  $thumbRoot.find('.swiper-slide').each(function (index) {
    $(this).on('click', function () {
      goToStep(index);
    });
  });

  stepContent.on('slideChange', function () {
    const index = stepContent.activeIndex;
    stepThumb.slideTo(index);
    syncStepActiveState(index);
    refreshLines();
  });

  stepThumb.on('slideChange', function () {
    syncStepActiveState(stepThumb.activeIndex);
    refreshLines();
  });

  $(window).on('resize', function () {
    refreshLines();
  });

  syncStepActiveState(0);
  refreshLines();
});





//================ MEMBERSHIP-SLIDER =================//


const membershipSwiper = new Swiper('.membership-slider', {
  slidesPerView: 3.2,
  spaceBetween: 24,
  // loop: true,
  speed: 800,

  navigation: {
    nextEl: '.membership-slider .sw-next',
    prevEl: '.membership-slider .sw-prev',
  },

  pagination: {
    el: '.membership-slider .swiper-pagination',
    clickable: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 1
    },
    575: {
      slidesPerView: 1.5
    },
    768: {
      slidesPerView: 2.5
    },
    1199: {
      slidesPerView: 3.2
    }

  }
});


