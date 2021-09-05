import {VGRenderer, RigidBody, Collider, SpriteRenderer} from "../components/components.js";
import Input from "../input.js";
import Vector from "../vector.js";
import {drawBoundingCircle, drawRectangle, box2BoxCollision, drawVector, getRandomVector} from "../utilityFUnctions.js";
import {getImages} from "../constants.js";

class PlayerMovement{

	constructor(obj)
	{
		this.gameObject= obj;
		this.color= "orange"; 
	}

	Start= () => {
		this.gameObject.position= new Vector();
		//render vector graphics
		/*this.gameObject.addComponent(new VGRenderer(obj => {
			context.save();
			context.translate(obj.position.x, obj.position.y);
			context.rotate(Math.PI / 2);
			context.beginPath();
			context.fillStyle= this.color;
			context.moveTo(25, 0);
			context.lineTo(-10, -15);
			context.lineTo(0, 0);
			context.lineTo(-10, 15);
			context.lineTo(25, 0);
			context.fill();
			context.restore();
			drawRectangle(this.gameObject.position, 64, 64, this.color);
		}));*/

		//render sprite
		this.gameObject.addComponent(new SpriteRenderer(getImages()?.mario, 64, 368, 16, 16, 32, 32));
		// rigid body for physics purposes.
		this.rb= this.gameObject.addComponent(new RigidBody(false, false));
		this.rb.mass= 100;
		//this.rb.kinematic= true;

		//box collider
		//this.gameObject.addComponent(new Collider("box", {width: 32, height: 32}));
	}

	Update= () => {

		const vel= 5;

		if(Input.getKey("w") === true)
		{
			this.rb.velocity.setMag(vel);
			if(Input.getKey("d") === true)
			{
				this.rb.velocity.setAngle(Math.PI / 4);
			}
			else if(Input.getKey("a") === true)
			{
				this.rb.velocity.setAngle( 3 * (Math.PI / 4));
			}
			else
			{
				this.rb.velocity.setAngle(Math.PI / 2);
			}
		}
		else if(Input.getKey("s") === true)
		{
			this.rb.velocity.setMag(vel);
			if(Input.getKey("d") === true)
			{
				this.rb.velocity.setAngle(-Math.PI / 4);
			}
			else if(Input.getKey("a") === true)
			{
				this.rb.velocity.setAngle(-3 * (Math.PI / 4));
			}
			else
			{
				this.rb.velocity.setAngle(-Math.PI / 2);
			}
		}
		else
		{
			this.rb.velocity.setMag(vel);
			if(Input.getKey("d") === true)
			{
				this.rb.velocity.setAngle(0);
			}
			else if(Input.getKey("a") === true)
			{
				this.rb.velocity.setAngle(Math.PI);
			}
		}

		if(!Input.getKey("w") && !Input.getKey("s") && !Input.getKey("a") && !Input.getKey("d"))
		{
			this.rb.velocity.setMag(0);
			this.rb.velocity= this.rb.velocity.multiply(0.5);
		}
	}
};

export default PlayerMovement;
