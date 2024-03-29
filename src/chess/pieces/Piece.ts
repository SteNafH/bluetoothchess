import type { ChessBoard } from "../Board";
import Position from "../Position";
import { NotImplementedException } from "../exceptions/piece.exception";

export default class Piece {
    public white: boolean;

    public position: Position;

    public constructor(position: Position, white: boolean) {
        this.position = position;
        this.white = white;
    }

    protected isPreviousPosition(piece: Piece | null): Boolean {
        if (piece === null) {
            return false;
        }

        return piece.getPieceLetter === this.getPieceLetter;
    }

    protected isPreviousPositionLine(
        board: ChessBoard,
        rowDelta: number,
        colDelta: number
    ): Position[] {
        const possiblePositions: Position[] = [];

        for (let i: number = 1; i < 8; i++) {
            const position = new Position(
                this.position.row + rowDelta * i,
                this.position.col + colDelta * i
            );

            if (position.isOutOfBounds()) {
                break;
            }

            const piece = board[position.row][position.col];

            if (piece === null) {
                continue;
            }

            if (piece.getPieceLetter !== this.getPieceLetter) {
                break;
            }

            possiblePositions.push(position);
            break;
        }

        return possiblePositions;
    }

    public get getPieceLetter(): string {
        throw new NotImplementedException("getPieceLetter Not Implemented");
    }

    public getLegalMoves(board: ChessBoard): Position[] {
        throw new NotImplementedException("getLegalMoves Not Implemented");
    }

    public getPreviousPositions(
        board: ChessBoard,
        capture?: Boolean
    ): Position[] {
        throw new NotImplementedException("getPreviousPositions Not Implemented");
    }
}
