export type PlayerID = "p1" | "p2" | "p3" | "p4";
export type CardId = string;
export type EventId = string;

export interface GameState {
  turn: number,
  activePlayer: PlayerID,
  priority: PlayerID,
  playerStates: {
    [p in PlayerID]: PlayerState
  },
  bonusSouls: CardState[],
  lootDeck: CardState[],
  lootDiscard: CardState[],
  monsterDeck: CardState[],
  monsterSlot: CardState[][],
  monsterDiscard: CardState[],
  treasureDeck: CardState[],
  treasureSlot: CardState[][],
  treasureDiscard: CardState[],
  randomSeed: string;
  stepQueue: StepData[],
  effectStack: EffectData[],
  triggerEffects: {
    [e: EventId]: EffectData
  }
}

export interface PlayerState {
  health: number,
  maxHealth: number,
  damage: number,
  coin: number,
  items: CardState[],
  souls: CardState[],
  hand: CardState[],
  actions: {
    playing: number,
    purchase: number,
    attack: number,
  }
}

export interface CardState {
  id: CardId,
  isFaceUp?: boolean,
  isTapped?: boolean,
  extras?: {[k: string]: any}
}

export interface StepData {
  id: string,
  payload?: any
}

export interface EffectData {
  id: string,
  resolve: StepData[],
  payload?: any
}