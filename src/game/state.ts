import { Chance } from "chance";
import { base_loot, base_monsters, base_treasure } from "../data/cards";

export type PlayerID = "p1" | "p2" | "p3" | "p4";

export interface GameState {
  turn: number;
  activePlayer?: PlayerID;
  priority?: PlayerID;
  playerStates: {
    [p in PlayerID]?: PlayerState;
  };
  bonusSouls: CardData[];
  lootDeck: CardData[];
  lootDiscard: CardData[];
  monsterDeck: CardData[];
  monsterSlot: CardData[][];
  monsterDiscard: CardData[];
  treasureDeck: CardData[];
  treasureSlot: CardData[][];
  treasureDiscard: CardData[];
  randomSeed: string;
  stepQueue: StepData[];
  effectStack: EffectData[];
  triggerEffects: {
    [e: string]: EffectData;
  };
}

export interface PlayerState {
  userUid: string;
  userName: string;
  health: number;
  maxHealth: number;
  damage: number;
  coin: number;
  items: CardData[];
  souls: CardData[];
  hand: CardData[];
  actions: {
    playing: number;
    purchase: number;
    attack: number;
  };
}

export interface CardData {
  id?: string;
  name: string;
  isFaceUp?: boolean;
  isTapped?: boolean;
  extras?: { [k: string]: any };
}

export interface StepData {
  id?: string;
  name: string;
  payload?: any;
}

export interface EffectData {
  id?: string;
  name: string;
  resolve: StepData[];
  cancelled: boolean;
  payload?: any;
}

export function initializeState(players: {
  [p in PlayerID]?: { userUid: string; userName: string };
}): GameState {
  const chance = new Chance();
  const playerStates: {
    [p in PlayerID]?: PlayerState;
  } = {};
  Object.entries(players).forEach(([p, { userUid, userName }]) => {
    playerStates[p as PlayerID] = {
      userUid,
      userName,
      health: 0,
      maxHealth: 0,
      damage: 0,
      coin: 0,
      items: [],
      souls: [],
      hand: [],
      actions: {
        attack: 0,
        playing: 0,
        purchase: 0,
      },
    };
  });
  const randomSeed = chance.string();
  return {
    turn: 0,
    playerStates,
    bonusSouls: [],
    lootDeck: chance.shuffle(
      base_loot.map((name) => ({ id: chance.string(), name }))
    ),
    lootDiscard: [],
    treasureDeck: chance.shuffle(
      base_treasure.map((name) => ({ id: chance.string(), name }))
    ),
    treasureDiscard: [],
    treasureSlot: [[]],
    monsterDeck: chance.shuffle(
      base_monsters.map((name) => ({ id: chance.string(), name }))
    ),
    monsterDiscard: [],
    monsterSlot: [[]],
    effectStack: [],
    stepQueue: [],
    triggerEffects: {},
    randomSeed,
  };
}
