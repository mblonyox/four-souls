import { GameState, PlayerID } from "./state";
import { Chance } from "chance";

export const LOOT_STEP = "loot";
export const RESET_LOOT_DECK_STEP = "reset-loot-deck";
export const GAIN_COIN_STEP = "gain-coin";

export const steps: { [s: string]: (g: GameState, payload: any) => GameState } =
  {
    LOOT_STEP: (g, p: { players: PlayerID[]; value: number }) => {
      if (g.lootDeck.length <= p.players.length * p.value) {
        g.stepQueue.unshift(
          {
            name: RESET_LOOT_DECK_STEP,
          },
          {
            name: LOOT_STEP,
            payload: p,
          }
        );
      } else {
        p.players.forEach((id) => {
          for (let i = 0; i < p.value; i++) {
            const card = g.lootDeck.pop()!;
            g.playerStates[id]!.hand.push(card);
          }
        });
      }
      return g;
    },
    RESET_LOOT_DECK_STEP: (g) => {
      const discarded = g.lootDiscard;
      g.lootDiscard = [];
      discarded.forEach((card) => {
        card.isFaceUp = false;
        card.isTapped = false;
      });
      const chance = new Chance(g.randomSeed);
      g.lootDeck.unshift(...chance.shuffle(discarded));
      g.randomSeed = chance.string();
      return g;
    },
    GAIN_COIN_STEP: (g, p: { players: PlayerID[]; value: number }) => {
      p.players.forEach((id) => {
        g.playerStates[id]!.coin += p.value;
      });
      return g;
    },
  };
