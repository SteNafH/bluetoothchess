import Piece from './Piece';
import type {ChessBoard} from '../Board';
import Position from '../Position';

export default class Bishop extends Piece {
  public get getPieceLetter(): string {
    return this.white ? 'B' : 'b';
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
    ];
  }
}
