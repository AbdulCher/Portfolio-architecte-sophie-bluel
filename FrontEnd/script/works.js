let allWorks = []; // Stocker tous les travaux ici

// Récupérer et afficher les travaux
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    localStorage.setItem("nom", "works") // Stockage dans localStorage

    allWorks = works; // Sauvegarde tous les travaux récupérés
    displayWorks(allWorks); // On les affiche tous au départ

  } catch (error) {
    console.error("Erreur lors du fetch des travaux :", error);
  }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; // On vide la galerie avant de remplir

  works.forEach(work => {
    const figure = document.createElement('figure');

    const image = document.createElement('img');
    image.src = work.imageUrl;
    image.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.innerText = work.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// Récupérer les catégories
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayCategoryButtons(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// Afficher des boutons catégories
function displayCategoryButtons(categories) {
  const filterContainer = document.querySelector('.filters');
  filterContainer.innerHTML = ''; // Vider le conteneur avant

  // Bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.textContent = "Tous";
  allBtn.dataset.id = 0;
  allBtn.classList.add("btnTous");
  allBtn.classList.add('active'); // Par défaut actif
  filterContainer.appendChild(allBtn);

  // Boutons des catégories
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category.name;
    btn.dataset.id = category.id;
    filterContainer.appendChild(btn);
  });

  setupFilters(); // Ajouter les événements de clic
}

// Gérer les clics sur les boutons
function setupFilters() {
  const buttons = document.querySelectorAll('.filters button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const categoryId = parseInt(button.dataset.id);

      // Affichage selon la catégorie
      if (categoryId === 0) {
        displayWorks(allWorks); // Affiche tout
      } else {
        const filtered = allWorks.filter(work => work.categoryId === categoryId);
        displayWorks(filtered);
        
      }

      // Mettre à jour les classes actives
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

// Appels départ
getWorks();       // Récupère et affiche les travaux
getCategories();  // Récupère et affiche les boutons catégories


