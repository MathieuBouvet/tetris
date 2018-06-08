import React, { Component } from "react";
import "./Highscores.css";

import Button from "./Button";
import Score from "./Score";
import Loading from "./Loading";

const defaultName = "NOUVEAU SCORE";
const dataLayerURL = "http://192.168.1.95/TetrisHighscoreDataLayer/highscore.php";

class Highscores extends Component {

	constructor(props){
		super(props);
		this.state = {
			"highscoresData": null,
			"newScoreIndex": -1,
			"newScoreName": defaultName,
			"nameHasChanged": false,
			"nameInputError": false,
			"postError": false,
		}

		this.nameInput = React.createRef();
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
					if(this.props.endGame){
						this.setState({
							"newScoreIndex": thisComponent.newScoreIsHighscoreAt(),
						});
					}
				});

			}
		}
		xhttp.open("GET",dataLayerURL);
		xhttp.send();
	}


	/**
	 * Return the index of the new score in the highscores array, or -1 if not in the top 10
	 * @return {integer} index of new score or -1 if not in the top 10
	 */
	newScoreIsHighscoreAt(){
		const { highscoresData: hsd } = this.state;
		const newScore = this.props.newScore;
		if(newScore !== null){
			for(let i=0 ; i<hsd.length ; i++){

				if(newScore.score > hsd[i].score || (newScore.score == hsd[i].score && newScore.line >= hsd[i].line)){
					return i;
				}
			}
			if( hsd.length < 10){
				return hsd.length;
			}
		}
		return -1;
		
	}

	displayHighscores(){
		let highscores = [];
		const { highscoresData: hsData, newScoreIndex } = this.state;
		for(let i=0 ; i<10 ; i++){
			if(this.props.endGame && newScoreIndex === i){
				highscores.push(<Score key={i} name={this.state.newScoreName} score={this.props.newScore.score} isNew={true}/>)
			}
			if(i >= hsData.length){
				highscores.push(<Score key={i+1} empty={true}/>);
			}else{
				highscores.push(<Score key={hsData[i].hash} name={hsData[i].name} score={hsData[i].score}/>)
			}
		}
		return highscores;
	}

	handleNameInput = (e) => {
		let val = e.target.value;
		if(!this.state.nameHasChanged){
			val = val.substr(val.length-1);
		}
		this.setState({
			newScoreName: val,
			nameHasChanged: true,
		});
	}

	handleNameInputBlur = () => {
		setTimeout(()=>(this.nameInput.current.focus()),0);
	}

	saveNewScore = () => {
		if(this.state.newScoreName === defaultName || this.state.newScoreName === ""){
			this.setState({ nameInputError: true});
		}else {
			const newScore = {
				score: this.props.newScore.score,
				line: this.props.newScore.line,
				name: this.state.newScoreName,
			}
			let xhttp = new XMLHttpRequest();
			let thisComponent = this;
			xhttp.onreadystatechange = function(){
				if(this.readyState === 4 ){
					if(this.status === 200){
						thisComponent.props.close();
					}else {
						thisComponent.setState({
							postError: true,
						});
					}
				}
			}
			xhttp.open("POST",dataLayerURL);
			xhttp.setRequestHeader("Content-Type","application/json");
			xhttp.send(JSON.stringify(newScore));
		}
		

	}

	render(){
		const { endGame } = this.props;
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
					{ (this.props.endGame && this.state.newScoreIndex > -1) ?
						[<input key="nameInput" ref={this.nameInput} autoFocus className="name-input" value={this.state.newScoreName} onChange={this.handleNameInput} onBlur={this.handleNameInputBlur} />,
						<Button key="saveButton" type="btn-highscores-close" onClick={this.saveNewScore}> Sauver </Button>]
						:
						<Button type="btn-highscores-close" onClick={this.props.close}> Retour </Button>
					}
				</div>
			</div>
		);
	}
}
Highscores.defaultProps = {newScore: null};

export default Highscores;