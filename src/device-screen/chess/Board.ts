import Piece from './pieces/Piece';
import Queen from './pieces/Queen';
import Knight from './pieces/Knight';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Rook from './pieces/Rook';
import Pawn from './pieces/Pawn';
import Move from './Move';
import MoveTypes from './MoveTypes';

export type ChessBoard = (Piece | null)[][];

interface GameMove {
    white: string;
    black: string;
}

export default class Board {
    public board: ChessBoard = [
        [
            new Rook(0, 0, true),
            new Knight(0, 1, true),
            new Bishop(0, 2, true),
            new Queen(0, 3, true),
            new King(0, 4, true),
            new Bishop(0, 5, true),
            new Knight(0, 6, true),
            new Rook(0, 7, true),
        ],
        [
            new Pawn(1, 0, true),
            new Pawn(1, 1, true),
            new Pawn(1, 2, true),
            new Pawn(1, 3, true),
            new Pawn(1, 4, true),
            new Pawn(1, 5, true),
            new Pawn(1, 6, true),
            new Pawn(1, 7, true),
        ],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [
            new Pawn(6, 0, false),
            new Pawn(6, 1, false),
            new Pawn(6, 2, false),
            new Pawn(6, 3, false),
            new Pawn(6, 4, false),
            new Pawn(6, 5, false),
            new Pawn(6, 6, false),
            new Pawn(6, 7, false),
        ],
        [
            new Rook(7, 0, false),
            new Knight(7, 1, false),
            new Bishop(7, 2, false),
            new Queen(7, 3, false),
            new King(7, 4, false),
            new Bishop(7, 5, false),
            new Knight(7, 6, false),
            new Rook(7, 7, false),
        ],
    ]
    public gameMoves: GameMove[] = [];

    public constructor(gameString?: string) {
        if (gameString) {
            this.initGameMoves(gameString);
        }
    }

    private initGameMoves(gameString: string): void {
        let game: string[] = gameString.split(/ ?[0-9]+\. /);
        for (let i in game) {
            if (!game[i])
                continue;

            let move: string[] = game[i].split(' ');

            this.gameMoves.push({
                white: move[0],
                black: move[1],
            });

            this.makeMove(Move.getMoveFromAN(this.board, true, move[0]));
            this.makeMove(Move.getMoveFromAN(this.board, false, move[1]));
        }
    }

    private makeMove(move?: Move): void {
        if (!move)
            return;

        let piece = this.board[move.prevPos.row][move.prevPos.col];

        if (piece === null)
            return;

        piece.row = move.newPos.row;
        piece.col = move.newPos.col;

        this.board[move.newPos.row][move.newPos.col] = piece;
        this.board[move.prevPos.row][move.prevPos.col] = null;

        switch (move.type) {
            case MoveTypes.Castle: {
                let prevRookX: number;
                let rookX: number;

                if (move.newPos.col === 6) {
                    prevRookX = 7;
                    rookX = 5;
                } else {
                    prevRookX = 0;
                    rookX = 3;
                }

                let rook = this.board[move.prevPos.row][prevRookX];

                if (rook === null)
                    return;

                rook.col = rookX;

                this.board[move.newPos.row][rookX] = rook;
                this.board[move.prevPos.row][prevRookX] = null;
                break;
            }
            case MoveTypes.Promote: {
                let promotionPiece = move.promotionPiece;
                if (promotionPiece === undefined)
                    break;

                this.board[move.newPos.row][move.newPos.col] = new promotionPiece(move.newPos.row, move.newPos.col, piece.white);
                break;
            }
            case MoveTypes.EnPassant: {
                this.board[move.newPos.row + (piece.white ? -1 : 1)][move.newPos.col] = null;
                break;
            }
        }
    }

    public print(): void {
        console.log();

        for (let row: number = 7; row >= 0; row--) {
            let rowString: string = (row + 1) + ' ';

            for (let col in this.board[row]) {
                let piece = this.board[row][col];
                if (piece !== null)
                    rowString += piece.getPieceLetter;
                else
                    rowString += ' ';
            }

            console.log(rowString);
        }

        console.log('  abcdefgh');
        console.log();
    }

    public toFen(): string {
        let fen: string = '';

        for (let row: number = 7; row >= 0; row--) {
            let currentEmptySquares = 0;
            for (let col: number = 0; col < this.board[row].length; col++) {
                let piece: Piece | null = this.board[row][col];

                if (piece === null)
                    currentEmptySquares++;
                else {
                    if (currentEmptySquares === 0)
                        fen += piece.getPieceLetter;
                    else {
                        fen += currentEmptySquares + piece.getPieceLetter;
                        currentEmptySquares = 0;
                    }
                }

                if (col === this.board[row].length - 1 && currentEmptySquares !== 0)
                    fen += currentEmptySquares.toString();
            }

            if (row !== 0)
                fen += '/';
        }

        return fen;
    }
}

// console.log();
//
// interface Col {
//     [key: string]: string;
// }
//
// interface Row {
//     [key: number]: Col;
// }
//
// let board: Row =
//     {
//         8: { a: 'r', b: 'b', c: 'n', d: 'q', e: 'k', f: 'n', g: 'b', h: 'r'},
//         7: { a: 'p', b: 'p', c: 'p', d: 'p', e: 'p', f: 'p', g: 'p', h: 'p'},
//         6: { a: ' ', b: ' ', c: ' ', d: ' ', e: ' ', f: ' ', g: ' ', h: ' '},
//         5: { a: ' ', b: ' ', c: ' ', d: ' ', e: ' ', f: ' ', g: ' ', h: ' '},
//         4: { a: ' ', b: ' ', c: ' ', d: ' ', e: ' ', f: ' ', g: ' ', h: ' '},
//         3: { a: ' ', b: ' ', c: ' ', d: ' ', e: ' ', f: ' ', g: ' ', h: ' '},
//         2: { a: 'P', b: 'P', c: 'P', d: 'P', e: 'P', f: 'P', g: 'P', h: 'P'},
//         1: { a: 'R', b: 'B', c: 'N', d: 'Q', e: 'K', f: 'N', g: 'B', h: 'R'},
//     }
//
// function printBoard(): void {
//     console.log()
//
//     for (let row in board) {
//         let rowString: string = "";
//
//         for (let col in board[row])
//             if (board[row][col] == undefined)
//                 rowString += ' '
//             else
//                 rowString += board[row][col];
//
//         console.log(rowString);
//     }
//
//     console.log();
// }
//
// interface GameMove {
//     white: string;
//     black: string;
// }
//
// interface GameMoves {
//     [key: string]: GameMove
// }
//
// let gamestring = '1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2#';
//
// let array: string[] = gamestring.split(/ ?[0-9]+\. /);
// let gameMoves: GameMoves = {};
//
// for (let i in array) {
//     if (!array[i])
//         continue;
//
//     let move: string[] = array[i].split(' ');
//
//     gameMoves[i] = {
//         white: move[0],
//         black: move[1],
//     }
// }
//
// for (let i in gameMoves) {
//     if (gameMoves[i].white)
//         makeMove(true, gameMoves[i].white);
//
//     if (gameMoves[i].black)
//         makeMove(false, gameMoves[i].black);
// }
//
// function makeMove(white: boolean, move: string): void {
//     let piece = getPiece(move[0]);
//
//     if (piece == 'O')
//         return;
//
//     let newPosition = move.match(/([a-h]{1}[1-8]{1})(?![a-h]+[1-8])/)![0];
//
//     console.log(piece, newPosition)
// }
//
// function getPiece(pieceLetter: string): string {
//     switch(pieceLetter) {
//         case 'N': return 'N';
//         case 'B': return 'B';
//         case 'R': return 'R';
//         case 'Q': return 'Q';
//         case 'K': return 'K';
//         case 'O': return 'O';
//         default: return 'P';
//     }
// }
//
// printBoard();
