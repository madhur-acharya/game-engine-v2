import Vector from "./vector.js";
import {drawVector, isPromise} from "./utilityFunctions.js";

export const GameObject= (() => {

	const gameObjectList= [];

	class GameObject 
	{
		constructor(positionVector= new Vector(0, 0), layer= "default", layerIndex= 0, drawGizmos= false) 
		{
			this.position= positionVector;
			this.rotation= 0;
			this.scale= new Vector(1, 1);
			this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
			this.drawGizmos= drawGizmos;
			this.layer= "default";
			this.layerIndex= layerIndex;
			this.timers= {};
			this.components= [];
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
			if(delay > 0)
			{
				this.selfDestructTimer= new Timer();
				this.selfDestructDelay= delay;
			}
			else
			{
				this.onDestroy(this)
				.then(() => {
					delete gameObjectList[this.objectId];
				})
				.catch(err => {
					console.error(err);
				});
			}
		}

		selfDestruct()
		{
			if(this.selfDestructTimer && this.selfDestructTimer.getDuration() > this.selfDestructDelay)
			{
				this.selfDestructTimer= undefined;
				this.selfDestructDelay= undefined;

				this.onDestroy(this)
				.then(() => {
					delete gameObjectList[this.objectId];
				})
				.catch(err => {
					console.error(err);
				});
			}
		}

		AddComponent(component)
		{
			component.gameObject= this;
			component.Setup?.(this);
			this.components.push(component);
			return component;
		}

		runComponents()
		{
			for(let i in this.components)
			{
				// this.components[i].ready && this.components[i].Update(this);
				this.components[i].Update(this);
			}
		}

		onDestroy()
		{
			this.timers= {};
		}

		Update()
		{
			this.runComponents();
			this.renderGizmos();
			this.selfDestruct();
		}

		static getGameObjectList= () => gameObjectList;
	};

	return GameObject;
})();

