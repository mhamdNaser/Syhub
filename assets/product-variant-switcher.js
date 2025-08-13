

// document.addEventListener("DOMContentLoaded", function () {
//   const variantData = JSON.parse(document.querySelector('variant-selector script[type="application/json"]').textContent);
//   const colorButtons = document.querySelectorAll(".color-swatch");
//   const selects = document.querySelectorAll('variant-selector select');
//   const mainImageContainer = document.getElementById("main-product-image");
//   const mediaStorage = document.getElementById("all-variant-media");
//   const priceContainer = document.getElementById("price-{{ section.id }}");
//   const hiddenInput = document.querySelector('#product-form input[name="id"]');
//   const colorLabel = document.getElementById("variantLabel")

//   function updateVariant(optionValues) {
//     const selectedVariant = variantData.find(v => {
//       return v.options.every((opt, i) => opt === optionValues[i]);
//     });

//     if (!selectedVariant) return;

//     if (colorLabel) {
//       colorLabel.textContent = selectedVariant.title; // أو selectedVariant.name حسب ما لديك
//     }

//     // تحديث الصورة من الميديا المخفية
//     if (selectedVariant.featured_media && selectedVariant.featured_media.id) {
//       const mediaId = selectedVariant.featured_media.id;
//       const mediaHTML = mediaStorage.querySelector(`[data-media-id="${mediaId}"]`);
//       if (mediaHTML) {
//         mainImageContainer.innerHTML = mediaHTML.innerHTML;
//         mainImageContainer.setAttribute("data-current-media-id", mediaId);
//       }
//     }

//     // تحديث السعر
//     if (priceContainer) {
//       priceContainer.innerHTML = `
//       <span class="text-base text-gray-500 line-through">
//         ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
//       </span>
//       <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
//       ${selectedVariant.price < selectedVariant.compare_at_price ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>' : ''}
//     `;
//     }

//     // تحديث ID الفارينت
//     hiddenInput.value = selectedVariant.id;
//   }

//   // عند الضغط على زر لون
//   colorButtons.forEach(btn => {
//     btn.addEventListener("click", function () {
//       const optionIndex = parseInt(btn.dataset.optionIndex);
//       const selectsArray = Array.from(selects).map(s => s.value);
//       selectsArray[optionIndex] = btn.dataset.value;
//       selects[optionIndex].value = btn.dataset.value;
//       updateVariant(selectsArray);
//     });
//   });

//   // عند تغيير أي قائمة
//   selects.forEach((sel) => {
//     sel.addEventListener("change", function () {
//       const selectsArray = Array.from(selects).map(s => s.value);
//       updateVariant(selectsArray);
//     });
//   });
// });


let swiper;

  document.addEventListener("DOMContentLoaded", function () {
    // تهيئة السويبر
    try {
      swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        },
      });
    } catch (e) {
      console.log('SwiperJS is not defined');
    }

    // بيانات الفاريانت
    const jsonEl = document.querySelector('variant-selector script[type="application/json"]');
    if (!jsonEl) return;
    const variantData = JSON.parse(jsonEl.textContent);

    const colorButtons = document.querySelectorAll(".color-swatch");
    const selects = document.querySelectorAll('variant-selector select');
    const mainImageContainer = document.getElementById("main-product-image");
    const mediaStorage = document.getElementById("all-variant-media");
    const priceContainer = document.getElementById("price-{{ section.id }}");
    const hiddenInput = document.querySelector('#product-form input[name="id"]');
    const colorLabel = document.getElementById("variantLabel");

    function updateVariant(optionValues) {
      const selectedVariant = variantData.find(v => {
        return v.options.every((opt, i) => opt === optionValues[i]);
      });

      if (!selectedVariant) return;

      // تحديث اسم الفاريانت
      if (colorLabel) {
        colorLabel.textContent = selectedVariant.title;
      }

      // تحديث الصورة الرئيسية
      if (selectedVariant.featured_media && selectedVariant.featured_media.id) {
        const mediaId = selectedVariant.featured_media.id;
        const mediaHTML = mediaStorage?.querySelector(`[data-media-id="${mediaId}"]`);
        if (mediaHTML) {
          mainImageContainer.innerHTML = mediaHTML.innerHTML;
          mainImageContainer.setAttribute("data-current-media-id", mediaId);
        }

        // 🔹 تحريك السويبر للصورة المطابقة
        const slides = document.querySelectorAll('.swiper-slide [data-media-id]');
        slides.forEach((slide, index) => {
          if (parseInt(slide.getAttribute('data-media-id')) === mediaId) {
            if (swiper) {
              swiper.slideTo(index);
            }
          }
        });
      }

      // تحديث السعر
      if (priceContainer) {
        priceContainer.innerHTML = `
          <span class="text-base text-gray-500 line-through">
            ${selectedVariant.compare_at_price ? Shopify.formatMoney(selectedVariant.compare_at_price) : ""}
          </span>
          <span class="text-lg text-gray-900">${Shopify.formatMoney(selectedVariant.price)}</span>
          ${selectedVariant.price < selectedVariant.compare_at_price
            ? '<span class="px-5 py-1 text-sm font-bold bg-red-500 rounded-full text-white mx-4">Sale</span>'
            : ''
          }
        `;
      }

      // تحديث ID الفاريانت في الفورم
      if (hiddenInput) hiddenInput.value = selectedVariant.id;
    }

    // عند الضغط على زر اللون
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
    selects.forEach(sel => {
      sel.addEventListener("change", function () {
        const selectsArray = Array.from(selects).map(s => s.value);
        updateVariant(selectsArray);
      });
    });
  });