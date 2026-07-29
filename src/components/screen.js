import Generic from "./generic.js";

class Screen extends Generic{
	constructor(origin, width, height) {
		super();
		this.origin= origin;
		this.width= width;
		this.height= height;
	}

	setOrigin(vect) {
		this.origin= vect;
	}

	setSize(width, height) {
		this.width= width;
		this.height= height;
	}
}

export default Screen;