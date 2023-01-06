import Position from './Position';
import MoveTypes from './MoveTypes';
import Piece from './pieces/Piece';
import Queen from './pieces/Queen';
import Bishop from './pieces/Bishop';
import King from './pieces/King';
import Knight from './pieces/Knight';
import Pawn from './pieces/Pawn';
import Rook from './pieces/Rook';

export const Row: { [key: string]: number } = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
};

export const Col: { [key: string]: number } = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
};

export default class MoveParser {
    public static getPiece(move: string): typeof Piece | 'O' | undefined {
        //first letter is always the piece that moved, if no piece is specified than it is a Pawn
        //Ra4 -> R -> Rook || d4 -> '' -> Pawn || O-O-O -> O -> Castling
        let pieceLetter: string = move[0];

        if (!pieceLetter)
            return undefined;

        switch (move[0]) {
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
        let newPosition: string = move.replace(new RegExp(/[^a-h^1-8]+/g), '').slice(-2);
        return new Position(Row[newPosition[1]], Col[newPosition[0]]);
    }

    public static getType(move: string): MoveTypes {
        if (move.indexOf('+') !== -1)
            return MoveTypes.Check;
        else if (move.indexOf('=') !== -1)
            return MoveTypes.Promote;
        else if (move.indexOf('x') !== -1)
            return MoveTypes.Capture;
        else if (move.indexOf('O') !== -1)
            return MoveTypes.Castle;
        else if (move.indexOf('#') !== -1)
            return MoveTypes.CheckMate;

        return MoveTypes.Default;
    }

    public static getExtraMoveData(move: string): { row?: number; col?: number; } {
        //remove everything from string apart from coordinates, remove last 2 characters those are the new position coordinates
        //Ra4xb5 -> a4b5 -> a4
        let extraData = move.replace(new RegExp(/[^a-h^1-8]+/g), '').slice(0, -2);

        if (extraData.length === 2)
            return { row: Row[extraData[1]], col: Col[extraData[0]] };
        else if (extraData.length === 1)
            if (Row[extraData[0]] !== undefined)
                return { row: Row[extraData[0]] };
            else
                return { col: Col[extraData[0]] };

        return {};
    }

    public static getPromotionPiece(move: string): typeof Piece | undefined {
        //promotion piece is always at the end of move
        //e8=Q -> Q
        switch (move[move.length - 1]) {
            case 'N':
                return Knight;
            case 'B':
                return Bishop;
            case 'R':
                return Rook;
            case 'Q':
                return Queen;
            default:
                return undefined;
        }
    }
}
