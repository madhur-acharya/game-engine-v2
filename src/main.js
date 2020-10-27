import EventSystem from "./eventSystem.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import InitialBehaviour from "./initialBehaviour.js";
import {GameObject} from "./gameObject.js";
import {Collider, VGRenderer, SpriteRenderer} from "./components.js";
import tileset from "./assets/mario_tileset.png";

let aniId,
	lastTime= performance.now() + 16.666666666666668,
	timePerFrame= 0,
	accumulatedTime= 0,
	fps= 0,
	deltaTime= 1/16,
	watchDog= 0,
	stepMode= false,
	fpsArray= [60, 60, 60, 60, 60, 60];

window.gameObjectList= GameObject.getGameObjectList();
window.time= 0;
window.isPaused= false;

EventSystem.createEvent("onCanvasReady");

window.addEventListener("load", () => {	

	console.log("DOM Loaded");

	window.canvas= document.getElementById("my_canvas");
	window.width= canvas.width= window.innerWidth;
	window.height= canvas.height= window.innerHeight;
	window.context= canvas.getContext("2d");

	context.translate(width / 2, height / 2);
	context.transform(1, 0, 0, -1, 0, 0);

	//context.transform(1, 0, 0, -1, 0, canvas.height); /*for cartecian cordinate system with origin at bottom left of screen*/

	context.lineWidth= 1;

	window.framerateTag= document.getElementById("framerate");
	window.nurdyStats= document.getElementById("nurdy_stats");
	window.nurdyStats2= document.getElementById("nurdy_stats2");
	window.nurdyStats3= document.getElementById("nurdy_stats3");

	EventSystem.dispatchEvent("onCanvasReady");
});

window.addEventListener("keyup", event => {
	event.preventDefault();
	const temp= isPaused;

	if(event.keyCode === 27)
	{
		isPaused= !isPaused; 
		stepMode= false;
	}
	else if(event.keyCode === 16)
	{
		if(stepMode === false)
		{
			stepMode= true;
		}
		else
		{
			lastTime= performance.now() - 16.66;
			getNewFrame();
		}
	}

	if(temp !== isPaused && !isPaused)
	{
		lastTime= performance.now() - 16.66;
		getNewFrame();
	}
});

window.addEventListener("onCanvasReady", () => {
	console.log("canvasReady");
	clearCanvas();

	window.sprite= new Image();
	sprite.src= tileset;
	sprite.addEventListener("load", () => {
		InitialBehaviour();

		for(let i= 0; i < gameObjectList.length; i++)
		{
			gameObjectList[i].script.Start();
		}
		
		console.log(gameObjectList);

		firstFrame();
	});
});

const clearCanvas= () => {
	context.fillStyle= "black";
	context.fillRect(-width / 2, -height / 2, width, height);
	//context.fillRect(0, 0, width, height);
};

const firstFrame= () => {
	aniId= requestAnimationFrame((timestamp) => {
		timePerFrame= (timestamp - lastTime);
		time+= timePerFrame;
		lastTime= timestamp;
		deltaTime= timePerFrame / 16.666666666666668;

		clearCanvas();
		Update();
		getNewFrame();
	});
};

const getNewFrame= () => {
	
	if(isPaused)
	{
		context.save();
		context.scale(1, -1);
		context.fillStyle = "white";
		context.font = "50px impact";
		context.textAlign = "center";
		context.fillText("PAUSED!", 0, -100);
		context.restore();
		cancelAnimationFrame(aniId);
	}
	else
	{
		aniId= requestAnimationFrame((timestamp) => {

			timePerFrame= (timestamp - lastTime);
			time+= timePerFrame;
			lastTime= timestamp;
			deltaTime= timePerFrame / 16.666666666666668;

			fps= Math.ceil(1000 / timePerFrame);
			fpsArray.unshift(fps);
			fpsArray.pop();

			framerateTag.innerHTML= "FPS: " + Math.round(fpsArray.reduce((accu, curr) => accu + curr, 0) / 6);
			nurdyStats.innerHTML= "Time: " + Math.floor(time / 1000);

			const calcsPerFrame= Math.floor(timePerFrame / 16.666666666666668) || 1;

			//for(let i= 0; i < 100000000; i++);
			for(let i= 0; i < calcsPerFrame; i++)
			{
				clearCanvas();
				Update();
			}

			if(!stepMode)
			{
				getNewFrame();
			}
			
		});
	}
};

const Update= () => {

	TimeOut.update();
	Interval.update();
	Coroutine.run();

	let length= 0;

	for(let i= 0; i < gameObjectList.length; i++)
	{
		gameObjectList[i].runExecutables();
	}

	Collider.computeCollisionDetection();
	SpriteRenderer.render();
	VGRenderer.render();

	nurdyStats2.innerHTML= length;
};

