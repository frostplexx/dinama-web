/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", "assets/particles.json", function () {
	console.log("callback - particles.js config loaded");
});

window.onload = function () {

	//  ------------------  Typewriter  ------------------  //

	const traveler = document.querySelector("#title_traveler");
	const words = [
		"Explorer",
		"Voyager",
		"Adventurer",
		"Traveler",
		"Pioneer",
		"Discoverer",
		"Navigator",
		"Pathfinder",
		"Wayfarer",
		"Pilgrim",
		"Journeyer",
		"Wanderer",
		"Nomad",
		"Trekker",
		"Visitor",
	];
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

	let iterations = 0;
	traveler.innerHTML = words[Math.floor(Math.random() * words.length)];
	setInterval(() => {
		let newWord = words[Math.floor(Math.random() * words.length)];

		if (newWord === traveler.innerHTML) {
			newWord = words[Math.floor(Math.random() * words.length)];
		}

		const interval = setInterval(() => {
			traveler.innerHTML = newWord
				.split("")
				.map((letter, index) => {
					if (index < iterations) {
						return newWord[index];
					}
					return letters[Math.floor(Math.random() * letters.length)];
				})
				.join("");

			if (iterations > newWord.length) {
				clearInterval(interval);
				traveler.innerHTML = newWord;
			}
			iterations++;
		}, 50);
		iterations = 0;
	}, 5000);

	//  ------------------  Scroll Indicator  ------------------  //
	//hide the scroll indicator after the user has scrolled
	let scrollIndicator = document.querySelector(".scroll-indicator");
	// Listen for scroll events
	window.addEventListener("scroll", () => {
		// Check the current scroll position
		const scrollPosition = window.scrollY;

		// If the scroll position is greater than 0, fade out the scroll indicator
		if (scrollPosition > 0) {
			// linear interpolation of scroll distance between 1 and 0
			const opacity = 1 - Math.min(scrollPosition / 100, 1);
			scrollIndicator.style.opacity = opacity / 2;
		} else {
			// Otherwise, fade in the scroll indicator
			scrollIndicator.style.opacity = 0.5;
		}
	});

	//  ------------------  Header  ------------------  //
	//change the header active element if the user scrolled down to a section
	let headerLinks = document.querySelectorAll("header span");
	let headerLinksArray = Array.from(headerLinks);
	// Get the position of each section
	const sections = document.querySelectorAll(".section");
	const sectionPositions = Array.from(sections).map((section) => {
		return section.offsetTop;
	});
	// Listen for scroll events
	window.addEventListener("scroll", () => {
		// Get the current scroll position
		const scrollPosition = window.scrollY;
		// Find the section that is currently active
		const activeSection = sectionPositions.findIndex(
			(position) => {
				return scrollPosition - window.screen.height / 2 < position
		});
		// Remove the active class from all header links
		headerLinksArray.forEach((link) => link.classList.remove("active"));
		// Add the active class to the current section
		headerLinksArray[activeSection].classList.add("active");
	});
	//listen for clicks on the header links
	headerLinksArray.forEach((link) => {
		link.addEventListener("click", () => {
			//jump to the section
			let section = sections[headerLinksArray.indexOf(link)];
			let y = section.offsetTop;
			//get height of the section bottom border
			window.scrollTo({ top: y, behavior: "smooth" });
		});
	});


	// Star Background
	// Get the canvas element
	const canvas = document.querySelector("#particles-js");
	// Get the canvas context
	// move the canvas on scroll
	// set height of canvas to the height of the window
	window.addEventListener("scroll", () => {
		canvas.style.top = -(window.scrollY / 5)+ "px";
	}
	);
};
