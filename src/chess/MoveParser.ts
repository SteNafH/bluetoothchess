import MoveTypes from './MoveTypes';
import Piece from './pieces/Piece';
import Queen from './pieces/Queen';
import Bishop from './pieces/Bishop';
import King from './pieces/King';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import Rook from './pieces/Rook';
import Move from './Move';
import Position from "./Position";
import type {ChessBoard} from './Board';
import {InvalidMoveException} from "./exceptions/move.exception";

interface ExtraMoveData {
    row?: number;
    col?: number;
}

const Row: Map<string | undefined, number> = new Map([
    ['1', 0],
    ['2', 1],
    ['3', 2],
    ['4', 3],
    ['5', 4],
    ['6', 5],
    ['7', 6],
    ['8', 7],
]);

const Col: Map<string | undefined, number> = new Map([
    ['a', 0],
    ['b', 1],
    ['c', 2],
    ['d', 3],
    ['e', 4],
    ['f', 5],
    ['g', 6],
    ['h', 7],
]);

export default class MoveParser {
    public static getMoveFromAN(board: ChessBoard, white: boolean, move: string): Move {
        if (!move)
            throw new InvalidMoveException('Empty Move String');

        const pieceName: typeof Piece | 'O' = MoveParser.getPiece(move);

        let type: MoveTypes = MoveParser.getType(move);

        let newPosition: Position;
        let prevPosition: Position;

        if (pieceName === 'O') {
            const row = white ? 0 : 7;

            if (move === 'O-O-O') {
                newPosition = new Position(row, 2);
            } else {
                newPosition = new Position(row, 6);
            }

            prevPosition = new Position(row, 4);
        } else {
            newPosition = MoveParser.getNewPosition(move);
            const piece = new pieceName(newPosition, white);
            let previousPositions: Position[] = piece.getPreviousPositions(board, type === MoveTypes.Capture);

            if (previousPositions.length > 0 && type === MoveTypes.Capture && piece instanceof Pawn && piece.isMoveEnPassant(board))
                type = MoveTypes.EnPassant;

            if (previousPositions.length === 0)
                throw new InvalidMoveException('No Previous Positions Found');
            else if (previousPositions.length === 1)
                prevPosition = previousPositions[0];
            else {
                const extraData: ExtraMoveData = MoveParser.getExtraMoveData(move);

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

    public static getPiece(move: string): typeof Piece | 'O' {
        //first letter is always the piece that moved, if no piece is specified than it is a Pawn
        //Ra4 -> R -> Rook || d4 -> '' -> Pawn || O-O-O -> O -> Castling
        const pieceLetter: string | undefined = move.at(0);

        if (pieceLetter === undefined)
            throw new InvalidMoveException('No Piece Found');

        switch (pieceLetter) {
            case 'N':
                return Knight;
            case 'B':
                return Bishop;
            case 'R':
                return Rook;
            case 'Q':
                return Queen;
            case 'K':
                return King;
            case 'O':
                return 'O';
            default:
                return Pawn;
        }
    }

    public static getNewPosition(move: string): Position {
        //remove everything from string apart from coordinates, get last 2 characters those are the new position coordinates
        //Ra4xb5 -> a4b5 -> b5
        const newPosition: string = move.replace(new RegExp(/[^a-h^1-8]+/g), '').slice(-2);
        const row = Row.get(newPosition.at(1));
        const col = Col.get(newPosition.at(0));

        if (row === undefined || col === undefined)
            throw new InvalidMoveException('Row Or Column Missing');

        return new Position(row, col);
    }

    public static getType(move: string): MoveTypes {
        if (move.indexOf('#') !== -1)
            return MoveTypes.CheckMate;

        if (move.indexOf('+') !== -1)
            return MoveTypes.Check;

        if (move.indexOf('=') !== -1)
            return MoveTypes.Promote;

        if (move.indexOf('x') !== -1)
            return MoveTypes.Capture;

        if (move.indexOf('O') !== -1)
            return MoveTypes.Castle;

        return MoveTypes.Default;
    }

    public static getExtraMoveData(move: string): ExtraMoveData {
        //remove everything from string apart from coordinates, remove last 2 characters those are the new position coordinates
        //Ra4xb5 -> a4b5 -> a4
        const extraData = move.replace(new RegExp(/[^a-h^1-8]+/g), '').slice(0, -2);

        if (extraData.length === 2)
            return {row: Row.get(extraData.at(1)), col: Col.get(extraData.at(0))};

        if (Row.has(extraData.at(0)))
            return {row: Row.get(extraData.at(0))};

        if (Col.has(extraData.at(0)))
            return {col: Col.get(extraData.at(0))};

        return {};
    }

    public static getPromotionPiece(move: string): typeof Piece {
        //promotion piece is always at the end of move
        //e8=Q -> Q
        switch (move.at(-1)) {
            case 'N':
                return Knight;
            case 'B':
                return Bishop;
            case 'R':
                return Rook;
            case 'Q':
                return Queen;
            default:
                throw new InvalidMoveException('No Promotion Piece Found');
        }
    }
}
