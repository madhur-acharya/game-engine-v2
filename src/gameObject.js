import Vector from "./vector.js";
import {drawVector} from "./utilityFunctions.js";

export const GameObject= (() => {

	const gameObjectList= {
		default: {}
	};

	const layerList= ["default"];

	class GameObject 
	{
		constructor(theLayer= "default", positionVector= new Vector(0, 0), drawGizmos= false) 
		{
			this.position= positionVector;
			this.rotation= 0;
			this.objectId= performance.now().toString() + Math.round(Math.random() * 1000);
			this.drawGizmos= drawGizmos;
			this._layer= theLayer;
			this.timers= {};
			this.components= {};
			this.script= {
				Start: () => {},
				Update: () => {}
			};

			gameObjectList[this._layer][this.objectId]= this;
		}

		get layer()
		{
			return this._layer;
		}

		set layer(layerName)
		{
			this._layer= layerName;
			gameObjectList[layerName][this.objectId]= this;
			delete gameObjectList[this._layer][this.objectId];
		}

		addTimer(key, clock)
		{
			this.timers[key]= clock;
		}

		renderGizmos()
		{
			drawVector(this.position, new Vector(0, 1), "green");
			drawVector(this.position, new Vector(1, 0));
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
		}

		runComponents()
		{
			for(let key in this.components)
			{
				this.components[key].Update(this);
			}
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
		static getLayerList= () => layerList;
	};

	return GameObject;
})();

