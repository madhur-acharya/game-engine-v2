import {ImageLoader} from "../utilityFunctions.js";
import RenderPipeline from "../renderPipeline.js";
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

		const totalTilemapWidth= totalCellsHorizontal * tileSize;
		const totalTilemapHeight= totalCellsVertical * tileSize;
		const hirizontalScale= window.width / totalTilemapWidth;
		const verticalScale= window.height / totalTilemapHeight;

		console.log("Tilemap Size:", totalTilemapWidth, totalTilemapHeight);
		console.log("Scale:", hirizontalScale, verticalScale);

		this.layer= layer;
		this.type= "TileEngine";
		this.ready= true;
		this.spriteMap= spriteMap;
		this.tileAtlas= tileAtlas;
		this.levelData= levelData;
		this.totalCellsHorizontal= totalCellsHorizontal;
		this.totalCellsVertical= totalCellsVertical;
		this.tileSize= tileSize;

		this.hirizontalScale= hirizontalScale;
		this.verticalScale= verticalScale;
	}

	Setup= obj => {
		this.gameObject= obj;
	}

	Update= delta => {
		RenderPipeline.DispatchDraw(this);
	}

	getTile= (col, row) => {
		return this.levelData[row * this.totalCellsHorizontal + col];
	}

	draw= () => {
		for(let row= 0; row < this.totalCellsHorizontal; row++)
		{
			for(let col= 0; col < this.totalCellsHorizontal; col++)
			{
				const alias= this.getTile(col, row);
				const tile= this.spriteMap[alias];
				tile.drawX= col * tile.spriteWidth * this.hirizontalScale;
				tile.drawY= row * tile.spriteHeight * this.verticalScale;
				tile.drawWidth= tile.spriteWidth * this.hirizontalScale;
				tile.drawHeight= tile.spriteHeight * this.verticalScale;
				tile.draw();
			}
		}
	}
}

export default TileEngine;

