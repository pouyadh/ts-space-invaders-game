export class Rect {
  i: number;
  j: number;
  width: number;
  height: number;
  topLeft: Position;
  buttomRight: Position;
  constructor(positions: Position[]) {
    if (positions.length === 0) throw new Error("position array is empty");
    const Is = positions.map((p) => p.i);
    const Js = positions.map((p) => p.j);
    this.topLeft = new Position(Math.min(...Is), Math.min(...Js));
    this.buttomRight = new Position(Math.max(...Is), Math.max(...Js));
    this.i = this.topLeft.i;
    this.j = this.topLeft.j;
    this.width = this.buttomRight.i - this.topLeft.i + 1;
    this.height = this.buttomRight.j - this.topLeft.j + 1;
  }
  containes(position: Position) {
    return (
      position.i >= this.topLeft.i &&
      position.i <= this.buttomRight.i &&
      position.j >= this.topLeft.j &&
      position.j <= this.buttomRight.j
    );
  }
  get center() {
    return new Position(this.i + this.width / 2, this.j + this.height / 2);
  }
}
export class Vector {
  static UP = new Vector(0, -1);
  static DOWN = new Vector(0, 1);
  static LEFT = new Vector(-1, 0);
  static RIGHT = new Vector(1, 0);
  static STILL = new Vector(0, 0);
  static fromPositionA2B(a: Position, b: Position) {
    return new Vector(b.i - a.i, b.j - a.j);
  }
  i: number;
  j: number;
  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }
  reverse() {
    return new Vector(-this.i, -this.j);
  }
  multiply(by: number) {
    return new Vector(this.i * by, this.j * by);
  }
  isEqualTo(vetor: Vector) {
    return this.i === vetor.i && this.j === vetor.j;
  }
  toString() {
    return `${this.i},${this.j}`;
  }
  get vi() {
    if (this.isEqualTo(Vector.RIGHT)) return 0;
    if (this.isEqualTo(Vector.LEFT)) return 1;
    if (this.isEqualTo(Vector.UP)) return 2;
    if (this.isEqualTo(Vector.DOWN)) return 3;
    return -1;
  }
  public get angle() {
    if (this.i === 0 && this.j === 0) return 0;
    if (this.i > 0 && this.j === 0) return Math.PI * 0;
    if (this.i === 0 && this.j < 0) return Math.PI * 0.5;
    if (this.i < 0 && this.j === 0) return Math.PI * 1;
    if (this.i === 0 && this.j > 0) return Math.PI * 1.5;
    if (this.i > 0 && this.j < 0)
      return Math.PI * 0 + Math.atan(Math.abs(this.j / this.i));
    if (this.i < 0 && this.j < 0)
      return Math.PI * 0.5 + Math.atan(Math.abs(this.i / this.j));
    if (this.i < 0 && this.j > 0)
      return Math.PI * 1 + Math.atan(Math.abs(this.j / this.i));
    if (this.i > 0 && this.j > 0)
      return Math.PI * 1.5 + Math.atan(Math.abs(this.i / this.j));

    return 0;
  }
  limitByRadius(radius: number) {
    const s = Math.max(Math.abs(this.i), Math.abs(this.j));
    if (s > radius) {
      return new Vector((this.i / s) * radius, (this.j / s) * radius);
    } else {
      return new Vector(this.i, this.j);
    }
  }
}
export class Position {
  static random(maxI: number, maxJ: number) {
    return new Position(
      Math.round(maxI * Math.random()),
      Math.round(maxJ * Math.random())
    );
  }
  i: number;
  j: number;
  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }
  translate(vector: Vector) {
    return new Position(this.i + vector.i, this.j + vector.j);
  }
  calcDistance(to: Position) {
    return Math.sqrt((this.i - to.i) ** 2 + (this.j - to.j) ** 2);
  }
  isEqualTo(vetor: Position) {
    return this.i === vetor.i && this.j === vetor.j;
  }
  toString() {
    return `${this.i},${this.j}`;
  }
  clone() {
    return new Position(this.i, this.j);
  }
  top() {
    return new Position(this.i, this.j - 1);
  }
  bottom() {
    return new Position(this.i, this.j + 1);
  }
  left() {
    return new Position(this.i - 1, this.j);
  }
  right() {
    return new Position(this.i + 1, this.j);
  }
  subtract(by: number): Position;
  subtract(by: Position): Position;
  subtract(by: number | Position) {
    if (typeof by === "number") {
      return new Position(this.i - by, this.j - by);
    } else if (by instanceof Position) {
      return new Position(this.i - by.i, this.j - by.j);
    }
  }
  add(by: number): Position;
  add(by: Position): Position;
  add(by: number | Position) {
    if (typeof by === "number") {
      return new Position(this.i + by, this.j + by);
    } else if (by instanceof Position) {
      return new Position(this.i + by.i, this.j + by.j);
    }
  }
  to(pos: Position) {
    return new Vector(pos.i - this.i, pos.j - this.j);
  }

  multiply(by: number): Position;
  multiply(by: Position): Position;
  multiply(by: number | Position) {
    if (typeof by === "number") {
      return new Position(this.i * by, this.j * by);
    } else if (by instanceof Position) {
      return new Position(this.i * by.i, this.j * by.j);
    }
  }
}

export class Motile {
  position: Position = new Position(0, 0);
  direction: Vector = Vector.STILL;
  speed: number = 1;
  size: number = 1;
  color: string = "White";
}

export function delay(duration: number) {
  return new Promise((res, rej) => setTimeout(res, duration));
}

export type RectSize = { width: number; height: number };

export class Rectangle {
  protected _topLeft: Position;
  private _width: number;
  private _height: number;
  constructor(width: number, height: number, topLeft?: Position) {
    this._width = width;
    this._height = height;
    this._topLeft = topLeft || new Position(0, 0);
  }
  set centerI(i: number) {
    this._topLeft.i = i - this.halfWidth;
  }
  set centerJ(j: number) {
    this._topLeft.j = j - this.halfHeight;
  }
  set width(w: number) {
    this._width = w;
  }
  set height(h: number) {
    this._height = h;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get halfWidth() {
    return this._width / 2;
  }
  get halfHeight() {
    return this._height / 2;
  }
  get maxI() {
    return this._topLeft.i + this._width - 1;
  }
  get maxJ() {
    return this._topLeft.j + this._height - 1;
  }
  get centerI() {
    return this._topLeft.i + this.halfWidth;
  }
  get centerJ() {
    return this._topLeft.j + this.halfHeight;
  }
  get center() {
    return new Position(this.centerI, this.centerJ);
  }
  get topLeft() {
    return this._topLeft;
  }
  get topRight() {
    return new Position(this.maxI, this._topLeft.j);
  }
  get bottomLeft() {
    return new Position(this._topLeft.i, this.maxJ);
  }
  get bottomRight() {
    return new Position(this.maxI, this.maxJ);
  }
  get topCenter() {
    return new Position(this.centerI, this._topLeft.j);
  }
  get rightCenter() {
    return new Position(this.maxI, this.centerJ);
  }
  get bottomCenter() {
    return new Position(this.centerI, this.maxJ);
  }
  get leftCenter() {
    return new Position(this._topLeft.i, this.centerJ);
  }

  set center(p: Position) {
    this._topLeft = p.translate(new Vector(-this.halfWidth, -this.halfHeight));
  }
  set topLeft(p: Position) {
    this._topLeft = p;
  }
  set topRight(p: Position) {
    this._topLeft = p.translate(new Vector(-this._width, 0));
  }
  set bottomLeft(p: Position) {
    this._topLeft = p.translate(new Vector(0, -this._height));
  }
  set bottomRight(p: Position) {
    this._topLeft = p.translate(new Vector(-this._width, -this._height));
  }
  set topCenter(p: Position) {
    this._topLeft = p.translate(new Vector(-this.halfWidth, 0));
  }
  set rightCenteR(p: Position) {
    this._topLeft = p.translate(new Vector(-this._width, -this.halfHeight));
  }
  set bottomCenter(p: Position) {
    this._topLeft = p.translate(new Vector(-this.halfWidth, -this._height));
  }
  set leftCenter(p: Position) {
    this._topLeft = p.translate(new Vector(0, -this.halfHeight));
  }
  containes(p: Position) {
    const tl = this._topLeft;
    const br = this.bottomRight;
    return p.i >= tl.i && p.i <= br.i && p.j >= tl.j && p.j <= br.j;
  }
  overlaps(r: Rectangle) {
    return (
      this.containes(r.topLeft) ||
      this.containes(r.topRight) ||
      this.containes(r.bottomLeft) ||
      this.containes(r.bottomRight)
    );
  }
}

export class Grid extends Rectangle {
  private _rowCount: number = 1;
  private _columnCount: number = 1;
  private _cellWidth: number = 1;
  private _cellhHeight: number = 1;

  constructor(width: number, height: number) {
    super(width, height);
  }
  setGridTemplate(columnCount: number, rowCount: number) {
    this._rowCount = rowCount;
    this._columnCount = columnCount;
    this._cellWidth = this.width / columnCount;
    this._cellhHeight = this.height / rowCount;
  }
  getGridCell(i: number, j: number) {
    return new Rectangle(
      this._cellWidth,
      this._cellhHeight,
      new Position(i * this._cellWidth, j * this._cellhHeight)
    );
  }
  get rowCount() {
    return this._rowCount;
  }
  get columnCount() {
    return this._columnCount;
  }
  randomCell() {
    const rnd = Math.random;
    const flr = Math.floor;
    return this.getGridCell(
      flr(rnd() * (this._columnCount - 1)),
      flr(rnd() * (this._rowCount - 1))
    );
  }
}

export async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((res) => {
    const img = new Image();
    img.src = url;
    const handleLoad = () => {
      res(img);
      img.removeEventListener("load", handleLoad);
    };
    img.addEventListener("load", handleLoad);
  });
}
