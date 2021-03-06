import React, { Component } from 'react';
import './App.css';

import Cell from "./Cell";

import Tetrimino from "./Model/Tetrimino";
import KeyInput from "./KeyInput";

import UpNext from "./UpNext";
import ScoreDisplay from "./ScoreDisplay";
import LevelDisplay from "./LevelDisplay";
import Countdown from "./Countdown";
import Pause from "./Pause";
import Button from "./Button";
import GameOver from "./GameOver";

import Highscores from "./Highscores";

import tetrisAudio from "./tetris_theme_song.mp3";


const boardSize = {
  row: 10,
  column: 20,
}

const gameStateEnum = {
  BEGIN: 0,
  RUNNING: 1,
  PAUSED: 2,
  STARTING: 3,
  RESUMING: 4,
  END: 5,
}

function createBoard(sizeFirst, sizeSecond) {
  var arr = [];
  for(var i=0 ; i<sizeFirst ; i++){
    arr[i] = [];
    for(var j=0; j<sizeSecond ; j++){
      arr[i].push("empty");
    }
  }
  return arr; 
}

const baseScoringPerLine = [0,40,100,300,1200];

class App extends Component {
  constructor(props) {
    super(props);
    this.tetriminoBag = Tetrimino.getBag();
    const startingTetrimino = this.getTetriminoFromBag();
    this.state = {
      board: createBoard(boardSize.column,boardSize.row),
      tetrimino: startingTetrimino,
      nextTetrimino: startingTetrimino,
      nbLinesCompleted: 0,
      score: 0,
      gameState: gameStateEnum.BEGIN,
      linesToDelete: [],
      showHighscore: false,
      showEndGameHighscore: false,
      showSettings: false,
      playMusic: false,
    }

    this.musicPlayer = React.createRef();
  }

  componentDidMount(){
    document.documentElement.style.setProperty("--blink-duration",this.getGameSpeed()/2000+"s");
  }

  /** EVENT HANDLERES */
  handleClickPause = (e) =>{
    this.pause();
  }
  keyDownHandler = (event, test) => {
    if(this.state.gameState === gameStateEnum.RUNNING){
      switch(event.key){
      case "ArrowDown":
        this.moveDown();
        this.setState((prevState) => ({
          score: prevState.score+1,
        }));
        break;
      case "ArrowLeft":
        this.moveLeft();
        break;
      case "ArrowRight":
        this.moveRight();
        break;
      case "ArrowUp":
        this.rotateLeft();
        break;
      case " ":
        this.rotateRight();
        break;
      }
    }
  }

  onStartClickHandler = () => {
    if(this.state.gameState === gameStateEnum.BEGIN){
      this.setState({
        gameState: gameStateEnum.STARTING,
      });
    }
  }

  onResumeClickHandler = () => {
    if(this.state.gameState === gameStateEnum.PAUSED){
      this.setState({
        gameState: gameStateEnum.RESUMING,
      });
    }
  }
  onRestartClickHandler = () => {
    if(this.state.gameState === gameStateEnum.END){
      this.tetriminoBag = [];
      this.tetriminoBag = Tetrimino.getBag();
      const startingTetrimino = this.getTetriminoFromBag();
      this.setState({
        board: createBoard(boardSize.column,boardSize.row),
        tetrimino: startingTetrimino,
        nextTetrimino: startingTetrimino,
        nbLinesCompleted: 0,
        score: 0,
        gameState: gameStateEnum.STARTING,
        linesToDelete: [],
      });
    }
  }

  start = () => {
    this.setState({
      nextTetrimino: this.getTetriminoFromBag(),
    });
    this.run();
  }

  /** LOGIC METHOD */
  run = () => {
    this.runGame = setInterval(this.gravity, 500-(50*(this.getLevel()-1)));
    this.setState({
      gameState: gameStateEnum.RUNNING,
    });
  }
  pause(){
    if(this.state.gameState === gameStateEnum.RUNNING){
      clearInterval(this.runGame);
      this.setState({
        gameState: gameStateEnum.PAUSED,
      });
    }
  }
  getTetriminoFromBag(){
    if(this.tetriminoBag.length === 0){
      this.tetriminoBag = Tetrimino.getBag();
    }
    return new Tetrimino(this.tetriminoBag.pop());
  }
  gravity = () => {
    if(this.state.linesToDelete.length > 0){
      let newBoard = this.cloneBoard();
      const { linesToDelete } = this.state;
      this.deleteLines(linesToDelete, newBoard);
      this.setState({
        board: newBoard,
        linesToDelete: [],
      });
    }
    var newTetetrimino = this.state.tetrimino.clone();
    const downMove = newTetetrimino.getDownMove();
    const { isValid, status } = this.isPositionValid(downMove);
    if(isValid){
      newTetetrimino.applyPosition(downMove);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }else if( status === "OVERLAPPING" || status === "OUT_VERTICALLY" ){
      this.lockTetrimino();
    }
  }
  cloneBoard(){
    return this.state.board.map( (elem) => elem.slice() );
  }

  getGameSpeed(){
    return 500-(50*(this.getLevel()-1));
  }

  /**
   * Return if the position is valid and give precision if not
   * @param  {array}  position the position of a tetrimino
   * @return {isValid: Boolean, status: string} Object containing a boolean and additional info if position is not valid
   */
  isPositionValid(position){
    const { board } = this.state;
    for(let i=0; i<position.length ; i++){
      let { posX, posY } = position[i];
      try {
        if(board[posX][posY] !== "empty"){
          return { isValid: false, status: "OVERLAPPING" }
        }
      }
      catch(err) {}
      if(posX > 19 ){
        return { isValid: false, status: "OUT_VERTICALLY"};
      }
      if(posY < 0 || posY > 9){
        return { isValid: false, status: "OUT_HORIZONTALLY" }
      }
    }
    return { isValid: true, status: "" };
  }

  lockTetrimino(){
    const { tetrimino, nextTetrimino, nbLinesCompleted } = this.state;
    let newBoard = this.cloneBoard();
    try{
      for(let i=0 ; i<tetrimino.position.length ; i++){
        const { posX, posY } = tetrimino.position[i];
        newBoard[posX][posY] = tetrimino.type;
      }
    }catch(err){
      clearInterval(this.runGame);
      this.setState({
        gameState: gameStateEnum.END,
      });
      /*let feedback = "mouai -_- recommence ;p";
      if(this.state.score >= 2000 ){
        feedback = "pas mal, mais tu peux mieux faire Natty... ¯\\_(ツ)_/¯";
      }
      if(this.state.score >= 5000){
        feedback = "ça va, ça passe (ᵔᴥᵔ)";
      }
      if(this.state.score >= 8000){
        feedback = "Hey! bien Natty ( ͡ᵔ ͜ʖ ͡ᵔ )";
      }
      if(this.state.score >= 10000){
        feedback = "franchement bravo (☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)";
      }
      if(this.state.score >= 15000){
        feedback = " \\ (•◡•) / \nHooray \n\\ (•◡•) /\nMagnifique\n \\ (•◡•) / \nParfait\n \\ (•◡•) / \nNATTY !!!!";
      }
      alert("perdu \n score : "+this.state.score+" "+feedback);*/
      setTimeout(() => {
        if(!this.state.showHighscore){
          this.setState({
            showEndGameHighscore: true,
            showHighscore: true,
          });
        }
      },2000)
      return;
    }

    const linesToDelete = (this.checkNewLines(tetrimino.getRowSpan(), newBoard));
    const newNbLinesCompleted = nbLinesCompleted+linesToDelete.length;

    // Set new speed of the game if level has changed
    if(this.getLevel() !== this.getLevel(newNbLinesCompleted)){
      clearInterval(this.runGame );
      this.runGame = setInterval(this.gravity, 500-(50*(this.getLevel(newNbLinesCompleted)-1)));
      document.documentElement.style.setProperty("--blink-duration",this.getGameSpeed()/2000+"s");
    }

    // Add the linesTODelete to the state, they will be deleted during the next game iteration
    this.setState({
      tetrimino: nextTetrimino,
      nextTetrimino: this.getTetriminoFromBag(),
      score: this.getNewScore(linesToDelete.length),
      nbLinesCompleted: newNbLinesCompleted,
      board: newBoard,
      linesToDelete: linesToDelete,
    });




  }
  isLineComplete(line){
    for(let i=0 ; i<line.length ; i++){
      if(line[i] === "empty"){
        return false;
      }
    }
    return true;
  }
  checkNewLines(rowsIndex, board){
    let newLines = [];
    for(let i=0 ; i<rowsIndex.length ; i++){
      const rowIndex = rowsIndex[i];
      if(this.isLineComplete(board[rowIndex])){
        newLines.push(rowIndex)
      }
    }
    return newLines;
  }

  deleteLines(lines, board){
    // Deletion of the lines
    const nbLines = lines.length;
    for(let i=0 ; i<nbLines ; i++){
      for(let j=0 ; j<boardSize.row ; j++){
        board[lines[i]][j] = "empty";
      }
    }
    // Move down blocks
    const startingIndex = lines[0];
    let nbEmptyLines = 0;
    // Loop through each row starting from the lowest
    // stop when there is more empty line than line to remove plus one (we don't want to stop to soon...)
    for(let i=startingIndex ; i >= 0  && nbEmptyLines<nbLines+1; i--){
      let nbEmptyBlock = 0;
      for(let j=0 ; j<boardSize.row ; j++){
        let currentBlock = board[i][j];
        if(currentBlock !== "empty"){
          // compute the down shift for a block, which is the number of line we've already removed
          board[i+nbEmptyLines][j] = currentBlock;
          board[i][j] = "empty";
        }else{
          nbEmptyBlock++;
        }
      }
      if(nbEmptyBlock===boardSize.row){
        nbEmptyLines++;
      }
    }
  }
  moveLeft(){
    var newTetetrimino = this.state.tetrimino.clone();
    const leftMovePosition = newTetetrimino.getLeftMove();
    if(this.isPositionValid(leftMovePosition)["isValid"]){
      newTetetrimino.applyPosition(leftMovePosition);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }
  }
  moveRight(){
    var newTetetrimino = this.state.tetrimino.clone();
    const rightMovePosition = newTetetrimino.getRightMove();
    if(this.isPositionValid(rightMovePosition)["isValid"]){
      newTetetrimino.applyPosition(rightMovePosition);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }
  }
  moveDown(){
    var newTetetrimino = this.state.tetrimino.clone();
    const downMove = newTetetrimino.getDownMove();
    const { isValid, status } = this.isPositionValid(downMove);
    if(isValid){
      newTetetrimino.applyPosition(downMove);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }else if( status === "OVERLAPPING" || status === "OUT_VERTICALLY" ){
      this.lockTetrimino();
    }
  }
  rotateLeft(){
    var newTetetrimino = this.state.tetrimino.clone();
    const rotate = newTetetrimino.getLeftRotation();
    if(this.isPositionValid(rotate)["isValid"]){
      newTetetrimino.applyLeftRotation(rotate);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }
  }
  rotateRight(){
    var newTetetrimino = this.state.tetrimino.clone();
    const rotate = newTetetrimino.getRightRotation();
    if(this.isPositionValid(rotate)["isValid"]){
      newTetetrimino.applyRightRotation(rotate);
      this.setState({
        tetrimino: newTetetrimino,
      });
    }
  }
  handleRefAttachement = (input) => {
    this.domRefKeyInput = input;
  }
  handleKeyInputBlur = () => {
    setTimeout(()=>{
      if(!this.state.showHighscore){
        this.domRefKeyInput.focus();
      }
    },0  );
  }

  getLevel(nbLines=-1){
    // max level is 10, 10 lines completed per level
    if(nbLines === -1){
      return Math.min(Math.floor(this.state.nbLinesCompleted/10)+1,10);
    }else{
      return Math.min(Math.floor(nbLines/10)+1,10);
    }
  }

  getNewScore(nbLines){
    return this.state.score + this.getLevel()*baseScoringPerLine[nbLines];
  }

  toggleHighscore = () => {
    this.pause();
  	this.setState({
  		showHighscore: !this.state.showHighscore||this.state.showEndGameHighscore,
      showSettings: false,
  	});
  }
  showHighscore = () => {
    if(!this.state.showHighscore){
      if(this.state.gameState === gameStateEnum.RUNNING){
        this.pause();
      }
      this.setState({
        showHighscore: true,
      });
    }
  }
  closeHighscore = () => {
    this.setState({
      showHighscore: false,
      showEndGameHighscore: false,
    });
  }

  toggleSettings = () => {
    this.setState({
      showSettings: !this.state.showSettings,
      showHighscore: false,
    });
  }

  togglePlayMusic = () => {
    if(this.state.playMusic){
      this.musicPlayer.current.pause();
    }else {
      this.musicPlayer.current.play();
    }
    this.setState({
      playMusic: !this.state.playMusic,
    });

  }


  render() {
    const { board, tetrimino, gameState, showHighscore } = this.state;
    if(!showHighscore){
      setTimeout( () =>( this.domRefKeyInput.focus() ),0);
    }
    let button = <Button type="btn-start" onClick={this.onStartClickHandler}> Jouer </Button>;

    if(gameState === gameStateEnum.PAUSED){
      button = <Button type="btn-start" onClick={this.onResumeClickHandler}> Reprendre </Button>;
    }
    else if(gameState === gameStateEnum.RUNNING){
      button = <Button type="btn-pause" onClick={this.handleClickPause}> Pause </Button>;
    }
    else if(gameState === gameStateEnum.END){
      button = <Button type="btn-restart" onClick={this.onRestartClickHandler}> Rejouer </Button>
    }
    else if(gameState !== gameStateEnum.BEGIN){
      button = <Button type="btn-inactive" onClick={this.handleClickPause}>...</Button>;
    }
    return (
      <div className="App">
        <div className="app-header">
          <div className="app-title">
            <h1>Tetris</h1>
          </div>
          <Button 
            type={`btn-highscore app-header-button ${this.state.showHighscore?"pushed":""}`} 
            onClick={this.toggleHighscore}>
              <i className="far fa-list-alt "></i>
          </Button>
          <Button 
            type={`btn-audio app-header-button ${this.state.playMusic?"pushed":""}`} 
            onClick={this.togglePlayMusic}>
              <i className="fas fa-music"></i>
          </Button>
          {/*<Button type={`btn-settings app-header-button ${this.state.showSettings?"pushed":""}`} onClick={this.toggleSettings}><i className="fas fa-cog fa-2x"></i>  </Button>*/}
        </div>
        <div className={`board ${showHighscore?"hidden":""}`}>
          { gameState===gameStateEnum.STARTING && <Countdown onFinish={this.start} /> }
          { gameState===gameStateEnum.RESUMING && <Countdown onFinish={this.run} /> }
          { gameState===gameStateEnum.PAUSED && <Pause /> }
          { gameState===gameStateEnum.END && <GameOver /> }
          <div className={`cell-wrapper ${gameState===gameStateEnum.PAUSED ? "blured" : ""}`}>
            {
              board.map( (row, rowIndex) => (
                row.map( (elem, columnIndex) => (
                  ( tetrimino.isPosition(rowIndex, columnIndex) ?
                  <Cell key={rowIndex.toString()+columnIndex.toString()} blockType={tetrimino.type} flash={this.state.linesToDelete.includes(rowIndex)}/>
                  :
                  <Cell key={rowIndex.toString()+columnIndex.toString()} blockType={elem} flash={this.state.linesToDelete.includes(rowIndex)} /> )
                ))
              ))
            }
          </div>
        </div>
        <div className={`infos-container ${showHighscore?"hidden":""}`}>
          <LevelDisplay level={this.getLevel()} />
          <ScoreDisplay score={this.state.score} />
          {/*<div className="test-button" onClick={this.handleClickTest6}> ADD BLOCKS</div>*/}
          <UpNext tetrimino={this.state.nextTetrimino} />
          {button}
        </div>
        { showHighscore && 
          <Highscores 
            close={this.closeHighscore} 
            endGame={gameState===gameStateEnum.END} 
            newScore={this.state.showEndGameHighscore?{
              score: this.state.score,
              line: this.state.nbLinesCompleted,
            }:null}
          />
        }
        <KeyInput
            onKeyDown={this.keyDownHandler}
            attachRef={this.handleRefAttachement}
            onBlur={this.handleKeyInputBlur}
          />
        <audio ref={this.musicPlayer} loop >
          <source src={tetrisAudio} type="audio/mp3"/>
        </audio>
      </div>

    );
  }
}

export default App;
