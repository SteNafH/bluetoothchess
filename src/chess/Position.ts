export default class Position {
    public row: number;
    public col: number;

    public constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    public isOutOfBounds() {
        return this.row < 0 || this.col < 0 || this.row > 7 || this.col > 7;
    }
}
