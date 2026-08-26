
class RenderPipeline{

	static renderStack= {};

	static DispatchDraw(comp) {
		let skipping= false;
		if(!comp) skipping= true;
		if(!comp.layer) skipping= true;
		if(!comp.draw) skipping= true;
		if(skipping){
			console.warn("cannot dispatch draw", comp);
			return;
		}

		if(!RenderPipeline.renderStack[comp.layer]){
			RenderPipeline.renderStack[comp.layer]= [];
		}
		RenderPipeline.renderStack[comp.layer].push(comp);
	};

	static Pop(layer) {
		return RenderPipeline.renderStack[layer].pop();
	};

	static Draw(layer) {
		return RenderPipeline.Pop(layer).draw();
	}

	static RenderLayer(layer) {
		const stack= RenderPipeline.renderStack[layer];
		if(!stack) return;

		for(let i=0; i < stack.length; i++) RenderPipeline.Draw(layer);
	}

	static Render() {
		const count= Object.values(RenderPipeline.renderStack).reduce((accu, curr) => {
			return accu+Object.values(curr).reduce((a, c) => a+c.length, 0);
		}, 0);
		nurdyStats4.innerHTML= `Render dispatch count: ${count}`;
		for(let l of Object.keys(RenderPipeline.renderStack).sort()) RenderPipeline.RenderLayer(l);
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

