
window.onload = function () {

	let carousel = document.querySelector(".slider");
	let children = carousel.children;

	// add fade effect to the first slide
	children[0].classList.add("fade");
	children[2].classList.add("smaller");
}