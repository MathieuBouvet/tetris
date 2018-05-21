import React, { Component } from "react";
import "./UpNext.css";

import Cell from "./Cell";

class UpNext extends Component{

	shouldComponentUpdate({ tetrimino }){
		if(tetrimino !== this.props.tetrimino){
			return true;
		}
		return false;
	}
	render(){
		const { tetrimino } = this.props;
		return (
			<div className="up-next">{
				[0,0,0,0].map( (elem, rowIndex) => (
					[0,0,0,0,0,0].map( (elem, columnIndex) => (
						<Cell
							key={rowIndex.toString()+columnIndex.toString()}
							blockType={tetrimino.isPosition(rowIndex-3,columnIndex+2)?tetrimino.type:"empty"}
						/>
					))
				))
			}</div>
		)
	}
}

export default UpNext