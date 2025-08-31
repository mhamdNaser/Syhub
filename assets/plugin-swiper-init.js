document.addEventListener("DOMContentLoaded", function () {
  
  const sliders = Array.from(document.querySelectorAll("[class*='mySwiper-']")).map(swiperContainer => {
    const classList = swiperContainer.className.split(" ");
    const mySwiperClass = classList.find(c => c.startsWith("mySwiper-"));
    
    const nextBtn = "." + swiperContainer.dataset.nextBtn;
    const prevBtn = "." + swiperContainer.dataset.prevBtn;

    const slidesPerView = parseInt(swiperContainer.dataset.slidesPerView) || 2;
    const slidesPerViewMobile = parseInt(swiperContainer.dataset.slidesPerViewMobile) || 2;

    return {
      container: swiperContainer,
      nextBtn,
      prevBtn,
      slidesPerView,
      slidesPerViewMobile
    };
  });

  requestAnimationFrame(() => {
    sliders.forEach(slider => {
      new Swiper(slider.container, {
        slidesPerView: slider.slidesPerView,
        spaceBetween: 10,
        loop: false,
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
      });
    });
  });
});