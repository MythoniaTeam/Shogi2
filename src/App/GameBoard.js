import React, {useEffect, useState} from "react";
import {GridNumbers} from "./GridNumbers";
import * as P from "./PiecesShogi";
import {getChineseLetter} from "./GridNumbers";
import {Game} from "./Game";



export function map(length, func){
    return Array(length).fill(null).map(
        (_, i) => func(i)
    )
}


export function GameBoard({rowNoType, columnNoType, game}) {

    const [count, setCount] = useState(0);



    function handleClick(r, c) {
        game.click(r, c);
        setCount(count + 1);
    }

    return (
        <div id="game-board">
            <GridNumbers
                width={game.grids.width} height={game.grids.height}
                rowNoType={rowNoType} columnNoType={columnNoType}/>
            <div id="game-board-inner">
            {
                map(game.grids.height, (r) =>
                    <GridRow
                        pieceRow={game.grids.array[r]}
                        handleColumnClick={(c) => handleClick(r, c)} //已经确认r

                        rowIndex={r}
                        width={game.grids.width}
                        key={r}
                    />
                )
            }
            </div>
        </div>
    );

}

function GridRow({rowIndex, width, pieceRow, handleColumnClick}){

    return (
        <div className="board-row">
            {
                map(width, (c) =>
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

function Grid({piece, handleGridClick}){

    return (
        <button
            className={"grid"}
            onClick={() => handleGridClick() }
        >
            { (piece) ? <Piece pieceObj={piece}/> : null }
        </button>
    )
}


function Piece({pieceObj}) {
    return (
        <div className={"piece" + ((pieceObj.player.inverse) ? " inverse" : "")}>
            { (pieceObj)?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.41 43.68">
                    <path stroke="#eee" fill="none" className="cls-1" d="M35.91,43.18H2.5c-1.21,0-2.15-1.08-1.98-2.28L5.04,8.08c.14-1.03,.81-1.92,1.77-2.34L18.4,.67c.51-.22,1.09-.22,1.6,0l11.59,5.07c.96,.42,1.63,1.3,1.77,2.34l4.52,32.83c.17,1.2-.77,2.27-1.98,2.27Z"/>
                </svg> :
                null
            }
            <p>{pieceObj?.pieceName}</p>
        </div>
    )
}