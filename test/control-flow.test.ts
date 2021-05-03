import tap from "tap";
import { OP } from "../machine";
import { createTestMachine } from "../test-helpers";

tap.test("jump instruction", (t) => {
  const { machine, bufferArray } = createTestMachine();
  bufferArray.set([OP.JUMP, 0, 50], 10);
  bufferArray.set([OP.HALT], 50);
  machine.runUntilHalt(10);
  t.same(machine.mem.getStackAsArray(), []);
  t.same(machine.mem.pc, 51);
  t.end();
});

tap.test("call instruction", (t) => {
  const { machine, bufferArray } = createTestMachine();
  bufferArray.set([OP.CALL, 0, 50], 10);
  bufferArray.set([OP.HALT], 50);
  machine.runUntilHalt(10);
  t.same(machine.mem.getStackAsArray(), []);
  t.same(machine.mem.getCallStackAsArray(), [13]);
  t.same(machine.mem.pc, 51);
  t.end();
});

tap.test("call and return", (t) => {
  const { machine, bufferArray } = createTestMachine();
  bufferArray.set([OP.CALL, 0, 50, OP.HALT], 10);
  bufferArray.set([OP.RET], 50);
  machine.runUntilHalt(10);
  t.same(machine.mem.getStackAsArray(), []);
  t.same(machine.mem.getCallStackAsArray(), []);
  t.same(machine.mem.pc, 14);
  t.end();
});
