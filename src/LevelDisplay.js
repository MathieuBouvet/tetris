import React, { Component } from "react";
import "./LevelDisplay.css";

class LevelDisplay extends Component {

	render() {
		return (
			<div className="level-display">
				<div className="level-display-title">Niveau</div>
				<div className="level-display-value">{this.props.level}</div>
			</div>
		)
	}
}

export default LevelDisplay;