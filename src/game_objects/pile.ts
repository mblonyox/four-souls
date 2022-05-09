import { GameObjects, Scene } from "phaser";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

const PILE_CARD_SCALE = 1 / 5;

export default class Pile extends GameObjects.Group {

  constructor(scene: Scene, public x: number, public y: number, public color: number, children?: Card[]) {
    super(scene, children);
    scene.add.existing(this);
    this.drawPileArea();
    this.arrange();
  }

  private drawPileArea() {
    const padding = 5;
    const width = CARD_WIDTH * PILE_CARD_SCALE;
    const height = CARD_HEIGHT * PILE_CARD_SCALE;
    this.scene.add.graphics()
      .setPosition(this.x, this.y)
      .lineStyle(2, this.color)
      .strokeRoundedRect(-width / 2 - padding, -height / 2 - padding, width + padding * 2, height + padding * 2, padding * 2);
  }

  addMultiple(children: Card[], addToScene?: boolean): this {
    super.addMultiple(children, addToScene);
    this.arrange();
    return this;
  }

  removeMultiple(children: Card[], removeFromScene?: boolean, destroyChild?: boolean): this {
    children.forEach((child) => {
      super.remove(child, removeFromScene, destroyChild);
    });
    this.arrange();
    return this;
  }

  arrange() {
    const promises: Promise<void>[] = [];
    this.children.iterate((c, i) => {
      const card = c as Card;
      promises.push(new Promise<void>(res => {
        this.scene.add.tween({
          targets: card,
          x: this.x,
          y: this.y - i / 2,
          scale: PILE_CARD_SCALE,
          duration: 300,
        }).once('complete', () => res());
      }));
      card.setDepth(i);
    })
    return Promise.all(promises);
  }
}