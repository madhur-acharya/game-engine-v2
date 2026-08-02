import {PrimaryKey} from "../utilityFunctions.js";

export default class Generic {
	name;
	screen;

	constructor(){
		this.name= `${this.constructor?.name??"GAMEOBJ"}-${PrimaryKey.nextNumber()}`;
		this.screen= window.defaultScreen;
	}

	setName(name){
		this.name= name;
	}

	setScreen(screen){
		this.screen= screen;
	}
};

