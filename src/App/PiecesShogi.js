
import {Piece} from "./Piece";

const goldGeneralWalkableGrid = [
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, 0]
]

class PieceShogi extends Piece{

    promoted = false;
    pieceNamePromoted = "";

    constructor(pieceName, pieceNamePromoted = null) {
        super(pieceName);
        this.pieceNamePromoted = pieceNamePromoted;
        if (pieceNamePromoted === null) {
            this.promote = () => false;
        }
    }

    tryPromote() {
        if (this.promoted) return;
        if (this.promote()) {
            this.promoted = true;
        }
    }
    promote() {
        this.walkableGrid = goldGeneralWalkableGrid;
        return true;
    }

    isWalkable(relY, relX) {
        for (let i = 0; i < this.walkableGrid.length; i++) {
            if (relX === this.walkableGrid[i][1] && relY === this.walkableGrid[i][2])
                return true;
        }
        return false;
    }
}




export class King extends PieceShogi {
    constructor() {
        super("王將");
    }

    isWalkable(relY, relX) {
        return (Math.abs(relX) <= 1 && Math.abs(relY) <= 1);
    }
}

export class Pawn extends PieceShogi {
    constructor() {
        super("步兵", "と");
    }
}

export class Lance extends PieceShogi {
    constructor() {
        super("香車", "杏");
    }

    isWalkable(relY, relX) {
        return true;
    }
}

export class Knight extends PieceShogi {
    constructor() {
        super("桂馬", "圭");
    }
    walkableGrid = [
        [2, -1],
        [2, 1]
    ]
}

export class SilverGeneral extends PieceShogi {
    constructor() {
        super("銀將", "全");
    }
    walkableGrid = [
        [1, -1],
        [1, 0],
        [1, 1],
        [-1, -1],
        [-1, 1],
    ]
}

export class GoldGeneral extends PieceShogi {
    constructor() {
        super("金將");
        this.walkableGrid = goldGeneralWalkableGrid;
    }
}

export class Bishop extends PieceShogi {
    constructor() {
        super("角行", "龍馬");
    }
}

export class Rook extends PieceShogi {
    constructor() {
        super("飛車", "龍王");
    }
}


