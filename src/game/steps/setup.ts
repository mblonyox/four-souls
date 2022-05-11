import { base_none_monster_monster_cards } from "../../data/cards";
import { StepFunction } from "../steps";

export const DECK_SLOT_SETUP_STEP = "deckslotsetup";

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
    return g;
  },
};
export default steps;
