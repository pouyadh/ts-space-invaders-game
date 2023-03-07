import explosionImageURL from "./assets/img/explosion.png";
import { Space } from "./Space";
import { SpaceObject } from "./SpaceObject";
import { loadImage } from "./utils";

export class Explosion extends SpaceObject {
  static images: ImageBitmap[];
  static async load() {
    const img = await loadImage(explosionImageURL);
    const fSize = 184;
    this.images = await Promise.all(
      new Array(9)
        .fill(null)
        .map((e, i) => createImageBitmap(img, fSize * i, 0, fSize, fSize))
    );
  }
  step: number = 0;
  nextStepTime: number = 0;
  stepInterval: number = 50;
  constructor(space: Space, radius: number) {
    super({ space, width: radius, height: radius, frames: Explosion.images });
  }
  animationEnded(): void {
    this.health = 0;
  }
  process(timestamp: number): void {
    this._topLeft = this._topLeft.translate(this.velocity);
    if (timestamp > this.nextStepTime) {
      this.nextStepTime = timestamp + this.stepInterval;
    }
  }
}
