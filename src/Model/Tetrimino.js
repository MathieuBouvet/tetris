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
}

export default Tetrimino;