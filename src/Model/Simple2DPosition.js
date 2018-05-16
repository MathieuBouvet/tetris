class Simple2DPosition {
	constructor(x=0,y=0){
		this.posX = x;
		this.posY = y;
	}

	getTranslation(xShift, yShift){
		return new Simple2DPosition(this.posX+xShift, this.posY+yShift);
	}
	getLeft(){
		return this.getTranslation(0,-1);
	}
	getRight(){
		return this.getTranslation(0,1);
	}
	getDown(){
		return this.getTranslation(1,0);
	}
}

export default Simple2DPosition;