
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='search']");
  const searchBox = searchInput?.closest("form");
  const mobileSearchBtn = document.getElementById("mobile-search-btn");
  const mobileSearchOverlay = document.getElementById("mobile-search-overlay");
  const mobileSearchClose = document.getElementById("mobile-search-close");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  const mobileSearchResults = document.getElementById("mobile-search-results");

  function openMobileSearch() {
    mobileSearchOverlay.classList.remove("hidden");
    mobileSearchInput.focus();
  }

  function closeMobileSearch() {
    mobileSearchOverlay.classList.add("hidden");
    mobileSearchInput.value = "";
    mobileSearchResults.innerHTML = "";
  }

  mobileSearchBtn?.addEventListener("click", openMobileSearch);
  mobileSearchClose?.addEventListener("click", closeMobileSearch);

  let searchResults = document.getElementById("search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.id = "search-results";
    searchResults.className =
      "absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 max-h-96 overflow-auto";
    searchBox?.appendChild(searchResults);
  }

  function highlightMatch(text, query) {
    if (!text) return "";
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      `<span style="background-color:#f2bed2;">$1</span>`
    );
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

  async function fetchSearchResults(query, target = "desktop") {
    const resultsContainer =
      target === "desktop" ? searchResults : mobileSearchResults;

    if (!query.trim()) {
      resultsContainer.classList.add("hidden");
      resultsContainer.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(
          query
        )}&resources[type]=product,collection`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      const products = data.resources.results.products || [];
      const collections = data.resources.results.collections || [];

      let resultsHTML = "";

      // === Suggestions (تظهر للجميع: موبايل + ديسكتوب) ===
      if (collections.length > 0) {
        resultsHTML += `
          <div class="mb-4 px-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Suggestions</h3>
            <div class="flex flex-wrap gap-3">
              ${collections
                .map(
                  coll => `
                  <button class="px-4 py-2 bg-[#f2bed2] text-[#c42764] rounded-lg hover:bg-[#c42764] hover:text-white transition suggestion-btn shadow-sm font-medium" data-term="${coll.title}">
                    ${highlightMatch(coll.title, query)}
                  </button>`
                )
                .join("")}
            </div>
          </div>`;
      }

      // === Products ===
      if (products.length > 0) {
        resultsHTML += `
          <div class="px-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Products</h3>
            ${products
              .map(
                product => `
              <div class="border-b last:border-none product-item" data-handle="${product.handle}">
                <a href="${product.url}" class="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-shadow shadow-sm">
                  <div class="flex items-center space-x-3 overflow-hidden">
                    <img src="${product.featured_image?.url}" alt="${product.title}" class="w-12 h-12 rounded-md object-cover flex-shrink-0">
                    <div class="flex flex-col min-w-0">
                      <p class="text-sm text-gray-500 truncate">${highlightMatch(
                        product.vendor || "",
                        query
                      )}</p>
                      <span class="text-gray-900 font-semibold">${highlightMatch(
                        product.title,
                        query
                      )}</span>
                      <p class="text-xs text-gray-400 mt-1 description-placeholder">Loading description...</p>
                    </div>
                  </div>
                  <div class="text-right min-w-[80px] flex-shrink-0">
                    <span class="text-gray-800 font-bold text-base">
                      ${
                        product.price.currency_symbol || "$"
                      }${(product.price.amount || product.price).toLocaleString()}
                    </span>
                  </div>
                </a>
              </div>`
              )
              .join("")}
          </div>`;
      }

      resultsContainer.innerHTML = resultsHTML;
      resultsContainer.classList.remove("hidden");

      // === تحميل الوصف لكل منتج ===
      resultsContainer.querySelectorAll(".product-item").forEach(async item => {
        const handle = item.getAttribute("data-handle");
        const descElement = item.querySelector(".description-placeholder");
        const fullDesc = await fetchProductDescription(handle);

        if (descElement) {
          const sentence = extractSentence(fullDesc, query);
          descElement.innerHTML = highlightMatch(sentence, query);
        }
      });

      // === تفعيل أزرار السجسشن (للجميع) ===
      resultsContainer.querySelectorAll(".suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const term = btn.getAttribute("data-term");
          if (target === "desktop") {
            searchInput.value = term;
            fetchSearchResults(term, "desktop");
          } else {
            mobileSearchInput.value = term;
            fetchSearchResults(term, "mobile");
          }
        });
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      resultsContainer.innerHTML = `<div class="p-4 text-red-600 text-center">Error fetching results</div>`;
      resultsContainer.classList.remove("hidden");
    }
  }

  // === Event Listeners ===
  searchInput?.addEventListener("input", e =>
    fetchSearchResults(e.target.value, "desktop")
  );
  mobileSearchInput?.addEventListener("input", e =>
    fetchSearchResults(e.target.value, "mobile")
  );

  document.addEventListener("click", e => {
    if (!searchBox?.contains(e.target)) {
      searchResults.classList.add("hidden");
    }
  });
});


