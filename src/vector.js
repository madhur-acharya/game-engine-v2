class Vector{

	constructor(x=0, y=0)
	{
		this.x= x;
		this.y= y;
	}

	clone= () => new Vector(this.x, this.y);
	from= vect => {
		this.x= vect.x;
		this.y= vect.y;
	}

	getAngle= () => Math.atan2(this.y, this.x);
	getMag= () => Math.sqrt(this.x * this.x + this.y * this.y); 

	setAngle= angle => {
		/*
		@need performance upgrades
		*/
		var mag= this.getMag();
		this.x= Math.cos(angle) * mag;
		this.y= Math.sin(angle) * mag;
	};
	setMag= mag => {
		const curMag= this.getMag();
		this.x = this.x * mag / curMag;
		this.y = this.y * mag / curMag;
	};

	add= vect => new Vector(this.x + vect.x, this.y + vect.y);
	subtract= vect => new Vector(this.x - vect.x, this.y - vect.y);
	multiply= scalar => new Vector(this.x * scalar, this.y * scalar);
	divide= scalar => new Vector(this.x / scalar, this.y / scalar);

	addTo= vect => {
		this.x= this.x + vect.x; 
		this.y= this.y + vect.y;
	}
		
	subtractWith= vect => {
		this.x= this.x - vect.x; 
		this.y= this.y - vect.y;
	}
	
	multiplyWith= scalar => {
		this.x= this.x * scalar;
		this.y= this.y * scalar;
	}

	divideBy= scalar => {
		this.x= this.x / scalar;
		this.y= this.y / scalar;
	}

	getUnitVector= vect => this.divide(this.getMag());

	getTangentVector= () => new Vector(-this.y, this.x);

	static isVector= sus => sus instanceof Vector;
	
	static addition= (vect1, vect2) => new Vector(vect1.x + vect2.x, vect1.y + vect2.y);

	static subtraction= (vect1, vect2) => new Vector(vect1.x - vect2.x, vect1.y - vect2.y);

	static multiplication= (vect, scalar) => new Vector(vect.x * scalar, vect.y * scalar);

	static division= (vect, scalar) => new Vector(vect.x / scalar, vect.y / scalar);

	static dotProduct= (vect1, vect2) => ((vect1.x * vect2.x) + (vect1.y * vect2.y));

	static normal= (vect1, vect2) => new Vector((vect2.x - vect1.x), (vect2.y - vect2.y));

};

Math.Rad2Deg= (180 / Math.PI);
Math.Deg2rad= (Math.PI / 180);

export default Vector;
