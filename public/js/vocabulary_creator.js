async function loadJSON(url) {
	// Waiting for a response from the server and uploading data in JSON format
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

// 

// Function for getting unique category values
function getUniqueCategories(data) {
	// Use Set to store unique categories
	const categories = new Set();
	for (const key in data) {
		categories.add(data[key].category);
	}
	return Array.from(categories);
}

// Function for creating option elements
function createOptionElements(categories) {
	// Creating a select element and assigning attributes to it
	const selectElement = document.createElement("select");
	selectElement.classList.add("form-select");
	selectElement.setAttribute("id", "category-select");
	selectElement.setAttribute("aria-label", "Default select example");
	// Creating an option element for all categories
	const allCategoriesOption = document.createElement("option");
	allCategoriesOption.setAttribute("value", "all");
	allCategoriesOption.textContent = "All categories";
	selectElement.appendChild(allCategoriesOption);

	// Sort the categories and create option elements for each category
	categories.sort();
	categories.forEach((category) => {
		const option = document.createElement("option");

		option.setAttribute("value", category.toLowerCase().replace(/\s+/g, "-"));
		option.textContent = category;
		selectElement.appendChild(option);
	});
	return selectElement;
}

async function createCategorySelect() {
	const data = await loadJSON("./baza.json");
	const uniqueCategories = getUniqueCategories(data);
	const categorySelect = createOptionElements(uniqueCategories);

	const divElement = document.getElementById("category-select");
	divElement.appendChild(categorySelect);
}

async function fetchWords() {
	const response = await fetch("./baza.json");
	const data = await response.json();
	return data;
}

// Function for grouping words by the first letter
function groupWordsByFirstLetter(data) {
	const words = {};

	for (const key in data) {
		for (const word in data[key].crumbers_words) {
			const firstLetter = word[0].toUpperCase();
			if (!words[firstLetter]) {
				words[firstLetter] = [];
			}
			words[firstLetter].push({ word: word, category: data[key].category });
		}
	}

	return words;
}

// A function for creating an HTML table with grouping of words by the first letter
function generateHTMLTable(wordsGrouped) {
	const wordsTable = document.getElementById("wordsTable");
	for (const firstLetter in wordsGrouped) {
		const row = document.createElement("tr");
		const letterCell = document.createElement("td");
		const wordsCell = document.createElement("td");

		letterCell.innerHTML = `<b>${firstLetter}</b>`;
		row.appendChild(letterCell);

		for (const wordObj of wordsGrouped[firstLetter]) {
			const wordParagraph = document.createElement("p");
			wordParagraph.innerHTML = `<a href="#" class="link-primary" data-category="${wordObj.category}">${wordObj.word}</a>`;
			wordsCell.appendChild(wordParagraph);
		}
		row.appendChild(wordsCell);
		wordsTable.appendChild(row);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// Creating a drop-down list of categories
	createCategorySelect();
	const categorySelect = document.getElementById("category-select");
	const tableRows = document.querySelectorAll("table tbody tr");
	categorySelect.addEventListener("change", (event) => {
		const selectedCategory = event.target.value;
		let visibleElementsCount = 0;

		// Iterating through all the rows of the table
		tableRows.forEach((row) => {
			const buttons = row.querySelectorAll("button");
			console.log(buttons);

			// Iterate through all the buttons in the row
			buttons.forEach((button) => {
				// row.querySelector("button").id.toLowerCase();
				const button_id = button.id.toLowerCase();
				console.log(button_id);
				// If the text in the input field is empty or the word starts with the text in the input field,
				// then we show the button, otherwise we hide it
				if (selectedCategory === "all" || selectedCategory === button_id) {
					fadeIn(button);
					visibleElementsCount++;
				} else {
					fadeOut(button);
				}
			});
		});
	});
});

// // My implementation of the built search engine
document.addEventListener("DOMContentLoaded", () => {
	const searchInput = document.getElementById("search-input");
	const tableRows = document.querySelectorAll("table tbody tr");
	const notFoundMessage = document.createElement("h4");
	notFoundMessage.textContent = "404: 😞";
	notFoundMessage.style.display = "none";
	document.querySelector("main").appendChild(notFoundMessage);
	searchInput.addEventListener("input", (event) => {
		const searchText = event.target.value.toLowerCase();
		let visibleElementsCount = 0;
		// Iterating through all the rows of the table
		tableRows.forEach((row) => {
			const buttons = row.querySelectorAll("button");
			let visibleButtonsCount = 0;
			// Iterate through all the buttons in the row
			buttons.forEach((button) => {
				const buttonWord = button.textContent.trim().toLowerCase();
				if (searchText === "" || buttonWord.startsWith(searchText)) {
					fadeIn(button);
					visibleButtonsCount++;
				} else {
					fadeOut(button);
				}
			});
			if (visibleButtonsCount > 0) {
				fadeIn(row);
				visibleElementsCount++;
			} else {
				fadeOut(row);
			}
		});
		// If there are no visible elements, then we show an error message, otherwise we hide
		if (visibleElementsCount === 0) {
			fadeIn(notFoundMessage);
		} else {
			fadeOut(notFoundMessage);
		}
	});
});

// Function for the smooth disappearance of the element
function fadeOut(element) {
	let opacity = 1;
	console.log(element.style);
	if (
		element.classList.contains("carousel-control-prev") ||
		element.classList.contains("carousel-control-next") ||
		element.classList.contains("btn-close")
	) {
		return;
	}
	const fadeEffect = setInterval(() => {
		if (opacity <= 0.1) {
			clearInterval(fadeEffect);
			element.style.display = "none";
		} else {
			opacity -= 0.1;
			element.style.opacity = opacity;
		}
	}, 50);
}

// Function for smooth appearance of the element
function fadeIn(element) {
	let opacity = 0;

	element.style.display = "";
	const fadeEffect = setInterval(() => {
		if (opacity >= 1) {
			clearInterval(fadeEffect);
		} else {
			opacity += 0.1;
			element.style.opacity = opacity;
		}
	}, 50);
}
