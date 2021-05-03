import { Memory, Uint8 } from "./memory";

export enum OP {
  HALT,

  DROP,
  DUP,
  SWAP,
  OVER,

  CONST8,
  CONST16,

  LOAD8,
  SAVE8,
  LOAD16,
  SAVE16,

  ADD,
  SUB,
  MUL,
  DIV,
  MOD,

  INC,
  DEC,

  EQ,
  NEQ,
  GT,
  GTE,
  LT,
  LTE,

  JUMP,
  JUMP_R,
  JUMP_D,
  BRANCH,

  CALL,
  CALL_D,
  RET,

  OUTPUT,
}

interface Device {
  write(value: Uint8): void;
}

export class StackMachine {
  mem: Memory;
  running = false;
  device?: Device;

  constructor(buffer: ArrayBuffer) {
    this.mem = new Memory(buffer);
  }

  executeInstruction() {
    const op = this.mem.readNextInt8();

    switch (op) {
      case OP.HALT: {
        this.halt();
        break;
      }

      case OP.DROP: {
        // ( x -- )
        this.mem.pop();
        break;
      }

      // Shuffle operators
      case OP.DUP: {
        // ( x -- x x )
        const x = this.mem.peek();
        this.mem.push(x);
        break;
      }

      case OP.SWAP: {
        // ( x y -- y x)
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(y);
        this.mem.push(x);
        break;
      }

      case OP.OVER: {
        // ( x y  -- x y x )
        const x = this.mem.peek(1);
        this.mem.push(x);
        break;
      }

      // Arithmetic operators

      case OP.ADD: {
        // ( x y -- x+y )
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(x + y);
        break;
      }

      case OP.SUB: {
        // ( x y -- x-y )
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(x - y);
        break;
      }

      case OP.MUL: {
        // ( x y -- x*y)
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(x * y);
        break;
      }

      case OP.DIV: {
        // Integer division
        // ( x y -- x/y)
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(Math.floor(x / y));
        break;
      }

      case OP.MOD: {
        // Modulo
        const y = this.mem.pop();
        const x = this.mem.pop();
        this.mem.push(x % y);
        break;
      }

      case OP.INC: {
        // ( x -- x+1 )
        const x = this.mem.pop();
        this.mem.push(x + 1);
        break;
      }

      case OP.DEC: {
        // ( x -- X-1 )
        const x = this.mem.pop();
        this.mem.push(x - 1);
        break;
      }

      // Constants
      case OP.CONST8: {
        const value = this.mem.readNextUint8();
        this.mem.push(value);
        break;
      }

      case OP.CONST16: {
        const value = this.mem.readNextUint16();
        this.mem.push(value);
        break;
      }

      // Memory load/save
      case OP.LOAD8: {
        // ( addr -- [addr])
        const addr = this.mem.pop();
        const value = this.mem.getUint8(addr);
        this.mem.push(value);
        break;
      }

      case OP.SAVE8: {
        // ( value addr -- ) writing value to addr
        const addr = this.mem.pop();
        const value = this.mem.pop();
        this.mem.setUint8(addr, value);
        break;
      }

      case OP.LOAD16: {
        // ( addr -- [addr])
        const addr = this.mem.pop();
        const value = this.mem.getUint16(addr);
        this.mem.push(value);
        break;
      }

      // Jump and branch

      case OP.JUMP: {
        // Jump to immediate absolute address
        const addr = this.mem.readNextUint16();
        this.mem.pc = addr;
        break;
      }

      case OP.JUMP_R: {
        // Jump to immediate relative address
        const addr = this.mem.readNextInt8();
        this.mem.pc += addr;
        break;
      }

      case OP.JUMP_D: {
        // Jump to absolute address from stack (dynamic)
        const addr = this.mem.pop();
        this.mem.pc = addr;
        return;
      }

      case OP.BRANCH: {
        // Branch if TOS is non-zero, to immediate relative address
        const addr = this.mem.readNextInt8();
        if (!this.mem.pop()) {
          this.mem.pc += addr;
        }
        break;
      }

      // Subroutine calls
      case OP.CALL: {
        const addr = this.mem.readNextUint16();
        this.mem.pushPc(addr);
        break;
      }

      case OP.CALL_D: {
        // Jump to absolute address from stack (dynamic)
        const addr = this.mem.pop();
        this.mem.pushPc(addr);
        break;
      }

      case OP.RET: {
        this.mem.popPc();
        break;
      }

      // I/O
      case OP.OUTPUT: {
        if (this.device) {
          const value = this.mem.pop() & 0xff;
          this.device.write(value);
        }
      }
    }
  }

  runUntilHalt(pc?: number) {
    if (pc !== undefined) {
      this.mem.pc = pc;
    }

    this.running = true;
    while (this.running) {
      this.executeInstruction();
    }
  }

  halt() {
    this.running = false;
  }
}
