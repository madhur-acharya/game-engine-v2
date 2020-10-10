import {GameObject} from "./gameObject.js";
import {getRandomVector, Coroutine} from "./utilityFunctions.js";
import {PlayerMovement, Circle} from "./testScripts.js";

const InitialBehaviour= () => {

	new GameObject().assignScript(PlayerMovement);
	new GameObject().assignScript(Circle);

	function* countAppleSales() 
	{
		let saleList = [3, 7, 5]
		for (let i = 0; i < saleList.length; i++) 
		{
			yield saleList[i]
			console.log(saleList[i]);
		}
	}

	Coroutine.start(countAppleSales);
}

export default InitialBehaviour;

