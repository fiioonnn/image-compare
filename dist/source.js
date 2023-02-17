class IMGCompare {
	constructor({ selector, tags, images, dynamicTags }) {
		this.selector = selector || false;
		this.images = images || null;
		this.tags = tags || [];
		// Local properties
		this.element = null;
		// States
		this.mouseDown = false;
		// Initialize
		this.init();
	}

	init() {
		// Check if a selctor is provided
		if (!this.selector) return this.error(102);
		// Check if images are provided
		if (!this.images?.before || !this.images?.after) return this.error(101);
		// Select the parent element
		this.element = document.querySelector(this.selector);
		// Check if the selector is valid and if an element can be found
		if (!this.element) return this.error(103);
		// Build the children DOM
		this.buildDOM();
		// Register all events
		this.registerEvents();
		// If tags are provided, enable them
		if (this.tags.length) {
			this.element.style.setProperty("--imgc-pseudo-content", "attr(data-tag)");
		}
		// Init animation
		setTimeout(() => {
			this.element.style.setProperty("--imgc-after-width", "50%");
			setTimeout(() => {
				this.element.style.setProperty("--imgc-transition-function", "ease");
			}, 100);
		}, 1000);
	}

	error(status) {
		switch (status) {
			case 103:
				console.error(`IMGCompare: Element not found: ${this.selector}`);
				break;
			case 102:
				console.error(`IMGCompare: No selector provided.`);
				break;
			case 101:
				console.error(`IMGCompare: No images provided.`);
				break;
			case 100:
				console.error(`IMGCompare: Unexpected error.`);
				break;
		}
	}

	buildDOM() {
		this.element.classList.add("image-compare");
		this.element.classList.add("image-compare--transition");
		this.element.innerHTML = `
			<div class="image-compare__before" ${
				this.tags ? `data-tag="${this.tags[0]}"` : ""
			}>
				<img src="${this.images.before}" alt="before" draggable="false" />
			</div>
			<div class="image-compare__after" ${
				this.tags ? `data-tag="${this.tags[1]}"` : ""
			}>
				<img src="${this.images.after}" alt="before" draggable="false" />
			</div>
			<div class="image-compare__thumb">
				<svg viewBox="0 0 24 24"><path d="M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z" /></svg>
			</div>
		`;
	}

	registerEvents() {
		let cursorX = 0;

		this.element.onmousedown = (e) => {
			this.element.style.setProperty("--imgc-after-width", cursorX + "px");
			this.element.classList.add("image-compare--transition");
			this.mouseDown = true;
			// Disable autoPlay for a amount of time after clicked
			this.autoPlayBlocked = true;
		};

		document.onmouseup = () => {
			this.element.classList.remove("image-compare--transition");
			this.mouseDown = false;
			// Reenable autoPlay after cooldown
			if (this.autoPlay) {
				this.autoPlayTimer = setTimeout(() => {
					this.autoPlayBlocked = false;
					this.doAutoPlay();
				}, this.autoPlayBlockCooldown);
			}
		};

		document.onmouseleave = () => {
			this.mouseDown = false;
		};

		document.onmousemove = (e) => {
			cursorX = e.pageX - this.element.offsetLeft;
			if (!this.mouseDown) return;
			this.element.classList.remove("image-compare--transition");
			this.element.style.setProperty("--imgc-after-width", cursorX + "px");

			if (cursorX < 0) {
				this.element.style.setProperty("--imgc-after-width", "0px");
			}

			if (cursorX > this.element.offsetWidth) {
				this.element.style.setProperty(
					"--imgc-after-width",
					this.element.offsetWidth + "px"
				);
			}
		};
	}
}

const imgCompare = new IMGCompare({
	selector: "#img-compare",
	images: {
		before: "example-before.jpg",
		after: "example-after.jpg",
	},
	tags: ["Vorher", "Nachher"],
	autoPlay: true,
	dynamicTags: false,
});
