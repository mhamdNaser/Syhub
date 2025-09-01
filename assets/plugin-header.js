document.addEventListener("DOMContentLoaded", () => {
  console.log("[Header Script] DOM Loaded");

  // جلب ال wrapper
  const wrapper = document.querySelector("#header-group");
  if (!wrapper) {
    console.error("[Header Script] Wrapper #header-group غير موجود!");
    return;
  }
  console.log("[Header Script] Wrapper موجود");

  // جلب الهيدر نفسه
  const header = wrapper.querySelector(".header");
  if (!header) {
    console.error("[Header Script] عنصر الهيدر .header غير موجود داخل ال-wrapper!");
    return;
  }
  console.log("[Header Script] الهيدر موجود");

  const headerPosition = header.dataset.headerPosition ;
  console.log("[Header Script] وضع الهيدر:", headerPosition);

  // ===== Fixed Mode =====
  if (headerPosition === "fixed") {
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.zIndex = "999";
    console.log("[Header Script] تم تفعيل Fixed Mode");
  }

  // ===== Sticky Mode =====
  else if (headerPosition === "sticky") {
    if (typeof stickybits !== "undefined") {
      stickybits("#header-group", { stickyBitStickyOffset: 0 });
      console.log("[Header Script] Stickybits مفعّل");
    } else {
      console.warn("[Header Script] مكتبة stickybits غير موجودة!");
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

    console.log("[Header Script] تم تفعيل Sticky Mode");
  }

  // ===== Normal Mode =====
  else {
    header.style.position = "relative";
    console.log("[Header Script] Normal Mode - الهيدر طبيعي");
  }
});
