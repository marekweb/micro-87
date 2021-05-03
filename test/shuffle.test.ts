import { OP } from "../machine";
import { assertOutput } from "../test-helpers";

assertOutput([OP.CONST8, 7, OP.CONST8, 13, OP.SWAP], [13, 7]);
assertOutput([OP.CONST8, 10, OP.DUP], [10, 10]);
assertOutput([OP.CONST8, 3, OP.CONST8, 4, OP.OVER], [3, 4, 3]);
assertOutput([OP.CONST8, 10, OP.DROP], []);
