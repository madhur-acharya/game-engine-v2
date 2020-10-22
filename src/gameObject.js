import Vector from "./vector.js";
import {drawVector} from "./utilityFunctions.js";
import {Collider} from "./components.js";

export const GameObject= (() => {

	const gameObjectList= [];

	class GameObject 
	{
		constructor(positionVector= new Vector(0, 0), layer= "default", layerIndex= 0, drawGizmos= false) 
		{
			this.position= positionVector;
			this.rotation= 0;
			this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
			this.drawGizmos= drawGizmos;
			this.layer= "default";
			this.layerIndex= layerIndex;
			this.timers= {};
			this.components= {};
			this.script= {
				Start: () => {},
				Update: () => {}
			};

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

		addComponent(component)
		{
			this.components[component.type]= component;
			this.components[component.type].Start(this);
			return component;
		}

		runComponents()
		{
			for(let key in this.components)
			{
				this.components[key].Update(this);
			}
		}

		assignScript(script)
		{
			this.script= new script(this);
		}

		onDestroy()
		{
			this.timers= {};
		}

		runExecutables()
		{
			this.script.Update();
			this.runComponents();
			this.renderGizmos();
			this.selfDestruct();
		}

		static getGameObjectList= () => gameObjectList;
	};

	return GameObject;
})();

