const Input= function()
{
	const keys= {
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
	console.log("inputs initializing")
	window.addEventListener("keydown", event => {

		switch(event.keyCode)
		{
			case 38 : {keys.up= true; break;}
			case 40 : {keys.down= true; break;} 
			case 37 : {keys.left= true; break;} 
			case 39 : {keys.right= true; break;} 
			case 32 : {keys.space= true; break;}
			case 13 : {keys.enter= true; break;}
			case 87 : {keys.w= true; break;}
			case 65 : {keys.a= true; break;}
			case 83 : {keys.s= true; break;}
			case 68 : {keys.d= true; break;}
			case 27 : {keys.esc= true; break;}
			case 9 : {keys.tab= true; break;}
		}
	});

	window.addEventListener("keyup", event => {

		switch(event.keyCode)
		{
			case 38 : {keys.up= false; break;}
			case 40 : {keys.down= false; break;} 
			case 37 : {keys.left= false; break;} 
			case 39 : {keys.right= false; break;} 
			case 32 : {keys.space= false; break;}
			case 13 : {keys.enter= false; break;}
			case 87 : {keys.w= false; break;}
			case 65 : {keys.a= false; break;}
			case 83 : {keys.s= false; break;}
			case 68 : {keys.d= false; break;}
			case 27 : {keys.esc= false; break;}
			case 9 : {keys.tab= false; break;}
		}
	});

	class Input{

		static getKey(theKey)
		{
			return keys[theKey];
		}
	};

	return Input;
}();

export default Input;
