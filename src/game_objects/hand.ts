import { GameObjects, Scene } from "phaser";
import Card, { CARD_HEIGHT } from "./card";

export const HAND_WIDTH = 480;
export const HAND_CARD_SCALE = 1 / 4;

export default class Hand extends GameObjects.Group {

  constructor(
    scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0xffffff,
    public isHidden: boolean = false,
    public width: number = HAND_WIDTH
  ) {
    super(scene);
    this.drawHandArea();
  }

  private drawHandArea() {
    const height = CARD_HEIGHT * HAND_CARD_SCALE / 2;
    this.scene.add.graphics()
      .setPosition(this.x, this.y)
      .fillStyle(this.color, 0.2)
      .fillRoundedRect(-this.width / 2, -height / 2, this.width, height, 20);
  }

  addMultiple(children: Card[], addToScene?: boolean): this {
      super.addMultiple(children, addToScene);
      this.arrange();
      return this;
  }

  removeMultiple(children: Card[], removeFromScene?: boolean, destroyChild?: boolean): this {
      children.forEach((child) => super.remove(child, removeFromScene, destroyChild));
      this.arrange();
      return this;
  }

  arrange() {
    const promises: Promise<void>[] = [];
    const n = this.children.size;
    this.children.iterate((c, i) => {
      const card = c as Card;
      promises.push(new Promise<void>(res => {
        this.scene.add.tween({
          targets: card,
          x: this.x - this.width / 2 + this.width * (i + 1) / (n + 1),
          y: this.y,
          scale: HAND_CARD_SCALE,
          duration: 300,
        }).once('complete', () => {
          res(); if (this.isHidden == card.isFaceUp) card.flip();
        });
      }));
      card.setDepth(i);
    })
    return Promise.all(promises);
  }
}