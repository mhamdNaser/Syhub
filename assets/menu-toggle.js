document.addEventListener("DOMContentLoaded", function () {
  /** -------------------------------
   * Burger menu open/close (mobile)
   * ------------------------------- */
  const mobileBurger = document.querySelectorAll(".mobile-navbar-burger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeBtns = document.querySelectorAll(".mobile-navbar-close");
  const backdrops = document.querySelectorAll(".mobile-navbar-backdrop");

  mobileBurger.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  backdrops.forEach((bg) => {
    bg.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  /** -------------------------------
   * Sub-menus (desktop hover + mobile click)
   * ------------------------------- */
  const toggles = document.querySelectorAll(".js-toggle-menu");

  toggles.forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const menu = document.getElementById(targetId);
    if (!menu) return;

    // عرض القائمة عند الهوفر على الزر
    btn.addEventListener("mouseenter", () => {
      menu.classList.remove("hidden");
      menu.classList.add("js-menu-open");
    });

    // إخفاء القائمة عند الخروج من الزر أو القائمة
    btn.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!menu.matches(':hover') && !btn.matches(':hover')) {
          menu.classList.add("hidden");
          menu.classList.remove("js-menu-open");
        }
      }, 200); // تأخير بسيط لتجنب الإغلاق الفوري
    });

    menu.addEventListener("mouseleave", () => {
      menu.classList.add("hidden");
      menu.classList.remove("js-menu-open");
    });

    menu.addEventListener("mouseenter", () => {
      menu.classList.remove("hidden");
      menu.classList.add("js-menu-open");
    });

    // للـ mobile، ابقِ الكليك موجود إذا أحببت
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        menu.classList.toggle("hidden");
        menu.classList.toggle("js-menu-open");
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