import { GameObjects, Scene } from "phaser";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../config";
import { base_loot, base_monsters, base_treasure } from "../data/cards";
import Card, { CardType } from "../game_objects/card";
import Deck from "../game_objects/deck";
import Hand from "../game_objects/hand";
import Pile from "../game_objects/pile";
import Slot from "../game_objects/slot";
export default class TableScene extends Scene {
  width: number;
  height: number;

  allCards?: GameObjects.Group;

  treasureDeck?: Deck;
  treasureDiscard?: Pile;
  treasureSlot?: Slot;
  lootDeck?: Deck;
  lootDiscard?: Pile;
  monsterDeck?: Deck;
  monsterDiscard?: Pile;
  monsterSlot?: Slot;
  bonusSoul?: GameObjects.Group;
  p1Hand?: Hand;
  p2Hand?: Hand;
  p3Hand?: Hand;
  p4Hand?: Hand;
  p1Items?: GameObjects.Group;
  p2Items?: GameObjects.Group;
  p3Items?: GameObjects.Group;
  p4Items?: GameObjects.Group;
  p1Souls?: GameObjects.Group;
  p2Souls?: GameObjects.Group;
  p3Souls?: GameObjects.Group;
  p4Souls?: GameObjects.Group;

  constructor() {
    super({ key: "table-scene" });

    this.width = VIEW_WIDTH;
    this.height = VIEW_HEIGHT;
  }

  preload() {
    this.load.image("playmat", "/assets/images/playmat.jpg");
    Card.preloadCardBacks(this);
  }

  create() {
    const playmat = this.add.image(0, 0, "playmat");
    playmat.setOrigin(0, 0);
    playmat.displayWidth = this.width;
    playmat.displayHeight = this.height;

    this.allCards = this.add.group();

    this.treasureDeck = new Deck(this, 200, this.height / 2, 0xb78c3f);
    this.treasureDiscard = new Pile(this, 80, this.height / 2, 0xb78c3f);
    this.treasureSlot = new Slot(this, 320, this.height / 2, 0xb78c3f);
    this.lootDeck = new Deck(
      this,
      this.width / 2 - 60,
      this.height / 2 - 40,
      0x839c95
    );
    this.lootDiscard = new Pile(
      this,
      this.width / 2 + 60,
      this.height / 2 - 40,
      0x839c95
    );
    this.monsterDeck = new Deck(
      this,
      this.width - 200,
      this.height / 2,
      0x34312e
    );
    this.monsterDiscard = new Pile(
      this,
      this.width - 80,
      this.height / 2,
      0x34312e
    );
    this.monsterSlot = new Slot(
      this,
      this.width - 320,
      this.height / 2,
      0x34312e,
      2,
      true
    );
    this.p1Hand = new Hand(
      this,
      (this.width * 3) / 4,
      this.height - 30,
      0xff0000,
      false
    );
    this.p2Hand = new Hand(
      this,
      this.width / 4,
      this.height - 30,
      0x0000ff,
      true
    );
    this.p3Hand = new Hand(this, this.width / 4, 30, 0x00ff00, true);
    this.p4Hand = new Hand(this, (this.width * 3) / 4, 30, 0xffff00, true);
    this.p1Items = this.add.group();
    this.p2Items = this.add.group();
    this.p3Items = this.add.group();
    this.p4Items = this.add.group();
    this.p1Souls = this.add.group();
    this.p2Souls = this.add.group();
    this.p3Souls = this.add.group();
    this.p4Souls = this.add.group();

    this.createAllCards();
  }

  createAllCards() {
    this.treasureDeck?.addMultiple(
      base_treasure.map((name) => {
        const card = new Card(
          this,
          200,
          0,
          CardType.Treasure,
          `base/treasure/${name}`
        );
        card.name = name;
        this.allCards?.add(card);
        return card;
      })
    );
    this.lootDeck?.addMultiple(
      base_loot.map((name) => {
        const card = new Card(
          this,
          this.width / 2,
          0,
          CardType.Loot,
          `base/loot/${name}`
        );
        card.name = name;
        this.allCards?.add(card);
        return card;
      })
    );
    this.monsterDeck?.addMultiple(
      base_monsters.map((name) => {
        const card = new Card(
          this,
          this.width - 200,
          0,
          CardType.Monster,
          `base/monsters/${name}`
        );
        card.name = name;
        this.allCards?.add(card);
        return card;
      })
    );
    this.time.delayedCall(500, () => {
      this.treasureDeck
        ?.shuffle()
        .playShuffle()
        .then(() => {
          const t0 = this.treasureDeck?.getLastNth(0, true);
          const t1 = this.treasureDeck?.getLastNth(1, true);
          this.treasureDeck?.removeMultiple([t0, t1]);
          this.treasureSlot?.piles[0].addMultiple([t0]);
          this.treasureSlot?.piles[1].addMultiple([t1]);
          t0.flip();
          t1.flip();
        });
      this.lootDeck
        ?.shuffle()
        .playShuffle()
        .then(() => {
          [this.p1Hand, this.p2Hand, this.p3Hand, this.p4Hand].forEach(
            (hand) => {
              draw(this.lootDeck!, hand!);
              draw(this.lootDeck!, hand!);
              draw(this.lootDeck!, hand!);
            }
          );
        });
      this.monsterDeck
        ?.shuffle()
        .playShuffle()
        .then(() => {
          const m0 = this.monsterDeck?.getLastNth(0, true);
          const m1 = this.monsterDeck?.getLastNth(1, true);
          this.monsterDeck?.removeMultiple([m0, m1]);
          this.monsterSlot?.piles[0].addMultiple([m0]);
          this.monsterSlot?.piles[1].addMultiple([m1]);
          m0.flip();
          m1.flip();
        });
    });
    const draw = (deck: Deck, hand: Hand) => {
      const card = deck.getLast(true) as Card;
      if (card) {
        deck?.removeMultiple([card]);
        hand?.addMultiple([card]);
      }
    };
    const discard = (hand: Hand, pile: Pile) => {
      const card = hand.getFirstNth(
        Math.floor(Math.random() * hand.getLength()),
        true
      ) as Card;
      if (card) {
        hand?.removeMultiple([card]);
        pile?.addMultiple([card]);
      }
    };
    this.input.keyboard.on("keyup-ONE", () =>
      draw(this.lootDeck!, this.p1Hand!)
    );
    this.input.keyboard.on("keyup-TWO", () =>
      draw(this.lootDeck!, this.p2Hand!)
    );
    this.input.keyboard.on("keyup-THREE", () =>
      draw(this.lootDeck!, this.p3Hand!)
    );
    this.input.keyboard.on("keyup-FOUR", () =>
      draw(this.lootDeck!, this.p4Hand!)
    );
    this.input.keyboard.on("keyup-FIVE", () =>
      discard(this.p1Hand!, this.lootDiscard!)
    );
    this.input.keyboard.on("keyup-SIX", () =>
      discard(this.p2Hand!, this.lootDiscard!)
    );
    this.input.keyboard.on("keyup-SEVEN", () =>
      discard(this.p3Hand!, this.lootDiscard!)
    );
    this.input.keyboard.on("keyup-EIGHT", () =>
      discard(this.p4Hand!, this.lootDiscard!)
    );
  }
}
