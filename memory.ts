export const FLAGS_ADDR = 0;
export const PC_ADDR = 1;
export const SP_ADDR = 3;
export const CSP_ADDR = 4;
export const STACK_ADDR = 0x100;
export const CSTACK_ADDR = 0x200;

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

  set flags(value: Uint8) {
    this.setUint8(FLAGS_ADDR, value);
  }

  getFlag(n: number) {
    (this.flags >> n) & 1;
  }

  setFlag(n: number) {
    this.flags |= 1 << n;
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

  peek(offset: number = 0): Uint16 {
    return this.getUint16(STACK_ADDR + (this.sp - 1 - offset) * 2);
  }

  get csp(): Uint8 {
    return this.getUint8(CSP_ADDR);
  }

  set csp(value: Uint8) {
    this.setUint8(CSP_ADDR, value);
  }

  pushPc(newPc: Uint16) {
    // TODO: max assertion
    this.setUint16(CSTACK_ADDR + this.csp++ * 2, this.pc);
    this.pc = newPc;
  }

  popPc(): void {
    // TODO: max assertion
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
    const value = this.getUint16(this.pc);
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

  getCallStackAsArray(): number[] {
    let array = [];
    for (let i = 0; i < this.csp; i++) {
      array.push(this.getUint16(CSTACK_ADDR + i * 2));
    }
    return array;
  }
}
