document.addEventListener("DOMContentLoaded", function() {
  // قراءة الـ Handle من عنصر مخفي بالصفحة
  let productHandleEl = document.querySelector('[data-product-handle]');
  if (!productHandleEl) return;

  let productHandle = productHandleEl.getAttribute('data-product-handle');

  let viewedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // إزالة أي نسخة قديمة من نفس المنتج
  viewedProducts = viewedProducts.filter(item => item !== productHandle);

  // إضافة المنتج الحالي في أول القائمة
  viewedProducts.unshift(productHandle);

  // تحديد عدد المنتجات (6 فقط)
  if (viewedProducts.length > 6) {
    viewedProducts = viewedProducts.slice(0, 6);
  }

  // حفظ بالقائمة
  localStorage.setItem("recentlyViewed", JSON.stringify(viewedProducts));
});
