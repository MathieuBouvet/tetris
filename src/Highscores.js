import React, { Component } from "react";
import "./Highscores.css";

import loading from "./loading.gif";

class Highscores extends Component {

	constructor(props){
		super(props);
		this.state = {
			"dataLoaded": false,
		}
	}
	componentDidMount(){
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET","http://192.168.1.95/TetrisHighscoreDataLayer/highscore.php");
		xhttp.send();
	}

	render(){
		return (
			<div className="highscores-component">
				{!this.state.dataLoaded && [
					<img className="loading-img" src={loading} alt="chargement" />,
					<div> Chargement </div>
				]}
			</div>
		);
	}
}

export default Highscores;