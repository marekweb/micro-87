import tap from "tap";
import { OP } from "../machine";
import { Uint8 } from "../memory";
import { createTestMachine } from "../test-helpers";

class TestDevice {
  public output: number[] = [];
  write(s: Uint8) {
    this.output.push(s);
  }
}

tap.test("output instruction", (t) => {
  const { machine, bufferArray } = createTestMachine();
  const testDevice = new TestDevice();
  machine.device = testDevice;
  bufferArray.set([OP.CONST8, 255, OP.OUTPUT, OP.HALT], 10);
  machine.runUntilHalt(10);
  t.same(machine.mem.getStackAsArray(), []);
  t.same(testDevice.output, [255]);
  t.end();
});
