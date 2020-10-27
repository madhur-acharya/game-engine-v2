import {getRandomVector, isFunction, drawBoundingCircle, Circle2CircleCollision, box2BoxCollision, drawVector} from "./utilityFunctions.js";
import Vector from "./vector.js";
import {GameObject} from "./gameObject.js";

export const VGRenderer= (() => {

	const VGRenderList= {};

	class VGRenderer{

		constructor(renderer)
		{
			this.type= "VGRenderer";
			this.enabled= true;

			if(isFunction(renderer))
				this.renderer= renderer;
			else
				this.renderer= () => {}
		}

		Start(obj)
		{
			this.gameObject= obj;
			this.ReAssignLayer();
		}

		ReAssignLayer()
		{
			if(this.gameObject.layer in VGRenderList)
			{
				VGRenderList[this.gameObject.layer]= VGRenderList[this.gameObject.layer].splice(this.gameObject.layerIndex, 0, this);
			}
			else
			{
				VGRenderList[this.gameObject.layer]= [this];
			}
		}

		Update()
		{
			if(!this.enabled) return;
			this.renderer(this.gameObject);
		}

		static render()
		{
			for(let layer in VGRenderList)
			{
				for(let i= 0; i < VGRenderList[layer].length; i++)
				{
					VGRenderList[layer][i].Update();
				}
			}
		}
	}

	return VGRenderer;

})();

export const SpriteRenderer= (() => {

	const spriteRenderList= {};

	class SpriteRenderer{

		constructor(sprite, spriteX= 0, spriteY= 0, spriteWidth, spriteHeight, drawWidth, drawHeight)
		{
			/*
				spriteX= start of selection;
				spriteY= end of selection;
				spriteWidth= width of selection;
				spriteHeight= height of selection;
				drawX= x pos to draw on canvas;
				drawY= y pos to draw on canvas;
				drawWidth= width of sprite on canvas;
				drawHeight= height of sprite on canvas;
			*/

			this.type= "SpriteRenderer";
			this.enabled= true;
			this.sprite= sprite;
			this.spriteX= spriteX;
			this.spriteY= spriteY;
			this.spriteWidth= spriteWidth;
			this.spriteHeight= spriteHeight;
			this.drawWidth= drawWidth;
			this.drawHeight= drawHeight;
		}

		Start(obj)
		{
			this.gameObject= obj;
			this.ReAssignLayer();
		}

		ReAssignLayer()
		{
			if(this.gameObject.layer in spriteRenderList)
			{
				spriteRenderList[this.gameObject.layer]= spriteRenderList[this.gameObject.layer].splice(this.gameObject.layerIndex, 0, this);
			}
			else
			{
				spriteRenderList[this.gameObject.layer]= [this];
			}
		}

		Update()
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

			/*
			//for cornor pivot
			context.save();
			context.scale(1, -1);
			context.rotate(this.gameObject.rotation);

			context.drawImage(this.sprite, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, -this.drawWidth, -this.drawHeight, this.drawWidth, this.drawHeight);
			context.restore();
			*/

			context.save();
			context.scale(1, -1);
			context.translate(this.drawX + (this.drawWidth/2), -(this.drawY + (this.drawHeight/2)));
			context.rotate(this.gameObject.rotation);
			context.drawImage(this.sprite, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, -this.drawWidth/2, -this.drawHeight/2, this.drawWidth, this.drawHeight);
			context.restore();
		}

		static render()
		{
			for(let layer in spriteRenderList)
			{
				for(let i= 0; i < spriteRenderList[layer].length; i++)
				{
					spriteRenderList[layer][i].Update();
				}
			}
		}
	}

	return SpriteRenderer;

})();

export class RigidBody{

	constructor(applyGravity= true, applyFriction= true)
	{
		this.type= "RigidBody";
		this.mass= 1;
		this.applyGravity= applyGravity;
		this.gravity= new Vector(0, -0.1);
		this.velocityCap= 50;
		this.velocity= new Vector();
		this.applyFriction= applyFriction;
		this.frictionCoefficient= 0.99;
		this.enabled= true;
		this.acceleration= new Vector(0, 0);
		this.kinematic= false;
	}

	Start(obj)
	{
		this.gameObject= obj;
	}

	Update()
	{
		if(!this.enabled) return;

		this.computeGravity();
		this.computeAcceleration();
		this.computeVelocity();
		this.computeFriction();
	}

	computeVelocity()
	{
		this.gameObject.position.addTo(this.velocity);
	}

	computeGravity()
	{
		if(this.applyGravity && this.velocity.getMag() < this.velocityCap)
		{
			this.velocity= this.velocity.add(this.gravity);
		}
	}

	computeFriction()
	{
		if(this.applyFriction)
		{
			this.velocity= this.velocity.multiply(this.frictionCoefficient);
		}
	}

	computeAcceleration()
	{
		if(this.velocity.getMag() < this.velocityCap)
		{
			this.velocity= this.velocity.add(this.acceleration);
		}
	}

}

export class Collider{
	
	constructor(colliderType= "circle", dimentions= {radius: 5}, onCollisionEnter= () => {}, onCollisionExit= () => {}, isTrigger= false, ignoreLayers= [])
	{
		this.colliderType= colliderType;
		this.dimentions= dimentions;
		this.onCollisionEnter= onCollisionEnter;
		this.onCollisionExit= onCollisionExit;
		this.isTrigger= isTrigger;
		this.enabled= true;
		this.ignoreLayers= ignoreLayers;
		this.colliding= false;
		this.drawColiider= false;
		this.type= "Collider"
	}

	Start(obj)
	{
		this.gameObject= obj;
	}

	Update()
	{

	}

	static computeCollisionDetection()
	{
		const gameObjectList= GameObject.getGameObjectList();

		//loop through game objects and compare with eachother.
		for(let i= 0; i < gameObjectList.length; i++)
		{
			for(let j= i; j < gameObjectList.length; j++)
			{
				//if collider layer is listed in ignoreLayers, skip.
				if(!("Collider" in gameObjectList[i].components) || !("Collider" in gameObjectList[j].components)) return;
				if(gameObjectList[i].components.Collider.ignoreLayers.includes(gameObjectList[j].layer) || gameObjectList[j].components.Collider.ignoreLayers.includes(gameObjectList[i].layer)) continue;
				if(gameObjectList[i].objectId !== gameObjectList[j].objectId)
				{
					//check collider types
					Collider.checkCollisionType(gameObjectList[i], gameObjectList[j]);
				}
			}
		}
	}

	static checkCollisionType(gameObject1, gameObject2)
	{
		//draw bounding circle. if collider type == circle
		if(gameObject1.components.Collider.drawColiider)
			drawBoundingCircle(gameObject1.position, gameObject1.components.Collider.dimentions.radius);

		if(gameObject2.components.Collider.drawColiider)
			drawBoundingCircle(gameObject2.position, gameObject2.components.Collider.dimentions.radius);

		
		switch(gameObject1.components.Collider.colliderType + gameObject2.components.Collider.colliderType)
		{
			case "circlecircle":
			{
				//for collision between 2 circles
				Collider.c2cCollisionDetection(gameObject1, gameObject2);
				break;
			}
			case "boxbox":
			{
				//for collision between 2 boxes AABB
				Collider.x2xCollisionDetection(gameObject1, gameObject2);
				break;
			}
			case "circlesquare":
			case "squarecircle":
			{
				break;
			}
			default : break;
		}
	}

	static x2xCollisionDetection(gameObject1, gameObject2)
	{
		const rigidBody1= gameObject1.components.RigidBody;
		const rigidBody2= gameObject2.components.RigidBody;
		const collider1= gameObject1.components.Collider;
		const collider2= gameObject2.components.Collider;

		if(!rigidBody1 || !rigidBody2) return;
		//if((rigidBody1.kinematic === true && rigidBody2.kinematic === true)) return;

		const pos1= gameObject1.position.clone();
		const pos2= gameObject2.position.clone();
		const w1= collider1.dimentions.width;
		const w2= collider2.dimentions.width;
		const h1= collider1.dimentions.height;
		const h2= collider2.dimentions.height;
		const u1= gameObject1.components.RigidBody.velocity.clone();
		const u2= gameObject2.components.RigidBody.velocity.clone();

		let hasCollided= false;

		//if rigid body is knematic, the object cannor be moved.

		/* algorithm works by moving the game object first in the x axis, 
			checking for collisions, moving them away and then doing it again for the y axis.
		*/

		//if object 2 is imovable
		if(rigidBody2.kinematic === true)
		{
			//the object has laready been moved by the velocity vector. So move it back in the y axis.
			pos2.y-= u2.y;
			pos1.y-= u1.y;

			//check collision and resolve only for the x axis.
			if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
			{
				hasCollided= true;

				//if object 1 is moving right
				if(u1.x > 0)
				{
					pos1.x= pos2.x - (w1 + 1);
				}
				else if(u1.x < 0)//if object 1 is moving left
				{
					pos1.x= pos2.x + (w2 + 1);
				}
				else
				{
					//find the edge intersecting the second object and push the first object in the opposite direction.
					if(pos1.x > pos2.x && pos1.x < pos2.x + w2)
					{
						pos1.x= pos2.x + (w2 + 1);
					}
					else if(pos1.x + w1 > pos2.x && pos1.x + w1 < pos2.x + w2)
					{
						pos1.x= pos2.x - (w1 + 1);
					}
					else
					{
						pos1.x= pos2.x - (w1 + 1);
					}
				}
			}

			//add the velocity back in the y axis.
			pos2.y+= u2.y;
			pos1.y+= u1.y;

			//check collision and resolve only for the y axis.
			if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
			{
				hasCollided= true;

				if(u1.y > 0)
				{
					pos1.y= pos2.y - (h1 + 1);
				}
				else if(u1.y < 0)
				{
					pos1.y= pos2.y + (h2 + 1);
				}
				else
				{
					if(pos1.y > pos2.y && pos1.y < pos2.y + h2)
					{
						pos1.y= pos2.y + (h2 + 1);
					}
					else if(pos1.y + h1 > pos2.y && pos1.y + h1 < pos2.y + w2)
					{
						pos1.y= pos2.y - (h1 + 1);
					}
					else
					{
						pos1.y= pos2.y - (h1 + 1);
					}
				}
			}

			gameObject1.position= pos1;
		}
		else /*if(rigidBody1.kinematic === true)*/
		{
			//if object 1 is imovable or if both are movable

			pos2.y-= u2.y;
			pos1.y-= u1.y;

			if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
			{
				hasCollided= true;

				if(u2.x > 0)
				{
					pos2.x= pos1.x - (w2 + 1);
				}
				else if(u2.x < 0)
				{
					pos2.x= pos1.x + (w1 + 1);
				}
				else
				{
					if(pos1.x > pos2.x && pos1.x < pos2.x + w2)
					{
						pos2.x= pos1.x - (w2 + 1);
					}
					else if(pos1.x + w1 > pos2.x && pos1.x + w1 < pos2.x + w2)
					{
						pos2.x= pos1.x + (w1 + 1);
					}
					else
					{
						pos2.x= pos1.x - (w2 + 1);
					}
				}
			}

			pos2.y+= u2.y;
			pos1.y+= u1.y;

			if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
			{
				hasCollided= true;

				if(u2.y > 0)
				{
					pos2.y= pos1.y - (h2 + 1);
				}
				else if(u2.y < 0)
				{
					pos2.y= pos1.y + (h1 + 1);
				}
				else
				{
					if(pos1.y > pos2.y && pos1.y < pos2.y + h2)
					{
						pos2.y= pos1.y - (h2 + 1);
					}
					else if(pos1.y + h1 > pos2.y && pos1.y + h1 < pos2.y + w2)
					{
						pos2.y= pos1.y + (h1 + 1);
					}
					else
					{
						pos2.y= pos1.y - (h2 + 1);
					}
				}
			}

			gameObject2.position= pos2;
		}


		//call collision handlers if collision occured.
		if(hasCollided)
		{
			if(collider1.colliding === false)
			{
				collider1.onCollisionEnter(gameObject1, gameObject2);
				collider1.colliding= true;
			}
			if(collider2.colliding === false)
			{
				collider2.onCollisionEnter(gameObject2, gameObject1);
				collider2.colliding= true;
			}
		}
		else
		{
			if(collider1.colliding === true)
			{
				collider1.onCollisionExit(gameObject1, gameObject2);
				collider1.colliding= false;
			}
			if(collider2.colliding === true)
			{
				collider2.onCollisionExit(gameObject2, gameObject1);
				collider2.colliding= false;
			}
		}
	}

	//for collision between 2 circles.
	static c2cCollisionDetection(gameObject1, gameObject2)
	{
		const rigidBody1= gameObject1.components.RigidBody;
		const rigidBody2= gameObject2.components.RigidBody;
		const collider1= gameObject2.components.Collider;
		const collider2= gameObject2.components.Collider;

		if(!rigidBody1 || !rigidBody2) return;
		if((rigidBody1.kinematic === true && rigidBody2.kinematic === true)) return;
		if(!Circle2CircleCollision(gameObject1, gameObject2))
		{
			if(collider1.colliding === true)
			{
				collider1.onCollisionExit(gameObject1, gameObject2);
				collider1.colliding= false;
			}
			if(collider2.colliding === true)
			{
				collider2.onCollisionExit(gameObject2, gameObject1);
				collider2.colliding= false;
			}
			return;
		}

		if(collider1.colliding === false)
		{
			collider1.onCollisionEnter(gameObject1, gameObject2);
			collider1.colliding= true;
		}
		if(collider2.colliding === false)
		{
			collider2.onCollisionEnter(gameObject2, gameObject1);
			collider2.colliding= true;
		}

		const pos1= gameObject1.position;
		const pos2= gameObject2.position;
		const u1= rigidBody1.velocity;
		const u2= rigidBody2.velocity;
		const m1= rigidBody1.mass;
		const m2= rigidBody2.mass;

		let normalVector= Vector.subtraction(pos1, pos2);
		const impulse= (collider1.dimentions.radius + collider2.dimentions.radius) - normalVector.getMag();
		normalVector= normalVector.getUnitVector();

		const tangent_vector= normalVector.getTangentVector();

		const u1n= Vector.dotProduct(u1, normalVector);
		const u2n= Vector.dotProduct(u2, normalVector);

		let u1t= Vector.dotProduct(u1, tangent_vector);
		let u2t= Vector.dotProduct(u2, tangent_vector);
		let v1n= (u1n * (m1 - m2) + (2 * m2 * u2n)) / (m1 + m2);
		let v2n= (u2n * (m2 - m1) + (2 * m1 * u1n)) / (m1 + m2);

		v1n= new Vector(v1n * normalVector.x, v1n * normalVector.y);
		v2n= new Vector(v2n * normalVector.x, v2n * normalVector.y);
		u1t= new Vector(u1t * tangent_vector.x, u1t * tangent_vector.y);
		u2t= new Vector(u2t * tangent_vector.x, u2t * tangent_vector.y);

		const v1= new Vector(v1n.x + u1t.x, v1n.y + u1t.y);
		const v2= new Vector(v2n.x + u2t.x, v2n.y + u2t.y);

		if(rigidBody1.kinematic === true)
		{
			const resol2= normalVector.multiply(-1).clone();
			resol2.setMag(impulse + 1);
			gameObject2.position= pos2.add(resol2);
			v2.setMag(rigidBody2.velocity.getMag());
			rigidBody2.velocity= v2;
		}
		else if(rigidBody2.kinematic === true)
		{
			const resol1= normalVector.clone();
			resol1.setMag(impulse + 1);
			gameObject1.position= pos1.add(resol1);
			v1.setMag(rigidBody1.velocity.getMag());
			rigidBody1.velocity= v1;
		}
		else
		{
			const resol1= normalVector.clone();
			resol1.setMag(impulse / 2 + 1);
			gameObject1.position= pos1.add(resol1);

			const resol2= normalVector.multiply(-1).clone();
			resol2.setMag(impulse / 2 + 1);
			gameObject2.position= pos2.add(resol2);

			rigidBody1.velocity= v1;
			rigidBody2.velocity= v2;
		}
	}
}

