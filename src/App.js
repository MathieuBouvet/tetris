import React, { Component } from 'react';
import './App.css';

import Cell from "./Cell";

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
      board: createBoard(20,10),
    }
  }

  /** EVENT HANDLERES */
  handleClickTest = (e) => {

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
