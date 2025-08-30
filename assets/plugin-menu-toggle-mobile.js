document.addEventListener("DOMContentLoaded", function () {
  const mobileBurger = document.querySelectorAll(".mobile-footer-burger");
  const mobileMenu = document.querySelector(".mobile-footer-menu");
  const closeBtns = document.querySelectorAll(".mobile-footer-close");
  const backdrops = document.querySelectorAll(".mobile-footer-backdrop");

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

  // Sub-menus (footer)
  const toggles = document.querySelectorAll(".js-toggle-footer-menu");
  toggles.forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const menu = document.getElementById(targetId);
    if (!menu) return;

    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  });
});
