import { Chance } from "chance";
import { signInAnonymously } from "firebase/auth";
import { child, onValue, ref, set } from "firebase/database";
import { Game } from "phaser";
import gameConfig from "./config";
import { auth, db } from "./firebase";

const game = new Game(gameConfig);

signInAnonymously(auth).then((cred) => {
  game.registry.set("user_uid", cred.user.uid);
  const userRef = ref(db, "/users/" + cred.user.uid);
  onValue(child(userRef, "name"), (snapshot) => {
    let userName = snapshot.val();
    if (!userName) {
      const chance = new Chance();
      userName = `${chance.animal()}#${chance.integer({
        min: 1000,
        max: 9999,
      })}`;
      set(snapshot.ref, userName);
    }
    game.registry.set("user_name", userName);
  });
});
