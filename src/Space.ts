import { Explosion } from "./Explosion";
import { SpaceObject } from "./SpaceObject";
import { Grid } from "./utils";

export class Space extends Grid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  public enabled: boolean = true;
  private nextRefresh: number = 0;
  private fps: number = 30;
  public objects: SpaceObject[] = [];
  public addEventListener: HTMLCanvasElement["addEventListener"];
  public removeEventListener: HTMLCanvasElement["removeEventListener"];
  constructor(rootElementId: string, width: number, height: number) {
    super(width, height);
    const root = document.querySelector("#" + rootElementId) as HTMLElement;
    if (!root) throw new Error("graphic root element not found");
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.canvas.width = width;
    this.canvas.height = height;
    this.addEventListener = this.canvas.addEventListener.bind(this.canvas);
    this.removeEventListener = this.canvas.removeEventListener.bind(
      this.canvas
    );
    root.appendChild(this.canvas);
    this.refresh = this.refresh.bind(this);
    requestAnimationFrame(this.refresh);
  }

  refresh(timestamp: number) {
    if (this.enabled && this.nextRefresh < timestamp) {
      this.process(timestamp);
      this.draw();
      this.nextRefresh = timestamp + 1000 / this.fps;
    }
    requestAnimationFrame(this.refresh);
  }

  add(...objects: SpaceObject[]) {
    this.objects.push(...objects);
  }
  remove(...objects: SpaceObject[]) {
    objects.forEach((o) => o.beforeRemove());
    this.objects = this.objects.filter((o) => !objects.includes(o));
  }
  process(timestamp: number) {
    this.objects.forEach((o) => o.beforeProcess(timestamp));
    this.objects.forEach((o) => o.process(timestamp));
    this.objects.forEach((o) => o.afterProcess(timestamp));
    const destroiedObjects = this.objects.filter((o) => o.health <= 0);
    destroiedObjects
      .filter((o) => o.explodable)
      .forEach((o) => {
        const explosion = new Explosion(this, Math.max(o.width, o.height));
        explosion.center = o.center;
        this.add(explosion);
      });
    this.remove(...destroiedObjects);
  }

  draw() {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((o) => {
      if (o.image) {
        this.context.drawImage(
          o.image,
          o.topLeft.i,
          o.topLeft.j,
          o.width,
          o.height
        );
      }
    });
  }
}
