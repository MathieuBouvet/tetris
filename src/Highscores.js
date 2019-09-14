import React, { Component } from "react";
import "./Highscores.css";

import Button from "./Button";
import Score from "./Score";
import Loading from "./Loading";


//const dataLayerURL = "http://moalrick.free.fr/tetris-beta/TetrisHighscoreDataLayer/highscore.php";
const dataLayerURL = ".netlify/functions/hello";

const defaultName = "NOUVEAU SCORE";


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
			"loadError": false,
			"sendingData": false,
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
					if(thisComponent.props.endGame){
						const scoreAt = thisComponent.newScoreIsHighscoreAt();
						if(scoreAt > -1){
							thisComponent.keepFocusing = setInterval(function(){
								thisComponent.nameInput.current.focus();
							},500)
						}
						thisComponent.setState({
							"newScoreIndex": scoreAt,
						});
					}
				});

			}
		}
		xhttp.open("GET",dataLayerURL);
		xhttp.send();

		
	}

	componentWillUnmount(){
		clearInterval(this.keepFocusing);
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

	savingFooter(){
		let footerFeedback = null;
		if(this.state.nameInputError){
			footerFeedback = <div key="footerFeedback" className="footer-feedback error"> Entrez votre nom à l'aide du clavier</div> 
		}else if(this.state.postError){
			footerFeedback = <div key="footerFeedback" className="footer-feedback error"> Echec lors de l'envoi des données, réessayer...</div>
		}else if(this.state.sendingData){
			footerFeedback = <div key="footerFeedback" className="footer-feedback"> Sauvegarde en cours... </div>
		}
		return [
			<input key="nameInput" ref={this.nameInput} autoFocus className="name-input" value={this.state.newScoreName} onChange={this.handleNameInput} onBlur={this.handleNameInputBlur} />,
			footerFeedback,
			<Button key="saveButton" type="btn-highscores-save" onClick={this.saveNewScore}> Sauver </Button>
		]
	}

	failedFooter(){
		return [ 
			<div key="failed-msg" className="footer-feedback"></div>,
			this.defaultFooter()
		]
	}

	defaultFooter(){
		return <Button key="footer-default-btn" type="btn-highscores-close" onClick={this.props.close}> Retour </Button>
	}

	handleNameInputBlur = () => {
		setTimeout(()=>(this.nameInput.current.focus()),0);
	}
	handleNameInput = (e) => {
		let val = e.target.value;
		if(!this.state.nameHasChanged){
			val = val.substr(val.length-1);
		}
		val = val.replace(/[^a-z-_àéèùçëï]/i,"");
		val = val.toUpperCase();
		this.setState({
			newScoreName: val,
			nameHasChanged: true,
			nameInputError: false,
		});
	}


	saveNewScore = () => {
		if(this.state.newScoreName === defaultName || this.state.newScoreName === ""){
			this.setState({ nameInputError: true});
		}else if(!this.state.sendingData){
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
							sendingData: false,
						});
					}
				}
			}
			xhttp.open("POST",dataLayerURL);
			xhttp.setRequestHeader("Content-Type","application/json");
			xhttp.send(JSON.stringify(newScore));
		}
		

	}

	highscoresTitle() {
		const { newScoreIndex, newScore, highscoresData } = this.state;
		if(highscoresData === null){
			return "Chargements des Scores...";
		}
		if(newScore != null){
			if(newScoreIndex > -1){
				return "BRAVO - Entrez votre nom";
			}else {
				return "Score Insuffisant :(";
			}
		}
		return "Meilleurs Scores";
	}

	render(){
		const { endGame } = this.props;
		const shouldSaveNewScore = endGame && this.state.newScoreIndex > -1;
		return (
			<div className="highscores-component">
				<div className="highscores-header">
					<div className="highscores-title">
						{ this.highscoresTitle() }
					</div>
					<Button 
						type="btn-highscores-close header" 
						onClick={shouldSaveNewScore?this.saveNewScore:this.props.close}
						> X </Button>
				</div>
				<div className="highscores-body">
					{this.state.highscoresData === null ? 
						<Loading />
					:
						this.displayHighscores()
					}
				</div>
				<div className="highscores-footer">
					{ (endGame) ?
						this.state.newScoreIndex > -1 ?
							this.savingFooter()
							:
							this.failedFooter()
						:
						this.defaultFooter()
					}
				</div>
			</div>
		);
	}
}
Highscores.defaultProps = {newScore: null};

export default Highscores;