import Simple2DPosition from "./Simple2DPosition";

class Tetrimino {
	constructor(){
		this.orientation = 0;
		this.position = [];
	}
	/**
	 * return true if the coordinates given in parameters match any block position of the tetramino
	 * @param  integer  x coordinate
	 * @param  integer  y coordinate
	 * @return Boolean   
	 */
	isPosition(x,y){
		for(let i=0 ; i<this.position.length ; i++){
			let p = this.position[i];
			if(p.posX === x && p.posY === y){
				return true;
			}
		}
		return false;
	}
	/**
	 * All 3 below
	 * @return {array} new position for a move
	 */
	getLeftMove(){
		return this.position.map( elem => elem.getLeft() );
	}
	getRightMove(){
		return this.position.map( elem => elem.getRight() );
	}
	getDownMove(){
		return this.position.map( elem => elem.getDown() );
	}

	

	rotateRight(){
		this.position = this.getRightRotation();
		this.orientation++;
		if(this.orientation > 3){
			this.orientation = 0;
		}

	}

	rotateLeft(){
		this.position = this.getLeftRotation();
		this.orientation--;
		if(this.orientation < 0){
			this.orientation = 3;
		}
	}

	getRightRotation(){
		const rotationMapping = this.getRotationMapping()[this.orientation];
		const result = this.position.map( (elem, index) => {
			let [xShift, yShift] = rotationMapping[index];
			return elem.getTranslation(xShift,yShift);
		});
		return result;
	}
	getLeftRotation(){
		var orientation = this.orientation-1;
		if(orientation < 0){
			orientation = 3;
		}
		const rotationMapping = this.getRotationMapping()[orientation];
		const result = this.position.map( (elem, index) => {
			let [xShift, yShift] = rotationMapping[index];
			return elem.getTranslation(-xShift,-yShift);
		});
		return result;
	}
}

export default Tetrimino;