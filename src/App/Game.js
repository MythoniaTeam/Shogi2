import * as P from "./PiecesShogi";
import {getChineseLetter} from "./GridNumbers";


class v2 {
    constructor(r, c) {
        this.r = r;
        this.c = c;
    }
}

class Grids {

    get height() { return this.array.length; }
    get width() { return this.array[0].length; }

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


export class Player {


    get selectedPiece() {
        return ((this.selectedPos) ?
            this.grids.array[this.selectedPos.r][this.selectedPos.c] :
            null);
    }

    grids = null;
    constructor(name, grids, inverse = false) {
        this.playerName = name;
        this.grids = grids;
        this.inverse = inverse;
        this.selectedPos = null;
    }

    get selectedShogiPos() { return Game.shogiIndex(this.selectedPos.r, this.selectedPos.c); }
    get selectedPieceName() { return this.selectedShogiPos + this.selectedPiece?.pieceName[0]; }

}


export class Game {
    static shogiIndex(r, c) {
        return (r+1).toString() + getChineseLetter(c + 1);
    }



    constructor(height, width, initGame = false) {

        this.grids = new Grids(height, width);

        this.players = [
            new Player("alpha", this.grids, false),
            new Player("beta", this.grids, true)
        ];

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

        generatePieces(this.grids, template, 0, this.players);
        generatePieces(this.grids, template, 1, this.players);

        function generatePieces(grids, template, pid = 0, players) {
            console.log("--- Generate Piece of Player " + pid + " ---");

            let reverseOrder = pid !== 0;

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

                    piece.player = players[pid];

                    let r2 = !reverseOrder ? r : 8 - r, c2 = !reverseOrder ? c : 8 - c;
                    console.log(Game.shogiIndex(r2, c2) + " " + piece.pieceName[0]);
                    grids.setGrid(r2, c2, piece);
                }
            }
        }

        console.warn("--- Init End ---")
    }



    grids;
    grid(r, c) {
        return this.grids.array[r][c];
    }
    gridBelongToCurrentPlayer(r, c) {
        return this.grid(r, c) && this.grid(r, c).isBelongTo(this.currentPlayer);
    }


    _currentPlayerIndex = 0;
    players;
    get currentPlayer() { return this.players[this._currentPlayerIndex]; }
    nextPlayer() {
        //结束当前玩家的回合, 切换到下一玩家
        this._currentPlayerIndex ++;
        if(this._currentPlayerIndex >= this.players.length)
            this._currentPlayerIndex %= this.players.length;
        console.log("----------------")
    }



    click(r, c) {
        console.log("Player [" + this.currentPlayer.playerName + "] clicked " + Game.shogiIndex(r, c));
        //如果已经选择了棋子, 且目标格子没有我方棋子
        if (this.currentPlayer.selectedPiece && !this.gridBelongToCurrentPlayer(r, c)) {
            let p1 = this.currentPlayer.selectedPos;

            console.log("Try Move " + this.currentPlayer.selectedPieceName + " to " + Game.shogiIndex(r, c));

            if (this.tryMovePiece(p1.r, p1.c, r, c)) {
                //结束回合
                this.nextPlayer();
            }
        }
        else {
            console.log("try select piece " + Game.shogiIndex(r, c));
            if (this.trySelectPiece(r, c)) {
                console.log("select " + this.currentPlayer.selectedPieceName);
            } else {
                //如果选取了违法的格子, 清除之前选择的棋子
                console.log("select fall, clear select piece");
                this.selectNull();
            }

        }
    }



    trySelectPiece(r, c) {
        //尝试选取棋子, 若格子为空或不属于当前玩家, 返回false
        if (this.gridBelongToCurrentPlayer(r, c)) {
            this.selectPiece(r, c);
            return true;
        }
        return false;
    }

    selectPiece(r, c) {
        //将棋子设定为选取
        this.currentPlayer.selectedPos = new v2(r, c);
    }

    selectNull() { this.currentPlayer.selectedPos = null; }

    checkWalkable(r1, c1, r2, c2) {
        //检查 r1c1 的棋子能否移到 r2c2

        //0. 按照棋子移动规则, 该棋子是否可以移动到此格?
        //1. 格子是否被己方棋子占用?
        //2. 移动棋子是否会导致王将被诘?

        return true;
    }
    tryMovePiece(r1, c1, r2, c2) {
        if (this.checkWalkable(r1, c1, r2, c2)) {
            this.movePiece(r1, c1, r2, c2);
            return true;
        }
        return false;
    }
    movePiece(r1, c1, r2, c2) {
        let p1 = this.grid(r1, c1);
        let p2 = this.grid(r2, c2);

        console.log("Move Piece " + p1.pieceName +
            " @ " + Game.shogiIndex(r1, c1) + " -> " + Game.shogiIndex(r2, c2));

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