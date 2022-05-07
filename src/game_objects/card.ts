import { GameObjects, Scene, Tweens } from "phaser";

export enum CARD_BACKS {
  BONUS_BACK = 'bonusBack',
  CHAR_BACK = 'charBack',
  ETERNAL_BACK = 'eternalBack',
  LOOT_BACK = 'lootBack',
  MONSTER_BACK = 'monsterBack',
  TREASURE_BACK = 'treasureBack'
}

export const UNKNOWN_CARD = 'unknown';

export const CARD_WIDTH = 500;
export const CARD_HEIGHT = 693;

export default class Card extends GameObjects.Image {
  isFaceUp: boolean = false;
  isTapped: boolean = false;
  private flipTween: Tweens.Tween;
  private tapTween: Tweens.Tween;
  private untapTween: Tweens.Tween;
  private lazyLoaded: boolean = false;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    private back: CARD_BACKS,
    private face: string = UNKNOWN_CARD,
  ) {
    super(scene, x, y, back);
    this.displayWidth = CARD_WIDTH;
    this.displayHeight = CARD_HEIGHT;
    this.flipTween = this.scene.tweens.create({
      targets: this,
      scaleX: 0,
      duration: 150,
      yoyo: true,
      onYoyo: () => {
        this.isFaceUp = !this.isFaceUp;
        this.setTexture(this.isFaceUp ? this.face : this.back);
      }
    });
    this.tapTween = this.scene.tweens.create({
      targets: this,
      rotation: Math.PI / 4,
      duration: 300,
      onComplete: () => this.isTapped = true
    })
    this.untapTween = this.scene.tweens.create({
      targets: this,
      rotation: 0,
      duration: 300,
      onComplete: () => this.isTapped = false
    })
  }

  static preloadCardBacks(scene: Scene) {
    Object.values(CARD_BACKS).forEach(back => scene.load.image(back, `/assets/images/backs/${back}.png`));
    scene.load.image(UNKNOWN_CARD, `/assets/images/${UNKNOWN_CARD}.png`);
  }

  setTexture(key: string, frame?: string | number): this {
    if (!(this.lazyLoaded || key in CARD_BACKS || key == UNKNOWN_CARD)) {
      this.lazyLoaded = true;
      this.scene.load.image(key, `/assets/images/${key}.png`);
      this.scene.load.once('complete', () => this.setTexture(key, frame));
      this.scene.load.start();
    }
    super.setTexture(key, frame);
    return this;
  }

  flip() {
    this.flipTween.play();
  }

  tap() {
    this.tapTween.play();
  }

  untap() {
    this.untapTween.play();
  }
}