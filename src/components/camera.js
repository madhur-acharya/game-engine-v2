import Generic from "./generic.js";
import Vector from "../vector.js";

class Camera extends Generic{
	constructor(width, height) {
		super();
		this.width= width;
		this.height= height;
		this.position= new Vector();
	}

	moveTo(destVect) {
		this.position= destVect;
	}
}


export default Camera;
