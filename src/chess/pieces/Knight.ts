import Piece from './Piece';
import { ChessBoard } from '../Board';
import Position from '../Position';

export default class Knight extends Piece {
    private knightMoves: Position[] = [
        { col: 2, row: -1 }, { col: 2, row: 1 }, { col: 1, row: -2 }, { col: 1, row: 2 },
        { col: -2, row: -1 }, { col: -2, row: 1 }, { col: -1, row: -2 }, { col: -1, row: 2 },
    ];

    public get getPieceLetter(): string {
        return this.white ? 'N' : 'n';
    }

    public getPreviousPositions(board: ChessBoard): Position[] {
        let possiblePositions: Position[] = [];

        for (let move of this.knightMoves) {
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
