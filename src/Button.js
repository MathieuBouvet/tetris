import React from "react";
import "./Button.css";

const Button = ({onClick, type, children}) => (
		<div class={`button ${type}`} onClick={()=>onClick()}>
			{children}
		</div>
);

export default Button;