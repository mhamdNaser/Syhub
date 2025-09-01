document.addEventListener("DOMContentLoaded", () => {
  // جلب ال wrapper
  const wrapper = document.querySelector("#header-group");
  if (!wrapper) return;

  // جلب الهيدر نفسه
  const header = wrapper.querySelector(".header");
  if (!header) return;

  const headerPosition = header.dataset.headerPosition || "normal";

  // ===== Fixed Mode =====
  if (headerPosition === "fixed") {
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.zIndex = "999"; // لضمان ظهوره فوق باقي العناصر
  }

  // ===== Sticky Mode =====
  else if (headerPosition === "sticky") {
    if (typeof stickybits !== "undefined") {
      stickybits("#header-group .header", { stickyBitStickyOffset: 0 });
    }

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
          // صعود → إرجاع البار والهيدر لوضعهم الطبيعي
          announcementBar.style.transform = "translateY(0)";
          header.style.transform = "translateY(0)";
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  // ===== Normal Mode =====
  else {
    // لا نفعل أي شيء، الهيدر يبقى طبيعي
    header.style.position = "relative";
  }
});
