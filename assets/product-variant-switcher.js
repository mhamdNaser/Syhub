document.addEventListener("DOMContentLoaded", function () {
  const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
  const colorButtons = document.querySelectorAll(".color-swatch");
  const selects = document.querySelectorAll('variant-selector select');
  const mainImageContainer = document.getElementById("main-product-image");
  const mediaStorage = document.getElementById("all-variant-media");
  const priceContainer = document.getElementById("price-{{ section.id }}");
  const hiddenInput = document.querySelector('#product-form input[name="id"]');
  const colorLabel = document.getElementById("variantLabel")
  const productForm = document.getElementById("formInput");

  // تعريف السوايبر للموبايل
  let mobileSwiper;
  try {
    mobileSwiper = new Swiper('.md\\:hidden .swiper', {
      direction: 'horizontal',
      pagination: { el: '.swiper-pagination' },
      navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
    });
  } catch (e) {
    console.log('SwiperJS for mobile not initialized');
  }

  function updateVariant(optionValues) {
    const selectedVariant = variantData.find(v => v.options.every((opt, i) => opt === optionValues[i]));
    if (!selectedVariant) return;

    if (colorLabel) {
      colorLabel.textContent = selectedVariant.title;
    }

    if (productForm) {
      productForm.value = selectedVariant.id;
    }

    // لو الشاشة كبيرة: تحديث الصورة الرئيسية
    if (window.innerWidth >= 768 && selectedVariant.featured_media?.id) {
      const mediaId = selectedVariant.featured_media.id;
      const mediaHTML = mediaStorage.querySelector(`[data-media-id="${mediaId}"]`);
      if (mediaHTML) {
        mainImageContainer.innerHTML = mediaHTML.innerHTML;
        mainImageContainer.setAttribute("data-current-media-id", mediaId);
      }
    }

    // لو الشاشة صغيرة: الانتقال للصورة في السوايبر
    if (window.innerWidth < 768 && mobileSwiper && selectedVariant.featured_media?.id) {
      const mobileSlides = document.querySelectorAll('.md\\:hidden .swiper-slide');
      mobileSlides.forEach((slide, index) => {
        if (slide.querySelector(`[data-media-id="${selectedVariant.featured_media.id}"]`)) {
          mobileSwiper.slideTo(index);
        }
      });
    }

    priceContainer.innerHTML = `
      <span class="text-base text-gray-500 line-through">
        ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
      </span>
      <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
      ${selectedVariant.price < selectedVariant.compare_at_price ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>' : ''}
    `;

    hiddenInput.value = selectedVariant.id;
  }

  colorButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const optionIndex = parseInt(btn.dataset.optionIndex);
      const selectsArray = Array.from(selects).map(s => s.value);
      selectsArray[optionIndex] = btn.dataset.value;
      selects[optionIndex].value = btn.dataset.value;
      updateVariant(selectsArray);
    });
  });

  selects.forEach(sel => {
    sel.addEventListener("change", function () {
      const selectsArray = Array.from(selects).map(s => s.value);
      updateVariant(selectsArray);
    });
  });

  productForm.addEventListener("submit", function () {
    const selectsArray = Array.from(selects).map(s => s.value);
    updateVariant(selectsArray);
  });
});


// document.addEventListener("DOMContentLoaded", function () {
//   const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
//   const colorButtons = document.querySelectorAll(".color-swatch");
//   const selects = document.querySelectorAll('variant-selector select');
//   const mainImageContainer = document.getElementById("main-product-image");
//   const mediaStorage = document.getElementById("all-variant-media");
//   const priceContainer = document.getElementById("price-{{ section.id }}");
//   const hiddenInput = document.querySelector('#product-form input[name="id"]');
//   const colorLabel = document.getElementById("variantLabel")
//   const productForm = document.getElementById("formInput");

//   function updateVariant(optionValues) {
//     const selectedVariant = variantData.find(v => v.options.every((opt, i) => opt === optionValues[i]));
//     if (!selectedVariant) return;

//     if (colorLabel) {
//       colorLabel.textContent = selectedVariant.title;
//     }

//     if (productForm) {
//       productForm.value = selectedVariant.id;
//     }

//     if (selectedVariant.featured_media && selectedVariant.featured_media.id) {
//       const mediaId = selectedVariant.featured_media.id;
//       const mediaHTML = mediaStorage.querySelector(`[data-media-id="${mediaId}"]`);
//       if (mediaHTML) {
//         mainImageContainer.innerHTML = mediaHTML.innerHTML;
//         mainImageContainer.setAttribute("data-current-media-id", mediaId);
//       }
//     }

//     priceContainer.innerHTML = `
//       <span class="text-base text-gray-500 line-through">
//         ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
//       </span>
//       <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
//       ${selectedVariant.price < selectedVariant.compare_at_price ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>' : ''}
//     `;

//     hiddenInput.value = selectedVariant.id;
//   }

//   colorButtons.forEach(btn => {
//     btn.addEventListener("click", function () {
//       const optionIndex = parseInt(btn.dataset.optionIndex);
//       const selectsArray = Array.from(selects).map(s => s.value);
//       selectsArray[optionIndex] = btn.dataset.value;
//       selects[optionIndex].value = btn.dataset.value;
//       updateVariant(selectsArray);
//     });
//   });

//   selects.forEach(sel => {
//     sel.addEventListener("change", function () {
//       const selectsArray = Array.from(selects).map(s => s.value);
//       updateVariant(selectsArray);
//     });
//   });

//   // **تأكيد تحديث hidden input قبل الإرسال**
//   productForm.addEventListener("submit", function () {
//     const selectsArray = Array.from(selects).map(s => s.value);
//     updateVariant(selectsArray);
//   });
// });

