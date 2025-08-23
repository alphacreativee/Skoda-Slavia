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
        clickable: true
        // renderBullet: function (index, className) {
        //   return `
        //     <button class="${className}">
        //       <span class="progress-bar"></span>
        //     </button>`;
        // },
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
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
        }
      }
    });
  });
}

function sectionDesign() {
  if ($(".section-design").length < 1) return;

  $(".section-design .nav-tabs a").click(function () {
    var position = $(this).parent().position();
    var width = $(this).parent().width();
    $(".section-design .slider").css({ left: +position.left, width: width });
  });

  var actWidth = $(".section-design .nav-tabs")
    .find(".active")
    .parent("li")
    .width();
  var actPosition = $(".section-design .nav-tabs .active").position();

  $(".section-design .slider").css({
    left: +actPosition.left,
    width: actWidth
  });

  if (!document.querySelector(".swiper-design-parallax")) return;

  document.querySelectorAll(".swiper-design-parallax").forEach((el) => {
    new Swiper(el, {
      centeredSlides: true,
      slidesPerView: 1.5,
      spaceBetween: 24,
      speed: 900,
      parallax: true,
      loop: true,
      loopedSlides: 2,
      autoplay: {
        delay: 2000
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        type: "progressbar"
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
      },
      breakpoints: {
        991: {
          slidesPerView: 1.5,
          spaceBetween: 40,
          autoplay: false
        }
      }
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  heroSwiper();
  sectionDesign();
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
