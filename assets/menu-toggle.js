
// document.addEventListener("DOMContentLoaded", function () {
//   // Toggle المينيو الرئيسي
//   const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

//   mainToggles.forEach((btn) => {
//     const menu = document.getElementById(btn.dataset.target);
//     if (!menu) return;

//     // Click لفتح/إغلاق على الموبايل والديسكتوب
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       menu.classList.toggle("hidden");
//     });

//     // Hover للحفاظ على القائمة مفتوحة أثناء المؤشر داخلها
//     btn.addEventListener("mouseenter", () => {
//       if (window.innerWidth > 768) menu.classList.remove("hidden");
//     });

//     btn.addEventListener("mouseleave", () => {
//       if (window.innerWidth > 768)
//         setTimeout(() => {
//           if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
//         }, 150);
//     });

//     menu.addEventListener("mouseleave", () => {
//       if (window.innerWidth > 768)
//         setTimeout(() => {
//           if (!menu.matches(":hover") && !btn.matches(":hover")) menu.classList.add("hidden");
//         }, 150);
//     });
//   });

//   // Toggle Child → Grandchild
//   const childToggles = document.querySelectorAll(".js-toggle-grandchild");

//   childToggles.forEach((btn) => {
//     const parentLi = btn.closest("li");
//     const submenu = parentLi.querySelector("ul");
//     if (!submenu) return;

//     // Click لفتح/إغلاق الـ Grandchild
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       const isOpen = !submenu.classList.contains("hidden");

//       // إغلاق جميع القوائم الفرعية الأخرى
//       document.querySelectorAll(".js-toggle-grandchild").forEach((otherBtn) => {
//         const otherLi = otherBtn.closest("li");
//         const otherSub = otherLi.querySelector("ul");
//         if (otherSub && otherSub !== submenu) otherSub.classList.add("hidden");
//       });

//       if (isOpen) submenu.classList.add("hidden");
//       else submenu.classList.remove("hidden");
//     });

//     // الحفاظ على القائمة مفتوحة طالما المؤشر داخلها
//     const keepOpen = () => {
//       submenu.classList.remove("hidden");
//     };

//     submenu.addEventListener("mouseenter", keepOpen);
//     btn.addEventListener("mouseenter", keepOpen);

//     const hideSubmenu = () => {
//       setTimeout(() => {
//         if (!submenu.matches(":hover") && !btn.matches(":hover")) {
//           submenu.classList.add("hidden");
//         }
//       }, 150);
//     };

//     parentLi.addEventListener("mouseleave", hideSubmenu);
//     submenu.addEventListener("mouseleave", hideSubmenu);
//   });
// });


document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------
  // Main menu toggle
  // ---------------------------
  const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

  mainToggles.forEach((btn) => {
    const menu = document.getElementById(btn.dataset.target);
    if (!menu) return;

    // Click → Toggle على الموبايل
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.offsetHeight; // Force reflow لتشغيل الترانزيشن
      menu.classList.toggle("show");
    });

    // Hover → فقط للديسكتوب
    const showMenu = () => {
      if (window.innerWidth > 768) menu.classList.add("show");
    };
    const hideMenu = () => {
      if (window.innerWidth > 768)
        setTimeout(() => {
          if (!menu.matches(":hover") && !btn.matches(":hover")) {
            menu.classList.remove("show");
          }
        }, 150);
    };

    btn.addEventListener("mouseenter", showMenu);
    btn.addEventListener("mouseleave", hideMenu);
    menu.addEventListener("mouseenter", showMenu);
    menu.addEventListener("mouseleave", hideMenu);
  });

  // ---------------------------
  // Child → Grandchild toggle
  // ---------------------------
  const childToggles = document.querySelectorAll(".js-toggle-grandchild");

  childToggles.forEach((btn) => {
    const parentLi = btn.closest("li");
    const submenu = parentLi.querySelector("ul");
    if (!submenu) return;

    // Click → Toggle
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Force reflow
      submenu.offsetHeight;

      const isOpen = submenu.classList.contains("show");

      // إغلاق القوائم الأخرى في نفس المستوى
      parentLi.parentElement.querySelectorAll("ul").forEach((otherSub) => {
        if (otherSub !== submenu) otherSub.classList.remove("show");
      });

      submenu.classList.toggle("show", !isOpen);
    });

    // Hover → فقط للديسكتوب
    const showSubmenu = () => {
      if (window.innerWidth > 768) submenu.classList.add("show");
    };
    const hideSubmenu = () => {
      if (window.innerWidth > 768)
        setTimeout(() => {
          if (!submenu.matches(":hover") && !btn.matches(":hover")) {
            submenu.classList.remove("show");
          }
        }, 150);
    };

    btn.addEventListener("mouseenter", showSubmenu);
    btn.addEventListener("mouseleave", hideSubmenu);
    submenu.addEventListener("mouseenter", showSubmenu);
    submenu.addEventListener("mouseleave", hideSubmenu);
  });
});
