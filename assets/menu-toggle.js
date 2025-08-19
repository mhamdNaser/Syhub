document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".js-toggle-menu");

  toggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      const menu = document.getElementById(targetId);

      if (!menu) return;

      // إغلاق باقي القوائم قبل فتح الجديد
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

  // إغلاق عند الضغط خارج القائمة
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".js-toggle-menu") && !e.target.closest(".js-menu-open")) {
      document.querySelectorAll(".js-menu-open").forEach((openMenu) => {
        openMenu.classList.add("hidden");
        openMenu.classList.remove("js-menu-open");
      });
    }
  });
});
