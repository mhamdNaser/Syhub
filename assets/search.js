document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='search']");
  const searchBox = searchInput?.closest("form");
  
  // إنشاء عنصر لعرض النتائج إذا لم يكن موجود
  let searchResults = document.getElementById("search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.id = "search-results";
    searchResults.className = "absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg hidden z-50";
    searchBox?.appendChild(searchResults);
  }

  // جلب نتائج البحث
  async function fetchSearchResults(query) {
    if (!query.trim()) {
      searchResults.classList.add("hidden");
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,article`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      const products = data.resources.results.products || [];
      const collections = data.resources.results.collections || [];
      const vendors = data.resources.results.articles || [];

      let resultsHTML = "";

      // المنتجات
      if (products.length > 0) {
        resultsHTML += `
          <div class="mb-4">
            <h3 class="text-lg font-bold text-black mb-2">Products</h3>
            ${products.map(product => `
              <div class="p-2 border-b last:border-none">
                <a href="${product.url}" class="flex items-center hover:bg-gray-50 p-2 rounded">
                  <img src="${product.featured_image?.url}" alt="${product.title}" class="w-10 h-10 mr-2 object-cover rounded">
                  <div class="flex flex-col">
                    <p class="text-gray-500 text-sm truncate">${product.vendor}</p>
                    <span class="text-black font-medium">${product.title}</span>
                  </div>
                </a>
              </div>`).join("")}
          </div>`;
      }

      // المجموعات
      if (collections.length > 0) {
        resultsHTML += `
          <div class="mb-4">
            <h3 class="text-lg font-bold text-black mb-2">Collections</h3>
            ${collections.map(collection => `
              <div class="p-2 border-b last:border-none">
                <a href="${collection.url}" class="block hover:bg-gray-50 p-2 rounded">
                  ${collection.title}
                </a>
              </div>`).join("")}
          </div>`;
      }

      // البائعون
      if (vendors.length > 0) {
        resultsHTML += `
          <div class="mb-4">
            <h3 class="text-lg font-bold text-black mb-2">Vendors</h3>
            ${vendors.map(vendor => `
              <div class="p-2 border-b last:border-none">
                <a href="${vendor.url}" class="block hover:bg-gray-50 p-2 rounded">
                  ${vendor.title}
                </a>
              </div>`).join("")}
          </div>`;
      }

      searchResults.innerHTML = resultsHTML || `<div class="p-2 text-gray-500">No results found</div>`;
      searchResults.classList.remove("hidden");

    } catch (error) {
      console.error("Error fetching search results:", error);
      searchResults.innerHTML = `<div class="p-2 text-red-500">Error fetching results</div>`;
      searchResults.classList.remove("hidden");
    }
  }

  // الاستماع لمدخل البحث
  searchInput?.addEventListener("input", e => {
    fetchSearchResults(e.target.value);
  });

  // إخفاء النتائج عند النقر خارجها
  document.addEventListener("click", e => {
    if (!searchBox?.contains(e.target)) {
      searchResults.classList.add("hidden");
    }
  });
});
