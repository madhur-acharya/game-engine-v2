import ScreenManager from "./components/screen.js";

class Input{
	static ready= false;
	static keys= {
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

	static mousePos={
		x: 0,
		y: 0,
	};
	static clickHandlers= {};

	static init(canvas) {
		console.log("inputs initializing")
		window.addEventListener("keydown", event => {
			switch(event.keyCode)
			{
				case 38 : {Input.keys.up= true; break;}
				case 40 : {Input.keys.down= true; break;} 
				case 37 : {Input.keys.left= true; break;} 
				case 39 : {Input.keys.right= true; break;} 
				case 32 : {Input.keys.space= true; break;}
				case 13 : {Input.keys.enter= true; break;}
				case 87 : {Input.keys.w= true; break;}
				case 65 : {Input.keys.a= true; break;}
				case 83 : {Input.keys.s= true; break;}
				case 68 : {Input.keys.d= true; break;}
				case 27 : {Input.keys.esc= true; break;}
				case 9 : {Input.keys.tab= true; break;}
			}
		});

		window.addEventListener("keyup", event => {
			switch(event.keyCode)
			{
				case 38 : {Input.keys.up= false; break;}
				case 40 : {Input.keys.down= false; break;} 
				case 37 : {Input.keys.left= false; break;} 
				case 39 : {Input.keys.right= false; break;} 
				case 32 : {Input.keys.space= false; break;}
				case 13 : {Input.keys.enter= false; break;}
				case 87 : {Input.keys.w= false; break;}
				case 65 : {Input.keys.a= false; break;}
				case 83 : {Input.keys.s= false; break;}
				case 68 : {Input.keys.d= false; break;}
				case 27 : {Input.keys.esc= false; break;}
				case 9 : {Input.keys.tab= false; break;}
			}
		});

		canvas.addEventListener('mousemove', (event) => {
			const rect = canvas.getBoundingClientRect();
			Input.mousePos.x= event.clientX - rect.left;
			Input.mousePos.y= event.clientY - rect.top;

			// Set Active screen
			for(let scrNm in ScreenManager.screens) {
				if(scrNm == ScreenManager.DEFAULT) continue;
				const scr= ScreenManager.screens[scrNm];
				const inp= Input.mousePos;
				const pos= scr.origin;
				if((inp.x >= pos.x) && (inp.x <= pos.x + scr.width) && (inp.y >= pos.y) && (inp.y <= pos.y + scr.height)){
					ScreenManager.ACTIVE_SCREEN= scrNm;
					break
				}
			}
		});

		canvas.addEventListener("click", event => {
			for(let key in Input.clickHandlers) {
				const hand= Input.clickHandlers[key];
				const screenPointer= Input.worldToScreenPoint(hand.screen);
				hand.handler(screenPointer);
			}
		});


		Input.ready= true;
	}

	static getKey(theKey)
	{
		if(!Input.ready) return;
		return Input.keys[theKey];
	}

	static getMousePos()
	{
		if(!Input.ready) return;
		return Input.mousePos;
	}

	static worldToScreenPoint(screen)
	{
		if(!Input.ready) return;
		const pos= Input.mousePos;
		return {
			x:  pos.x - screen.origin.x,
			y:  pos.y - screen.origin.y,
		}
	}
};

export default Input;


