document.addEventListener("DOMContentLoaded", function () {
  const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

  mainToggles.forEach((btn) => {
    const menu = document.getElementById(btn.dataset.target);
    if (!menu) return;

    const isMegaMenu = menu.classList.contains("mega-menu");

    // === كلاسيك ===
    if (!isMegaMenu) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        menu.classList.toggle("hidden");
      });

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
    }

    // === ميجا مينو ===
    else {
      if (window.innerWidth > 768) {
        // hover يفتح ويغلق
        btn.addEventListener("mouseenter", () => menu.classList.remove("hidden"));
        btn.addEventListener("mouseleave", () => {
          setTimeout(() => {
            if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
          }, 150);
        });
        menu.addEventListener("mouseleave", () => {
          setTimeout(() => {
            if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
          }, 150);
        });
      } else {
        // click للموبايل
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          menu.classList.toggle("hidden");
        });
      }
    }
  });

  // === Toggle Grandchild (يعمل مع الكلاسيك والميجا) ===
  const childToggles = document.querySelectorAll(".js-toggle-grandchild");

  childToggles.forEach((btn) => {
    const parentLi = btn.closest("li");
    const submenu = parentLi.querySelector("ul");
    if (!submenu) return;

    // Click لفتح/إغلاق على الموبايل
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        submenu.classList.toggle("hidden");
      }
    });

    // Hover للديسكتوب
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
