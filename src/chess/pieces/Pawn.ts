import Piece from './Piece';
import type {ChessBoard} from '../Board';
import Position from '../Position';

export default class Pawn extends Piece {
    public get getPieceLetter(): string {
        return this.white ? 'P' : 'p';
    }

    public getLegalMoves(board: ChessBoard): Position[] {
        return [];
    }

    public isMoveEnPassant(board: ChessBoard) {
        return board[this.row][this.col] === null;
    }

    public getPreviousPositions(board: ChessBoard, capture: boolean): Position[] {
        const rowDelta = this.white ? -1 : 1;
        const possiblePositions: Position[] = [];

        if (capture) {
            let position = new Position(this.row + rowDelta, this.col - 1);

            if (!position.isOutOfBounds())
                if (this.isPreviousPosition(board[position.row][position.col]))
                    possiblePositions.push(position);

            position = new Position(this.row + rowDelta, this.col + 1);

            if (!position.isOutOfBounds())
                if (this.isPreviousPosition(board[position.row][position.col]))
                    possiblePositions.push(position);

        } else {
            if (this.isPreviousPosition(board[this.row + rowDelta][this.col]))
                possiblePositions.push(new Position(this.row + rowDelta, this.col));

            if (((this.white && this.row === 3) || (!this.white && this.row === 4)) && board[this.row + rowDelta][this.col] === null) {
                if (this.isPreviousPosition(board[this.row + rowDelta + rowDelta][this.col]))
                    possiblePositions.push(new Position(this.row + rowDelta + rowDelta, this.col));
            }
        }

        return possiblePositions;
    }
}
