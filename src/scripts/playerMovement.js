import {RigidBody} from "../components/rigidBody.js";
import {Collider} from "../components/collider.js";
import {SpriteRenderer} from "../components/spriteRenderer.js";
import Input from "../input.js";
import Vector from "../vector.js";
import {drawBoundingCircle, drawRectangle, box2BoxCollision, drawVector, getRandomVector} from "../utilityFUnctions.js";
import {getImages} from "../constants.js";

class PlayerMovement{
	constructor()
	{
		this.color= "orange"; 
	}

	Setup= (obj) => {
		this.ready= true;
		this.gameObject= obj;
		this.gameObject.position= new Vector();
		this.gameObject.AddComponent(new SpriteRenderer(3, getImages()?.mario, 64, 368, 16, 16, 32, 32));
		this.rb= this.gameObject.AddComponent(new RigidBody(false, false));
		this.rb.ready= true;
		this.rb.mass= 100;
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
