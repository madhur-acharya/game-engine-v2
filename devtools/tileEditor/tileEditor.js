import TileEngine from "../../src/components/tileEngine.js";
import {TextRenderer} from "../../src/components/textRenderer.js";
import Input from "../../src/input.js";
import Vector from "../../src/vector.js";
import {GameObject} from "../../src/gameObject.js";
import {drawVector} from "../../src/utilityFunctions.js";
import ScreenManager from "../../src/components/screen.js";

class TileEditor extends TileEngine{
	selection= {
		tilePos: new Vector(),
		colStart: 0,
		rowStart: 0,
		rowStartCam: 0,
		colStartCam: 0,
	};

	constructor(conf= {}, screen, sheetWidth= 50, sheetHeight= 50){
		super(
			conf.camera,
			conf.layer, 
			conf.tileIndex,
			conf.tileMap, 
			conf.tileSize,
		);
		this.setScreen(screen);
		this.init();

		this.mousePtr= new GameObject();
		this.txtComp= new TextRenderer(3);
		this.txtComp.color= "crimson";
		this.mousePtr.AddComponent(this.txtComp);
		this.txtComp.setScreen(this.screen);
		this.ready= true;


		Input.addClickHandler("tileApply", () => this._tilePaintHandler());
	}

	updatetileMap(lvdta){
		this.tileMap= lvdta;
	}

	setActiveTile(tileNumber){
		this.activeSelectedTile= tileNumber;
	}

	_tilePaintHandler(){
		if(ScreenManager.ACTIVE_SCREEN != this.screen.key) return;

		if(this.selection.activeCell){
			this.tileMap[this.selection.activeCell.x][this.selection.activeCell.y]= this.activeSelectedTile;
		}
	}

	Update(delta){
		if(ScreenManager.ACTIVE_SCREEN != this.screen.key) return super.Update(delta);

		const cameraPos= this.camera.position;
		const mousePos= Input.worldToScreenPoint(this.screen);

		const rowStartCam= Math.floor(cameraPos.y / this.trueTileSize);
		const colStartCam= Math.floor(cameraPos.x / this.trueTileSize);
		const offsetX= (colStartCam * this.trueTileSize) - cameraPos.x;
		const offsetY= (rowStartCam * this.trueTileSize) - cameraPos.y;

		const deltaPos= new Vector(mousePos.x - offsetX, mousePos.y - offsetY);
		const rowStart= Math.floor(deltaPos.y / this.trueTileSize);
		const colStart= Math.floor(deltaPos.x / this.trueTileSize);

		this.selection= {
			colStart, rowStart, rowStartCam, colStartCam,
			tilePos: new Vector(
				(colStart * this.trueTileSize) + offsetX, 
				(rowStart * this.trueTileSize) + offsetY
			),
			activeCell: new Vector(rowStartCam+ rowStart, colStartCam+ colStart),
		}

		const vel= 8;
		const prevCamPos= this.camera.position.clone();
		const limitL= new Vector(0, 0);

		const maxCol= this.tileMap[0].length - Math.floor(this.screen.width / this.trueTileSize);
		const maxRow= this.tileMap.length - Math.floor(this.screen.height / this.trueTileSize);

		const limitR= new Vector(maxCol * this.trueTileSize, maxRow * this.trueTileSize);
		if(Input.getKey("w")) this.camera.position.addTo(new Vector(0, -vel));
		if(Input.getKey("s")) this.camera.position.addTo(new Vector(0, vel));
		if(Input.getKey("a")) this.camera.position.addTo(new Vector(-vel, 0));
		if(Input.getKey("d")) this.camera.position.addTo(new Vector(vel, 0));
		this.camera.position.limit(limitL, limitR);

		const mPos= Input.worldToScreenPoint(this.screen);
		this.mousePtr.position= new Vector(mPos.x, mPos.y);
		this.txtComp.setText(`${parseInt(mPos.x)}:${parseInt(mPos.y)}`);


		if(Input.IsMouseDown) this._tilePaintHandler();


		// ---
		super.Update(delta);
	}

	draw(){
		super.draw();

		const tilePos= this.selection.tilePos;
		const rowStart= this.selection.rowStart;
		const colStart= this.selection.colStart;
		const rowStartCam= this.selection.rowStartCam;
		const colStartCam= this.selection.colStartCam;

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
		context.fillRect(tilePos.x - textLenDiff, tilePos.y+this.trueTileSize+5, textWidth+15, 18);
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
