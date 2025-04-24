const openBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".modal-close"); // ✅ corrigé ici
const overlay = document.querySelector(".modal-overlay");

// Ouvrir la modale
openBtn.addEventListener("click", () => {
  modal.classList.remove("modal-hidden");
  loadGallery(); // Appel ici pour afficher les photos
});

// Fermer en cliquant sur la croix
closeBtn.addEventListener("click", () => {
  modal.classList.add("modal-hidden");
});

// Fermer en cliquant sur le fond d'écran
overlay.addEventListener("click", () => {
  modal.classList.add("modal-hidden");
});

async function loadGallery() {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = ""; // Vide la galerie à chaque ouverture

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
      deleteBtn.classList.add("deleteIcon");

      deleteBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(`http://localhost:5678/api/works`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            figure.remove(); // Supprime visuellement la photo
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
  } catch (error) {
    console.error("Erreur de chargement des travaux :", error);
  }
}

const showAddPhotoFormBtn = document.getElementById("showAddPhotoForm");
showAddPhotoFormBtn.addEventListener("click", displayAddPhotoForm);

function displayAddPhotoForm() {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
  <h2 class="modalTitle">Ajouter une photo</h2>
  <form class="add-photo-form">
    <div class="upload-area">
      <img id="preview-image" src="./assets/icons/image-placeholder.svg" alt="Aperçu">
      <label for="image" class="upload-label">+ Ajouter photo</label>
      <input type="file" id="image" name="image" accept="image/*" hidden required>
      <p class="upload-info">jpg, png : 4mo max</p>
    </div>

    <label for="title">Titre</label>
    <input type="text" id="title" name="title" required>

    <label for="category">Catégorie</label>
    <select id="category" name="category" required>
      <option value="">Sélectionner</option>
      <option value="1">Objets</option>
      <option value="2">Appartements</option>
      <option value="3">Hôtels & restaurants</option>
    </select>

    <hr>
    <button type="submit" class="btn-valider">Valider</button>
  </form>

  `;

  fetchCategories();
  handleImagePreview();
  handlePhotoSubmit();
}

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  const select = document.getElementById("category");
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function handleImagePreview() {
  const input = document.getElementById("image");
  const preview = document.getElementById("preview-image");

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
}

function handlePhotoSubmit() {
  const form = document.getElementById("add-photo-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData(form);

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
      document.getElementById("imagePreview").style.display = "none";
      loadGallery(); // recharge la galerie
    } else {
      alert("Erreur lors de l’ajout");
    }
  });
}
