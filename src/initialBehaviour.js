import {GameObject} from "./gameObject.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import {PlayerMovement, Rectangle} from "./testScripts.js";

const InitialBehaviour= () => {

	new GameObject().assignScript(PlayerMovement);

	for(let i= 0; i < 5; i++)
		new GameObject().assignScript(Rectangle);

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

