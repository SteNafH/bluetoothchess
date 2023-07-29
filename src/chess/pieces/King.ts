import Piece from "./Piece";
import type { ChessBoard } from "../Board";
import Position from "../Position";

export default class King extends Piece {
    private kingMoves: Position[] = [
        new Position(-1, 1),
        new Position(0, 1),
        new Position(1, 1),
        new Position(-1, 0),
        new Position(1, 0),
        new Position(-1, -1),
        new Position(0, -1),
        new Position(1, -1)
    ];

    public get getPieceLetter(): string {
        return this.white ? "K" : "k";
    }

    public getLegalMoves(board: ChessBoard): Position[] {
        return [];
    }

    public getPreviousPositions(board: ChessBoard): Position[] {
        const possiblePositions: Position[] = [];

        for (const move of this.kingMoves) {
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
