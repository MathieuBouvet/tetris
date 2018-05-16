class Simple2DPosition {
	constructor(x=0,y=0){
		this.posX = x;
		this.posY = y;
	}

	getTranslation(xShift, yShift){
		return new Simple2DPosition(this.posX+xShift, this.posY+yShift);
	}
}

export default Simple2DPosition;