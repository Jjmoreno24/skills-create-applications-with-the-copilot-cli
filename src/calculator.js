#!/usr/bin/env node
/**
 * Node.js CLI Calculator
 * Supported operations:
 *  - addition (add, +)
 *  - subtraction (subtract, -, sub)
 *  - multiplication (multiply, *, mul)
 *  - division (divide, /)
 *
 * Usage:
 *   node src/calculator.js add 2 3
 *   node src/calculator.js + 4 5
 *   node src/calculator.js divide 10 2
 *
 * Exits with non-zero status on error (invalid args, division by zero).
 */

function printHelp() {
  console.log(`Usage: node src/calculator.js <operation> <a> <b>

Operations:
  add, +         Addition (a + b)
  subtract, -, sub  Subtraction (a - b)
  multiply, *, mul  Multiplication (a * b)
  divide, /      Division (a / b)

Examples:
  node src/calculator.js add 2 3       # => 5
  node src/calculator.js * 4 2         # => 8
  node src/calculator.js divide 5 0    # => error: division by zero
`);
}

function exitError(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function parseNumber(input) {
  const n = Number(input);
  if (!isFinite(n)) return null;
  return n;
}

function compute(op, a, b) {
  switch (op) {
    case 'add':
    case '+':
      return a + b;
    case 'subtract':
    case '-':
    case 'sub':
      return a - b;
    case 'multiply':
    case '*':
    case 'mul':
      return a * b;
    case 'divide':
    case '/':
      if (b === 0) return { error: 'division by zero' };
      return a / b;
    default:
      return { error: `unsupported operation '${op}'` };
  }
}

// Main
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (argv.length < 3) {
  exitError('insufficient arguments. See --help for usage.');
}

const [op, aRaw, bRaw] = argv;
const a = parseNumber(aRaw);
const b = parseNumber(bRaw);
if (a === null) exitError(`invalid number: ${aRaw}`);
if (b === null) exitError(`invalid number: ${bRaw}`);

const result = compute(op.toLowerCase(), a, b);
if (result && typeof result === 'object' && result.error) {
  exitError(result.error);
}

// Print result with minimal formatting (preserve floats)
console.log(result);
process.exit(0);
