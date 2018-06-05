import React from "react";
import "./Score.css";

const Score = ({score, name}) => (
	<div className="score-component">
		<div className="name">{name}</div>
		<div className="dots"></div>
		<div className="score">{score}</div>
	</div>
);

export default Score;