import Input from "../../src/input.js";
import RenderPipeline from "../../src/renderPipeline.js";
import Vector from "../../src/vector.js";
import Camera from "../../src/components/camera.js";
import ScreenManager, {Screen} from "../../src/components/screen.js";
import Generic from "../../src/components/generic.js";
import {TextRenderer} from "../../src/components/textRenderer.js";
import {GameObject} from "../../src/gameObject.js";


export const LoadLevelCatalogue= () => {
	return fetch("/devtools/tileEditor/getlevelindex")
	.then(res => res.json())
	.catch(err => {throw error});
};

export const LoadAllLevels= () => {
	return LoadLevelCatalogue()
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

export const LoadLevel= (lvl) => {
	return fetch(`/devtools/tileEditor/getLevel/${lvl}`)
	.then(res => res.json())
	.catch(err => {throw error});
};

class LevelSelector extends Generic{
	levels= [];

	constructor(gameObject, layer)
	{
		super();
		this.gameObject= gameObject;
		this.screen= ScreenManager.getScreen("left");
		this.layer= layer;
		this.camera= new Camera(this.screen.width, this.screen.height);

		LoadLevelCatalogue()
		.then(lvls => {
			this.levels= lvls;
			this.ready= true;
			this.init();
		})
		.catch(err => {throw err});
	}

	init()
	{
		this.levelList= new GameObject(new Vector(0, 0));
		for(let i=0; i<this.levels.length; i++) {
			const T= new TextRenderer(this.levelList, 5, this.levels[i], new Vector(20, (i * 50) + 50));
			T.name= ""+i;
			T.color= "black";
			this.levelList.AddComponent(T);
		}
	}

	Update(delta)
	{
		RenderPipeline.DispatchDraw(this);
	}

	draw()
	{
		context.save();
		context.fillStyle= 'darkgrey';
		context.fillRect(0, 0, this.screen.width, this.camera.height);
		context.restore();


		context.save();
		context.fillStyle= 'orange';
		context.fillRect(0, this.camera.height-50, this.screen.width, 50);
		context.restore();
	}
}


export default LevelSelector;


