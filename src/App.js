import React from 'react';
import styled from 'styled-components';
import './App.css';

//TODO


const PLAYER_1= 'X';
const PLAYER_2= 'O';

const PLAYERS ={
  'COMPUTER': 'X',
  'HUMAN': 'O'
};

const Square = styled.div`
  width:100px;
  height:100px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid #ccc;
`
const Board = styled.div`
  width:310px;
  height:310px;
  display:flex;
  align-items:space-between;
  justify-content:space-between;
   flex-wrap:wrap;
`;
class  App extends React.Component{

  constructor(props) {
    super(props);
    this.state={
      board:[
        ['','',''],
        ['','',''],
        ['','',''],
      ],
      currentPlayer: PLAYER_1,
      winner: '',
      isTie: false
    };
  }
  getWinner =(board)=>{
    const newBoard  = [...board];
    let winner = '';
    for(let i=0; i< 3; i++){
      if(newBoard[i][0] === newBoard[i][1] && newBoard[i][1] === newBoard[i][2] && newBoard[i][2] !== ''){
        winner = newBoard[i][0];
      }
      if(newBoard[0][i] === newBoard[1][i] && newBoard[1][i] === newBoard[2][i] && newBoard[2][i] !== '') {
        winner =newBoard[0][i];
      }
    }
    if(newBoard[0][0] === newBoard[1][1] && newBoard[1][1] === newBoard[2][2] && newBoard[2][2] !== '' ){
      winner =newBoard[0][0];
    }
    if(newBoard[0][2] === newBoard[1][1] && newBoard[1][1] === newBoard[2][0]  && newBoard[2][0] !== '' ){
      winner =newBoard[0][2];
    }

    if(this.getAvailablePositions(newBoard).length === 0 && winner === '' ){
        winner = 'tie';
    }

    return winner;

  };

  winningSolutions=[
    ['00','01','02'],
    ['10','11','12'],
    ['20','21','22'],
    ['00','10','20'],
    ['01','11','21'],
    ['02','12','22'],
    ['00','11','22'],
    ['02','11','20'],
  ];

  getSolutionsWithXYCombo=(speculatedMoveXY, existingPosition)=>{
      const solutions = [];

     this.winningSolutions.forEach( solution => {

       if(solution.indexOf(speculatedMoveXY) !== -1 && solution.indexOf(existingPosition) !== -1  ){
         solutions.push(solution);
       }
     });
     return solutions;

  }

  getXAndYObject=(XYString)=>{

    return {
      x: XYString[0],
      y: XYString[1]
    }
  };
  checkIfItHasO=(board, oneOfWinningSolution, speculatedMove)=>{

    const newBoard = [...board];

    let {x,y}=speculatedMove;
    newBoard[x][y] = 'X';
    let resultingFormation='';
    oneOfWinningSolution.forEach( position => {

      let {x,y}=this.getXAndYObject(position);
      resultingFormation += newBoard[x][y];
    });
    newBoard[x][y]='';
    return resultingFormation.indexOf('O') !== -1;

  };
  getAvailablePositions=(board)=>{
      const newBoard = [...board];
      const availablePositions=[];
      newBoard.forEach( (row,rowIndex) =>
        row.forEach( (column,columnIndex) => {
          if(column === ''){
            availablePositions.push({x:rowIndex, y: columnIndex});
          }
        })
    );
    return availablePositions;

  };


  computerPlays=(board)=>{
      const newBoard = [...board];
      const availablePositions = this.getAvailablePositions(newBoard);
      const markAbleMoves=[];


    for(let i=0;i< availablePositions.length;i++){

      let availablePosition=availablePositions[i];
      const possibleSolutions = this.getSolutionsWithXYCombo(availablePosition.x + '' +availablePosition.y, '11' );

      possibleSolutions.forEach(solution => {
        if(this.checkIfItHasO(newBoard,solution,availablePosition)){
          markAbleMoves.push(availablePosition);
        }
      });
      if(markAbleMoves.length>0){

        this.markPosition(markAbleMoves[0]);
        return false;
      }
    }
  };
  markPosition = ({x,y})=>{

    const newBoard = [...this.state.board];
    if(this.state.winner !== '' || this.state.isTie){
        return;
    }
    if(newBoard[x][y] !== ''){
      return;
    }
    newBoard[x][y] = this.state.currentPlayer;
    this.setState(prevState=>{
      return{
        board: newBoard,
        currentPlayer: prevState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1
      }
    })
  };

  componentDidMount() {
    this.markPosition({x:1,y:1});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if(prevState.currentPlayer !== this.state.currentPlayer){
      const winner = this.getWinner(this.state.board);

      if(winner !=='' && winner !== 'tie'){
        this.setState({
          winner
        })
      }

      if(winner === 'tie'){
        this.setState({
          isTie: true
        })
      }


      if(prevState.currentPlayer === PLAYERS.HUMAN && winner === ''){
        this.computerPlays(this.state.board);
      }


    }
  }

  render() {
    return(
        <div>
          { this.state.isTie  && <div>Its a Tie</div>  }
          { this.state.winner !== '' && <div>{ `${this.state.winner} Wins` }</div>  }
          <Board>
            {  this.state.board.map(  (row,rowIndex)=> row.map(  (column,columnIndex )=> <Square  onClick={ ()=> this.markPosition({x:rowIndex , y: columnIndex}) } key={ rowIndex + '' + columnIndex } > {this.state.board[rowIndex][columnIndex]} </Square>  ))}
          </Board>
        </div>

    )
  }

}

export default App;
