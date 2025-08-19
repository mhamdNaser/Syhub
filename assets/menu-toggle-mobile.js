document.addEventListener("DOMContentLoaded", function () {
  const mobileBurger = document.querySelectorAll(".mobile-footer-burger");
  const mobileMenu = document.querySelector(".mobile-footer-menu");
  const closeBtns = document.querySelectorAll(".mobile-footer-close");

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

  // Sub-menus
  const toggles = document.querySelectorAll(".js-toggle-footer-menu");
  toggles.forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const menu = document.getElementById(targetId);

    if (!menu) {
      console.warn("⚠️ ما لقيت قائمة بالـ id:", targetId);
      return;
    }

    btn.addEventListener("click", () => {
      console.log("✅ ضغطت على الزر:", targetId);
      menu.classList.toggle("hidden");
    });
  });
});
