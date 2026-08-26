import {PrimaryKey} from "../utilityFunctions.js";

export default class Generic {
	name;

	constructor(){
		this.name= `${this.constructor?.name??"GAMEOBJ"}-${PrimaryKey.nextNumber()}`;
	}

	setName(name){
		this.name= name;
	}

};

