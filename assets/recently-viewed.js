document.addEventListener("DOMContentLoaded", function() {
  // قراءة الـ Handle من عنصر مخفي
  let productHandleEl = document.querySelector('[data-product-handle]');
  if (!productHandleEl) return;

  let productHandle = productHandleEl.getAttribute('data-product-handle');

  let viewedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // إزالة التكرارات
  viewedProducts = viewedProducts.filter(item => item !== productHandle);

  // إضافة المنتج الحالي في أول القائمة
  viewedProducts.unshift(productHandle);

  // تحديد عدد المنتجات المحفوظة (مثلاً 6)
  if (viewedProducts.length > 6) {
    viewedProducts.pop();
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewedProducts));
});
