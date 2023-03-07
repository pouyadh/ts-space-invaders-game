import spaceShipImageURL from "./assets/img/spaceship.png";
import { Space } from "./Space";
import { Bullet } from "./Bullet";
import { SpaceObject } from "./SpaceObject";
import { loadImage, Vector } from "./utils";

export class SpaceShip extends SpaceObject {
  static S1 = class extends SpaceShip {};
  static S2 = class extends SpaceShip {};
  static S3 = class extends SpaceShip {};
  static S4 = class extends SpaceShip {};
  static S5 = class extends SpaceShip {};
  static S6 = class extends SpaceShip {};
  static S7 = class extends SpaceShip {};
  static S8 = class extends SpaceShip {};

  static images: ImageBitmap[][];
  static async load() {
    const img = await loadImage(spaceShipImageURL);
    this.images = await Promise.all(
      new Array(8)
        .fill(null)
        .map(async (emp, i) => [
          await createImageBitmap(img, i * 350, 0, 350, 350),
          await createImageBitmap(img, i * 350, 350, 350, 350),
        ])
    );
  }
  shootInterval: number = 100;
  nextShootTime: number = 0;
  shooting: boolean = false;

  constructor(space: Space, type: number = 0) {
    super({ space, width: 90, height: 120, frames: SpaceShip.images[type] });
    this.shoot = this.shoot.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startShooting = this.startShooting.bind(this);
    this.stopShooting = this.stopShooting.bind(this);

    this.space.addEventListener("mousedown", this.startShooting);
    this.space.addEventListener("mouseup", this.stopShooting);
    this.space.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove(e: MouseEvent) {
    this.centerI = e.clientX;
  }

  beforeProcess() {}
  process(timestamp: number) {
    if (this.shooting && timestamp > this.nextShootTime) {
      this.shoot();
      this.nextShootTime = timestamp + this.shootInterval;
    }
  }
  afterProcess() {}

  startShooting() {
    this.shooting = true;
  }
  stopShooting() {
    this.shooting = false;
  }

  shoot() {}
  beforeRemove(): void {
    this.space.removeEventListener("mousedown", this.startShooting);
    this.space.removeEventListener("mouseup", this.stopShooting);
    this.space.removeEventListener("mousemove", this.handleMouseMove);
  }
}

SpaceShip.S1 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 0);
    this.shootInterval = 300;
  }
  shoot(): void {
    const blts = [new Bullet(this.space, new Vector(0, -20))];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 20;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S2 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 1);
    this.shootInterval = 200;
  }
  shoot(): void {
    const blts = [new Bullet(this.space, new Vector(0, -20), 1)];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 25;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S3 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 2);
    this.shootInterval = 190;
  }
  shoot(): void {
    const blts = [
      new Bullet(this.space, new Vector(0, -20), 2),
      new Bullet(this.space, new Vector(2, -20), 2),
      new Bullet(this.space, new Vector(-2, -20), 2),
    ];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 30;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S4 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 3);
    this.shootInterval = 180;
  }
  shoot(): void {
    const blts = [new Bullet(this.space, new Vector(0, -20), 3)];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 35;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S5 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 4);
    this.shootInterval = 160;
  }
  shoot(): void {
    const blts = [new Bullet(this.space, new Vector(0, -20), 4)];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 40;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S6 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 5);
    this.shootInterval = 120;
  }
  shoot(): void {
    const blts = [new Bullet(this.space, new Vector(0, -20), 5)];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 45;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S7 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 6);
    this.shootInterval = 100;
  }
  shoot(): void {
    const blts = [
      new Bullet(this.space, new Vector(0, -20), 5),
      new Bullet(this.space, new Vector(2, -20), 2),
      new Bullet(this.space, new Vector(-2, -20), 2),
    ];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 45;
    });
    this.space.add(...blts);
  }
};

SpaceShip.S8 = class extends SpaceShip {
  constructor(space: Space) {
    super(space, 6);
    this.shootInterval = 80;
  }
  shoot(): void {
    const blts = [
      new Bullet(this.space, new Vector(0, -20), 7),
      new Bullet(this.space, new Vector(2, -20), 6),
      new Bullet(this.space, new Vector(-2, -20), 6),
    ];
    blts.forEach((blt) => {
      blt.bottomCenter = this.topCenter;
      blt.power = 50;
    });
    this.space.add(...blts);
  }
};
