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
      deleteBtn.dataset.id = work.id; //
      deleteBtn.classList.add("deleteIcon");
      deleteBtn.addEventListener("click", async (event) => {
        const token = localStorage.getItem("token");
        
        const workId = event.currentTarget.dataset.id; // Récupère l'ID de la photo à supprimer
        console.log("e.currentTarget:", event.currentTarget);
        try {
          const res = await fetch(`http://localhost:5678/api/works/${workId}`, {
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
  const addPhotoForm = document.getElementById("addPhotoForm");

  // Déplace le formulaire déjà écrit dans le HTML dans la modale
  modalBody.innerHTML = ""; // Vide ce qu’il y avait avant
  modalBody.appendChild(addPhotoForm);
  addPhotoForm.classList.remove("hidden"); // Affiche le formulaire

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
