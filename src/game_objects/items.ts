import { GameObjects, Scene } from "phaser";
import { CardData } from "../game/state";
import Card, { CARD_HEIGHT, CARD_WIDTH } from "./card";

export default class Items {
  private readonly margin: number = 5;
  private readonly padding: number = 5;
  private readonly radius: number = 5;
  private itemsArea: GameObjects.Graphics;

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public isRotated: boolean = false,
    public color: number = 0xffffff,
    public columns: number = 5,
    public rows: number = 2,
    public cardScale: number = 0.2,
    public cards: Card[] = []
  ) {
    this.itemsArea = this.drawItemsArea();
  }

  private get itemWidth(): number {
    return CARD_WIDTH * this.cardScale + (this.margin + this.padding) * 2;
  }

  private get itemHeight(): number {
    return CARD_HEIGHT * this.cardScale + (this.margin + this.padding) * 2;
  }

  private drawItemsArea(): GameObjects.Graphics {
    const areaWidth = this.itemWidth * this.columns;
    const areaHeight = this.itemHeight * this.rows;
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
    const x = this.x - (this.itemWidth * (this.columns - 1)) / 2 * (this.isRotated ? -1 : 1);
    const y = this.y - (this.itemHeight * (this.rows - 1)) / 2 * (this.isRotated ? -1 : 1);
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.scene.add.graphics().setPosition(
          x + i * this.itemWidth * (this.isRotated ? -1 : 1),
          y + j * this.itemHeight * (this.isRotated ? -1 : 1)
        ).strokeRoundedRect(
          -this.itemWidth/2 + this.margin,
          -this.itemHeight/2 + this.margin,
          this.itemWidth - this.margin*2,
          this.itemHeight - this.margin*2,
          this.radius
        );
      }
    }
    return graphics;
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
    const x = this.x - (this.itemWidth * (this.columns - 1)) / 2;
    const y = this.y - (this.itemHeight * (this.rows - 1)) / 2;
    const promises = this.cards.map((card, i) => {
      return new Promise<void>((res) => {
        this.scene.add
          .tween({
            targets: card,
            x: x + (i % this.columns) * this.itemWidth,
            y: y + Math.floor(i / this.columns) * this.itemHeight,
            scale: this.cardScale,
            duration: 300,
          })
          .once("complete", () => res());
      });
    });
    return Promise.all(promises).then(() => {});
  }

  public destroy(fromScene?: boolean) {
    this.itemsArea.destroy(fromScene);
  }
}
