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
   * Sub-menus toggle (mobile)
   * ------------------------------- */
  const toggles = document.querySelectorAll(".js-toggle-menu");

  toggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // مهم حتى ما يقفل مباشرة

      const targetId = btn.getAttribute("data-target");
      const submenu = document.getElementById(targetId);

      if (!submenu) return;

      // toggle فقط الكلاس hidden للقائمة الفرعية
      submenu.classList.toggle("hidden");
    });
  });

  // إغلاق عند الضغط خارج القائمة
  document.addEventListener("click", (e) => {
    toggles.forEach((btn) => {
      const targetId = btn.getAttribute("data-target");
      const submenu = document.getElementById(targetId);
      if (
        submenu &&
        !submenu.contains(e.target) &&
        !btn.contains(e.target)
      ) {
        submenu.classList.add("hidden");
      }
    });
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

// document.addEventListener("DOMContentLoaded", function () {
//   /** -------------------------------
//    * Burger menu open/close (mobile)
//    * ------------------------------- */
//   const mobileBurger = document.querySelectorAll(".mobile-navbar-burger");
//   const mobileMenu = document.querySelector(".mobile-menu");
//   const closeBtns = document.querySelectorAll(".mobile-navbar-close");
//   const backdrops = document.querySelectorAll(".mobile-navbar-backdrop");

//   // open
//   mobileBurger.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       mobileMenu.classList.toggle("hidden");
//     });
//   });

//   // close
//   closeBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       mobileMenu.classList.add("hidden");
//     });
//   });

//   // backdrop click
//   backdrops.forEach((bg) => {
//     bg.addEventListener("click", () => {
//       mobileMenu.classList.add("hidden");
//     });
//   });

//   /** -------------------------------
//    * Sub-menus (desktop + mobile)
//    * ------------------------------- */
//   const toggles = document.querySelectorAll(".js-toggle-menu");

//   toggles.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation(); // 🔥 ضروري حتى ما يتسكر على طول

//       const targetId = btn.getAttribute("data-target");
//       const menu = document.getElementById(targetId);

//       if (!menu) return;

//       // إغلاق باقي القوائم
//       document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
//         if (openMenu !== menu) {
//           openMenu.classList.add("hidden");
//           openMenu.classList.remove("js-menu-open");
//           openMenu.previousElementSibling?.classList.remove("active-submenu");
//         }
//       });

//       // toggle للقائمة الحالية
//       menu.classList.toggle("hidden");
//       menu.classList.toggle("js-menu-open");

//       // تفعيل/إلغاء تفعيل الزر نفسه (ستايل مثلاً تغيير لون أو تدوير سهم)
//       btn.classList.toggle("active-submenu");
//     });
//   });

//   // إغلاق عند الضغط خارج القوائم الفرعية
//   document.addEventListener("click", (e) => {
//     if (
//       !e.target.closest(".js-toggle-menu") &&
//       !e.target.closest(".js-menu-open")
//     ) {
//       document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
//         openMenu.classList.add("hidden");
//         openMenu.classList.remove("js-menu-open");
//         openMenu.previousElementSibling?.classList.remove("active-submenu");
//       });
//     }
//   });

//   /** -------------------------------
//    * Search box (mobile)
//    * ------------------------------- */
//   const searchToggle = document.getElementById("search-toggle");
//   const mobileSearchBox = document.getElementById("mobile-search-box");

//   if (searchToggle) {
//     searchToggle.addEventListener("click", function (e) {
//       e.stopPropagation();
//       mobileSearchBox.classList.toggle("hidden");
//     });

//     document.addEventListener("click", function (e) {
//       if (
//         !mobileSearchBox.classList.contains("hidden") &&
//         !mobileSearchBox.contains(e.target) &&
//         e.target !== searchToggle
//       ) {
//         mobileSearchBox.classList.add("hidden");
//       }
//     });
//   }
// });