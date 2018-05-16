import Tetrimino from "./Tetrimino";
import Simple2DPosition from "./Simple2DPosition";

class TetriminoT extends Tetrimino {
	constructor(){
		super();
		this.type = "T";
		/*this.position = [
			new Simple2DPosition(-1,3),
			new Simple2DPosition(-1,4),
			new Simple2DPosition(-2,4),
			new Simple2DPosition(-1,5),
		];*/
		//TEST POSITION
		this.position = [
			new Simple2DPosition(5,3),
			new Simple2DPosition(5,4),
			new Simple2DPosition(4,4),
			new Simple2DPosition(5,5),
		];
	}
	getRotationMapping(){
		return [
			[[-1,1],[0,0],[1,1],[1,-1]],
			[[1,1],[0,0],[1,-1],[-1,-1]],
			[[1,-1],[0,0],[-1,-1],[-1,1]],
			[[-1,-1],[0,0],[-1,1],[1,1]],
		]
	}
}

export default TetriminoT;