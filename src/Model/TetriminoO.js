import Tetrimino from "./Tetrimino";
import Simple2DPosition from "./Simple2DPosition";

class TetriminoO extends Tetrimino {
	constructor(){
		super();
		this.type = "O";
		/*this.position = [
			new Simple2DPosition(-2,4),
			new Simple2DPosition(-2,5),
			new Simple2DPosition(-1,4),
			new Simple2DPosition(-1,5),
		];*/
		//TEST POSITION
		this.position = [
			new Simple2DPosition(6,4),
			new Simple2DPosition(6,5),
			new Simple2DPosition(5,4),
			new Simple2DPosition(5,5),
		];
	}
	getRotationMapping(){
		return [
		[[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0]],
		]
	}
}

export default TetriminoO;