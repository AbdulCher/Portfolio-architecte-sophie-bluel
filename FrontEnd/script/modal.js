//AJOUT DE LA FENETRE MODALE

const openBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".modal-close"); // 
const overlay = document.querySelector(".modal-overlay");

//GESTION APPARITION ET DISPARITION MODALE

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

// GESTION DE L'AJOUT ET DE LA SUPPRESSION DE PROJET

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

// Suppression avec l'icône photo

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.dataset.id = work.id; //
      deleteBtn.classList.add("deleteIcon");

      //Ajoute écouteur d'évènement sur le bouton de suppression
      deleteBtn.addEventListener("click", async (event) => { 
        const token = localStorage.getItem("token"); //Récupère token
        const workId = event.currentTarget.dataset.id; // Identifie la cible, l'ID de la photo à supprimer
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

//Affichage formulaire d'ajout de projet de la modale

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
  setupFormValidation();
}



// Fonction pour activer le bouton valider quand les champs du formulaire sont remplis
function setupFormValidation() {
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector(".btn-valider");

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

  // Appel initial au cas où certains champs seraient déjà remplis
  checkFormValidity();
}


async function fetchCategories() {
  select.innerHTML = "";
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

//Fonction pour voir l'mage choisi dans le champ fichier
function handleImagePreview() {
  //accède au premier fichier sélectionné dans le champ input
  const input = document.getElementById("image"); 
  const preview = document.getElementById("preview-image");

//écoute l'événement "change" sur le champ fichie
  input.addEventListener("change", () => { 
    const file = input.files[0];
    //vérifie qu’un fichier a bien été sélectionné
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
  
}

//ENVOIE NOUVEAU PROJET AU BACKEND VIA FORMULAIRE MODALE

function handlePhotoSubmit() {
  const form = document.getElementById("add-photo-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData(form);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST", // verbe http pour désigner l'opération demandée par la requête
      headers: {
        Authorization: `Bearer ${token}`
      }, // Format de la charge utile
      body: formData //Charge utile => données que le serveur utilise pour traiter la requête
    });

    if (response.ok) {
      confirm("Photo ajoutée !");
      form.reset();
      document.getElementById("imagePreview").style.display = "none";
      loadGallery(); // recharge la galerie
    } else {
      alert("Erreur lors de l’ajout");
    }
  });
}

//Gestion de rediriger l'utilisatueur via l'icône back
const backIcon = document.querySelector(".backToGallery");
backIcon.addEventListener("click", () => {
  const modalBody = document.getElementById("modalBody");

  // On reconstruit proprement la vue Galerie
  modalBody.innerHTML = `
    <div id="modalGalleryView">
      <h2 class="modalTitle">Galerie photo</h2>
      <div id="modal-gallery"></div>
      <button id="showAddPhotoForm">Ajouter une photo</button>
    </div>
  `;

  // Recharge les images
  loadGallery();

  // Reconnecte le bouton "Ajouter une photo"
  const showAddPhotoForm = document.getElementById("showAddPhotoForm");
  showAddPhotoForm.addEventListener("click", displayAddPhotoForm);

  // Reconnecte la fermeture de la modale si nécessaire
  const closeBtn = document.querySelector(".modal-close");
  const overlay = document.querySelector(".modal-overlay");

  closeBtn.addEventListener("click", () => {
    modal.classList.add("modal-hidden");
  });

  overlay.addEventListener("click", () => {
    modal.classList.add("modal-hidden");
  });
});