import {useState} from "react";
import {ForElements} from "./Functions";
import {GridNumbers} from "./GridNumbers";
import * as P from "./PiecesShogi";
import {getChineseLetter} from "./GridNumbers";


function getShogiIndex(row, column) {
    return (row+1).toString() + getChineseLetter(column + 1);
}

class Grids {
    array= Array(5).fill(Array(5).fill(null));
    setGrid(row, column, value) {
        let newGrids = this.array.slice();
        let newRow = newGrids[row].slice();
        newRow[column] = value;
        newGrids[row] = newRow;
        this.array = newGrids;
    }

    constructor(height, width, defaultValue = null) {
        this.array = Array(height).fill(Array(width).fill(defaultValue));
    }

}
class Game {
    width = 5;
    height = 5;

    grids= new Grids(5, 5);

    nextPlayer = true;
    gridSelected = null;
    getGridSelected() {
        return this.grids.array[this.gridSelected[0]][this.gridSelected[1]];
    }
    getGridSelectedShogiIndex() {
        return getShogiIndex(this.gridSelected[0], this.gridSelected[1]);
    }
    getGridSelectedStr() {
        return this.getGridSelectedShogiIndex() + this.getGridSelected()?.pieceName[0];
    }

    clone() {
        let clone =
            new Game(
                this.width,
                this.height,
            );
        clone.grids = this.grids;
        clone.nextPlayer = this.nextPlayer;
        clone.gridSelected = this.gridSelected;
        return clone;
    }

    constructor(height, width, initGame = false) {
        this.height = height;
        this.width = width;
        this.grids = new Grids(height, width);
        this.nextPlayer = true;

        if (initGame)
            this.initGame();
    }

    initGame() {
        console.warn("--- Init Game ---")

        let template = [
            "         ",
            "         ",
            "         ",
            "         ",
            "         ",
            "         ",
            "ppppppppp",
            " b     r ",
            "lksg*gskl",
        ]

        generatePieces(this.grids, template, 0);
        generatePieces(this.grids, template, 1);

        function generatePieces(grids, template, player = 0) {
            console.log("--- Generate Piece of Player " + player + " ---");

            let reverseOrder = player !== 0;

            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    let piece;

                    switch (template[r][c]) {
                        case 'p': piece = new P.Pawn(); break;
                        case 'k': piece = new P.Knight(); break;
                        case 'l': piece = new P.Lance(); break;
                        case 's': piece = new P.SilverGeneral(); break;
                        case 'g': piece = new P.GoldGeneral(); break;
                        case 'b': piece = new P.Bishop(); break;
                        case 'r': piece = new P.Rook(); break;
                        case '*': piece = new P.King(); break;
                        default: piece = null; break;
                    }
                    if (piece === null) continue;

                    piece.player = player;

                    let r2 = !reverseOrder ? r : 8 - r, c2 = !reverseOrder ? c : 8 - c;
                    console.log(getShogiIndex(r2, c2) + " " + piece.pieceName[0]);
                    grids.setGrid(r2, c2, piece);
                }
            }
        }

        console.warn("--- Init End ---")
    }



    handleClick(r, c) {

        //console.log(this.gridSelected);
        //return;

        console.warn("handleClick: Click (" + getShogiIndex(r, c) + ")");

        if(!this.gridSelected) {
            this.gridSelected = [r, c];
            console.log("Grid Selected " + this.getGridSelectedStr());
        }
        else {
            console.log(this.getGridSelectedStr() + " Try Move to " + getShogiIndex(r, c));

            if (this.checkWalkable(r, c)) {
                let r1 = this.gridSelected[0], c1 = this.gridSelected[1];

                this.movePiece(r1, c1, r, c);

                console.log("Grid Selected Reset");
                this.gridSelected = null;
            }
        }

        this.nextPlayer = !this.nextPlayer;

        if(this.checkWinner(this.grids, r, c)){
            alert(" wins");
        }
    }

    checkWalkable(row, column) {
        //if (gridSelected.obj.)
        return true;
    }

    movePiece(r1, c1, r2, c2) {
        let p1 = this.grids.array[r1][c1];
        let p2 = this.grids.array[r2][c2];

        console.log("Move Piece " + p1.pieceName +
            " @ " + getShogiIndex(r1, c1) + " -> " + getShogiIndex(r2, c2));

        if (p2) this.capturePiece(p2, p1.player);
        this.grids.setGrid(r2, c2, p1);
        this.grids.setGrid(r1, c1, null);
    }

    capturePiece(piece, byPlayer) {
        console.log("Capture Piece " + piece.pieceName + " by Player " + byPlayer);
    }

    checkWinner(grid, row, column){

    }
}




export function GameBoard({width, height, rowNoType, columnNoType}){
    const [game, updateGame] = useState(new Game(width, height, true));

    function getPieces() { return game.grids.array; }

    function handleClick(row, column) {
        let updatedGame = game.clone();
        updatedGame.handleClick(row, column);
        updateGame(updatedGame);
    }

    return(
        <div id="game-board">
            <GridNumbers width={width} height={height} rowNoType={rowNoType} columnNoType={columnNoType}/>
            <div id="game-board-inner">
            {
                ForElements(
                    height,
                    (r) =>
                    <GridRow
                        pieceRow={getPieces()[r]}
                        handleColumnClick={(c) => handleClick(r, c)} //已经确认r

                        rowIndex={r}
                        width={width}
                        key={r}
                    />
                )
            }
            </div>
        </div>
    )
}

function GridRow({rowIndex, width, pieceRow, handleColumnClick}){

    return (
        <div className="board-row">
            {
                ForElements(
                    width,
                    (c) =>
                    <Grid
                        piece={pieceRow[c]}
                        handleGridClick={() => handleColumnClick(c)}

                        columnIndex={c}
                        rowIndex={rowIndex}
                        key={c}
                    />
                )
            }
        </div>
    )
}

function Grid({rowIndex, columnIndex, piece, handleGridClick}){
    //const r = rowIndex, c = columnIndex;

    //function handleClick() {
    //    setValue('X')
    //}

    return (
        <button
            className={"grid" + ((piece && piece.player !== 0) ? " inverse" : "")}
            onClick={() => handleGridClick() }
        >
            <div>
                { (piece)?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.41 43.68">
                        <path stroke="#eee" fill="none" className="cls-1" d="M35.91,43.18H2.5c-1.21,0-2.15-1.08-1.98-2.28L5.04,8.08c.14-1.03,.81-1.92,1.77-2.34L18.4,.67c.51-.22,1.09-.22,1.6,0l11.59,5.07c.96,.42,1.63,1.3,1.77,2.34l4.52,32.83c.17,1.2-.77,2.27-1.98,2.27Z"/>
                    </svg> :
                    null
                }
                <p>{piece?.pieceName}</p>
            </div>
        </button>
    )
}