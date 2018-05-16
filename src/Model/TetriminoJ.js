import Tetrimino from "./Tetrimino";
import Simple2DPosition from "./Simple2DPosition";

class TetriminoJ extends Tetrimino {
	constructor(){
		super();
		this.type = "J";
		this.position = [
			new Simple2DPosition(-2,3),
			new Simple2DPosition(-1,3),
			new Simple2DPosition(-1,4),
			new Simple2DPosition(-1,5),
		];
	}
	getRotationMapping(){
		return [
			[[0,2],[-1,1],[0,0],[1,-1]],
			[[2,0],[1,1],[0,0],[-1,-1]],
			[[0,-2],[1,-1],[0,0],[-1,1]],
			[[-2,0],[-1,-1],[0,0],[1,1]],
		]
	}
}

export default TetriminoJ;