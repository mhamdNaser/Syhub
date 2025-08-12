document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='search']");
  const searchBox = searchInput?.closest("form");

  let searchResults = document.getElementById("search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.id = "search-results";
    searchResults.className = "absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 max-h-96 overflow-auto";
    searchBox?.appendChild(searchResults);
  }

  // دالة تظليل الكلمات المطابقة
  function highlightMatch(text, query) {
    if (!text) return "";
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span style="background-color:#f2bed2;">$1</span>`);
  }

  async function fetchSearchResults(query) {
    if (!query.trim()) {
      searchResults.classList.add("hidden");
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

      // البحث في الكولكشن
      collections.forEach(coll => {
        if (coll.title?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(coll.title);
        }
      });

      // البحث في المنتجات
      products.forEach(prod => {
        // البحث في العنوان
        if (prod.title?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(prod.title);
        }
        // البحث في الفيندور
        if (prod.vendor?.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(prod.vendor);
        }
        // البحث في الـ description
        if (prod.description && prod.description.toLowerCase().includes(query.toLowerCase())) {
          let snippet = prod.description;
          if (snippet.length > 50) snippet = snippet.slice(0, 50) + "...";
          suggestionsSet.add(snippet);
        }
      });

      const suggestions = Array.from(suggestionsSet);

      let resultsHTML = "";

      // جزء المقترحات
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

      // جزء المنتجات
      if (products.length > 0) {
        const filteredProducts = products.filter(product =>
          product.title?.toLowerCase().includes(query.toLowerCase()) ||
          product.vendor?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length > 0) {
          resultsHTML += `
          <div class="px-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Products</h3>
            ${filteredProducts.map(product => {
              return `
              <div class="border-b last:border-none">
                <a href="${product.url}" class="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-shadow shadow-sm">
                  <div class="flex items-center space-x-3 overflow-hidden">
                    <img src="${product.featured_image?.url}" alt="${product.title}" class="w-12 h-12 rounded-md object-cover flex-shrink-0">
                    <div class="flex flex-col min-w-0">
                      <p class="text-sm text-gray-500 truncate">${highlightMatch(product.vendor || "", query)}</p>
                      <span class="text-gray-900 font-semibold truncate">${highlightMatch(product.title, query)}</span>
                      <span class="text-xs text-gray-400 truncate">${highlightMatch(product.description || "", query)}</span>
                    </div>
                  </div>
                  <div class="text-right min-w-[80px] flex-shrink-0">
                    <span class="text-gray-800 font-bold text-base">
                      ${product.price.currency_symbol || "$"}${(product.price.amount || product.price).toLocaleString()}
                    </span>
                  </div>
                </a>
              </div>`;
            }).join("")}
          </div>`;
        }
      } else if (suggestions.length === 0) {
        resultsHTML = `<div class="p-4 text-gray-500 text-center">No results found</div>`;
      }

      searchResults.innerHTML = resultsHTML;
      searchResults.classList.remove("hidden");

      // حدث الضغط على أزرار المقترحات
      document.querySelectorAll(".suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const term = btn.getAttribute("data-term");
          searchInput.value = term;
          fetchSearchResults(term);
        });
      });

    } catch (error) {
      console.error("Error fetching search results:", error);
      searchResults.innerHTML = `<div class="p-4 text-red-600 text-center">Error fetching results</div>`;
      searchResults.classList.remove("hidden");
    }
  }

  searchInput?.addEventListener("input", e => fetchSearchResults(e.target.value));

  document.addEventListener("click", e => {
    if (!searchBox?.contains(e.target)) {
      searchResults.classList.add("hidden");
    }
  });
});
