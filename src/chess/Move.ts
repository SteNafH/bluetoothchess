import MoveTypes from "./MoveTypes";
import Piece from "./pieces/Piece";
import Position from "./Position";

export default class Move {
    public prevPos: Position;
    public newPos: Position;
    public type: MoveTypes = MoveTypes.Default;
    public promotionPiece?: typeof Piece;

    public constructor(
        prevPos: Position,
        newPos: Position,
        type: MoveTypes,
        promotionPiece?: typeof Piece
    ) {
        this.prevPos = prevPos;
        this.newPos = newPos;
        this.type = type;
        this.promotionPiece = promotionPiece;
    }
}
