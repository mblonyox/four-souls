import { Scene } from "phaser";
import gameConfig from "../config";
import { base_loot, base_monsters, base_treasure } from "../data/cards";
import Card, { CARD_BACKS } from "../game_objects/card";
import Deck from "../game_objects/deck";

export default class TableScene extends Scene {
  width: number;
  height: number;
  lootDeck?: Deck;
  treasureDeck?: Deck;
  monsterDeck?: Deck;

  constructor() {
    super({ key: 'table-scene' });
    this.width = gameConfig.scale?.width as number;
    this.height = gameConfig.scale?.height as number;
  }

  preload() {
    this.load.image('playmat', '/assets/images/playmat.jpg');
    Card.preloadCardBacks(this);
  }

  create() {
    const playmat = this.add.image(0, 0, 'playmat');
    playmat.setOrigin(0, 0);
    playmat.displayWidth = this.width;
    playmat.displayHeight = this.height;

    this.createLootDeck();
    this.createTreasureDeck();
    this.createMonsterDeck();

    this.input.on('pointerdown', () => this.lootDeck?.shuffle())
  }

  createLootDeck() {
    this.lootDeck = new Deck(this, this.width/2, this.height/2, []);
    this.add.existing(this.lootDeck);
    base_loot.forEach(name => {
      const card = new Card(this, 0, 0, CARD_BACKS.LOOT_BACK, `base/loot/${name}`);
      this.add.existing(card);
      this.lootDeck?.add(card);
    });
  }
  createTreasureDeck() {
    this.treasureDeck = new Deck(this, 100, this.height/2, []);
    this.add.existing(this.treasureDeck);
    base_treasure.forEach(name => {
      const card = new Card(this, 0, 0, CARD_BACKS.TREASURE_BACK, `base/treasure/${name}`);
      this.add.existing(card);
      this.treasureDeck?.add(card);
    });
  }
  createMonsterDeck() {
    this.monsterDeck = new Deck(this, this.width - 100, this.height/2, []);
    this.add.existing(this.monsterDeck);
    base_monsters.forEach(name => {
      const card = new Card(this, 0, 0, CARD_BACKS.MONSTER_BACK, `base/monsters/${name}`);
      this.add.existing(card);
      this.monsterDeck?.add(card);
    });
  }
}