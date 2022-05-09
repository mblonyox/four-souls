import { Geom, Scene, GameObjects } from "phaser";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../config";

export default class MenuScene extends Scene {
  width: number;
  height: number;
  bg?: GameObjects.TileSprite;
  bg1?: GameObjects.TileSprite;
  bg2?: GameObjects.TileSprite;
  bg3?: GameObjects.TileSprite;
  logo?: GameObjects.Image;

  constructor() {
    super({ key: "menu-scene" });
    this.width = VIEW_WIDTH;
    this.height = VIEW_HEIGHT;
  }

  preload() {
    this.load.image("logo", "/assets/images/logo.png");
    this.load.image("background", "/assets/images/background.png");
    this.load.image(
      "background-layer1",
      "/assets/images/background-layer1.png"
    );
    this.load.image(
      "background-layer2",
      "/assets/images/background-layer2.png"
    );
    this.load.image(
      "background-layer3",
      "/assets/images/background-layer3.png"
    );
  }

  create() {
    this.createBackground();
    this.createStartButton();
  }

  createBackground() {
    this.bg = this.add
      .tileSprite(0, 0, this.width, this.height, "background")
      .setOrigin(0, 0);
    this.bg1 = this.add
      .tileSprite(0, 0, this.width, this.height, "background-layer1")
      .setOrigin(0, 0);
    this.bg2 = this.add
      .tileSprite(0, 0, this.width, this.height, "background-layer2")
      .setOrigin(0, 0);
    this.bg3 = this.add
      .tileSprite(0, 0, this.width, this.height, "background-layer3")
      .setOrigin(0, 0);

    this.logo = this.add.image(this.width / 2, this.height / 2, "logo");
  }

  createStartButton() {
    const buttonContainer = this.add.container(
      this.width / 2,
      (this.height * 4) / 5
    );

    const graphics = this.add.graphics();
    graphics.lineStyle(10, 0x726c69).strokeRoundedRect(-120, -40, 240, 80, 20);
    graphics.fillStyle(0xe8dbdf).fillRoundedRect(-120, -40, 240, 80, 20);
    buttonContainer.add(graphics);
    const text = this.add.text(-110, -30, "Start!", {
      fontFamily: "EdMundMcMillen",
      fontSize: "4rem",
      color: "#000000",
    });
    buttonContainer.add(text);

    buttonContainer
      .setInteractive(
        new Geom.Rectangle(-120, -40, 240, 80),
        Geom.Rectangle.Contains
      )
      .on("pointerover", () => {
        graphics.clear();
        graphics
          .lineStyle(20, 0xbf8b20)
          .strokeRoundedRect(-120, -40, 240, 80, 20);
        graphics.fillStyle(0xf6f4ec).fillRoundedRect(-120, -40, 240, 80, 20);
      })
      .on("pointerout", () => {
        graphics.clear();
        graphics
          .lineStyle(10, 0x726c69)
          .strokeRoundedRect(-120, -40, 240, 80, 20);
        graphics.fillStyle(0xe8dbdf).fillRoundedRect(-120, -40, 240, 80, 20);
      })
      .on("pointerdown", () => {
        this.scene.start("table-scene");
      });
  }

  update(_time: number, _delta: number): void {
    this.bg!.tilePositionX += 0.1;
    this.bg!.tilePositionY -= 0.1;
    this.bg1!.tilePositionX += 0.2;
    this.bg1!.tilePositionY -= 0.2;
    this.bg2!.tilePositionX += 0.3;
    this.bg2!.tilePositionY -= 0.3;
    this.bg3!.tilePositionX += 0.5;
    this.bg3!.tilePositionY -= 0.5;
  }
}
