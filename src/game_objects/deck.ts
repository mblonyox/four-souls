import { GameObjects, Scene } from "phaser";
import { CardData } from "../game/state";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

export default class Deck {
  private isShuffling: boolean = false;
  private counterText: GameObjects.Text;
  private deckArea: GameObjects.Graphics;

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0,
    public cardScale: number = 0.2,
    public cards: Card[] = []
  ) {
    this.deckArea = this.drawDeckArea();
    this.counterText = this.drawCounterText();
  }

  private drawCounterText(): GameObjects.Text {
    return this.scene.add
      .text(this.x, this.y, (this.cards.length ?? 0).toString(), {
        fontFamily: "EdMundMcMillen",
        fontSize: "2rem",
      })
      .setOrigin(0.5, 0.5);
  }

  private drawDeckArea(): GameObjects.Graphics {
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

  public update(deckState: CardData[]): Promise<void> {
    this.cards = deckState.map(({ name }) => {
      const card = this.scene.children.getByName(name) as Card;
      card.isFaceUp = false;
      card.isTapped = false;
      return card;
    });
    return this.arrange();
  }

  public arrange(): Promise<void> {
    const total = this.cards.length;
    this.counterText
      .setText(total.toString())
      .setDepth(total)
      .setY(this.y - total / 2);
    const promises = this.cards.map((card, i) => {
      card.setDepth(i);
      return new Promise<void>((res) => {
        this.scene.tweens
          .add({
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

  public shuffle(): Promise<void> {
    if (!this.isShuffling) {
      this.isShuffling = true;
      const promises = this.cards.map((card, _i) => {
        return new Promise<void>((res) => {
          this.scene.tweens
            .add({
              targets: card,
              x: card.x + (Math.random() - 0.5) * CARD_WIDTH * this.cardScale,
              yoyo: true,
              repeat: 5,
              duration: 30,
            })
            .once("complete", () => res());
        });
      });
      return Promise.all(promises).then(() => {
        this.isShuffling = false;
        this.arrange();
      });
    }
    return Promise.resolve();
  }

  public destroy(fromScene?: boolean) {
    this.counterText.destroy(fromScene);
    this.deckArea.destroy(fromScene);
  }
}
