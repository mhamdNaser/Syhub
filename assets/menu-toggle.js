document.addEventListener("DOMContentLoaded", function () {
  const togglesGrandchild = document.querySelectorAll(".js-toggle-grandchild");

  togglesGrandchild.forEach((btn) => {
    const submenu = btn.nextElementSibling; // الـ ul يلي الجراند تشايلد
    if (!submenu) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = !submenu.classList.contains("hidden");
      
      // إغلاق كل القوائم المفتوحة قبل فتح هذه
      document.querySelectorAll(".js-toggle-grandchild + ul").forEach((el) => {
        el.classList.add("hidden");
      });

      if (!isOpen) {
        submenu.classList.remove("hidden");
      }
    });
  });
});
