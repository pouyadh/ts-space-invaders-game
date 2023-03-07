//import { Explosion } from "./Explosion";
import { Space } from "./Space";
import { Rectangle, Vector } from "./utils";

export interface SpaceObjectConstructor {
  space: Space;
  width: number;
  height: number;
  frames: ImageBitmap[];
}
export class SpaceObject extends Rectangle {
  public velocity: Vector = new Vector(0, 0);
  protected space: Space;
  public image: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public health: number = 100;
  public explodable: boolean = false;
  protected imageRotateOffset: number = 0;
  protected frames: ImageBitmap[];
  protected imageType: number = 0;
  protected animFrameIndex: number = 0;
  protected animInterval: number = 50;
  protected nextAnimTime: number = 0;
  protected rotation: boolean = false;
  constructor(c: SpaceObjectConstructor) {
    super(c.width, c.height);
    this.space = c.space;
    this.image = document.createElement("canvas");
    this.image.width = Math.max(c.width, c.height);
    this.image.height = Math.max(c.width, c.height);
    this.ctx = this.image.getContext("2d")!;
    this.frames = c.frames;
  }
  animationEnded() {}
  animate(timestamp: number) {
    if (timestamp < this.nextAnimTime) return;
    this.nextAnimTime = timestamp + this.animInterval;
    this.updateImage(this.frames[this.animFrameIndex++]);

    if (this.animFrameIndex === this.frames.length) {
      this.animFrameIndex = 0;
      this.animationEnded();
    }
  }
  updateImage(img: ImageBitmap) {
    this.ctx.clearRect(0, 0, this.image.width, this.image.height);
    this.ctx.translate(this.image.width / 2, this.image.height / 2);
    if (this.rotation) {
      this.ctx.rotate(this.imageRotateOffset - this.velocity.angle);
    }
    this.ctx.drawImage(
      img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  beforeProcess(timestamp: number) {}
  process(timestamp: number) {}
  afterProcess(timestamp: number) {}
  destroy() {
    this.health = 0;
  }
  beforeRemove() {}
}
