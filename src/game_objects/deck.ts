import { GameObjects, Scene } from "phaser";
import Card, { CARD_WIDTH } from "./card";

const DECK_CARD_SCALE = 1 / 5;

export default class Deck extends GameObjects.Group {

  private isShuffling: boolean = false;

  constructor(scene: Scene, public x: number, public y: number, children?: Card[]) {
    super(scene, children);
    this.arrange();
  }

  add(child: Card, addToScene?: boolean): this {
    super.add(child, addToScene);
    this.arrange();
    return this;
  }

  public arrange() {
    this.children.iterate((c, i) => {
      const card = c as Card;
      card.setDepth(i);
      card.setPosition(this.x, this.y);
      card.scale = DECK_CARD_SCALE;
      card.y -= i / 2;
    })
  }

  public shuffle(): this {
    super.shuffle();
    if (!this.isShuffling) {
      this.isShuffling = true;
      const promises: Promise<void>[] = [];
      this.children.iterate((c, _i) => {
        promises.push(new Promise<void>((res) => {
          this.scene.tweens.add({
            targets: c,
            x: (c as Card).x + (Math.random() - 0.5) * CARD_WIDTH * DECK_CARD_SCALE,
            yoyo: true,
            repeat: 5,
            duration: 30
          }).once("complete", () => res());
        }));
      })
      Promise.all(promises).then(() => { this.isShuffling = false; this.arrange(); });
    }
    return this;
  }
}