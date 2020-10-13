import {getRandomVector, isFunction, draw_bounding_circle, Circle2CircleCollision, drawVector} from "./utilityFunctions.js";
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

			if(this.ignoreLayers.includes(layer) || !gameObjectList[layer]) continue;

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
					this.impulseResolution(other);
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

	impulseResolution(other)
	{
		const thisRigidBody= this.gameObject.components.RigidBody;
		const otherRigidBody= other.gameObject.components.RigidBody;

		const pos1= this.gameObject.position;
		const pos2= other.gameObject.position;
		const u1= thisRigidBody.velocity;
		const u2= otherRigidBody.velocity;
		const m1= thisRigidBody.mass;
		const m2= otherRigidBody.mass;

		let normal_vector= new Vector(pos2.x - pos1.x, pos2.y - pos1.y);
		normal_vector= normal_vector.getUnitVector();
		let tangent_vector= new Vector(-normal_vector.y, normal_vector.x);

		let u1n= Vector.dotProduct(u1, normal_vector);
		let u2n= Vector.dotProduct(u2, normal_vector);
		let u1t= Vector.dotProduct(u1, tangent_vector);
		let u2t= Vector.dotProduct(u2, tangent_vector);

		let v1n= (u1n * (m1 - m2) + (2 * m2 * u2n)) / (m1 + m2);
		let v2n= (u2n * (m2 - m1) + (2 * m1 * u1n)) / (m1 + m2);

		v1n= new Vector(v1n * normal_vector.x, v1n * normal_vector.y);
		v2n= new Vector(v2n * normal_vector.x, v2n * normal_vector.y);
		u1t= new Vector(u1t * tangent_vector.x, u1t * tangent_vector.y);
		u2t= new Vector(u2t * tangent_vector.x, u2t * tangent_vector.y);

		let v1= new Vector(v1n.x + u1t.x, v1n.y + u1t.y);
		let v2= new Vector(v2n.x + u2t.x, v2n.y + u2t.y);

		thisRigidBody.velocity= v1;
		otherRigidBody.velocity= v2;
	}

	/*impulseResolution(other)
	{
		const thisRigidBody= this.gameObject.components.RigidBody;
		const otherRigidBody= other.gameObject.components.RigidBody;

		if(!thisRigidBody || !otherRigidBody) return;
		if((thisRigidBody.kinematic === true && otherRigidBody.kinematic === true)) return;

		const pos1= this.gameObject.position;
		const pos2= other.gameObject.position;
		const u1= thisRigidBody.velocity;
		const u2= otherRigidBody.velocity;
		const m1= thisRigidBody.mass;
		const m2= otherRigidBody.mass;

		let normalVector= Vector.subtraction(pos1, pos2);
		const impulse= (this.dimentions.radius + other.dimentions.radius) - normalVector.getMag();
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

		if(thisRigidBody.kinematic === true)
		{
			const resol2= normalVector.multiply(-1).clone();
			resol2.setMag(impulse + 1);
			other.gameObject.position= pos2.add(resol2);
			v2.setMag(otherRigidBody.velocity.getMag());
			otherRigidBody.velocity= v2;
		}
		else if(otherRigidBody.kinematic === true)
		{
			const resol1= normalVector.clone();
			resol1.setMag(impulse + 1);
			this.gameObject.position= pos1.add(resol1);
			v1.setMag(thisRigidBody.velocity.getMag());
			thisRigidBody.velocity= v1;
		}
		else
		{
			const resol1= normalVector.clone();
			resol1.setMag(impulse / 2 + 1);
			this.gameObject.position= pos1.add(resol1);

			const resol2= normalVector.multiply(-1).clone();
			resol2.setMag(impulse / 2 + 1);
			other.gameObject.position= pos2.add(resol2);

			thisRigidBody.velocity= v1;
			otherRigidBody.velocity= v2;
		}

	}*/

}

