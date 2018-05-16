import React from "react";
import "./Cell.css";

const Cell = ({blockType}) => (
	<div className={`block  ${blockType}`}></div>
);

export default Cell;