import { loadImage, Vector } from "./utils";
import bulletImageURL from "./assets/img/bullet.png";
import { SpaceObject } from "./SpaceObject";
import { Space } from "./Space";

export class Bullet extends SpaceObject {
  static image: ImageBitmap;
  static async load() {
    const img = await loadImage(bulletImageURL);
    this.image = await createImageBitmap(img, 0, 0, img.width, img.height);
  }
  public velocity: Vector = Vector.STILL;
  public power: number = 1;
  constructor(space: Space) {
    super({ space, width: 5, height: 30 });
    this.image = Bullet.image;
  }
  process() {
    this._topLeft = this._topLeft.translate(this.velocity);
  }
  afterProcess() {
    const overlap = this.space.objects.find(
      (o) => o !== this && o.overlaps(this)
    );
    if (overlap) {
      overlap.health -= this.power;
      this.health = 0;
    }
  }
}
