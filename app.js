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
}, 4000);

// Navbar blur effect Logic

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".header");
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
const contactForm = document.querySelector(".reachus-form");
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
  // email validation
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
  // message validation
  if (messageInput.value.trim() === "") {
    document.querySelector(".form-message-error").textContent =
      "Message is required.";
    document.querySelector(".form-message-error").style.display = "block";
    valid = false;
  } else if (messageInput.value.length < 10) {
    document.querySelector(".form-message-error").textContent =
      "Message must be at least 10 characters long.";
    document.querySelector(".form-message-error").style.display = "block";
    valid = false;
  } else {
    messageInput.classList.remove("form-error");
    document.querySelector(".form-message-error").style.display = "none";
    document.querySelector(".form-message-error").textContent = "";
  }

  // If all validations pass, submit the form
  if (valid) {
    const formData = new FormData(contactForm);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    contactForm.reset();
    alert("form submitted successfully");
  }
});

// To change color of navbar links on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // adjust for header height
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentSectionId)) {
      link.classList.add("active");
    }
  });
});

// MODAL LOGIC
window.addEventListener("DOMContentLoaded", function () {
  const isVisited = localStorage.getItem("brewery-visited");
  const viewportWidth = window.innerWidth;

  if (!isVisited && viewportWidth >= 900) {
    const modal = document.getElementById("welcome-modal");
    const signupBtn = document.getElementById("signup-btn");
    const skipBtn = document.getElementById("skip-btn");
    localStorage.setItem("brewery-visited", "true");
    // display the modal
    modal.style.display = "block";
    // close modal function
    function closeModal() {
      modal.style.display = "none";
    }

    signupBtn.addEventListener("click", closeModal);
    skipBtn.addEventListener("click", closeModal);
  } else if (!isVisited && viewportWidth < 900) {
    localStorage.setItem("brewery-visited", "true");
  }
});

// SIDEBAR LOGIC
const hamburger = document.querySelector(".hamburger");
const sidebar = document.getElementById("sidebar");
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
// Close sidebar when clicking outside
document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
    sidebar.classList.remove("active");
  }
});
// Close sidebar when clicking on a link
const sidebarLinks = document.querySelectorAll(".sidebar-links a");
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });
});
