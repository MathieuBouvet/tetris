import React, { Component } from 'react';
import './App.css';

import Cell from "./Cell";

import Tetrimino from "./Model/Tetrimino";
import KeyInput from "./KeyInput";

import UpNext from "./UpNext";
import ScoreDisplay from "./ScoreDisplay";
import LevelDisplay from "./LevelDisplay";

const boardSize = {
  row: 10,
  column: 20,
}

const gameState = {
  BEGIN: 0,
  RUNNING: 1,
  PAUSED: 2,
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
    this.state = {
      board: createBoard(boardSize.column,boardSize.row),
      tetrimino: this.getTetriminoFromBag(),
      nextTetrimino: this.getTetriminoFromBag(),
      nbLinesCompleted: 0,
      score: 0,
      gameState: gameState.BEGIN,
    }
  }

  /** EVENT HANDLERES */
  handleClickTest1 = (e) => {
    this.moveDown();
  }
  handleClickTest2 = (e) => {
    this.rotateRight();
  }
  handleClickTest3 = (e) => {
    this.rotateLeft();
  }
  handleClickTest4 = (e) => {
    this.moveLeft();
  }
  handleClickTest5 = (e) => {
    this.moveRight();
  }
  handleClickTest6 = (e) => {
    const board = this.cloneBoard();
    const emp = "empty";
    board[13] = [emp,emp,emp,emp,emp,emp,emp,emp,emp,emp];
    board[14] = [emp,"L",emp,emp,emp,emp,"L",emp,emp,emp];
    board[15] = [emp,"L",emp,emp,emp,emp,"L","L",emp,emp];
    board[16] = ["J","J","J","J",emp,"J","J","J","J","J"];
    board[17] = ["J","J",emp,"J",emp,"J","J","J","J","J"];
    board[18] = ["J","J","J","J",emp,"J","J","J","J",emp];
    board[19] = ["J","J","J","J",emp,"J","J","J","J","J"];
    this.setState({
      "board": board,
    });
  }
  handleClickTest7 = (e) => {
    this.run();
  }
  handleClickTest8 = (e) =>{
    this.pause();
  }
  keyDownHandler = (event, test) => {
    if(this.state.gameState === gameState.RUNNING){
      switch(event.key){
      case "ArrowDown":
        this.moveDown();
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

  /** LOGIC METHOD */
  run(){
    this.runGame = setInterval(this.gravity, 500-(50*(this.getLevel()-1)));
    this.setState({
      gameState: gameState.RUNNING,
    });
  }
  pause(){
    if(this.state.gameState === gameState.RUNNING){
      clearInterval(this.runGame);
      this.setState({
        gameState: gameState.PAUSED,
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
        gameState: gameState.BEGIN,
      });
      let feedback = "mouai -_- recommence ;p";
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
      alert("perdu \n score : "+this.state.score+" "+feedback);
      return;
    }

    const linesToDelete = (this.checkNewLines(tetrimino.getRowSpan(), newBoard));
    if(linesToDelete.length > 0){
      this.deleteLines(linesToDelete, newBoard);

    }
    const newNbLinesCompleted = nbLinesCompleted+linesToDelete.length;

    // Set new speed of the game if level has changed
    if(this.getLevel() !== this.getLevel(newNbLinesCompleted)){
      clearInterval(this.runGame );
      this.runGame = setInterval(this.gravity, 500-(50*(this.getLevel(newNbLinesCompleted)-1)));
    }

    this.setState({
      board: newBoard,
      tetrimino: nextTetrimino,
      nextTetrimino: this.getTetriminoFromBag(),
      score: this.getNewScore(linesToDelete.length),
      nbLinesCompleted: newNbLinesCompleted,
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
    setTimeout(()=>(this.domRefKeyInput.focus()),0  );
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

  render() {
    const { board, tetrimino } = this.state;
    return (
      <div className="App">
        <div className="app-header">
          <div className="app-title">
            <h1>Tetris</h1>
          </div>
        </div>
        <div className="board">
          {
            board.map( (row, rowIndex) => (
              row.map( (elem, columnIndex) => (
                ( tetrimino.isPosition(rowIndex, columnIndex) ?
                <Cell key={rowIndex.toString()+columnIndex.toString()} blockType={tetrimino.type} />
                :
                <Cell key={rowIndex.toString()+columnIndex.toString()} blockType={elem} /> )
              ))
            ))
          }
        </div>
        <div className="test-button-container">
          <ScoreDisplay score={this.state.score} />
          <LevelDisplay level={this.getLevel()} />
          <div className="test-button" onClick={this.handleClickTest6}> ADD BLOCKS</div>
          <div className="test-button" onClick={this.handleClickTest7}> START</div>
          <div className="test-button" onClick={this.handleClickTest8}> PAUSE</div>
          <KeyInput
            onKeyDown={this.keyDownHandler}
            attachRef={this.handleRefAttachement}
            onBlur={this.handleKeyInputBlur}
          />
          <UpNext tetrimino={this.state.nextTetrimino} />
        </div>
      </div>

    );
  }
}

export default App;
