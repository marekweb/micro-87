import tap from "tap";
import { StackMachine, OP } from "./machine";

export function createTestMachine() {
  const buffer = new ArrayBuffer(1024);
  const bufferArray = new Uint8Array(buffer);
  const machine = new StackMachine(buffer);
  return { machine, buffer, bufferArray };
}

export function assertOutput(instructions: OP[], expectedOutput: number[]) {
  const { machine, bufferArray } = createTestMachine();
  bufferArray.set([...instructions, OP.HALT], 10);
  machine.runUntilHalt(10);
  tap.same(machine.mem.getStackAsArray(), expectedOutput);
}
