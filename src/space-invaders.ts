import { Bullet } from "./Bullet";
import { Explosion } from "./Explosion";
import { Invader } from "./Invader";
import { Space } from "./Space";
import { SpaceShip } from "./SpaceShip";
import { Stone } from "./Stone";
import { delay, Position, Vector } from "./utils";

(async function () {
  await Promise.all([
    SpaceShip.load(),
    Invader.load(),
    Bullet.load(),
    Explosion.load(),
    Stone.load(),
  ]);

  await runGame();

  // const space = new Space("space-invaders-game", innerWidth, innerHeight);
  // space.setGridTemplate(10, 20);

  // let spaceShip = new SpaceShip.S8(space);
  // spaceShip.bottomCenter = space.bottomCenter;
  // spaceShip.centerJ += -30;
  // space.add(spaceShip);

  // const inviders: Invader[] = new Array(8).fill(null).map((e, i) => {
  //   const i2 = i + 1;
  //   const invader = new Invader(space, Math.floor(Math.random() * 9));
  //   invader.center = space.center;
  //   invader.setPath(
  //     [
  //       space.getGridCell(i2, 1).center,
  //       space.getGridCell(i2, 2 + Math.random() * 2).center,
  //       space.getGridCell(i2, 2).center,
  //       space.getGridCell(i2, 3).center,
  //       space.getGridCell(i2, 4).center,
  //       space.getGridCell(i2, 2).center,
  //       space.getGridCell(i2, 3).center,
  //       space.getGridCell(i2, 4).center,
  //       space.getGridCell(i2, 9 + Math.random() * 4).center,
  //       space.getGridCell(i2, 4).center,
  //       space.getGridCell(i2, 2 + Math.random() * 4).center,
  //       //space.getGridCell(30 - i2, 6).center,
  //       space.getGridCell(i2, (i2 % 2) + 1).center,
  //       space.getGridCell(i2, (i2 % 5) + 2).center,
  //       //space.randomCell().center,
  //     ],
  //     "alternate"
  //   );
  //   return invader;
  // });

  // inviders.forEach((i) => space.add(i));

  // for (let i = 0; i < 20; i++) {
  //   const invader = new Invader(space);
  //   invader.center = space.center;
  //   invader.target = space.getGridCell(i, 1).center;
  //   space.add(invader);
  // }
})();

const generateStone = (space: Space) => {
  const stone = new Stone(space);
  stone.velocity = new Vector(Math.random() * 10 - 3, 1);
  stone.topCenter = new Position(space.maxI * Math.random(), space.centerJ);
  const stone2 = new Stone(space);
  stone2.velocity = new Vector(Math.random() * 10 - 3, 1);
  stone2.topCenter = new Position(space.maxI * Math.random(), 0);

  const ex = new Explosion(space, 10);
  ex.velocity = new Vector(Math.random() * 10 - 3, 1);
  ex.topCenter = new Position(
    space.maxI * Math.random(),
    space.maxJ * Math.random()
  );
  space.addBackgoundObject(stone, stone2, ex);
};

type GameState = {
  score: number;
  lives: number;
  end: boolean;
  updateUI: () => void;
  addScore: (amount: number) => void;
  decreaseLive: () => void;
};
async function runGame() {
  const space = new Space("space-invaders-game", innerWidth, innerHeight);
  const state: GameState = {
    score: 0,
    lives: 3,
    end: false,
    updateUI: function () {
      space.setHeaderHTML(`SCORE: ${this.score} | LIVES:${this.lives}`);
    },
    addScore: function (amount: number) {
      this.score += amount;
      this.updateUI();
    },
    decreaseLive: function () {
      this.lives--;
      this.updateUI();
    },
  };
  state.updateUI();
  const stoneTimer = setInterval(() => generateStone(space), 500);

  space.setCenterHTML(`
  <span class="x-large"><a href="https://github.com/pouyadh/ts-space-invaders-game" target="_blank">Github Repo</a></span>
  </br>  
  </br>
  <span class="large">
  Welcome to the space invaders game
  </span>
  `);

  await delay(5000);
  await level1(space, state);
  await level2(space, state);
  await level3(space, state);
  space.setCenterHTML(`
  <span class="success">GOOD JOB!</span>
  </br>
  <span class="large">
    This was the last level
    </br>
    you can add more levels if you wish
  </span>
  </br>
  <a href="https://github.com/pouyadh/ts-space-invaders-game" target="_blank" class="small">Project Repo</a>
  `);
  await delay(1000);
  clearInterval(stoneTimer);
}

async function level1(space: Space, state: GameState) {
  space.clear();

  space.setCenterHTML("LEVEL 1");
  await delay(1000);

  space.setGridTemplate(10, 20);
  let spaceShip = new SpaceShip.S1(space);
  spaceShip.bottomCenter = space.bottomCenter.translate(new Vector(0, -30));
  space.add(spaceShip);

  for (const msg of ["GET READY!", "THREE", "TWO", "ONE", "GO!"]) {
    space.setCenterHTML(msg);
    await delay(1000);
  }
  space.setCenterHTML("");

  const inviders: Invader[] = new Array(8).fill(null).map((e, i) => {
    const i2 = i + 1;
    const invader = new Invader(space, space.cellWidth, 0);
    invader.center = space.center;
    invader.setPath(
      [
        space.getGridCell(i2, 1).center,
        space.getGridCell(i2, 2 + Math.random() * 2).center,
        space.getGridCell(i2, 2).center,
        space.getGridCell(i2, 1).center,
      ],
      "alternate"
    );
    return invader;
  });

  const diePromises = space.add(...inviders);
  diePromises.forEach((d) => {
    d.then(() => state.addScore(10));
  });
  await Promise.all(diePromises);

  space.setCenterHTML(`<span class="success">GOOD JOB!</span>`);
  await delay(1000);
}

async function level2(space: Space, state: GameState) {
  space.clear();

  space.setCenterHTML("LEVEL 2");
  await delay(1000);

  space.setGridTemplate(10, 20);
  let spaceShip = new SpaceShip.S2(space);
  spaceShip.bottomCenter = space.bottomCenter.translate(new Vector(0, -30));
  space.add(spaceShip);

  for (const msg of ["GET READY!", "THREE", "TWO", "ONE", "GO!"]) {
    space.setCenterHTML(msg);
    await delay(1000);
  }
  space.setCenterHTML("");

  const inviders: Invader[] = new Array(8).fill(null).map((e, i) => {
    const i2 = i + 1;
    const invader = new Invader(
      space,
      space.cellWidth,
      Math.floor(Math.random() * 9)
    );
    invader.center = space.center;
    invader.setPath(
      [
        space.getGridCell(i2, 1).center,
        space.getGridCell(i2, 2 + Math.random() * 2).center,
        space.getGridCell(i2, 2).center,
        space.getGridCell(i2, 1).center,
      ],
      "alternate"
    );
    return invader;
  });

  const diePromises = space.add(...inviders);
  diePromises.forEach((d) => {
    d.then(() => state.addScore(15));
  });
  await Promise.all(diePromises);

  space.setCenterHTML(`<span class="success">GOOD JOB!</span>`);
  await delay(1000);
}

async function level3(space: Space, state: GameState) {
  space.clear();

  space.setCenterHTML("LEVEL 3");
  await delay(1000);

  space.setGridTemplate(10, 20);
  let spaceShip = new SpaceShip.S3(space);
  spaceShip.bottomCenter = space.bottomCenter.translate(new Vector(0, -30));
  space.add(spaceShip);

  for (const msg of ["GET READY!", "THREE", "TWO", "ONE", "GO!"]) {
    space.setCenterHTML(msg);
    await delay(1000);
  }
  space.setCenterHTML("");

  let inviders: Invader[] = new Array(8).fill(null).map((e, i) => {
    const i2 = i + 1;
    const invader = new Invader(
      space,
      space.cellWidth,
      Math.floor(Math.random() * 9)
    );
    invader.center = space.center;
    invader.setPath(
      [
        space.getGridCell(i2, 1).center,
        space.getGridCell(i2, 2 + Math.random() * 2).center,
        space.getGridCell(i2, 2).center,
        space.getGridCell(i2, 1).center,
      ],
      "alternate"
    );
    return invader;
  });
  space.setGridTemplate(10, 20);
  let inviders2: Invader[] = new Array(6).fill(null).map((e, i) => {
    const i2 = i + 2;
    const invader = new Invader(
      space,
      space.cellWidth,
      Math.floor(Math.random() * 9)
    );
    invader.center = space.center;
    invader.setPath(
      [
        space.getGridCell(i2, 5).center,
        space.getGridCell(i2 - 1, 6).center,
        space.getGridCell(i2 + 1, 7).center,
      ],
      "alternate"
    );
    return invader;
  });

  setInterval(() => {
    inviders2.forEach((i) => i.shoot());
  }, 4000);

  const diePromises = space.add(...inviders, ...inviders2);
  diePromises.forEach((d) => {
    d.then(() => state.addScore(15));
  });
  diePromises.forEach((d) => {
    d.then((i) => {
      inviders = inviders.filter((inv) => inv !== i);
      inviders2 = inviders2.filter((inv) => inv !== i);
    });
  });
  await Promise.all(diePromises);

  space.setCenterHTML(`<span class="success">GOOD JOB!</span>`);
  await delay(1000);
}
