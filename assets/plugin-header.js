document.addEventListener("DOMContentLoaded", function () {
  /* ------------------------------
   * Sticky / Fixed Header Handling
   * ------------------------------ */
  const headerGroup = document.getElementById("header-group");
  const announcementBar = document.querySelector(".announcement-bar");
  const header = document.querySelector(".header");

  if (headerGroup) {
    const headerPosition = headerGroup.dataset.headerPosition; // نمرر القيمة من الليكويد

    if (headerPosition === "sticky") {
      if (typeof stickybits === "function") {
        stickybits("#header-group", { stickyBitStickyOffset: 0 });
      }

      if (announcementBar && header) {
        let lastScrollTop = 0;
        const barHeight = announcementBar.offsetHeight;

        window.addEventListener("scroll", function () {
          let scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

          if (scrollTop > lastScrollTop) {
            announcementBar.style.transform = `translateY(-${barHeight}px)`;
            header.style.transform = `translateY(-${barHeight}px)`;
          } else {
            announcementBar.style.transform = "translateY(0)";
            header.style.transform = "translateY(0)";
          }

          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
      }
    }

    if (headerPosition === "fixed") {
      headerGroup.style.position = "fixed";
      headerGroup.style.top = "0";
      headerGroup.style.width = "100%";
    }
  }

});
