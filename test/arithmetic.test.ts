import { OP } from "../machine";
import { assertOutput } from "../test-helpers";

assertOutput([OP.CONST8, 10, OP.INC], [11]);
assertOutput([OP.CONST16, 0, 10, OP.INC], [11]);
assertOutput([OP.CONST8, 10, OP.DEC], [9]);
assertOutput([OP.CONST16, 0, 10, OP.DEC], [9]);

assertOutput([OP.CONST8, 13, OP.CONST8, 17, OP.MUL], [221]);
assertOutput([OP.CONST8, 240, OP.CONST8, 12, OP.DIV], [20]);
assertOutput([OP.CONST8, 15, OP.CONST8, 12, OP.MOD], [3]);
assertOutput([OP.CONST8, 10, OP.CONST8, 6, OP.SUB], [4]);
assertOutput([OP.CONST8, 16, OP.CONST8, 24, OP.ADD], [40]);
