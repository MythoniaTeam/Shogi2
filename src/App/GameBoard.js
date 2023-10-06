import {useState} from "react";
import {ForElements} from "./Functions";
import {GridNumbers} from "./GridNumbers";

export function GameBoard({width, height, winLength, rowNoType, columnNoType}){

    function handleClick(row, column) {
        if(grids[row][column]) return; //grid has been occupied

        const newGrid = grids.slice();
        newGrid[row] = grids[row].slice();


        let char = xIsNext ? '龍馬' : 'と'
        newGrid[row][column] = char;
        setXIsNext(!xIsNext);

        if(checkWinner(newGrid, row, column, winLength, char)){
            alert(char + " wins");
        }

        setGrids(newGrid);
    }

    function checkWinner(grid, row, column, length, char){
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

    const [xIsNext, setXIsNext] = useState(true);
    const [grids, setGrids] =  useState(
        Array(height).fill(
            Array(width).fill(null)));

    return(
        <div id="game-board">
            <GridNumbers width={width} height={height} rowNoType={rowNoType} columnNoType={columnNoType}/>
            <div id="game-board-inner">
            {ForElements(height, (row) =>
                <GridRow
                    value={grids[row]}
                    onGridInRowClick={(column) => handleClick(row, column)} //row, 已经确认y

                    rowIndex={row}
                    width={width}
                    key={row}/>)}
            </div>
        </div>
    )
}



function GridRow({rowIndex, width, value, onGridInRowClick}){
    return (
        <div className="board-row">
            {ForElements(width,(column) =>
                <Grid value={value[column]}
                      onGridClick={() => onGridInRowClick(column)}

                      rowIndex={rowIndex}
                      columnIndex={column}
                />)}
        </div>
    )
}

function Grid({rowIndex, columnIndex, value, onGridClick}){
    //const r = rowIndex, c = columnIndex;

    //function handleClick() {
    //    setValue('X')
    //}

    return (
        <button
            className="grid"
            onClick={onGridClick}
        >{value}</button>
    )
}