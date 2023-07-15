import Piece from './pieces/Piece';
import Queen from './pieces/Queen';
import Knight from './pieces/Knight';
import King from './pieces/King';
import Bishop from './pieces/Bishop';
import Rook from './pieces/Rook';
import Pawn from './pieces/Pawn';
import Move from './Move';
import MoveTypes from './MoveTypes';
import MoveParser from './MoveParser';
import Position from './Position';
import {InvalidMoveException} from './exceptions/move.exception';

export type ChessBoard = (Piece | null)[][];

interface GameMove {
  white: string;
  black: string;
}

export default class Board {
  public board: ChessBoard = [
    [
      new Rook(new Position(0, 0), true),
      new Knight(new Position(0, 1), true),
      new Bishop(new Position(0, 2), true),
      new Queen(new Position(0, 3), true),
      new King(new Position(0, 4), true),
      new Bishop(new Position(0, 5), true),
      new Knight(new Position(0, 6), true),
      new Rook(new Position(0, 7), true),
    ],
    [
      new Pawn(new Position(1, 0), true),
      new Pawn(new Position(1, 1), true),
      new Pawn(new Position(1, 2), true),
      new Pawn(new Position(1, 3), true),
      new Pawn(new Position(1, 4), true),
      new Pawn(new Position(1, 5), true),
      new Pawn(new Position(1, 6), true),
      new Pawn(new Position(1, 7), true),
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      new Pawn(new Position(6, 0), false),
      new Pawn(new Position(6, 1), false),
      new Pawn(new Position(6, 2), false),
      new Pawn(new Position(6, 3), false),
      new Pawn(new Position(6, 4), false),
      new Pawn(new Position(6, 5), false),
      new Pawn(new Position(6, 6), false),
      new Pawn(new Position(6, 7), false),
    ],
    [
      new Rook(new Position(7, 0), false),
      new Knight(new Position(7, 1), false),
      new Bishop(new Position(7, 2), false),
      new Queen(new Position(7, 3), false),
      new King(new Position(7, 4), false),
      new Bishop(new Position(7, 5), false),
      new Knight(new Position(7, 6), false),
      new Rook(new Position(7, 7), false),
    ],
  ];
  public gameMoves: GameMove[] = [];

  public constructor(gameString?: string) {
    if (gameString) {
      this.initGameMoves(gameString);
    }
  }

  private initGameMoves(gameString: string): void {
    const game: string[] = gameString.split(/ ?[0-9]+\. /);

    for (const turn of game) {
      if (!turn) {
        continue;
      }

      const move: string[] = turn.split(' ');

      this.gameMoves.push({
        white: move[0],
        black: move[1],
      });

      try {
        this.makeMove(MoveParser.getMoveFromAN(this.board, true, move[0]));
        this.makeMove(MoveParser.getMoveFromAN(this.board, false, move[1]));
      } catch (e) {}
    }
  }

  private makeMove(move: Move): void {
    const piece = this.board[move.prevPos.row][move.prevPos.col];

    if (piece === null) {
      throw new InvalidMoveException('No Piece Found To Move');
    }

    piece.position = move.newPos;

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

        const rook = this.board[move.prevPos.row][prevRookX];

        if (rook === null) {
          throw new InvalidMoveException(
            'No Rook Found While Trying To Castle',
          );
        }

        rook.position.col = rookX;

        this.board[move.newPos.row][rookX] = rook;
        this.board[move.prevPos.row][prevRookX] = null;
        break;
      }
      case MoveTypes.Promote: {
        const promotionPiece = move.promotionPiece;
        if (promotionPiece === undefined || promotionPiece === Pawn) {
          throw new InvalidMoveException('Invalid Promotion Piece');
        }

        this.board[move.newPos.row][move.newPos.col] = new promotionPiece(
          move.newPos,
          piece.white,
        );
        break;
      }
      case MoveTypes.EnPassant: {
        this.board[move.newPos.row + (piece.white ? -1 : 1)][move.newPos.col] =
          null;
        break;
      }
    }
  }

  public print(): void {
    console.log();

    for (let row: number = 7; row >= 0; row--) {
      let rowString: string = row + 1 + ' ';

      for (const col in this.board[row]) {
        const piece = this.board[row][col];
        if (piece !== null) {
          rowString += piece.getPieceLetter;
        } else {
          rowString += ' ';
        }
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
        const piece: Piece | null = this.board[row][col];

        if (piece === null) {
          currentEmptySquares++;
        } else {
          if (currentEmptySquares === 0) {
            fen += piece.getPieceLetter;
          } else {
            fen += currentEmptySquares + piece.getPieceLetter;
            currentEmptySquares = 0;
          }
        }

        if (col === this.board[row].length - 1 && currentEmptySquares !== 0) {
          fen += currentEmptySquares.toString();
        }
      }

      if (row !== 0) {
        fen += '/';
      }
    }

    return fen;
  }
}
