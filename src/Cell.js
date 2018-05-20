import React, { Component } from "react";
import "./Cell.css";

class Cell extends Component{
	constructor(props){
		super(props);
	}

	shouldComponentUpdate({blockType}){
		if(blockType===this.props.blockType){
			return false;
		}
		return true;
	}

	render(){
		return (
			<div className={`block  ${this.props.blockType}`}></div>
		)
	}
}
export default Cell;