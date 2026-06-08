import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "../utilityFunctions.js";
import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import RenderPipeline from "../renderPipeline.js";
import Generic from "./generic.js";

export class TextRenderer extends Generic{

	constructor(layer, text, fontSize= "14px", fontFamily= "sans-serif", color= "grey")
	{
		super();
		this.layer= layer;
		this.type= "TextRenderer";
		this.ready= true;
		this.enabled= true;
		this.drawX= 0;
		this.drawY= 0;
		this.text= text;
		this.fontSize= fontSize;
		this.fontFamily= fontFamily;
		this.color= color;
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
		if(!this.enabled) return;

		this.drawX= this.gameObject.position.x;
		this.drawY= this.gameObject.position.y;

		const textWidth= context.measureText(this.text);

		context.save();
		context.scale(1, -1);
		context.translate(this.drawX - (window.width/2), this.drawY - (window.height/2));
		context.fillStyle= this.color;
		context.font= `${this.fontSize} ${this.fontFamily}`;
		context.fillText(this.text, 0, 0);
		context.restore();
	}
};


