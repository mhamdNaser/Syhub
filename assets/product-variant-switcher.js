

document.addEventListener("DOMContentLoaded", function () {
  const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
  const colorButtons = document.querySelectorAll(".color-swatch");
  const selects = document.querySelectorAll('variant-selector select');
  const mainImageContainer = document.getElementById("main-product-image");
  const mediaStorage = document.getElementById("all-variant-media");
  const priceContainer = document.getElementById("price-{{ section.id }}");
  const hiddenInput = document.querySelector('#product-form input[name="id"]');
  const colorLabel = document.getElementById("variantLabel")
  const thumbnailContainer = document.getElementsByClassName("thumbnail-container")

  function updateVariant(optionValues) {
    const selectedVariant = variantData.find(v => {
      return v.options.every((opt, i) => opt === optionValues[i]);
    });

    if (!selectedVariant) return;

    if (colorLabel) {
      colorLabel.textContent = selectedVariant.title; 
    }

    thumbnailContainer.className('border-[#c42764]')

    // تحديث الصورة من الميديا المخفية
    if (selectedVariant.featured_media && selectedVariant.featured_media.id) {
      const mediaId = selectedVariant.featured_media.id;
      const mediaHTML = mediaStorage.querySelector(`[data-media-id="${mediaId}"]`);
      if (mediaHTML) {
        mainImageContainer.innerHTML = mediaHTML.innerHTML;
        mainImageContainer.setAttribute("data-current-media-id", mediaId);
        
      }
    }

    // تحديث السعر
    if (priceContainer) {
      priceContainer.innerHTML = `
      <span class="text-base text-gray-500 line-through">
        ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
      </span>
      <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
      ${selectedVariant.price < selectedVariant.compare_at_price ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>' : ''}
    `;
    }

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
  selects.forEach((sel) => {
    sel.addEventListener("change", function () {
      const selectsArray = Array.from(selects).map(s => s.value);
      updateVariant(selectsArray);
    });
  });
});
