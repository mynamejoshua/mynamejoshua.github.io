// 6 x 7
import { useState } from "react";

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;


function Cell({ value, color }) {
    if (color === null) color = "gray";
    return (
        <div className={color} >{value}</div>
    )
}

function Column({ cells, onClickFunc }) {

    return (
        <div className="column" onClick={onClickFunc}>
            {cells}
        </div>
    )
}

function Board({ board, onPlay, redNext }) {
    function handle_click(i) {
        const startIndex = i * BOARD_HEIGHT;
        const nextBoard = board.slice();
        const originalNumFull = nextBoard[startIndex].numFull;
        const indexToPlace = startIndex + originalNumFull;

        if (nextBoard[startIndex].numFull >= BOARD_HEIGHT) {
            return;
        }

        for (let i = startIndex; i < startIndex + BOARD_HEIGHT; i++) {
            nextBoard[i].numFull = originalNumFull + 1;
            if (indexToPlace === i) {
                // nextBoard[i].renderChar = '*';
                nextBoard[i].renderChar = redNext ? '🔴' : '🔵';
                nextBoard[i].color = redNext ? 'red' : 'blue';
                redNext = !redNext;
            }
        }
        onPlay(nextBoard);
    }

    let grid = [];
    let columnCells = [];
    for (let i = 0; i < board.length; i++) {
        columnCells.push(<Cell key={i} value={board[i].renderChar} color={board[i].color} />); // Add cell to current column
        // if column is divisible by row height, and it isn't the last element
        if ((i + 1) % BOARD_HEIGHT === 0 || i === board.length - 1) {
            let columnNum = i / BOARD_HEIGHT;
            grid.push(
                <Column cells={columnCells} key={columnNum} onClickFunc={() => handle_click(parseInt(columnNum))} />
            );
            columnCells = []; // Reset for the next column
        }
    }

    return (
        <div className="game-board">
            {grid}
        </div>
    );
}

export default function Game() {
    const cellTemplate = { numFull: 0, renderChar: null, color: null }
    const initialBoardState = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null).map(() => ({ ...cellTemplate }));

    const [boardState, set_board] = useState(initialBoardState);
    const [currentMove, setCurrentMove] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const redIsNext = currentMove % 2 === 0;

    function handle_play(nextBoard) {
        if(gameOver) {
            return
        }

        set_board(nextBoard);
        setCurrentMove(currentMove + 1);
        // check game over
        if (calculateWinner(boardState) || currentMove >= BOARD_HEIGHT * BOARD_WIDTH - 1) {
            console.log("WINNER");
            setGameOver(true);
        }
    }

    function reset_game() {
        set_board(initialBoardState);
        setCurrentMove(0);
        setGameOver(false);
    }

    return (
        <>
        <div className="game">
            <Board board={boardState} onPlay={handle_play} redNext={redIsNext} />
            <div className="game-info">
                <ol>Next move: {redIsNext ? 'RED' : 'BLUE'}</ol>
                <ol>Move Number: {parseInt(currentMove / 2) + 1}</ol>
            </div>
        </div>
        {gameOver? 
            <>
                {currentMove <= BOARD_HEIGHT * BOARD_WIDTH -1? <h1>WINNER IS {redIsNext ? 'BLUE' : 'RED'}</h1>: <h1>TIE</h1>}
                <button onClick={reset_game}>Play Again?</button>
            </>
            : <></>
        }
        </>
    );
}

function calculateWinner(squares) {
    const width = BOARD_WIDTH;
    const height = BOARD_HEIGHT;
    let lines = [];

    // Vertical lines
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height - 3; row++) {
            lines.push([col * height + row, col * height + row + 1, col * height + row + 2, col * height + row + 3]);
        }
    }

    // Horizontal lines
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width - 3; col++) {
            lines.push([col * height + row, (col + 1) * height + row, (col + 2) * height + row, (col + 3) * height + row]);
        }
    }

    // Diagonal lines (top-left to bottom-right)
    for (let col = 0; col < width - 3; col++) {
        for (let row = 0; row < height - 3; row++) {
            lines.push([col * height + row, (col + 1) * height + row + 1, (col + 2) * height + row + 2, (col + 3) * height + row + 3]);
        }
    }

    // Diagonal lines (bottom-left to top-right)
    for (let col = 0; col < width - 3; col++) {
        for (let row = 3; row < height; row++) {
            lines.push([col * height + row, (col + 1) * height + row - 1, (col + 2) * height + row - 2, (col + 3) * height + row - 3]);
        }
    }

    // Check each line
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (squares[a].color && squares[a].color === squares[b].color && squares[a].color === squares[c].color && squares[a].color === squares[d].color) {
            return squares[a];
        }
    }
    return null;
}
