const data = require('./baza.js');
const names = Object.keys(data);

// For each name in the list, we create HTML elements for the presentation
const presentationElements = names.map((name) => {
  const crumbersWords = data[name].crumbers_words;

  // Creating HTML elements for each image
  const slideElements = Object.keys(crumbersWords).map((crumberWord, index) => {
    const slideNumber = index + 1;
    const imagePath = `../media/images/${name}/slide_${slideNumber}.jpeg`;
    const imageAlt = `${slideNumber} слайд в презентации '${name}'`;
    return `
      <div class="carousel-item${index === 0 ? ' active' : ''}">
        <img src="${imagePath}" class="d-block w-100" alt="${imageAlt}">
      </div>
    `;
  }).join('');

  //  Creating a common HTML element for the presentation
  return `
    <div id="collapse${name}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <div id="carouselExampleRide${name}" class="carousel slide carousel-fade" data-bs-ride="true">
          <div class="carousel-inner">
            ${slideElements}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide${name}" data-bs-slide="prev">
            <span class="bi bi-arrow-left-circle" style="font-size: 2rem; color: black;" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide${name}" data-bs-slide="next">
            <span class="bi bi-arrow-right-circle" style="font-size: 2rem; color: black;" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <br>
        <u>${name}</u> <em>${data[name].category}</em> <strong>description</strong>
      </div>
    </div>
  `;
}).join('');

// Inserting HTML elements of presentations into the document
const presentationContainer = document.getElementById('accordionExample');
presentationContainer.innerHTML = presentationElements;
