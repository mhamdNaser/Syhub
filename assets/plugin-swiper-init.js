
function initSwipers() {
  const sliders = Array.from(document.querySelectorAll("[class*='mySwiper-']")).map(swiperContainer => {
    const classList = swiperContainer.className.split(" ");
    const mySwiperClass = classList.find(c => c.startsWith("mySwiper-"));

    const nextBtn = "." + swiperContainer.dataset.nextBtn;
    const prevBtn = "." + swiperContainer.dataset.prevBtn;

    const slidesPerView = parseInt(swiperContainer.dataset.slidesPerView) || 1;
    const slidesPerViewMobile = parseInt(swiperContainer.dataset.slidesPerViewMobile) || 1;

    const autoplayEnabled = swiperContainer.dataset.autoplay === "true";
    const autoplayDelay = parseInt(swiperContainer.dataset.autoplayDelay) || 10000;
    const centerSlides = swiperContainer.dataset.centeredSlides || false ;
    const speed = parseInt(swiperContainer.dataset.speed) || 1500;

    return {
      container: swiperContainer,
      nextBtn,
      prevBtn,
      slidesPerView,
      slidesPerViewMobile,
      autoplayEnabled,
      autoplayDelay,
      centerSlides,
      speed
    };
  });

  requestAnimationFrame(() => {
    sliders.forEach(slider => {
      const slidesCount = slider.container.querySelectorAll('.swiper-slide').length;
      const slidesToShow = Math.min(slider.slidesPerView, slidesCount);

      new Swiper(slider.container, {
        slidesPerView: "auto",
        centeredSlides: slider.centerSlides,
        autoHeight: true,
        speed: slider.speed,
        spaceBetween: 10,
        navigation: {
          nextEl: slider.nextBtn,
          prevEl: slider.prevBtn
        },
        breakpoints: {
          0: {
            slidesPerView: slider.slidesPerViewMobile,
            spaceBetween: 5,
          },
          768: {
            slidesPerView: Math.min(slider.slidesPerView, 3),
            spaceBetween: 10,
          },
          1074: {
            slidesPerView: Math.max(slider.slidesPerView - 1, 1),
            spaceBetween: 20,
          },
          1440: {
            slidesPerView: slider.slidesPerView,
            spaceBetween: 20,
          },
        },
        autoplay: slider.autoplayEnabled ? {
          delay: slider.autoplayDelay,
          disableOnInteraction: false
        } : false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      });
    });
  });
}
