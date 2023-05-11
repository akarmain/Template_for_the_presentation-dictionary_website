const { publicDecrypt } = require("crypto");
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get(["/", "/index"], (req, res) => {
	res.render("index", { activePage: "index" });
});

app.get("/all_presentations", (req, res) => {
	res.render("all_presentations", { activePage: "all_presentations" });
});

app.get("/general_vocabulary", (req, res) => {
	const rawData = fs.readFileSync("public/baza.json", "utf8");
	const data = JSON.parse(rawData);
	let crumbers = [];

	for (const key in data) {
		const author = key;
		if (data[key].hasOwnProperty("crumbers_words")) {
			const crumbers_words = data[key].crumbers_words;
			const category = data[key].category;
			for (const word in crumbers_words) {
				const slides = crumbers_words[word];
				crumbers.push({ word, category, author, slides });
			}
		}
	}

	const all_keys_authors = Object.keys(data);
	// Sorting A-Z A-Z if LANG=ru_RU.UTF-8 is installed on the server
	// crumbers.sort((a, b) => a.word.localeCompare(b.word));

	// Sorting A-Z A-Z if LANG=ru_RU.UTF-8 is NOT installed on the server
	crumbers.sort((a, b) => {
		const firstLetterComparison = a.word[0].localeCompare(b.word[0], "ru", {
			sensitivity: "base",
		});
		if (firstLetterComparison === 0) {
			return a.word.localeCompare(b.word, "ru", { sensitivity: "base" });
		}
		return firstLetterComparison;
	});
	let groupedCrumbers = {};
	console.log(crumbers);

	for (const crumber of crumbers) {
		const firstLetter = crumber.word[0].toUpperCase();
		if (!groupedCrumbers[firstLetter]) {
			groupedCrumbers[firstLetter] = [];
		}
		groupedCrumbers[firstLetter].push(crumber);
	}
	res.render("general_vocabulary", {
		groupedCrumbers: groupedCrumbers,
		activePage: "general_vocabulary",
		all_keys_authors: all_keys_authors,
		crumbers: crumbers,
		data,
	});
});

app.get("/test", (reg, res) => {
	res.render("./test");
});

app.get("/all_presentations/:author", (req, res) => {
	const author = req.params.author;
	// Reading the contents of the baza.json file
	fs.readFile("public/baza.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).send("Ошибка чтения файла baza.json");
		}
		const baza = JSON.parse(data);
		// Checking the presence of the author in the database
		if (baza.hasOwnProperty(author)) {
			// Getting the number_slides value for this author
			const numberSlides = baza[author].number_slides;
			const extension = baza[author].extension;
			// Sending data to the template for display
			res.render("viewing_presentation", {
				activePage: "all_presentations",
				author: author,
				extension: extension,
				numberSlides: numberSlides,
			});
		} else if (author === "general_vocabulary") {
			res.redirect("../general_vocabulary");
		} else if (author === "index") {
			res.redirect("../index");
		} else if (author === "all_presentations") {
			res.redirect("../all_presentations");
		} else {
			res.status(404).send("Автор не найден");
		}
	});
});

app.listen(PORT, () => {
	console.log("см. тут: http://localhost:" + PORT);
});
