import { GameState } from "./state";
import setup from "./steps/setup";
import loot from "./steps/loot";
import coin from "./steps/coin";

export type StepFunction = (g: GameState, payload: any) => GameState;

export const steps: { [s: string]: StepFunction } = {
  ...setup,
  ...loot,
  ...coin,
};

export * from "./steps/setup";
export * from "./steps/loot";
export * from "./steps/coin";
