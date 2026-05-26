

class RenderPipeline{

	static renderStack= [];

	static Push(layer, gameObj) {
		if(!RenderPipeline.renderStack[layer]) {
			RenderPipeline.renderStack[layer]= [];
		}
		RenderPipeline.renderStack[layer].push(gameObj);
	};

	static Pop(layer) {
		return RenderPipeline.renderStack[layer]?.pop();
	};

	static Draw(layer) {
		return RenderPipeline.Pop(layer)?.Draw();
	}

	static RenderLayer(layer) {
		const stack= RenderPipeline.renderStack[layer];
		if(!stack) return;

		for(let i=0; i < stack.length; i++) RenderPipeline.Draw(layer);
	}

	static Render() {
		const stack= RenderPipeline.renderStack;
		for(let i=0; i < stack.length; i++) RenderPipeline.RenderLayer(i);
	}

};


export default RenderPipeline;

