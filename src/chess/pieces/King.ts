import Piece from './Piece';
import { ChessBoard } from '../Board';
import Position from '../Position';

export default class King extends Piece {
    private kingMoves: Position[] = [
        { col: -1, row: 1 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: -1, row: 0 },
        { col: 1, row: 0 }, { col: -1, row: -1 }, { col: 0, row: -1 }, { col: 1, row: -1 },
    ];

    public get getPieceLetter(): string {
        return this.white ? 'K' : 'k';
    }

    public getLegalMoves(board: ChessBoard): Position[] {
        return [];
    }

    public getPreviousPositions(board: ChessBoard): Position[] {
        let possiblePositions: Position[] = [];

        for (let move of this.kingMoves) {
            let row: number = this.row + move.row;
            let col: number = this.col + move.col;

            if (this.isOutOfBounds(row, col))
                continue;

            let checkedSquare = this.isPreviousPosition(board[row][col]);

            if (checkedSquare)
                possiblePositions.push(new Position(row, col));
        }

        return possiblePositions;
    }
}
