import { GameObjects, Scene } from "phaser";
import { CardData } from "../game/state";
import Card, { CARD_HEIGHT } from "./card";

export default class Hand {
  private handArea: GameObjects.Graphics;

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public isRotated: boolean = false,
    public color: number = 0xffffff,
    public isHidden: boolean = false,
    public width: number = 540,
    public cardScale: number = 0.3,
    public cards: Card[] = []
  ) {
    this.handArea = this.drawHandArea();
  }

  private drawHandArea() {
    const height = (CARD_HEIGHT * this.cardScale) / 2;
    return this.scene.add
      .graphics()
      .setPosition(this.x, this.y)
      .fillStyle(this.color, 0.2)
      .fillRoundedRect(-this.width / 2, -height / 2, this.width, height, 20);
  }

  public update(state: CardData[]) {
    this.cards = state.map(({ name }) => {
      const card = this.scene.children.getByName(name) as Card;
      card.isFaceUp = !this.isHidden;
      card.isTapped = false;
      return card;
    });
    return this.arrange();
  }

  public arrange(): Promise<void> {
    const n = this.cards.length;
    const promises = this.cards.map((card, i) => {
      card.setDepth(i);
      return new Promise<void>((res) => {
        this.scene.add
          .tween({
            targets: card,
            x:
              this.x -
              (this.width / 2 + (this.width * (i + 1)) / (n + 1)) *
                (this.isRotated ? -1 : 1),
            y: this.y,
            scale: this.cardScale,
            duration: 300,
          })
          .once("complete", () => res());
      });
    });
    return Promise.all(promises).then(() => {});
  }

  public destroy(fromScene?: boolean) {
    this.handArea.destroy(fromScene);
  }
}
