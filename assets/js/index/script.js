import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// setup lenis
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
// end lenis

function heroSwiper() {
  document.querySelectorAll(".hero-swiper").forEach((el) => {
    let hideTimeout;

    const swiper = new Swiper(el, {
      slidesPerView: 1,
      watchSlidesProgress: true,
      speed: 1500,
      loop: true,

      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
        // renderBullet: function (index, className) {
        //   return `
        //     <button class="${className}">
        //       <span class="progress-bar"></span>
        //     </button>`;
        // },
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev"),
      },
      on: {
        slideChangeTransitionStart(swiper) {
          // swiper.params.autoplay.delay = defaultDuration; // Đặt lại delay
          // swiper.autoplay.start();

          clearTimeout(hideTimeout);
        },

        slideChangeTransitionEnd(swiper) {},

        progress(swiper) {
          swiper.slides.forEach((slide) => {
            const slideProgress = slide.progress || 0;
            const innerOffset = swiper.width * 0.9;
            const innerTranslate = slideProgress * innerOffset;

            const slideInner = slide.querySelector(".hero-img");
            if (slideInner && !isNaN(innerTranslate)) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          });
        },

        touchStart(swiper) {
          swiper.slides.forEach((slide) => {
            slide.style.transition = "";
          });
          clearTimeout(hideTimeout);
        },

        setTransition(swiper, speed) {
          const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
          swiper.slides.forEach((slide) => {
            slide.style.transition = `${speed}ms ${easing}`;
            const slideInner = slide.querySelector(".hero-img");
            if (slideInner) {
              slideInner.style.transition = `${speed}ms ${easing}`;
            }
          });
        },
      },
    });
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  heroSwiper();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
    console.log("1");
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
