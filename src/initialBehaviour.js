import {GameObject} from "./gameObject.js";
import {getRandomVector} from "./utilityFunctions.js";
import {PlayerMovement} from "./testScripts.js";

const InitialBehaviour= () => {
	
	let testObject= new GameObject();
	testObject.script= new PlayerMovement(testObject);
	testObject.layer= {name: "1", index: 1};

	testObject= new GameObject();
	testObject.script= new PlayerMovement(testObject, "blue");
}

export default InitialBehaviour;

