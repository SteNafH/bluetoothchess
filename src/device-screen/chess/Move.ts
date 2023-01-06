import Position from './Position';
import MoveParser from './MoveParser';
import MoveTypes from './MoveTypes';
import { ChessBoard } from './Board';
import Piece from './pieces/Piece';
import Pawn from './pieces/Pawn';

export default class Move {
    public prevPos: Position;
    public newPos: Position;
    public type: MoveTypes = MoveTypes.Default;
    public promotionPiece?: typeof Piece;

    public constructor(prevPos: Position, newPos: Position, type: MoveTypes, promotionPiece?: typeof Piece) {
        this.prevPos = prevPos;
        this.newPos = newPos;
        this.type = type;
        this.promotionPiece = promotionPiece;
    }

    public static getMoveFromAN(board: ChessBoard, white: boolean, move: string): Move | undefined {
        if (!move)
            return undefined;

        let pieceName: typeof Piece | 'O' | undefined = MoveParser.getPiece(move);

        if (pieceName === undefined)
            return undefined;

        let type: MoveTypes = MoveParser.getType(move);

        let newPosition: Position;
        let prevPosition: Position;

        if (pieceName === 'O') {
            let row = white ? 0 : 7;

            if (move === 'O-O-O') {
                newPosition = new Position(row, 2);
            } else {
                newPosition = new Position(row, 6);
            }

            prevPosition = new Position(row, 4);
        } else {
            newPosition = MoveParser.getNewPosition(move);
            let piece = new pieceName(newPosition.row, newPosition.col, white);
            let previousPositions: Position[] = piece.getPreviousPositions(board, type === MoveTypes.Capture);

            if (previousPositions.length > 0 && type === MoveTypes.Capture && piece instanceof Pawn && piece.isMoveEnPassant(board))
                type = MoveTypes.EnPassant;

            if (previousPositions.length === 0)
                return undefined;
            else if (previousPositions.length === 1)
                prevPosition = previousPositions[0];
            else {
                let extraData: { row?: number; col?: number } = MoveParser.getExtraMoveData(move);

                if (extraData.col !== undefined && extraData.row !== undefined)
                    previousPositions = previousPositions.filter((position: Position) => position.row === extraData.row && position.col === extraData.col);
                else if (extraData.col !== undefined)
                    previousPositions = previousPositions.filter((position: Position) => position.col === extraData.col);
                else if (extraData.row !== undefined)
                    previousPositions = previousPositions.filter((position: Position) => position.row === extraData.row);

                prevPosition = previousPositions[0];
            }
        }

        if (type === MoveTypes.Promote)
            return new Move(prevPosition, newPosition, type, MoveParser.getPromotionPiece(move));

        return new Move(prevPosition, newPosition, type);
    }
}
