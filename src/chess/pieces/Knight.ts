import Piece from "./Piece";
import type { ChessBoard } from "../Board";
import Position from "../Position";

export default class Knight extends Piece {
    private knightMoves: Position[] = [
        new Position(2, -1),
        new Position(2, 1),
        new Position(1, -2),
        new Position(1, 2),
        new Position(-2, -1),
        new Position(-2, 1),
        new Position(-1, -2),
        new Position(-1, 2)
    ];

    public get getPieceLetter(): string {
        return this.white ? "N" : "n";
    }

    public getPreviousPositions(board: ChessBoard): Position[] {
        const possiblePositions: Position[] = [];

        for (const move of this.knightMoves) {
            const position = new Position(
                this.position.row + move.row,
                this.position.col + move.col
            );

            if (position.isOutOfBounds()) {
                continue;
            }

            const checkedSquare = this.isPreviousPosition(
                board[position.row][position.col]
            );

            if (checkedSquare) {
                possiblePositions.push(position);
            }
        }

        return possiblePositions;
    }
}
