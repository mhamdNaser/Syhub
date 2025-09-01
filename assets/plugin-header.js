document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector("#header-group");
  if (!wrapper) return;

  const header = wrapper.querySelector(".header");
  if (!header) return;

  const headerPosition = header.dataset.headerPosition;

  // ===== Fixed Mode =====
  if (headerPosition === "fixed") {
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.zIndex = "999";
  }

  // ===== Sticky Mode =====
  else if (headerPosition === "sticky") {
    // إذا مكتبة stickybits موجودة
    if (typeof stickybits !== "undefined") {
      stickybits("#header-group .header", { stickyBitStickyOffset: 0 });
    } else {
      // تفعيل Sticky يدوي
      let lastScrollTop = 0;
      const announcementBar = document.querySelector(".announcement-bar");
      const barHeight = announcementBar ? announcementBar.offsetHeight : 0;

      window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (announcementBar) {
          if (scrollTop > lastScrollTop) {
            // نزول → إخفاء البار والهيدر
            announcementBar.style.transform = `translateY(-${barHeight}px)`;
            header.style.transform = `translateY(-${barHeight}px)`;
          } else {
            // صعود → إرجاع البار والهيدر
            announcementBar.style.transform = "translateY(0)";
            header.style.transform = "translateY(0)";
          }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });
    }

    // تعيين الهيدر لوضع sticky CSS أساسي
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.zIndex = "999";
  }

  // ===== Normal Mode =====
  else {
    header.style.position = "relative";
  }
});
