import { GameObjects, Scene } from "phaser";

export default class Items extends GameObjects.Group {
  constructor(
    scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0xffffff,
    public width: number = 640,
    public height: number = 360
  ) {
    super(scene);
    scene.add.existing(this);
    this.drawArea();
  }

  drawArea() {
    this.scene.add
      .graphics()
      .setPosition(this.x, this.y)
      .lineStyle(2, this.color)
      .strokeRoundedRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
  }
}
