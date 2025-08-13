document.addEventListener("DOMContentLoaded", function () {
  const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
  const colorButtons = document.querySelectorAll(".color-swatch");
  const selects = document.querySelectorAll('variant-selector select');
  const mainImageContainer = document.getElementById("main-product-image");
  const priceContainer = document.getElementById("price-{{ section.id }}");
  const hiddenInput = document.querySelector('#product-form input[name="id"]');

  function updateVariant(optionValues) {
    const selectedVariant = variantData.find(v => {
      return v.options.every((opt, i) => opt === optionValues[i]);
    });

    if (!selectedVariant) return;

    // تحديث الصورة
    if (selectedVariant.featured_image) {
      fetch(selectedVariant.featured_image.src)
      .then(() => {
        mainImageContainer.innerHTML = `
          <img src="${selectedVariant.featured_image.src}" alt="${selectedVariant.featured_image.alt}" class="w-full h-auto" />
        `;
      });
    }

    // تحديث السعر
    priceContainer.innerHTML = `
      <span class="text-base text-gray-500 line-through">
        ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
      </span>
      <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
      ${selectedVariant.price < selectedVariant.compare_at_price ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>' : ''}
    `;

    // تحديث ID الفارينت
    hiddenInput.value = selectedVariant.id;
  }

  // عند الضغط على زر لون
  colorButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const optionIndex = parseInt(btn.dataset.optionIndex);
      const selectsArray = Array.from(selects).map(s => s.value);
      selectsArray[optionIndex] = btn.dataset.value;
      selects[optionIndex].value = btn.dataset.value;
      updateVariant(selectsArray);
    });
  });

  // عند تغيير أي قائمة
  selects.forEach((sel, index) => {
    sel.addEventListener("change", function () {
      const selectsArray = Array.from(selects).map(s => s.value);
      updateVariant(selectsArray);
    });
  });
});