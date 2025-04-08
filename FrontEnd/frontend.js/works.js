async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    // On récupère la div galerie
    const gallery = document.querySelector('.gallery');

    // On vide la galerie au cas où
    gallery.innerHTML = '';

    // On boucle sur les travaux
    works.forEach(work => {
      // Création des éléments
      const figure = document.createElement('figure');

      const image = document.createElement('img');
      image.src = work.imageUrl;
      image.alt = work.title;

      const caption = document.createElement('figcaption');
      caption.innerText = work.title;

      // On assemble
      figure.appendChild(image);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

  } catch (error) {
    console.error("Erreur lors du fetch :", error);
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayCategoryButtons(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

function displayCategoryButtons(categories) {
  const filterContainer = document.querySelector('.filters');
  filterContainer.innerHTML = ''; // Vider avant de remplir

  // Créer le bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.textContent = "Tous";
  allBtn.dataset.id = 0;
  filterContainer.appendChild(allBtn);

  // Créer les autres boutons à partir des catégories
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category.name;
    btn.dataset.id = category.id;
    filterContainer.appendChild(btn);
  });

  // Ajouter les événements de clic
  setupFilters();
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const categoryId = parseInt(button.dataset.id);

      if (categoryId === 0) {
        displayWorks(allWorks); // Affiche tout
      } else {
        const filtered = allWorks.filter(work => work.categoryId === categoryId);
        displayWorks(filtered);
      }
    });
  });
}
getWorks();        // récupère les travaux
getCategories();   // récupère et affiche les boutons


  
