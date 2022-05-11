import { Scene } from "phaser";
import { CardData } from "../game/state";
import { CARD_WIDTH } from "./card";
import Pile from "./pile";

export default class Slot {
  piles: Pile[] = [];

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0xffffff,
    public rtl: boolean = false,
    public cardScale: number = 0.2,
    initialSize: number = 2
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.piles.push(this.createPile(i));
    }
  }

  private createPile(i: number) {
    const dx = i * (CARD_WIDTH * this.cardScale + 20);
    return new Pile(
      this.scene,
      this.x + (this.rtl ? -dx : dx),
      this.y,
      this.color,
      this.cardScale
    );
  }

  public update(state: CardData[][]): Promise<void> {
    while (state.length > this.piles.length) {
      this.piles.push(this.createPile(this.piles.length));
    }
    const promises = state.map((cards, i) => this.piles[i].update(cards));
    return Promise.all(promises).then(() => {});
  }
}
