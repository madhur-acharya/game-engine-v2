import {ImageLoader} from "../utilityFunctions.js";
import RenderPipeline from "../renderPipeline.js";
import Camera from "./camera.js";
import Generic from "./generic.js";

export class Tile extends Generic{
	constructor(
		spriteSheet, 
		alias= "#", 
		spriteX= 0, 
		spriteY= 0, 
		spriteWidth= 64, 
		spriteHeight= 64, 
		drawX= 0, 
		drawY= 0, 
		drawWidth= spriteWidth, 
		drawHeight= spriteHeight, 
	)
	{
		super();
		this.spriteSheet= spriteSheet;
		this.spriteX= spriteX;
		this.spriteY= spriteY;
		this.spriteWidth= spriteWidth;
		this.spriteHeight= spriteHeight;
		this.drawWidth= drawWidth;
		this.drawHeight= drawHeight;
		this.alias= alias;
		this.drawX= drawX;
		this.drawY= drawY;
	}

	draw()
	{
		context.save();
		context.translate(this.drawX, this.drawY);
		context.drawImage(this.spriteSheet, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, 0, 0, this.drawWidth, this.drawHeight);
		context.restore();
	}
}

class TileEngine extends Generic{
	constructor(layer, tileAtlas= {}, spriteMap= {}, levelData, totalCellsHorizontal= 16, totalCellsVertical= 16, tileSize= 64)
	{
		super();

		this.layer= layer;
		this.type= "TileEngine";
		this.ready= true;
		this.spriteMap= spriteMap;
		this.tileAtlas= tileAtlas;
		this.levelData= levelData;
		this.totalCellsHorizontal= totalCellsHorizontal;
		this.totalCellsVertical= totalCellsVertical;
		this.tileSize= tileSize;
		this.camera= new Camera(window.width, window.height);

		// this.init();
	}

	init() {
		const hirizontalScale= window.width / this.camera.width;
		const verticalScale= window.height / this.camera.height;
		const scaleFactor= Math.min(hirizontalScale, verticalScale);

		console.log("Screen size:", this.camera.width, this.camera.height);
		console.log("Scale:", hirizontalScale, verticalScale);
		console.log("scaleFactor:", scaleFactor, this.tileSize * scaleFactor);

		this.scaleFactor= scaleFactor;
		this.trueTileSize= Math.floor(this.tileSize * scaleFactor);

		for(let k in this.spriteMap) {
			this.spriteMap[k].drawWidth= this.trueTileSize;
			this.spriteMap[k].drawHeight= this.trueTileSize;
		}
	}

	Setup= obj => {
		this.gameObject= obj;
	}

	Update= delta => {
		RenderPipeline.DispatchDraw(this);
	}

	attachCamera= cam => {
		this.camera= cam;
		this.init();
	}

	getTile= (row, col) => {
		return this.levelData[row]?.[col];
	}

	draw= () => {
		const cameraPos= this.camera.position;
		const rowStart= Math.max(Math.floor(cameraPos.y / this.tileSize), 0);
		const colStart= Math.max(Math.floor(cameraPos.x / this.tileSize), 0);
		const totalRows= Math.floor(this.camera.height / this.tileSize);
		const totalCols= Math.floor(this.camera.width / this.tileSize);

		for(let row= 0; row < totalRows; row++)
		{
			for(let col= 0; col < totalCols; col++)
			{
				const alias= this.getTile(row + rowStart, col + colStart);
				if(!alias) continue;
				const tile= this.spriteMap[alias];
				tile.drawX= col * this.trueTileSize;
				tile.drawY= row * this.trueTileSize;
				tile.draw();
			}
		}
	}
}

export default TileEngine;

