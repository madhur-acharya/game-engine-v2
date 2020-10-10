import {VGRenderer, RigidBody, Collider} from "./components.js";
import Input from "./input.js";
import Vector from "./vector.js";

export class PlayerMovement{

	constructor(obj)
	{
		this.gameObject= obj;
		this.gameObject.velocity= new Vector();
		this.color= "orange";
	}

	Start= () => {

		this.gameObject.addComponent(new VGRenderer(obj => {
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
		}));
		this.gameObject.addComponent(new RigidBody(false, false));
		this.gameObject.addComponent(new Collider("circle", {radius: 35}, () => {
			console.log("X");
		}, () => {
			console.log("O");
		}));
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


export class Circle{
	constructor(obj)
	{
		this.gameObject= obj;
	}

	Start= () => {
		this.gameObject.position= new Vector(Math.random() * 200, Math.random() * 200);
		this.gameObject.addComponent(new VGRenderer(obj => {
			context.save();
			context.beginPath();
			context.fillStyle= "teal";
			context.arc(obj.position.x, obj.position.y, 20, 0, Math.PI * 2)
			context.fill();
			context.restore();
		}));

		this.gameObject.addComponent(new Collider("circle", {radius: 20}, () => {
			console.log("X");
		}, () => {
			console.log("O");
		}));
	}

	Update= () => {

	}
};
