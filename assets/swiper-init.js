document.addEventListener("DOMContentLoaded", function () {
  // كل سلايدر موجود في الصفحة
  document.querySelectorAll("[class*='mySwiper-']").forEach(function (swiperContainer) {
    const classList = swiperContainer.className.split(" ");
    const mySwiperClass = classList.find(c => c.startsWith("mySwiper-"));
    const nextBtn = swiperContainer.dataset.nextBtn;
    const prevBtn = swiperContainer.dataset.prevBtn;

    // جلب بيانات من attributes لو حبيت تمرر بيانات مختلفة لكل سكشن
    const slidesPerView = parseInt(swiperContainer.dataset.slidesPerView) || 2;
    const slidesPerViewMobile = parseInt(swiperContainer.dataset.slidesPerViewMobile) || 2;

    new Swiper(swiperContainer, {
      slidesPerView: slidesPerView,
      spaceBetween: 10,
      loop: false,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn
      },
      breakpoints: {
        0: {
          slidesPerView: slidesPerViewMobile,
          spaceBetween: 5,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1074: {
          slidesPerView: slidesPerView - 1,
          spaceBetween: 20,
        },
        1440: {
          slidesPerView: slidesPerView,
          spaceBetween: 20,
        },
      },
    });
  });
});
