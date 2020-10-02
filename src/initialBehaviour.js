import {GameObject} from "./gameObject.js";
import {getRandomVector} from "./utilityFunctions.js";
import {vectorRenderer} from "./components.js";
import Input from "./input.js";
import Vector from "./vector.js";

const InitialBehaviour= () => {
	
	const testObject= new GameObject(new Vector(0, -400), true);

	testObject.script= new TestScript(testObject);

}

export default InitialBehaviour;

class TestScript{

	constructor(obj)
	{
		this.gameObject= obj;
		this.gameObject.velocity= new Vector();
	}

	Start= () => {
		this.gameObject.addComponent(new vectorRenderer(this.gameObject, obj => {
			context.save();
			context.translate(obj.position.x, obj.position.y);
			context.rotate(Math.PI / 2);
			context.beginPath();
			context.fillStyle= "yellow";
			context.moveTo(25, 0);
			context.lineTo(-10, -15);
			context.lineTo(0, 0);
			context.lineTo(-10, 15);
			context.lineTo(25, 0);
			context.fill();
			context.restore();
		}))
	}

	Update= () => {
		if(Input.getKey("w") === true)
		{
			this.gameObject.velocity.setMag(5);
			if(Input.getKey("d") === true)
			{
				this.gameObject.velocity.setAngle(Math.PI / 4);
			}
			else if(Input.getKey("a") === true)
			{
				this.gameObject.velocity.setAngle( 3 * (Math.PI / 4));
			}
			else
			{
				this.gameObject.velocity.setAngle(Math.PI / 2);
			}
		}
		else if(Input.getKey("s") === true)
		{
			this.gameObject.velocity.setMag(5);
			if(Input.getKey("d") === true)
			{
				this.gameObject.velocity.setAngle(-Math.PI / 4);
			}
			else if(Input.getKey("a") === true)
			{
				this.gameObject.velocity.setAngle(-3 * (Math.PI / 4));
			}
			else
			{
				this.gameObject.velocity.setAngle(-Math.PI / 2);
			}
		}
		else
		{
			this.gameObject.velocity.setMag(5);
			if(Input.getKey("d") === true)
			{
				this.gameObject.velocity.setAngle(0);
			}
			else if(Input.getKey("a") === true)
			{
				this.gameObject.velocity.setAngle(Math.PI);
			}
		}

		if(!Input.getKey("w") && !Input.getKey("s") && !Input.getKey("a") && !Input.getKey("d"))
		{
			this.gameObject.velocity.setMag(0);
			this.gameObject.velocity= this.gameObject.velocity.multiply(0.5);
		}

		this.gameObject.position.addTo(this.gameObject.velocity);
	}
};
