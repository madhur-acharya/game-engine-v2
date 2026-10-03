import Vector from "./vector.js";
import {drawVector, isPromise, PrimaryKey, Timer} from "./utilityFunctions.js";

export const GameObject= (() => {

	const gameObjectList= [];

	class GameObject
	{
		constructor(positionVector= new Vector(0, 0), layer= "default")
		{
			this.position= positionVector;
			this.rotation= 0;
			this.objectId= PrimaryKey.nextNumber("GAMEOBJECT");
			this.drawGizmos= false;
			this.layer= "default";
			this.timers= {};
			this.components= {};
			this.index= gameObjectList.length;
			gameObjectList.push(this);
		}

		addTimer(key, clock)
		{
			this.timers[key]= clock;
		}

		renderGizmos()
		{
			if(this.drawGizmos)
			{
				drawVector(this.position, new Vector(0, 1), "green");
				drawVector(this.position, new Vector(1, 0));
			}
		}

		Destroy(delay= 0)
		{
			this.selfDestructTimer= new Timer();
			this.selfDestructDelay= delay;
		}

		destructor()
		{
			if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
			{
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;

				((typeof this.onDestroy === "function") ? this.onDestroy : () => Promise.resolve())()
				.then(() => {
					gameObjectList.splice(this.index, 1);
				})
			}
		}

		AddComponent(component)
		{
			if(!component.name) console.warn("Component has no name", component);
			this.components[component.name]= component;
			return component;
		}

		runComponents()
		{
			for(let i in this.components)
			{
				// this.components[i].ready && this.components[i].update(this);
				this.components[i].Update(this);
			}
		}

		onDestroy(){return Promise.resolve();}

		Update()
		{
			this.runComponents();
			this.renderGizmos();
			this.destructor();
		}

		static getGameObjectList= () => gameObjectList;
	};

	return GameObject;
})();