import {getRandomVector, isFunction, draw_bounding_circle, Circle2CircleCollision} from "./utilityFunctions.js";
import Vector from "./vector.js";
import {GameObject} from "./gameObject.js";

export class VGRenderer{

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
	}

	Update()
	{
		if(!this.enabled) return;
		this.renderer(this.gameObject);
	}

}

export class RigidBody{

	constructor(applyGravity= true, applyFriction= true)
	{
		this.type= "RigidBody";
		this.applyGravity= applyGravity;
		this.gravity= new Vector(0, -0.1);
		this.velocityCap= 50;
		this.velocity= new Vector();
		this.applyFriction= applyFriction;
		this.frictionCoefficient= 0.99;
		this.enabled= true;
		this.acceleration= new Vector(0, 0);
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
	
	constructor(collideTtype= "circle", dimentions= {radius: 5}, onCollisionEnter= () => {}, onCollisionExit= () => {}, isTrigger= false, ignoreLayers= [])
	{
		this.collideTtype= collideTtype;
		this.dimentions= dimentions;
		this.onCollisionEnter= onCollisionEnter;
		this.onCollisionExit= onCollisionExit;
		this.isTrigger= isTrigger;
		this.enabled= true;
		this.ignoreLayers= ignoreLayers;
		this.colliding= false;
		this.drawColiider= true;
		this.type= "Collider"
	}

	Start(obj)
	{
		this.gameObject= obj;
	}

	Update()
	{
		if(!this.enabled) return;

		const gameObjectList= GameObject.getGameObjectList();
		const layerList= GameObject.getLayerList();

		for(let i= 0; i < layerList.length; i++)
		{
			const layer= layerList[i];

			if(this.ignoreLayers.includes(layer) || !gameObjectList[layer])
			{
				continue;
			}

			for(let i in gameObjectList[layer])
			{
				if(gameObjectList[layer][i].objectId !== this.gameObject.objectId)
				{
					this.collisionDetection(gameObjectList[layer][i].components.Collider);
				}
			}
		}

		if(this.drawColiider)
		{
			draw_bounding_circle(this.gameObject.position, this.dimentions.radius);
		}
	}

	collisionDetection(other)
	{
		switch(this.collideTtype + other.collideTtype)
		{
			case "circlecircle":
			{
				if(Circle2CircleCollision({x: this.gameObject.position.x, y: this.gameObject.position.y, radius: this.dimentions.radius}, {x: other.gameObject.position.x, y: other.gameObject.position.y, radius: other.dimentions.radius}))
				{
					if(this.colliding === false)
					{
						this.onCollisionEnter(this.gameObject, other.gameObject);
						this.colliding= true;
					}
					if(other.colliding === false)
					{
						other.onCollisionEnter(other.gameObject, this.gameObject);
						other.colliding= true;
					}
				}
				else
				{
					if(this.colliding === true)
					{
						this.onCollisionExit(this.gameObject, other.gameObject);
						this.colliding= false;
					}
					if(other.colliding === true)
					{
						other.onCollisionExit(other.gameObject, this.gameObject);
						other.colliding= false;
					}
				}
				break;
			}
			case "squaresquare":
			{
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

}




