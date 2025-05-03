                              // === GESTION DE LA MODALE === //

const modal = document.getElementById("modal");
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.querySelector(".modal-close");
const overlay = document.querySelector(".modal-overlay");

const modalGalleryView = document.getElementById("modal-gallery-view");
const addPhotoForm = document.getElementById("addPhotoForm");
const backIcon = document.querySelector(".back-to-gallery");
const showAddPhotoFormBtn = document.getElementById("show-add-photo-form");

// Ouvrir la modale
openBtn.addEventListener("click", () => {
  modal.classList.remove("modal-hidden");
  showGalleryView();
  loadGallery();
});

// Fermer la modale
function closeModal() {
  modal.classList.add("modal-hidden");
}
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Afficher la galerie
function showGalleryView() {
  modalGalleryView.classList.remove("hidden");
  addPhotoForm.classList.add("hidden");
}

// Afficher le formulaire
function showAddPhotoForm() {
  const modalGalleryView = document.getElementById("modal-gallery-view");
  const addPhotoForm = document.getElementById("addPhotoForm");
  const preview = document.getElementById("preview-image");
  const uploadText = document.getElementById("upload-text");
  const form = document.getElementById("add-photo-form");

  modalGalleryView.classList.add("hidden");
  addPhotoForm.classList.remove("hidden");

  // Reset image
  preview.src = "./assets/icons/image-placeholder.svg";
  
  // Réaffiche les textes
  uploadText.classList.remove("hidden-upload-text");

  // Reset du formulaire complet
  form.reset();

  fetchCategories();
  handleImagePreview();
  setupFormValidation();
}

// Navigation
showAddPhotoFormBtn.addEventListener("click", showAddPhotoForm);
backIcon.addEventListener("click", () => {
  showGalleryView();
  loadGallery(); // Recharge la galerie si un projet a été ajouté
});

                              // === GESTION DE LA GALERIE === //

async function loadGallery() {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = ""; // Vide la galerie

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    works.forEach((work) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.classList.add("delete-icon");
      deleteBtn.dataset.id = work.id;

      deleteBtn.addEventListener("click", async (e) => {
        const workId = e.currentTarget.dataset.id;
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.ok) {
            figure.remove(); // Retire visuellement
          } else {
            alert("Erreur lors de la suppression");
          }
        } catch (err) {
          console.error("Erreur:", err);
        }
      });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      modalGallery.appendChild(figure);
    });
  } catch (err) {
    console.error("Erreur de chargement des travaux :", err);
  }
}


                            // === GESTION DU FORMULAIRE === //

function handleImagePreview() {
  const input = document.getElementById("image");
  const preview = document.getElementById("preview-image");
  const uploadText = document.getElementById("upload-text");

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block"; // Montre l'image
      uploadText.classList.add("hidden-upload-text"); // Cache label + paragraphe
    }
  });
}

// Fonction de validation du formulaire
function setupFormValidation() {
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector(".btn-valider");

  // Vérification du formulaire
  function checkFormValidity() {
    const imageFilled = imageInput.files.length > 0;
    const titleFilled = titleInput.value.trim() !== "";
    const categoryFilled = categorySelect.value !== "";

    if (imageFilled && titleFilled && categoryFilled) {
      submitButton.disabled = false;
      submitButton.classList.add("active");
    } else {
      submitButton.disabled = true;
      submitButton.classList.remove("active");
    }
  }

  imageInput.addEventListener("change", checkFormValidity);
  titleInput.addEventListener("input", checkFormValidity);
  categorySelect.addEventListener("change", checkFormValidity);

  checkFormValidity(); // Vérifie au chargement
}

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  const select = document.getElementById("category");

  select.innerHTML = '<option value="">Sélectionner</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// ENVOI DU FORMULAIRE
function handlePhotoSubmit() {
  const form = document.getElementById("add-photo-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert("Photo ajoutée !");
        form.reset();
        document.getElementById("preview-image").src = "./assets/icons/image-placeholder.svg";
        showGalleryView();
        loadGallery();
      } else {
        alert("Erreur lors de l’ajout");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  });
}

// Lancer au chargement
handlePhotoSubmit();
