document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='search']");
  const searchBox = searchInput?.closest("form");

  let searchResults = document.getElementById("search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.id = "search-results";
    searchResults.className = "absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg hidden z-50";
    searchBox?.appendChild(searchResults);
  }

  // دالة لحساب المسافة الإملائية (Levenshtein)
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

  // جلب نتائج البحث
  async function fetchSearchResults(query) {
    if (!query.trim()) {
      searchResults.classList.add("hidden");
      return;
    }

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,article`);
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      const products = data.resources.results.products || [];

      let resultsHTML = "";

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
      } else {
        // إذا ما في نتائج، نحاول إيجاد اقتراح مشابه
        const allTitlesResponse = await fetch(`/search/suggest.json?q=a&resources[type]=product`);
        const allTitlesData = await allTitlesResponse.json();
        const allTitles = (allTitlesData.resources.results.products || []).map(p => p.title);

        let closestMatch = null;
        let minDistance = Infinity;
        for (let title of allTitles) {
          let dist = levenshtein(query.toLowerCase(), title.toLowerCase());
          if (dist < minDistance && dist <= 3) { // 3 = مسافة مسموحة للتصحيح
            minDistance = dist;
            closestMatch = title;
          }
        }

        if (closestMatch) {
          resultsHTML = `<div class="p-2 text-gray-500">Did you mean: 
            <span class="text-blue-600 cursor-pointer underline" id="suggested-term">${closestMatch}</span> ?
          </div>`;
        } else {
          resultsHTML = `<div class="p-2 text-gray-500">No results found</div>`;
        }
      }

      searchResults.innerHTML = resultsHTML;
      searchResults.classList.remove("hidden");

      // في حال ضغط المستخدم على الاقتراح
      const suggestedTerm = document.getElementById("suggested-term");
      if (suggestedTerm) {
        suggestedTerm.addEventListener("click", () => {
          searchInput.value = suggestedTerm.textContent;
          fetchSearchResults(suggestedTerm.textContent);
        });
      }

    } catch (error) {
      console.error("Error fetching search results:", error);
      searchResults.innerHTML = `<div class="p-2 text-red-500">Error fetching results</div>`;
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
