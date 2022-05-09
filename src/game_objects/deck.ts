import { GameObjects, Scene } from "phaser";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

const DECK_CARD_SCALE = 1 / 5;

export default class Deck extends GameObjects.Group {
  text: GameObjects.Text;

  private isShuffling: boolean = false;

  constructor(
    scene: Scene,
    public x: number,
    public y: number,
    public color: number,
    children?: Card[]
  ) {
    super(scene, children);
    scene.add.existing(this);
    this.drawDeckArea();
    this.text = scene.add
      .text(x, y, (children?.length ?? 0).toString(), {
        fontFamily: "EdMundMcMillen",
        fontSize: "2rem",
      })
      .setOrigin(0.5, 0.5);
  }

  private drawDeckArea() {
    const padding = 5;
    const width = CARD_WIDTH * DECK_CARD_SCALE;
    const height = CARD_HEIGHT * DECK_CARD_SCALE;
    this.scene.add
      .graphics()
      .setPosition(this.x, this.y)
      .lineStyle(2, this.color)
      .strokeRoundedRect(
        -width / 2 - padding,
        -height / 2 - padding,
        width + padding * 2,
        height + padding * 2,
        padding * 2
      )
      .fillStyle(this.color)
      .fillRoundedRect(
        -width / 2 + padding,
        -height / 2 + padding,
        width - padding * 2,
        height - padding * 2,
        padding * 2
      );
  }

  addMultiple(children: Card[], addToScene?: boolean): this {
    super.addMultiple(children, addToScene);
    this.arrange();
    return this;
  }

  removeMultiple(
    children: Card[],
    removeFromScene?: boolean,
    destroyChild?: boolean
  ): this {
    children.forEach((child) => {
      super.remove(child, removeFromScene, destroyChild);
    });
    this.arrange();
    return this;
  }

  arrange() {
    const total = this.children.size;
    this.text
      .setText(total.toString())
      .setDepth(total)
      .setY(this.y - total / 2);
    const promises: Promise<void>[] = [];
    this.children.iterate((c, i) => {
      const card = c as Card;
      promises.push(
        new Promise<void>((res) => {
          this.scene.tweens
            .add({
              targets: card,
              x: this.x,
              y: this.y - i / 2,
              scale: DECK_CARD_SCALE,
              duration: 300,
            })
            .once("complete", () => res());
        })
      );
      card.setDepth(i);
    });
    return Promise.all(promises);
  }

  playShuffle() {
    if (!this.isShuffling) {
      this.isShuffling = true;
      const promises: Promise<void>[] = [];
      this.children.iterate((c, _i) => {
        promises.push(
          new Promise<void>((res) => {
            this.scene.tweens
              .add({
                targets: c,
                x:
                  (c as Card).x +
                  (Math.random() - 0.5) * CARD_WIDTH * DECK_CARD_SCALE,
                yoyo: true,
                repeat: 5,
                duration: 30,
              })
              .once("complete", () => res());
          })
        );
      });
      return Promise.all(promises).then(() => {
        this.isShuffling = false;
        this.arrange();
      });
    }
    return Promise.resolve();
  }
}
