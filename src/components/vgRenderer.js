import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "../utilityFunctions.js";
import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import RenderPipeline from "../renderPipeline.js";
import Generic from "./generic.js";

export class VGRenderer extends Generic{
	constructor(gameObject, layer, rendFunc)
	{
		super();
		this.gameObject= gameObject;
		this.type= "VGRenderer";
		this.enabled= true;
		this.layer= layer;

		if(isFunction(rendFunc))
			this.rendererFunction= rendFunc;
		else
			this.rendererFunction= () => {}
	}

	Update()
	{
		RenderPipeline.DispatchDraw(this);
	}

	draw() 
	{
		this.rendererFunction(this.gameObject);
	}
}


