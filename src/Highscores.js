import React, { Component } from "react";
import "./Highscores.css";

import Button from "./Button";

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
				<div className="highscores-header">
					<div className="highscores-title">Meilleurs Scores</div>
					<Button type="btn-highscores-close header" onClick={this.props.close}> X </Button>
				</div>
				<div className="highscores-body">
					{!this.state.dataLoaded ? [
						<img className="loading-img" src={loading} alt="chargement" />,
						<div> Chargement </div>
					]:"plop"
				}
				</div>
				<div className="highscores-footer">
					<Button type="btn-highscores-close" onClick={this.props.close}> Retour </Button>
				</div>
			</div>
		);
	}
}

export default Highscores;