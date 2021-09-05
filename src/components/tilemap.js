import Vector from "../vector.js";
import {GameObject} from "../gameObject.js";
import {drawGrid, drawRectangle} from "../utilityFunctions.js";

export class Tile{
	constructor(spriteSheet, alias= "#", spriteX= 0, spriteY= 0, spriteWidth= 16, spriteHeight= 16, drawX= 0, drawY= 0, drawWidth= spriteWidth, drawHeight= spriteHeight, gameObject)
	{
		this.spriteSheet= spriteSheet;
		this.spriteX= spriteX;
		this.spriteY= spriteY;
		this.spriteWidth= spriteWidth;
		this.spriteHeight= spriteHeight;
		this.drawWidth= drawWidth;
		this.drawHeight= drawHeight;
		this.alias= alias;
		this.gameObject= gameObject;
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


class Tilemap{
	constructor(level, spriteMap, totalCellsHorizontal= 32, aspectRatio= 4/3)
	{
		let tilemapWidth= width;
		let tilemapHeight= (tilemapWidth / totalCellsHorizontal) * Math.trunc(totalCellsHorizontal / aspectRatio);

		for(let i= 0; i < width/2 && tilemapHeight > height; i+= 10)
		{
			tilemapWidth-= 10;
			tilemapHeight= (tilemapWidth / totalCellsHorizontal) * Math.trunc(totalCellsHorizontal / aspectRatio);
		}

		this.tilemapWidth= tilemapWidth;
		this.tilemapHeight= tilemapHeight;
		this.type= "Tilemap";
		this.tileMatrix= [];
		this.totalCellsHorizontal= totalCellsHorizontal;
		this.totalCellsVertical= Math.trunc(totalCellsHorizontal / aspectRatio);
		this.cellSize= (tilemapWidth / totalCellsHorizontal);
		this.level= level;
		this.spriteMap= spriteMap;

		const padding= (height - (this.totalCellsVertical * this.cellSize)) / 2;

		/*for(let i= 0; i < this.totalCellsVertical; i++)
		{
			const row= [];
			for(let j= 0; j < this.totalCellsHorizontal; j++)
			{
				const tile= level[i] && level[i][j] ? spriteMap[level[i][j]]() : spriteMap["#"]()

				tile.drawX= -this.tilemapWidth/2 + (j * this.cellSize);
				tile.drawY= (height/2 - padding - (i * this.cellSize));
				tile.drawWidth= this.cellSize + 2; 
				tile.drawHeight= this.cellSize + 2;
				row.push(tile);
			}
			this.tileMatrix.push(row);
		}*/

		for(let i= 0; i < this.totalCellsVertical; i++)
		{
			const row= [];
			for(let j= 0; j < this.totalCellsHorizontal; j++)
			{
				const tile= level[i] && level[i][j] ? spriteMap[level[i][j]]() : spriteMap["#"]()

				tile.drawX= -tilemapWidth/2 + (j * this.cellSize);
				tile.drawY= -(tilemapHeight/2) + (i * this.cellSize);
				tile.drawWidth= this.cellSize + 2; 
				tile.drawHeight= this.cellSize + 2;
				row.push(tile);
			}
			this.tileMatrix.push(row);
		}

		//console.log(this.tileMatrix);
	}

	Start(obj)
	{
		this.gameObject= obj;
	}

	Update()
	{
		//drawGrid(this.totalCellsHorizontal, this.totalCellsVertical, this.tilemapWidth, this.tilemapHeight, this.cellSize, "lime");
		
		for(let i= 0; i < this.tileMatrix.length; i++)
		{
			for(let j= 0; j < this.tileMatrix[i].length; j++)
			{
				this.tileMatrix[i][j].Draw();
			}
		}
		
		/*const padding= (height - (this.totalCellsVertical * this.cellSize)) / 2;
		context.save();
		context.beginPath();
		context.lineWidth= 5;
		context.strokeStyle= "yellow";
		context.moveTo(-10, 0);
		context.lineTo(-10, height/2);
		context.moveTo(10, 0);
		//context.lineTo(10, ((this.totalCellsVertical * this.cellSize) / 2) + (padding-2));
		context.lineTo(10, height/2 - padding);
		context.stroke();
		context.restore();*/
	}

}

export class LevelManager{
	constructor(obj)
	{
		this.gameObject= obj;
		this.color= "cyan";
	}

	Start= () => {

		const level= [
			["$", "#", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "$", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "$"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "@", "@", "@", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
			["#", "#", "$", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
		];

		const spriteMap= {
			"@": () => new Tile(tileSet1, "@", 384, 0, 16, 16),
			"$": () => new Tile(tileSet2, "$", 0, 0, 16, 16),
			"#": () => new Tile(tileSet1, "#", 48, 368, 16, 16),
		};

		this.gameObject.addComponent(new Tilemap(level, spriteMap));
	}

	Update= () => {}
}

export default Tilemap;

