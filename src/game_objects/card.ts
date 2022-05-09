import { GameObjects, Scene } from "phaser";

export enum CardType {
  Bonus = "bonus",
  Char = "char",
  Eternal = "eternal",
  Loot = "loot",
  Monster = "monster",
  Treasure = "treasure",
}

export const UNKNOWN_CARD = "unknown";

export const CARD_WIDTH = 500;
export const CARD_HEIGHT = 693;

export default class Card extends GameObjects.Image {
  isFaceUp: boolean = false;
  isTapped: boolean = false;
  private lazyLoaded: boolean = false;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    private back: CardType,
    private face: string = UNKNOWN_CARD
  ) {
    super(scene, x, y, back);
    scene.add.existing(this);
    this.displayWidth = CARD_WIDTH;
    this.displayHeight = CARD_HEIGHT;
  }

  static preloadCardBacks(scene: Scene) {
    Object.values(CardType).forEach((type) =>
      scene.load.image(type, `/assets/images/backs/${type}Back.png`)
    );
    scene.load.image(UNKNOWN_CARD, `/assets/images/${UNKNOWN_CARD}.png`);
  }

  setTexture(key: string, frame?: string | number): this {
    if (this.lazyLoaded || key in CardType || key == UNKNOWN_CARD) {
      super.setTexture(key, frame);
    } else {
      this.lazyLoaded = true;
      super.setTexture(UNKNOWN_CARD, frame);
      this.scene.load
        .image(key, `/assets/images/${key}.png`)
        .once("complete", () => this.setTexture(key, frame))
        .start();
    }
    return this;
  }

  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      duration: 150,
      yoyo: true,
      onYoyo: () => {
        this.isFaceUp = !this.isFaceUp;
        this.setTexture(this.isFaceUp ? this.face : this.back);
      },
    });
  }

  tap() {
    this.scene.tweens.add({
      targets: this,
      rotation: Math.PI / 4,
      duration: 300,
      onComplete: () => (this.isTapped = true),
    });
  }

  untap() {
    this.scene.tweens.add({
      targets: this,
      rotation: 0,
      duration: 300,
      onComplete: () => (this.isTapped = false),
    });
  }
}
