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

		NewChildGameObject()
		{
			const child= new GameObject(...arguments);
			this.addChild(child);
			return child;
		}

		addChild(child)
		{
			if(!this.childNodes){
				this.childNodes= new Set();
			}
			this.childNodes.add(child);
		}

		removeChild(child)
		{
			this.childNodes.delete(child);
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

			if(this.childNodes && this.childNodes.size > 0) {
				for(const ch of this.childNodes) ch.Destroy();
			}

			if(!delay) this.destructor();
		}

		destructor()
		{
			if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
			{
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;

				Promise.resolve((typeof this.onDestroy === "function") && this.onDestroy())
				.then(() => {
					gameObjectList.splice(this.index, 1);
					for(let i=0; i<gameObjectList.length; i++)
						gameObjectList[i].index= i;
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