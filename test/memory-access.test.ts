import tap from "tap";
import { OP } from "../machine";
import { createTestMachine } from "../test-helpers";

tap.test("save8 instruction", (t) => {
  const { machine, bufferArray } = createTestMachine();
  t.same(machine.mem.getUint8(123), 0);
  bufferArray.set([OP.CONST8, 37, OP.CONST8, 123, OP.SAVE8, OP.HALT], 10);
  machine.mem.pc = 10;
  machine.runUntilHalt();
  t.same(machine.mem.getStackAsArray(), []);
  t.same(machine.mem.getUint8(123), 37);
  t.end();
});

tap.test("load8 instruction", (t) => {
  const { machine, bufferArray } = createTestMachine();
  machine.mem.setUint8(123, 37);
  bufferArray.set([OP.CONST8, 123, OP.LOAD8, OP.HALT], 10);
  machine.runUntilHalt(10);
  t.same(machine.mem.getStackAsArray(), [37]);
  t.same(machine.mem.getUint8(123), 37);
  t.end();
});

tap.test("save8 then load8", (t) => {
  const { machine, bufferArray } = createTestMachine();
  bufferArray.set([OP.CONST8, 37, OP.CONST8, 123, OP.SAVE8, OP.HALT], 10);
  machine.mem.pc = 10;
  machine.runUntilHalt();
  t.same(machine.mem.getStackAsArray(), []);
  t.same(machine.mem.getUint8(123), 37);
  t.end();
});
