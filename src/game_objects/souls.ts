import { GameObjects, Scene } from "phaser";
import { CardData } from "../game/state";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

export default class Souls {
  private readonly margin: number = 5;
  private readonly padding: number = 5;
  private readonly radius: number = 5;
  private soulsArea: GameObjects.Graphics;

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public isRotated: boolean = false,
    public color: number = 0xffffff,
    public cardScale: number = 0.1,
    public cards: Card[] = []
  ) {
    this.soulsArea = this.drawItemsArea();
  }

  private get soulWidth(): number {
    return CARD_HEIGHT * this.cardScale + (this.margin + this.padding) * 2;
  }

  private get soulHeight(): number {
    return CARD_WIDTH * this.cardScale + (this.margin + this.padding) * 2;
  }

  private drawItemsArea(): GameObjects.Graphics {
    const areaWidth = this.soulWidth;
    const areaHeight = this.soulHeight * 4;
    const graphics = this.scene.add.graphics();
    graphics
      .setPosition(this.x, this.y)
      .lineStyle(2, this.color)
      .strokeRoundedRect(
        -areaWidth / 2,
        -areaHeight / 2,
        areaWidth,
        areaHeight,
        this.radius
      );
    const y = this.y - (this.soulHeight * (4 - 1)) / 2;
    for (let i = 0; i < 4; i++) {
      this.scene.add.graphics()
        .setPosition(this.x, y + i * this.soulHeight)
        .strokeRoundedRect(
          -this.soulWidth / 2 + this.margin,
          -this.soulHeight / 2 + this.margin,
          this.soulWidth - this.margin*2,
          this.soulHeight - this.margin*2,
          this.radius
        );
    }
    return graphics;
  }

  public update(state: CardData[]): Promise<void> {
    this.cards = state.map(({ name }) => {
      const card = this.scene.children.getByName(name) as Card;
      card.isFaceUp = true;
      card.isTapped = true;
      return card;
    });
    return this.arrange();
  }

  public arrange(): Promise<void> {
    const y = this.y - (this.soulHeight * (4 - 1)) / 2;
    const promises = this.cards.map((card, i) => {
      return new Promise<void>((res) => {
        this.scene.add
          .tween({
            targets: card,
            x: this.x,
            y: y + i * this.soulHeight,
            scale: this.cardScale,
            duration: 300,
          })
          .once("complete", () => res());
      });
    });
    return Promise.all(promises).then(() => {});
  }

  public destroy(fromScene?: boolean) {
    this.soulsArea.destroy(fromScene);
  }
}
