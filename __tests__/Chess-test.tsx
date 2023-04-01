import Board from '../src/chess/Board';
import Move from '../src/chess/Move';
import Position from '../src/chess/Position';
import MoveTypes from '../src/chess/MoveTypes';
import MoveParser from '../src/chess/MoveParser';
import Rook from '../src/chess/pieces/Rook';
import Pawn from '../src/chess/pieces/Pawn';
import Queen from '../src/chess/pieces/Queen';
import Knight from '../src/chess/pieces/Knight';

describe('Chess', () => {
    describe('MoveParser', () => {
        it('given a correct Algebraic notated chess move (by a Rook), MoveParser.getPiece should return the Rook class', () => {
            expect(MoveParser.getPiece('Ra4')).toBe(Rook);
        });

        it('given a correct Algebraic notated chess move (castling), MoveParser.getPiece should return a O', () => {
            expect(MoveParser.getPiece('O-O')).toBe('O');
        });

        it('given a correct Algebraic notated chess move (by a Pawn), MoveParser.getPiece should return the Pawn class', () => {
            expect(MoveParser.getPiece('a4')).toBe(Pawn);
        });

        it('given a correct Algebraic notated chess move (by a Rook), MoveParser.getNewPosition should return a correct board position', () => {
            expect(MoveParser.getNewPosition('Ra4')).toStrictEqual(new Position(3, 0));
        });

        it('given a correct Algebraic notated chess move (by a Pawn), MoveParser.getNewPosition should return a correct board position', () => {
            expect(MoveParser.getNewPosition('Rbd4')).toStrictEqual(new Position(3, 3));
        });

        it('given a correct Algebraic notated chess move (normal move), MoveParser.getType should return a move type', () => {
            expect(MoveParser.getType('Ra4')).toBe(MoveTypes.Default);
        });

        it('given a correct Algebraic notated chess move (check), MoveParser.getType should return a move type', () => {
            expect(MoveParser.getType('Ra4+')).toBe(MoveTypes.Check);
        });

        it('given a correct Algebraic notated chess move (checkmate), MoveParser.getType should return a move type', () => {
            expect(MoveParser.getType('Ra4#')).toBe(MoveTypes.CheckMate);
        });

        it('given a correct Algebraic notated chess move (castling), MoveParser.getType should return a move type', () => {
            expect(MoveParser.getType('O-O-O')).toBe(MoveTypes.Castle);
        });

        it('given a correct Algebraic notated chess move (promotion), MoveParser.getType should return a move type', () => {
            expect(MoveParser.getType('d8=Q')).toBe(MoveTypes.Promote);
        });

        it('given a correct Algebraic notated chess move (normal move), MoveParser.getExtraMoveData should return an empty object', () => {
            expect(MoveParser.getExtraMoveData('d8')).toStrictEqual({});
        });

        it('given a correct Algebraic notated chess move (move with extra column data), MoveParser.getExtraMoveData should return an object with correct column info', () => {
            expect(MoveParser.getExtraMoveData('Rad8')).toStrictEqual({ col: 0 });
        });

        it('given a correct Algebraic notated chess move (move with extra row data), MoveParser.getExtraMoveData should return an object with correct row info', () => {
            expect(MoveParser.getExtraMoveData('R4d8')).toStrictEqual({ row: 3 });
        });

        it('given a correct Algebraic notated chess move (no promotion), MoveParser.getPromotionPiece should return undefined', () => {
            expect(MoveParser.getPromotionPiece('d8')).toBe(undefined);
        });

        it('given a correct Algebraic notated chess move (promotion to a Queen), MoveParser.getPromotionPiece should return the Queen class', () => {
            expect(MoveParser.getPromotionPiece('d8=Q')).toBe(Queen);
        });

        it('given a correct Algebraic notated chess move (promotion to a Knight), MoveParser.getPromotionPiece should return the Knight class', () => {
            expect(MoveParser.getPromotionPiece('d8=N')).toBe(Knight);
        });
    });

    describe('Move', () => {
        it('given a correct Algebraic notated chess move, Move.getMoveFromAN returns a correct Move object', () => {
            let board = new Board();
            expect(MoveParser.getMoveFromAN(board.board, true, 'd4')).toStrictEqual(new Move(new Position(1, 3), new Position(3, 3), MoveTypes.Default, undefined));
        });
    });

    describe('Board', () => {
        it('given no Algebraic notated chess game (empty board), board returns a correct fen', () => {
            let board = new Board();
            expect(board.toFen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        });

        it('given an Algebraic notated chess game, board returns a correct fen', () => {
            let board = new Board('1. d4 d5 2. c4 dxc4 3. e4 Nc6 4. Be3 Nf6 5. Nc3 e5 6. d5 Ne7 7. Bxc4 Ng6 8. f3 Bd6 9. Qd2 Bd7 10. Nge2 a6 11. Bb3 b5 12. a4 O-O 13. O-O Qe7 14. Rac1 Nh5 15. g3 h6 16. Bc2 Rab8 17. axb5 axb5 18. Ra1 Ra8 19. Bd3 Bb4 20. Rxa8 Rxa8 21. Qc2 Bc5 22. Nd1 Bd6 23. Nf2 Nhf4 24. Rc1 Qg5 25. Kh1 Qh5 26. Ng1 Nxd3 27. Nxd3 f5 28. Nc5 Bc8 29. Rf1 Ne7 30. Qd3 fxe4 31. fxe4 Qg6 32. Kg2 Kh7 33. Nf3 Ng8 34. Nh4 Qg4 35. Nf5 Nf6 36. h3 Qg6 37. Ne6 Ra4 38. b3 Rxe4 39. Nxd6 Bxe6 40. dxe6 cxd6 41. e7 d5 42. Bc5 Qe8 43. Qf3 Qc6 44. b4 Qe8 45. Qf5+ Kh8 46. Qxf6 gxf6 47. Rxf6 Qh5 48. Rf8+ Kg7 49. e8=Q Re2+ 50. Kf1 Qxh3+ 51. Kxe2 Qg2+ 52. Rf2 Qe4+ 53. Kd2');
            expect(board.toFen()).toBe('4Q3/6k1/7p/1pBpp3/1P2q3/6P1/3K1R2/8');
        });
    });
});
