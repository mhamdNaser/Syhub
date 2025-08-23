document.addEventListener("DOMContentLoaded", function () {
  // Toggle المينيو الرئيسي
  const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

  mainToggles.forEach((btn) => {
    const menu = document.getElementById(btn.dataset.target);
    if (!menu) return;

    // Click لفتح/إغلاق على الموبايل
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("hidden");
    });

    // Hover للحفاظ على القائمة مفتوحة أثناء المؤشر داخلها (ديسكتوب)
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

  childToggles.forEach((btn) => {
    const parentLi = btn.closest("li");
    const submenu = parentLi.querySelector("ul");
    if (!submenu) return;

    // Click لفتح/إغلاق الـ Grandchild
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        submenu.classList.toggle("hidden");
      }
    });

    // الحفاظ على القائمة مفتوحة أثناء hover
    const keepOpen = () => submenu.classList.remove("hidden");
    btn.addEventListener("mouseenter", keepOpen);
    submenu.addEventListener("mouseenter", keepOpen);

    const hideSubmenu = () => {
      setTimeout(() => {
        if (!submenu.matches(":hover") && !btn.matches(":hover")) {
          submenu.classList.add("hidden");
        }
      }, 150);
    };
    parentLi.addEventListener("mouseleave", hideSubmenu);
    submenu.addEventListener("mouseleave", hideSubmenu);
  });
});
