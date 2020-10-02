import {getRandomVector, isFunction} from "./utilityFunctions.js";

export class vectorRenderer{

	constructor(obj, update)
	{
		this.type= "vectorRenderer";

		if(isFunction(update))
			this.update= update;
		else
			this.update= () => {}
	}

}
