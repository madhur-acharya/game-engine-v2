import TileEngine from "../../src/components/tileEngine.js";
import {TextRenderer} from "../../src/components/textRenderer.js";
import Input from "../../src/input.js";
import Vector from "../../src/vector.js";
import {GameObject} from "../../src/gameObject.js";
import {drawVector} from "../../src/utilityFunctions.js";

class TileEditor extends TileEngine{
	constructor(conf= {}, sheetWidth= 50, sheetHeight= 50){
		super(
			conf.camera,
			conf.layer, 
			conf.tileAtlas,
			conf.spriteMap,
			conf.levelData, 
			conf.tileSize,
		);

		this.gameObject= new GameObject();
		this.gameObject.AddComponent(this);
		this.mousePtr= new GameObject();
		this.txtComp= new TextRenderer(4);
		this.txtComp.color= "crimson";
		this.mousePtr.AddComponent(this.txtComp);
		this.ready= true;
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
		// // ------------------------------------------------------
		// {
		// 	const cameraPos= this.camera.position;
		// 	const rowStart= Math.floor(cameraPos.y / this.trueTileSize);
		// 	const colStart= Math.floor(cameraPos.x / this.trueTileSize);
		// 	const endRow= rowStart + Math.ceil(this.camera.height / this.trueTileSize);
		// 	const endCol= colStart + Math.ceil(this.camera.width / this.trueTileSize);

		// 	const offsetX= (colStart * this.trueTileSize) - cameraPos.x;
		// 	const offsetY= (rowStart * this.trueTileSize) - cameraPos.y;

		// 	for(let row= rowStart; row <= endRow; row++)
		// 	{
		// 		for(let col= colStart; col <= endCol; col++)
		// 		{
		// 			const alias= this.getTile(row, col);
		// 			let tile;
		// 			if(alias == undefined || !this.spriteMap[alias]) {
		// 				if(!this.defaultSprite) continue;
		// 				tile= this.defaultSprite;
		// 			} else {
		// 				tile= this.spriteMap[alias];
		// 			}
		// 			tile.drawX= (((col - colStart) * this.trueTileSize) + offsetX);
		// 			tile.drawY= (((row - rowStart) * this.trueTileSize) + offsetY);
		// 			tile.draw();
		// 			// context.strokeStyle= "blue";
		// 			// context.strokeRect(
		// 			// 	tile.drawX, tile.drawY, 
		// 			// 	this.trueTileSize, this.trueTileSize
		// 			// );
		// 		}
		// 	}
		// 	// context.strokeStyle= "black";
		// 	// for(let row= rowStart; row <= endRow; row++)
		// 	// for(let col= colStart; col <= endCol; col++)
		// 	// 	context.strokeRect(
		// 	// 		((col - colStart) * this.trueTileSize),
		// 	// 		((row - rowStart) * this.trueTileSize),
		// 	// 		this.trueTileSize, this.trueTileSize
		// 	// 	);
		// }
		// // ------------------------------------------------------

		super.draw();

		const cameraPos= this.camera.position.subtract(this.screen.origin);
		const mousePos= this.mousePtr.position;

		const rowStartCam= Math.floor(cameraPos.y / this.trueTileSize);
		const colStartCam= Math.floor(cameraPos.x / this.trueTileSize);
		const offsetX= (colStartCam * this.trueTileSize) - cameraPos.x;
		const offsetY= (rowStartCam * this.trueTileSize) - cameraPos.y;

		const deltaPos= new Vector(mousePos.x - offsetX, mousePos.y - offsetY);
		const rowStart= Math.floor(deltaPos.y / this.trueTileSize);
		const colStart= Math.floor(deltaPos.x / this.trueTileSize);

		const tilePos= new Vector(
			(colStart * this.trueTileSize) + offsetX, 
			(rowStart * this.trueTileSize) + offsetY
		);
		context.save();
		context.lineWidth= "3";
		context.strokeStyle= "crimson";
		context.strokeRect(tilePos.x, tilePos.y, this.trueTileSize, this.trueTileSize);
		context.restore();

		context.save();
		const txt= `${rowStartCam+ rowStart}:${colStartCam+ colStart}`;
		context.fillStyle= "grey";
		context.font= "14px sans-serif";
		const textWidth= context.measureText(txt).width;
		let textLenDiff= ((textWidth + 15) - this.trueTileSize) / 2
		context.fillRect(tilePos.x - textLenDiff, tilePos.y+this.trueTileSize+15, textWidth+15, 18);
		context.fillStyle= "black";
		textLenDiff= (textWidth - this.trueTileSize) / 2
		context.fillText(txt, tilePos.x - textLenDiff, tilePos.y+this.trueTileSize+20);
		context.restore();


		context.save();
		context.lineWidth= "3";
		context.strokeStyle= "orange";
		context.strokeRect(0,0, this.screen.width, this.screen.height);
		context.restore();
	}
};

export default TileEditor;
