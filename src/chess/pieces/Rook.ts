import Piece from './Piece';
import type {ChessBoard} from '../Board';
import Position from '../Position';

export default class Rook extends Piece {
  public get getPieceLetter(): string {
    return this.white ? 'R' : 'r';
  }

  public getLegalMoves(board: ChessBoard): Position[] {
    return [];
  }

  public getPreviousPositions(board: ChessBoard): Position[] {
    return [
      ...this.isPreviousPositionLine(board, 0, 1),
      ...this.isPreviousPositionLine(board, 1, 0),
      ...this.isPreviousPositionLine(board, 0, -1),
      ...this.isPreviousPositionLine(board, -1, 0),
    ];
  }
}
