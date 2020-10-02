import Vector from "./vector.js";

//------------------------------------------------------------------------
export const isFunction= functionToCheck => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

//------------------------------------------------------------------------
export class Point
{
	constructor(x, y)
	{
		this.x= x;
		this.y= y;
	}
}

//------------------------------------------------------------------------
export function RealWorldTimer()
{
	this.start_time= Date.now();

	this.getDuration= function()
	{
		let delay= Date.now() - this.start_time;
		return delay;
	}

	this.reset= function()
	{
		this.start_time= Date.now();
	}
}

//------------------------------------------------------------------------
export function Timer()
{
	this.start_time= time;

	this.getDuration= function()
	{
		let delay= time - this.start_time;
		return delay;
	}

	this.reset= function()
	{
		this.start_time= time;
	}
}

//------------------------------------------------------------------------

export const TimeOut= (() => {

	const timeOutArray= [];

	class TimeOut{

		static newTimeOut(onTimeOut= () => {}, delay= 0)
		{
			const timeOutId= performance.now().toString();
			timeOutArray.push({
				timer: new Timer(),
				delay: delay,
				onTimeOut: onTimeOut,
				timeOutId: timeOutId
			});

			return timeOutId;
		}

		static clearTimeOut(id)
		{
			timeOutArray= timeOutArray.filter(itm => !itm.timeOutId === id);
		}

		static update()
		{
			for(let i=0; i < timeOutArray.length; i++)
			{
				if(timeOutArray[i].timer.getDuration() >= timeOutArray[i].delay)
				{
					timeOutArray[i].onTimeOut();
					timeOutArray.splice(i, 1);
				}
			}
		}
	};

	return TimeOut;
})();

//------------------------------------------------------------------------

export const Interval= (() => {

	const intervalArray= [];

	class Interval{

		newInterval(onInterval= () => {}, duaration, maxIterations= -1, onIntervalEnd= () => {})
		{
			const intervalId= performance.now().toString();
			intervalArray.push({
				timer: new Timer(),
				maxIterations: maxIterations,
				iterationCount: 0,
				onInterval: onInterval,
				duaration: duaration,
				intervalId: performance.now().toString(),
				onIntervalEnd: onIntervalEnd
			});
			return intervalId;
		}

		clearInterval(id)
		{
			if(!intervalId) return;
			console.log(id, intervalArray.filter(itm => !itm.intervalId === id));
			intervalArray= intervalArray.filter(itm => !itm.intervalId === id);
		}

		update()
		{
			for(let i=0; i < intervalArray.length; i++)
			{
				if(intervalArray[i].timer.getDuration() >= intervalArray[i].duaration)
				{
					const ele= intervalArray[i];
					ele.onInterval();
					ele.timer.reset();
					ele.iterationCount+= 1;
					if(ele.maxIterations !== -1 && ele.iterationCount >= ele.maxIterations)
					{
						ele.onIntervalEnd && ele.onIntervalEnd();
						intervalArray.splice(i, 1);
					}
				}
			}
		}
	};

	return new Interval;
})();

//------------------------------------------------------------------------
export function getRandomNumber(min= 0, max= 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
//------------------------------------------------------------------------
export const getRandomVector= (limit_x= (width / 2), limit_y= (height / 2)) => {
	let rand= Math.random();
	const x= rand >= 0.5 ? rand * limit_x : -rand * limit_x;
	rand= Math.random();
	const y= rand >= 0.5 ? rand * limit_y : -rand * limit_y;
	return new Vector(x, y);
};
//------------------------------------------------------------------------
export function getRandomColor() 
{
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) 
	color += letters[Math.floor(Math.random() * 16)];
		return color;
}
//------------------------------------------------------------------------
export function drawVector(pos, vel= pos, color= "red")
{
	context.save();
	context.beginPath();
	context.strokeStyle= color;
	context.translate(pos.x, pos.y);
	context.rotate(vel.getAngle());
	context.moveTo(0, 0);
	context.lineTo(30, 0);
	context.lineTo(23, -5);
	context.moveTo(30, 0);
	context.lineTo(23, 5);
	context.stroke();
	context.restore();
}
//------------------------------------------------------------------------
export function clone_particle(original)
{
	var clone= new particle(0, 0, 0, 0, 0);
		clone.position.x= original.position.x + 0;
		clone.position.y= original.position.y + 0;
		clone.velocity.setMag(original.velocity.getMag() + 0);
		clone.velocity.setAngle(original.velocity.getAngle() + 0);
		clone.size= original.size;
		clone.color= original.color;

	return clone;
}
//------------------------------------------------------------------------
export function Circle2CircleCollision(b1, b2)
{
	var x= Math.abs(b1.position.x - b2.position.x);
	var y= Math.abs(b1.position.y - b2.position.y);
	return (((x * x) + (y * y)) <= ((b1.collider.radius + b2.collider.radius) * (b1.collider.radius + b2.collider.radius)));
}
//------------------------------------------------------------------------
export function box2BoxCollision(b1, b2)
{
	if(b1.position.x >= b2.position.x - b2.width && b1.position.x <= b2.position.x + b2.width && b1.position.y >= b2.position.y - b2.height && b1.position.y <= b2.position.y + b2.height) 
	{
		return true;
	}
	else
		return false;
}
//------------------------------------------------------------------------
export function cirlce2WalllCollision(ref)
{
	let size, flag= false;

	let position= new Vector(ref.position.x, ref.position.y);
	let resultantVelocity= new Vector(ref.velocity.x, ref.velocity.y);
	size= ref.collider.radius; 

	if(ref.position.x >= width / 2 - size || ref.position.x <= -width / 2 + size)
	{
		resultantVelocity.x= -resultantVelocity.x;
		position.x= (ref.position.x >= width / 2 - size) ? ((width / 2) - (size + 1)) : (-(width / 2) + (size - 1));
		ref.position= position;
		flag= true;
	}

	if(ref.position.y >= height / 2 - size || ref.position.y <= -height / 2 + size)
	{
		resultantVelocity.y= -resultantVelocity.y;
		position.y= (ref.position.y >= height / 2 - size) ? ((height / 2) - (size + 1)) : (-(height / 2) + (size - 1));
		ref.position= position;
		flag= true;
	}
	
	if(flag === true)
	{
		return resultantVelocity;
	}
	else
		return ref.velocity; 
}
//------------------------------------------------------------------------
export function uncolide(pt1, pt2)
{
	const watchDog= new realWorldTimer();
	while(Circle2CircleCollision(pt1, pt2) && watchDog.getDuration() < 5000)
	{
		var nudge= new Vector(0, 0);
		nudge.setMag(1);
		var tta= Math.atan2(pt1.position.y - pt2.position.y, pt1.position.x - pt2.position.x);
		//nudge.setAngle(tta);
		//pt1.position.add(nudge);
		nudge.setAngle(tta + Math.PI);
		pt2.position= pt2.position.add(nudge);
	}
}
//------------------------------------------------------------------------
export function unStackObjects(array)
{
	for(var e1= 0; e1 < array.length; e1++)
		for(var e2= e1; e2 < array.length ; e2++)
		{
			if(e1 == e2)
				continue;
			while(Circle2CircleCollision(array[e1], array[e2]))
			{
				uncolide(array[e1], array[e2]);
			}
		}
}
//------------------------------------------------------------------------
export function wrappAround(ref)
{
	if(ref.position.x >= (width / 2) + ref.size * 1 || ref.position.x <= -width / 2 - ref.size * 1)
	{
		ref.position.x= Math.sign(ref.position.x) * (-width / 2) + (Math.sign(ref.position.x) * 1); 
	}
	if(ref.position.y >= height / 2 + ref.size * 1 || ref.position.y <= (-height / 2) - ref.size * 1)
	{
		ref.position.y= Math.sign(ref.position.y) * (-height / 2) + (Math.sign(ref.position.y) * 1);
	}
}
//------------------------------------------------------------------------
export function draw_bounding_circle(pos, radius= 20)
{
	context.beginPath();
	context.strokeStyle= "white";
	context.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
	context.stroke();
}
//------------------------------------------------------------------------
export function fullscreen()
{
   if(document.getElementById('my_canvas').webkitRequestFullScreen) 
       document.getElementById('my_canvas').webkitRequestFullScreen();
  else 
    document.getElementById('my_canvas').mozRequestFullScreen();    
}
//------------------------------------------------------------------------

export function circleRenderer(obj, color= "white", fill= true)
{
	context.save();
	context.translate(obj.position.x, obj.position.y);
	context.beginPath();
	context.fillStyle= color;
	context.arc(0, 0, obj.collider.radius, 0, Math.PI * 2);
	if(fill) context.fill();
	else context.stroke();
	context.restore();
};

//------------------------------------------------------------------------

export const drawGrid= (totalSize= 100, color= "#0080000f") => {
	context.save();
	context.beginPath();
	context.strokeStyle= color;
	context.lineWidth= 1;

	const pixelsPerUnit= Math.floor(width / totalSize);

	const top0= height / 2;
	for(let i= -width; i < width; i+= pixelsPerUnit)
	{
		context.moveTo(i, top0);
		context.lineTo(i, -top0);
	}

	const left0= width / 2;
	for(let i= -height; i < height; i+= pixelsPerUnit)
	{
		context.moveTo(left0, i);
		context.lineTo(-left0, i);
	}

	context.stroke();
	context.restore();
};

/*for(let i= 0; i < Math.floor(accumulatedTime / deltaTime); i++)
{
	Update();
	accumulatedTime-= deltaTime;
}

while(accumulatedTime > deltaTime)
{
	if(watchDog < 1000) watchDog++
	else 
	{
		watchDog= 0;
		break;
	};
	clearCanvas();
	drawGrid();
	Update();
	accumulatedTime-= deltaTime;
}
*/

