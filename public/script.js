const navLinkEls = document.querySelectorAll(".nav-link");
const windowPathname = window.location.pathname;

navLinkEls.forEach((navLinkEl) => {
  const navLinkPathname = new URL(navLinkEl.href).pathname;

  if (
    windowPathname === navLinkPathname ||
    (windowPathname === "./index.html" && navLinkPathname === "/")
  ) {
    navLinkEl.classList.add("active");
  }
});

const slides = document.querySelectorAll(".slide");

let counter = 0;

// Position each slide
slides.forEach((slide, index) => {
  slide.style.left = `${index * 100}%`;
});

const goNext = () => {
  if (counter < slides.length - 1) {
    counter++;
    slideImage();
  }
};

const goPrev = () => {
  if (counter > 0) {
    counter--;
    slideImage();
  }
};

const slideImage = () => {
  slides.forEach((slide) => {
    slide.style.transform = `translateX(-${counter * 100}%)`;
  });
};

// Reset transitions for smaller screens
window.addEventListener("resize", () => {
  slides.forEach((slide) => {
    slide.style.transition =
      window.innerWidth < 768
        ? "transform 0.5s ease-in-out"
        : "transform 1s ease-in-out";
  });
});

const hamburgerMenu = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");

hamburgerMenu.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

function clearInput(inputId) {
  document.getElementById(inputId).value = "";
}

// function toggleDetail(button) {
//   const detail = button.nextElementSibling; // Get the next sibling (the hidden detail div)

//   if (detail.style.display === "none" || detail.style.display === "") {
//     detail.style.display = "block"; // Show the detail
//     button.classList.add("expanded"); // Rotate arrow
//   } else {
//     detail.style.display = "none"; // Hide the detail
//     button.classList.remove("expanded"); // Reset arrow rotation
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  // Select all the toggle buttons
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Get the associated detail section for this button
      const currentDetail = this.nextElementSibling;

      // Close all open detail sections except the clicked one
      document.querySelectorAll(".career-detail").forEach((detail) => {
        if (detail !== currentDetail) {
          detail.style.display = "none"; // Hide all other details
          const otherButton = detail.previousElementSibling; // Find the corresponding button
          if (otherButton) {
            otherButton.classList.remove("expanded"); // Remove rotation effect
          }
        }
      });

      // Toggle the current detail section
      if (currentDetail.style.display === "block") {
        currentDetail.style.display = "none"; // Close this detail
        this.classList.remove("expanded"); // Remove rotation effect
      } else {
        currentDetail.style.display = "block"; // Open this detail
        this.classList.add("expanded"); // Add rotation effect
      }
    });
  });
});
