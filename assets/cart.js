document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const line = button.getAttribute('data-line');

      if (!line) {
        console.error('Line number not found for cart item.');
        return;
      }

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            line: parseInt(line),
            quantity: 0
          })
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from cart.');
        }

        const updatedCart = await response.json();

        // تحديث واجهة المستخدم حسب حاجتك (reload أو إعادة بناء الكارت)
        window.location.reload(); // أو حدث الكارت بدون ريلود لو حابب

      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    });
  });
});
