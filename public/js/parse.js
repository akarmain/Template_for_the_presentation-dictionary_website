// Function for creating cards
function createCard(presentationKey, presentationData) {
    return `<div class="col mb-3">
    <div class="card h-100 d-flex flex-column justify-content-between">
      <img src="media/presentations/${presentationKey.replace(/ /g, '_')}/slide_1.jpeg" class="card-img-top" alt="${presentationKey}">
      <div class="card-body d-flex flex-column justify-content-end">
        <h5 class="card-title">Topic: ${presentationData.category}</h5>
        <p class="card-text">${presentationKey}</p>
        <div class="mt-auto">
          <a href="all_presentations/${presentationKey}" class="btn btn-primary d-block mx-auto">view  <i class="bi bi-box-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </div>`;
}

// Loading data from baza.json
fetch('baza.json')
    .then(response => response.json())
    .then(presentations => {
        // Creating flashcards for all presentations
        let cards = '';
        let i = 0;
        for (const presentationKey in presentations) {
            const presentationData = presentations[presentationKey];
            if (i%3==0){
                cards += createCard(presentationKey, presentationData);
            }
            else{
                cards += createCard(presentationKey, presentationData);
            }
            i++;
        }
        // Adding cards to a page
        const cardsContainer = document.querySelector('#cards-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = cards;
        } else {
            console.error('The element could not be found #cards-container');
        }
    })
    .catch(error => {
        console.error('Error receiving data:', error);
    });
