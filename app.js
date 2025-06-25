// Carousel Logic

const images = document.querySelectorAll(".carousel-images img");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let current = 0;

function showImage(idx) {
  images.forEach((img, i) => {
    img.classList.toggle("active", i === idx);
  });
}

prevBtn.addEventListener("click", () => {
  current = (current - 1 + images.length) % images.length;
  showImage(current);
});

nextBtn.addEventListener("click", () => {
  current = (current + 1) % images.length;
  showImage(current);
});

setInterval(() => {
  current = (current + 1) % images.length;
  showImage(current);
  console.log(`Current image index: ${current}`);
}, 4000);

// Navbar blur effect Logic

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Menu Logic
const filterButtons = document.querySelectorAll(".menu-btn");
const menuItems = document.querySelectorAll(".menu-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-category");

    menuItems.forEach((menu_item) => {
      if (
        filter === "all" ||
        menu_item.getAttribute("data-category") === filter
      ) {
        menu_item.style.display = "block";
      } else {
        menu_item.style.display = "none";
      }
    });
    filterButtons.forEach((button) => button.classList.remove("active"));
    button.classList.add("active");
  });
});

// Contact form validation
const contactForm = document.querySelector(".contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  // name validation
  if (nameInput.value.trim() === "") {
    document.querySelector(".form-name-error").textContent =
      "Name is required.";
    document.querySelector(".form-name-error").style.display = "block";
    valid = false;
  } else if (nameInput.value.length < 3) {
    document.querySelector(".form-name-error").textContent =
      "Name must be at least 3 characters long.";
    document.querySelector(".form-name-error").style.display = "block";
    valid = false;
  } else {
    nameInput.classList.remove("form-error");
    document.querySelector(".form-name-error").style.display = "none";
    document.querySelector(".form-name-error").textContent = "";
  }

  if (emailInput.value.trim() === "") {
    document.querySelector(".form-email-error").textContent =
      "Email is required.";
    document.querySelector(".form-email-error").style.display = "block";
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
    document.querySelector(".form-email-error").textContent =
      "Invalid email format.";
    document.querySelector(".form-email-error").style.display = "block";
    valid = false;
  } else {
    emailInput.classList.remove("form-error");
    document.querySelector(".form-email-error").style.display = "none";
    document.querySelector(".form-email-error").textContent = "";
  }
});
