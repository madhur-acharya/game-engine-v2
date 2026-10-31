import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "../utilityFunctions.js";
import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import RenderPipeline from "../renderPipeline.js";
import Generic from "./generic.js";

export class TextRenderer extends Generic{

	constructor(gameObject, layer, text, pos, fontSize= "16px", fontFamily= "sans-serif", color= "grey")
	{
		super();
		this.gameObject= gameObject;
		this.layer= layer;
		this.type= "TextRenderer";
		this.ready= true;
		this.enabled= true;
		this.position= pos ? pos : gameObject.position;
		this.trackGameObject= !pos;
		this.text= String(text);
		this.fontSize= fontSize;
		this.fontFamily= fontFamily;
		this.color= color;
	}

	Update()
	{
		RenderPipeline.DispatchDraw(this);
	}

	setText(txt) {
		this.text= txt;
	}

	getTextWidth(){
		return context.measureText(this.text).width;
	}

	setPos(pos) {
		this.position= pos;
	}

	draw()
	{
		if(!this.enabled) return;

		if(this.trackGameObject) {
			this.position= this.gameObject.position;
		}

		const textWidth= context.measureText(this.text);

		context.save();
		context.translate(this.position.x, this.position.y);
		context.fillStyle= this.color;
		context.font= `${this.fontSize} ${this.fontFamily}`;
		context.fillText(this.text, 0, 0);
		context.restore();
	}
};


