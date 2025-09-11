
document.addEventListener("DOMContentLoaded", function () {
  var variantData = [];
  const scriptTag = document.querySelector('variant-selector script[type="application/json"]');
  const colorButtons = document.querySelectorAll(".color-swatch");
  const selects = document.querySelectorAll('variant-selector select');
  const mainImageContainer = document.getElementById("main-product-image");
  const mediaStorage = document.getElementById("all-variant-media");
  const priceContainer = document.getElementById("price-{{ section.id }}");
  const hiddenInput = document.querySelector('#product-form input[name="id"]');
  const colorLabel = document.getElementById("variantLabel");
  const sku = document.getElementById("container-sku");


  if (scriptTag) {
    variantData = JSON.parse(scriptTag.textContent);
  } else {
    console.warn("⚠️ not avaialble script[type='application/json'] داخل variant-selector");
  }

  function getSwiperForThumbnail(thumbnailContainer) {
    const swiperEl = thumbnailContainer.closest('.thumbnail-slider').querySelector('.swiper');
    if (!swiperEl) return null;
    return swiperEl.swiper || null; // Swiper instance مربوط بالـ DOM element
  }


  function updateVariant(optionValues) {
    const selectedVariant = variantData.find(v => {
      return v.options.every((opt, i) => opt === optionValues[i]);
    });


    if (!selectedVariant) return;

    if (sku) {
      sku.textContent = ''
      sku.textContent = selectedVariant.sku
    }
    // إزالة البوردر من كل الثامبنيلز
    const allThumbnails = document.querySelectorAll('[class^="thumbnail-container_"]');
    allThumbnails.forEach(thumb => {
      thumb.classList.remove('border-[#c42764]');
      thumb.classList.add('border-neutral-200');
    });

    // إضافة البوردر للثامبنيل المختار
    const thumbnailContainer = document.querySelector(`.thumbnail-container_${selectedVariant.featured_media.id}`);
    if (thumbnailContainer) {
      thumbnailContainer.classList.remove( 'border-neutral-200');
      thumbnailContainer.classList.add( 'border-[#c42764]');

      // ✅ تحريك الـ swiper الصحيح
      const swiperInstance = getSwiperForThumbnail(thumbnailContainer);
      if (swiperInstance) {
        const slideIndex = Array.from(swiperInstance.slides).findIndex(slide =>
          slide.contains(thumbnailContainer)
        );
        if (slideIndex >= 0) {
          swiperInstance.slideTo(slideIndex);
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
      const allcolorButtons = document.querySelectorAll('.color-swatch');
      allcolorButtons.forEach(btnbor => {
        btnbor.classList.remove('border', 'border-[#c42764]');
      });
      const optionIndex = parseInt(btn.dataset.optionIndex);
      const selectsArray = Array.from(selects).map(s => s.value);
      selectsArray[optionIndex] = btn.dataset.value;
      selects[optionIndex].value = btn.dataset.value;
      btn.classList.add('border', 'border-[#c42764]');
      updateVariant(selectsArray);
    });
  });

  // عند عمل hover على زر اللون
  colorButtons.forEach(btn => {
    btn.addEventListener("mouseenter", function () {
      const allcolorButtons = document.querySelectorAll('.color-swatch');
      allcolorButtons.forEach(btnbor => {
        btnbor.classList.remove('outline', 'outline-[#c42764]');
      });
      const optionIndex = parseInt(btn.dataset.optionIndex);
      const selectsArray = Array.from(selects).map(s => s.value);
      selectsArray[optionIndex] = btn.dataset.value;
      btn.classList.add('outline', 'outline-[#c42764]');
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