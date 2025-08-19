document.addEventListener("DOMContentLoaded", function () {
  /** -------------------------------
   * Burger menu open/close (mobile)
   * ------------------------------- */
  const mobileBurger = document.querySelectorAll(".mobile-navbar-burger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeBtns = document.querySelectorAll(".mobile-navbar-close");
  const backdrops = document.querySelectorAll(".mobile-navbar-backdrop");

  // open
  mobileBurger.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  });

  // close
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  // backdrop click
  backdrops.forEach((bg) => {
    bg.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  /** -------------------------------
   * Sub-menus (desktop + mobile)
   * ------------------------------- */
  const toggles = document.querySelectorAll(".js-toggle-menu");

  toggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      const menu = document.getElementById(targetId);

      if (!menu) return;

      // إغلاق باقي القوائم
      document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
        if (openMenu !== menu) {
          openMenu.classList.add("hidden");
          openMenu.classList.remove("js-menu-open");
        }
      });

      // toggle للقائمة الحالية
      menu.classList.toggle("hidden");
      menu.classList.toggle("js-menu-open");
    });
  });

  // إغلاق عند الضغط خارج القوائم الفرعية
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".js-toggle-menu") &&
      !e.target.closest(".js-menu-open")
    ) {
      document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
        openMenu.classList.add("hidden");
        openMenu.classList.remove("js-menu-open");
      });
    }
  });

  /** -------------------------------
   * Search box (mobile)
   * ------------------------------- */
  const searchToggle = document.getElementById("search-toggle");
  const mobileSearchBox = document.getElementById("mobile-search-box");

  if (searchToggle) {
    searchToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileSearchBox.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
      if (
        !mobileSearchBox.classList.contains("hidden") &&
        !mobileSearchBox.contains(e.target) &&
        e.target !== searchToggle
      ) {
        mobileSearchBox.classList.add("hidden");
      }
    });
  }
});



// document.addEventListener("DOMContentLoaded", () => {
//   const toggles = document.querySelectorAll(".js-toggle-menu");

//   toggles.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       const targetId = btn.getAttribute("data-target");
//       const menu = document.getElementById(targetId);

//       if (!menu) return;

//       // إغلاق باقي القوائم قبل فتح الجديد
//       document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
//         if (openMenu !== menu) {
//           openMenu.classList.add("hidden");
//           openMenu.classList.remove("js-menu-open");
//         }
//       });

//       // toggle للقائمة الحالية
//       menu.classList.toggle("hidden");
//       menu.classList.toggle("js-menu-open");
//     });
//   });

//   // إغلاق عند الضغط خارج القائمة
//   document.addEventListener("click", (e) => {
//     if (!e.target.closest(".js-toggle-menu") && !e.target.closest(".js-menu-open")) {
//       document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
//         openMenu.classList.add("hidden");
//         openMenu.classList.remove("js-menu-open");
//       });
//     }
//   });
// });
