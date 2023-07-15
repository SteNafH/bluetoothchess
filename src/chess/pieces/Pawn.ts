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
        return board[this.position.row][this.position.col] === null;
    }

    public getPreviousPositions(board: ChessBoard, capture: boolean): Position[] {
        const rowDelta = this.white ? -1 : 1;
        const possiblePositions: Position[] = [];

        if (capture) {
            let position = new Position(this.position.row + rowDelta, this.position.col - 1);

            if (!position.isOutOfBounds())
                if (this.isPreviousPosition(board[position.row][position.col]))
                    possiblePositions.push(position);

            position = new Position(this.position.row + rowDelta, this.position.col + 1);

            if (!position.isOutOfBounds())
                if (this.isPreviousPosition(board[position.row][position.col]))
                    possiblePositions.push(position);

        } else {
            if (this.isPreviousPosition(board[this.position.row + rowDelta][this.position.col]))
                possiblePositions.push(new Position(this.position.row + rowDelta, this.position.col));

            if (((this.white && this.position.row === 3) || (!this.white && this.position.row === 4)) && board[this.position.row + rowDelta][this.position.col] === null) {
                if (this.isPreviousPosition(board[this.position.row + rowDelta + rowDelta][this.position.col]))
                    possiblePositions.push(new Position(this.position.row + rowDelta + rowDelta, this.position.col));
            }
        }

        return possiblePositions;
    }
}
