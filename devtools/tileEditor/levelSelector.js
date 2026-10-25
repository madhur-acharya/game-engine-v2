import Input from "../../src/input.js";
import RenderPipeline from "../../src/renderPipeline.js";
import Vector from "../../src/vector.js";
import Camera from "../../src/components/camera.js";
import ScreenManager, {Screen} from "../../src/components/screen.js";
import Generic from "../../src/components/generic.js";
import {TextRenderer} from "../../src/components/textRenderer.js";


export const LoadAllLevels= () => {
	return fetch("/devtools/tileEditor/getlevelindex").then(res => res.json())
	.then(list => {
		return Promise.all(list.map(lvl => {
			return fetch(`/devtools/tileEditor/getLevel/${lvl}`).then(res => res.json())
			.then(data => ({[lvl]: data}))
		}))
		.then(arr => {
			return arr.reduce((accu, curr) => {
				return {...accu, ...curr};
			}, {});
		});
	})
	.catch(err => {throw error});
};

class LevelSelector extends Generic{
	levels= {};

	constructor(gameObject, layer, levels)
	{
		super();
		this.gameObject= gameObject;

		this.layer= layer;
		this.levels= levels;
		const sidebarwidth= window.width * 0.25;
		const bottombarHeight= window.height * (1- 0.33);
		this.camera= new Camera(sidebarwidth, bottombarHeight);
		this.screen= new Screen(new Vector(0, 0), this.camera.width, this.camera.height);
		ScreenManager.addScreen("left", this.screen);

		this.saveButton= gameObject.NewChildGameObject();
		this.txtComp= new TextRenderer(this.saveButton, 5);
		this.txtComp.color= "green";
		this.saveButton.AddComponent(this.txtComp);
		this.txtComp.setScreen(this.screen);
		this.txtComp.setText("Save Level!");
		this.saveButton.position= new Vector((this.camera.width - this.txtComp.getTextWidth())/2, this.camera.height - 25);
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
		context.fillRect(0, this.camera.height-50, this.screen.width, 50);
		context.restore();
	}
}


export default LevelSelector;


