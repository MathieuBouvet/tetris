import React from "react";
import "./Loading.css";

import loadingGif from "./loading.gif";

const Loading = (props) => (
	<div className="loading-component">
		<img className="loading-img" src={loadingGif} alt="Chargement..."/>
	</div>
);

export default Loading;