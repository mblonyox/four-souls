import { createPatch } from "symmetry/dist";
var a = { x: 3, y: 5, z: 1 };
var b = { x: 3, y: 5, z: 1 };
console.log(createPatch(a, b))