document.addEventListener('DOMContentLoaded', function () {
  const undoContainer = document.getElementById('undo-container');
  const undoButton = document.getElementById('undo-button');
  const undoTimer = document.getElementById('undo-timer');
  let undoTimeout;
  let removedItem = null;

  document.querySelectorAll('a[data-remove]').forEach((deleteButton) => {
    deleteButton.addEventListener('click', function (event) {
      event.preventDefault();

      const itemKey = this.getAttribute('data-key');
      const lineIndex = this.getAttribute('data-line');
      removedItem = { key: itemKey, line: lineIndex };

      if (window.enable_cart_drawer_undo_remove) {
        undoContainer.style.display = 'flex';

        let countdown = window.enable_cart_drawer_undo_remove_delay
          ? window.cart_drawer_undo_remove_delay
          : 5;

        undoTimer.textContent = `(${countdown}s)`;

        undoTimeout = setInterval(() => {
          countdown--;
          undoTimer.textContent = `(${countdown}s)`;
          if (countdown <= 0) {
            clearInterval(undoTimeout);
            finalizeRemove();
          }
        }, 1000);
      } else {
        finalizeRemove();
      }
    });
  });

  undoButton.addEventListener('click', function () {
    clearInterval(undoTimeout);
    undoContainer.style.display = 'none';
    removedItem = null;
  });

  function finalizeRemove() {
    if (removedItem) {
      window.location.href = `/cart/change?line=${removedItem.line}&quantity=0`;
    }
  }
});
