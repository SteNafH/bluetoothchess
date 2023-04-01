import Position from './Position';
import MoveTypes from './MoveTypes';
import { PieceType } from './pieces/Piece';

export default class Move {
    public prevPos: Position;
    public newPos: Position;
    public type: MoveTypes = MoveTypes.Default;
    public promotionPiece?: PieceType;

    public constructor(prevPos: Position, newPos: Position, type: MoveTypes, promotionPiece?: PieceType) {
        this.prevPos = prevPos;
        this.newPos = newPos;
        this.type = type;
        this.promotionPiece = promotionPiece;
    }
}
