document.addEventListener("DOMContentLoaded", function () {
  // Toggle المينيو الرئيسي
  const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

  mainToggles.forEach((btn) => {
    const menu = document.getElementById(btn.dataset.target);
    if (!menu) return;

    const isMegaMenu = menu.querySelector("ul.grid") !== null; // التحقق إن كان ميجا

    if (!isMegaMenu) {
      // === Classic Menu Behavior ===
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

      // === Child → Grandchild Toggle ===
      const childToggles = menu.querySelectorAll(".js-toggle-grandchild");
      childToggles.forEach((childBtn) => {
        const parentLi = childBtn.closest("li");
        const submenu = parentLi.querySelector("ul");
        if (!submenu) return;

        childBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const isOpen = !submenu.classList.contains("hidden");

          menu.querySelectorAll(".js-toggle-grandchild").forEach((otherBtn) => {
            const otherLi = otherBtn.closest("li");
            const otherSub = otherLi.querySelector("ul");
            if (otherSub && otherSub !== submenu) otherSub.classList.add("hidden");
          });

          submenu.classList.toggle("hidden", isOpen);
        });

        const keepOpen = () => submenu.classList.remove("hidden");
        childBtn.addEventListener("mouseenter", keepOpen);
        submenu.addEventListener("mouseenter", keepOpen);

        const hideSubmenu = () => {
          setTimeout(() => {
            if (!submenu.matches(":hover") && !childBtn.matches(":hover")) {
              submenu.classList.add("hidden");
            }
          }, 150);
        };
        parentLi.addEventListener("mouseleave", hideSubmenu);
        submenu.addEventListener("mouseleave", hideSubmenu);
      });
    } else {
      // === Mega Menu Behavior ===
      if (window.innerWidth > 768) {
        // فقط hover للكبير
        const groupItems = menu.querySelectorAll("li.group");
        groupItems.forEach((li) => {
          const submenu = li.querySelector("ul");
          if (!submenu) return;

          li.addEventListener("mouseenter", () => submenu.classList.remove("hidden"));
          li.addEventListener("mouseleave", () => submenu.classList.add("hidden"));
        });
      } else {
        // === Mobile Behavior ===
        const childToggles = menu.querySelectorAll(".js-toggle-grandchild");
        childToggles.forEach((btn) => {
          const parentLi = btn.closest("li");
          const submenu = parentLi.querySelector("ul");
          if (!submenu) return;

          btn.addEventListener("click", (e) => {
            e.preventDefault();
            submenu.classList.toggle("hidden");
          });
        });
      }
    }
  });
});

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

