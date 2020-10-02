import EventSystem from "./eventSystem.js";
import {TimeOut, Interval, drawGrid} from "./utilityFunctions.js";
import InitialBehaviour from "./initialBehaviour.js";
import {GameObject} from "./gameObject.js";
import Input from "./input.js";

let aniId,
	lastTime= 0,
	timePerFrame= 0,
	isPaused= false,
	accumulatedTime= 0,
	fps= 0,
	deltaTime= 1/16,
	watchDog= 0,
	fpsArray= [60, 60, 60, 60, 60, 60];

const getGameObjectList= GameObject.getGameObjectList();
window.time= 0;

EventSystem.createEvent("onCanvasReady");

window.addEventListener("load", () => {	
	console.log("DOM Loaded");

	window.canvas= document.getElementById("my_canvas");
	window.width= canvas.width= window.innerWidth;
	window.height= canvas.height= window.innerHeight;

	window.context= canvas.getContext("2d");
	context.translate(width / 2, height / 2);
	context.transform(1, 0, 0, -1, 0, 0);
	context.lineWidth= 3;

	//context.transform(1, 0, 0, -1, 0, canvas.height)  for cartecian cordinate system with origin at bottom left of screen

	EventSystem.dispatchEvent("onCanvasReady");

	window.framerateTag= document.getElementById("framerate");
	window.nurdyStats= document.getElementById("nurdy_stats");
	window.nurdyStats2= document.getElementById("nurdy_stats2");
	window.nurdyStats3= document.getElementById("nurdy_stats3");
});

window.addEventListener("keyup", event => {
	const temp= isPaused;
	if(event.keyCode == 27)
	{
		isPaused= !isPaused; 
	}

	if(temp !== isPaused && !isPaused)
	{
		lastTime= performance.now() - 16.66;
		getNewFrame();
	}
});

window.addEventListener("onCanvasReady", () => {
	console.log("canvasReady");
	InitialBehaviour();

	for(const obj in getGameObjectList)
	{
		getGameObjectList[obj].script.Start();
	}
	getNewFrame();
});

const clearCanvas= () => {
	context.fillStyle= "black";
	context.fillRect(-width / 2, -height / 2, width, height);
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

			getNewFrame();
		});
	}
};

const Update= () => {
	
	TimeOut.update();
	Interval.update();

	for(const obj in getGameObjectList)
	{
		getGameObjectList[obj].runExecutables();
	}

	nurdyStats2.innerHTML= Object.keys(GameObject.getGameObjectList()).length;
};

