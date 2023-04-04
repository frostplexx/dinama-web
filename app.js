/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", "assets/particles.json", function () {
	console.log("callback - particles.js config loaded");
});


window.onload = function () {
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
}