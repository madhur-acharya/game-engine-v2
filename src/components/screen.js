import Generic from "./generic.js";

export class Screen extends Generic{
	constructor(origin, width, height) {
		super();
		this.key;
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

export class ScreenManager{
	static screens={};
	static DEFAULT= "ZDEFAULT";

	static getLength= () => {
		return Object.keys(ScreenManager.screens).length;
	};

	static init= (scrn) => {
		scrn.key= ScreenManager.DEFAULT;
		ScreenManager.screens[ScreenManager.DEFAULT]= scrn;
	};

	static setDefault= (name) => {
		if(ScreenManager.screens[name]){
			ScreenManager.screens[ScreenManager.DEFAULT]= ScreenManager.screens[name];
			// delete ScreenManager.screens[name];
		}
	};

	static getDefault= () => ScreenManager.screens[ScreenManager.DEFAULT];

	static addScreen= (name, scrn) => {
		scrn.key= name;
		ScreenManager.screens[name]= scrn;
		return ScreenManager.screens[name];
	};

	static removeScreen= (name) => {
		delete ScreenManager.screens[name];
	};
};

export default ScreenManager;

