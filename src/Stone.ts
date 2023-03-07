import { loadImage, Vector } from "./utils";
import stoneImageURL from "./assets/img/stone.png";

import { SpaceObject } from "./SpaceObject";
import { Space } from "./Space";

export class Stone extends SpaceObject {
  static images: ImageBitmap[][];
  static async load() {
    const img = await loadImage(stoneImageURL);
    const bmps = await Promise.all(
      [0, 1, 2, 3, 4].map(async (i) => [
        await createImageBitmap(img, img.height * i, 0, img.height, img.height),
      ])
    );
    this.images = bmps;
  }
  constructor(space: Space) {
    super({
      space,
      width: 1 + Math.random() * 5,
      height: 1 + Math.random() * 5,
      frames:
        Stone.images[Math.round(Math.random() * (Stone.images.length - 1))],
    });
    this.explodable = true;
    this.health = 100;
  }
  process() {
    this._topLeft = this._topLeft.translate(this.velocity);
  }
}
