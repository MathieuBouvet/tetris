import React, { Component } from "react";
import "./Cell.css";

class Cell extends Component{

	shouldComponentUpdate({blockType, flash=false}){
		if(blockType===this.props.blockType && flash===this.props.flash){
			return false;
		}
		return true;
	}

	render(){
		return (
			<div className={`block  ${this.props.blockType} ${this.props.flash ? "flash" : ""}`}></div>
		)
	}
}
export default Cell;