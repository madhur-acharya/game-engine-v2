import {GameObject} from "./gameObject.js";
import {getRandomVector} from "./utilityFunctions.js";
import {PlayerMovement} from "./testScripts.js";

const InitialBehaviour= () => {
	
	const testObject= new GameObject();
	testObject.script= new PlayerMovement(testObject);
}

export default InitialBehaviour;

