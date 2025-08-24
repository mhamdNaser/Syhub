
document.addEventListener("DOMContentLoaded", function () {
  // Toggle المينيو الرئيسي
  const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

  mainToggles.forEach((btn) => {
    const menu = document.getElementById(btn.dataset.target);
    if (!menu) return;

    // Click لفتح/إغلاق على الموبايل والديسكتوب
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("hidden");
    });

    // Hover للحفاظ على القائمة مفتوحة أثناء المؤشر داخلها
    btn.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) menu.classList.remove("hidden");
    });

    btn.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768)
        setTimeout(() => {
          if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
        }, 150);
    });

    menu.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768)
        setTimeout(() => {
          if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
        }, 150);
    });
  });

  // Toggle Child → Grandchild
  const childToggles = document.querySelectorAll(".js-toggle-grandchild");

  // Toggle Child → Grandchild
  childToggles.forEach((btn) => {
    const parentLi = btn.closest("li");
    const submenu = parentLi.querySelector("ul");
    if (!submenu) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = submenu.classList.contains("show");

      // إغلاق جميع القوائم الأخرى
      document.querySelectorAll(".js-toggle-grandchild").forEach((otherBtn) => {
        const otherLi = otherBtn.closest("li");
        const otherSub = otherLi.querySelector("ul");
        if (otherSub && otherSub !== submenu) otherSub.classList.remove("show");
      });

      if (isOpen) submenu.classList.remove("show");
      else submenu.classList.add("show");
    });

    // الحفاظ على القائمة مفتوحة أثناء المؤشر
    const keepOpen = () => submenu.classList.add("show");
    const hideSubmenu = () => {
      setTimeout(() => {
        if (!submenu.matches(":hover") && !btn.matches(":hover")) {
          submenu.classList.remove("show");
        }
      }, 150);
    };

    submenu.addEventListener("mouseenter", keepOpen);
    btn.addEventListener("mouseenter", keepOpen);

    parentLi.addEventListener("mouseleave", hideSubmenu);
    submenu.addEventListener("mouseleave", hideSubmenu);
  });

});

