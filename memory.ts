const FLAGS_ADDR = 0;
const PC_ADDR = 1;
const SP_ADDR = 3;
const CSP_ADDR = 4;
const STACK_ADDR = 6;
const CSTACK_ADDR = STACK_ADDR + 256;

/**
 * Unsigned byte
 */
export type Uint8 = number;

/**
 * Signed byte
 */
export type Int8 = number;

/**
 * Unsigned 16-bit integer
 */
export type Uint16 = number;

/**
 * Signed 16-bit integer
 */
export type Int16 = number;

export class Memory extends DataView {
  constructor(buffer: ArrayBuffer) {
    super(buffer);
  }

  get flags(): Uint8 {
    return this.getUint8(FLAGS_ADDR);
  }

  get pc(): Uint16 {
    return this.getUint16(PC_ADDR);
  }

  set pc(value: Uint16) {
    this.setUint16(PC_ADDR, value);
  }

  get sp(): Uint8 {
    return this.getUint8(SP_ADDR);
  }

  set sp(value: Uint8) {
    this.setUint8(SP_ADDR, value);
  }

  get tos(): Uint16 {
    return this.getUint16(STACK_ADDR + (this.sp - 1) * 2);
  }

  get csp(): Uint8 {
    return this.getUint8(CSP_ADDR);
  }

  set csp(value: Uint8) {
    this.setUint8(CSP_ADDR, value);
  }

  pushC() {
    this.setUint16(CSTACK_ADDR + this.csp++ * 2, this.pc);
  }

  popC(): void {
    this.pc = this.getUint16(CSTACK_ADDR + --this.csp * 2);
  }

  push(value: Uint16) {
    this.setUint16(STACK_ADDR + this.sp++ * 2, value);
  }

  pop(): Uint16 {
    return this.getUint16(STACK_ADDR + --this.sp * 2);
  }

  readNextUint8(): Uint8 {
    return this.getUint8(this.pc++);
  }

  readNextUint16(): Uint16 {
    const value = this.getUint16((this.pc += 2));
    this.pc += 2;
    return value;
  }

  readNextInt8(): Int8 {
    return this.getInt8(this.pc++);
  }

  readNextInt16(): Int16 {
    const value = this.getInt16(this.pc);
    this.pc += 2;
    return value;
  }

  getStackAsArray(): number[] {
    let array = [];
    for (let i = 0; i < this.sp; i++) {
      array.push(this.getUint16(STACK_ADDR + i * 2));
    }
    return array;
  }

  getDebugState() {
    return {
      pc: this.pc,
      sp: this.sp,
      stack: this.getStackAsArray(),
      tos: this.tos,
      op: this.getUint8(this.pc),
    };
  }
}
