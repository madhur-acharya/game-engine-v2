import {ImageLoader} from "../utilityFunctions.js";
import RenderPipeline from "../renderPipeline.js";
import Camera from "./camera.js";
import Generic from "./generic.js";
import {getImages} from "../constants.js";

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
	constructor(layer, tileAtlas= {}, spriteMap= {}, levelData, tileSize= 64)
	{
		super();

		this.layer= layer;
		this.type= "TileEngine";
		this.ready= true;
		this.spriteMap= spriteMap;
		this.tileAtlas= tileAtlas;
		this.levelData= levelData;
		this.tileSize= tileSize;
		this.camera= new Camera(window.width, window.height);
		this.defaultSprite= spriteMap["#"];

		// this.init();
	}

	init() {
		const horizontalScale= this.camera.width;
		const verticalScale= this.camera.height;
		this.scaleFactor= 1;
		this.trueTileSize= this.tileSize;
		this.totalCellsHorizontal= this.levelData[0].length * this.tileSize;
		this.totalCellsVertical= this.levelData.length * this.tileSize;

		this.scaleFactor= Math.max(window.width, window.height) / Math.max(horizontalScale, verticalScale);
		this.trueTileSize= this.tileSize * this.scaleFactor;

		console.log("TileMap Size:", this.totalCellsHorizontal, this.totalCellsVertical);
		console.log("Screen size:", parseFloat(horizontalScale.toFixed(2)), parseFloat(verticalScale.toFixed(2)));
		console.log("trueTileSize:", this.trueTileSize);

		for(let k in this.spriteMap) {
			this.spriteMap[k].drawWidth= this.trueTileSize;
			this.spriteMap[k].drawHeight= this.trueTileSize;
		}
	}

	Update(delta){
		RenderPipeline.DispatchDraw(this);
	}

	attachCamera= cam => {
		this.camera= cam;
		this.init();
	}

	getTile= (row, col) => {
		return this.levelData[row]?.[col];
	}

	draw(){
		const cameraPos= this.camera.position;
		const rowStart= Math.floor(cameraPos.y / this.trueTileSize);
		const colStart= Math.floor(cameraPos.x / this.trueTileSize);
		const endRow= rowStart + Math.ceil(this.camera.height / this.trueTileSize);
		const endCol= colStart + Math.ceil(this.camera.width / this.trueTileSize);

		const offsetX= (colStart * this.trueTileSize) - cameraPos.x;
		const offsetY= (rowStart * this.trueTileSize) - cameraPos.y;

		for(let row= rowStart; row <= endRow; row++)
		{
			for(let col= colStart; col <= endCol; col++)
			{
				const alias= this.getTile(row, col);
				let tile;
				if(alias == undefined || !this.spriteMap[alias]) {
					if(!this.defaultSprite) continue;
					tile= this.defaultSprite;
				} else {
					tile= this.spriteMap[alias];
				}
				tile.drawX= ((col - colStart) * this.trueTileSize) + offsetX;
				tile.drawY= ((row - rowStart) * this.trueTileSize) + offsetY;
				tile.draw();
			}
		}
	}
}

export default TileEngine;

