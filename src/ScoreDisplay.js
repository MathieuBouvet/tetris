import React, { Component } from "react";
import "./ScoreDisplay.css";

class ScoreDisplay extends Component{

	render(){
		return (
			<div className="score-display">
				<div className="score-display-title">Score :</div>
				<div className="score-display-value">{this.props.score}</div>
			</div>
		)
	}
}

export default ScoreDisplay;