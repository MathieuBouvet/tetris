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
  cloneBoard(){
    return this.state.board.map( (elem) => elem.slice() );
  }

  }
  render() {
    const { board } = this.state;
    return (
      <div className="App">
        <div className="app-header">
          <div className="app-title">
            <h1>Tetris</h1>
          </div>
        </div>
        <div className="board">
          { board.map( (row, rowIndex) => (
            row.map( (elem, columnIndex) => (
              <Cell key={rowIndex.toString()+columnIndex.toString()} blockType={elem} />
            ))
          ))}
        </div>
        <div className="test-button" onClick={this.handleClickTest}> TEST BUTTON</div>
      </div>
    );
  }
}

export default App;
