import tap from "tap";
import { Memory } from "../memory";

const buffer = new ArrayBuffer(1024);
const mem = new Memory(buffer);

tap.same(mem.getStackAsArray(), []);

mem.push(1);

tap.same(mem.getStackAsArray(), [1]);

tap.same(mem.pc, 0);
tap.same(mem.csp, 0);
tap.same(mem.sp, 1);

mem.push(129);
mem.push(325);

tap.same(mem.getStackAsArray(), [1, 129, 325]);

const popped = mem.pop();
tap.equal(popped, 325);
tap.same(mem.getStackAsArray(), [1, 129]);

mem.push(70000);
tap.same(mem.peek(), 4464);
