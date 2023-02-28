import inavderImageURL from "./assets/img/invader.png";
import { SpaceObject } from "./SpaceObject";
import { Space } from "./Space";
import { loadImage, Position, Vector } from "./utils";

type PathMode = "once" | "alternate" | "infinit";

export class Invader extends SpaceObject {
  static image: ImageBitmap;
  static async load() {
    const img = await loadImage(inavderImageURL);
    this.image = await createImageBitmap(img, 0, 0, img.width, img.height);
  }
  static width = 20;
  static height = 30;
  static movementInterval = 50;
  nextMovementTimestamp = 0;
  target: Position | null = null;
  resolveTarget: (value: Position) => void = (value: Position) => {};
  resolvePath: (value: Position) => void = (value: Position) => {};

  path: Position[] = [];
  pathIndex: number = 0;
  pathMode: PathMode = "once";
  pathAlternateState: boolean = false;

  constructor(space: Space) {
    super({ space, width: 20, height: 30 });
    this.explodable = true;
    this.image = Invader.image;
  }
  async goTo(p: Position) {
    this.target = p;
    return new Promise<Position>((res) => (this.resolveTarget = res));
  }
  setPath(path: Position[] | Position, mode: PathMode = "once") {
    if (path instanceof Position) {
      this.path = [path];
      this.pathMode = "once";
      this.pathIndex = 0;
      this.target = path;
    } else if (path[0]) {
      this.path = path;
      this.pathMode = mode;
      this.pathAlternateState = false;
      this.pathIndex = 0;
      this.target = path[0];
    }
    return new Promise<Position>((res) => (this.resolvePath = res));
  }

  getNextTarget() {
    if (!this.path.length || this.pathIndex === -1) return null;
    const nextTarget = this.path[this.pathIndex];
    switch (this.pathMode) {
      case "once":
        this.pathIndex++;
        if (this.pathIndex === this.path.length) {
          this.pathIndex = -1;
        }
        break;
      case "alternate":
        if (!this.pathAlternateState) {
          this.pathIndex++;
          if (this.pathIndex === this.path.length) {
            this.pathIndex--;
            this.pathAlternateState = !this.pathAlternateState;
          }
        } else {
          this.pathIndex--;
          if (this.pathIndex === -1) {
            this.pathIndex++;
            this.pathAlternateState = !this.pathAlternateState;
          }
        }
        break;
      case "infinit":
        this.pathIndex++;
        if (this.pathIndex === this.path.length) {
          this.pathIndex = 0;
        }
        break;
    }
    return nextTarget;
  }
  move() {
    if (!this.target) return;
    const v = this.center.to(this.target);
    const d = this.center.calcDistance(this.target);
    this.center = this.center.translate(v.limitByRadius(d / 2.5));
    if (d < 1) {
      const nextTarget = this.getNextTarget();
      this.resolveTarget(this.target);
      if (!nextTarget) this.resolvePath(this.target);
      this.target = nextTarget;
    }
  }
  process(timestamp: number): void {
    if (timestamp > this.nextMovementTimestamp) {
      this.move();
      this.nextMovementTimestamp = timestamp + Invader.movementInterval;
    }
  }
}
