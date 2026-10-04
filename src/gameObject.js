import Vector from "./vector.js";
import {drawVector, isPromise, PrimaryKey, Timer} from "./utilityFunctions.js";
import LinkedList from "./linkedList.js";

export const GameObject= (() => {

	const GAME_OBJECT_LIST= new LinkedList();

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
			this._listNode= GAME_OBJECT_LIST.append(this);
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
					GAME_OBJECT_LIST.removeByValue(this);
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

		static getGameObjectList= () => GAME_OBJECT_LIST;
	};

	return GameObject;
})();