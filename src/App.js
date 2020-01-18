import React from 'react';
import styled from 'styled-components';
import './App.css';

//TODO


const PLAYER_1= 'X';
const PLAYER_2= 'O';

const POINTS = {
  X: 1,
  O : -1,
  tie: -1
};

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
    const newBoard  = [...this.state.board];
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




  // function minimax(node, maximizingPlayer)
  // const winner = getWinner();
  // if(winner)	{
  //   return POINTS[winner];
  // }
  //
  //
  //
  //
  // if maximizingPlayer then
  // value := −∞
  //
  // AVAILABLESPACE()
  //
  // highsetScore=−Infinity
  // set value
  // score = algo();
  // if(score > highsetScore)
  // highsetScore=score;
  //
  //
  // return value
  // else (* minimizing player *)
  //
  // AVAILABLESPACE()
  // highsetScore=Infinity
  // set value
  // score = algo();
  // if(score < highsetScore)
  // lowestScore=score;





  minimax = (board,maximizingPlayer)=>{
    const winner = this.getWinner(board);
    const newBoard = [...board];
    if(winner !== ''){
      return POINTS[winner];
    }

    if(maximizingPlayer){
      let availablePositions = this.getAvailablePositions(newBoard);
      let highestScore = -Infinity;
      availablePositions.forEach(position=> {
        newBoard[position.x][position.y]= PLAYERS.COMPUTER;
        let score = this.minimax(newBoard,false);
        if(score > highestScore){
          highestScore = score;
        }
        newBoard[position.x][position.y]='';
      });

      return  highestScore;
    }else{
      let availablePositions = this.getAvailablePositions(newBoard);
      let lowestScore = Infinity;
      availablePositions.forEach(position=> {
        newBoard[position.x][position.y]= PLAYERS.HUMAN;
        let score = this.minimax(newBoard,true);
        newBoard[position.x][position.y]='';
        if(score < lowestScore){
          lowestScore = score;
        }
      });
      return  lowestScore;
    }
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
      const lowerThanHighest =  this.discardHighest(availablePositions, newBoard);
      this.markPosition(lowerThanHighest);

  };

  discardHighest=(availablePositions, board )=>{
    if(availablePositions.length === 1){
      return  availablePositions[0];
    }
    const newBoard = [...board];
    let highestScore = -Infinity;
    let highestSpotIndex;

    availablePositions.forEach( (position, positionIndex) =>{
      newBoard[position.x][position.y]= PLAYERS.COMPUTER;
      let score = this.minimax(board, false);
      newBoard[position.x][position.y]='';
      if(score > highestScore){
        highestScore=score;
        highestSpotIndex = positionIndex;
      }
    });

    availablePositions.splice(highestSpotIndex,1);
    if(availablePositions.length === 1){
      return availablePositions[0];
    }else{
      return this.discardHighest(availablePositions, newBoard);
    }
  }

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
    this.markPosition({x:0,y:0});
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


      if(prevState.currentPlayer === PLAYERS.HUMAN){
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
