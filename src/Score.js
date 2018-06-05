import React from "react";
import "./Score.css";

const Score = ({score="0", name, empty=false}) => (
	<div className={`score-component ${empty?"empty":""}`}>
		<div className="name">
			{!empty ? name : "VIDE"}
		</div>
		<div className="dots"></div>
		<div className="score">{score}</div>
	</div>
);

export default Score;