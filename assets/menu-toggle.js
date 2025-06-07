document.addEventListener('DOMContentLoaded', function () {
    const accountToggle = document.getElementById('account-toggle');
    const accountMenu = document.getElementById('account-menu');
    const languageToggle = document.getElementById('language-toggle');
    const languageMenu = document.getElementById('language-menu');
  
    // Toggle account menu
    accountToggle.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent this click from closing the menu
      accountMenu.classList.toggle('hidden');
    });
  
    // Toggle language menu
    languageToggle.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent this click from closing the menu
      languageMenu.classList.toggle('hidden');
    });
  
    // Close both menus if clicked outside
    document.addEventListener('click', function () {
      accountMenu.classList.add('hidden');
      languageMenu.classList.add('hidden');
    });
  });