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

		for(let i= 0; i < gameObjectList.length; i++)
		{
			for(let j= i; j < gameObjectList.length; j++)
			{
				if(gameObjectList[i].components.Collider.ignoreLayers.includes(gameObjectList[j].layer) || gameObjectList[j].components.Collider.ignoreLayers.includes(gameObjectList[i].layer)) continue;
				if(gameObjectList[i].objectId !== gameObjectList[j].objectId)
				{
					Collider.checkCollisionType(gameObjectList[i], gameObjectList[j]);
				}
			}
		}
	}

	static checkCollisionType(gameObject1, gameObject2)
	{
		if(gameObject1.components.Collider.drawColiider)
			drawBoundingCircle(gameObject1.position, gameObject1.components.Collider.dimentions.radius);

		if(gameObject2.components.Collider.drawColiider)
			drawBoundingCircle(gameObject2.position, gameObject2.components.Collider.dimentions.radius);

		switch(gameObject1.components.Collider.colliderType + gameObject2.components.Collider.colliderType)
		{
			case "circlecircle":
			{
				Collider.c2cCollisionDetection(gameObject1, gameObject2);
				break;
			}
			case "boxbox":
			{
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
		if((rigidBody1.kinematic === true && rigidBody2.kinematic === true)) return;

		const pos1= gameObject1.position.clone();
		const pos2= gameObject2.position.clone();
		const w1= collider1.dimentions.width;
		const w2= collider2.dimentions.width;
		const h1= collider1.dimentions.height;
		const h2= collider2.dimentions.height;
		const u1= gameObject1.components.RigidBody.velocity.clone();
		const u2= gameObject2.components.RigidBody.velocity.clone();

		let hasCollided= false;

		if(rigidBody2.kinematic === true)
		{
			pos2.y-= u2.y;
			pos1.y-= u1.y;

			if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
			{
				hasCollided= true;

				if(u1.x > 0)
				{
					pos1.x= pos2.x - (w1 + 1);
				}
				else if(u1.x < 0)
				{
					pos1.x= pos2.x + (w2 + 1);
				}
				else
				{
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

			pos2.y+= u2.y;
			pos1.y+= u1.y;

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

