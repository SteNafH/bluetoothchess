import Piece from './Piece';
import { ChessBoard } from '../Board';
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
        let rowDelta = this.white ? -1 : 1;
        let possiblePositions: Position[] = [];

        if (capture) {
            let row: number = this.row + rowDelta;
            let col: number = this.col - 1;

            if (!this.isOutOfBounds(row, col))
                if (this.isPreviousPosition(board[row][col]))
                    possiblePositions.push(new Position(row, col));

            col = this.col + 1;

            if (!this.isOutOfBounds(row, col))
                if (this.isPreviousPosition(board[row][col]))
                    possiblePositions.push(new Position(row, col));

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
