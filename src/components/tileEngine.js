import {ImageLoader} from "../utilityFunctions.js";
import RenderPipeline from "../renderPipeline.js";

export class Tile{
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
		context.scale(1, -1);
		context.translate(this.drawX + (this.drawWidth/2), -(this.drawY + (this.drawHeight/2)));
		context.drawImage(this.spriteSheet, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, -this.drawWidth/2, -this.drawHeight/2, this.drawWidth, this.drawHeight);
		context.restore();
	}
}

class TileEngine{
	constructor(layer, tileAtlas= {}, spriteMap= {}, levelData, totalCellsHorizontal= 16, totalCellsVertical= 16, tileSize= 64)
	{
		this.layer= layer;
		this.type= "TileEngine";
		this.ready= true;
		this.spriteMap= spriteMap;
		this.tileAtlas= tileAtlas;
		this.levelData= levelData;
		this.totalCellsHorizontal= totalCellsHorizontal;
		this.totalCellsVertical= totalCellsVertical;
		this.tileSize= tileSize;
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
		for(let col= 0; col < this.totalCellsHorizontal; col++)
		{
			for(let row= 0; row < this.totalCellsVertical; row++)
			{
				const alias= this.getTile(col, row);
				const tile= this.spriteMap[alias];
				tile.drawX= (col * tile.spriteWidth) - ((this.totalCellsHorizontal * this.tileSize)/2);
				tile.drawY= row * tile.spriteHeight - ((this.totalCellsVertical * this.tileSize)/2);
				tile.draw();
			}
		}
	}
}

export default TileEngine;

