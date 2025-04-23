const openBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-modal");
const overlay = document.querySelector(".modal-overlay");
const imageModalContent = document.querySelector("modal-content")

// Ouvrir la modale
  openBtn.addEventListener("click", () => {
  modal.classList.remove("modal-hidden");
});

// Fermer en cliquant sur la croix
 closeBtn.addEventListener("click", () => {
  modal.classList.add("modal-hidden");
});

// Fermer en cliquant en dehors de la modale
  overlay.addEventListener("click", () => {
  modal.classList.add("modal-hidden");
});


