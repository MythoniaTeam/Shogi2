import {useState} from "react";
import {ForElements} from "./Functions";
import {GridNumbers} from "./GridNumbers";



class Board {
    width = 5;
    height = 5;
    winLength = 3;

    grids;

    xIsNext = true;
    gridSelected = null;

    clone() {
        let clone =
            new Board(
                this.width,
                this.height,
                this.winLength
            );
        clone.grids = this.grids;
        clone.xIsNext = this.xIsNext;
        clone.gridSelected = this.gridSelected;
        return clone;
    }

    constructor(height, width, winLength = 3) {
        this.height = height;
        this.width = width;
        this.grids =
            Array(height).fill(
                Array(width).fill(null));
        this.winLength = winLength;
        this.xIsNext = true;
    }

    setGrid(row, column, value) {
        let newGrids = this.grids.slice();
        let newRow = newGrids[row].slice();
        newRow[column] = value;
        newGrids[row] = newRow;
        this.grids = newGrids;
    }

    handleClick(row, column) {

        console.log("handleClick: Click (" + row + ", " + column + ")");

        if(!this.gridSelected) {
            this.gridSelected = {x: row, y: column, obj: this.grids[row][column]};
        }
        else {
            this.checkGridWalkable(row, column);
        }

        let char = this.xIsNext ? '龍馬' : 'と'
        this.setGrid(row, column, char);
        this.xIsNext = !this.xIsNext;

        if(this.checkWinner(this.grids, row, column, this.winLength, char)){
            alert(char + " wins");
        }
    }


    checkGridWalkable(row, column) {
        //if (gridSelected.obj.)
    }
    checkWinner(grid, row, column, length, char){
        const dir = [
            { dRow: 1, dColumn :-1 },
            { dRow: 1, dColumn : 0 },
            { dRow: 1, dColumn : 1 },
            { dRow: 0, dColumn : 1 },
        ]

        let win = true;
        for(let i = 0; i < 4; i++) { //确认检查的方向

            for (let d1 = -length + 1; d1 <= 0; d1++) { //确认开始的格子 d1
                win = true;
                for (let d2 = d1; d2 < d1 + length; d2++) { //从 d1 遍历到之后的 length 个格子
                    if (grid[row + dir[i].dRow * d2] === undefined ||
                        grid
                            [row + dir[i].dRow * d2]
                            [column + dir[i].dColumn * d2] !== char) {
                        win = false; //如果检测到任何一个格子不等于 char, 表示没有获胜
                        break;
                    }
                }
                if(win) {
                    return true; //如果赢了, 直接返回真
                }
            }

        }
        return false;
    }
}

export function GameBoard({width, height, winLength, rowNoType, columnNoType}){
    const [board, setBoard] = useState(new Board(width, height, winLength));

    function handleClick(row, column) {
        let newBoard = board.clone();
        newBoard.handleClick(row, column);
        setBoard(newBoard);
    }

    return(
        <div id="game-board">
            <GridNumbers width={width} height={height} rowNoType={rowNoType} columnNoType={columnNoType}/>
            <div id="game-board-inner">
            {ForElements(height, (row) =>
                <GridRow
                    value={board.grids[row]}
                    handleColumnClick={(c) => handleClick(row, c)} //row, 已经确认y

                    rowIndex={row}
                    width={width}
                    key={row}/>)}
            </div>
        </div>
    )
}



function GridRow({rowIndex, width, value, handleColumnClick}){
    return (
        <div className="board-row">
            {ForElements(width,(column) =>
                <Grid value={value[column]}
                      handleGridClick={() => handleColumnClick(column)}

                      rowIndex={rowIndex}
                      columnIndex={column}
                />)}
        </div>
    )
}

function Grid({rowIndex, columnIndex, value, handleGridClick}){
    //const r = rowIndex, c = columnIndex;

    //function handleClick() {
    //    setValue('X')
    //}

    return (
        <button
            className="grid"
            onClick={() => handleGridClick() }

        >{value}</button>
    )
}