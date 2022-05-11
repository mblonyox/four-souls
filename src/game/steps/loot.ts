import { Chance } from "chance";
import { PlayerID } from "../state";
import { StepFunction } from "../steps";

export const LOOT_STEP = "loot";
export const RESET_LOOT_DECK_STEP = "resetlootdeck";

const steps:  {[s: string]: StepFunction} = {
  [LOOT_STEP]: (g, p: { players: PlayerID[]; value: number }) => {
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
  [RESET_LOOT_DECK_STEP]: (g) => {
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
}
export default steps;