import Simple2DPosition from "./Simple2DPosition";

import shuffle from "fisher-yates";

const tetriminoes = ["I","J","L","O","S","T","Z"];

class Tetrimino {
	
	constructor(type){
		this.type = type;
		this.orientation = 0;

		const { initialPosition, rotationMapping } = Tetrimino.getConfigurationFor(type);
		this.position = initialPosition;
		this.rotationMapping = rotationMapping;
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

	

	applyRightRotation(rotationTransform){
		this.applyPosition(rotationTransform);
		this.orientation++;
		if(this.orientation > 3){
			this.orientation = 0;
		}

	}
	applyLeftRotation(rotationTransform){
		this.applyPosition(rotationTransform);
		this.orientation--;
		if(this.orientation < 0){
			this.orientation = 3;
		}
	}

	applyPosition(position){
		this.position = position;
	}

	getRightRotation(){
		const rotationMapping = this.rotationMapping[this.orientation];
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
		const rotationMapping = this.rotationMapping[orientation];
		const result = this.position.map( (elem, index) => {
			let [xShift, yShift] = rotationMapping[index];
			return elem.getTranslation(-xShift,-yShift);
		});
		return result;
	}

	clone(){
		let theClone = new Tetrimino(this.type);
		theClone.position = this.position.map( (elem) => new Simple2DPosition(elem.posX,elem.posY) );
		theClone.orientation = this.orientation;

		return theClone;
	}

	/**
	 * retun the index of the rows the tetrimino is in sorted ascendently
	 * @return {array} array of row index sorted ascendently
	 */
	getRowSpan(){
		let rowSpan = [];
		for(let i=0 ; i<this.position.length ; i++){
			if(!rowSpan.includes(this.position[i].posX)){
				rowSpan.push(this.position[i].posX);
			}
		}
		return rowSpan.sort( (a,b) => (b-a) );
	}

	

	static getConfigurationFor(tetriminoType){
		return Tetrimino.configuration()[tetriminoType];
	}
	static configuration(){
		return {
			"I": {  
				initialPosition: [
					new Simple2DPosition(-1,3),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-1,5),
					new Simple2DPosition(-1,6),
				],
				rotationMapping: [
				[[-1,2],[0,1],[1,0],[2,-1]],
				[[2,1],[1,0],[0,-1],[-1,-2]],
				[[1,-2],[0,-1],[-1,0],[-2,1]],
				[[-2,-1],[-1,0],[0,1],[1,2]],
				],
			},
			"J": {
				"initialPosition": [
					new Simple2DPosition(-2,3),
					new Simple2DPosition(-1,3),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-1,5),
				],
				"rotationMapping": [
					[[0,2],[-1,1],[0,0],[1,-1]],
					[[2,0],[1,1],[0,0],[-1,-1]],
					[[0,-2],[1,-1],[0,0],[-1,1]],
					[[-2,0],[-1,-1],[0,0],[1,1]],
				],
			},
			"L": {
				"initialPosition": [
					new Simple2DPosition(-1,3),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-1,5),
					new Simple2DPosition(-2,5),
				],
				"rotationMapping": [
					[[-1,1],[0,0],[1,-1],[2,0]],
					[[1,1],[0,0],[-1,-1],[0,-2]],
					[[1,-1],[0,0],[-1,1],[-2,0]],
					[[-1,-1],[0,0],[1,1],[0,2]],
				],
			},
			"O": {
				"initialPosition": [
					new Simple2DPosition(-2,4),
					new Simple2DPosition(-2,5),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-1,5),
				],
				"rotationMapping": [
					[[0,0],[0,0],[0,0],[0,0]],
					[[0,0],[0,0],[0,0],[0,0]],
					[[0,0],[0,0],[0,0],[0,0]],
					[[0,0],[0,0],[0,0],[0,0]],
				],
			},
			"S": {
				"initialPosition": [
					new Simple2DPosition(-1,3),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-2,4),
					new Simple2DPosition(-2,5),
				],
				"rotationMapping": [
					[[-1,1],[0,0],[1,1],[2,0]],
					[[1,1],[0,0],[1,-1],[0,-2]],
					[[1,-1],[0,0],[-1,-1],[-2,0]],
					[[-1,-1],[0,0],[-1,1],[0,2]],
				],
			},
			"T": {
				"initialPosition": [
					new Simple2DPosition(-1,3),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-2,4),
					new Simple2DPosition(-1,5),
				],
				"rotationMapping": [
					[[-1,1],[0,0],[1,1],[1,-1]],
					[[1,1],[0,0],[1,-1],[-1,-1]],
					[[1,-1],[0,0],[-1,-1],[-1,1]],
					[[-1,-1],[0,0],[-1,1],[1,1]],
				],
			},
			"Z": {
				"initialPosition": [
					new Simple2DPosition(-2,3),
					new Simple2DPosition(-2,4),
					new Simple2DPosition(-1,4),
					new Simple2DPosition(-1,5),
				],
				"rotationMapping": [
					[[0,2],[1,1],[0,0],[1,-1]],
					[[2,0],[1,-1],[0,0],[-1,-1]],
					[[0,-2],[-1,-1],[0,0],[-1,1]],
					[[-2,0],[-1,1],[0,0],[1,1]],
				],
			},
		}
	}
	static getRandom(){
		const type = tetriminoes[Math.floor(Math.random()*tetriminoes.length)];
		return new Tetrimino(type);
	}

	static getBag(){
		return shuffle(tetriminoes);
	}
	
}

export default Tetrimino;