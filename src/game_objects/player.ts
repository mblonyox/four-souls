import { Scene } from "phaser";
import { PlayerState } from "../game/state";
import Hand from "./hand";
import Items from "./items";
import Souls from "./souls";

export default class Player {
  hand: Hand;
  items: Items;
  souls: Souls;

  constructor(
    public scene: Scene,
    x: number = 0,
    y: number = 0,
    isRotated: boolean = false,
    color: number = 0xffffff,
    isHidden: boolean = false
  ) {
    this.hand = new Hand(scene, x, y + 240* (isRotated ? -1 : 1), isRotated, color, isHidden);
    this.items = new Items(scene, x, y, isRotated, color);
    this.souls = new Souls(scene, x + 400 * (isRotated ? -1 : 1), y, isRotated, color);
  }

  update(state: PlayerState) {
    this.hand.update(state.hand);
    this.items.update(state.items);
    this.souls.update(state.souls);
  }
}
