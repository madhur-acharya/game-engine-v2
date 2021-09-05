import EventSystem from "./eventSystem.js";
import {GameObject} from "./gameObject.js";
import {TimeOut, Interval, drawGrid, Coroutine} from "./utilityFunctions.js";
import {bulkLoadImages} from "./constants.js";
import InitialBehaviour from "./initialBehaviour.js";
import {Collider, VGRenderer, SpriteRenderer} from "./components/components.js";

import cliffside from "./assets/cliffside.png";
import tilesetSample from './assets/tiles.png';
import character from './assets/character.png';
import mario from "./assets/mario_tileset.png";

let aniId,
	lastTime= performance.now() + 16.666666666666668,
	timePerFrame= 0,
	fps= 0,
	deltaTime= 1/16,
	fpsArray= [60, 60, 60, 60, 60, 60];

window.gameObjectList= GameObject.getGameObjectList();
window.time= 0;

EventSystem.createEvent("onCanvasReady");
window.addEventListener("onCanvasReady", () => {
	console.log("canvasReady");
	clearCanvas();

	bulkLoadImages({
		"tilesetSample": tilesetSample,
		"tilesetClifside": cliffside,
		"character": character,
		"mario": mario,
	})
	.then(imgMp => {
		InitialBehaviour();
		console.log(gameObjectList);
		getNewFrame();
	})
	.catch(err => {
		console.log(err);
	});
});

window.addEventListener("load", () => {	

	console.log("DOM Loaded");

	window.canvas= document.getElementById("my_canvas");
	window.width= canvas.width= window.innerWidth;
	window.height= canvas.height= window.innerHeight;
	window.context= canvas.getContext("2d");
	
	context.imageSmoothingEnabled= false;
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
	if(event.keyCode === 27)
	{
		window.alert("PAUSED!");
		return;
	}
});

const clearCanvas= () => {
	context.fillStyle= "black";
	context.fillRect(-width / 2, -height / 2, width, height);
	//context.fillRect(0, 0, width, height);
};

const getNewFrame= () => {
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
		gameObjectList[i].runExecutables();
	}

	nurdyStats2.innerHTML= gameObjectList.length;
};

