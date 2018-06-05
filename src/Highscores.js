import React, { Component } from "react";
import "./Highscores.css";

import Button from "./Button";

import loading from "./loading.gif";

class Highscores extends Component {

	constructor(props){
		super(props);
		this.state = {
			"highscoresData": null,
		}
	}
	componentDidMount(){
		let xhttp = new XMLHttpRequest();
		var thisComponent=this;

		xhttp.onreadystatechange  = function(){

			if (this.readyState == 4 && this.status == 200) {
				thisComponent.setState({
					"highscoresData": JSON.parse(this.responseText),
				});
			}
		}
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
					{this.state.highscoresData === null ? [
						<img key="load-img" className="loading-img" src={loading} alt="chargement" />,
						<div key="load-text"> Chargement </div>
					]:this.state.highscoresData.map( (elem) => (
						<div key={elem.hash}> {elem.score} </div>
					))
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