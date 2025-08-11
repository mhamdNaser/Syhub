document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='search']");
  const searchBox = searchInput?.closest("form");

  let searchResults = document.getElementById("search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.id = "search-results";
    searchResults.className = "absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg hidden z-50 max-h-[400px] overflow-y-auto";
    searchBox?.appendChild(searchResults);
  }

  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
      }
    }
    return matrix[b.length][a.length];
  }

  async function fetchSearchResults(query) {
    if (!query.trim()) {
      searchResults.classList.add("hidden");
      return;
    }

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection`);
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();

      const products = data.resources.results.products || [];
      const collections = data.resources.results.collections || [];

      let suggestionsSet = new Set();

      collections.forEach(coll => {
        if (coll.title.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(coll.title);
        }
      });

      products.forEach(prod => {
        if (prod.title.toLowerCase().includes(query.toLowerCase())) {
          suggestionsSet.add(prod.title);
        }
        if (prod.vendor && prod.vendor.toLowerCase().includes(query.toLowerCase())) {
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
              <button class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition suggestion-btn shadow-sm font-medium" data-term="${sugg}">
                ${sugg}
              </button>`).join("")}
          </div>
        </div>`;
      }

      if (products.length > 0) {
        resultsHTML += `
        <div class="px-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Products</h3>
          ${products.map(product => `
            <div class="border-b last:border-none">
              <a href="${product.url}" class="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-shadow shadow-sm">
                <div class="flex items-center space-x-3 overflow-hidden">
                  <img src="${product.featured_image?.url}" alt="${product.title}" class="w-12 h-12 rounded-md object-cover flex-shrink-0">
                  <div class="flex flex-col min-w-0">
                    <p class="text-sm text-gray-500 truncate">${product.vendor}</p>
                    <span class="text-gray-900 font-semibold truncate">${product.title}</span>
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
      } else if (suggestions.length === 0) {
        resultsHTML = `<div class="p-4 text-gray-500 text-center">No results found</div>`;
      }

      searchResults.innerHTML = resultsHTML;
      searchResults.classList.remove("hidden");

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
