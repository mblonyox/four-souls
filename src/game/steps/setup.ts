import { Chance } from "chance";
import {
  base_char,
  base_char_data,
  base_none_monster_monster_cards,
} from "../../data/cards";
import { StepFunction } from "../steps";

export const DECK_SLOT_SETUP_STEP = "deckslotsetup";
export const CHAR_SELECT_SETUP_STEP = "charselectsetup";
export const ETERNAL_SETUP_STEP = "eternalsetup";
export const EDEN_ETERNAL_SETUP_STEP = "edeneternalsetup";

const steps: { [s: string]: StepFunction } = {
  [DECK_SLOT_SETUP_STEP]: (g) => {
    const t1 = g.treasureDeck.pop()!;
    const t2 = g.treasureDeck.pop()!;
    t1.isFaceUp = true;
    t2.isFaceUp = true;
    g.treasureSlot[0][0] = t1;
    g.treasureSlot[1][0] = t2;
    let m1;
    while (true) {
      m1 = g.monsterDeck.pop()!;
      if (base_none_monster_monster_cards.includes(m1.name)) {
        g.monsterDeck.unshift(m1);
      } else {
        break;
      }
    }
    let m2;
    while (true) {
      m2 = g.monsterDeck.pop()!;
      if (base_none_monster_monster_cards.includes(m2.name)) {
        g.monsterDeck.unshift(m2);
      } else {
        break;
      }
    }
    m1.isFaceUp = true;
    m2.isFaceUp = true;
    g.monsterSlot[0][0] = m1;
    g.monsterSlot[1][0] = m2;
    g.stepQueue.push({ name: CHAR_SELECT_SETUP_STEP });
    return g;
  },
  [CHAR_SELECT_SETUP_STEP]: (g) => {
    const chance = new Chance(g.randomSeed);
    const chars = chance.shuffle(base_char);
    Object.values(g.playerStates).forEach((ps) => {
      ps.items.push({ name: chars.pop()!, isTapped: true, isFaceUp: true });
    });
    g.randomSeed = chance.string();
    g.stepQueue.push({ name: ETERNAL_SETUP_STEP });
    return g;
  },
  [ETERNAL_SETUP_STEP]: (g) => {
    Object.entries(g.playerStates).forEach(([p, s]) => {
      const char = s.items[0].name;
      const eternal = (base_char_data as any)[char]?.eternal;
      if (!eternal) {
        g.stepQueue.push({
          name: EDEN_ETERNAL_SETUP_STEP,
          payload: { player: p },
        });
      } else {
        s.items.push({ name: eternal, isFaceUp: true, isTapped: false });
      }
    });
    return g;
  },
  [EDEN_ETERNAL_SETUP_STEP]: (g) => {
    return g;
  },
};
export default steps;
