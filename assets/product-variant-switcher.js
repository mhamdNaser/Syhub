

document.addEventListener("DOMContentLoaded", function () {
  const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
  const colorButtons = document.querySelectorAll(".color-swatch");
  const selects = document.querySelectorAll('variant-selector select');
  const mainImageContainer = document.getElementById("main-product-image");
  const mediaStorage = document.getElementById("all-variant-media");
  const priceContainer = document.getElementById("price-{{ section.id }}");
  const hiddenInput = document.querySelector('#product-form input[name="id"]');
  const colorLabel = document.getElementById("variantLabel")


  function updateVariant(optionValues) {
    const selectedVariant = variantData.find(v => {
      return v.options.every((opt, i) => opt === optionValues[i]);
    });

    if (!selectedVariant) return;

    // إزالة البوردر من كل الثامبنيلز
    const allThumbnails = document.querySelectorAll('[class^="thumbnail-container_"]');
    const colorButtons = document.getElementById("#color-swatch");
    allThumbnails.forEach(thumb => {
      thumb.classList.remove('border', 'border-[#c42764]');
    });
    colorButtons.forEach(thumb => {
      thumb.classList.remove('border', 'border-[#c42764]');
    })

    if (colorButtons) colorButtons.classList.add('border', 'border-[#c42764]');

    // إضافة البوردر للثامبنيل المختار
    const thumbnailContainer = document.querySelector(`.thumbnail-container_${selectedVariant.featured_media.id}`);
    if (thumbnailContainer) {
      thumbnailContainer.classList.add('border', 'border-[#c42764]');

      // for move swiper to select variant slider
      if (window.thumbnailsSwiper) {
        const slideIndex = Array.from(thumbnailsSwiper.slides).findIndex(slide =>
          slide.contains(thumbnailContainer)
        );
        if (slideIndex >= 0) {
          thumbnailsSwiper.slideTo(slideIndex);
        }
      }
    }

    if (colorLabel) {
      colorLabel.textContent = selectedVariant.title;
    }



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

  const thumbnailButtons = document.querySelectorAll('[class^="thumbnail-container_"]');
  thumbnailButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const mediaId = parseInt(btn.getAttribute("class").match(/thumbnail-container_(\d+)/)[1]);
      const selectedVariant = variantData.find(v => v.featured_media && v.featured_media.id === mediaId);
      if (!selectedVariant) return;

      const selectsArray = Array.from(selects).map(s => s.value);
      selectedVariant.options.forEach((opt, i) => {
        selectsArray[i] = opt;
        selects[i].value = opt;
      });
      updateVariant(selectsArray);
    });
  });
});
