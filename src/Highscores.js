import React, { Component } from "react";
import "./Highscores.css";

import Button from "./Button";
import Score from "./Score";
import Loading from "./Loading";


class Highscores extends Component {

	constructor(props){
		super(props);
		this.state = {
			"highscoresData": null,
			"newScoreIndex": -1,
		}
	}
	componentDidMount(){
		let xhttp = new XMLHttpRequest();
		var thisComponent=this;

		xhttp.onreadystatechange  = function(){

			if (this.readyState == 4 && this.status == 200) {
				let data = this.responseText;
				if(data === ""){
					data="[]";
				}
				thisComponent.setState({
					"highscoresData": JSON.parse(data),
				}, function () {
					this.setState({
						"newScoreIndex": thisComponent.newScoreIsHighscoreAt(),
					})
				});

			}
		}
		xhttp.open("GET","http://192.168.1.95/TetrisHighscoreDataLayer/highscore.php");
		xhttp.send();
	}


	/**
	 * Return the index of the new score in the highscores array, or -1 if not in the top 10
	 * @return {integer} index of new score or -1 if not in the top 10
	 */
	newScoreIsHighscoreAt(){
		const { highscoresData: hsd } = this.state;
		const newScore = this.props.newScore;
		for(let i=0 ; i<hsd.length ; i++){

			if(newScore.score > hsd[i].score || (newScore.score == hsd[i].score && newScore.line > hsd[i].line)){
				return i;
			}
		}
		if( hsd.length < 10){
			return hsd.length;
		}
		return -1;
		
	}

	displayHighscores(){
		let highscores = [];
		const { highscoresData: hsData, newScoreIndex } = this.state;
		for(let i=0 ; i<10 ; i++){
			if(this.props.endGame && newScoreIndex === i){
				highscores.push(<Score key={i} name={"NEW SCORE TEST"} score={this.props.newScore.score}/>)
			}
			if(highscores.length < 10){
				if(i >= hsData.length){
					highscores.push(<Score key={i+1} empty={true}/>);
				}else{
					highscores.push(<Score key={hsData[i].hash} name={hsData[i].name} score={hsData[i].score}/>)
				}
			}
		}
		return highscores;
	}

	render(){
		const { endGame } = this.props;
		const saveNewScore = this.shouldSaveNewScore();
		return (
			<div className="highscores-component">
				<div className="highscores-header">
					<div className="highscores-title">Meilleurs Scores</div>
					<Button type="btn-highscores-close header" onClick={this.props.close}> X </Button>
				</div>
				<div className="highscores-body">
					{this.state.highscoresData === null ? 
						<Loading />
					:
						this.displayHighscores()
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