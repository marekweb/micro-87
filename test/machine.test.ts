import tap from "tap";
import { StackMachine } from "../machine";
import { OP } from "../machine";
import { STACK_ADDR } from "../memory";

tap.test("execute basic instructions", (t) => {
  const buffer = new ArrayBuffer(1024);
  const bufferArray = new Uint8Array(buffer);
  const machine = new StackMachine(buffer);

  bufferArray.set(
    [OP.CONST8, 4, OP.CONST8, 6, OP.MUL, OP.CONST8, 2, OP.DIV, OP.HALT],
    10
  );
  machine.mem.pc = 10;

  machine.executeInstruction();

  t.same(machine.mem.pc, 12);
  t.same(machine.mem.getStackAsArray(), [4]);

  machine.executeInstruction();

  t.same(machine.mem.pc, 14);
  t.same(machine.mem.getStackAsArray(), [4, 6]);

  machine.executeInstruction();

  t.same(machine.mem.pc, 15);
  t.same(machine.mem.getStackAsArray(), [24]);
  t.same(machine.mem.getUint16(STACK_ADDR), 24);

  machine.executeInstruction();

  t.same(machine.mem.pc, 17);
  t.same(machine.mem.getStackAsArray(), [24, 2]);

  machine.executeInstruction();

  t.same(machine.mem.pc, 18);
  t.same(machine.mem.getStackAsArray(), [12]);

  t.end();
});
