<script>
document.addEventListener("DOMContentLoaded", () => {
  // عناصر البحث
  const desktopSearchInput = document.querySelector("input[type='search']:not(#mobile-search-input)");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  const mobileSearchBox = document.getElementById("mobile-search-box");
  const mobileSearchResults = document.getElementById("mobile-search-results");
  const searchToggleBtn = document.getElementById("search-toggle");

  // دالة مشتركة لعمل الـ highlight
  function highlightMatch(text, query) {
    if (!text) return "";
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span style="background-color:#f2bed2;">$1</span>`);
  }

  async function fetchProductDescription(handle) {
    try {
      const res = await fetch(`/products/${handle}.json`);
      if (!res.ok) throw new Error("Failed to fetch product details");
      const data = await res.json();
      let desc = data.product?.body_html || "";
      desc = desc.replace(/<[^>]*>/g, ""); 
      return desc;
    } catch (err) {
      console.error("Error fetching product description:", err);
      return "";
    }
  }

  function extractSentence(text, query) {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const lowerQuery = query.toLowerCase();
    for (let sentence of sentences) {
      if (sentence.toLowerCase().includes(lowerQuery)) {
        return sentence.trim();
      }
    }
    return text.length > 80 ? text.slice(0, 80) + "..." : text;
  }

  async function fetchSearchResults(query, resultsContainer, inputElement) {
    if (!query.trim()) {
      resultsContainer.classList.add("hidden");
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      const products = data.resources.results.products || [];
      const collections = data.resources.results.collections || [];

      let suggestionsSet = new Set();

      collections.forEach(coll => {
        if (coll.title?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(coll.title);
        }
      });

      products.forEach(prod => {
        if (prod.title?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(prod.title);
        }
        if (prod.vendor?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(prod.vendor);
        }
      });

      const suggestions = Array.from(suggestionsSet);
      let resultsHTML = "";

      if (suggestions.length > 0) {
        resultsHTML += `
        <div class="mb-4 px-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Suggestions</h3>
          <div class="flex flex-wrap gap-3">
            ${suggestions.map(sugg => `
              <button class="px-4 py-2 bg-[#f2bed2] text-[#c42764] rounded-lg hover:bg-[#c42764] hover:text-white transition suggestion-btn shadow-sm font-medium" data-term="${sugg}">
                ${highlightMatch(sugg, query)}
              </button>`).join("")}
          </div>
        </div>`;
      }

      if (products.length > 0) {
        resultsHTML += `
        <div class="px-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Products</h3>
          ${products.map(product => `
            <div class="border-b last:border-none product-item" data-handle="${product.handle}">
              <a href="${product.url}" class="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-shadow shadow-sm">
                <div class="flex items-center space-x-3 overflow-hidden">
                  <img src="${product.featured_image?.url}" alt="${product.title}" class="w-12 h-12 rounded-md object-cover flex-shrink-0">
                  <div class="flex flex-col min-w-0">
                    <p class="text-sm text-gray-500 truncate">${highlightMatch(product.vendor || "", query)}</p>
                    <span class="text-gray-900 font-semibold">${highlightMatch(product.title, query)}</span>
                    <p class="text-xs text-gray-400 mt-1 description-placeholder">Loading description...</p>
                  </div>
                </div>
                <div class="text-right min-w-[80px] flex-shrink-0">
                  <span class="text-gray-800 font-bold text-base">
                    ${product.price.currency_symbol || "$"}${(product.price.amount || product.price).toLocaleString()}
                  </span>
                </div>
              </a>
            </div>`).join("")}
        </div>`;
      }

      resultsContainer.innerHTML = resultsHTML;
      resultsContainer.classList.remove("hidden");

      // جلب وصف المنتج
      resultsContainer.querySelectorAll(".product-item").forEach(async item => {
        const handle = item.getAttribute("data-handle");
        const descElement = item.querySelector(".description-placeholder");
        const fullDesc = await fetchProductDescription(handle);
        if (descElement) {
          const sentence = extractSentence(fullDesc, query);
          descElement.innerHTML = highlightMatch(sentence, query);
        }
      });

      // تفعيل زر المقترحات
      resultsContainer.querySelectorAll(".suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const term = btn.getAttribute("data-term");
          inputElement.value = term;
          fetchSearchResults(term, resultsContainer, inputElement);
        });
      });

    } catch (error) {
      console.error("Error fetching search results:", error);
      resultsContainer.innerHTML = `<div class="p-4 text-red-600 text-center">Error fetching results</div>`;
      resultsContainer.classList.remove("hidden");
    }
  }

  // ديسكتوب
  if (desktopSearchInput) {
    let desktopResults = document.getElementById("search-results");
    if (!desktopResults) {
      desktopResults = document.createElement("div");
      desktopResults.id = "search-results";
      desktopResults.className = "absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 max-h-96 overflow-auto";
      desktopSearchInput.closest("form")?.appendChild(desktopResults);
    }

    desktopSearchInput.addEventListener("input", e =>
      fetchSearchResults(e.target.value, desktopResults, desktopSearchInput)
    );

    document.addEventListener("click", e => {
      if (!desktopSearchInput.closest("form")?.contains(e.target)) {
        desktopResults.classList.add("hidden");
      }
    });
  }

  // موبايل
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", e =>
      fetchSearchResults(e.target.value, mobileSearchResults, mobileSearchInput)
    );

    document.addEventListener("click", e => {
      if (!mobileSearchBox.contains(e.target)) {
        mobileSearchResults.classList.add("hidden");
      }
    });

    // إظهار/إخفاء البوكس عند الضغط على زر البحث بالفوتر
    if (searchToggleBtn) {
      searchToggleBtn.addEventListener("click", () => {
        mobileSearchBox.classList.toggle("hidden");
        if (!mobileSearchBox.classList.contains("hidden")) {
          mobileSearchInput.focus();
        }
      });
    }
  }
});
</script>

// document.addEventListener("DOMContentLoaded", () => {
//   const searchInput = document.querySelector("input[type='search']");
//   const searchBox = searchInput?.closest("form");

//   let searchResults = document.getElementById("search-results");
//   if (!searchResults) {
//     searchResults = document.createElement("div");
//     searchResults.id = "search-results";
//     searchResults.className = "absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 max-h-96 overflow-auto";
//     searchBox?.appendChild(searchResults);
//   }

//   function highlightMatch(text, query) {
//     if (!text) return "";
//     const regex = new RegExp(`(${query})`, "gi");
//     return text.replace(regex, `<span style="background-color:#f2bed2;">$1</span>`);
//   }

//   // إحضار الوصف الكامل من صفحة المنتج
//   async function fetchProductDescription(handle) {
//     try {
//       const res = await fetch(`/products/${handle}.json`);
//       if (!res.ok) throw new Error("Failed to fetch product details");
//       const data = await res.json();
//       let desc = data.product?.body_html || "";
//       desc = desc.replace(/<[^>]*>/g, ""); // إزالة أكواد HTML
//       return desc;
//     } catch (err) {
//       console.error("Error fetching product description:", err);
//       return "";
//     }
//   }

//   // استخراج الجملة التي تحتوي الكلمة
//   function extractSentence(text, query) {
//     const sentences = text.split(/(?<=[.?!])\s+/); // تقسيم إلى جمل
//     const lowerQuery = query.toLowerCase();
//     for (let sentence of sentences) {
//       if (sentence.toLowerCase().includes(lowerQuery)) {
//         return sentence.trim();
//       }
//     }
//     return text.length > 80 ? text.slice(0, 80) + "..." : text; // في حال لم نجد الجملة
//   }

//   async function fetchSearchResults(query) {
//     if (!query.trim()) {
//       searchResults.classList.add("hidden");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection`
//       );
//       if (!response.ok) throw new Error("Failed to fetch search results");

//       const data = await response.json();
//       const products = data.resources.results.products || [];
//       const collections = data.resources.results.collections || [];

//       let suggestionsSet = new Set();

//       collections.forEach(coll => {
//         if (coll.title?.toLowerCase().includes(query.toLowerCase())) {
//           suggestionsSet.add(coll.title);
//         }
//       });

//       products.forEach(prod => {
//         if (prod.title?.toLowerCase().includes(query.toLowerCase())) {
//           suggestionsSet.add(prod.title);
//         }
//         if (prod.vendor?.toLowerCase().includes(query.toLowerCase())) {
//           suggestionsSet.add(prod.vendor);
//         }
//       });

//       const suggestions = Array.from(suggestionsSet);
//       let resultsHTML = "";

//       // عرض المقترحات
//       if (suggestions.length > 0) {
//         resultsHTML += `
//         <div class="mb-4 px-4">
//           <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Suggestions</h3>
//           <div class="flex flex-wrap gap-3">
//             ${suggestions.map(sugg => `
//               <button class="px-4 py-2 bg-[#f2bed2] text-[#c42764] rounded-lg hover:bg-[#c42764] hover:text-white transition suggestion-btn shadow-sm font-medium" data-term="${sugg}">
//                 ${highlightMatch(sugg, query)}
//               </button>`).join("")}
//           </div>
//         </div>`;
//       }

//       // عرض المنتجات بدون الوصف مبدئيًا
//       if (products.length > 0) {
//         resultsHTML += `
//         <div class="px-4">
//           <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Products</h3>
//           ${products.map(product => `
//             <div class="border-b last:border-none product-item" data-handle="${product.handle}">
//               <a href="${product.url}" class="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-shadow shadow-sm">
//                 <div class="flex items-center space-x-3 overflow-hidden">
//                   <img src="${product.featured_image?.url}" alt="${product.title}" class="w-12 h-12 rounded-md object-cover flex-shrink-0">
//                   <div class="flex flex-col min-w-0">
//                     <p class="text-sm text-gray-500 truncate">${highlightMatch(product.vendor || "", query)}</p>
//                     <span class="text-gray-900 font-semibold">${highlightMatch(product.title, query)}</span>
//                     <p class="text-xs text-gray-400 mt-1 description-placeholder">Loading description...</p>
//                   </div>
//                 </div>
//                 <div class="text-right min-w-[80px] flex-shrink-0">
//                   <span class="text-gray-800 font-bold text-base">
//                     ${product.price.currency_symbol || "$"}${(product.price.amount || product.price).toLocaleString()}
//                   </span>
//                 </div>
//               </a>
//             </div>`).join("")}
//         </div>`;
//       }

//       searchResults.innerHTML = resultsHTML;
//       searchResults.classList.remove("hidden");

//       // جلب الديسكربشن لكل منتج بعد العرض
//       document.querySelectorAll(".product-item").forEach(async item => {
//         const handle = item.getAttribute("data-handle");
//         const descElement = item.querySelector(".description-placeholder");
//         const fullDesc = await fetchProductDescription(handle);

//         if (descElement) {
//           const sentence = extractSentence(fullDesc, query);
//           descElement.innerHTML = highlightMatch(sentence, query);
//         }
//       });

//       // تفعيل المقترحات
//       document.querySelectorAll(".suggestion-btn").forEach(btn => {
//         btn.addEventListener("click", () => {
//           const term = btn.getAttribute("data-term");
//           searchInput.value = term;
//           fetchSearchResults(term);
//         });
//       });

//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       searchResults.innerHTML = `<div class="p-4 text-red-600 text-center">Error fetching results</div>`;
//       searchResults.classList.remove("hidden");
//     }
//   }

//   searchInput?.addEventListener("input", e => fetchSearchResults(e.target.value));

//   document.addEventListener("click", e => {
//     if (!searchBox?.contains(e.target)) {
//       searchResults.classList.add("hidden");
//     }
//   });
// });
