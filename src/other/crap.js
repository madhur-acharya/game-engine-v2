for(let j= 0; j < gameObjectList.length; j++)
{
	if(this.gameObject.objectId === gameObjectList[j].objectId) continue;

	const pos1= this.gameObject.position.clone();
	const pos2= gameObjectList[j].position.clone();
	const w1= this.gameObject.components.Collider.dimentions.width;
	const w2= gameObjectList[j].components.Collider.dimentions.width;
	const h1= this.gameObject.components.Collider.dimentions.height;
	const h2= gameObjectList[j].components.Collider.dimentions.height;
	const u1= this.gameObject.components.RigidBody.velocity.clone();
	const u2= gameObjectList[j].components.RigidBody.velocity.clone();
	const shadow= this.gameObject.position.clone();

	let normalVector= Vector.subtraction(pos1, pos2);

	if(pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y)
	{
		this.color= "red";
		let watchDog= 0;
		const temp= normalVector.getUnitVector();
		while((pos1.x < (pos2.x + w2) && (pos1.x + w1) > pos2.x && pos1.y < (pos2.y + h2) && (pos1.y + h1) > pos2.y) && watchDog < 1000 )
		{
			pos1.addTo(temp);
			watchDog++;
		}

		/*drawVector(pos2, normalVector, "red", false);
		context.save();
		context.beginPath();
		context.lineWidth= 1;
		context.strokeStyle= "#3b3b3b";
		context.moveTo(shadow.x, shadow.y);
		context.lineTo(pos1.x, pos1.y);

		context.moveTo((shadow.x + w1), (shadow.y + w1));
		context.lineTo((pos1.x + w1), (pos1.y + w1));

		context.moveTo((shadow.x + h1), shadow.y);
		context.lineTo((pos1.x + h1), pos1.y);

		context.moveTo(shadow.x, (shadow.y + w1));
		context.lineTo(pos1.x, (pos1.y + w1));

		context.stroke();
		context.restore();*/

		//drawRectangle(pos1, w1, h1, "lime");
		this.gameObject.position= pos1;
	}
	else
		this.color= "white";
}


export class Asteroid extends GameObject{
	constructor(list= [], position= new Vector(0, 0), vertices= 30, collider= {
		type: "circle",
		radius: 50,
		onCollision: () => {},
		uncolide: true
	})
	{
		super(list, position);
		super.collider= collider;
		super.renderList= list;
		super.alias= "enemy";
		this.vertexArray= [];
		this.vertices= vertices;
		this.health= 3;

		let slice= (Math.PI * 2) / this.vertices, 
			angle= 0;
		for(let i= 0; i < this.vertices; i++)
		{
			let vx= Math.cos(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);
			let vy= Math.sin(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);	
			let vertex= new Point(vx, vy);

			this.vertexArray.push(vertex);
			angle= angle + slice;
		};

		super.addCollider= obj => {
			super.collider= obj;
			let slice= (Math.PI * 2) / this.vertices, 
				angle= 0;
			for(let i= 0; i < this.vertices; i++)
			{
				let vx= Math.cos(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);
				let vy= Math.sin(angle) * (this.collider.radius - Math.random() * this.collider.radius / 3);	
				let vertex= new Point(vx, vy);

				this.vertexArray.push(vertex);
				angle= angle + slice;
			};
		};

		super.renderer= () => {
			context.save();
			context.translate(this.position.x, this.position.y);
			context.rotate(this.velocity.getAngle());
			context.beginPath();
			context.strokeStyle= "white";
			context.fillStyle= "#232322";
			context.moveTo(this.vertexArray[0].x, this.vertexArray[0].y);
			for(let i= 1; i < this.vertexArray.length; i++)
			{
				context.lineTo(this.vertexArray[i].x, this.vertexArray[i].y);
			}
			context.lineTo(this.vertexArray[0].x, this.vertexArray[0].y);
			context.stroke();
			context.fill();
			context.restore();
		};
	}
}


export class Projectile extends GameObject{
	constructor(position= new Vector(0, 0), speed= 10, direction= Math.PI / 2, size= 5, alias= "enemyProjectile", damage= 1)
	{
		const vel= new Vector(0, 0);
		vel.setMag(speed);
		vel.setAngle(direction);

		super(position, vel);
		super.gravityActive= true;
		super.alias= alias;
		super.layer= "projectile";
		super.damage= damage;
		super.renderer= obj => {
			context.save();
			context.beginPath();
			context.fillStyle= "white";
			context.arc(obj.position.x, obj.position.y, size, 0, Math.PI * 2);
			context.fill();
		}
		super.addCollider({
			type: "circle",
			radius: size,
			onCollision: (current, other) => {
				if((current.alias === "playerProjectile" && other.alias === "player") || 
					(current.alias === "enemyProjectile" && other.alias === "enemy") || 
					current.alias === other.alias || 
					other.alias === "enemyProjectile" || 
					other.alias === "playerProjectile")
					return;
				else
					current.destroy();
			},
			uncolide: false
		});
		super.destroy(5000);
	}
}

export class UIObject{
	constructor(position= new Vector(0, 0), renderer= () => {})
	{
		this.position= position;
		gameObjectList= list;
		this.executables= [renderer];
		this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
		list.push(this);
	}

	selfDestruct()
	{
		if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
		{
			for(let i= 0; i < gameObjectList.length; i++)
			{
				if(gameObjectList[i].objectId === this.objectId)
				{
					gameObjectList.splice(i, 1);
					this.onDestroy && this.onDestroy(this);
				}
			}
			this.selfDestructTimer= undefined;
			this.selfDestructDelay= undefined;
		}
	}

	destroy(delay= 0)
	{
		if(delay > 0)
		{
			this.selfDestructTimer= new Timer();
			this.selfDestructDelay= delay;
			this.executables.push("selfDestruct");
		}
		else
		{
			for(let i= 0; i < gameObjectList.length; i++)
			{
				if(gameObjectList[i].objectId === this.objectId)
				{
					gameObjectList.splice(i, 1);
					this.onDestroy && this.onDestroy(this);
				}
			}
		}
	}

	onDestroy()
	{

	}

	executeScripts()
	{
		this.executables.forEach(itm => {
			if(typeof(itm) == "string")
			{
				this[itm]();
			}
			else if(!!(itm && itm.constructor && itm.call && itm.apply))
			{
				itm(this);
			}
			
		});
	}
}

export const GameObject= (() => {

	const gameObjectList= {};

	class GameObject 
	{
		constructor(positionVector= new Vector(0, 0), velocity= new Vector(0, 0), gravityActive= true, frictionActive= true) 
		{
			this.position= positionVector;
			this.rotation= 0;
			this.gravityActive= gravityActive;
			this.gravity= new Vector(0, -0.1);
			this.velocityCap= 50;
			this.velocity= velocity;
			this.frictionActive= frictionActive;
			this.frictionCoefficient= 0.99;
			this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
			this.drawGizmos= true;
			this.acceleration= new Vector(0, 0);
			this.layer= "default";
			this.disableCollisionDetection= false;

			this.executables= ["applyGravity", "applyAcceleration", "applyVelocity", "applyFriction"];
			this.timers= {}
			gameObjectList[this.objectId]= this;
		}

		applyVelocity()
		{
			this.position= Vector.addition(this.position, this.velocity);
		}

		applyGravity()
		{
			if(!this.gravityActive) return;
			if(this.velocity.getMag() < this.velocityCap)
			{
				this.velocity= this.velocity.add(this.gravity);
			}
		}

		applyFriction()
		{
			if(this.frictionActive)
				this.velocity= this.velocity.multiply(this.frictionCoefficient);
		}

		applyAcceleration()
		{
			this.velocity= this.velocity.add(this.acceleration);
			if(this.velocity.getMag() > this.velocityCap)
			{
				this.velocity.setMag(this.velocityCap);
			}
		}

		addTimer(key, clock)
		{
			this.timers[key]= clock;
		}

		executeScripts()
		{
			this.executables.forEach(itm => {
				if(typeof(itm) == "string")
				{
					this[itm]();
				}
				else if(!!(itm && itm.constructor && itm.call && itm.apply))
				{
					itm(this);
				}
				
			});
			if(this.drawGizmos) this.renderGizmos();
			this.renderer(this);
			this.collisionDetection();
		}

		renderer()
		{
			//drawVector(this.position);
		}

		renderGizmos()
		{
			drawVector(new Vector(0, 0), this.position);
			drawVector(this.position, this.velocity, "green");
			if(this.collider)
				draw_bounding_circle(this.position, this.collider ? this.collider.radius : 20);
		}

		destroy(delay= 0)
		{
			if(delay > 0)
			{
				this.selfDestructTimer= new Timer();
				this.selfDestructDelay= delay;
				this.executables.push("selfDestruct");
			}
			else
			{
				this.onDestroy(this);
				delete gameObjectList[this.objectId];
			}
		}

		selfDestruct()
		{
			if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
			{
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;

				this.onDestroy(this);
				delete gameObjectList[this.objectId];
			}
		}

		addCollider(colliderObj)
		{
			this.collider= {
				type: "circle",
				radius: 15,
				onCollision: () => {},
				uncolide: false,
				computeBoundryCollision: false,
				...colliderObj
			};
		}

		collisionDetection()
		{
			if(!this.collider) return;
			else
			{	
				if(this.collider.computeBoundryCollision)
				{
					this.velocity= cirlce2WalllCollision(this);
				}

				if(this.disableCollisionDetection) return;
				else
				{
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
		}

		onDestroy()
		{
			
		}

		static getGameObjectList()
		{
			return gameObjectList;
		}
	};

	return GameObject;
})();



