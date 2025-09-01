else if (headerPosition === "sticky") {
  if (typeof stickybits !== "undefined") {
    stickybits("#header-group", { stickyBitStickyOffset: 0 });
    console.log("[Header Script] Stickybits مفعّل");
  } else {
    console.warn("[Header Script] مكتبة stickybits غير موجودة!");
  }

  // إضافة انتقال سلس
  header.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
  if (announcementBar) {
    announcementBar.style.transition = "transform 0.3s ease";
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
        header.style.boxShadow = "none"; // إزالة الظل عند النزول
      } else {
        // صعود → إرجاع البار والهيدر
        announcementBar.style.transform = "translateY(0)";
        header.style.transform = "translateY(0)";
        header.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // إضافة ظل خفيف
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  console.log("[Header Script] تم تفعيل Sticky Mode");
}
