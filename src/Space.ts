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
  public backgroundObjects: SpaceObject[] = [];
  public addEventListener: HTMLCanvasElement["addEventListener"];
  public removeEventListener: HTMLCanvasElement["removeEventListener"];

  public diePromises = new Map<SpaceObject, Promise<SpaceObject>>();
  private diePromiseResolve = new Map<SpaceObject, () => void>();

  private headerElement: HTMLDivElement;
  private centerElement: HTMLDivElement;

  constructor(rootElementId: string, width: number, height: number) {
    super(width, height);
    const root = document.querySelector("#" + rootElementId) as HTMLElement;
    if (!root) throw new Error("graphic root element not found");
    root.style.position = "relative";

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
    this.canvas.style.cursor = "none";
    this.headerElement = document.createElement("div");
    this.headerElement.style.position = "absolute";
    this.headerElement.style.top = "0";
    this.headerElement.style.left = "0";
    this.headerElement.style.color = "white";

    root.appendChild(this.headerElement);
    this.headerElement.innerHTML = "HEADER";

    this.centerElement = document.createElement("div");
    this.centerElement.style.position = "absolute";
    this.centerElement.style.top = "50%";
    this.centerElement.style.left = "50%";
    this.centerElement.style.transform = "translate(-50%,-50%)";
    this.centerElement.style.color = "white";
    this.centerElement.style.fontSize = "32px";
    root.appendChild(this.centerElement);
    this.centerElement.innerHTML = "CENTER";
  }

  setCenterHTML(html: string) {
    this.centerElement.innerHTML = html;
    this.centerElement.style.display = html ? "block" : "none";
  }
  setHeaderHTML(html: string) {
    this.headerElement.innerHTML = html;
    this.headerElement.style.display = html ? "block" : "none";
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
    return objects.map((o) => {
      let resolve: (value: SpaceObject) => void;
      let promise = new Promise<SpaceObject>((res) => (resolve = res));
      this.diePromises.set(o, promise);
      this.diePromiseResolve.set(o, () => resolve(o));
      return promise;
    });
  }
  addBackgoundObject(...objects: SpaceObject[]) {
    this.backgroundObjects.push(...objects);
  }
  remove(...objects: SpaceObject[]) {
    objects.forEach((o) => o.beforeRemove());
    objects.forEach((o) => {
      this.diePromiseResolve.get(o)?.();
    });
    this.objects = this.objects.filter((o) => !objects.includes(o));
  }
  process(timestamp: number) {
    this.backgroundObjects.forEach((o) => o.animate(timestamp));
    this.backgroundObjects.forEach((o) => o.process(timestamp));
    this.backgroundObjects = this.backgroundObjects.filter(
      (o) =>
        o.health > 0 &&
        (this.containes(o.topLeft) || this.containes(o.bottomRight))
    );

    this.objects.forEach((o) => o.animate(timestamp));
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

  clear(background: boolean = false) {
    this.objects = [];
    if (background) {
      this.backgroundObjects = [];
    }
  }
  draw() {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.backgroundObjects.forEach((o) => {
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
    this.objects.forEach((o) => {
      if (o.image) {
        this.context.drawImage(
          o.image,
          o.center.i - o.image.width / 2,
          o.center.j - o.image.height / 2,
          o.image.width,
          o.image.height
        );
      }
    });
  }
}
