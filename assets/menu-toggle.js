document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".js-toggle-header-menu");

  toggles.forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const menu = document.getElementById(targetId);
    if (!menu) return;

    // Desktop hover
    btn.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        menu.classList.remove("hidden");
        menu.classList.add("js-menu-open");
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        setTimeout(() => {
          if (!menu.matches(":hover") && !btn.matches(":hover")) {
            menu.classList.add("hidden");
            menu.classList.remove("js-menu-open");
          }
        }, 200);
      }
    });

    menu.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        menu.classList.remove("hidden");
        menu.classList.add("js-menu-open");
      }
    });

    menu.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        menu.classList.add("hidden");
        menu.classList.remove("js-menu-open");
      }
    });

    // Mobile click
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        menu.classList.toggle("hidden");
        menu.classList.toggle("js-menu-open");
      }
    });
  });
});
