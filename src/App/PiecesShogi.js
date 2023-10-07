
const goldGeneralWalkableGrid = [
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, 0]
]

class Piece {

    walkableGrid = [[1, 0]];
    upgraded = false;

    pieceName = "";
    pieceNameUpgraded = "";

    constructor(pieceName, pieceNameUpgraded = null) {
        this.pieceName = pieceName;
        this.pieceNameUpgraded = pieceNameUpgraded;
        if (pieceNameUpgraded === null) {
            this.upgrade = () => false;
        }
    }


    tryUpgrade() {
        if (this.upgraded) return;
        if (this.upgrade()) {
            this.upgraded = true;
        }
    }
    upgrade() {
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

export class Pawn extends Piece {
    constructor() {
        super("步兵", "と");
    }
}


export class King extends Piece {
    constructor() {
        super("王將");
        this.upgrade = () => false;
    }

    isWalkable(relY, relX) {
        return (Math.abs(relX) <= 1 && Math.abs(relY) <= 1);
    }
}

export class GoldGeneral extends Piece {
    constructor() {
        super("金將");
        this.walkableGrid = goldGeneralWalkableGrid;
    }
}
export class SilverGeneral extends Piece {
    walkableGrid = [
        [1, -1],
        [1, 0],
        [1, 1],
        [-1, -1],
        [-1, 1],
    ]
}

export class Knight extends Piece {
    walkableGrid = [
        [2, -1],
        [2, 1]
    ]
}
