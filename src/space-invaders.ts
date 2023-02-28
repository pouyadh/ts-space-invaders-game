import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";
import { Invader } from "./Invader";
import { Space } from "./Space";
import { SpaceShip } from "./SpaceShip";
import { Vector } from "./utils";

(async function () {
  await Promise.all([
    SpaceShip.load(),
    Invader.load(),
    Bullet.load(),
    Explosion.load(),
  ]);

  const space = new Space("space-invaders-game", innerWidth, innerHeight);
  space.setGridTemplate(30, 20);

  let spaceShip = new SpaceShip(space);
  spaceShip.bottomCenter = space.bottomCenter;
  space.add(spaceShip);

  const inviders: Invader[] = new Array(20).fill(null).map((e, i) => {
    const i2 = i + 5;
    const invader = new Invader(space);
    invader.center = space.center;
    invader.setPath(
      [
        space.getGridCell(i2, 1).center,
        space.getGridCell(i2, 2 + Math.random() * 2).center,
        space.getGridCell(i2, 2).center,
        space.getGridCell(i2, 3).center,
        space.getGridCell(i2, 4).center,
        space.getGridCell(i2, 2).center,
        space.getGridCell(i2, 3).center,
        space.getGridCell(i2, 4).center,
        space.getGridCell(i2, 9 + Math.random() * 4).center,
        space.getGridCell(i2, 4).center,
        space.getGridCell(i2, 2 + Math.random() * 4).center,
        //space.getGridCell(30 - i2, 6).center,
        space.getGridCell(i2, (i2 % 2) + 1).center,
        space.getGridCell(i2, (i2 % 5) + 2).center,
        //space.randomCell().center,
      ],
      "alternate"
    );
    return invader;
  });
  console.log(inviders);

  inviders.forEach((i) => space.add(i));

  // for (let i = 0; i < 20; i++) {
  //   const invader = new Invader(space);
  //   invader.center = space.center;
  //   invader.target = space.getGridCell(i, 1).center;
  //   space.add(invader);
  // }
})();

// setTimeout(() => {
//   space.remove(spaceShip);
//   spaceShip = null;
// }, 4000);
