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
    const defaultDuration = 3000; // Thời gian autoplay cố định (3000ms)

    // Hàm cập nhật progress bar
    function updateProgressBars(swiper) {
      var bullets = swiper.pagination.bullets;
      bullets.forEach((bullet, index) => {
        let progressBar = bullet.querySelector(".progress-bar-swiper");
        if (index < swiper.realIndex) {
          bullet.classList.add("viewed");
          bullet.classList.remove("swiper-pagination-bullet-active");
          progressBar.style.width = "100%";
          progressBar.style.transition = "none";
        } else if (index === swiper.realIndex) {
          bullet.classList.remove("viewed", "swiper-pagination-bullet-active");
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
          setTimeout(() => {
            progressBar.style.width = "100%";
            progressBar.style.transition = `width ${swiper.params.autoplay.delay}ms linear`;
            // Thêm class viewed sau khi width đạt 100%
            setTimeout(() => {
              bullet.classList.add("viewed");
              bullet.classList.add("swiper-pagination-bullet-active");
            }, swiper.params.autoplay.delay);
          }, 50); // Delay nhẹ để đảm bảo render
        } else {
          bullet.classList.remove("viewed", "swiper-pagination-bullet-active");
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
        }
      });
    }

    const swiper = new Swiper(el, {
      slidesPerView: 1,
      watchSlidesProgress: true,
      speed: 1500,
      loop: true,
      autoplay: {
        delay: 3000
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
        renderBullet: function (index, className) {
          return `
            <button class="${className}">
              <span class="progress-bar-swiper"></span>
            </button>`;
        }
      },

      on: {
        init(swiper) {
          updateProgressBars(swiper); // Gọi khi khởi tạo
        },
        slideChangeTransitionStart(swiper) {
          swiper.params.autoplay.delay = defaultDuration; // Đặt lại delay
          clearTimeout(hideTimeout);
        },
        slideChangeTransitionEnd(swiper) {
          updateProgressBars(swiper);
        },
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

  const swipers = new Map();

  // Hàm khởi tạo Swiper cho một phần tử
  function initSwiper(el) {
    const swiper = new Swiper(el, {
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
    swipers.set(el, swiper); // Lưu instance Swiper
    return swiper;
  }

  // Khởi tạo Swiper cho tab đang hiển thị
  document.querySelectorAll(".swiper-design-parallax").forEach((el) => {
    // Kiểm tra xem Swiper có nằm trong tab đang hiển thị không
    const tabPane = el.closest(".tab-pane");
    if (tabPane && tabPane.classList.contains("active")) {
      initSwiper(el);
    }
  });

  // Lắng nghe sự kiện khi tab được kích hoạt
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (event) => {
      const targetPane = document.querySelector(
        event.target.getAttribute("data-bs-target")
      );
      const swiperEl = targetPane.querySelector(".swiper-design-parallax");
      if (swiperEl) {
        if (swipers.has(swiperEl)) {
          // Làm mới Swiper nếu đã khởi tạo
          swipers.get(swiperEl).update();
        } else {
          // Khởi tạo Swiper nếu chưa có
          initSwiper(swiperEl);
        }
      }
    });
  });
}
function animateTextKaraoke() {
  if ($(".effect-karaoke").length < 1) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.utils.toArray(".effect-karaoke").forEach((karaoke) => {
    const splitKaraoke = new SplitText(karaoke, {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char"
    });

    gsap.to(splitKaraoke.chars, {
      color: "#000",
      duration: 0.6,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: karaoke,
        start: "top 85%",
        end: "top 30%",
        // markers: true,
        scrub: true
      }
    });
  });
}
function svgSokoda() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".skoda-car").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      // markers: true,
      onEnter: () => {
        el.classList.add("active-svg");
      },

      once: true
    });
  });
}

function footer() {
  $("footer .dropdown-info").on("click", function () {
    $(this).toggleClass("active");
  });
}

function sectionGallery() {
  var lightboxDescription = GLightbox({
    selector: ".glightbox",
    loop: true,
    touchNavigation: true
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  heroSwiper();
  animateTextKaraoke();
  svgSokoda();
  sectionDesign();
  sectionGallery();
  footer();
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
