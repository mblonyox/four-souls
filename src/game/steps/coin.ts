import { PlayerID } from "../state";
import { StepFunction } from "../steps";

export const GAIN_COIN_STEP = "gaincoin";

const steps: { [s: string]: StepFunction } = {
  [GAIN_COIN_STEP]: (g, p: { players: PlayerID[]; value: number }) => {
    p.players.forEach((id) => {
      g.playerStates[id]!.coin += p.value;
    });
    return g;
  },
};
export default steps;
