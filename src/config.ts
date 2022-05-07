import { Types, Scale, AUTO } from "phaser"
// import MenuScene from "./scenes/menu";
import TableScene from "./scenes/table";

export const VIEW_WIDTH = 1920;
export const VIEW_HEIGHT = 1080;

const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT
  },
  scene: [TableScene]
};

export default gameConfig;