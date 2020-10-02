import {getRandomVector, isFunction} from "./utilityFunctions.js";
import Vector from "./vector.js";

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
	constructor()
	{
		collideTtype: "circle";
		dimentions: {radius: 15};
		onCollision: () => {};
		isTrigger: false;
		computeBoundryCollision: false;
		enabled: true;
	}

	Update()
	{
		if(!this.enabled) return;
	}

	collisionDetection()
	{
		if(this.collider.computeBoundryCollision)
		{
			this.velocity= cirlce2WalllCollision(this);
		}

		for(const ob in gameObjectList)
		{
			if(this.objectId !== gameObjectList[ob].objectId && this.layer === gameObjectList[ob].layer)
			{
				if(gameObjectList[ob].disableCollisionDetection) return;
				if(Circle2CircleCollision(this, gameObjectList[ob]))
				{
					if(this.collider.uncolide && gameObjectList[ob].collider.uncolide) 
					{
						uncolide(this, gameObjectList[ob] && gameObjectList[ob]);
					}
					this.collider.onCollision(this, gameObjectList[ob]);
					gameObjectList[ob] && gameObjectList[ob].collider.onCollision(gameObjectList[ob], this);
				}
			}
		}
	}

}




