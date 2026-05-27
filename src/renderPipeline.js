
class RenderPipeline{

	static renderStack= [];

	static DispatchDraw(comp) {
		if(comp.layer == undefined) return;
		if(!comp.draw == undefined) return;
		if(!RenderPipeline.renderStack[comp.layer]) {
			RenderPipeline.renderStack[comp.layer]= [];
		}
		RenderPipeline.renderStack[comp.layer].push(comp);
	};

	static Pop(layer) {
		return RenderPipeline.renderStack[layer]?.pop();
	};

	static Draw(layer) {
		return RenderPipeline.Pop(layer)?.draw();
	}

	static RenderLayer(layer) {
		const stack= RenderPipeline.renderStack[layer];
		if(!stack) return;

		for(let i=0; i < stack.length; i++) RenderPipeline.Draw(layer);
	}

	static Render() {
		nurdyStats4.innerHTML= `Render dispatch count: ${RenderPipeline.renderStack.length}`;
		const stack= RenderPipeline.renderStack;
		for(let i=0; i < stack.length; i++) RenderPipeline.RenderLayer(i);
	}

};


export default RenderPipeline;

