const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Function to fetch search results
async function fetchSearchResults(query) {
  if (!query.trim()) {
    searchResults.classList.add("hidden"); // Hide results if query is empty
    return;
  }

  try {
    const response = await fetch(
      `/search/suggest.json?q=${encodeURIComponent(
        query
      )}&resources[type]=product,collection,article`
    );
    if (!response.ok) throw new Error("Failed to fetch search results");

    const data = await response.json();
    const products = data.resources.results.products || [];
    const collections = data.resources.results.collections || [];
    const vendors = data.resources.results.articles || []; // Vendors treated as articles

    // Build results HTML
    let resultsHTML = "";

    // Products section
    if (products.length > 0) {
      resultsHTML += `<div class="mb-4">
                        <h3 class="text-lg font-bold text-black mb-2">Products</h3>
                        ${products
                          .map(
                            (product) =>
                              `<div class="p-2 border-b last:border-none">
                                 <a href="${product.url}" class="text-blue-600 hover:underline flex items-center">
                                   <img src="${product.featured_image.url}" alt="${product.title}" class="w-10 h-10 inline-block mr-2">
                                    <div class="flex flex-col">
                                     <p class="text-gray-600 text-sm truncate w-full">
                                        ${product.vendor}
                                      </p>
                                      <span class="text-black">${product.title}</span>
                                    </div>
                                 </a>
                               </div>`
                          )
                          .join("")}
                      </div>`;
    }

    // Collections section
    if (collections.length > 0) {
      resultsHTML += `<div class="mb-4">
                        <h3 class="text-lg font-bold text-black mb-2">Collections</h3>
                        ${collections
                          .map(
                            (collection) =>
                              `<div class="p-2 border-b last:border-none">
                                 <a href="${collection.url}" class="text-blue-600 hover:underline">
                                   ${collection.title}
                                 </a>
                               </div>`
                          )
                          .join("")}
                      </div>`;
    }

    // Vendors section
    if (vendors.length > 0) {
      resultsHTML += `<div class="mb-4">
                        <h3 class="text-lg font-bold text-black mb-2">Vendors</h3>
                        ${vendors
                          .map(
                            (vendor) =>
                              `<div class="p-2 border-b last:border-none">
                                 <a href="${vendor.url}" class="text-blue-600 hover:underline">
                                   ${vendor.title}
                                 </a>
                               </div>`
                          )
                          .join("")}
                      </div>`;
    }

    searchResults.innerHTML =
      resultsHTML || '<div class="p-2 text-gray-500">No results found</div>';
    searchResults.classList.remove("hidden"); // Show results
  } catch (error) {
    console.error("Error fetching search results:", error);
    searchResults.innerHTML =
      '<div class="p-2 text-red-500">Error fetching results</div>';
    searchResults.classList.remove("hidden"); // Show error message
  }
}

// Event listener for search input
searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  fetchSearchResults(query);
});

// Hide results when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("search-box").contains(e.target)) {
    searchResults.classList.add("hidden");
  }
});