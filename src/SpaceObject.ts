//import { Explosion } from "./Explosion";
import { Space } from "./Space";
import { Rectangle, Vector } from "./utils";

export interface SpaceObjectConstructor {
  space: Space;
  width: number;
  height: number;
}
export class SpaceObject extends Rectangle {
  public velocity: Vector = Vector.STILL;
  protected space: Space;
  public image: ImageBitmap | undefined;
  public health: number = 100;
  public explodable: boolean = false;
  constructor(c: SpaceObjectConstructor) {
    super(c.width, c.height);
    this.space = c.space;
  }
  beforeProcess(timestamp: number) {}
  process(timestamp: number) {}
  afterProcess(timestamp: number) {}
  destroy() {
    this.health = 0;
  }
  beforeRemove() {}
}
