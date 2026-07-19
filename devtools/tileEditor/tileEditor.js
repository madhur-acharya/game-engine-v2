import TileEngine from "../../src/components/tileEngine.js";
import {TextRenderer} from "../../src/components/textRenderer.js";
import Input from "../../src/input.js";
import Vector from "../../src/vector.js";
import Camera from "../../src/components/camera.js";
import {GameObject} from "../../src/gameObject.js";
import {drawVector} from "../../src/utilityFunctions.js";

class TileEditor extends TileEngine{
	constructor(conf= {}, sheetWidth= 50, sheetHeight= 50){
		super(
			conf.layer, 
			conf.tileAtlas,
			conf.spriteMap,
			conf.levelData, 
			conf.tileSize,
		);

		this.gameObject= new GameObject();
		this.gameObject.AddComponent(this);

		// window.camera= new Camera(256, 256);
		// window.camera= new Camera(760, 512);
		// window.camera= new Camera(1440, 900);
		window.camera= new Camera(2000, 2000);
		// window.camera= new Camera(window.width, window.height);
		window.camera.moveTo(new Vector(0, 0));
		this.camera= window.camera;
		this.attachCamera(this.camera);

		this.mousePtr= new GameObject();
		this.txtComp= new TextRenderer(4);
		this.txtComp.color= "crimson";
		this.mousePtr.AddComponent(this.txtComp);

		this.ready= true;
	}

	init(){
		super.init();
	}

	Update(delta){
		const vel= 8;
		const prevCamPos= this.camera.position.clone();
		const limitL= new Vector(0, 0);
		const limitR= new Vector(1000, 1000);
		if(Input.getKey("w")) this.camera.position.addTo(new Vector(0, -vel));
		if(Input.getKey("s")) this.camera.position.addTo(new Vector(0, vel));
		if(Input.getKey("a")) this.camera.position.addTo(new Vector(-vel, 0));
		if(Input.getKey("d")) this.camera.position.addTo(new Vector(vel, 0));
		// this.camera.position.limit(limitL);

		const mPos= Input.getMousePos();
		this.mousePtr.position= new Vector(mPos.x, mPos.y);
		this.txtComp.setText(`${mPos.x}:${mPos.y}`);

		// ---
		super.Update(delta);
	}

	draw(){
		// ------------------------------------------------------
		{
			const cameraPos= this.camera.position;
			const rowStart= Math.floor(cameraPos.y / this.trueTileSize);
			const colStart= Math.floor(cameraPos.x / this.trueTileSize);
			const totalRows= Math.ceil(this.camera.height / this.trueTileSize);
			const totalCols= Math.ceil(this.camera.width / this.trueTileSize);

			for(let row= 0; row <= totalRows; row++)
			{
				for(let col= 0; col <= totalCols; col++)
				{
					const alias= this.getTile(row + rowStart, col + colStart);
					if(!alias) {
						if(!this.defaultSprite) continue;
						const tile= this.defaultSprite;
						tile.drawX= (col * this.trueTileSize);
						tile.drawY= (row * this.trueTileSize);
						tile.draw();
					} else {
						const tile= this.spriteMap[alias];
						tile.drawX= (col * this.trueTileSize);
						tile.drawY= (row * this.trueTileSize);
						tile.draw();
					}
				}
			}
		}
		// ------------------------------------------------------

		const cameraPos= this.camera.position;
		const mousePos= this.mousePtr.position;
		const rowStart= Math.floor(mousePos.y / this.trueTileSize);
		const colStart= Math.floor(mousePos.x / this.trueTileSize);
		const tilePos= new Vector(colStart, rowStart).multiply(this.trueTileSize);

		const rowStartCam= Math.floor(cameraPos.y / this.trueTileSize);
		const colStartCam= Math.floor(cameraPos.x / this.trueTileSize);
		const cellPosX= rowStart + rowStartCam;
		const cellPosY= colStart + colStartCam;

		context.save();
		context.translate(0, 0);
		context.strokeWidth= "7px";
		context.strokeStyle= "cyan";
		context.strokeRect(tilePos.x, tilePos.y, this.trueTileSize, this.trueTileSize);

		const txt= `${cellPosX}:${cellPosY}`;
		context.fillStyle= "black";
		context.font= "14px sans-serif";
		const textWidth= context.measureText(txt).width;
		context.fillRect(tilePos.x-5, tilePos.y+this.trueTileSize+5, textWidth+10, 18);
		context.fillStyle= "white";
		context.fillText(txt, tilePos.x, tilePos.y+this.trueTileSize+20);

		context.restore();

		// const drawCam= new Vector(-cameraPos.x, -cameraPos.y);
		// drawVector(new Vector(0, 0), mousePos, "blue", false);
	}
};

export default TileEditor;
