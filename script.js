const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const bookingDialog = document.querySelector(".booking-dialog");
const bookingForm = document.querySelector(".booking-form");
const formStatus = document.querySelector(".form-status");
const calendarLink = document.querySelector(".calendar-link");
const reviews = [
  { quote: "I walked in feeling a little frazzled and left feeling like the most relaxed version of myself. My skin looked lovely, but honestly, the whole hour was the real treat.", author: "JAMIE R." },
  { quote: "It was the first facial where I felt listened to instead of sold to. My skin feels calmer, and I finally have a routine I can actually keep up with.", author: "MORGAN T." },
  { quote: "The studio is beautiful, the people are kind, and I left with that rare feeling of being completely looked after. Already planning my next visit.", author: "ALEX P." }
];
let activeReview = 0;

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  siteNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.querySelectorAll("[data-book]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const service = trigger.dataset.service;
    if (service) bookingForm.elements.service.value = service;
    closeMenu();
    formStatus.textContent = "";
    calendarLink.hidden = true;
    bookingDialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => bookingDialog.close());
bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

const dateInput = bookingForm.elements.date;
const now = new Date();
const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
dateInput.min = localToday;

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const request = Object.fromEntries(new FormData(bookingForm));
  try {
    const savedRequests = JSON.parse(localStorage.getItem("glowhaus-requests") || "[]");
    savedRequests.push({ ...request, submittedAt: new Date().toISOString() });
    localStorage.setItem("glowhaus-requests", JSON.stringify(savedRequests));
    formStatus.textContent = `Thanks, ${request.name}. Your ${request.service} request for ${request.date} is saved on this device.`;
    const [year, month, day] = request.date.split("-").map(Number);
    const endDate = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10).replaceAll("-", "");
    const eventDate = request.date.replaceAll("-", "");
    const calendarParameters = new URLSearchParams({
      action: "TEMPLATE",
      text: `GlowHaus appointment request: ${request.service}`,
      dates: `${eventDate}/${endDate}`,
      details: "Appointment request only. Please contact the studio to confirm your visit."
    });
    calendarLink.href = `https://calendar.google.com/calendar/render?${calendarParameters}`;
    calendarLink.hidden = false;
    bookingForm.reset();
    dateInput.min = localToday;
  } catch {
    formStatus.textContent = "Your browser could not save this request. Please try again in a browser with local storage enabled.";
  }
});

function showReview(direction) {
  activeReview = (activeReview + direction + reviews.length) % reviews.length;
  document.querySelector(".testimonial-content h2").textContent = reviews[activeReview].quote;
  const author = document.querySelector("[data-review-author]");
  author.innerHTML = `${reviews[activeReview].author} <span class="author-location">· GLOWHAUS GUEST</span>`;
  document.querySelector("[data-review-count]").textContent = String(activeReview + 1).padStart(2, "0");
}

document.querySelector("[data-testimonial-prev]").addEventListener("click", () => showReview(-1));
document.querySelector("[data-testimonial-next]").addEventListener("click", () => showReview(1));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
