import ScreenManager from "../components/screen.js";

class RenderPipeline{

	static renderStack= {};

	static DispatchDraw(comp) {
		let skipping= false;
		if(!comp) skipping= true;
		if(!comp.screen?.key) skipping= true;
		if(!comp.layer) skipping= true;
		if(!comp.draw) skipping= true;
		if(skipping){
			console.warn("cannot dispatch draw", comp);
			return;
		}

		const scrnKey= comp.screen.key;
		if(!RenderPipeline.renderStack[scrnKey]){
			RenderPipeline.renderStack[scrnKey]= {};
		}
		if(!RenderPipeline.renderStack[scrnKey][comp.layer]){
			RenderPipeline.renderStack[scrnKey][comp.layer]= [];
		}
		RenderPipeline.renderStack[scrnKey][comp.layer].push(comp);
	};

	static Pop(screen, layer) {
		return RenderPipeline.renderStack[screen][layer].pop();
	};

	static Draw(screen, layer) {
		return RenderPipeline.Pop(screen, layer).draw();
	}

	static RenderLayer(screen, layer) {
		const stack= RenderPipeline.renderStack[screen][layer];
		if(!stack) return;

		for(let i=0; i < stack.length; i++) RenderPipeline.Draw(screen, layer);
	}

	static Render() {
		const count= Object.values(RenderPipeline.renderStack).reduce((accu, curr) => {
			return accu+Object.values(curr).reduce((a, c) => a+c.length, 0);
		}, 0);
		nurdyStats4.innerHTML= `Render dispatch count: ${count}`;
		if(ScreenManager.getLength() > 1) {
			for (let scrKey of Object.keys(ScreenManager.screens).sort((a, b) => a.localeCompare(b))) {
				if(!RenderPipeline.renderStack[scrKey]) continue;
				const scr= ScreenManager.screens[scrKey];
				window.context.save();
				window.context.translate(scr.origin.x, scr.origin.y);
				const region = new Path2D();
				region.rect(0, 0, scr.width, scr.height);
				window.context.clip(region);
				for(let l of Object.keys(RenderPipeline.renderStack[scrKey]).sort()) RenderPipeline.RenderLayer(scrKey, l);
				window.context.restore();
			}
		}
		else {
			const scrKey= ScreenManager.getDefault().key;
			for(let l of Object.keys(RenderPipeline.renderStack[scrKey]).sort()) RenderPipeline.RenderLayer(scrKey, l);
		}
		RenderPipeline.Clear();
	}

	static Clear(){
		if(window.isPaused) {
			console.log(RenderPipeline.renderStack);
			return;
		}
		RenderPipeline.renderStack= {};
	}

};


export default RenderPipeline;

