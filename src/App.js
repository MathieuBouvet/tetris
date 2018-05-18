import React, { Component } from 'react';
import './App.css';

import Cell from "./Cell";

import Tetrimino from "./Model/Tetrimino";

const boardSize = {
  row: 10,
  column: 20,
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: createBoard(boardSize.column,boardSize.row),
      tetrimino: Tetrimino.getRandom(),
      nextTetrimino: Tetrimino.getRandom(),
    }
  }

  /** EVENT HANDLERES */

  /** LOGIC METHOD */
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
    //const { board } = this.state;
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
    const { tetrimino, nextTetrimino } = this.state;
    let newBoard = this.cloneBoard();
    for(let i=0 ; i<tetrimino.position.length ; i++){
      const { posX, posY } = tetrimino.position[i];
      newBoard[posX][posY] = tetrimino.type;
    }
    const linesToDelete = (this.checkNewLines(tetrimino.getRowSpan(), newBoard));
    if(linesToDelete.length > 0){
      this.deleteLines(linesToDelete, newBoard)
    }

    this.setState({
      board: newBoard,
      tetrimino: nextTetrimino,
      nextTetrimino: Tetrimino.getRandom(),
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
    // Move down above blocks
    const startingIndex = lines[0]-1;
    let lineEmpty = false;
    // Loop through each row above, and stop if there is an empty line detected
    for(let i=startingIndex ; i >= 0  && !lineEmpty; i--){
      let nbEmptyBlock = 0;
      for(let j=0 ; j<boardSize.row ; j++){
        let currentBlock = board[i][j];
        if(currentBlock !== "empty"){
          board[i+nbLines][j] = currentBlock;
          board[i][j] = "empty";
        }else{
          nbEmptyBlock++;
        }
      }
      if(nbEmptyBlock===boardSize.row){
        lineEmpty = true;
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
        </div>
        <div className="test-button" onClick={this.handleClickTest}> TEST BUTTON</div>
      </div>
    );
  }
}

export default App;
