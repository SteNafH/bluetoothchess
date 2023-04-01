import { ChessBoard } from '../Board';
import Position from '../Position';
import Pawn from './Pawn';
import Knight from './Knight';
import Bishop from './Bishop';
import Rook from './Rook';
import Queen from './Queen';
import King from './King';

export type PieceType = typeof Pawn | typeof Knight | typeof Bishop | typeof Rook | typeof Queen | typeof King;

export default abstract class Piece {
    public white: boolean;

    public row: number;
    public col: number;

    public constructor(row: number, col: number, white: boolean) {
        this.row = row;
        this.col = col;
        this.white = white;
    }

    protected isOutOfBounds(row: number, col: number): boolean {
        return row < 0 || col < 0 || row > 7 || col > 7;
    }

    protected isPreviousPosition(piece: Piece | null): Boolean {
        if (piece === null)
            return false;

        return piece.getPieceLetter === this.getPieceLetter;
    }

    protected isPreviousPositionLine(board: ChessBoard, rowDelta: number, colDelta: number): Position[] {
        let possiblePositions: Position[] = [];

        for (let i: number = 1; i < 8; i++) {
            let row = this.row + (rowDelta * i);
            let col = this.col + (colDelta * i);

            if (this.isOutOfBounds(row, col))
                break;

            let piece = board[row][col];

            if (piece === null)
                continue;

            if (piece.getPieceLetter !== this.getPieceLetter)
                break;

            possiblePositions.push(new Position(piece.row, piece.col));
            break;
        }

        return possiblePositions;
    }

    public abstract get getPieceLetter(): string;

    public abstract getLegalMoves(board: ChessBoard): Position[];

    public abstract getPreviousPositions(board: ChessBoard, capture?: Boolean): Position[];
}
