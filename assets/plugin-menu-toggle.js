document.addEventListener("DOMContentLoaded", function () {

  const menuContainer = document.querySelector('.header__menu ul');
  if (!menuContainer) return;

  const seeMoreLi = menuContainer.querySelector('.see-more');
  const seeMoreMenu = seeMoreLi.querySelector('ul');

  // ---------------------------
  // Toggle & Hover Menu Function
  // ---------------------------
  function initToggles(container) {
    // Main toggles
    const mainToggles = container.querySelectorAll(".js-toggle-header-menu");
    mainToggles.forEach((btn) => {
      const menu = document.getElementById(btn.dataset.target);
      if (!menu) return;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleMenu(menu);
      });

      const showMenu = () => { if (window.innerWidth > 768) menu.classList.add("show"); };
      const hideMenu = () => {
        if (window.innerWidth > 768)
          setTimeout(() => {
            if (!menu.matches(":hover") && !btn.matches(":hover")) closeMenu(menu);
          }, 150);
      };

      btn.addEventListener("mouseenter", showMenu);
      btn.addEventListener("mouseleave", hideMenu);
      menu.addEventListener("mouseenter", showMenu);
      menu.addEventListener("mouseleave", hideMenu);
    });

    // Child → Grandchild toggles
    const childToggles = container.querySelectorAll(".js-toggle-grandchild");
    childToggles.forEach((btn) => {
      const parentLi = btn.closest("li");
      const submenu = parentLi.querySelector("ul");
      if (!submenu) return;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleMenu(submenu, parentLi.parentElement);
      });

      const showSubmenu = () => { if (window.innerWidth > 768) submenu.classList.add("show"); };
      const hideSubmenu = () => {
        if (window.innerWidth > 768)
          setTimeout(() => {
            if (!submenu.matches(":hover") && !btn.matches(":hover")) closeMenu(submenu);
          }, 150);
      };

      btn.addEventListener("mouseenter", showSubmenu);
      btn.addEventListener("mouseleave", hideSubmenu);
      submenu.addEventListener("mouseenter", showSubmenu);
      submenu.addEventListener("mouseleave", hideSubmenu);
    });
  }

  function toggleMenu(menu, parentScope = null) {
    menu.offsetHeight;
    const isOpen = menu.classList.contains("show");
    if (parentScope) {
      parentScope.querySelectorAll("ul").forEach((other) => {
        if (other !== menu) closeMenu(other);
      });
    }
    if (isOpen) closeMenu(menu);
    else menu.classList.add("show");
  }

  function closeMenu(menu) {
    menu.classList.remove("show");
    menu.classList.add("hide");
    menu.addEventListener("animationend", () => menu.classList.remove("hide"), { once: true });
  }

  // ---------------------------
  // Adjust menu for See More
  // ---------------------------
  function adjustMenu() {
    // إعادة كل العناصر إلى القائمة الرئيسية
    Array.from(seeMoreMenu.children).forEach((li) => menuContainer.insertBefore(li, seeMoreLi));

    const containerWidth = menuContainer.offsetWidth;
    let totalWidth = seeMoreLi.offsetWidth; // زر See More

    const items = Array.from(menuContainer.children).filter((li) => li !== seeMoreLi);
    items.forEach((li) => {
      totalWidth += li.offsetWidth;
      if (totalWidth > containerWidth) {
        seeMoreMenu.appendChild(li);
      }
    });

    // إظهار أو إخفاء زر See More
    seeMoreLi.style.display = seeMoreMenu.children.length ? 'flex' : 'none';

    // إعادة تهيئة التوجيل / hover للعناصر المنقولة داخل See More
    initToggles(seeMoreMenu);
  }

  // تهيئة القائمة الأصلية + See More
  initToggles(menuContainer);
  adjustMenu();
  window.addEventListener('resize', adjustMenu);

});

// document.addEventListener("DOMContentLoaded", function () {

//   // ---------------------------
//   // Main menu toggle
//   // ---------------------------
//   const mainToggles = document.querySelectorAll(".js-toggle-header-menu");

//   mainToggles.forEach((btn) => {
//     const menu = document.getElementById(btn.dataset.target);
//     if (!menu) return;

//     // Click → Toggle على الموبايل
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       toggleMenu(menu);
//     });

//     // Hover → فقط للديسكتوب
//     const showMenu = () => {
//       if (window.innerWidth > 768) menu.classList.add("show");
//     };
//     const hideMenu = () => {
//       if (window.innerWidth > 768)
//         setTimeout(() => {
//           if (!menu.matches(":hover") && !btn.matches(":hover")) {
//             closeMenu(menu);
//           }
//         }, 150);
//     };

//     btn.addEventListener("mouseenter", showMenu);
//     btn.addEventListener("mouseleave", hideMenu);
//     menu.addEventListener("mouseenter", showMenu);
//     menu.addEventListener("mouseleave", hideMenu);
//   });

//   // ---------------------------
//   // Child → Grandchild toggle
//   // ---------------------------
//   const childToggles = document.querySelectorAll(".js-toggle-grandchild");

//   childToggles.forEach((btn) => {
//     const parentLi = btn.closest("li");
//     const submenu = parentLi.querySelector("ul");
//     if (!submenu) return;

//     // Click → Toggle
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       toggleMenu(submenu, parentLi.parentElement);
//     });

//     // Hover → فقط للديسكتوب
//     const showSubmenu = () => {
//       if (window.innerWidth > 768) submenu.classList.add("show");
//     };
//     const hideSubmenu = () => {
//       if (window.innerWidth > 768)
//         setTimeout(() => {
//           if (!submenu.matches(":hover") && !btn.matches(":hover")) {
//             closeMenu(submenu);
//           }
//         }, 150);
//     };

//     btn.addEventListener("mouseenter", showSubmenu);
//     btn.addEventListener("mouseleave", hideSubmenu);
//     submenu.addEventListener("mouseenter", showSubmenu);
//     submenu.addEventListener("mouseleave", hideSubmenu);
//   });

//   // ---------------------------
//   // Functions for animation
//   // ---------------------------
//   function toggleMenu(menu, parentScope = null) {
//     // Force reflow لإعادة تشغيل الانيميشن
//     menu.offsetHeight;

//     const isOpen = menu.classList.contains("show");

//     // إغلاق القوائم الأخرى إذا تم تمرير parentScope
//     if (parentScope) {
//       parentScope.querySelectorAll("ul").forEach((other) => {
//         if (other !== menu) closeMenu(other);
//       });
//     }

//     if (isOpen) closeMenu(menu);
//     else menu.classList.add("show");
//   }

//   function closeMenu(menu) {
//     menu.classList.remove("show");
//     menu.classList.add("hide");
//     menu.addEventListener("animationend", () => {
//       menu.classList.remove("hide");
//     }, { once: true });
//   }

// });
