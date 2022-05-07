import { GameObjects, Scene } from "phaser";
import Card from "./card";

export class Pile extends GameObjects.Container {
  constructor(scene: Scene, x: number, y: number, children: Card[]) {
    super(scene, x, y, children);
  }
}