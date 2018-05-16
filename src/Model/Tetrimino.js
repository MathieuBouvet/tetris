import Simple2DPosition from "./Simple2DPosition";

class Tetrimino {
	constructor(tetriminoType){
		this.type = tetriminoType;
		this.orientation = 0;
		this.position = [];
	}
}

export default Tetrimino;