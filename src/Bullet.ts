import { loadImage, Vector } from "./utils";
import bulletImageURL from "./assets/img/bullets.png";
import { SpaceObject } from "./SpaceObject";
import { Space } from "./Space";
import { Explosion } from "./Explosion";

export class Bullet extends SpaceObject {
  static images: ImageBitmap[][];
  static async load() {
    const img = await loadImage(bulletImageURL);
    const fSize = 40;
    this.images = await Promise.all(
      new Array(8)
        .fill(null)
        .map(async (e, i) => [
          await createImageBitmap(img, fSize * i, 0, fSize, fSize),
        ])
    );
  }
  public power: number = 1;
  constructor(space: Space, velocity: Vector, type: number = 0) {
    super({ space, width: 5, height: 20, frames: Bullet.images[type] });
    this.velocity = velocity;
    this.imageRotateOffset = Math.PI / 2;
    this.rotation = true;
  }
  process() {
    this._topLeft = this._topLeft.translate(this.velocity);
    if (!this.space.containes(this._topLeft)) {
      this.health = 0;
    }
  }
  afterProcess() {
    const overlap = this.space.objects.find(
      (o) =>
        o !== this &&
        !(o instanceof Bullet) &&
        !(o instanceof Explosion) &&
        o.containes(this.topCenter)
    );
    if (overlap) {
      overlap.health -= this.power;
      this.health = 0;
    }
  }
}
