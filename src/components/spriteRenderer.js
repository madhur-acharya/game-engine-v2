import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "../utilityFunctions.js";
import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import RenderPipeline from "../renderPipeline.js";

export class SpriteRenderer{

	constructor(layer, sprite, spriteX= 0, spriteY= 0, spriteWidth, spriteHeight, drawWidth, drawHeight)
	{
		this.layer= layer;
		this.type= "SpriteRenderer";
		this.ready= true;
		this.enabled= true;
		this.sprite= sprite;
		this.spriteX= spriteX;
		this.spriteY= spriteY;
		this.spriteWidth= spriteWidth;
		this.spriteHeight= spriteHeight;
		this.drawWidth= drawWidth;
		this.drawHeight= drawHeight;
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

		if(this.spriteWidth === undefined || this.spriteHeight === undefined)
		{
			this.spriteWidth= this.sprite.width;
			this.spriteHeight= this.sprite.height;
		}

		if(this.drawWidth === undefined) this.drawWidth= this.spriteWidth;
		if(this.drawHeight === undefined) this.drawHeight= this.spriteHeight;

		context.save();
		context.scale(1, -1);
		context.translate(this.drawX + (this.drawWidth/2), -(this.drawY + (this.drawHeight/2)));
		context.rotate(this.gameObject.rotation);
		context.drawImage(this.sprite, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, -this.drawWidth/2, -this.drawHeight/2, this.drawWidth, this.drawHeight);
		context.restore();
	}
};


