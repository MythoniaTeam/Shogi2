export class Piece {

    player = 1;

    walkableGrid = [[1, 0]];

    pieceName = "";

    constructor(pieceName) {
        this.pieceName = pieceName;
    }

    isWalkable(relY, relX) {
        for (let i = 0; i < this.walkableGrid.length; i++) {
            if (relX === this.walkableGrid[i][1] && relY === this.walkableGrid[i][2])
                return true;
        }
        return false;
    }
}