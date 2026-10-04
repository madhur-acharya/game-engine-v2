class Node{
	constructor(val){
		this.val = val;
		this.next = null;
	}
}

// Singly linked list
class LinkedList{
	constructor(){
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	append(val){
		const newNode = new Node(val);
		if(!this.head){
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next = newNode;
			this.tail = newNode;
		}
		this.length++;
		return newNode;
	}

	pop(){
		if(!this.head) return undefined;
		var current = this.head;
		var newTail = current;
		while(current.next){
			newTail = current;
			current = current.next;
		}
		this.tail = newTail;
		this.tail.next = null;
		this.length--;
		if(this.length === 0){
			this.head = null;
			this.tail = null;
		}
		return current;
	}
	shift(){
		if(!this.head) return undefined;
		var currentHead = this.head;
		this.head = currentHead.next;
		this.length--;
		if(this.length === 0){
			this.tail = null;
		}
		return currentHead;
	}

	get(index){
		if(index < 0 || index >= this.length) return null;
		var counter = 0;
		var current = this.head;
		while(counter !== index){
			current = current.next;
			counter++;
		}
		return current;
	}
	
	remove(index){
		if(index < 0 || index >= this.length) return undefined;
		if(index === 0) return this.shift();
		if(index === this.length - 1) return this.pop();
		var previousNode = this.get(index - 1);
		var removed = previousNode.next;
		previousNode.next = removed.next;
		this.length--;
		return removed;
	}

	removeByValue(value){
		var current = this.head;
		var prev = null;
		while(current.val != value){
			prev= current;
			current = current.next;
		}
        prev.next = current.next;
    }

	indexOf(node){
		var counter = 0;
		var current = this.head;
		while(current){
			if(current === node) return counter;
			current = current.next;
			counter++;
		}
		return -1;
	}

	forEach(callback){
		var current = this.head;
		var index = 0;
		while(current){
			callback(current.val, index, this);
			current = current.next;
			index++;
		}
	}

	toArray(){
		const arr = [];
		var current = this.head;
		while(current){
			arr.push(current.val);
			current = current.next;
		}
		return arr;
	}
};

export default LinkedList;

