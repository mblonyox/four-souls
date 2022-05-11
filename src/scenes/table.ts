import { Chance } from "chance";
import { ref } from "firebase/database";
import { GameObjects, Scene } from "phaser";
import { VIEW_HEIGHT, VIEW_WIDTH } from "../config";
import { base_loot, base_monsters, base_treasure } from "../data/cards";
import { db } from "../firebase";
import FourSoulsClient from "../game/client";
import { GameState } from "../game/state";
import Card, { CardType } from "../game_objects/card";
import Deck from "../game_objects/deck";
import Pile from "../game_objects/pile";
import Player from "../game_objects/player";
import Slot from "../game_objects/slot";
export default class TableScene extends Scene {
  width: number;
  height: number;

  treasureDeck?: Deck;
  treasureDiscard?: Pile;
  treasureSlot?: Slot;
  lootDeck?: Deck;
  lootDiscard?: Pile;
  monsterDeck?: Deck;
  monsterDiscard?: Pile;
  monsterSlot?: Slot;
  bonusSoul?: GameObjects.Group;
  p1?: Player;
  p2?: Player;
  p3?: Player;
  p4?: Player;

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
    const gameClient = new FourSoulsClient(ref(db, "/game/test/" + new Chance().name()));
    gameClient.isHost = true;
    gameClient.user_uid = this.registry.get("user_uid");

    gameClient
      .init({
        p1: { userName: "Player1", userUid: "uid1" },
        p2: { userName: "Player1", userUid: "uid1" },
      })
      .start();

    gameClient.on("update", (state: GameState) => {
      this.lootDeck?.update(state.lootDeck);
      this.lootDiscard?.update(state.lootDiscard);
      this.treasureDeck?.update(state.treasureDeck);
      this.treasureDiscard?.update(state.treasureDiscard);
      this.treasureSlot?.update(state.treasureSlot);
      this.monsterDeck?.update(state.monsterDeck);
      this.monsterDiscard?.update(state.monsterDiscard);
      this.monsterSlot?.update(state.monsterSlot);
      if (state.playerStates.p1) this.p1?.update(state.playerStates.p1);
      if (state.playerStates.p2) this.p2?.update(state.playerStates.p2);
      if (state.playerStates.p3) this.p3?.update(state.playerStates.p3);
      if (state.playerStates.p4) this.p4?.update(state.playerStates.p4);
    });

    const playmat = this.add.image(0, 0, "playmat");
    playmat.setOrigin(0, 0);
    playmat.displayWidth = this.width;
    playmat.displayHeight = this.height;

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
      true
    );
    this.p1 = new Player(
      this,
      (this.width * 3) / 4,
      (this.height * 3) / 4,
      false,
      0xff0000,
      false
    );
    this.p2 = new Player(
      this,
      (this.width * 1) / 4,
      (this.height * 3) / 4,
      false,
      0x0000ff,
      true
    );
    this.p3 = new Player(
      this,
      (this.width * 1) / 4,
      (this.height * 1) / 4,
      true,
      0x00ff00,
      true
    );
    this.p4 = new Player(
      this,
      (this.width * 3) / 4,
      (this.height * 1) / 4,
      true,
      0xffff00,
      true
    );

    this.createAllCards();
  }

  createAllCards() {
    base_treasure.forEach((name) => {
      const card = new Card(
        this,
        this.width / 2,
        -500,
        CardType.Treasure,
        `base/treasure/${name}`
      );
      card.name = name;
    });
    base_loot.forEach((name) => {
      const card = new Card(
        this,
        this.width / 2,
        -500,
        CardType.Loot,
        `base/loot/${name}`
      );
      card.name = name;
    });
    base_monsters.forEach((name) => {
      const card = new Card(
        this,
        this.width / 2,
        -500,
        CardType.Monster,
        `base/monsters/${name}`
      );
      card.name = name;
    });
  }
}
