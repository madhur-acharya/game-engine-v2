import {GameObject} from "./gameObject.js";
import {getRandomVector, Coroutine, WaitForMilliSeconds, Timer} from "./utilityFunctions.js";
import {PlayerMovement, Circle} from "./testScripts.js";

const InitialBehaviour= () => {

	new GameObject().assignScript(PlayerMovement);
	new GameObject().assignScript(Circle);

	/*Coroutine.start((function*() 
	{
		let timer= new Timer();

		for(let i= 0; i < 10; i++)
		{
			while(timer.getDuration() < 1000)
			{
				yield 0;
			}
			timer= new Timer();
			console.log("!");
		}
	})());*/
}

export default InitialBehaviour;

