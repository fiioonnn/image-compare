/**
 * Image Compare
 * Made by: fiioonnn@hph
 * Version: 1.1.0
 */

let version = "1.1.0";

const ImageCompare = function (props = {}) {
	this.elements = null;
	this.init = (e) => {
		this.elements = document.querySelectorAll(".image-compare");
		this.elements.forEach((element) => {
			this.registerEvents(element);
			let images = element.querySelectorAll("img");
			let thumb = element.querySelector(".image-compare__thumb");
			let tags = (thumb.onclick = (e) => {
				element.style.setProperty(
					"--imgc-transition-function",
					"cubic-bezier(0.47, 1.64, 0.41, 0.8)"
				);
				setTimeout(() => {
					element.style.setProperty("--imgc-transition-function", "ease");
				}, 100);
				element.classList.add("image-compare--transition");
				let cursorX = e.pageX - thumb.getBoundingClientRect().left;
				if (cursorX < thumb.offsetWidth / 2) {
					element.style.setProperty("--imgc-after-width", "0px");
				}
				if (cursorX > thumb.offsetWidth / 2) {
					element.style.setProperty("--imgc-after-width", "100%");
				}
			});
			thumb.innerHTML = `
				<svg viewBox="0 0 24 24"><path d="M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z" /></svg>
				`;
			images.forEach((image) => {
				image.setAttribute("draggable", "false");
			});
			setTimeout(() => {
				element.style.setProperty(
					"--imgc-transition-function",
					"cubic-bezier(0.47, 1.64, 0.41, 0.8)"
				);
				element.classList.add("image-compare--transition");
				element.style.setProperty("--imgc-after-width", "50%");
				setTimeout(() => {
					element.style.setProperty("--imgc-transition-function", "ease");
				}, 100);
			}, 1000);
		});
	};

	this.registerEvents = function (element) {
		let mouseDown = false;
		let cursorX = 0;

		document.onmouseup = () => {
			mouseDown = false;
		};

		element.onmousedown = (e) => {
			cursorX =
				((e.pageX - element.getBoundingClientRect().left) * 100) /
				element.offsetWidth;
			element.style.setProperty("--imgc-after-width", cursorX + "%");
			element.classList.add("image-compare--transition");
			mouseDown = true;
		};

		element.onmouseup = (e) => {
			element.classList.remove("image-compare--transition");
			mouseDown = false;
		};

		element.onmouseleave = () => {
			element.classList.remove("image-compare--transition");
			mouseDown = false;
		};

		element.onmousemove = (e) => {
			if (!mouseDown) return;
			cursorX =
				((e.pageX - element.getBoundingClientRect().left) * 100) /
				element.offsetWidth;

			element.style.setProperty("--imgc-after-width", cursorX + "%");
			element.classList.remove("image-compare--transition");
			if (cursorX <= 0) {
				element.style.setProperty("--imgc-after-width", "0%");
			}

			if (cursorX >= 100) {
				element.style.setProperty("--imgc-after-width", "100%");
			}
		};
	};
};

console.log("ImageCompare", version);

export default ImageCompare;
