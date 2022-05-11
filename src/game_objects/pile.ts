import { GameObjects, Scene } from "phaser";
import { CardData } from "../game/state";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

export default class Pile {
  private pileArea: GameObjects.Graphics;

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0xffffff,
    public cardScale: number = 0.2,
    public cards: Card[] = []
  ) {
    this.pileArea = this.drawPileArea();
  }

  private drawPileArea(): GameObjects.Graphics {
    const padding = 5;
    const width = CARD_WIDTH * this.cardScale;
    const height = CARD_HEIGHT * this.cardScale;
    return this.scene.add
      .graphics()
      .setPosition(this.x, this.y)
      .lineStyle(2, this.color)
      .strokeRoundedRect(
        -width / 2 - padding,
        -height / 2 - padding,
        width + padding * 2,
        height + padding * 2,
        padding * 2
      );
  }

  public update(state: CardData[]): Promise<void> {
    this.cards = state.map(({ name, isFaceUp, isTapped }) => {
      const card = this.scene.children.getByName(name) as Card;
      card.isFaceUp = isFaceUp ?? false;
      card.isTapped = isTapped ?? false;
      return card;
    });
    return this.arrange();
  }

  public arrange(): Promise<void> {
    const promises = this.cards.map((card, i) => {
      card.setDepth(i);
      return new Promise<void>((res) => {
        this.scene.add
          .tween({
            targets: card,
            x: this.x,
            y: this.y - i / 2,
            scale: this.cardScale,
            duration: 300,
          })
          .once("complete", () => res());
      });
    });
    return Promise.all(promises).then(() => {});
  }

  public destroy(fromScene?: boolean) {
    this.pileArea.destroy(fromScene);
  }
}
