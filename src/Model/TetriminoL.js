import Tetrimino from "./Tetrimino";
import Simple2DPosition from "./Simple2DPosition";

class TetriminoL extends Tetrimino {
	constructor(){
		super();
		this.type = "L";
		this.position = [
			new Simple2DPosition(-1,3),
			new Simple2DPosition(-1,4),
			new Simple2DPosition(-1,5),
			new Simple2DPosition(-2,5),
		];
	}
	getRotationMapping(){
		return [
			[[-1,1],[0,0],[1,-1],[2,0]],
			[[1,1],[0,0],[-1,-1],[0,-2]],
			[[1,-1],[0,0],[-1,1],[-2,0]],
			[[-1,-1],[0,0],[1,1],[0,2]],
		]
	}
}

export default TetriminoL;