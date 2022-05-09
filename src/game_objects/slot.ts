import { Scene } from "phaser";
import { CARD_WIDTH } from "./card";
import Pile, { PILE_CARD_SCALE } from "./pile";

export default class Slot {
  piles: Pile[] = [];

  constructor(
    public scene: Scene,
    public x: number = 0,
    public y: number = 0,
    public color: number = 0xffffff,
    public size: number = 2,
    public alignRight: boolean = false
  ) {
    for (let i = 0; i < size; i++) {
      const dx = i * (CARD_WIDTH * PILE_CARD_SCALE + 20);
      const pile = new Pile(
        scene,
        this.x + (alignRight ? -dx: dx) ,
        this.y,
        color
      );
      this.piles.push(pile);
    }
  }
}
