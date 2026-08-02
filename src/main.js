import {GameObject} from "./gameObject.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import RenderPipeline from "./renderPipeline.js";
import EventSystem from "./eventSystem.js";
import "./startup.js";
import ScreenManager, {Screen} from "./components/screen.js";
import Vector from "./vector.js";
import Camera from "./components/camera.js";

let aniId,
	lastTime= performance.now() + 16.666666666666668,
	timePerFrame= 0,
	fps= 0,
	deltaTime= 1/16,
	fpsArray= [60, 60, 60, 60, 60, 60];

window.gameObjectList= GameObject.getGameObjectList();
window.time= 0;
window.timestamp= 0;
window.deltaTime= 0;
window.RenderPipeline= RenderPipeline;

window.addEventListener("load", () => {	
	console.log("DOM Loaded");

	window.canvas= document.getElementById("my_canvas");
	ScreenManager.init(new Screen(new Vector(), window.innerWidth, window.innerHeight));
	window.defaultScreen= ScreenManager.getDefault();
	window.width= canvas.width= window.defaultScreen.width;
	window.height= canvas.height= window.defaultScreen.height;
	window.camera= new Camera(window.defaultScreen.width, window.defaultScreen.height);

	window.context= canvas.getContext("2d");
	context.imageSmoothingEnabled= false;

	window.framerateTag= document.getElementById("framerate");
	window.nurdyStats= document.getElementById("nurdy_stats");
	window.nurdyStats1= document.getElementById("nurdy_stats1");
	window.nurdyStats2= document.getElementById("nurdy_stats2");
	window.nurdyStats3= document.getElementById("nurdy_stats3");
	window.nurdyStats4= document.getElementById("nurdy_stats4");

	EventSystem.dispatchEvent("onCanvasReady");
});

window.addEventListener("keyup", event => {
	event.preventDefault();
	if(event.keyCode === 27)
	{
		window.isPaused= !window.isPaused;
		if(!window.isPaused) getNewFrame();
		return;
	}
});


const clearCanvas= () => {
	context.fillStyle= "black";
	context.fillRect(0, 0, width, height);
};

const getNewFrame= () => {
	if(window.isPaused) return;
	aniId= requestAnimationFrame((timestamp) => {

		timePerFrame= (timestamp - lastTime);
		time+= timePerFrame;
		lastTime= timestamp;
		deltaTime= timePerFrame / 16.666666666666668;
		window.timestamp= timestamp;
		window.deltaTime= deltaTime;
		window.time= time;

		fps= Math.ceil(1000 / timePerFrame);
		fpsArray.unshift(fps);
		fpsArray.pop();

		framerateTag.innerHTML= "FPS: " + Math.round(fpsArray.reduce((accu, curr) => accu + curr, 0) / 6);
		nurdyStats.innerHTML= "Time: " + (time / 1000).toFixed(2);

		const calcsPerFrame= Math.floor(timePerFrame / 16.666666666666668) || 1;

		clearCanvas();
		Update();
		getNewFrame();
	});
};

const Update= () => {
	TimeOut.update();
	Interval.update();
	Coroutine.run();

	for(let i= 0; i < gameObjectList.length; i++)
	{
		gameObjectList[i].Update();
	}

	RenderPipeline.Render();
	nurdyStats2.innerHTML= gameObjectList.length;
};


window.addEventListener("onDispatchNewFrame", () => {
	getNewFrame();
});



