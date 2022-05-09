import { GameState, PlayerID } from "./state";
import clone from "just-clone";
import { Chance } from "chance";

export const LOOT_STEP = "loot";
export const RESET_LOOT_DECK_STEP = "reset-loot-deck";
export const GAIN_COIN_STEP = "gain-coin";

export const steps: { [s: string]: (g: GameState, payload: any) => GameState } =
  {
    LOOT_STEP: (g, p: { players: PlayerID[]; value: number }) => {
      const result = clone(g);
      if (result.lootDeck.length <= p.players.length * p.value) {
        result.stepQueue.unshift({
          id: RESET_LOOT_DECK_STEP,
        });
      } else {
        p.players.forEach((id) => {
          for (let i = 0; i < p.value; i++) {
            const card = result.lootDeck.pop()!;
            result.playerStates[id].hand.push(card);
          }
        });
        result.stepQueue.shift();
      }
      return result;
    },
    RESET_LOOT_DECK_STEP: (g) => {
      const result = clone(g);
      const discarded = result.lootDiscard;
      result.lootDiscard = [];
      discarded.forEach((card) => {
        card.isFaceUp = false;
        card.isTapped = false;
      });
      const chance = new Chance(result.randomSeed);
      result.lootDeck.unshift(...chance.shuffle(discarded));
      result.randomSeed = chance.string();
      result.stepQueue.shift();
      return result;
    },
    GAIN_COIN_STEP: (g, p: { players: PlayerID[]; value: number }) => {
      const result = clone(g);
      p.players.forEach((id) => {
        result.playerStates[id].coin += p.value;
      });
      result.stepQueue.shift();
      return result;
    },
  };
