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
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        setTimeout(() => {
          if (!menu.matches(":hover") && !btn.matches(":hover")) {
            menu.classList.add("hidden");
          }
        }, 200);
      }
    });

    menu.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        menu.classList.add("hidden");
      }
    });

    // Mobile click
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        menu.classList.toggle("hidden");
      }
    });
  });
});
