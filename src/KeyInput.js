import React from "react";
import "./KeyInput.css";

const KeyInput = ({onKeyDown, attachRef, onBlur}) => (
	<textarea className="key-input" onKeyDown={(e) => onKeyDown(e)} ref={attachRef} onBlur={onBlur} autoFocus></textarea>
)

export default KeyInput;