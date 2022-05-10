import {
  DatabaseReference,
  onChildAdded,
  onValue,
  push,
  serverTimestamp,
  Unsubscribe,
} from "firebase/database";
import clone from "just-clone";
import { Events } from "phaser";
import { applyPatch, createPatch } from "symmetry";
import { GameState, initializeState, PlayerID } from "./state";
import { steps } from "./steps";

export default class FourSoulsClient extends Events.EventEmitter {
  private unsubscribeDb: Unsubscribe;
  private intervalId?: number;

  user_uid?: string;
  isHost?: boolean;

  currentState?: GameState;
  prevState?: GameState;

  constructor(public gameRef: DatabaseReference) {
    super();
    this.unsubscribeDb = onChildAdded(gameRef, (s) => {
      this.prevState = this.currentState;
      const data = s.val();
      const patch = JSON.parse(data.patch);
      if (patch === "reset") {
        this.currentState = JSON.parse(data.value);
      } else {
        this.currentState = applyPatch(this.currentState, patch);
      }
    });
  }

  init(players: {
    [p in PlayerID]?: { userUid: string; userName: string };
  }): this {
    onValue(this.gameRef, (snapshot) => {
      if (!snapshot.exists()) {
        const state = initializeState(players);
        this.pushNextState(state);
      }
    });
    return this;
  }

  start() {
    this.intervalId = window.setInterval(() => {
      if (this.isHost) {
        const nextState = this.exec();
        if (nextState) this.pushNextState(nextState);
      }
    }, 1000);
  }

  private exec(): GameState | undefined {
    if (!this.currentState) return;
    const state = clone(this.currentState);
    const { stepQueue, effectStack } = state;
    let newState = state;
    if (stepQueue.length) {
      const data = stepQueue.shift()!;
      newState = steps[data.name](state, data.payload);
    } else if (effectStack.length) {
      const data = effectStack.pop()!;
      if (!data.cancelled) {
        newState.stepQueue.unshift(
          ...data.resolve.map((stepData) => ({
            ...stepData,
            payload: { ...data.payload, ...stepData.payload },
          }))
        );
      }
    }
    return newState;
  }

  private pushNextState(state: GameState): void {
    const patch = createPatch(this.currentState, state);
    if (patch !== "none") {
      const data = {
        timestamp: serverTimestamp(),
        patch: JSON.stringify(patch),
        value: patch === "reset" ? JSON.stringify(state) : null,
      };
      push(this.gameRef, data);
    }
  }

  destroy() {
    this.unsubscribeDb();
    window.clearInterval(this.intervalId);
    super.destroy();
  }
}
