document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#header-group");
  if (!header) return;

  const headerPosition = header.dataset.headerPosition;

  // ===== Fixed Mode =====
  if (headerPosition === "fixed") {
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.width = "100%";
  }

  // ===== Sticky Mode =====
  if (headerPosition === "sticky") {
    // stickybits
    if (typeof stickybits !== "undefined") {
      stickybits("#header-group", { stickyBitStickyOffset: 0 });
    }

    // scroll hide/show
    let lastScrollTop = 0;
    const announcementBar = document.querySelector(".announcement-bar");
    const barHeight = announcementBar ? announcementBar.offsetHeight : 0;

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (announcementBar) {
        if (scrollTop > lastScrollTop) {
          // نزول → إخفاء البار ورفع الهيدر
          announcementBar.style.transform = `translateY(-${barHeight}px)`;
          header.style.transform = `translateY(-${barHeight}px)`;
        } else {
          // صعود → إرجاع البار والهيدر لوضعهم الطبيعي
          announcementBar.style.transform = "translateY(0)";
          header.style.transform = "translateY(0)";
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }
});
