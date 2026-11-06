const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".contact-form .form-status");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const message = Object.fromEntries(new FormData(contactForm));
  try {
    const savedMessages = JSON.parse(localStorage.getItem("glowhaus-messages") || "[]");
    savedMessages.push({ ...message, submittedAt: new Date().toISOString() });
    localStorage.setItem("glowhaus-messages", JSON.stringify(savedMessages));
    formStatus.textContent = `Thanks, ${message.name}. Your message is saved on this device only.`;
    contactForm.reset();
  } catch {
    formStatus.textContent = "Your browser could not save this message. Please try again with local storage enabled.";
  }
});
