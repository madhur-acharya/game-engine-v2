import {ImageLoader} from "../utilityFunctions.js";

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

	Draw()
	{
		context.save();
		context.scale(1, -1);
		context.translate(this.drawX + (this.drawWidth/2), -(this.drawY + (this.drawHeight/2)));
		context.drawImage(this.spriteSheet, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, -this.drawWidth/2, -this.drawHeight/2, this.drawWidth, this.drawHeight);
		context.restore();
	}
}

class TileEngine{
	constructor(tileAtlas= {}, spriteMap= {}, levelData, totalCellsHorizontal= 16, totalCellsVertical= 16, tileSize= 64)
	{
		this.ready= false;
		this.spriteMap= spriteMap;
		this.tileAtlas= tileAtlas;
		this.levelData= levelData;
		this.totalCellsHorizontal= totalCellsHorizontal;
		this.totalCellsVertical= totalCellsVertical;
		this.tileSize= tileSize;
	}

	Start= obj => {
		this.gameObject= obj;
	}

	Update= delta => {
		this.render();
	}

	getTile= (Lix, col, row) => {
		return this.levelData[Lix][row * this.totalCellsHorizontal + col];
	}

	drawLayer= layerIndex => {
		for(let col= 0; col < this.totalCellsHorizontal; col++)
		{
			for(let row= 0; row < this.totalCellsVertical; row++)
			{
				const alias= this.getTile(layerIndex, col, row);
				const tile= this.spriteMap[alias];
				tile.Draw();
				/*if(tile !== 0) 
				{ // 0 => empty tile
					context.save();
					context.scale(1, -1);
					context.translate(-width/2, -height/2);
					context.drawImage(
						tile.spriteSheet, // image
						tile.spriteX, // source x
						0, // source y
						this.tileSize, // source width
						this.tileSize, // source height
						c * this.tileSize,  // target x
						r * this.tileSize, // target y
						this.tileSize, // target width
						this.tileSize // target height
					);
					context.restore();
				}*/
			}
		}
	}

	render= () => {
		if(!this.ready) return;

		this.drawLayer(0);
		this.drawLayer(1);
	}
}

export default TileEngine;


/*
class TileEngine{
	constructor(tileAtlas= {}, spriteMap= {}, totalCellsHorizontal= 16, totalCellsVertical= 16, tileSize= 64, levelData)
	{
		this.ready= false;
		this.Loader= new ImageLoader();

		Promise.all(Object.entries(tileAtlas).map(([name, tileset]) => {
			return this.Loader.loadImage(name, tileset)
		}))
		.then(loaded => {
			this.tileAtlas= this.Loader.images;
			this.ready= true;
		})
		.catch(err => {
			console.log(err);
		});	
	}

	Start= obj => {
		this.gameObject= obj;

		this.map= {
			cols: 16,
			rows: 16,
			tsize: 64,
			tiles: [
				[
					1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
					1, 3, 3, 3, 1, 1, 3, 1, 1, 3, 3, 3, 1, 1, 3, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
					1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
					1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
					1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
				],
				[
					4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 5, 0, 0, 0, 4, 4, 0, 0, 5, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 0, 5, 4, 4, 4,
					0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 0, 0, 3, 3, 3,
					4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4, 
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 5, 0, 0, 0, 4, 4, 0, 0, 5, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4,
					4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 0, 5, 4, 4, 4,
					0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 0, 0, 3, 3, 3,
				]
			],
			getTile: (Lix, col, row) => {
				return this.map.tiles[Lix][row * this.map.cols + col];
			}
		};
	}

	Update= delta => {
		this.render();
	}

	drawLayer= layerIndex => {
		for(var c = 0; c < this.map.cols; c++) 
		{
			for(var r = 0; r < this.map.rows; r++) 
			{
				var tile = this.map.getTile(layerIndex, c, r);
				if(tile !== 0) 
				{ // 0 => empty tile
					context.save();
					context.scale(1, -1);
					context.translate(-width/2, -height/2);
					context.drawImage(
						this.tileAtlas, // image
						(tile - 1) * this.map.tsize, // source x
						0, // source y
						this.map.tsize, // source width
						this.map.tsize, // source height
						c * this.map.tsize,  // target x
						r * this.map.tsize, // target y
						this.map.tsize, // target width
						this.map.tsize // target height
					);
					context.restore();
				}
			}
		}
	}

	render= () => {
		if(!this.ready) return;

		this.drawLayer(0);
		this.drawLayer(1);
	}
}*/