import Simple2DPosition from "./Simple2DPosition";

class Tetrimino {
	constructor(tetriminoType){
		this.type = tetriminoType;
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
}

export default Tetrimino;