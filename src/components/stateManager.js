class StateManager {
	constructor(initialValue= {}) {
		this.value= initialValue;
	}

	getState(){
		return this.value;
	}

	setState(val) {
		this.value= this.value;
	}

	getState() {
		return this.value;
	}
};

export default StateManager;
