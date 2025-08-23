document.addEventListener("DOMContentLoaded", function () {
  // كل زر للتشايلد (child links اللي لها جراند تشايلد)
  const childToggles = document.querySelectorAll(".js-toggle-grandchild");

  childToggles.forEach((btn) => {
    // البحث عن الـ submenu اللي داخل نفس li
    const parentLi = btn.closest("li");
    const submenu = parentLi.querySelector("ul");
    if (!submenu) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // إذا المفتوح حاليا
      const isOpen = !submenu.classList.contains("hidden");

      // إغلاق كل القوائم الفرعية المفتوحة غير هذه
      document.querySelectorAll(".js-toggle-grandchild").forEach((otherBtn) => {
        const otherLi = otherBtn.closest("li");
        const otherSub = otherLi.querySelector("ul");
        if (otherSub && otherSub !== submenu) {
          otherSub.classList.add("hidden");
        }
      });

      // تبديل الحالة الحالية
      if (isOpen) {
        submenu.classList.add("hidden");
      } else {
        submenu.classList.remove("hidden");
      }
    });
  });
});
