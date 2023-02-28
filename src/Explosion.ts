import explosionImageURL from "./assets/img/explosion.png";
import { Space } from "./Space";
import { SpaceObject } from "./SpaceObject";
import { loadImage } from "./utils";

export class Explosion extends SpaceObject {
  static images: ImageBitmap[];
  static async load() {
    const img = await loadImage(explosionImageURL);
    this.images = await Promise.all([
      createImageBitmap(img, 145 * 0, 0, 145, 145),
      createImageBitmap(img, 145 * 1, 0, 145, 145),
      createImageBitmap(img, 145 * 2, 0, 145, 145),
      createImageBitmap(img, 145 * 3, 0, 145, 145),
    ]);
  }
  step: number = 0;
  timer: number;
  constructor(space: Space, radius: number) {
    super({ space, width: radius, height: radius });
    this.image = Explosion.images[0];
    this.timer = setInterval(this.updateStep.bind(this), 100);
  }
  updateStep() {
    this.image = Explosion.images?.[this.step];
    if (++this.step > 3) {
      clearInterval(this.timer);
      this.health = 0;
    }
  }
}
