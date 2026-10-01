import {PrimaryKey} from "../utilityFunctions.js";
import Vector from "../vector.js";

export default class Generic {
	name;
	screen;

	constructor(pos){
		this.name= `${this.constructor?.name??"GAMEOBJ"}-${PrimaryKey.nextNumber()}`;
		this.screen= window.defaultScreen;
		this.layer= 0;
	}

	setName(name){
		this.name= name;
	}

	setScreen(screen){
		this.screen= screen;
	}
};

