/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", "assets/particles.json", function () {
	console.log("callback - particles.js config loaded");
});


window.onload = function () {


	// Cursor

	const cursor = document.querySelector(".cursor");

	document.body.onpointermove = event => {
		const { clientX, clientY } = event;
		cursor.style.left = (clientX - 3)  + "px";
		cursor.style.top = (clientY - 3) + "px";
	}

	document.body.onclick = () => {
		cursor.animate([
			{ transform: "scale(1)" },
			{ transform: "scale(.5)" },
			{ transform: "scale(1)" }
		], {
			duration: 250,
			easing: "ease-out"
		});
	}


	// Title animation

	const traveler = document.querySelector("#title_traveler");
	const words = ["Explorer", "Voyager", "Adventurer", "Traveler", "Pioneer", "Discoverer", "Navigator", "Pathfinder", "Wayfarer", "Pilgrim", "Journeyer", "Wanderer", "Nomad", "Trekker", "Visitor"];
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

	let iterations = 0;
	traveler.innerHTML = words[Math.floor(Math.random() * words.length)];
	setInterval(() => {

		let newWord = words[Math.floor(Math.random() * words.length)];

		if (newWord === traveler.innerHTML) {
			newWord = words[Math.floor(Math.random() * words.length)];	
		}

		const interval = setInterval(() => {
			traveler.innerHTML = newWord.split("").map((letter, index) => {
				if(index < iterations){
					return newWord[index];
				}
				return letters[Math.floor(Math.random() * letters.length)
			]}).join("");

			if (iterations > newWord.length) {
				clearInterval(interval);
				traveler.innerHTML = newWord
			}
			iterations++;
		}, 50);
		iterations = 0;
	}, 5000);
	
}