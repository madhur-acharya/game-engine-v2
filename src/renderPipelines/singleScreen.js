
class RenderPipeline{

	static renderStack= {};

	static DispatchDraw(comp) {
		if(!comp) return console.warn("cannot dispatch draw. Missing component", comp);
		if(!comp.layer) return console.warn("cannot dispatch draw. Missing layer", comp);
		if(!comp.draw) return console.warn("cannot dispatch draw. Missing draw function", comp);

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
			return accu+curr.length;
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

