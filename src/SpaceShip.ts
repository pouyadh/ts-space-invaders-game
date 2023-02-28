import spaceShipImageURL from "./assets/img/space-ship.png";
import { Space } from "./Space";
import { Bullet } from "./Bullet";
import { SpaceObject } from "./SpaceObject";
import { loadImage } from "./utils";

export class SpaceShip extends SpaceObject {
  static image: ImageBitmap;
  static async load() {
    const img = await loadImage(spaceShipImageURL);
    this.image = await createImageBitmap(img, 0, 0, img.width, img.height);
  }
  constructor(space: Space) {
    super({ space, width: 60, height: 80 });
    this.shoot = this.shoot.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.space.addEventListener("click", this.shoot);
    this.space.addEventListener("mousemove", this.handleMouseMove);
    this.image = SpaceShip.image;
  }
  handleMouseMove(e: MouseEvent) {
    this.centerI = e.clientX;
  }

  beforeProcess() {}
  process() {}
  afterProcess() {}
  shoot() {
    console.log(this);
    const bullet = new Bullet(this.space);
    bullet.bottomCenter = this.topCenter;
    bullet.velocity.i = 0;
    bullet.velocity.j = -20;
    bullet.power = 50;
    this.space.add(bullet);
  }
  beforeRemove(): void {
    this.space.removeEventListener("click", this.shoot);
    this.space.removeEventListener("mousemove", this.handleMouseMove);
  }
}
