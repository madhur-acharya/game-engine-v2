import ScreenManager from "./components/screen.js";

class Input{
	ready= false;
	keys= {
		up: false,
		down: false,
		left: false,
		right: false,
		enter: false,
		space: false,
		mute: false,
		w: false,
		a: false,
		s: false,
		d: false,
		esc: false,
		tab: false
	};

	mousePos={
		x: 0,
		y: 0,
	};
	clickHandlers= {};

	constructor(canvas, screen) {
		console.log("inputs initializing")
		if(!screen){
			this.screen= ScreenManager.setDefault();
		}

		canvas.addEventListener('mousemove', (event) => {
			const rect = canvas.getBoundingClientRect();
			const pos= this.screen.origin;
			const isWithScreen= (rect.x >= pos.x) && (rect.x <= pos.x + scr.width) && (rect.y >= pos.y) && (rect.y <= pos.y + scr.height);
			this.isActive= isWithScreen;
			if(!isWithScreen) return;
			this.mousePos.x= event.clientX - rect.left;
			this.mousePos.y= event.clientY - rect.top;
		});

		window.addEventListener("keydown", event => {
			if(!this.isActive) return;
			switch(event.keyCode)
			{
				case 38 : {this.keys.up= true; break;}
				case 40 : {this.keys.down= true; break;} 
				case 37 : {this.keys.left= true; break;} 
				case 39 : {this.keys.right= true; break;} 
				case 32 : {this.keys.space= true; break;}
				case 13 : {this.keys.enter= true; break;}
				case 87 : {this.keys.w= true; break;}
				case 65 : {this.keys.a= true; break;}
				case 83 : {this.keys.s= true; break;}
				case 68 : {this.keys.d= true; break;}
				case 27 : {this.keys.esc= true; break;}
				case 9 : {this.keys.tab= true; break;}
			}
		});

		window.addEventListener("keyup", event => {
			if(!this.isActive) return;
			switch(event.keyCode)
			{
				case 38 : {this.keys.up= false; break;}
				case 40 : {this.keys.down= false; break;} 
				case 37 : {this.keys.left= false; break;} 
				case 39 : {this.keys.right= false; break;} 
				case 32 : {this.keys.space= false; break;}
				case 13 : {this.keys.enter= false; break;}
				case 87 : {this.keys.w= false; break;}
				case 65 : {this.keys.a= false; break;}
				case 83 : {this.keys.s= false; break;}
				case 68 : {this.keys.d= false; break;}
				case 27 : {this.keys.esc= false; break;}
				case 9 : {this.keys.tab= false; break;}
			}
		});

		canvas.addEventListener("click", event => {
			for(let key in this.clickHandlers) {
				const hand= this.clickHandlers[key];
				const screenPointer= this.worldToScreenPoint(this.screen);
				hand.handler(screenPointer);
			}
		});

		this.ready= true;
	}

	getKey(theKey)
	{
		return this.keys[theKey];
	}

	getMousePos()
	{
		return this.mousePos;
	}

	worldToScreenPoint(screen)
	{
		const pos= this.mousePos;
		return {
			x:  pos.x - screen.origin.x,
			y:  pos.y - screen.origin.y,
		}
	}
};

export default Input;


