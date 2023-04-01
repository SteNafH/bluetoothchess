import Piece from './Piece';
import { ChessBoard } from '../Board';
import Position from '../Position';

export default class Queen extends Piece {
    public get getPieceLetter(): string {
        return this.white ? 'Q' : 'q';
    }

    public getLegalMoves(board: ChessBoard): Position[] {
        return [];
    }

    public getPreviousPositions(board: ChessBoard): Position[] {
        return [
            ...this.isPreviousPositionLine(board, 1, 1),
            ...this.isPreviousPositionLine(board, 1, -1),
            ...this.isPreviousPositionLine(board, -1, -1),
            ...this.isPreviousPositionLine(board, -1, 1),
            ...this.isPreviousPositionLine(board, 0, 1),
            ...this.isPreviousPositionLine(board, 1, 0),
            ...this.isPreviousPositionLine(board, 0, -1),
            ...this.isPreviousPositionLine(board, -1, 0),
        ];
    }
}
