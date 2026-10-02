import Input from "../../src/input.js";
import RenderPipeline from "../../src/renderPipeline.js";
import Vector from "../../src/vector.js";
import Camera from "../../src/components/camera.js";
import ScreenManager, {Screen} from "../../src/components/screen.js";
import {GameObject} from "../../src/gameObject.js";
import Generic from "../../src/components/generic.js";
import {TextRenderer} from "../../src/components/textRenderer.js";


class LevelSelector extends Generic{
	levels= {};

	constructor(gameObject, layer)
	{
		super();
		this.gameObject= gameObject;

		this.layer= layer;
		const sidebarwidth= window.width * 0.25;
		const bottombarHeight= window.height * 0.33;
		this.camera= new Camera(sidebarwidth, bottombarHeight);
		this.screen= new Screen(new Vector(0, 0), this.camera.width, this.camera.height);
		ScreenManager.addScreen("left", this.screen);

		this.saveButton= new GameObject();
		this.saveButton.position= new Vector(0, this.camera.height);
		this.txtComp= new TextRenderer(this.saveButton, 5);
		this.txtComp.color= "green";
		this.saveButton.AddComponent(this.txtComp);
		this.txtComp.setScreen(this.screen);
		this.txtComp.setText("Save Level!");
		this.ready= true;

		Input.addClickHandler("saveLevel", () => this._saveLevel());
	}

	_saveLevel(){
		if(ScreenManager.ACTIVE_SCREEN != this.screen.key) return;
		console.log("Saving level...");

		const serealizedLevels= {};
		for(let key in this.levels){
			const ref= this.levels[key];
			serealizedLevels[key]= {
				tileIndex: Object.entries(ref.tileIndex).reduce((accu, [k, e]) => {
					return {...accu, [k]: e.serialize()};
				}, {}),
				tileMap: ref.tileMap,
			}
		}
		// console.log(serealizedLevels);

		fetch('/devtools/tileEditor', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(serealizedLevels),
		})
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(err => console.log(err));
	}

	loadAllLevels() 
	{
		const levelData= {};
		fetch("/devtools/tileEditor/getlevelindex").then(res => res.json())
		.then(list => {
			Promise.all(list.map(lvl => {
				fetch(`/devtools/tileEditor/getLevel/${lvl}`).then(res => res.json())
				.then(data => {
					levelData[lvl]= data;
				})
			}))
			.then(() => {
				this.levels= levelData;
			});
		});
	};

	addNewLevel(name, maxColumns, maxRows, tileIndex, tileMap=null)
	{
		this.levels[name]= {
			tileIndex: tileIndex,
			tileMap: tileMap,
		}
		if(!tileMap){
			const tileMap= [];
			for(let i=0; i<maxRows; i++) {
				tileMap.push(Array(maxColumns));
			};
			this.levels[name].tileMap= tileMap;
		}
	}

	getLevel(name)
	{
		return this.levels[name];
	}

	Update(delta)
	{
		RenderPipeline.DispatchDraw(this);
	}

	draw()
	{

		context.save();
		context.fillStyle= 'teal';
		context.fillRect(0, 0, this.screen.width, this.camera.height);
		context.restore();


		context.save();
		context.fillStyle= 'orange';
		context.fillRect(0, this.camera.height-20, this.screen.width, 50);
		context.restore();
	}
}


export default LevelSelector;


