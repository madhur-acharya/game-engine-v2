import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "../utilityFunctions.js";
import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import RenderPipeline from "../renderPipeline.js";

export class VGRenderer{
	constructor(layer, rendFunc)
	{
		this.type= "VGRenderer";
		this.enabled= true;
		this.layer= layer;

		if(isFunction(rendFunc))
			this.rendererFunction= rendFunc;
		else
			this.rendererFunction= () => {}
	}

	Setup(obj)
	{
		this.gameObject= obj;
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


